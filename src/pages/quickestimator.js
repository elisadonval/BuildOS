import React, { useState, useMemo } from 'react';
import { 
  Zap, Maximize, Layers, Warehouse, Box, 
  Building2, HardHat, Calendar, Clock, 
  ArrowRight, ShieldCheck, Construction, 
  Ruler, Home, Edit3, RefreshCw, Info,
  Users, TrendingDown, AlertTriangle, Save, Plus,
  Target, BarChart3, ChevronRight, TrendingUp
} from 'lucide-react';
import { THEME } from '../constants/theme';
import quickDataset from '../constants/quick_dataset.json'; 
import { CalculatedProjectProgram, TYPOLOGY_PROGRAM_BASELINES } from '../constants/typologyprogram';

// Standardized list of worker types requested
const WORKER_TYPES = [
  "Ground Worker",
  "Site Supervisor",
  "General Laborer",
  "Foreman",
  "Carpenter",
  "Machine Operator",
  "Specialist Technician",
  "Plumber",
  "Electrician",
  "Quality Control"
];

// Simple fallback uniform base rate per worker type (€/hr)
const WORKER_RATES = {
  "Ground Worker": 10.61,
  "Site Supervisor": 21.15,
  "General Laborer": 11,
  "Foreman": 24.17,
  "Carpenter": 17,
  "Machine Operator": 19.23,
  "Specialist Technician": 24.19,
  "Plumber": 17,
  "Electrician": 21,
  "Quality Control": 16,
};

const QuickEstimator = ({ cardStyle, grandTotal = 0, phases = [] }) => {
  // --- 1. PARAMETRIC & OPTIMIZER STATE ---
  const [params, setParams] = useState({
    gia: 2500,        
    volume: 8200,     
    storeys: 2,       
    wallArea: 1200,
    windowArea: 350,
    height: 7,
    units: 20,
    type: 'Educational Building',
    complexity: 'Medium',
    material: 'Concrete',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Track user-adjusted configuration per phase ID: { workerCount: X, workerType: Y }
  const [phaseStaffing, setPhaseStaffing] = useState({});
  const [selectedPhaseId, setSelectedPhaseId] = useState("1");

  // --- 2. GET CURRENT BASELINE PHASES ---
  const activeTimelinePhases = useMemo(() => {
    const activeBaseline = TYPOLOGY_PROGRAM_BASELINES[params.type] || TYPOLOGY_PROGRAM_BASELINES['Educational Building'];
    return activeBaseline.phases;
  }, [params.type]);

  // --- 3. DYNAMIC CALCULATION ENGINE WITH REALISTIC COUPLING ---
  const results = useMemo(() => {
    const currentDataset = quickDataset[params.type] || quickDataset['Educational Building'];
    const complexityMult = params.complexity === 'High' ? 1.25 : params.complexity === 'Low' ? 0.9 : 1.0;
    
    const areaCost = params.gia * (currentDataset.costPerM2 || 0);
    const volumeCost = params.volume * (currentDataset.costPerM3 || 0);
    const baseCost = (areaCost + volumeCost) / 2;
    const initialBudget = baseCost * complexityMult;
    const estHours = params.gia * currentDataset.laborFactor * complexityMult;

    const activeBaseline = TYPOLOGY_PROGRAM_BASELINES[params.type] || TYPOLOGY_PROGRAM_BASELINES['Educational Building'];
    const timelineScaleFactor = (params.gia / currentDataset.baseGia) * complexityMult;
    
    let totalScheduleNetDaysShift = 0;
    let laborFinancialAdjustments = 0;

    const optimizedPhases = activeBaseline.phases.map(phase => {
      // Scale standard baseline days smoothly using physical metrics
      const standardDurationDays = Math.max(1, Math.round(phase.baseDuration * timelineScaleFactor));
      
      // Extract active settings or apply defaults
      const staffConfig = phaseStaffing[phase.id] || { workerCount: 4, workerType: 'General Laborer' };
      const workerCount = staffConfig.workerCount;
      const workerType = staffConfig.workerType;
      
      const baseCrew = 4; // Design baseline standard crew size

      // FINE-TUNED GRADUAL DELAY/SAVINGS FORMULA:
      // Instead of an aggressive inverse division, each worker above/below baseline alters productivity by 12.5%
      const efficiencyFactor = 1 + (workerCount - baseCrew) * 0.125;
      const dynamicDurationDays = Math.max(1, Math.round(standardDurationDays / efficiencyFactor));
      
      const daysSavedOrLost = standardDurationDays - dynamicDurationDays; 
      totalScheduleNetDaysShift += daysSavedOrLost;

      // Dynamic Financial calculation based on selected trades
      const hourlyRate = WORKER_RATES[workerType] || 45;
      const phaseLaborCost = workerCount * dynamicDurationDays * 8 * hourlyRate;
      laborFinancialAdjustments += phaseLaborCost;

      return {
        ...phase,
        standardDurationDays,
        dynamicDurationDays,
        daysSavedOrLost,
        workerCount,
        workerType,
        phaseLaborCost
      };
    });

    const standardTotalDays = currentDataset.baseDays * timelineScaleFactor;
    // Calculate final project absolute timeline length 
    const modifiedTotalDays = Math.max(7, Math.round(standardTotalDays - totalScheduleNetDaysShift));
    
    // --- FIXED TIMELINE LOGIC ---
    // Use your requested generous layout (Totaling exactly 71 weeks)
    const scheduleStages = [
      { name: 'Concept / Pre-design', weeks: 8, color: '#6366f1' },
      { name: 'Design Development', weeks: 16, color: '#8b5cf6' },
      { name: 'Permitting / Approvals', weeks: 12, color: '#ec4899' },
      { name: 'Procurement', weeks: 8, color: '#f59e0b' },
      { name: 'Construction', weeks: 24, color: THEME.primary },
      { name: 'Handover / Snagging', weeks: 3, color: THEME.success }
    ];

    const totalWeeks = 71; 
    const finalBudget = initialBudget + laborFinancialAdjustments;

    const start = new Date(params.startDate);
    const handoverDate = new Date(start);
    handoverDate.setDate(start.getDate() + (totalWeeks * 7));

    return { 
      finalBudget, estHours, totalWeeks, totalDays: (totalWeeks * 7),
      scheduleStages, handoverDate, optimizedPhases, totalScheduleNetDaysShift 
    };
  }, [params, phaseStaffing]);

  // --- 4. OPTIMIZER DISPLAY VALUES ---
  const activeOptRes = useMemo(() => {
    const currentPhase = results.optimizedPhases.find(p => p.id === selectedPhaseId) || results.optimizedPhases[0];
    if (!currentPhase) return null;

    const { workerCount, workerType, dynamicDurationDays, daysSavedOrLost, phaseLaborCost, phase } = currentPhase;
    const isBehind = daysSavedOrLost < 0;

    let statusColor = '#f59e0b'; 
    let statusLabel = 'BASELINE SPEC';
    if (workerCount < 4) {
      statusColor = '#ef4444'; 
      statusLabel = 'SLOWER SPEEDS';
    } else if (workerCount > 4) {
      statusColor = '#10b981'; 
      statusLabel = 'ACCELERATING';
    }

    return {
      phaseName: phase,
      workerCount,
      workerType,
      currentDays: dynamicDurationDays,
      netDays: Math.abs(daysSavedOrLost),
      totalCost: phaseLaborCost,
      isBehind,
      statusColor,
      statusLabel,
      phaseId: currentPhase.id
    };
  }, [results, selectedPhaseId]);

  const updateParam = (key, value) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      if (key === 'gia' || key === 'storeys') {
        newParams.height = newParams.storeys * 3.5;
        newParams.units = Math.max(1, Math.floor(newParams.gia / 110));
      }
      if (key === 'type') {
        setPhaseStaffing({}); 
        const dataset = quickDataset[value];
        if (dataset) {
          newParams.gia = dataset.baseGia;
          newParams.volume = dataset.baseVolume;
          newParams.storeys = dataset.baseStoreys;
          newParams.height = dataset.baseHeight;
          newParams.units = dataset.baseUnits;
        }
        const nextBaseline = TYPOLOGY_PROGRAM_BASELINES[value] || TYPOLOGY_PROGRAM_BASELINES['Educational Building'];
        setSelectedPhaseId(nextBaseline.phases[0]?.id || "1");
      }
      return newParams;
    });
  };

  const m2PerFloor = useMemo(() => {
    if (!params.storeys || params.storeys <= 0) return 0;
    return params.gia / params.storeys;
  }, [params.gia, params.storeys]);

  const labelStyle = { fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontWeight: '700', outline: 'none', background: '#fff', fontSize: '13px' };
  const readOnlyMetricStyle = { ...inputStyle, background: '#e2e8f0', borderColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '40px' }}>
      
      {/* HEADER BAR */}
      <div style={{ ...cardStyle, background: THEME.sidebar, color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <Zap color={THEME.success} fill={THEME.success} size={28} /> Quick Estimator
            </h2>
            <p style={{ opacity: 0.7, margin: '8px 0 0 0' }}>Interactive Parametric Sandbox: Modify fields to update cost and timeline.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: '8px', textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6 }}>LOGIC MODE</div>
            <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><RefreshCw size={14} /> Global Schedule Sync</div>
          </div>
        </div>
      </div>

      {/* PARAMETERS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '25px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={16} color={THEME.primary} /> Project Parameters
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* ROW 1: GROSS M2 & GROSS M3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 180px', gap: '50px' }}>
              <div>
                <label style={labelStyle}><Maximize size={12}/> Gross GIA (m²)</label>
                <input type="number" value={params.gia} onChange={(e) => updateParam('gia', parseFloat(e.target.value) || 0)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Box size={12}/> Gross Vol (m³)</label>
                <input type="number" value={params.volume} onChange={(e) => updateParam('volume', parseFloat(e.target.value) || 0)} style={inputStyle} />
              </div>
            </div>
        
            {/* ROW 2: M2/FLOOR & NUMBER OF STOREYS */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 180px', gap: '50px' }}>
              <div>
                <label style={labelStyle}><Maximize size={12}/> m² / Floor</label>
                <input type="text" disabled value={`${m2PerFloor.toFixed(1)} m²`} style={readOnlyMetricStyle} />
              </div>
              <div>
                <label style={labelStyle}><Layers size={12}/> Storeys</label>
                <input type="number" min="1" value={params.storeys} onChange={(e) => updateParam('storeys', Math.max(1, parseInt(e.target.value) || 1))} style={inputStyle} />
              </div>
            </div>
        
            <div style={{ height: '1px', background: THEME.border, margin: '5px 0' }} />
            
            {/* PERIPHERAL MEASUREMENTS */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 180px', gap: '50px' }}>
              <div><label style={labelStyle}><Edit3 size={12}/> Building Height (m)</label><input type="number" value={params.height} onChange={(e) => updateParam('height', parseFloat(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}><Home size={12}/> Unit/Room Count</label><input type="number" value={params.units} onChange={(e) => updateParam('units', parseInt(e.target.value))} style={inputStyle} /></div>
            </div>
        
          </div>
        </div>

        {/* TYPOLOGY SETUP & ORIGINAL PROJECTED HANDOVER PLACEHOLDER */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Construction size={16} color={THEME.primary} /> Setup & Data Control
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Building Model Dataset</label>
            <select style={inputStyle} value={params.type} onChange={(e) => updateParam('type', e.target.value)}>
              <option value="Single Family Home">Single Family Home</option>
              <option value="Multi-Storey Apartment">Multi-Storey Apartment</option>
              <option value="Office Building">Office Building</option>
              <option value="Educational Building">Educational Building</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}><Calendar size={12}/> Projected Start Date</label><input type="date" value={params.startDate} onChange={(e) => updateParam('startDate', e.target.value)} style={inputStyle} /></div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Structural Material</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['Concrete', 'Steel', 'Timber'].map(lvl => (
                <button key={lvl} onClick={() => updateParam('material', lvl)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${params.material === lvl ? THEME.primary : THEME.border}`, background: params.material === lvl ? THEME.primary : 'white', color: params.material === lvl ? 'white' : THEME.sidebar, fontWeight: '700', fontSize: '10px', cursor: 'pointer' }}>{lvl}</button>
              ))}
            </div>
          </div>
          
          {/* Handover block aligned to the fixed 71 weeks timeline total */}
          <div style={{ padding: '15px', background: THEME.sidebar, borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, marginBottom: '5px' }}>PROJECTED HANDOVER</div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>{results.handoverDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY CARD */}
        <div style={{ ...cardStyle, background: THEME.background, textAlign: 'center', border: `2px solid ${THEME.primary}20` }}>
          <div style={{ color: THEME.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>ESTIMATED TOTAL BUDGET</div>
          <div style={{ fontSize: '46px', fontWeight: '950', color: THEME.primary, margin: '15px 0' }}>€{results.finalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}><ShieldCheck size={16} /> DATA SYNCED</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '40px', borderTop: `1px solid ${THEME.border}`, paddingTop: '30px', marginBottom: '15px' }}>
            <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <div style={labelStyle}><HardHat size={12}/> Labor Force</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{Math.round(results.estHours).toLocaleString()} <span style={{fontSize: '12px'}}>Hrs</span></div>
            </div>
            <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <div style={labelStyle}><Clock size={12}/> Schedule</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{results.totalWeeks} <span style={{fontSize: '12px'}}>Wks</span></div>
            </div>
          </div>

          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', border: 'none', cursor: 'pointer', padding: '15px', background: THEME.sidebar, borderRadius: '12px', color: 'white', fontSize: '20px', fontWeight: '800', marginTop: '20px' }}>
            <Save size={20} color={THEME.success}/> SAVE PROJECT AS
          </button>
        </div>
      </div>

      {/* --- LIFECYCLE STAGES TIMELINE OVERVIEW --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color={THEME.primary} /> Calculated Project Timeline</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
          {results.scheduleStages.map((stage, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ height: '8px', background: stage.color, borderRadius: '10px', marginBottom: '15px' }} />
              <div style={{ fontSize: '10px', fontWeight: '900', color: THEME.sidebar, marginBottom: '5px', height: '24px' }}>{stage.name}</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: THEME.primary }}>{stage.weeks} <span style={{ fontSize: '10px', color: THEME.muted }}>WKS</span></div>
              {idx < 5 && <div style={{ position: 'absolute', right: '-15px', top: '-4px', color: THEME.border }}><ArrowRight size={16} /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* --- PARAMETRIC GANTT TIMELINE TRACKS --- */}
      <div style={{ width: '100%' }}>
        <CalculatedProjectProgram 
          selectedTypology={params.type}
          currentProjectWeeks={results.totalWeeks}
          startDate={params.startDate}
          customDataset={quickDataset}
          phaseOverrides={phaseStaffing} 
        />
      </div>

      {/* --- DIRECT LABOR OPTIMIZER WITH STANDARDIZED TRADES --- */}
      <div style={{ ...cardStyle, background: '#fff', border: `1px solid ${THEME.border}`, padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${THEME.border}` }}>
          
          {/* Left Control Panel */}
          <div style={{ width: '380px', borderRight: `1px solid ${THEME.border}`, padding: '24px', background: '#F8FAFC' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Target size={20} color={THEME.primary} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900' }}>LABOR FORCE OPTIMIZER</h3>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: THEME.muted }}>Calibrate crew constraints directly against the live project program.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Select Active Project Phase Track</label>
                <select 
                  style={inputStyle} 
                  value={selectedPhaseId} 
                  onChange={(e) => setSelectedPhaseId(e.target.value)}
                >
                  {activeTimelinePhases.map(phase => (
                    <option key={phase.id} value={phase.id}>
                      {phase.id}. {phase.phase}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Standard Specialized Worker Type</label>
                <select 
                  style={inputStyle} 
                  value={activeOptRes?.workerType || "General Laborer"} 
                  onChange={(e) => {
                    const typeValue = e.target.value;
                    setPhaseStaffing(prev => {
                      const current = prev[selectedPhaseId] || { workerCount: 4 };
                      return { ...prev, [selectedPhaseId]: { ...current, workerType: typeValue } };
                    });
                  }}
                >
                  {WORKER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Active Deployment Crew</label>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: activeOptRes?.statusColor }}>
                    {activeOptRes?.workerCount} Workers
                  </span>
                </div>
                <input 
                  type="range" min="1" max="15" step="1" 
                  value={activeOptRes?.workerCount || 4} 
                  onChange={(e) => {
                    const countValue = parseInt(e.target.value);
                    setPhaseStaffing(prev => {
                      const current = prev[selectedPhaseId] || { workerType: 'General Laborer' };
                      return { ...prev, [selectedPhaseId]: { ...current, workerCount: countValue } };
                    });
                  }}
                  style={{ width: '100%', accentColor: activeOptRes?.statusColor, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', fontWeight: '700', color: THEME.muted }}>
                  <span>1 (Delay Risk)</span>
                  <span>4 (Baseline Standard)</span>
                  <span>15 Max (Accelerate)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Metrics Tracking Module */}
          <div style={{ flex: 1, padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.05 }}><BarChart3 size={120} /></div>

             <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
                  {[...Array(15)].map((_, i) => (
                    <Users 
                      key={i} 
                      size={20} 
                      style={{ 
                        color: i < (activeOptRes?.workerCount || 0) ? activeOptRes?.statusColor : '#e2e8f0',
                        filter: i < (activeOptRes?.workerCount || 0) ? `drop-shadow(0 0 5px ${activeOptRes?.statusColor}44)` : 'none',
                        transition: 'all 0.3s ease'
                      }} 
                    />
                  ))}
                </div>
                <div style={{ position: 'relative', width: '90%', margin: '0 auto', height: '12px', background: '#f1f5f9', borderRadius: '6px' }}>
                  <div 
                    style={{ 
                      width: `${((activeOptRes?.workerCount || 4) / 15) * 100}%`, 
                      height: '100%', 
                      background: activeOptRes?.statusColor,
                      borderRadius: '6px',
                      transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }} 
                  />
                  <div style={{
                    position: 'absolute', left: `${((activeOptRes?.workerCount || 4) / 15) * 100}%`, transform: 'translateX(-50%)',
                    top: '-25px', background: activeOptRes?.statusColor, color: 'white', padding: '3px 10px', borderRadius: '4px',
                    fontSize: '9px', fontWeight: '900', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    {activeOptRes?.statusLabel}
                  </div>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                   <div style={{ background: '#f8fafc', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                     <Clock size={18} color={THEME.muted} />
                   </div>
                   <div style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, marginBottom: '4px' }}>PHASE DURATION</div>
                   <div style={{ fontSize: '24px', fontWeight: '950', color: THEME.sidebar }}>{activeOptRes?.currentDays} <span style={{fontSize: '12px'}}>Days</span></div>
                </div>

                <div style={{ 
                  background: activeOptRes?.netDays === 0 ? '#f8fafc' : (activeOptRes?.isBehind ? '#fff5f5' : `${activeOptRes?.statusColor}10`), 
                  border: `1px solid ${activeOptRes?.netDays === 0 ? THEME.border : (activeOptRes?.isBehind ? '#fee2e2' : `${activeOptRes?.statusColor}33`)}`, 
                  borderRadius: '16px', padding: '20px', textAlign: 'center' 
                }}>
                   <div style={{ 
                     background: activeOptRes?.netDays === 0 ? '#e2e8f0' : (activeOptRes?.isBehind ? '#fee2e2' : `${activeOptRes?.statusColor}22`), 
                     width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' 
                   }}>
                     {activeOptRes?.isBehind ? <TrendingUp size={18} color="#ef4444" /> : <TrendingDown size={18} color={activeOptRes?.statusColor} />}
                   </div>
                   <div style={{ fontSize: '10px', fontWeight: '800', color: activeOptRes?.isBehind ? '#ef4444' : THEME.muted, marginBottom: '4px' }}>
                     {activeOptRes?.isBehind ? "SCHEDULE DELAY" : "TIME SAVED"}
                   </div>
                   <div style={{ fontSize: '24px', fontWeight: '950', color: activeOptRes?.netDays === 0 ? THEME.sidebar : (activeOptRes?.isBehind ? '#ef4444' : activeOptRes?.statusColor) }}>
                      {activeOptRes?.netDays === 0 ? "0" : `${activeOptRes?.isBehind ? '+' : '-'}${activeOptRes?.netDays}`} <span style={{fontSize: '12px'}}>Days</span>
                   </div>
                </div>

                <div style={{ background: THEME.sidebar, borderRadius: '16px', padding: '20px', textAlign: 'center', color: 'white' }}>
                   <div style={{ background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                     <HardHat size={18} color={THEME.success} />
                   </div>
                   <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, marginBottom: '4px' }}>SIMULATED PHASE COST</div>
                   <div style={{ fontSize: '24px', fontWeight: '950', color: 'white' }}>€{activeOptRes?.totalCost.toLocaleString()}</div>
                </div>
             </div>

             <div style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', background: activeOptRes?.isBehind ? '#FFF7ED' : '#F8FAFC', border: `1px dashed ${activeOptRes?.isBehind ? '#ef4444' : THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${activeOptRes?.statusColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeOptRes?.isBehind ? <AlertTriangle color="#ef4444" size={20}/> : <ShieldCheck color={activeOptRes?.statusColor} size={20}/>}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: activeOptRes?.isBehind ? '#ef4444' : THEME.sidebar }}>
                      {activeOptRes?.isBehind ? "Schedule variance delay active on baseline track." : `Crew Configuration Status: ${activeOptRes?.statusLabel}`}
                    </div>
                    <div style={{ fontSize: '11px', color: THEME.muted }}>Changes instantly re-sequence sequential start times on the master Gantt.</div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickEstimator;