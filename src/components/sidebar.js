import React from 'react';
import { LayoutGrid, Globe, Truck, TriangleAlert, Users, Zap, Home } from 'lucide-react';
import { THEME } from '../constants/theme';

const Sidebar = ({ activeTab, setActiveTab, setViewMode, isExpanded, setIsExpanded }) => {
  const btnStyle = (tab) => ({
    background: activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent',
    border: 'none', color: 'white', padding: '14px', cursor: 'pointer', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '15px', width: '100%', fontWeight: '600', transition: '0.2s',
    justifyContent: isExpanded ? 'flex-start' : 'center'
  });

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ 
        width: isExpanded ? '240px' : '80px', backgroundColor: THEME.sidebar, color: 'white', 
        height: '100vh', position: 'fixed', left: 0, top: 0, padding: '20px 10px', zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ fontSize: '22px', fontWeight: '900', marginBottom: '40px', textAlign: 'center', whiteSpace: 'nowrap' }}>
        {isExpanded ? <>BUILD<span style={{ color: THEME.primary }}>OS</span></> : <span style={{ color: THEME.primary }}>B</span>}
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        {/* NEW: Home / Welcome Page Button */}
        <button onClick={() => setActiveTab('Welcome')} style={btnStyle('Welcome')}>
          <Home size={22} color={activeTab === 'Welcome' ? THEME.success : 'white'}/> {isExpanded && "Home"}
        </button>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />

        {/* Quick Estimator */}
        <button onClick={() => { setActiveTab('Project Hub'); setViewMode('list'); }} style={btnStyle('Project Hub')}>
          <Globe size={22}/> {isExpanded && "Project Hub"}
        </button>

        <button onClick={() => setActiveTab('Estimator')} style={btnStyle('Estimator')}>
          <Zap size={22} color={activeTab === 'Estimator' ? THEME.success : 'white'}/> {isExpanded && "Quick Estimator"}
        </button>

        <button onClick={() => setActiveTab('Dashboard')} style={btnStyle('Dashboard')}>
          <LayoutGrid size={22}/> {isExpanded && "Dashboard"}
        </button>
        
        <button onClick={() => setActiveTab('Resources')} style={btnStyle('Resources')}>
          <Users size={22}/> {isExpanded && "Resources"}
        </button>

        <button onClick={() => setActiveTab('Equipment')} style={btnStyle('Equipment')}>
          <Truck size={22}/> {isExpanded && "Equipment"}
        </button>

        <button onClick={() => setActiveTab('Metrics')} style={btnStyle('Metrics')}>
          <TriangleAlert size={22}/> {isExpanded && "Metrics"}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;