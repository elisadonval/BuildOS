import React, { useState, useMemo } from 'react';
import { 
  HardHat, Users, Plus, Trash2, LayoutGrid, 
  Activity, Zap, ShieldAlert, ChevronLeft, ChevronRight,
  BarChart3, Calculator, Globe, Coins, ListPlus, ChevronDown, ChevronUp,
  Info, LogOut, FileUp, Box, Truck, Settings, Bell 
} from 'lucide-react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Dashboard from './components/dashboard';
import ProjectHub from './components/projecthub';
import EquipmentPortal from './components/equipment';
import Login from './components/login';

// --- THEME ---
import { THEME } from './constants/theme';

// --- STYLES ---
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}`, backgroundColor: '#f1f5f9', fontWeight: '600', color: THEME.sidebar, outline: 'none' };
const cardStyle = { backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: `1px solid ${THEME.border}`, position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const addBtn = { backgroundColor: THEME.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };

// --- LOGIN PAGE COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === 'Group4') { onLogin(user); } 
    else { setError('Invalid Password. Hint: Group4'); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: THEME.sidebar }}>
      <div style={{ ...cardStyle, width: '400px', textAlign: 'center' }}>
        <HardHat size={48} color={THEME.primary} style={{ marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '24px' }}>Project Manager Portal</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input placeholder="Username" style={inputStyle} value={user} onChange={(e) => setUser(e.target.value)} required />
          <input type="password" placeholder="Password" style={inputStyle} value={pass} onChange={(e) => setPass(e.target.value)} required />
          {error && <p style={{ color: THEME.danger, fontSize: '12px' }}>{error}</p>}
          <button type="submit" style={addBtn}>Login</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const handleLogin = () => {
  // This accepts ANY username as long as it's not empty, 
  // but requires the specific password 'Group4'
  if (username.trim() !== '' && password === 'Group4') {
    setIsLoggedIn(true);
    setError('');
  } else if (password !== 'Group4') {
    setError('Access Denied: Incorrect Password');
  } else {
    setError('Please enter a username');
  }
};
  const [currentProject, setCurrentProject] = useState('Project A');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); 
  const [forecastScope, setForecastScope] = useState('single');
  const [phases, setPhases] = useState([
    { id: 1, name: "Phase A: Substructure", tasks: [{ id: 101, name: "Site Prep", rate: 24, duration: 5, labor: 4 }, { id: 102, name: "Foundations", rate: 34, duration: 12, labor: 10 }] },
    { id: 2, name: "Phase B: Superstructure", tasks: [{ id: 201, name: "Structural Steel", rate: 42, duration: 20, labor: 15 }] }
  ]);
  const [delayMetrics, setDelayMetrics] = useState([{ id: 1, type: "Site Overheads", dailyCost: 200 }]);
  const [taskCrew, setTaskCrew] = useState(8);
  const [projectCrew, setProjectCrew] = useState(35);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState(101);

  const currentPhase = phases.find(p => p.id === selectedPhaseId) || phases[0];
  const currentTask = currentPhase.tasks.find(t => t.id === selectedTaskId) || currentPhase.tasks[0];
  
  const isProjectMode = forecastScope === 'project';
  const activeHoursNeeded = isProjectMode 
    ? currentPhase.tasks.reduce((sum, t) => sum + (t.duration * t.labor * 8), 0)
    : (currentTask.duration * currentTask.labor * 8);
  
  const activeCrewSize = isProjectMode ? projectCrew : taskCrew;
  const forecastDays = parseFloat((activeHoursNeeded / (Math.max(activeCrewSize, 1) * hoursPerDay)).toFixed(1));
  const activeBaseline = isProjectMode 
    ? currentPhase.tasks.reduce((sum, t) => sum + t.duration, 0)
    : currentTask.duration;
  
  const overrunDays = forecastDays - activeBaseline;
  const dailyRiskSum = delayMetrics.reduce((sum, item) => sum + (parseFloat(item.dailyCost) || 0), 0);
  const totalRiskCost = overrunDays > 0 ? overrunDays * dailyRiskSum : 0;

  const chartData = useMemo(() => {
    const points = [];
    for (let i = 5; i <= 60; i += 5) {
      points.push({ crew: i, days: parseFloat((activeHoursNeeded / (i * hoursPerDay)).toFixed(1)) });
    }
    return points;
  }, [activeHoursNeeded, hoursPerDay]);

  if (!isLoggedIn) {
    return (
    <Login 
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      error={error}
    />
    );
  }  

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: THEME.bg }}>
      
      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setViewMode={setViewMode} />

      {/* --- AREA 1: THE MAIN STAGE --- */}
      <main style={{ marginLeft: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
  
  {/* The Header always stays at the top */}
  <Header activeTab={activeTab} currentProject={currentProject} username={username} />

  {/* The Content Area changes based on the Active Tab */}
  <div style={{ padding: '30px 50px' }}>
    
    {/* 1. DASHBOARD VIEW */}
    {activeTab === 'Dashboard' && (
      <Dashboard 
        setActiveTab={setActiveTab}
        addBtn={addBtn}
        cardStyle={cardStyle}
        overrunDays={overrunDays}
        forecastDays={forecastDays}
        chartData={chartData}
        activeCrewSize={activeCrewSize}
        inputStyle={inputStyle}
        isProjectMode={isProjectMode}
        setProjectCrew={setProjectCrew}
        setTaskCrew={setTaskCrew}
        totalRiskCost={totalRiskCost}
      />
    )}

    {/* 2. PROJECT HUB VIEW */}
    {activeTab === 'Project Hub' && (
      <ProjectHub 
        viewMode={viewMode}
        setViewMode={setViewMode}
        cardStyle={cardStyle}
        setCurrentProject={setCurrentProject}
        currentProject={currentProject}
        phases={phases}
      />
    )}

    {/* 3. EQUIPMENT PORTAL VIEW */}
    {activeTab === 'Equipment' && (
      <EquipmentPortal cardStyle={cardStyle} />
    )}

  </div>
</main>
    </div>
  );
}