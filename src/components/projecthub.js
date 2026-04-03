import React from 'react';
import { Box, ChevronLeft, Trash2, FileUp } from 'lucide-react';
import { THEME } from '../constants/theme';

const ProjectHub = ({ 
  viewMode, 
  setViewMode, 
  cardStyle, 
  setCurrentProject, 
  currentProject, 
  phases 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {viewMode === 'list' ? (
        <>
          {/* --- EXISTING PROJECTS --- */}
          <div style={cardStyle}>
            <h3 style={{ margin: 0, marginBottom: '20px' }}>Existing Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {['Viale Mugello', 'Porta Nuova Center', 'Navigli Waterfront', 'CityLife Tower'].map(proj => (
                <div 
                  key={proj} 
                  onClick={() => { setCurrentProject(proj); setViewMode('detail'); }}
                  style={{ padding: '10px 20px', borderRadius: '16px', border: `1px solid ${THEME.border}`, backgroundColor: 'white', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: '800', color: THEME.text }}>{proj}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: THEME.primary, fontWeight: '700' }}>Open Architecture →</div>
                </div>
              ))}
            </div>
          </div>

          {/* --- START NEW PROJECT TRACKING --- */}
          <div style={{ ...cardStyle, borderLeft: `8px solid ${THEME.primary}` }}>
            <h3>Start New Project Tracking</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '20px' }}>
              {['Steel', 'Concrete', 'Timber', 'Scratch'].map(type => (
                <div key={type} style={{ padding: '20px', border: `2px solid ${THEME.border}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                  <Box size={24} style={{ marginBottom: '10px', margin: '0 auto' }}/> 
                  <div style={{ fontWeight: '800' }}>{type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* --- GANTT UPLOAD WIDGET (Added here) --- */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FileUp size={22} color={THEME.primary} />
              <h3 style={{ margin: 0 }}>Import from Gantt Chart</h3>
            </div>
            <div style={{ 
              border: `2px dashed ${THEME.border}`, padding: '30px', textAlign: 'center', 
              borderRadius: '15px', backgroundColor: '#f8fafc', cursor: 'pointer' 
            }}>
              <p style={{ color: THEME.muted, fontSize: '14px' }}>Drag and drop your MPP or CSV schedule here</p>
            </div>
          </div>
        </>
      ) : (
        /* --- DETAIL VIEW --- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: THEME.muted }}>
            <ChevronLeft size={20}/> Back to Project Hub
          </button>
          <div style={cardStyle}>
            <h3>Project Information: {currentProject}</h3>
            {phases.map(phase => (
              <div key={phase.id} style={{ marginBottom: '20px', border: `1px solid ${THEME.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '20px', backgroundColor: '#fcfcfd', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '800' }}>{phase.name}</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {phase.tasks.map(t => (
                        <tr key={t.id} style={{ borderTop: `1px solid #f1f5f9` }}>
                          <td style={{ padding: '18px 0', color: THEME.primary, fontWeight: '700' }}>{t.name}</td>
                          <td>{t.rate} €/hr</td>
                          <td style={{ textAlign: 'right' }}><Trash2 size={18} color={THEME.danger} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHub;