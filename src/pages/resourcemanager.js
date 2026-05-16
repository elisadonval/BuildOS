import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, X, RotateCcw, Plus, Lock } from 'lucide-react'; 
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';

const ResourceManager = ({
  cardStyle,
  phases = [],
  currentPhase,
  setSelectedPhaseId,
  labourItems = [],
  onSave,
  filterTask
}) => {
  // --- 1. EXTRACT BACKEND RATES ---
  const masterRates = useMemo(() => {
    return libraryData
      .filter(i => i.Category === 'Labor')
      .reduce((acc, i) => {
        acc[i.Identifier] = i['Price (€)'];
        return acc;
      }, {});
  }, []);

  // --- 2. STATE MANAGEMENT ---
  const [laborRates, setLaborRates] = useState(() => {
    const saved = localStorage.getItem('CONCRETE_BUILD_PRO_LABOR_RATES');
    return saved ? JSON.parse(saved) : { ...masterRates };
  });

  const [resourceRows, setResourceRows] = useState([]);
  const [variationInput, setVariationInput] = useState({ 
    task: '', type: '', days: 1, number: 1, hoursPerDay: 8 
  });

  const currentPhaseTasks = useMemo(() => currentPhase?.tasks || [], [currentPhase]);
  const allRoles = useMemo(() => Object.keys(masterRates), [masterRates]);

  const getRolesForTask = useCallback((taskName) => {
    const roles = libraryData.filter(i => i.Category === 'Labor' && i.Task === taskName).map(i => i.Identifier);
    return roles.length > 0 ? roles : allRoles;
  }, [allRoles]);

  // --- 3. LOGIC & CALCULATIONS ---
  const calculateRowTotal = (row) => {
    const rate = laborRates[row.type] || masterRates[row.type] || 0;
    return (row.number || 0) * (row.days || 0) * (row.hoursPerDay || 0) * rate;
  };

  const totalLabourActual = resourceRows.reduce((sum, row) => sum + calculateRowTotal(row), 0);
  const baseline = currentPhase?.totalCost || 0; 
  const variance = baseline - totalLabourActual;

  const loadInitialTasks = useCallback(() => {
    const rows = libraryData
      .filter(item => item.Category === 'Labor' && currentPhaseTasks.includes(item.Task))
      .map(i => ({ task: i.Task, type: i.Identifier, days: 1, number: 1, hoursPerDay: 8 }));
    setResourceRows(rows);
  }, [currentPhaseTasks]);

  const resetToBackendDefaults = () => {
    setLaborRates({ ...masterRates });
    localStorage.setItem('CONCRETE_BUILD_PRO_LABOR_RATES', JSON.stringify(masterRates));
    loadInitialTasks();
  };

  useEffect(() => {
    loadInitialTasks();
    if (currentPhaseTasks.length > 0) {
      const task = currentPhaseTasks[0];
      setVariationInput(prev => ({ ...prev, task, type: getRolesForTask(task)[0], days: 1, number: 1, hoursPerDay: 8 }));
    }
  }, [currentPhase?.id, currentPhaseTasks, getRolesForTask, loadInitialTasks]);

  const handleRateChange = (role, newRate) => {
    const val = parseFloat(newRate) || 0;
    const validatedRate = Math.max(val, masterRates[role] || 0);
    const updated = { ...laborRates, [role]: validatedRate };
    setLaborRates(updated);
    localStorage.setItem('CONCRETE_BUILD_PRO_LABOR_RATES', JSON.stringify(updated));
  };

  // RE-ENGINEERED SCALABLE GRID: Solves overlapping and column alignment perfectly
  const GRID_LAYOUT = {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1.8fr 0.6fr 0.6fr 0.6fr 1.4fr 1fr 0.5fr',
    gap: '16px', 
    alignItems: 'center', 
    padding: '14px 24px',
    scrollbarGutter: 'stable'
  };

  const badgeInputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: '#F5F3FF',
    border: '1px solid #DDD6FE',
    color: '#5B21B6',
    fontWeight: '700',
    fontSize: '13px',
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const actionInputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #C4B5FD',
    backgroundColor: '#FFF',
    fontSize: '13px',
    fontWeight: '600',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* STATS HEADER */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ ...cardStyle, flex: 1.5, borderLeft: `6px solid ${THEME.primary}` }}>
          <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted }}>ACTIVE PHASE</label>
          <select 
            value={currentPhase?.id} 
            onChange={(e) => setSelectedPhaseId(e.target.value)}
            style={{ width: '100%', border: 'none', fontSize: '18px', fontWeight: '900', marginTop: '4px', background: 'transparent' }}
          >
            {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted }}>BACKEND BASELINE</label>
          <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '4px' }}>€{baseline.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, flex: 1, borderTop: `4px solid ${variance < 0 ? THEME.danger : THEME.success}` }}>
          <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted }}>VARIANCES</label>
          <div style={{ fontSize: '22px', fontWeight: '900', color: variance < 0 ? THEME.danger : THEME.success, marginTop: '4px' }}>
            €{Math.abs(variance).toLocaleString()}
          </div>
        </div>
      </div>

      {/* RESOURCE TABLE */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: '900' }}>Workforce Manager</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: THEME.muted }}>Rates restored from Master Dataset. Minimums are locked.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={resetToBackendDefaults} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: `1px solid ${THEME.border}`, background: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
              <RotateCcw size={14}/> Force Restore Rates
            </button>
            <button onClick={onSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '10px', background: THEME.primary, color: '#fff', border: 'none', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>
              <Save size={14}/> Save Layout
            </button>
          </div>
        </div>

        {/* HEADERS */}
        <div style={{ ...GRID_LAYOUT, background: '#F9FAFB', borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
          {['Task', 'Resource Role', 'Days', 'Staff', 'Hrs', 'Hourly Rate', 'Total Cost', ''].map((h, i) => (
            <span key={i} style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, textTransform: 'uppercase', textAlign: i >= 2 && i <= 6 ? 'center' : 'left' }}>{h}</span>
          ))}
        </div>

        {/* ADD ROW (Purple Variant Input Bar) */}
        <div style={{ ...GRID_LAYOUT, background: '#F5F3FF', borderBottom: `2px solid #C4B5FD` }}>
          <select value={variationInput.task} onChange={e => setVariationInput({...variationInput, task: e.target.value, type: getRolesForTask(e.target.value)[0]})} style={actionInputStyle}>
            {currentPhaseTasks.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={variationInput.type} onChange={e => setVariationInput({...variationInput, type: e.target.value})} style={actionInputStyle}>
            {getRolesForTask(variationInput.task).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="number" min={0} value={variationInput.days} onChange={e => setVariationInput({...variationInput, days: parseInt(e.target.value) || 0})} style={{ ...actionInputStyle, textAlign: 'center' }} />
          <input type="number" min={0} value={variationInput.number} onChange={e => setVariationInput({...variationInput, number: parseInt(e.target.value) || 0})} style={{ ...actionInputStyle, textAlign: 'center' }} />
          <input type="number" min={0} value={variationInput.hoursPerDay} onChange={e => setVariationInput({...variationInput, hoursPerDay: parseInt(e.target.value) || 0})} style={{ ...actionInputStyle, textAlign: 'center' }} />
          
          <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '700', color: THEME.primary }}>
            €{(laborRates[variationInput.type] || masterRates[variationInput.type] || 0).toFixed(2)}/h
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.muted, fontSize: '13px', width: '100%' }}>—</div>
          
          <button 
            onClick={() => {
              if(!variationInput.task) return;
              setResourceRows([{...variationInput}, ...resourceRows]);
            }} 
            style={{ background: THEME.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontWeight: '800', fontSize: '12px', width: '100%', textAlign: 'center' }}
          >
            ADD
          </button>
        </div>

        {/* SCROLLABLE TABLE LISTING */}
        <div style={{ maxHeight: '480px', overflowY: 'auto', marginLeft: '12px',scrollbarGutter: 'stable' }}>
          {resourceRows.map((row, idx) => (
            <div key={idx} style={{ ...GRID_LAYOUT, borderBottom: `1px solid ${THEME.border}`, backgroundColor: filterTask === row.task ? '#FFFBEB' : 'transparent' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: THEME.text }}>{row.task}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{row.type}</div>
              
              {/* Variable inputs switched to purple editable input badges */}
              <input 
                type="number" 
                min={0}
                value={row.days} 
                onChange={e => { const updated = [...resourceRows]; updated[idx].days = parseInt(e.target.value) || 0; setResourceRows(updated); }} 
                style={badgeInputStyle} 
              />
              <input 
                type="number" 
                min={0}
                value={row.number} 
                onChange={e => { const updated = [...resourceRows]; updated[idx].number = parseInt(e.target.value) || 0; setResourceRows(updated); }} 
                style={badgeInputStyle} 
              />
              <input 
                type="number" 
                min={0}
                value={row.hoursPerDay} 
                onChange={e => { const updated = [...resourceRows]; updated[idx].hoursPerDay = parseInt(e.target.value) || 0; setResourceRows(updated); }} 
                style={badgeInputStyle} 
              />
              
              {/* Hourly Rate column: Cleaned up and display-locked */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: THEME.text }}>
                <Lock size={12} style={{ marginRight: '6px', color: THEME.muted, opacity: 0.6 }}/>
                <span>€{(laborRates[row.type] || masterRates[row.type] || 0).toFixed(2)}</span>
              </div>

              {/* Total Cost column: Locked display output */}
              <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: '800', color: THEME.primary }}>
                €{calculateRowTotal(row).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <button onClick={() => setResourceRows(resourceRows.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}><X size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceManager;