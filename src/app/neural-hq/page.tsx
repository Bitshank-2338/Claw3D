'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { NexoraAgent, DEFAULT_AGENTS } from '@/features/neural-hq/types';
import { useAgents, useAgentStats } from '@/lib/nexora/hooks';
import { AGENT_THEMES } from '@/lib/nexora/themes';

// Dynamic import to avoid SSR issues with Three.js
const NeuralHQScene = dynamic(
  () => import('@/features/neural-hq/NeuralHQScene').then(mod => mod.NeuralHQScene),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing neural pathways...');
  
  useEffect(() => {
    const statuses = [
      'Initializing neural pathways...',
      'Connecting to The Nexus...',
      'Awakening agents...',
      'Calibrating holographics...',
      'System ready.',
    ];
    
    const interval = setInterval(() => {
      setProgress(p => {
        const newP = Math.min(p + 15 + Math.random() * 10, 100);
        const idx = Math.min(Math.floor(newP / 25), statuses.length - 1);
        setStatus(statuses[idx]);
        return newP;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">⚡</div>
        <h1>NEXORA NEURAL HQ</h1>
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }} />
        </div>
        <p>{status}</p>
      </div>
      <style jsx>{`
        .loading-screen {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #0A0A0F 0%, #12121A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F8FAFC;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .loading-content {
          text-align: center;
        }
        .loading-logo {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: pulse 2s ease-in-out infinite;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          background: linear-gradient(90deg, #06B6D4, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin: 0 auto 1rem;
          overflow: hidden;
        }
        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, #06B6D4, #8B5CF6);
          transition: width 0.3s ease;
        }
        p {
          color: #64748B;
          font-size: 0.875rem;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

function AgentPanel({ agent, onClose }: { agent: NexoraAgent; onClose: () => void }) {
  const theme = AGENT_THEMES[agent.role];
  
  return (
    <div className="agent-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="agent-header">
        <div className="agent-avatar" style={{ borderColor: theme.color, boxShadow: `0 0 20px ${theme.color}40` }}>
          <div className="avatar-core" style={{ background: theme.color }} />
        </div>
        <div>
          <h2>{agent.name}</h2>
          <span className="agent-role" style={{ color: theme.color }}>{theme.name}</span>
        </div>
      </div>
      <div className="agent-description">
        {theme.description}
      </div>
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-label">State</span>
          <span className="stat-value" style={{ 
            color: agent.state === 'alert' ? '#EF4444' : agent.state === 'working' ? '#10B981' : '#64748B' 
          }}>
            {agent.state.toUpperCase()}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Location</span>
          <span className="stat-value">{agent.currentRoom}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tasks Done</span>
          <span className="stat-value">{agent.stats.tasksCompleted}</span>
        </div>
        {agent.activity && (
          <div className="stat activity">
            <span className="stat-label">Current Task</span>
            <span className="stat-value">{agent.activity.type}: {agent.activity.target || 'Processing...'}</span>
          </div>
        )}
      </div>
      <style jsx>{`
        .agent-panel {
          position: fixed;
          top: 60px;
          right: 20px;
          width: 300px;
          background: rgba(18, 18, 26, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          color: #F8FAFC;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #64748B;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover { color: #F8FAFC; }
        .agent-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .agent-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid;
          background: rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-core {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          transform: rotate(45deg);
        }
        h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 4px;
        }
        .agent-role {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .agent-description {
          font-size: 0.8rem;
          color: #64748B;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .agent-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .stat.activity {
          flex-direction: column;
          gap: 4px;
        }
        .stat-label { 
          color: #64748B; 
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-value { 
          font-weight: 500; 
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

function StatsPanel({ agents }: { agents: NexoraAgent[] }) {
  const stats = useAgentStats(agents);
  
  return (
    <div className="stats-panel">
      <h3>HQ STATUS</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-number" style={{ color: '#10B981' }}>{stats.activeAgents}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: '#64748B' }}>{stats.idleAgents}</span>
          <span className="stat-label">Idle</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: '#EF4444' }}>{stats.alertAgents}</span>
          <span className="stat-label">Alert</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: '#06B6D4' }}>{stats.totalTasksCompleted}</span>
          <span className="stat-label">Tasks</span>
        </div>
      </div>
      <style jsx>{`
        .stats-panel {
          position: fixed;
          top: 60px;
          left: 20px;
          background: rgba(18, 18, 26, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px;
          color: #F8FAFC;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 50;
        }
        h3 {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #64748B;
          margin: 0 0 12px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
        }
        .stat-number {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .stat-label {
          font-size: 0.65rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}

function RoomNav({ currentRoom, onRoomChange }: { currentRoom: string; onRoomChange: (room: string) => void }) {
  const rooms = [
    { id: 'overview', name: 'Overview', icon: '🌐' },
    { id: 'nexus', name: 'The Nexus', icon: '⚡' },
    { id: 'citadel', name: 'The Citadel', icon: '🛡️' },
    { id: 'synapse', name: 'The Synapse', icon: '🧠' },
    { id: 'outreachMatrix', name: 'Outreach Matrix', icon: '💰' },
    { id: 'zenGarden', name: 'Zen Garden', icon: '🌿' },
  ];

  return (
    <div className="room-nav">
      {rooms.map(room => (
        <button
          key={room.id}
          className={`room-btn ${currentRoom === room.id ? 'active' : ''}`}
          onClick={() => onRoomChange(room.id)}
        >
          <span className="room-icon">{room.icon}</span>
          <span className="room-name">{room.name}</span>
        </button>
      ))}
      <style jsx>{`
        .room-nav {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          background: rgba(18, 18, 26, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 6px;
          z-index: 50;
        }
        .room-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 12px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .room-btn:hover {
          background: rgba(255,255,255,0.05);
          color: #F8FAFC;
        }
        .room-btn.active {
          background: rgba(6, 182, 212, 0.2);
          color: #06B6D4;
        }
        .room-icon { font-size: 1.25rem; }
        .room-name { font-size: 0.65rem; letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
}

function ControlsOverlay() {
  return (
    <div className="controls">
      <div className="control">
        <kbd>LMB</kbd>
        <span>Rotate</span>
      </div>
      <div className="control">
        <kbd>RMB</kbd>
        <span>Pan</span>
      </div>
      <div className="control">
        <kbd>Scroll</kbd>
        <span>Zoom</span>
      </div>
      <style jsx>{`
        .controls {
          position: fixed;
          bottom: 80px;
          right: 20px;
          display: flex;
          gap: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          color: #64748B;
          font-size: 0.7rem;
        }
        .control {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        kbd {
          background: rgba(255,255,255,0.08);
          padding: 3px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  );
}

function StatusBar({ isConnected }: { isConnected: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
        <span>{isConnected ? 'Gateway Connected' : 'Simulation Mode'}</span>
      </div>
      <div className="status-item title">
        <span>⚡ NEXORA NEURAL HQ</span>
      </div>
      <div className="status-item">
        <span>{time.toLocaleTimeString()}</span>
      </div>
      <style jsx>{`
        .status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 44px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8rem;
          color: #94A3B8;
          z-index: 100;
        }
        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-item.title {
          font-weight: 600;
          letter-spacing: 0.1em;
          background: linear-gradient(90deg, #06B6D4, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.online {
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .status-dot.offline {
          background: #F59E0B;
          box-shadow: 0 0 8px #F59E0B;
        }
      `}</style>
    </div>
  );
}

export default function NeuralHQPage() {
  const [selectedAgent, setSelectedAgent] = useState<NexoraAgent | null>(null);
  const [currentRoom, setCurrentRoom] = useState('overview');
  
  // Get gateway URL from environment (if available)
  const gatewayUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_GATEWAY_WS_URL || undefined)
    : undefined;
  
  const { agents, isConnected } = useAgents({
    gatewayUrl,
    simulateActivity: true,
  });

  // Camera positions for each room
  const cameraPresets: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
    overview: { position: [16, 14, 22], target: [12, 0, 6] },
    nexus: { position: [8, 8, 12], target: [8, 0, 5] },
    citadel: { position: [20, 6, 10], target: [20, 0, 4] },
    synapse: { position: [2, 5, 8], target: [2, 0, 2] },
    outreachMatrix: { position: [2, 6, 14], target: [2, 0, 10] },
    zenGarden: { position: [24, 5, 10], target: [24, 0, 4] },
  };

  const currentCamera = cameraPresets[currentRoom] || cameraPresets.overview;

  return (
    <div className="neural-hq">
      <StatusBar isConnected={isConnected} />
      <StatsPanel agents={agents} />
      <NeuralHQScene
        agents={agents}
        onAgentClick={(agent) => setSelectedAgent(agent)}
        selectedAgentId={selectedAgent?.id}
        cameraPosition={currentCamera.position}
        cameraTarget={currentCamera.target}
      />
      {selectedAgent && (
        <AgentPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
      <RoomNav currentRoom={currentRoom} onRoomChange={setCurrentRoom} />
      <ControlsOverlay />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #0A0A0F;
        }
        .neural-hq {
          width: 100vw;
          height: 100vh;
          background: #0A0A0F;
        }
      `}</style>
    </div>
  );
}
