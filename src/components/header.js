import React, { useState } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { THEME } from '../constants/theme';

const Header = ({ activeTab, currentProject, username, notifications = [] }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <header style={{ 
      height: '80px', backgroundColor: 'white', borderBottom: `1px solid ${THEME.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', position: 'sticky', top: 0, zIndex: 90
    }}>
      <div style={{ fontWeight: '800', fontSize: '18px', color: THEME.sidebar }}>
        {activeTab} <span style={{ color: THEME.border, margin: '0 10px' }}>/</span> 
        <span style={{ color: THEME.primary }}>{currentProject}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowNotes(!showNotes)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <Bell size={22} color={THEME.muted} />
            {notifications.length > 0 && (
              <div style={{ 
                position: 'absolute', top: -5, right: -5, width: '16px', height: '16px', 
                backgroundColor: THEME.danger, borderRadius: '50%', color: 'white', 
                fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' 
              }}>
                {notifications.length}
              </div>
            )}
          </div>

          {showNotes && (
            <div style={{ 
              position: 'absolute', top: '40px', right: 0, width: '300px', 
              backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
              border: `1px solid ${THEME.border}`, overflow: 'hidden' 
            }}>
              <div style={{ padding: '15px', borderBottom: `1px solid ${THEME.border}`, fontWeight: '800' }}>Recent Activity</div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: THEME.muted, fontSize: '13px' }}>No new updates</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 15px', borderBottom: '1px solid #f8fafc', fontSize: '13px' }}>
                      <div style={{ fontWeight: '600' }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: THEME.muted, marginTop: '2px' }}>{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `1px solid ${THEME.border}`, paddingLeft: '25px' }}>
          <div style={{ 
            width: '38px', height: '38px', borderRadius: '12px', 
            backgroundColor: THEME.primary, color: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' 
          }}>
            {username?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800' }}>{username || 'Project Manager'}</div>
            <div style={{ fontSize: '11px', color: THEME.success, fontWeight: '700' }}>Admin Access</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;