import React, { useState, useMemo } from 'react'; 
import Sidebar from './components/sidebar';
import Header from './components/header';
import Dashboard from './pages/dashboard';
import ProjectHub from './pages/projecthub';
import EquipmentPortal from './pages/equipment';
import ResourceManager from './pages/resourcemanager';
import QuickEstimator from './pages/quickestimator';
import Metrics from './pages/riskmetric';
import Login from './components/login';
import Welcome from './pages/welcome'; 
import libraryData from './constants/master_dataset.json';
import { getInitialQuantities, getItemQuantity, calculateDerivedParameters } from './constants/projectemplate'; 
import { THEME } from './constants/theme';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Welcome');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [notifications, setNotifications] = useState([]);
  const [customProjects, setCustomProjects] = useState([]);
  
  const [projectsList, setProjectsList] = useState([
    { id: '1', name: 'Viale Mugello', type: 'Custom', budget: null, isQuickEstimate: false },
    { id: '2', name: 'Porta Nuova Center', type: 'Custom', budget: null, isQuickEstimate: false },
    { id: '3', name: 'Navigli Waterfront', type: 'Custom', budget: null, isQuickEstimate: false },
    { id: '4', name: 'CityLife Tower', type: 'Custom', budget: null, isQuickEstimate: false }
  ]);

  const [quickEstimatorTypology, setQuickEstimatorTypology] = useState('Educational Building');

  const PROJECT_MAP = useMemo(() => ({
    "Substructure": ["Excavation", "Piling & Shoring", "Foundations", "Water Proofing", "Retaining Wall"],
    "Superstructure": ["Columns & Beams", "Floor Slab", "Core Construction", "Roof structure"],
    "Building Envelope": ["External Wall", "Roofing", "Glazing", "Windows & Doors"],
    "First Install": ["Fire-Stopping", "Internal Partitioning", "MEP Rough-in", "Fire Sprinklers", "Elevators"],
    "Second Install": ["Internal Plastering", "Ceiling Installation", "Bathroom Installation", "Kitchen & Appliances", "Second Fix MEP", "Joinery", "Flooring", "Electrical Installation", "Internal Finishes"],
    "External Works": ["Landscaping"],
    "Testing, Commissioning & Handover": ["Testing & Balancing", "Electrical Certification", "Snagging", "Final Inspection", "Practical Completion"]
  }), []);

  const STORAGE_KEY = 'CONCRETE_BUILD_PRO_STATE';
  
  const savedState = useMemo(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }, []);

  const [currentProject, setCurrentProject] = useState(savedState.currentProject || "Viale Mugello");
  const [projectStatus, setProjectStatus] = useState(savedState.projectStatus || 'Active');
  const [projectData, setProjectData] = useState({
    typology: 'Single Family Home',
    gia: 0,
    storeys: 0,
    wallArea: 0,
    windowArea: 0,
    unitSystem: 'metric'
  });
  
  const [quantities, setQuantities] = useState(savedState.quantities || getInitialQuantities(projectData));
  const [delayMetrics, setDelayMetrics] = useState(savedState.delayMetrics || []);
  const [overrunDays, setOverrunDays] = useState(savedState.overrunDays || 0);

  const activeProjectObject = useMemo(() => {
    return projectsList.find(p => p.name === currentProject);
  }, [projectsList, currentProject]);

  const triggerNotification = (text) => {
    const newNote = { 
      id: Date.now(), 
      text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setNotifications(prev => [newNote, ...prev].slice(0, 10));
  };

  const handleGlobalSave = () => {
    const stateToSave = { currentProject, projectStatus, projectData, quantities, delayMetrics, overrunDays };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    triggerNotification(`Project saved: ${currentProject}`);
  };

  const labourItems = useMemo(() => libraryData.filter(item => item.Category === 'Labor'), []);

  const phasesWithCosts = useMemo(() => {
    return Object.entries(PROJECT_MAP).map(([phaseName, tasks]) => {
      let phaseTotal = 0;
      const taskBreakdowns = {};

      tasks.forEach(task => {
        const items = libraryData.filter(i => i.Task === task);
        let taskProductSum = 0;
        let taskLaborSum = 0;

        items.forEach(item => {
          const qty = getItemQuantity(item, projectData);
          const cost = qty * (item['Price (€)'] || 0);

          if (item.Category === 'Labor') {
            taskLaborSum += cost;
          } else {
            taskProductSum += cost;
          }
        });

        taskBreakdowns[task] = { products: taskProductSum, labour: taskLaborSum };
        phaseTotal += (taskProductSum + taskLaborSum);
      });

      return { 
        id: phaseName, 
        name: phaseName, 
        totalCost: phaseTotal, 
        tasks,
        taskBreakdowns
      };
    });
  }, [projectData, PROJECT_MAP]);

  const dailyRiskExposure = delayMetrics.reduce((sum, m) => sum + (parseFloat(m.dailyCost) || 0), 0);
  const totalRiskImpact = overrunDays > 0 ? overrunDays * dailyRiskExposure : 0;
  
  const grandTotal = activeProjectObject?.isQuickEstimate 
    ? activeProjectObject.budget 
    : (phasesWithCosts.reduce((sum, p) => sum + p.totalCost, 0) + totalRiskImpact);

  const handleSaveQuickProject = (name, typology, calculatedBudget, currentParams) => {
    const newProject = {
      id: `quick-${Date.now()}`,
      name: name,
      type: typology,
      budget: calculatedBudget,
      isQuickEstimate: true,
      params: currentParams 
    };
    
    setProjectsList(prev => [newProject, ...prev]);
    setCurrentProject(name); 
    
    setProjectData({
      gia: currentParams.gia || 2500,
      storeys: currentParams.storeys || 1,
      wallArea: currentParams.wallArea || 1200,
      windowArea: currentParams.windowArea || 350
    });

    triggerNotification(`Created quick estimate project: ${name}`);
    setActiveTab('Project Hub'); 
  };

  const handleLaunchQuickTemplate = (typologyName) => {
    setQuickEstimatorTypology(typologyName);
    setActiveTab('Estimator');
  };

  if (!isLoggedIn) {
    return (
      <Login 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword} 
        handleLogin={() => setIsLoggedIn(true)} 
      />
    );
  }

  const cardStyle = { 
    backgroundColor: 'white', 
    borderRadius: '24px', 
    padding: '32px', 
    border: `1px solid ${THEME.border}`, 
    position: 'relative', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
  };

  const inputStyle = { 
    width: '100%', 
    boxSizing: 'border-box', 
    padding: '12px', 
    borderRadius: '8px', 
    border: `1px solid ${THEME.border}`, 
    backgroundColor: '#fafafa', 
    fontWeight: '600', 
    color: THEME.sidebar, 
    outline: 'none' 
  };

  const activeTabName = typeof activeTab === 'object' ? activeTab.tab : activeTab;

  return (
    <div style={{ display: 'flex', backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        activeTab={activeTabName} 
        setActiveTab={setActiveTab} 
        setViewMode={setViewMode} 
      />
      
      <div style={{ 
        flexGrow: 1, 
        marginLeft: isSidebarExpanded ? '240px' : '80px', 
        transition: 'margin-left 0.3s ease' 
      }}>
        <Header 
          activeTab={activeTabName} 
          currentProject={currentProject} 
          username={username} 
          notifications={notifications} 
        />
        
        <div style={{ padding: '30px' }}>
          {activeTabName === 'Welcome' && (
            <Welcome setActiveTab={setActiveTab} />
          )}

          {activeTabName === 'Dashboard' && (
            <Dashboard 
              cardStyle={cardStyle} 
              inputStyle={inputStyle} 
              projectData={calculateDerivedParameters(projectData)} 
              setProjectData={setProjectData}
              grandTotal={grandTotal} 
              projectStatus={projectStatus} 
              setProjectStatus={setProjectStatus}
              overrunDays={overrunDays} 
              setOverrunDays={setOverrunDays} 
              onSave={handleGlobalSave}
              labourItems={labourItems} 
              phases={phasesWithCosts} 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTabName === 'Project Hub' && (
            <ProjectHub 
              cardStyle={cardStyle} 
              currentProject={currentProject} 
              setCurrentProject={setCurrentProject}
              projectData={projectData} 
              setProjectData={setProjectData}
              quantities={quantities} 
              setQuantities={setQuantities} 
              grandTotal={grandTotal} 
              setActiveTab={setActiveTab} 
              viewMode={viewMode} 
              setViewMode={setViewMode}
              projectsList={projectsList}
              onLaunchTemplate={handleLaunchQuickTemplate}
              customProjects={customProjects}
              setCustomProjects={setCustomProjects}
              phases={phasesWithCosts}
            />
          )}

          {activeTabName === 'Resources' && (
            <ResourceManager 
              cardStyle={cardStyle} 
              filterTask={typeof activeTab === 'object' ? activeTab.task : null}
              phases={phasesWithCosts}
              currentPhase={
                phasesWithCosts.find(p => p.id === (activeTab.phaseId || 'Substructure')) || phasesWithCosts[0]
              }
              setSelectedPhaseId={(id) => setActiveTab({ tab: 'Resources', phaseId: id })}
              labourItems={labourItems}
              onSave={handleGlobalSave}
            />
          )}

          {activeTabName === 'Estimator' && (
            <QuickEstimator 
              cardStyle={cardStyle} 
              grandTotal={grandTotal} 
              phases={phasesWithCosts} 
              onSaveProject={(newProj) => setCustomProjects(prev => [newProj, ...prev])}
            />
          )}

          {activeTabName === 'Equipment' && (
            <EquipmentPortal cardStyle={cardStyle} />
          )}

          {activeTabName === 'Metrics' && (
            <Metrics 
              delayMetrics={delayMetrics} 
              setDelayMetrics={setDelayMetrics} 
              overrunDays={overrunDays} 
              cardStyle={cardStyle} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;