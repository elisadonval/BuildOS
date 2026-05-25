import React, { useState, useEffect, useMemo } from 'react';
import { 
  CloudSun, Users, MapPin, TrendingUp, ExternalLink, 
  Timer, Thermometer, Wind, Droplets, Zap, Maximize, Layers, Warehouse, Box, 
  Building2, HardHat, Calendar, Clock, 
  ArrowRight, ShieldCheck, Construction, 
  Ruler, Home, Edit3, RefreshCw, Info,
  TrendingDown, AlertTriangle, Save, Plus,
  Target, BarChart3, ChevronRight 
} from 'lucide-react';
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';

const Dashboard = ({
  cardStyle, projectData, setProjectData,
  grandTotal, phases, projectStatus, setProjectStatus,
  overrunDays, setOverrunDays, onSave
}) => {
  const [city, setCity] = useState('Milan');
  const [weather, setWeather] = useState({ 
    temp: "22", condition: "Sunny", wind: "10km/h", humidity: "45%", forecast: "Clear Skies" 
  });

  useEffect(() => {
    const lombardiaWeatherData = {
      'Milan': { temp: "22", wind: "8km/h", humidity: "48%", forecast: "Clear Skies" },
      'Bergamo': { temp: "19", wind: "14km/h", humidity: "55%", forecast: "Mountain Breeze" },
      'Brescia': { temp: "21", wind: "11km/h", humidity: "52%", forecast: "Partly Cloudy" },
      'Como': { temp: "18", wind: "18km/h", humidity: "65%", forecast: "Lake Mist" },
      'Monza': { temp: "23", wind: "9km/h", humidity: "46%", forecast: "Sunny" },
      'Varese': { temp: "17", wind: "20km/h", humidity: "60%", forecast: "Gusty Winds" }
    };
    if (lombardiaWeatherData[city]) setWeather(prev => ({ ...prev, ...lombardiaWeatherData[city] }));
  }, [city]);

  const burnPerDay = grandTotal * 0.0008;
  const riskExposure = overrunDays > 0 ? (overrunDays * burnPerDay) : 0;
  const currentTotalValuation = grandTotal + riskExposure;
  
  // Checking budget overruns (Turns text red if valuation goes past grandTotal budget base)
  const isOverBudget = currentTotalValuation > grandTotal;

  const craneRisk = parseInt(weather.wind) > 15 ? 'CAUTION' : 'LOW';
  const curingRisk = parseInt(weather.temp) > 30 ? 'CRITICAL' : 'OPTIMAL';
  const evapRate = parseInt(weather.humidity) < 30 ? 'High' : 'Normal';

  const [optimizer, setOptimizer] = useState({
    task: libraryData.filter(i => i.Category === 'Labor')[0]?.Task || '',
    role: libraryData.filter(i => i.Category === 'Labor')[0]?.Identifier || '',
    workerCount: 4
  });

  const optRes = useMemo(() => {
    const selectedItem = libraryData.find(i => i.Identifier === optimizer.role);
    const baseRate = selectedItem?.['Price (€)'] || 55;
    const minRequired = 2; 
    const baseDays = 12; 
    const currentDays = Math.max(1.5, baseDays / (optimizer.workerCount / minRequired));
    const totalCost = optimizer.workerCount * currentDays * 8 * baseRate;
    const timeSaved = Math.max(0, baseDays - currentDays);
    
    let statusColor = '#ef4444'; 
    let statusLabel = 'INSUFFICIENT';
    if (optimizer.workerCount >= minRequired) {
      statusColor = '#f59e0b'; 
      statusLabel = 'OPTIMAL';
    }
    if (timeSaved > 4) {
      statusColor = '#10b981'; 
      statusLabel = 'ACCELERATED';
    }

    return { 
      minRequired, currentDays, totalCost, timeSaved,
      isUnderstaffed: optimizer.workerCount < minRequired,
      statusColor,
      statusLabel
    };
  }, [optimizer]);

  // STYLES
  const labelStyle = { fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontWeight: '700', outline: 'none', background: '#fff', fontSize: '13px', transition: 'all 0.2s' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* --- ROW 1: VALUATION & RESOURCE ACCELERATION MODULE --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '20px' }}>
        
        {/* Left Side: Live Project Valuation Card */}
        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${THEME.sidebar} 0%, #1e1b4b 100%)`, color: 'white', padding: '30px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
              <Timer color={THEME.green} size={28} /> Detail Estimator
            </h2>
            {/* Dropdown work state toggle */}
              {/* Dropdown work state toggle */}
              <select 
                value={projectStatus} 
                onChange={(e) => setProjectStatus(e.target.value)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: projectStatus === 'Active' ? THEME.green : projectStatus === 'Hold' ? THEME.success : projectStatus === 'Stopped' ? THEME.danger : 'white', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  padding: '6px 35px 6px 14px', // 28px right padding keeps text from overlapping our new custom arrow
                  borderRadius: '20px', 
                  fontSize: '11px', 
                  fontWeight: '800', 
                  outline: 'none', 
                  cursor: 'pointer',
                  WebkitAppearance: 'none', // Hides default arrow in Chrome/Safari
                  MozAppearance: 'none',    // Hides default arrow in Firefox
                  appearance: 'none',       // Hides default arrow in modern browsers
                  // Injects a custom white down arrow SVG, positioned 12px from the right, centered vertically:
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center' // Moves the arrow 12px away from the right edge
                }}
              >
                <option value="Active" style={{ color: '#334155' }}>ACTIVE</option>
                <option value="Hold" style={{ color: '#334155' }}>HOLD</option>
                <option value="Stopped" style={{ color: '#334155' }}>STOPPED</option>
              </select>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: '950', margin: '25px 0 15px 0', letterSpacing: '-1.5px' }}>
              €{currentTotalValuation.toLocaleString()}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: isOverBudget ? '#ef4444' : THEME.green, fontWeight: '700', transition: 'color 0.3s' }}>
                ● BASE BUDGET: €{grandTotal.toLocaleString()} {isOverBudget && '(OVER BUDGET TARGET)'}
              </div>
              {overrunDays > 0 && <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '700' }}>● RISK EXPOSURE: +€{riskExposure.toLocaleString()}</div>}
            </div>
          </div>
          <TrendingUp size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05, color: 'white' }} />
        </div>

        {/* Right Side: Your Exact Labor Visual Metrics Card */}
        <div style={{ ...cardStyle, background: '#fff', border: `1px solid ${THEME.border}`, padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Background Decoration */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.05 }}><BarChart3 size={120} /></div>

          {/* GRAPHIC ACCELERATION MODULE */}
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
              {[...Array(15)].map((_, i) => (
                <Users 
                  key={i} 
                  size={20} 
                  style={{ 
                    color: i < optimizer.workerCount ? optRes.statusColor : '#e2e8f0',
                    filter: i < optimizer.workerCount ? `drop-shadow(0 0 5px ${optRes.statusColor}44)` : 'none',
                    transition: 'all 0.3s ease'
                  }} 
                />
              ))}
            </div>
            <div style={{ position: 'relative', width: '90%', margin: '0 auto', height: '12px', background: '#f1f5f9', borderRadius: '6px' }}>
              <div 
                style={{ 
                  width: `${(optimizer.workerCount / 15) * 100}%`, 
                  height: '100%', 
                  background: optRes.statusColor,
                  borderRadius: '6px',
                  transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} 
              />
              {/* Floating Label */}
              <div style={{
                position: 'absolute', left: `${(optimizer.workerCount / 15) * 100}%`, transform: 'translateX(-50%)',
                top: '-25px', background: optRes.statusColor, color: 'white', padding: '3px 5px', borderRadius: '4px',
                fontSize: '9px', fontWeight: '900', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                {optRes.statusLabel}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {/* Duration Card */}
            <div style={{ background: '#fff', border: `1px solid ${THEME.border}`, borderRadius: '10px', padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Clock size={16} color={THEME.muted} />
                 <div style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, whiteSpace: 'nowrap' }}>EST. DURATION</div>
               </div>
               <div style={{ fontSize: '20px', fontWeight: '950', color: THEME.sidebar, whiteSpace: 'nowrap' }}>{optRes.currentDays.toFixed(1)} <span style={{fontSize: '12px'}}>Days</span></div>
            </div>

            {/* Efficiency Card */}
            <div style={{ background: `${optRes.statusColor}10`, border: `1px solid ${optRes.statusColor}33`, borderRadius: '10px', padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <TrendingDown size={16} color={optRes.statusColor} />
                 <div style={{ fontSize: '10px', fontWeight: '800', color: optRes.statusColor, whiteSpace: 'nowrap' }}>TIME SAVED</div>
               </div>
               <div style={{ fontSize: '20px', fontWeight: '950', color: optRes.statusColor, whiteSpace: 'nowrap' }}>{optRes.timeSaved.toFixed(1)} <span style={{fontSize: '12px'}}>Days</span></div>
            </div>

            {/* Cost Card */}
            <div style={{ background: THEME.sidebar, borderRadius: '10px', padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <HardHat size={16} color={THEME.success} />
                 <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.8, whiteSpace: 'nowrap' }}>SIMULATED COST</div>
               </div>
               <div style={{ fontSize: '20px', fontWeight: '950', color: 'white', whiteSpace: 'nowrap' }}>€{optRes.totalCost.toLocaleString()}</div>
            </div>
          </div>

        </div>
      </div>

      {/* --- ROW 2: SITE ENVIRONMENTAL REPORT --- */}
      <div style={{ ...cardStyle, background: '#f8fafc', padding: '25px', border: `1px solid ${THEME.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: '800' }}>
              <CloudSun color={THEME.primary} /> Site Environmental Report
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff', border: `1px solid ${THEME.border}`, padding: '4px 10px', borderRadius: '8px' }}>
              <MapPin size={14} color={THEME.muted} />
              <select value={city} onChange={(e) => setCity(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}>
                {['Milan', 'Bergamo', 'Brescia', 'Como', 'Monza', 'Varese'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <a href={`https://openweathermap.org/find?q=${city},IT`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: THEME.primary, textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Full Forecast <ExternalLink size={12}/>
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, fontSize: '11px', fontWeight: '800' }}><Thermometer size={14}/> AIR TEMP</div>
            <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '5px' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '10px', color: curingRisk === 'OPTIMAL' ? '#10b981' : '#ef4444', fontWeight: '700', marginTop: '4px' }}>CONCRETE: {curingRisk}</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, fontSize: '11px', fontWeight: '800' }}><Wind size={14}/> WIND SPEED</div>
            <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '5px' }}>{weather.wind}</div>
            <div style={{ fontSize: '10px', color: craneRisk === 'LOW' ? '#10b981' : '#ef4444', fontWeight: '700', marginTop: '4px' }}>CRANE RISK: {craneRisk}</div>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: THEME.muted, fontSize: '11px', fontWeight: '800' }}><Droplets size={14}/> HUMIDITY</div>
            <div style={{ fontSize: '22px', fontWeight: '900', marginTop: '5px' }}>{weather.humidity}</div>
            <div style={{ fontSize: '10px', color: THEME.muted, marginTop: '4px' }}>Evaporation Rate: {evapRate}</div>
          </div>
          <div style={{ background: THEME.sidebar, color: 'white', padding: '15px', borderRadius: '15px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6 }}>LOMBARDIA FORECAST</div>
            <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '5px' }}>{weather.forecast}</div>
            <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: '700', marginTop: '4px' }}>PRO-TIP: Seal Partition Openings</div>
          </div>
        </div>
      </div>

      {/* --- ROW 3: ALLOCATION, PARAMETERS & INPUT CONFIGURATOR --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1.2fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Capital Allocation Block */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '800' }}>Capital Allocation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {phases.map(phase => (
              <div key={phase.id} style={{ padding: '8px 12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                  <span style={{ color: THEME.sidebar }}>{phase.name}</span>
                  <span>€{phase.totalCost.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${(phase.totalCost / grandTotal) * 100}%`, height: '100%', background: THEME.primary }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Parameters Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ ...cardStyle, padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 15px 0' }}>Project Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Building Typology Dropdown */}
              <div style={{ borderRadius: '10px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: THEME.muted, display: 'block', marginBottom: '4px' }}>
                  BUILDING TYPOLOGY
                </label>
                <select
                  value={projectData.typology || 'Single Family Home'}
                  onChange={(e) => setProjectData({ ...projectData, typology: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Apartment Building">Apartment Building</option>
                  <option value="Office">Office</option>
                  <option value="School">School</option>
                </select>
              </div>

              {/* Numerical Inputs Loop */}
              {[
                { label: 'GIA (m²)', key: 'gia' }, 
                { label: 'STOREYS', key: 'storeys' }, 
                { label: 'WALL AREA (m²)', key: 'wallArea' }, 
                { label: 'WINDOW AREA (m²)', key: 'windowArea' }
              ].map(spec => (
                <div key={spec.key} >
                  <label style={{ fontSize: '9px', fontWeight: '900', color: THEME.muted, display: 'block', marginBottom: '2px' }}>{spec.label}</label>
                  <input 
                    type="number" 
                    value={projectData[spec.key]} 
                    onChange={(e) => setProjectData({...projectData, [spec.key]: parseFloat(e.target.value) || 0})} 
                    style={{ width: '250px', padding: '12px', borderRadius: '10px', border: `1px solid ${THEME.border}`, fontWeight: '700', outline: 'none', background: '#fff', fontSize: '13px', transition: 'all 0.2s'}}
                  />
                </div>
              ))}
              
            </div>
          </div>
          <button onClick={onSave} style={{ background: THEME.primary, color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: '900', cursor: 'pointer', boxShadow: `0 4px 12px ${THEME.primary}33` }}>
            SYNC DATA
          </button>
        </div>

        {/* Resource Optimizer Controls Side-Panel */}
        <div style={{ ...cardStyle, background: '#fff', border: `1px solid ${THEME.border}`, padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Target size={18} color={THEME.primary} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Resource Optimizer</h3>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: THEME.muted }}>Simulate task workflows & crew deployments.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Task Selection</label>
              <select style={inputStyle} value={optimizer.task} onChange={(e) => setOptimizer({...optimizer, task: e.target.value})}>
                {[...new Set(libraryData.filter(i => i.Category === 'Labor').map(i => i.Task))].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Primary Trade Role</label>
              <select style={inputStyle} value={optimizer.role} onChange={(e) => setOptimizer({...optimizer, role: e.target.value})}>
                {libraryData.filter(i => i.Category === 'Labor' && i.Task === optimizer.task).map(i => (
                  <option key={i.Identifier} value={i.Identifier}>{i.Identifier}</option>
                ))}
              </select>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: `1px solid ${THEME.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Deployment Size</label>
                <span style={{ fontSize: '13px', fontWeight: '900', color: optRes.statusColor }}>{optimizer.workerCount} Workers</span>
              </div>
              <input 
                type="range" min="1" max="15" step="1" 
                value={optimizer.workerCount} 
                onChange={(e) => setOptimizer({...optimizer, workerCount: parseInt(e.target.value)})}
                style={{ width: '100%', accentColor: optRes.statusColor, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontWeight: '700', color: THEME.muted }}>
                <span>1 Person</span>
                <span>15 Max</span>
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', background: optRes.isUnderstaffed ? '#FFF7ED' : '#F8FAFC', border: `1px dashed ${optRes.isUnderstaffed ? '#ef4444' : THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${optRes.statusColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {optRes.isUnderstaffed ? <AlertTriangle color="#ef4444" size={20}/> : <ShieldCheck color={optRes.statusColor} size={20}/>}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: optRes.isUnderstaffed ? '#ef4444' : THEME.sidebar }}>
                  {optRes.isUnderstaffed ? "Staffing Alert: Below minimum safety threshold" : `Deployment: ${optRes.statusLabel}`}
                </div>
                <div style={{ fontSize: '11px', color: THEME.muted }}>Required Crew: {optRes.minRequired} Persons</div>
              </div>
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;