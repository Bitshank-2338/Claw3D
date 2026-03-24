'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { NexoraAgent, DEFAULT_AGENTS } from '@/features/neural-hq/types';

// Dynamic import to avoid SSR issues with Three.js
const NeuralHQScene = dynamic(
  () => import('@/features/neural-hq/NeuralHQScene').then(mod => mod.NeuralHQScene),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">⚡</div>
        <h1>NEXORA NEURAL HQ</h1>
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
        <p>Initializing neural pathways...</p>
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
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 1px;
          margin: 0 auto 1rem;
          overflow: hidden;
        }
        .loading-progress {
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, #06B6D4, #8B5CF6);
          animation: loading 1.5s ease-in-out infinite;
        }
        p {
          color: #64748B;
          font-size: 0.875rem;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

function AgentPanel({ agent, onClose }: { agent: NexoraAgent; onClose: () => void }) {
  const roleColors: Record<string, string> = {
    pm: '#3B82F6',
    developer: '#06B6D4',
    security: '#EF4444',
    sales: '#F59E0B',
    hr_ops: '#8B5CF6',
    life_admin: '#14B8A6',
  };

  return (
    <div className="agent-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="agent-header">
        <div className="agent-avatar" style={{ borderColor: roleColors[agent.role] }} />
        <div>
          <h2>{agent.name}</h2>
          <span className="agent-role">{agent.role.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-label">State</span>
          <span className="stat-value" style={{ color: agent.state === 'alert' ? '#EF4444' : '#10B981' }}>
            {agent.state.toUpperCase()}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Room</span>
          <span className="stat-value">{agent.currentRoom}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tasks</span>
          <span className="stat-value">{agent.stats.tasksCompleted}</span>
        </div>
      </div>
      <style jsx>{`
        .agent-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 280px;
          background: rgba(18, 18, 26, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 20px;
          color: #F8FAFC;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 100;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #64748B;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .close-btn:hover { color: #F8FAFC; }
        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .agent-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid;
          background: rgba(255,255,255,0.05);
        }
        h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }
        .agent-role {
          font-size: 0.7rem;
          color: #64748B;
          letter-spacing: 0.1em;
        }
        .agent-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stat {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
        }
        .stat-label { color: #64748B; font-size: 0.875rem; }
        .stat-value { font-weight: 500; font-size: 0.875rem; }
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
          bottom: 20px;
          left: 20px;
          display: flex;
          gap: 16px;
          font-family: 'Inter', system-ui, sans-serif;
          color: #64748B;
          font-size: 0.75rem;
        }
        .control {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        kbd {
          background: rgba(255,255,255,0.1);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-dot online" />
        <span>All Systems Operational</span>
      </div>
      <div className="status-item">
        <span>⚡ Nexora Neural HQ</span>
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
          height: 40px;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 0.8rem;
          color: #94A3B8;
          z-index: 50;
        }
        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
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
      `}</style>
    </div>
  );
}

export default function NeuralHQPage() {
  const [selectedAgent, setSelectedAgent] = useState<NexoraAgent | null>(null);
  const [agents, setAgents] = useState<NexoraAgent[]>(() =>
    DEFAULT_AGENTS.map((a, i) => ({ ...a, id: `agent-${i}` }))
  );

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Random state changes
        if (Math.random() > 0.95) {
          const states: Array<'idle' | 'working' | 'alert'> = ['idle', 'working', 'alert'];
          const weights = [0.3, 0.65, 0.05];
          let r = Math.random();
          let newState = 'idle';
          for (let i = 0; i < states.length; i++) {
            r -= weights[i];
            if (r <= 0) {
              newState = states[i];
              break;
            }
          }
          return {
            ...agent,
            state: newState as 'idle' | 'working' | 'alert',
            glowIntensity: newState === 'alert' ? 1.2 : newState === 'working' ? 0.8 : 0.3,
          };
        }
        return agent;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="neural-hq">
      <StatusBar />
      <NeuralHQScene
        agents={agents}
        onAgentClick={(agent) => setSelectedAgent(agent)}
        selectedAgentId={selectedAgent?.id}
      />
      {selectedAgent && (
        <AgentPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
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
