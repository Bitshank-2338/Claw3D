/**
 * NEXORA NEURAL HQ - OpenClaw Gateway Connection
 * Handles real-time updates from the AI agents
 */

import { NexoraAgent, AgentState, AgentActivity } from '@/features/neural-hq/types';

export interface GatewayConfig {
  url: string;
  token?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface AgentEvent {
  type: 'state_change' | 'activity_start' | 'activity_end' | 'position_change' | 'alert';
  agentId: string;
  data: {
    state?: AgentState;
    activity?: AgentActivity;
    position?: { x: number; y: number; z: number };
    room?: string;
    message?: string;
  };
  timestamp: number;
}

export type GatewayEventHandler = (event: AgentEvent) => void;

export class GatewayConnection {
  private ws: WebSocket | null = null;
  private config: GatewayConfig;
  private reconnectAttempts = 0;
  private handlers: Set<GatewayEventHandler> = new Set();
  private isConnecting = false;

  constructor(config: GatewayConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        const url = new URL(this.config.url);
        if (this.config.token) {
          url.searchParams.set('token', this.config.token);
        }

        this.ws = new WebSocket(url.toString());

        this.ws.onopen = () => {
          console.log('[Nexora Gateway] Connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (err) {
            console.error('[Nexora Gateway] Failed to parse message:', err);
          }
        };

        this.ws.onclose = () => {
          console.log('[Nexora Gateway] Disconnected');
          this.isConnecting = false;
          this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[Nexora Gateway] Error:', error);
          this.isConnecting = false;
          reject(error);
        };
      } catch (err) {
        this.isConnecting = false;
        reject(err);
      }
    });
  }

  private handleMessage(data: any) {
    // Map gateway events to agent events
    if (data.type === 'agent_update' || data.event?.type?.startsWith('agent_')) {
      const agentEvent: AgentEvent = {
        type: this.mapEventType(data.type || data.event?.type),
        agentId: data.agentId || data.agent?.id,
        data: {
          state: data.state,
          activity: data.activity,
          position: data.position,
          room: data.room,
          message: data.message,
        },
        timestamp: data.timestamp || Date.now(),
      };

      this.emit(agentEvent);
    }
  }

  private mapEventType(type: string): AgentEvent['type'] {
    const mapping: Record<string, AgentEvent['type']> = {
      'agent_state': 'state_change',
      'agent_activity_start': 'activity_start',
      'agent_activity_end': 'activity_end',
      'agent_move': 'position_change',
      'agent_alert': 'alert',
      'agent_update': 'state_change',
    };
    return mapping[type] || 'state_change';
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      console.error('[Nexora Gateway] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`[Nexora Gateway] Reconnecting in ${this.config.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(console.error);
    }, this.config.reconnectInterval);
  }

  subscribe(handler: GatewayEventHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  private emit(event: AgentEvent) {
    this.handlers.forEach(handler => {
      try {
        handler(event);
      } catch (err) {
        console.error('[Nexora Gateway] Handler error:', err);
      }
    });
  }

  send(message: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[Nexora Gateway] Cannot send, not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let gatewayInstance: GatewayConnection | null = null;

export function getGatewayConnection(config?: GatewayConfig): GatewayConnection {
  if (!gatewayInstance && config) {
    gatewayInstance = new GatewayConnection(config);
  }
  if (!gatewayInstance) {
    throw new Error('Gateway not initialized. Call with config first.');
  }
  return gatewayInstance;
}

export function initGateway(config: GatewayConfig): GatewayConnection {
  if (gatewayInstance) {
    gatewayInstance.disconnect();
  }
  gatewayInstance = new GatewayConnection(config);
  return gatewayInstance;
}
