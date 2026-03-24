/**
 * NEXORA NEURAL HQ - React Hooks
 * Custom hooks for agent state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { NexoraAgent, DEFAULT_AGENTS, AgentState } from '@/features/neural-hq/types';
import { GatewayConnection, AgentEvent, GatewayConfig, initGateway } from './gateway';

export interface UseAgentsOptions {
  gatewayUrl?: string;
  gatewayToken?: string;
  simulateActivity?: boolean;
}

export function useAgents(options: UseAgentsOptions = {}) {
  const { gatewayUrl, gatewayToken, simulateActivity = true } = options;
  
  const [agents, setAgents] = useState<NexoraAgent[]>(() =>
    DEFAULT_AGENTS.map((a, i) => ({ ...a, id: `agent-${i}` }))
  );
  const [isConnected, setIsConnected] = useState(false);
  const gatewayRef = useRef<GatewayConnection | null>(null);

  // Handle agent events from gateway
  const handleAgentEvent = useCallback((event: AgentEvent) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== event.agentId && agent.role !== event.agentId) {
        return agent;
      }

      const updates: Partial<NexoraAgent> = {};

      if (event.data.state) {
        updates.state = event.data.state;
        updates.glowIntensity = 
          event.data.state === 'alert' ? 1.2 :
          event.data.state === 'working' ? 0.8 : 0.3;
      }

      if (event.data.activity) {
        updates.activity = event.data.activity;
      }

      if (event.data.position) {
        updates.position = {
          ...agent.position,
          ...event.data.position,
        };
      }

      if (event.data.room) {
        updates.currentRoom = event.data.room;
      }

      return { ...agent, ...updates };
    }));
  }, []);

  // Connect to gateway
  useEffect(() => {
    if (!gatewayUrl) return;

    const gateway = initGateway({
      url: gatewayUrl,
      token: gatewayToken,
    });
    gatewayRef.current = gateway;

    gateway.connect()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));

    const unsubscribe = gateway.subscribe(handleAgentEvent);

    return () => {
      unsubscribe();
      gateway.disconnect();
    };
  }, [gatewayUrl, gatewayToken, handleAgentEvent]);

  // Simulate activity when not connected to gateway
  useEffect(() => {
    if (isConnected || !simulateActivity) return;

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        // Random state changes (5% chance per tick)
        if (Math.random() > 0.95) {
          const states: AgentState[] = ['idle', 'working', 'alert'];
          const weights = [0.3, 0.65, 0.05];
          let r = Math.random();
          let newState: AgentState = 'idle';
          
          for (let i = 0; i < states.length; i++) {
            r -= weights[i];
            if (r <= 0) {
              newState = states[i];
              break;
            }
          }

          return {
            ...agent,
            state: newState,
            glowIntensity: 
              newState === 'alert' ? 1.2 :
              newState === 'working' ? 0.8 : 0.3,
            stats: {
              ...agent.stats,
              tasksCompleted: agent.stats.tasksCompleted + (newState === 'working' ? 0 : Math.random() > 0.5 ? 1 : 0),
              lastActivity: Date.now(),
            },
          };
        }
        return agent;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected, simulateActivity]);

  // Update agent manually
  const updateAgent = useCallback((agentId: string, updates: Partial<NexoraAgent>) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // Trigger alert for an agent
  const alertAgent = useCallback((agentId: string, message?: string) => {
    updateAgent(agentId, {
      state: 'alert',
      glowIntensity: 1.2,
    });

    // Auto-clear alert after 5 seconds
    setTimeout(() => {
      updateAgent(agentId, {
        state: 'idle',
        glowIntensity: 0.3,
      });
    }, 5000);
  }, [updateAgent]);

  return {
    agents,
    isConnected,
    updateAgent,
    alertAgent,
  };
}

export function useAgentStats(agents: NexoraAgent[]) {
  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.state === 'working').length,
    idleAgents: agents.filter(a => a.state === 'idle').length,
    alertAgents: agents.filter(a => a.state === 'alert').length,
    totalTasksCompleted: agents.reduce((sum, a) => sum + a.stats.tasksCompleted, 0),
    roomCounts: agents.reduce((acc, a) => {
      acc[a.currentRoom] = (acc[a.currentRoom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return stats;
}
