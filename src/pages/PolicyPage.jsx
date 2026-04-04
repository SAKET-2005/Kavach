import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState('covered');
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <nav
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            ←
          </button>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            Policy Details
          </span>
        </div>
      </nav>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('covered')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 16px',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 600,
              color: activeTab === 'covered' ? 'var(--green-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'covered' ? '2px solid var(--green-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            What's Covered
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 16px',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 600,
              color: activeTab === 'terms' ? 'var(--green-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'terms' ? '2px solid var(--green-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'covered' ? <WhatsCoveredTab /> : <TermsTab />}
      </div>
    </div>
  );
}

function WhatsCoveredTab() {
  const coverages = [
    {
      icon: '🌧️',
      title: 'Heavy Rainfall',
      threshold: '>64.5mm rainfall in 1 hour (IMD Heavy Rain standard)',
      payout: '40% of daily earnings per disrupted hour',
      covers: 'Inability to complete deliveries due to dangerous rain conditions'
    },
    {
      icon: '🌡️',
      title: 'Extreme Heat',
      threshold: 'Temperature >42°C (IMD Heat Wave declaration)',
      payout: '30% of daily earnings per disrupted hour',
      covers: 'Outdoor work halt during officially declared heat wave conditions'
    },
    {
      icon: '💨',
      title: 'Severe Air Pollution',
      threshold: 'AQI >300 (CPCB Severe category)',
      payout: '25% of daily earnings per disrupted hour',
      covers: 'Hazardous air quality making outdoor delivery unsafe'
    },
    {
      icon: '🌊',
      title: 'Flood / Waterlogging',
      threshold: 'Rainfall >115.5mm in 1 hour (IMD Extremely Heavy Rain)',
      payout: '60% of daily earnings per disrupted hour',
      covers: 'Road flooding preventing delivery operations entirely'
    },
    {
      icon: '🚫',
      title: 'Civil Disruption / Curfew',
      threshold: 'Government-declared curfew or Section 144 in delivery zone',
      payout: '50% of daily earnings per disrupted hour',
      covers: 'Legally mandated inability to operate in affected zones'
    }
  ];

  const notCovered = [
    'Vehicle damage or repair costs',
    'Health or medical expenses',
    'Accidents or injuries',
    'Personal disputes with platforms',
    'App downtime or technical issues'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in-up">
      {coverages.map((c, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '32px' }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{c.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Threshold: </span> <span style={{ fontWeight: 600 }}>{c.threshold}</span>
              </div>
              <div style={{ background: 'var(--green-light)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payout: </span> <span style={{ fontWeight: 600, color: 'var(--green-primary)' }}>{c.payout}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Covers: </span> <span>{c.covers}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="card" style={{ marginTop: '8px', borderLeft: '4px solid var(--red)' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ NOT Covered
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notCovered.map((nc, i) => (
            <li key={i} style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>✗</span> {nc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}
      >
        {title}
        <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 20px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function TermsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="fade-in-up">
      <AccordionItem title="1. Eligibility Requirements">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Must be an active delivery partner on Zomato or Swiggy</li>
          <li>Valid Aadhaar-linked mobile number required</li>
          <li>Minimum 1 active delivery in the past 7 days to claim</li>
          <li>Policy is personal and non-transferable</li>
        </ul>
      </AccordionItem>
      <AccordionItem title="2. How Claims Work (Zero Touch)">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Claims are triggered automatically when parametric thresholds are met</li>
          <li>No manual filing required — system monitors weather/AQI in real time</li>
          <li>Payout is calculated as: (Weekly Earnings ÷ 56 working hours) × disrupted hours × payout %</li>
          <li>Fraud score must be below 30/100 for auto-approval</li>
          <li>Scores 30–70 go to admin review (resolved within 2 hours)</li>
          <li>Scores above 70 are auto-rejected with reason provided</li>
        </ul>
      </AccordionItem>
      <AccordionItem title="3. Policy Renewal">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Policy renews every Sunday at midnight automatically</li>
          <li>UPI AutoPay mandate handles weekly premium deduction</li>
          <li>Cancel anytime before Sunday to stop renewal</li>
          <li>No refund for partially used weeks</li>
        </ul>
      </AccordionItem>
      <AccordionItem title="4. Payout Limits">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>Basic Shield: max ₹1,500 per week</li>
          <li>Standard Shield: max ₹3,000 per week</li>
          <li>Pro Shield: max ₹5,000 per week</li>
          <li>Maximum 3 claims per policy week</li>
        </ul>
      </AccordionItem>
      <AccordionItem title="5. Fraud & Misuse">
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>GPS location is validated against claimed disruption zone</li>
          <li>Duplicate claims within 48 hours are auto-flagged</li>
          <li>False claims result in immediate policy cancellation</li>
          <li>Repeated fraud attempts are reported to the platform</li>
        </ul>
      </AccordionItem>
    </div>
  );
}
