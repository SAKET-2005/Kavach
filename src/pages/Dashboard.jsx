import { useNavigate } from 'react-router-dom';
import useKavachStore from '../store/useKavachStore';
import ShieldCard from '../components/ShieldCard';
import KavachScore from '../components/KavachScore';
import ForecastRow from '../components/ForecastRow';
import EarningsCalendar from '../components/EarningsCalendar';
import PayoutList from '../components/PayoutList';

export default function Dashboard() {
  const { worker, payouts, forecast, earnings } = useKavachStore();
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Kavach
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification bell */}
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                position: 'relative',
                padding: '4px',
              }}
            >
              🔔
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  background: 'var(--red)',
                  borderRadius: '50%',
                }}
              />
            </button>

            {/* Avatar */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--text-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {worker.initial}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Shield Card */}
        <div className="fade-in-up">
          <ShieldCard worker={worker} />
        </div>

        {/* Score + Forecast Row */}
        <div className="grid-2 fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Kavach Score Widget */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <KavachScore
              score={worker.kavachScore}
              size={160}
              strokeWidth={10}
            />
            <p className="text-muted" style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px' }}>
              Red Alert forecast Thursday — consider upgrading
            </p>
          </div>

          {/* Forecast */}
          <ForecastRow forecast={forecast} />
        </div>

        {/* Earnings Calendar */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <EarningsCalendar earnings={earnings} />
        </div>

        {/* Recent Payouts */}
        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <PayoutList payouts={payouts} />
        </div>

        {/* Footer link to admin */}
        <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Admin Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
