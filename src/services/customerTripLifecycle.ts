'use client';

import { API_PATHS } from '@/api/endpoints';
import apiClient from '@/api/client';
import { customerEventEngine } from '@/services/customerEventEngine';
import { socketService } from '@/services/socket';
import { useCustomerTripStore } from '@/store/customerTripStore';
import { mapTripStatus } from '@/store/customerTripStore';
import { type CustomerSocketEventPayload, CustomerTripStatus, type Trip } from '@/types/customerTrip';

const TAB_LOCK_KEY = 'liftngo_ws_customer_leader';
const TAB_LOCK_TTL_MS = 5000;
const HEARTBEAT_MS = 2000;
const CHANNEL_NAME = 'liftngo_customer_trip_sync';

type SocketEvent =
  | 'trip:searching'
  | 'trip:accepted'
  | 'trip:expired'
  | 'trip:cancelled'
  | 'trip:status'
  | 'location:update';

const EVENTS: SocketEvent[] = [
  'trip:searching',
  'trip:accepted',
  'trip:expired',
  'trip:cancelled',
  'trip:status',
  'location:update',
];

class CustomerTripLifecycle {
  private userId: string | null = null;
  private isLeader = false;
  private tabId = '';
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private channel: BroadcastChannel | null = null;
  private teardownFns: Array<() => void> = [];

  start(userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    this.userId = userId;
    this.tabId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.initBroadcastChannel();
    this.attachLeadershipListeners();
    this.tryBecomeLeader();
    this.syncActiveTrip();
  }

  stop(): void {
    this.teardownFns.forEach((fn) => fn());
    this.teardownFns = [];
    this.stopHeartbeat();
    this.channel?.close();
    this.channel = null;
    socketService.disconnect();
    this.isLeader = false;
  }

  async syncActiveTrip(): Promise<void> {
    if (!this.userId || typeof window === 'undefined') return;
    try {
      const activeTrip = await apiClient.get<Trip | null>(API_PATHS.tripsActive);
      useCustomerTripStore.getState().hydrateFromServer(activeTrip);
      this.broadcastState();
      if (!activeTrip || !this.isLeader) return;

      const socket = socketService.connect(this.userId, 'CUSTOMER');
      if (!socket) return;
      socket.emit('join:trip', { tripId: activeTrip.id, role: 'customer' });
    } catch {
      // Keep stale UI state on fetch failure and rely on next reconnect cycle.
    }
  }

  markTripCreated(trip: Trip): void {
    const store = useCustomerTripStore.getState();
    store.startSearching({ ...trip, status: CustomerTripStatus.SEARCHING });
    store.updateStatus(CustomerTripStatus.SEARCHING, Date.now());
    this.broadcastState();
    if (!this.isLeader || !trip.id) return;
    socketService.instance?.emit('join:trip', { tripId: trip.id, role: 'customer' });
  }

  private attachSocketHandlers(): void {
    if (!this.userId) return;
    const socket = socketService.connect(this.userId, 'CUSTOMER');
    if (!socket) return;

    EVENTS.forEach((eventName) => {
      const handler = (payload: CustomerSocketEventPayload) => {
        customerEventEngine.handleEvent(eventName, payload);
        this.broadcastState();
      };
      socket.on(eventName, handler);
      this.teardownFns.push(() => socket.off(eventName, handler));
    });

    const unsubscribe = socketService.onConnectionStateChange((state) => {
      useCustomerTripStore.getState().setConnectionState(state);
      if (state === 'CONNECTED') void this.syncActiveTrip();
      this.broadcastState();
    });
    this.teardownFns.push(unsubscribe);
  }

  private initBroadcastChannel(): void {
    if (typeof window === 'undefined') return;
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (event) => {
      const data = event.data as { type: 'STATE_SYNC'; payload: ReturnType<typeof getSerializableState> } | undefined;
      if (!data || data.type !== 'STATE_SYNC') return;
      if (this.isLeader) return;
      applyBroadcastState(data.payload);
    };
  }

  private broadcastState(): void {
    if (!this.channel) return;
    this.channel.postMessage({ type: 'STATE_SYNC', payload: getSerializableState() });
  }

  private attachLeadershipListeners(): void {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TAB_LOCK_KEY) return;
      this.tryBecomeLeader();
    };
    window.addEventListener('storage', onStorage);
    this.teardownFns.push(() => window.removeEventListener('storage', onStorage));
    this.teardownFns.push(() => window.removeEventListener('beforeunload', this.handleBeforeUnload));
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  private readonly handleBeforeUnload = () => {
    const current = readLock();
    if (current?.tabId === this.tabId) {
      clearLock();
    }
  };

  private tryBecomeLeader(): void {
    const lock = readLock();
    const now = Date.now();
    if (!lock || now - lock.updatedAt > TAB_LOCK_TTL_MS || lock.tabId === this.tabId) {
      writeLock({ tabId: this.tabId, updatedAt: now });
      this.becomeLeader();
      return;
    }
    this.becomeFollower();
  }

  private becomeLeader(): void {
    if (this.isLeader) return;
    this.isLeader = true;
    this.startHeartbeat();
    this.attachSocketHandlers();
  }

  private becomeFollower(): void {
    if (!this.isLeader) return;
    this.isLeader = false;
    socketService.disconnect();
    this.stopHeartbeat();
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      writeLock({ tabId: this.tabId, updatedAt: Date.now() });
      this.broadcastState();
    }, HEARTBEAT_MS);
  }

  private stopHeartbeat(): void {
    if (!this.heartbeatTimer) return;
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }
}

type TabLock = { tabId: string; updatedAt: number };

function writeLock(value: TabLock): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TAB_LOCK_KEY, JSON.stringify(value));
}

function clearLock(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TAB_LOCK_KEY);
}

function readLock(): TabLock | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(TAB_LOCK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TabLock;
  } catch {
    return null;
  }
}

function getSerializableState() {
  const state = useCustomerTripStore.getState();
  return {
    currentTrip: state.currentTrip,
    tripStatus: state.tripStatus,
    isSearching: state.isSearching,
    driver: state.driver,
    driverLocation: state.driverLocation,
    lastEventTimestamp: state.lastEventTimestamp,
    connectionState: state.connectionState,
  };
}

function applyBroadcastState(payload: ReturnType<typeof getSerializableState>): void {
  const store = useCustomerTripStore.getState();
  if (!payload.currentTrip) {
    store.resetTrip();
    store.setConnectionState(payload.connectionState);
    return;
  }

  store.hydrateFromServer({
    ...payload.currentTrip,
    status: mapTripStatus(payload.tripStatus),
  });
  store.assignDriver(payload.driver);
  if (payload.driverLocation) {
    store.updateLocation(payload.driverLocation);
  }
  store.updateStatus(payload.tripStatus, payload.lastEventTimestamp || Date.now());
  store.setConnectionState(payload.connectionState);
}

export const customerTripLifecycle = new CustomerTripLifecycle();
