import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Users, ShieldCheck, 
  ArrowRight, Rocket, ChevronRight, Globe,
  LayoutGrid, BarChart3, Database, Wifi, FileText,
  Activity, CloudSun, HardHat, Award, Timer, Shield,
  ArrowUpRight, Construction
} from 'lucide-react';
import { THEME } from '../constants/theme';

const Welcome = ({ setActiveTab, username, quantities }) => {
  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.4, 0.7, 0.4],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const features = [
    { title: "Parametric Estimator", desc: "Live geometry drivers linked to master datasets.", icon: <Zap size={24} />, tab: "Estimator", color: THEME.success },
    { title: "Project Hub", desc: "Phase-based breakdown of structural and MEP tasks.", icon: <Globe size={24} />, tab: "Project Hub", color: THEME.primary },
    { title: "Resource Optimizer", desc: "Intelligent labor planning and variance tracking.", icon: <Users size={24} />, tab: "Resources", color: "#4f46e5" },
    { title: "Risk Analytics", desc: "Exposure monitoring and financial forecasting.", icon: <ShieldCheck size={24} />, tab: "Metrics", color: THEME.danger }
  ];

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      style={{
        padding: '60px 40px', maxWidth: '1450px', margin: '0 auto', fontFamily: "'Inter', sans-serif",
        background: `radial-gradient(circle at 5% 5%, ${THEME.primary}10 0%, transparent 40%), radial-gradient(circle at 95% 95%, ${THEME.success}10 0%, transparent 40%)`
      }}
    >
      {/* --- SUPER HERO SECTION --- */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '80px', position: 'relative' }}>
        <motion.div 
          whileHover={{ rotate: [-1, 1, -1] }}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', 
            padding: '12px 24px', borderRadius: '100px', marginBottom: '32px', 
            border: `1.5px solid ${THEME.border}`, boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
            cursor: 'default'
          }}
        >
          <div style={{ background: THEME.primary, borderRadius: '50%', padding: '6px' }}>
            <Rocket size={16} color="white" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '900', color: THEME.sidebar, letterSpacing: '1.5px' }}>
            {username?.toUpperCase() || 'COMMANDER'} ACCESS <span style={{ color: THEME.primary, marginLeft: '8px' }}>ULTRA V2.0</span>
          </span>
        </motion.div>
        
        <h1 style={{ fontSize: '84px', fontWeight: '950', color: THEME.sidebar, lineHeight: '0.9', marginBottom: '32px', letterSpacing: '-4px' }}>
          Build Smarter. <br />
          <span style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.success}, #4f46e5)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Design Without Limits.
          </span>
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(112, 72, 169, 0.3)' }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('Project Hub')} 
            style={{ 
              background: THEME.sidebar, color: 'white', padding: '22px 48px', borderRadius: '20px', 
              border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer', 
              display: 'inline-flex', alignItems: 'center', gap: '15px', position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)', width: '200%', left: '-100%' }} />
            IGNITE PROJECT HUB <ArrowRight size={22} color={THEME.success} />
          </motion.button>
        </div>
      </motion.div>

      {/* --- THE FUN BENTO GRID --- */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', height: '540px', marginBottom: '80px' }}>
        
        {/* REPLACEMENT: SITE COMMAND CENTER (The "Full & Fun" Part) */}
        <div style={{ 
          background: 'white', borderRadius: '40px', border: `1px solid ${THEME.border}`, 
          padding: '40px', display: 'flex', gap: '30px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
           {/* Visual Progress Stack */}
           <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'flex-end' }}>
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  style={{ 
                    height: '45px', 
                    background: i > 2 ? `linear-gradient(90deg, ${THEME.primary}, #8b5cf6)` : '#f1f5f9',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', padding: '0 15px',
                    color: i > 2 ? 'white' : THEME.muted,
                    fontSize: '11px', fontWeight: '800',
                    boxShadow: i > 2 ? '0 4px 12px rgba(112, 72, 169, 0.2)' : 'none',
                    border: i > 2 ? 'none' : `1px dashed ${THEME.border}`
                  }}
                >
                  {i === 5 && "ROOF STRUCTURE"}
                  {i === 4 && "CORE CONSTRUCTION"}
                  {i === 3 && "FLOOR SLAB ACTIVE"}
                  {i < 3 && "PENDING PHASE"}
                </motion.div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                 <div style={{ fontSize: '10px', fontWeight: '900', color: THEME.primary, letterSpacing: '2px' }}>BUILDING HEIGHT MAP</div>
              </div>
           </div>

           {/* Live Feed & Stats */}
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '950', color: THEME.sidebar, margin: 0 }}>Site Command</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>SYSTEMS NOMINAL</span>
                  </div>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '16px', textAlign: 'right' }}>
                   <div style={{ fontSize: '10px', fontWeight: '900', color: THEME.muted }}>EST. COMPLETION</div>
                   <div style={{ fontSize: '16px', fontWeight: '900', color: THEME.sidebar }}>OCT 2026</div>
                </div>
              </div>

              {/* Mini Dashboard Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                 <div style={{ padding: '20px', background: `${THEME.primary}08`, borderRadius: '24px', border: `1px solid ${THEME.primary}15` }}>
                    <CloudSun size={20} color={THEME.primary} style={{ marginBottom: '10px' }}/>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: THEME.sidebar }}>18°C</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: THEME.muted }}>Clear - Optimal for Pouring</div>
                 </div>
                 <div style={{ padding: '20px', background: `${THEME.success}08`, borderRadius: '24px', border: `1px solid ${THEME.success}15` }}>
                    <Users size={20} color={THEME.success} style={{ marginBottom: '10px' }}/>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: THEME.sidebar }}>42</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: THEME.muted }}>Active Personnel On-Site</div>
                 </div>
              </div>

              {/* Activity Ticker */}
              <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '24px', padding: '20px', overflow: 'hidden' }}>
                 <div style={{ fontSize: '10px', fontWeight: '900', color: THEME.muted, marginBottom: '12px', textTransform: 'uppercase' }}>Live Site Activity</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { icon: <Timer size={14}/>, text: "Structural concrete pour Phase 2 completed", time: "12m ago" },
                      { icon: <Shield size={14}/>, text: "Safety inspection passed: Zone B", time: "1h ago" },
                      { icon: <Construction size={14}/>, text: "New delivery: Rebar Batch #402", time: "3h ago" }
                    ].map((log, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: '700', color: THEME.sidebar }}>
                        <div style={{ color: THEME.primary }}>{log.icon}</div>
                        <div style={{ flex: 1 }}>{log.text}</div>
                        <div style={{ fontSize: '10px', color: THEME.muted }}>{log.time}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           
           {/* Background Decoration */}
           <motion.div 
             variants={pulseVariants} animate="animate"
             style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: THEME.primary, filter: 'blur(80px)' }} 
           />
        </div>

        {/* SIDE COLUMN: GAMIFIED STATS */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1.2fr', gap: '30px' }}>
          
          {/* AWARD / AUTHORITY BLOCK */}
          <div style={{ 
            background: THEME.sidebar, borderRadius: '40px', padding: '32px', color: 'white', 
            position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
              style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}
            >
              <Award size={32} color={THEME.success} />
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '8px' }}>Project Authority</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: 0 }}>
              Operating under <strong>Prezzario Regionale</strong> standards. Your data is 100% validated.
            </p>
            <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.1 }}><FileText size={80} /></div>
          </div>

          {/* CONNECTIVITY HUB */}
          <div style={{ 
            background: 'white', borderRadius: '40px', border: `1px solid ${THEME.border}`, 
            padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ position: 'relative' }}>
                  <div style={{ padding: '14px', background: '#f1f5f9', borderRadius: '18px' }}><Database size={22} color={THEME.primary} /></div>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', inset: 0, border: `2px solid ${THEME.primary}`, borderRadius: '18px' }} />
               </div>
               <div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: THEME.sidebar }}>Nexus Sync</div>
                  <div style={{ fontSize: '11px', color: THEME.success, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <Wifi size={12} /> Live Link Active
                  </div>
               </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '20px', border: `1px solid ${THEME.border}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '900', color: THEME.muted, marginBottom: '10px' }}>
                  <span>SYNC INTEGRITY</span>
                  <span style={{ color: THEME.primary }}>98%</span>
               </div>
               <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 1.5 }} style={{ height: '100%', background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.success})` }} />
               </div>
            </div>

            <button style={{ 
              width: '100%', padding: '16px', borderRadius: '14px', background: THEME.lightyellow, 
              border: `1.5px solid ${THEME.success}66`, color: THEME.sidebar, fontWeight: '900', 
              fontSize: '13px', cursor: 'pointer', transition: '0.2s' 
            }}>
               REFRESH MASTER DATASET
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- QUICK ACTION TILES --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {features.map((f, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants} 
            whileHover={{ y: -12, backgroundColor: 'white', boxShadow: '0 30px 60px rgba(0,0,0,0.08)' }} 
            onClick={() => setActiveTab(f.tab)} 
            style={{ 
              padding: '40px', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.5)', 
              border: `1px solid ${THEME.border}`, cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '22px', 
              background: `${f.color}15`, color: f.color, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' 
            }}>{f.icon}</div>
            <h3 style={{ fontSize: '22px', fontWeight: '950', marginBottom: '16px', color: THEME.sidebar }}>{f.title}</h3>
            <p style={{ fontSize: '15px', color: THEME.muted, lineHeight: '1.7', marginBottom: '24px' }}>{f.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '900', color: THEME.primary, letterSpacing: '1px' }}>
              ACCESS MODULE <ArrowUpRight size={18} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Welcome;