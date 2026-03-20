import { useNavigate } from 'react-router-dom';
import useKavachStore from '../store/useKavachStore';
import StatCard from '../components/StatCard';
import VelocityChart from '../components/VelocityChart';
import RiskMap from '../components/RiskMap';
import ClaimsTable from '../components/ClaimsTable';
import PoolHealth from '../components/PoolHealth';

export default function AdminDashboard() {
  const { adminStats, velocityData, cities, claims, poolHealth } = useKavachStore();
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      {/* Top bar */}
      <nav
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(28,28,30,0.95)',
          backdropFilter: 'blur(12px)',
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
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Kavach
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              className="pill"
              style={{
                background: 'rgba(245,166,35,0.15)',
                color: 'var(--orange)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Admin
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              A
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 4 Stat Cards */}
        <div className="grid-4 fade-in-up">
          <StatCard
            label="Active Policies"
            value={adminStats.activePolicies}
            color="var(--green-primary)"
          />
          <StatCard
            label="Claims This Week"
            value={adminStats.claimsThisWeek}
            color="var(--orange)"
          />
          <StatCard
            label="Loss Ratio"
            value={adminStats.lossRatio}
            suffix="%"
            color={adminStats.lossRatio < 70 ? 'var(--green-primary)' : 'var(--red)'}
          />
          <StatCard
            label="Avg Payout Time"
            value={adminStats.avgPayoutMinutes}
            suffix=" min"
            color="var(--green-primary)"
          />
        </div>

        {/* Velocity Chart */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <VelocityChart data={velocityData} />
        </div>

        {/* Map + Pool Health side by side */}
        <div className="grid-2 fade-in-up" style={{ animationDelay: '0.15s' }}>
          <RiskMap cities={cities} />
          <PoolHealth pool={poolHealth} />
        </div>

        {/* Claims Table */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ClaimsTable claims={claims} />
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--charcoal-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Worker Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
