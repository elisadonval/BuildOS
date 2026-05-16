// src/constants/typologyprogram.js
import React, { useMemo } from 'react';
import { Calendar, Clock, BarChart } from 'lucide-react';

// --- 1. TYPOLOGY TIMELINE TRACK BASELINES ---
export const TYPOLOGY_PROGRAM_BASELINES = {
  "Single Family Home": {
    baseDays: 360,
    phases: [
      { id: "1", phase: "Foundations and Basement Walls", baseStart: 0, baseDuration: 35, color: "#4f46e5" },
      { id: "2", phase: "Works in Elevation and Roofing", baseStart: 35, baseDuration: 65, color: "#06b6d4" },
      { id: "3", phase: "Fillings, Ventilated Crawl Space", baseStart: 90, baseDuration: 45, color: "#f59e0b" },
      { id: "4", phase: "Partition Walls and Panels", baseStart: 115, baseDuration: 75, color: "#ec4899" },
      { id: "5", phase: "Tiles and  Channels", baseStart: 135, baseDuration: 30, color: "#10b981" },
      { id: "6", phase: "Pipes, Drains, Chimneys", baseStart: 150, baseDuration: 15, color: "#8b5cf6" },
      { id: "7", phase: "Waterproofing", baseStart: 150, baseDuration: 30, color: "#ef4444" },
      { id: "8", phase: "Plumbing and Thermal Systems", baseStart: 220, baseDuration: 50, color: "#3b82f6" },
      { id: "9", phase: "Electrical System", baseStart: 255, baseDuration: 45, color: "#6366f1" },
      { id: "10", phase: "Floors and Coverings", baseStart: 295, baseDuration: 45, color: "#14b8a6" },
      { id: "11", phase: "Windows and Doors", baseStart: 315, baseDuration: 45, color: "#f43f5e" },
      { id: "12", phase: "External Works", baseStart: 330, baseDuration: 30, color: "#64748b" }
    ]
  },
  "Multi-Storey Apartment": {
    baseDays: 320,
    phases: [
      { id: "1", phase: "Excavations and Backfills", baseStart: 0, baseDuration: 20, color: "#4f46e5" },
      { id: "2", phase: "Reinforced Concrete", baseStart: 20, baseDuration: 50, color: "#06b6d4" },
      { id: "3", phase: "Provisional Works", baseStart: 70, baseDuration: 25, color: "#64748b" },
      { id: "4", phase: "Perimeter Closures", baseStart: 95, baseDuration: 50, color: "#f59e0b" },
      { id: "5", phase: "Internal Partitions", baseStart: 145, baseDuration: 30, color: "#ec4899" },
      { id: "6", phase: "Crawl Spaces and Subfloors", baseStart: 175, baseDuration: 15, color: "#14b8a6" },
      { id: "7", phase: "Covers", baseStart: 190, baseDuration: 30, color: "#10b981" },
      { id: "8", phase: "Floorings", baseStart: 220, baseDuration: 25, color: "#3b82f6" },
      { id: "9", phase: "Finishes and Coatings", baseStart: 245, baseDuration: 35, color: "#ef4444" },
      { id: "10", phase: "Fixtures and Frames", baseStart: 280, baseDuration: 10, color: "#f43f5e" },
      { id: "11", phase: "Ceilings", baseStart: 290, baseDuration: 15, color: "#8b5cf6" },
      { id: "12", phase: "Electrical and Thermal Systems", baseStart: 305, baseDuration: 8, color: "#6366f1" },
      { id: "13", phase: "Security Systems and Elevators", baseStart: 313, baseDuration: 5, color: "#0284c7" }
    ]
  },
  "Office Building": {
    baseDays: 180,
    phases: [
      { id: "1", phase: "Provisional Works", baseStart: 0, baseDuration: 15, color: "#64748b" },
      { id: "2", phase: "Excavations and Backfills", baseStart: 15, baseDuration: 10, color: "#4f46e5" },
      { id: "3", phase: "Subfloors", baseStart: 25, baseDuration: 10, color: "#14b8a6" },
      { id: "4", phase: "Reinforced Concrete", baseStart: 35, baseDuration: 30, color: "#06b6d4" },
      { id: "5", phase: "Perimeter Closures", baseStart: 65, baseDuration: 25, color: "#f59e0b" },
      { id: "6", phase: "Internal Partitions", baseStart: 90, baseDuration: 15, color: "#ec4899" },
      { id: "7", phase: "Finishes and Coatings", baseStart: 105, baseDuration: 20, color: "#ef4444" },
      { id: "8", phase: "Fixtures and Frames", baseStart: 125, baseDuration: 7, color: "#f43f5e" },
      { id: "9", phase: "Ceilings", baseStart: 132, baseDuration: 10, color: "#8b5cf6" },
      { id: "10", phase: "Floorings", baseStart: 142, baseDuration: 15, color: "#3b82f6" },
      { id: "11", phase: "Covers", baseStart: 157, baseDuration: 15, color: "#10b981" },
      { id: "12", phase: "Electrical and Thermal Systems", baseStart: 172, baseDuration: 5, color: "#6366f1" },
      { id: "13", phase: "Security Systems and Elevators", baseStart: 177, baseDuration: 3, color: "#0284c7" }
    ]
  },
  "Educational Building": {
    baseDays: 365,
    phases: [
      { id: "1", phase: "Excavations", baseStart: 0, baseDuration: 30, color: "#4f46e5" },
      { id: "2", phase: "Structures", baseStart: 20, baseDuration: 132, color: "#06b6d4" },
      { id: "3", phase: "Masonry", baseStart: 80, baseDuration: 130, color: "#f59e0b" },
      { id: "4", phase: "Floors", baseStart: 155, baseDuration: 125, color: "#3b82f6" },
      { id: "5", phase: "Coatings", baseStart: 182, baseDuration: 110, color: "#ec4899" },
      { id: "6", phase: "Windows & Doors", baseStart: 220, baseDuration: 120, color: "#14b8a6" },
      { id: "7", phase: "Plants", baseStart: 60, baseDuration: 150, color: "#6366f1" },
      { id: "8", phase: "Finishing Systems", baseStart: 245, baseDuration: 120, color: "#f43f5e" }
    ]
  }
};

// Helper utility to safely clear linebreaks/double-spaces for seamless data cross-referencing
const normalizeStr = (str) => str ? str.replace(/\s+/g, ' ').trim().toLowerCase() : '';

// --- 2. INTEGRATED FULL-WIDTH GANTT & CAPITAL PROGRAM COMPONENT ---
export const CalculatedProjectProgram = ({ 
  selectedTypology = "Educational Building", 
  currentProjectWeeks = 52, 
  startDate = new Date().toISOString().split('T')[0],
  customDataset = null // Pass quickDataset from parent layout here
}) => {
  
  const activeBaseline = useMemo(() => {
    return TYPOLOGY_PROGRAM_BASELINES[selectedTypology] || TYPOLOGY_PROGRAM_BASELINES["Educational Building"];
  }, [selectedTypology]);

  // Compute live real-time proportional costs from matching master dataset tree configurations
  const phaseFinancials = useMemo(() => {
    if (!customDataset || !customDataset[selectedTypology]) return null;
    
    const rawPhases = customDataset[selectedTypology].phases || [];
    
    // Sum total cost baseline across entire typology array 
    const totalProjectCost = rawPhases
      .flatMap(p => p.tasks || [])
      .reduce((sum, t) => sum + (t.baseCost || 0), 0);

    return rawPhases.reduce((acc, phase) => {
      const phaseTotalCost = phase.tasks?.reduce((sum, t) => sum + (t.baseCost || 0), 0) || 0;
      const normalizedKey = normalizeStr(phase.name);
      
      acc[normalizedKey] = {
        cost: phaseTotalCost,
        weight: totalProjectCost > 0 ? (phaseTotalCost / totalProjectCost) * 100 : 0
      };
      return acc;
    }, {});
  }, [customDataset, selectedTypology]);

  const currentTotalDays = currentProjectWeeks * 7;
  const scalingFactor = currentTotalDays / activeBaseline.baseDays;

  const programData = useMemo(() => {
    const startAnchor = new Date(startDate);

    return activeBaseline.phases.map(item => {
      // Fixed: Variables renamed to cleanly match object shorthand references below
      const scaledDuration = Math.max(1, Math.round(item.baseDuration * scalingFactor));
      const scaledStartOffset = Math.round(item.baseStart * scalingFactor);
      
      const phaseStartDate = new Date(startAnchor);
      phaseStartDate.setDate(startAnchor.getDate() + scaledStartOffset);

      const phaseEndDate = new Date(phaseStartDate);
      phaseEndDate.setDate(phaseStartDate.getDate() + scaledDuration);

      // Connect financial profile matching keys seamlessly using the string cleaner
      const normalizedKey = normalizeStr(item.phase);
      const metaFinances = phaseFinancials ? phaseFinancials[normalizedKey] : null;

      return {
        ...item,
        scaledStartOffset,
        scaledDuration,
        cost: metaFinances?.cost || null,
        weightPercentage: metaFinances?.weight || null,
        displayStart: phaseStartDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
        displayEnd: phaseEndDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: '2-digit' }),
        percentageStart: (scaledStartOffset / currentTotalDays) * 100,
        percentageWidth: (scaledDuration / currentTotalDays) * 100
      };
    });
  }, [activeBaseline, scalingFactor, currentTotalDays, startDate, phaseFinancials]);

  // Generate 5 dynamic timeline ticks horizontally matching the program duration scale
  const timelineTicks = useMemo(() => {
    const segments = 5; 
    return Array.from({ length: segments + 1 }).map((_, i) => {
      const percentage = (i / segments) * 100;
      const dayOffset = Math.round((percentage / 100) * currentTotalDays);
      return { percentage, dayOffset };
    });
  }, [currentTotalDays]);

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Info Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart size={18} color="#4f46e5" /> Integrated Capital & Schedule Gantt Program
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Parametric tracks for <strong style={{ color: '#475569' }}>{selectedTypology}</strong> calibrated against baseline database speeds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
            <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Time Multiplier</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{scalingFactor.toFixed(2)}x</div>
          </div>
          <div style={{ background: '#4f46e510', padding: '6px 12px', borderRadius: '8px', border: '1px solid #4f46e520', textAlign: 'right' }}>
            <div style={{ fontSize: '9px', fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase' }}>Computed Scale</div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>{currentTotalDays} Days</div>
          </div>
        </div>
      </div>

      {/* Gantt Tracking Board */}
      <div style={{ position: 'relative', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: '750px', paddingBottom: '4px', marginRight: '15px' }}>
          
          {/* Timeline Grid Metric Axis Line */}
          <div style={{ display: 'flex', marginLeft: '260px', height: '24px', position: 'relative', borderBottom: '1px solid #cbd5e1', marginBottom: '14px' }}>
            {timelineTicks.map((tick, idx) => (
              <div key={idx} style={{ position: 'absolute', left: `${tick.percentage}%`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>Day {tick.dayOffset}</span>
                <div style={{ width: '1px', height: '4px', backgroundColor: '#cbd5e1', marginTop: '2px' }} />
              </div>
            ))}
          </div>

          {/* Gantt Sequence Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
            
            {/* Visual Guide Strips */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '260px', right: 0, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
              {timelineTicks.map((_, idx) => (
                <div key={idx} style={{ width: '1px', backgroundColor: '#f1f5f9', height: '100%' }} />
              ))}
            </div>

            {/* Render Rows Loop */}
            {programData.map((p) => (
              <div 
                key={p.id} 
                style={{ display: 'flex', alignItems: 'center', height: '40px', borderRadius: '6px', transition: 'background-color 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                
                {/* Description Column */}
                <div style={{ width: '240px', paddingRight: '10px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, background: '#fff', flexShrink: 0 }}>
                  <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 5px', borderRadius: '4px', background: `${p.color}15`, color: p.color, width: '22px', textAlign: 'center', flexShrink: 0 }}>
                    {p.id}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.phase}>
                      {p.phase}
                    </span>
                    {p.cost ? (
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b' }}>
                        €{Math.round(p.cost).toLocaleString()} • {p.weightPercentage.toFixed(1)}%
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: '500', color: '#94a3b8' }}>Proportional Track Allocation</span>
                    )}
                  </div>
                </div>

                {/* Scaled Track Bar Fill */}
                <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{
                      position: 'absolute',
                      left: `${p.percentageStart}%`,
                      width: `${p.percentageWidth}%`,
                      height: '22px',
                      backgroundColor: p.color,
                      borderRadius: '5px',
                      boxShadow: `0 2px 4px ${p.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      boxSizing: 'border-box',
                      minWidth: '32px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', overflow: 'hidden', color: '#fff', fontSize: '10px', fontWeight: '800' }}>
                      <span>{p.scaledDuration}d</span>
                      {p.percentageWidth > 18 && (
                        <span style={{ opacity: 0.85, fontSize: '9px', fontWeight: '500' }}>({p.displayStart})</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b', fontWeight: '600', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} style={{ color: '#94a3b8' }} /> Interlocking task networks scale reactively to inputs.
        </div>
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} style={{ color: '#94a3b8' }} /> Projected Finish Target: <strong style={{ color: '#334155' }}>{programData[programData.length - 1]?.displayEnd}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};