import React, { useState, useMemo } from 'react';
import { 
  Zap, Maximize, Layers, Warehouse, Box, 
  Building2, HardHat, Calendar, Clock, 
  ArrowRight, ShieldCheck, Construction, 
  Ruler, Home, Edit3, RefreshCw, Info,
  Users, TrendingDown, AlertTriangle, Save, Plus,
  Target, BarChart3, ChevronRight
} from 'lucide-react';
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';
import quickDataset from '../constants/quick_dataset.json'; // Hierarchical typology JSON representation
import { CalculatedProjectProgram } from '../constants/typologyprogram';

const QuickEstimator = ({ cardStyle, grandTotal = 0, phases = [] }) => {
  // --- 1. UNIFIED PARAMETRIC STATE ---
  const [params, setParams] = useState({
    gia: 2500,        // Gross m2
    volume: 8200,     // Gross m3
    storeys: 2,       // Storeys
    wallArea: 1200,
    windowArea: 350,
    height: 7,
    units: 20,
    type: 'Educational Building',
    complexity: 'Medium',
    material: 'Concrete',
    startDate: new Date().toISOString().split('T')[0]
  });

  // --- 2. DYNAMIC CALCULATION ENGINE ---
  const results = useMemo(() => {
    // Safely load active building model dataset from your JSON tree
    const currentDataset = quickDataset[params.type] || quickDataset['Educational Building'];

    // Safe fallback profile values since material selectors are hidden/commented
    const profile = { cost: 1.0, labor: 1.0, speed: 1.0 };
    const complexityMult = params.complexity === 'High' ? 1.25 : params.complexity === 'Low' ? 0.9 : 1.0;
    
    // Core dynamic math connected to current building dataset parameters
    // Factor both Gross m2 and Gross m3 metrics into the formula calculation profile
    const areaCost = params.gia * (currentDataset.costPerM2 || 0);
    const volumeCost = params.volume * (currentDataset.costPerM3 || 0);
    
    // Total budget calculated as the average calibration baseline or customizable combination weight
    const baseCost = (areaCost + volumeCost) / 2;
    const finalBudget = baseCost * complexityMult * profile.cost;
    const estHours = params.gia * currentDataset.laborFactor * complexityMult * profile.labor;

    // Scale total timeline based on physical GIA expansion against historical baseline data speeds
    const timelineScaleFactor = (params.gia / currentDataset.baseGia) * complexityMult;
    const scaledTotalDays = currentDataset.baseDays * timelineScaleFactor;
    const totalWeeks = Math.max(4, Math.ceil((scaledTotalDays / 7) / profile.speed));
    
    const start = new Date(params.startDate);
    const handoverDate = new Date(start);
    handoverDate.setDate(start.getDate() + (totalWeeks * 7));

    // Colors mapping array for dynamic structural dataset phases
    const phaseColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#0ea5e9', '#10b981', '#f43f5e', '#64748b'];

    // A. STAGES: Gross Project Overview (Lifecycle Timeline Stage 0 to Stage 6)
    const scheduleStages = [
      { name: 'Concept / Pre-design', pct: 0.10, color: '#6366f1' },
      { name: 'Design Development', pct: 0.15, color: '#8b5cf6' },
      { name: 'Permitting / Approvals', pct: 0.15, color: '#ec4899' },
      { name: 'Procurement', pct: params.material === 'Steel' ? 0.20 : 0.10, color: '#f59e0b' },
      { name: 'Construction', pct: params.material === 'Timber' ? 0.35 : 0.45, color: THEME.primary },
      { name: 'Handover / Snagging', pct: 0.05, color: THEME.success }
    ].map(stage => ({
      ...stage,
      weeks: Math.max(1, Math.round(totalWeeks * stage.pct))
    }));

    // B. PHASES: Construction Phase Capital Allocation (Tied directly to quick_dataset.json typology)
    const constructionPhases = (currentDataset.phases || []).map((phase, idx) => {
      const baselinePhasePct = currentDataset.baseDays > 0 ? (phase.baseDuration / currentDataset.baseDays) : 0.15;
      
      // Sum up individual task percentages from quick_dataset.json for this phase
      const phaseCostPct = (phase.tasks || []).reduce((sum, task) => sum + (task.percentage || 0), 0);
      const phaseCost = finalBudget * phaseCostPct;
      
      return {
        name: phase.name,
        pct: baselinePhasePct,
        color: phaseColors[idx % phaseColors.length],
        weeks: Math.max(1, Math.round(totalWeeks * baselinePhasePct)),
        cost: phaseCost
      };
    });

    return { finalBudget, estHours, totalWeeks, scheduleStages, constructionPhases, handoverDate };
  }, [params]);

  const updateParam = (key, value) => {
    setParams(prev => {
      const newParams = { ...prev, [key]: value };
      
      // Auto-recalibrate proportional parameters if scaling physical profiles manually
      if (key === 'gia' || key === 'storeys') {
        newParams.height = newParams.storeys * 3.5;
        newParams.units = Math.max(1, Math.floor(newParams.gia / 110));
      }
      
      // Auto-snap parameter configurations completely to live dataset defaults when building type is switched
      if (key === 'type') {
        const dataset = quickDataset[value];
        if (dataset) {
          newParams.gia = dataset.baseGia;
          newParams.volume = dataset.baseVolume;
          newParams.storeys = dataset.baseStoreys;
          newParams.height = dataset.baseHeight;
          newParams.units = dataset.baseUnits;
          
          // Fallback defaults for peripheral areas if building structural sizes scale down
          newParams.wallArea = value === 'Single Family Home' ? 150 : (value === 'Multi-Storey Apartment' ? 600 : 1200);
          newParams.windowArea = value === 'Single Family Home' ? 40 : (value === 'Multi-Storey Apartment' ? 180 : 350);
        }
      }
      return newParams;
    });
  };

  // --- 3. LABOR FORCE OPTIMIZER STATE ---
  const [optimizer, setOptimizer] = useState({
    task: libraryData?.filter(i => i.Category === 'Labor')[0]?.Task || '',
    role: libraryData?.filter(i => i.Category === 'Labor')[0]?.Identifier || '',
    workerCount: 4
  });

  // Derived parameter calculation rule: m2 per floor = gross m2 / storeys
  const m2PerFloor = useMemo(() => {
    if (!params.storeys || params.storeys <= 0) return 0;
    return params.gia / params.storeys;
  }, [params.gia, params.storeys]);

  // STYLES
  const labelStyle = { fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontWeight: '700', outline: 'none', background: '#fff', fontSize: '13px', transition: 'all 0.2s' };
  const editableMetricStyle = { ...inputStyle, background: '#f0f9ff', borderColor: '#bae6fd' };
  const readOnlyMetricStyle = { ...inputStyle, background: '#e2e8f0', borderColor: '#cbd5e1', color: '#64748b', cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '40px' }}>
      
      {/* --- SECTION 1: QUICK ESTIMATOR HEADER --- */}
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
            <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}><RefreshCw size={14} /> Real-time Calculation Sync</div>
          </div>
        </div>
      </div>

      {/* PARAMETERS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '25px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ruler size={16} color={THEME.primary} /> PHYSICAL SCALE & OVERRIDES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* ROW 1: GROSS M2 & GROSS M3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #e2e8f0' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}><Edit3 size={12}/> Bldg Height (m)</label><input type="number" value={params.height} onChange={(e) => updateParam('height', parseFloat(e.target.value))} style={editableMetricStyle} /></div>
              <div><label style={labelStyle}><Home size={12}/> Unit/Room Count</label><input type="number" value={params.units} onChange={(e) => updateParam('units', parseInt(e.target.value))} style={editableMetricStyle} /></div>
            </div>

          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Construction size={16} color={THEME.primary} /> SETUP & DATE CONTROL
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Building Model Dataset</label>
            <select style={inputStyle} value={params.type} onChange={(e) => updateParam('type', e.target.value)}>
              <option value="Educational Building">Educational Building</option>
              <option value="Office Building">Office Building</option>
              <option value="Multi-Storey Apartment">Multi-Storey Apartment</option>
              <option value="Single Family Home">Single Family Home</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}><Calendar size={12}/> Projected Start Date</label><input type="date" value={params.startDate} onChange={(e) => updateParam('startDate', e.target.value)} style={inputStyle} /></div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Complexity Level</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['Low', 'Medium', 'High'].map(lvl => (
                <button key={lvl} onClick={() => updateParam('complexity', lvl)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${params.complexity === lvl ? THEME.primary : THEME.border}`, background: params.complexity === lvl ? THEME.primary : 'white', color: params.complexity === lvl ? 'white' : THEME.sidebar, fontWeight: '700', fontSize: '10px', cursor: 'pointer' }}>{lvl}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '15px', background: THEME.sidebar, borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6, marginBottom: '5px' }}>PROJECTED HANDOVER</div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>{results.handoverDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <div style={{ ...cardStyle, background: THEME.background, textAlign: 'center', border: `2px solid ${THEME.primary}20` }}>
          <div style={{ color: THEME.muted, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>ESTIMATED TOTAL BUDGET</div>
          <div style={{ fontSize: '46px', fontWeight: '950', color: THEME.primary, margin: '15px 0' }}>€{results.finalBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}><ShieldCheck size={16} /> DATA SYNCED</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '40px', borderTop: `1px solid ${THEME.border}`, paddingTop: '30px' }}>
            <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <div style={labelStyle}><HardHat size={12}/> Labor Force</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{Math.round(results.estHours).toLocaleString()} <span style={{fontSize: '12px'}}>Hrs</span></div>
            </div>
            <div style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <div style={labelStyle}><Clock size={12}/> Schedule</div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>{results.totalWeeks} <span style={{fontSize: '12px'}}>Wks</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: FULL WIDTH PARAMETRIC GANTT TIMELINE --- */}
      <div style={{ width: '100%' }}>
        <CalculatedProjectProgram 
          selectedTypology={params.type}
          currentProjectWeeks={results.totalWeeks}
          startDate={params.startDate}
          customDataset={quickDataset}
        />
      </div>

      {/* --- SECTION 2: CALCULATED PROJECT TIMELINE (STAGES Lifecycle) --- */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color={THEME.primary} /> CALCULATED PROJECT TIMELINE</h3>
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

    </div>
  );
};

export default QuickEstimator;