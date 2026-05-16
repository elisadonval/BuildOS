import React, { useState } from 'react';
import { Box, ChevronLeft, FileUp, Settings2, Warehouse, Layout, Layers, FileText, ClipboardList, Gauge } from 'lucide-react';
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';
import { getItemQuantity, calculateDerivedParameters } from '../constants/projectemplate';
import { TYPOLOGY_BASELINES } from '../constants/projectemplate';

const ProjectHub = ({
  viewMode, 
  setViewMode, 
  cardStyle, 
  setCurrentProject, 
  currentProject, 
  projectData, 
  setProjectData, 
  quantities, 
  setQuantities, 
  grandTotal,
  setActiveTab,
  customProjects = []
}) => {
 const [activeTaskView, setActiveTaskView] = useState(null);

 const PROJECT_MAP = {
  "Substructure": ["Excavation","Piling & Shoring","Foundations","Water Proofing","Retaining Wall"],
  "Superstructure": ["Columns & Beams","Floor Slab","Core Construction","Roof structure"],
  "Building Envelope": ["External Wall","Roofing","Glazing","Windows & Doors"],
  "First Install": ["Fire-Stopping","Internal Partitioning","MEP Rough-in","Fire Sprinklers","Elevators"],
  "Second Install": ["Internal Plastering","Ceiling Installation","Bathroom Installation","Kitchen & Appliances","Second Fix MEP","Joinery","Flooring","Electrical Installation","Internal Finishes"],
  "External Works": ["Landscaping"],
  "Testing, Commissioning & Handover": ["Testing & Balancing","Electrical Certification","Snagging","Final Inspection","Practical Completion"]
 };

 const getTaskItems = (taskName) => libraryData.filter(i => i.Task === taskName && i.Category === 'Product');

 const getTaskTotals = (taskName) => {
  const items = libraryData.filter(i => i.Task === taskName);

  const products = items
   .filter(i => i.Category === 'Product')
   .reduce((s, i) => s + (getItemQuantity(i, projectData) * (i["Price (€)"] || 0)), 0);
  
  const labour = items
   .filter(i => i.Category === 'Labor')
   .reduce((s, i) => s + (getItemQuantity(i, projectData) * (i["Price (€)"] || 0)), 0);

  return { products, labour };
 };

 const renderSettingsBar = () => {
  const derivedParams = calculateDerivedParameters(projectData);

  return (
   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', marginBottom: '25px', border: `1px solid ${THEME.border}` }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Layout size={14}/> BUILDING TYPOLOGY
      </label>
      <select
        value={projectData.typology || 'Single Family Home'}
        onChange={(e) => {
          const selectedTypology = e.target.value;
          // Import baseline pairs from our template maps
          const { TYPOLOGY_BASELINES } = require('../constants/projectemplate');
          const baselines = TYPOLOGY_BASELINES[selectedTypology] || { gia: 0, storeys: 1 };
          
          // Clear manual values to allow the calculation engine to recalculate wall/window areas fresh
          setProjectData({
            ...projectData,
            typology: selectedTypology,
            gia: baselines.gia,
            storeys: baselines.storeys,
            wallArea: 0,
            windowArea: 0
          });
        }}
        style={{ border: `1px solid ${THEME.border}`, borderRadius: '8px', padding: '8px', fontWeight: '700', outline: 'none', backgroundColor: '#fff', height: '38px', cursor: 'pointer' }}
      >
        <option value="Single Family Home">Single Family Home</option>
        <option value="Apartment Building">Apartment Building</option>
        <option value="Office">Office</option>
        <option value="School">School</option>
      </select>
    </div>
    {[
      { label: 'GIA (m²)', key: 'gia', icon: <Layout size={14}/> },
      { label: 'STOREYS', key: 'storeys', icon: <Layers size={14}/> },
      { label: 'WALL AREA (m²)', key: 'wallArea', icon: <Warehouse size={14}/> },
      { label: 'WINDOW AREA (m²)', key: 'windowArea', icon: <Box size={14}/> }
    ].map(field => (
    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
     <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
      {field.icon} {field.label}
     </label>
     <input
      type="number"
      value={derivedParams[field.key] || 0}
      onChange={(e) => setProjectData({...projectData, [field.key]: parseFloat(e.target.value) || 0})}
      style={{ border: `1px solid ${THEME.border}`, borderRadius: '8px', padding: '8px', fontWeight: '700', outline: 'none' }}
     />
    </div>
   ))}
   </div>
  );
 };

 if (activeTaskView) {
  const taskItems = getTaskItems(activeTaskView);

  return (
   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <button onClick={() => setActiveTaskView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.primary, fontWeight: '700', display: 'flex', alignItems: 'center' }}>
     <ChevronLeft size={20}/> Back to Project Overview
    </button>
    <div style={cardStyle}>
     <h2>Managing Products: {activeTaskView}</h2>
     <p style={{ fontSize: '13px', color: THEME.muted, marginTop: '8px' }}>
       Quantities are contextually mapped to GIA, Wall Area, or Window Area for items measured in m².
     </p>
     <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
       <tr style={{ textAlign: 'left', color: THEME.muted, borderBottom: `2px solid ${THEME.border}` }}>
        <th style={{ padding: '12px' }}>Identifier</th>
        <th>Unit</th>
        <th>Price</th>
        <th>Quantity</th>
        <th style={{ textAlign: 'right' }}>Total</th>
       </tr>
      </thead>
      <tbody>
       {taskItems.map(item => {
        const displayQty = getItemQuantity(item, projectData);

        return (
         <tr key={item.Code} style={{ borderBottom: `1px solid ${THEME.border}` }}>
          <td style={{ padding: '15px 12px', fontSize: '13px' }}>{item.Identifier}</td>
          <td>{item["U.M."]}</td>
          <td>€{item["Price (€)"]}</td>
          <td>
           <input
            type="number"
            disabled={true}
            style={{ width: '80px', padding: '8px', borderRadius: '6px', border: `1px solid ${THEME.border}`, fontWeight: '600', backgroundColor: '#f1f5f9', color: '#334155' }}
            value={displayQty}
            readOnly
           />
          </td>
          <td style={{ textAlign: 'right', fontWeight: '800' }}>€{(displayQty * item["Price (€)"]).toLocaleString()}</td>
         </tr>
        );
       })}
      </tbody>
     </table>
    </div>
   </div>
  );
 }

 return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
   {viewMode === 'list' ? (
    <>
     <div style={cardStyle}>
      <h3 style={{ margin: 0, marginBottom: '20px' }}>Existing Projects</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
       {['Viale Mugello','Porta Nuova Center','Navigli Waterfront','CityLife Tower'].map(name => (
        <div key={name} style={{ padding: '20px', borderRadius: '20px', border: `1px solid ${THEME.border}`, backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '15px' }}>
         <div>
          <div style={{ fontWeight: '800', color: THEME.text, fontSize: '16px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: THEME.muted, marginTop: '4px' }}>Milan, Italy</div>
         </div>
         <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setCurrentProject(name); setViewMode('detail'); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: `1px solid ${THEME.border}`, color: THEME.text, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
           <Settings2 size={14}/> Edit Project
          </button>
          <button onClick={() => { setCurrentProject(name); setActiveTab('Dashboard'); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: THEME.primary, border: 'none', color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
           <Gauge size={14}/> Dashboard
          </button>
         </div>
        </div>
       ))}

       {customProjects.map(proj => (
        <div key={proj.id} style={{ padding: '20px', borderRadius: '20px', border: `1px solid ${THEME.border}`, backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '15px' }}>
         <div>
          <div style={{ fontWeight: '800', color: THEME.text, fontSize: '16px' }}>{proj.name}</div>
          <div style={{ fontSize: '12px', color: THEME.muted, marginTop: '4px' }}>Quick Estimate Blueprint ({proj.type})</div>
          <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '6px', color: THEME.primary }}>Est: €{Math.round(proj.budget).toLocaleString()}</div>
         </div>
         <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setCurrentProject(proj.name); setViewMode('detail'); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#f8fafc', border: `1px solid ${THEME.border}`, color: THEME.text, fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
           <Settings2 size={14}/> Edit Project
          </button>
          <button onClick={() => { setCurrentProject(proj.name); setActiveTab('Dashboard'); }} style={{ flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: THEME.primary, border: 'none', color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
           <Gauge size={14}/> Dashboard
          </button>
         </div>
        </div>
       ))}
      </div>
     </div>

     <div style={{ ...cardStyle, borderLeft: `8px solid ${THEME.primary}` }}>
      <h3>Start New Project Template</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '20px' }}>
       {['Single Family Home', 'Multi-Storey Apartment', 'Office Building', 'Educational Building'].map(type => (
        <div key={type} style={{ padding: '20px', border: `2px solid ${THEME.border}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
         <Box size={24} style={{ marginBottom: '10px', margin: '0 auto' }}/>
         <div style={{ fontWeight: '800' }}>{type}</div>
        </div>
       ))}
      </div>
     </div>

     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
       <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <FileUp size={22} color={THEME.primary} />
          <h3 style={{ margin: 0 }}>Import from Gantt Chart</h3>
        </div>
        <div style={{ border: `2px dashed ${THEME.border}`, padding: '30px', textAlign: 'center', borderRadius: '15px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
          <p style={{ color: THEME.muted, fontSize: '14px' }}>Drag and drop your MPP or CSV schedule here</p>
        </div>
       </div>

       <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <ClipboardList size={22} color={THEME.primary} />
          <h3 style={{ margin: 0 }}>Import Project Specifications</h3>
        </div>
        <div style={{ border: `2px dashed ${THEME.border}`, padding: '30px', textAlign: 'center', borderRadius: '15px', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} color={THEME.muted} />
          <p style={{ color: THEME.muted, fontSize: '14px', margin: 0 }}>Upload Technical Spec or Cost Report</p>
        </div>
       </div>
     </div>
    </>
   ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
     <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: THEME.muted }}>
      <ChevronLeft size={20}/> Back to Project Hub
     </button>
     <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
       <div>
        <h1 style={{ margin: 0 }}>{currentProject}</h1>
        <p style={{ margin: 0, color: THEME.muted }}>Project Phase and Task Overview</p>
       </div>
       <div style={{ textAlign: 'right', padding: '10px', background: THEME.primary, color: 'white', borderRadius: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.8 }}>ESTIMATED PROJECT COST</div>
        <div style={{ fontSize: '20px', fontWeight: '900' }}>€{grandTotal.toLocaleString()}</div>
       </div>
      </div>
      {renderSettingsBar()}
      {Object.entries(PROJECT_MAP).map(([phaseName, tasks]) => (
       <details key={phaseName} style={{ marginBottom: '15px', border: `1px solid ${THEME.border}`, borderRadius: '16px' }}>
        <summary style={{ padding: '20px', backgroundColor: '#fcfcfd', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{phaseName}</span>
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: THEME.muted, fontWeight: '800' }}>PRODUCTS</div>
              <div style={{ fontSize: '14px' }}>€{tasks.reduce((acc, t) => acc + getTaskTotals(t).products, 0).toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: THEME.primary, fontWeight: '800' }}>LABOUR (EST)</div>
              <div style={{ fontSize: '14px', color: THEME.primary }}>€{tasks.reduce((acc, t) => acc + getTaskTotals(t).labour, 0).toLocaleString()}</div>
            </div>
          </div>
        </summary>
        <div style={{ padding: '10px 20px 20px 20px' }}>
         {tasks.map(taskName => (
          <div key={taskName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
           <div style={{ fontWeight: '700' }}>{taskName}</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right', marginRight: '10px' }}>
               <div style={{ fontSize: '10px', color: THEME.muted }}>TASK TOTAL</div>
               <div style={{ fontWeight: '800' }}>€{(getTaskTotals(taskName).products + getTaskTotals(taskName).labour).toLocaleString()}</div>
            </div>
            <button onClick={() => setActiveTaskView(taskName)} style={{ padding: '8px 16px', backgroundColor: 'white', border: `1px solid ${THEME.border}`, color: THEME.text, borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={16} /> Products
            </button>
            <button 
              onClick={() => setActiveTab({tab: 'Resources', task: taskName})} 
              style={{ padding: '8px 16px', backgroundColor: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Manage Labor
            </button>
           </div>
          </div>
         ))}
        </div>
       </details>
      ))}
     </div>
    </div>
   )}
  </div>
 );
};

export default ProjectHub;