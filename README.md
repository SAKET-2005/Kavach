# 🛡️ Kavach

> Parametric income insurance for Zomato & Swiggy delivery partners. When it rains, they get paid — automatically.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Guidewire DEVTrails 2026](https://img.shields.io/badge/Guidewire-DEVTrails%202026-003057?style=flat-square)

---

## The problem

Ravi delivers for Swiggy in Chennai. On a bad monsoon day, Swiggy suspends deliveries. He earns ₹0. No insurance covers this. No one even acknowledges it's a problem.

This happens to 800,000+ food delivery workers across India. They lose 20–30% of their monthly income to weather and disruptions they have zero control over. There's no safety net, no claim process, and no product built for them.

---

## What we built

Kavach lets delivery partners buy a weekly policy starting at ₹29/week. A Node.js cron job polls weather APIs every 15 minutes. When a threshold is crossed, claims fire automatically and money hits their UPI. No forms, no calls, no waiting.

```
Policy active → threshold crossed → fraud check → UPI payout
```

Ravi doesn't do anything. The money just arrives.

---

## Weekly pricing

We price weekly because gig workers earn and think week to week. A monthly premium is a cash flow barrier. ₹49 this Sunday isn't.

Coverage cap is tied to declared weekly earnings — 60% of what the worker actually earns — not a flat number. A worker earning ₹7,000/week and one earning ₹3,000/week shouldn't have the same ceiling.

| Tier | Weekly Premium | Max Payout |
|------|---------------|------------|
| Basic | ₹29 | 60% of earnings, up to ₹1,500 |
| Standard | ₹49 | 60% of earnings, up to ₹3,000 |
| Pro | ₹79 | 60% of earnings, up to ₹5,000 |

Premium isn't flat — it adjusts every week. Workers see exactly why before they pay:

```
Base:              ₹49
Forecast risk:     +₹12  (Red Alert expected Thu–Fri)
Zone risk:         +₹8   (Adyar — coastal flood zone)
No-claim streak:   −₹4   (3 weeks clean 🔥)
──────────────────────────
This week:         ₹65
```

Factors: pin-code level zone risk, monsoon season surcharge, no-claim streak discount, and declared active hours. No black box — every rupee is explained.

---

## Triggers

A `node-cron` job runs every 15 minutes, polls the APIs, and fires claims automatically when a threshold is crossed. Here's each trigger and why the threshold is what it is.

---

### T1 — Heavy Rainfall 🌧️

**Threshold:** Rainfall > 65mm/24hr or an active IMD Red Alert.

65mm is IMD's official "Heavy Rain" classification — the same number Zomato and Swiggy use internally to decide when to suspend deliveries. We matched the platform threshold intentionally so the trigger fires exactly when workers actually lose income.

```js
const rain1h = data.rain?.["1h"] ?? 0;
const rain3h = data.rain?.["3h"] ?? 0;
// 8mm/hr sustained ≈ 65mm/day
const triggered = rain1h > 8 || rain3h > 25;
```

**Payout:** 80%, prorated by disrupted hours. If Swiggy suspends for 4 hours and the worker earns ₹900 across a 9-hour day — they receive ₹320 for those lost hours.

**Fraud check:** Worker GPS must be inside the affected city zone at trigger time.

---

### T2 — Extreme Heat 🌡️

**Threshold:** Temp > 43°C AND humidity > 65%, sustained for 3+ consecutive hours.

NDMA defines heatwave at 40°C but platforms don't suspend at 40°C — workers push through. At 43°C with 65%+ humidity the heat index crosses 55°C. That's when outdoor physical work becomes genuinely dangerous and order volumes collapse. The humidity condition matters — dry heat is survivable, humid heat isn't.

```js
if (temp > 43 && humidity > 65) heatStreak[city]++;
else heatStreak[city] = 0;
// 12 polls × 15 min = 3 hours sustained
const triggered = heatStreak[city] >= 12;
```

**Payout:** 65% — heat doesn't cause full platform suspension so we compensate for partial loss only.

**Fraud check:** Activity check — 5+ completed deliveries in the last hour means the worker was clearly operating fine.

---

### T3 — Cyclone / Flood 🌀

**Threshold:** Any official cyclone or flood warning issued by IMD for the worker's district.

Cyclones don't slow things down — they shut everything off for 2–3 days straight. Workers lose more income in one cyclone event than in weeks of scattered rain. IMD doesn't have a clean free JSON API so Phase 1 uses an admin-maintained mock alert feed. Phase 2 plan is to scrape `mausam.imd.gov.in` or integrate a paid alerting service.

```js
// Fire if worker's registered district matches the alert
const triggered = alert.districts.includes(worker.city);
```

**Payout:** 95% — the highest. When a cyclone lands there's nothing to debate. The 5% retained covers operational costs.

**Fraud check:** Cyclone alerts are publicly reported everywhere. Claims almost always score under 15.

---

### T4 — Severe AQI 😷

**Threshold:** AQI > 400 (Severe) for 4+ continuous hours.

Built for Delhi NCR winters. Above 400, state governments issue outdoor restriction orders and platforms reduce operations. We require 4 continuous hours — not a single spike — because 4 hours covers either a full lunch or dinner peak slot, which is where most of a day's earnings come from.

```js
// AQICN API — free with token
if (data.data.aqi > 400) aqiStreak[city]++;
else aqiStreak[city] = 0;
// 16 polls × 15 min = 4 hours
const triggered = aqiStreak[city] >= 16;
```

**Payout:** 60% — AQI doesn't force a hard shutdown. Some workers still go out. The lower rate reflects partial voluntary reduction, not forced suspension.

**Fraud check:** Activity check — 8+ deliveries in the last 2 hours means they weren't impacted.

---

### T5 — Curfew / Strike / Platform Suspension 🚫

**Threshold:** Government curfew in the worker's zone or platform suspending operations there.

The hardest to automate — no clean API exists for "local strike happening right now." Phase 1 is admin-activated via the dashboard. We're upfront about this limitation. Phase 2 explores news API and social listening integration.

```js
// Admin activates via dashboard for specific city + zones
POST /admin/trigger/manual
{ "type": "CURFEW", "city": "Chennai", "zones": ["Zone 4", "Zone 7"] }
```

**Payout:** 75% — curfews are zone-specific and time-limited so not every worker is equally affected.

**Fraud check:** GPS zone match is the primary signal here. A worker registered in Adyar can't claim a curfew imposed in Anna Nagar.

---

### After any trigger fires

```
Threshold crossed
      ↓
Fetch all active policies in affected zone
      ↓
Fraud engine scores each claim
      ↓
Score < 30  → auto approve → Razorpay UPI payout → WhatsApp notification
Score 30–70 → 2-hour soft hold → one verification step sent via WhatsApp
Score > 70  → auto reject → reason logged → worker notified
      ↓
Everything written to claims table — full audit trail, no silent decisions
```

---

## Fraud detection

Rule-based scoring from 0–100. Every signal is logged with a reason code so no decision is a black box.

| Signal | Score Added |
|--------|------------|
| GPS zone mismatch | +40 |
| Active deliveries during trigger | +25 |
| Duplicate claim same day | +50 |
| More than 3 claims in 30 days | +20 |
| Account age under 7 days | +15 |

**Peer validation:** If fewer than 20% of active workers in a city show GPS inactivity during a claimed disruption, all claims from that city are flagged. A real disruption affects most workers in a zone — not a select few.

---

## Adversarial Defense & Anti-Spoofing Strategy

A coordinated syndicate of 500 workers was caught using GPS spoofing apps to fake their location inside a Red Alert zone while sitting at home, draining the claims pool in minutes. Simple GPS verification is dead. Here's how Kavach responds.

**The core principle:** Faking one signal is easy. Faking ten correlated signals simultaneously across 500 devices is not.

---

**Layer 1 — Device behaviour fingerprinting**

A real stranded worker looks different from someone idle at home. We collect these via standard PWA browser APIs — no invasive permissions needed, workers consent at onboarding:

- `navigator.connection.type` — home WiFi during a claimed field disruption is an immediate flag
- `navigator.getBattery()` — battery charging and stable means the phone is sitting on a table
- `devicemotion` accelerometer — perfectly stationary for 45+ minutes is not a delivery worker
- App session history — was Kavach or the delivery app actively open before the trigger fired?
- Last order timestamp — zero delivery activity in the 2 hours before a "disruption" is suspicious

---

**Layer 2 — Claim velocity spike detection**

500 people coordinating via Telegram all act at the same time. That pattern is visible in the data.

```
Normal disruption:   2:15 → 12 claims,  2:30 → 34,  2:45 → 67  (gradual curve)
Syndicate attack:    2:15 → 287 claims, 2:30 → 194, 2:45 → 11  (unnatural spike)
```

When claim velocity exceeds 3x the historical average for a city in a 15-minute window, all incoming claims shift to review mode automatically. Workers already approved are unaffected — only the incoming wave is held.

---

**Layer 3 — Platform activity cross-check**

Syndicate members sitting at home have no delivery trail. Real workers do. At onboarding, workers link their Zomato/Swiggy account ID. When a claim fires, the system checks whether they accepted orders that morning, whether their delivery app was active in the 2 hours before the trigger, and whether their platform account shows them online in the affected zone. Someone genuinely caught in a rainstorm was working before it hit. Phase 1 simulates this with mock data — Phase 2 integrates via platform API.

---

**Layer 4 — The AMBER tier (honest workers don't get punished)**

Three tiers instead of binary approve/reject:

```
GREEN  Score < 30   → instant auto-approve, payout in minutes
AMBER  Score 30–60  → 2-hour soft hold, one verification step
RED    Score > 60   → manual review queue
```

AMBER workers get one WhatsApp message: *"We're processing your claim. Quick check — can you share a 10-second video of your surroundings? Heavy rain showing at your location."*

A worker genuinely stuck in a storm has this in 30 seconds. A syndicate member on their couch in sunshine cannot. No response in 2 hours moves the claim to manual review. Genuine network drop during the storm gets a one-tap appeal, reviewed within 24 hours — honest workers are always made whole.

---

**Layer 5 — Syndicate network graph**

Fraud rings leave a graph signature. The same workers claim together repeatedly, registered around the same time, often from the same referral link. The admin dashboard maps workers as nodes and connects workers who claimed in the same trigger event. A real disruption creates a sparse graph of hundreds of unconnected workers. A syndicate creates a dense cluster of the same 30–50 accounts appearing together event after event. After two or three events, the cluster is visible and flagged for enhanced verification permanently.

---

## How Kavach stays solvent

The obvious question — what happens when the whole city claims at once?

**Forecast-based repricing** means we raise premiums before the Red Alert hits, not after. OpenWeatherMap's 5-day forecast gives us the window to reprice new policies before the event. Workers who bought before the surcharge are honoured at the old price — new purchases after the forecast get the higher rate.

**City-level claims pool** caps total payouts at 70% of premiums collected per city per week. If the pool exhausts, remaining approved claims are prorated. Workers know this upfront — it's in the policy terms. This is the same mechanism PMFBY uses for crop insurance.

**Reinsurance** handles catastrophic tail risk. Any week where loss ratio exceeds 70%, the excess transfers to a reinsurer. Kavach doesn't carry the full exposure of a cyclone week alone.

The admin dashboard forecasts next week's predicted loss ratio from the weather forecast so none of this is ever a surprise:

```
Next 7 days — Chennai:
  Red Alert days expected:   3
  Predicted claims:          ₹94,000
  Predicted loss ratio:      79%  ⚠️
  Recommended action:        Raise new policy premiums 15% from tomorrow
```

---

## Extra features

**Kavach Score** — a single 0–100 number on the worker's dashboard showing their current disruption exposure based on live forecast, zone risk, and active policy tier. If a bad week is coming and they're on Basic Shield, it tells them.

**Missed protection alert** — when a trigger fires and a worker has no active policy, they get a WhatsApp message: *"340 workers in Chennai just received payouts. You would have received ₹680 this afternoon. Next week's policy costs ₹49 → [Activate]."*

**Earnings calendar** — a monthly calendar showing green days (worked normally), red days (disruption, no coverage), blue days (disruption, Kavach paid). After three months, a worker can see exactly how much Kavach has protected. That number is the best retention tool we have.

**Protection forecast** — the week ahead, day by day, with risk levels from the weather forecast. Workers can see Thursday looks bad before it happens and decide whether to upgrade their tier.

**Trigger audit log** — every trigger event logged with the exact measured API value and the threshold. Worker disputes a rejected claim? The admin pulls up: *"Rainfall was 58mm at 2:15 PM. Our threshold is 65mm. Trigger did not fire."* No ambiguity.

**Premium pool health monitor** — live loss ratio on the admin dashboard, 7-day forecast, and a reserve recommendation updated every 15 minutes alongside the cron job.

---

## What's not covered

No health insurance. No accident cover. No vehicle repair. Only lost income from external disruptions — that's the whole product and we're not expanding it.

---

## Stack

React 18 + Vite on the frontend, Tailwind CSS + shadcn/ui for components, Recharts for the admin analytics, Leaflet.js for the city risk heatmap. Node.js + Express on the backend with node-cron handling the trigger polling. Supabase for the database and phone OTP auth, Brain.js for the premium ML model, Razorpay test mode for UPI payouts. Deployed on Vercel (frontend) and Render (backend).

Built as a PWA — workers install it from their browser, no Play Store required. Service workers cache policy details and last payout for offline access.

---

## Running it locally

```bash
git clone https://github.com/YOUR_USERNAME/kavach.git
cd kavach

# backend
cd server && npm install && npm run dev

# frontend (new terminal)
cd client && npm install && npm run dev
```

Copy `.env.example` to `.env` in both folders. You'll need keys for Supabase, OpenWeatherMap, AQICN, and Razorpay test mode.

To simulate a disruption in dev:

```bash
curl -X POST http://localhost:5000/dev/simulate \
  -H "Content-Type: application/json" \
  -d '{"city": "chennai", "trigger": "RAINFALL", "value": 78}'
```

---

## Phase 2 — Automation & Protection

> Theme: *"Protect Your Worker"* | March 21 – April 4

Phase 2 moved Kavach from a planned architecture into a working, end-to-end automated system. Every component described in Phase 1 now runs live — real weather APIs, real ML models, real fraud scoring, real payout simulation.

---

### What shipped in Phase 2

**1. ML Microservice (Python FastAPI)**

A standalone Python service (`/ml_service`) replaces the Phase 1 rule-based premium stubs. It trains on startup using 5,000 synthetic Indian gig-worker records and serves six live endpoints:

```
POST /predict-premium   → dynamic weekly premium (live weather + trained model)
POST /fraud-score       → fraud score 0–100 with decision + signal breakdown
POST /kavach-score      → onboarding risk score using live conditions
GET  /conditions/{city} → current weather + AQI + active trigger status
POST /dev/simulate      → trigger a disruption for demo/testing
GET  /lookup-pincode/{n}→ India Post API lookup → area, district, zone, risk class
```

ML stack: `scikit-learn` GradientBoostingRegressor (premium) + RandomForestClassifier (fraud). Both models train in ~2–3 seconds on startup and fall back to a deterministic rule-based engine if training fails.

**2. Live Weather & AQI Integration**

OpenWeatherMap and AQICN are no longer mocked. `weather_service.py` and `aqi_service.py` poll real APIs with a 10-minute in-memory cache to respect free-tier rate limits. Premium calculations, fraud scoring, and the worker dashboard all receive live rainfall, temperature, humidity, and AQI data.

**3. Dynamic Premium — Live Pricing**

The `/predict-premium` endpoint incorporates:

- Live weather conditions at query time (rainfall, temp, humidity)
- Live AQI for the city
- Monthly season factor (June–August peaks at 1.20× for monsoon)
- City baseline risk (Chennai 0.90, Mumbai 0.85 … Bengaluru 0.45)
- Worker tenure, claims history, platform, and declared weekly earnings

Workers upgrading their tier in the dashboard see a live-fetched premium, not a static table number. The upgrade modal calls the ML service in real time before confirming.

**4. Pincode-Based Zone Classification**

Onboarding now calls the India Post API via `/lookup-pincode/{pincode}`. The worker's real area, district, and state are resolved automatically. The ML service classifies the location as Coastal / Inland, scores it against a curated list of coastal and flood-prone districts across 8 states, and surfaces a risk label (Low / Medium / High) that feeds into the premium and Kavach Score.

Fallback: if India Post API is unavailable, the first digit of the pincode routes to the correct postal region so onboarding never breaks.

**5. Firebase Phone OTP Auth**

Worker authentication now uses Firebase Phone Auth with invisible reCAPTCHA. The `usePhoneAuth` hook handles the full OTP flow. A dev-mode fallback accepts any 6-digit code on localhost so the flow can be tested without a Firebase Phone Auth plan.

**6. Worker Dashboard — Live Conditions**

The worker dashboard now polls `/conditions/{city}` on load. The live weather widget shows:
- Current rainfall (mm), temperature (°C), humidity (%)
- AQI value and category
- Active trigger alert if any threshold is currently crossed

The Kavach Score updates from the ML service using real weather at onboarding, not a static number.

**7. Claims Management — Zero-Touch Pipeline**

The automated claim pipeline is fully wired:

```
Threshold crossed (node-cron, every 15 min)
      ↓
/fraud-score called for each active policy in affected zone
      ↓
Score < 30  → AUTO_APPROVE → payout queued
Score 30–70 → REVIEW       → WhatsApp verification request
Score > 70  → AUTO_REJECT  → reason logged, worker notified
```

Fraud scoring now cross-checks the claimed trigger type against live weather at score time — a rainfall claim during current clear skies receives an automatic penalty regardless of other signals.

**8. Policy Management Page**

A dedicated `/policy` page shows workers their active coverage, what is and isn't covered, the full trigger list with thresholds, and the claims audit trail. Workers can upgrade their tier directly from this page with a live premium quote.

---

### Phase 2 stack additions

| Addition | Detail |
|----------|--------|
| Python FastAPI | ML microservice, replaces all mock ML endpoints |
| scikit-learn | GradientBoostingRegressor + RandomForestClassifier |
| Firebase Auth | Phone OTP with invisible reCAPTCHA |
| India Post API | Pincode → district → zone → risk classification |
| OpenWeatherMap (live) | Real rainfall, temp, humidity — 10-min cache |
| AQICN (live) | Real AQI — 10-min cache |
| react-hook-form | Onboarding form validation |
| React 19 | Upgraded from React 18 |

---

### Running Phase 2 locally

**Frontend**

```bash
cd client && npm install && npm run dev
```

**ML Microservice**

```bash
cd ml_service
pip install -r requirements.txt
cp .env.example .env   # add OPENWEATHER_API_KEY and AQICN_TOKEN
uvicorn main:app --reload --port 8000
```

Required env keys for the ML service:

```
OPENWEATHER_API_KEY=...
AQICN_TOKEN=...
SUPABASE_URL=...       # optional — for claim velocity checks
SUPABASE_KEY=...       # optional
```

If Supabase keys are absent, the fraud engine skips the claim velocity check and uses live weather signals only.

**Simulate a disruption**

```bash
curl -X POST http://localhost:8000/dev/simulate \
  -H "Content-Type: application/json" \
  -d '{"city": "chennai", "trigger": "RAINFALL", "value": 78}'
```

Returns the fraud decision, signals, and simulated payout amount.

---

### Phase 2 deliverable checklist

| Requirement | Status |
|-------------|--------|
| Registration process with phone OTP | ✅ Firebase Auth |
| Insurance policy management | ✅ PolicyPage + tier upgrade flow |
| Dynamic premium calculation | ✅ FastAPI + GBR + live weather |
| Claims management (zero-touch) | ✅ Fraud engine + auto decision |
| 3–5 automated triggers via APIs | ✅ Rainfall, Heat, AQI (live); Flood, Curfew (mock feed) |
| AI/ML integration | ✅ GradientBoostingRegressor + RandomForestClassifier |
| 2-minute demo video | ✅ Uploaded |

---

### What Phase 3 will add

- Advanced fraud detection: GPS spoofing detection, syndicate graph flagging
- Razorpay full integration: instant UPI payout on auto-approve
- Supabase Realtime: live dashboard updates without polling
- Twilio WhatsApp sandbox: missed-protection alerts + AMBER verification
- 5-minute final demo video + pitch deck PDF



---
### Try it for Yourself
```
https://kavach1-0.vercel.app/
```


---
## Team

| Name | Role |
|------|------|
| [Nehal Kashyap] | Frontend |
| [Vansh Gajiwala] | Backend + APIs |
| [Pranav Pooviah] | AI / ML |
| [Saket Bedia] | AI / ML |

*Kavach (कवच) — Sanskrit for shield or armour.*

- Built for Guidewire DEVTrails 2026.
