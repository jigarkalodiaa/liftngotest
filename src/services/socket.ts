'use client';

import { io, type Socket } from 'socket.io-client';
import { WS_URL } from '@/config/env';

export type SocketRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';
export type ConnectionState = 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'FAILED' | 'DISCONNECTED';

const DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';
const MAX_RECONNECT_ATTEMPTS = 8;

class SocketService {
  private socket: Socket | null = null;
  private state: ConnectionState = 'DISCONNECTED';
  private listeners = new Set<(state: ConnectionState) => void>();
  private connectionArgs: { userId: string; role: SocketRole } | null = null;
  private manualDisconnect = false;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  get instance(): Socket | null {
    return this.socket;
  }

  get connectionState(): ConnectionState {
    return this.state;
  }

  onConnectionStateChange(cb: (state: ConnectionState) => void): () => void {
    this.listeners.add(cb);
    cb(this.state);
    return () => this.listeners.delete(cb);
  }

  connect(userId: string, role: SocketRole): Socket | null {
    if (typeof window === 'undefined') return null;
    if (!userId) return null;

    this.connectionArgs = { userId, role };
    this.manualDisconnect = false;

    const existingAuth = this.socket?.auth as { userId?: string; role?: string } | undefined;
    if (this.socket?.connected && existingAuth?.userId === userId && existingAuth?.role === role) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.setState('CONNECTING');
    this.socket = io(WS_URL, {
      autoConnect: true,
      reconnection: false,
      transports: ['websocket', 'polling'],
      auth: { userId, role },
    });

    this.bindCoreListeners();
    return this.socket;
  }

  disconnect(): void {
    this.manualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.reconnectAttempt = 0;
    this.setState('DISCONNECTED');
  }

  private bindCoreListeners(): void {
    if (!this.socket) return;
    this.socket.on('connect', () => {
      this.reconnectAttempt = 0;
      this.setState('CONNECTED');
      this.log('[ws] connected', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.log('[ws] disconnected', reason);
      this.setState('DISCONNECTED');
      if (!this.manualDisconnect) this.scheduleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket error:', error);
      this.setState('DISCONNECTED');
      if (!this.manualDisconnect) this.scheduleReconnect();
    });

    this.socket.onAny((event, payload) => {
      this.log('[ws] onAny', event, payload);
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || !this.connectionArgs || this.manualDisconnect) return;
    this.reconnectAttempt += 1;
    if (this.reconnectAttempt > MAX_RECONNECT_ATTEMPTS) {
      this.setState('FAILED');
      return;
    }
    const delayMs = Math.min(30000, 1000 * Math.pow(2, Math.min(this.reconnectAttempt, 5)));
    this.setState('RECONNECTING');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.connectionArgs || this.manualDisconnect) return;
      this.log('[ws] reconnect attempt', this.reconnectAttempt);
      this.setState('CONNECTING');
      this.connect(this.connectionArgs.userId, this.connectionArgs.role);
    }, delayMs);
  }

  private setState(nextState: ConnectionState): void {
    this.state = nextState;
    this.listeners.forEach((listener) => listener(nextState));
  }

  private log(...args: unknown[]): void {
    if (DEBUG) {
      console.debug(...args);
    }
  }
}

export const socketService = new SocketService();
