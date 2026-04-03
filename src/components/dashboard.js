import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, ReferenceDot 
} from 'recharts';
import { 
  ShieldCheck, BarChart3, Users, AlertCircle, 
  ChevronDown, Zap, CloudSun, Wallet, HardHat, ArrowRight, Calendar, 
} from 'lucide-react';
import { THEME } from '../constants/theme';

// 1. Move helper styles to the top so they are available immediately
const selectStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: `1px solid ${THEME.border}`,
  backgroundColor: '#f8fafc',
  fontWeight: '600',
  outline: 'none'
};

const Dashboard = ({ 
  activeTab, 
  setActiveTab, 
  addBtn, 
  cardStyle, 
  overrunDays, 
  forecastDays, 
  chartData, 
  activeCrewSize, 
  inputStyle, 
  isProjectMode, 
  setProjectCrew, 
  setTaskCrew, 
  totalRiskCost 
}) => {

  // 2. Weather state must live here if you are pasting the JSX directly below
  const [weather, setWeather] = useState({
    temp: "24",
    condition: "Partly Cloudy",
    rainChance: "0%",
    isGoodForPouring: true
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/weather/milan bergamo.epw');
        if (response.ok) {
           // Logic for EPW parsing would go here
        }
      } catch (e) {
        console.error("EPW Load Error:", e);
      }
    };
    fetchWeather();
  }, []);

  const mockTasks = [
    { task: "Clearing Forests/Debris", type: "Laborers", count: 6 },
    { task: "Excavation", type: "Excavator Operators", count: 8 },
    { task: "Ground Slab", type: "Equipment Operators", count: 4 },
    { task: "External Walls", type: "Bricklayers", count: 8 },
    { task: "Floor Finishes", type: "Interior Installers", count: 18 },
  ];

  return (
  <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', gap: '25px', alignItems: 'start' }}>
    
    {/* LEFT & MIDDLE COLUMN AREA */}
    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* ROW 1: STATUS & ACCELERATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '25px' }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '14px', color: THEME.muted, textTransform: 'uppercase' }}>
            Current Project Status
          </h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>CURRENT PHASE</label>
              <select style={selectStyle}>
                <option>Phase A: Substructure</option>
                <option>Phase B: Superstructure</option>
                <option>Phase C: Internal Fit-out</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>CURRENT STATUS</label>
              <select style={selectStyle}>
                <option>🟢 Active / In Progress</option>
                <option>🟡 On Hold / Delay</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '15px' }}>
              {[1,2,3,4,5,6,7].map(i => <Users key={i} size={18} color={i <= 2 ? THEME.primary : '#e2e8f0'} />)}
          </div>
          <div style={{ position: 'relative', height: '30px', background: '#e2e8f0', borderRadius: '15px', marginBottom: '15px' }}>
              <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #059669, #fb7185)', borderRadius: '15px' }} />
              <div style={{ position: 'absolute', top: '-10px', left: '40%', background: '#059669', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900' }}>ACCELERATED</div>
          </div>
          <h2 style={{ margin: 0, color: '#059669', fontSize: '28px' }}>2.5 Days Saved</h2>
          <p style={{ margin: 0, fontSize: '13px', color: THEME.muted, fontWeight: '700' }}>Extra Worker Cost: €1,920</p>
        </div>
      </div>

      {/* ROW 2: LABOR INFORMATION */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>03 Labor Information</h3>
          <button style={{ border: `1px solid ${THEME.border}`, background: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
            + Import resource schedule .xlsx
          </button>
        </div>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color={THEME.primary} />
            <div>
              <div style={{ fontSize: '10px', color: THEME.muted, fontWeight: '800' }}>NUMBER OF WORKERS</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '18px' }}>18</strong>
                <input type="number" defaultValue="18" style={{ width: '50px', padding: '4px' }} />
              </div>
            </div>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${THEME.border}`, background: 'white' }}>
            <Calendar size={16} /> Manage Crew
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', color: THEME.muted, fontWeight: '800' }}>WORK SHIFT</div>
            <select style={{ ...selectStyle, padding: '8px' }}>
              <option>Day Shift (08:00 AM – 04:00 PM)</option>
              <option>Night Shift (04:00 PM – 08:00 PM)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '15px', padding: '0 10px 10px', borderBottom: `1px solid ${THEME.border}`, fontSize: '11px', fontWeight: '800', color: THEME.muted }}>
          <div>TASK</div>
          <div>WORKER TYPE</div>
          <div>NO. OF WORKERS</div>
        </div>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {mockTasks.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '15px', padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
              <input type="text" defaultValue={item.task} style={inputStyle} />
              <select style={inputStyle}><option>{item.type}</option></select>
              <input type="number" defaultValue={item.count} style={inputStyle} />
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
           <button style={{ border: 'none', background: 'none', color: THEME.muted }}>Clear Form</button>
           <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '10px 20px', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>Save as Draft</button>
              <button style={{ padding: '10px 20px', borderRadius: '8px', background: THEME.primary, color: 'white', border: 'none' }}>⚡ Calculate & Update</button>
           </div>
        </div>
      </div>
    </div>

    {/* COLUMN 3: RIGHT SIDEBAR */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '12px', fontSize: '11px' }}>
        <strong>✓ Date Saved</strong><br/>Today, 08:15 AM
      </div>

      <div style={{ ...cardStyle, borderTop: '4px solid #1e293b' }}>
        <h3 style={{ marginTop: 0, fontSize: '14px' }}>02 Project Details</h3>
        <label style={{ fontSize: '11px', fontWeight: '700' }}>Gross Area (Concrete Building)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0 15px' }}>
          <input type="text" value="2,450.75" style={selectStyle} />
          <span style={{ fontWeight: '700' }}>m²</span>
        </div>
        <label style={{ fontSize: '11px', fontWeight: '700' }}>Units</label>
        <select style={selectStyle}>
          <option>Square Meters (m²)</option>
        </select>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: THEME.primary }}>
          <Wallet size={20} /> <strong>Payments</strong>
        </div>
        <h4 style={{ margin: '10px 0 0 0' }}>Contract: $1,250,000</h4>
      </div>

      {/* Weather Section */}
      <div style={{ ...cardStyle, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudSun size={20} color="#1e40af" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Weather Today</h3>
          </div>
          <div style={{ backgroundColor: '#ffedd5', color: '#9a3412', padding: '4px 10px', borderRadius: '15px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CloudSun size={14} /> {weather.temp}°C
          </div>
        </div>

        <div style={{ fontSize: '15px', color: '#475569', marginBottom: '15px' }}>
          {weather.condition} • {weather.rainChance} rain
        </div>

        {weather.isGoodForPouring && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '15px' }}>
            Good for concrete pouring
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          View 7-Day Forecast <ArrowRight size={16} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;