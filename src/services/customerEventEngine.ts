'use client';

import { useCustomerTripStore } from '@/store/customerTripStore';
import { CustomerTripStatus, type CustomerSocketEventPayload, type Location } from '@/types/customerTrip';
import { socketService } from '@/services/socket';

type EventName =
  | 'trip:searching'
  | 'trip:accepted'
  | 'trip:expired'
  | 'trip:cancelled'
  | 'trip:status'
  | 'location:update';

const DEBUG = process.env.NEXT_PUBLIC_WS_DEBUG === 'true';
const LOCATION_DEBOUNCE_MS = 300;

const STATE_ORDER: Record<CustomerTripStatus, number> = {
  [CustomerTripStatus.IDLE]: 0,
  [CustomerTripStatus.SEARCHING]: 1,
  [CustomerTripStatus.ASSIGNED]: 2,
  [CustomerTripStatus.ARRIVING]: 3,
  [CustomerTripStatus.PICKED_UP]: 4,
  [CustomerTripStatus.IN_TRANSIT]: 5,
  [CustomerTripStatus.COMPLETED]: 6,
  [CustomerTripStatus.CANCELLED]: 7,
  [CustomerTripStatus.EXPIRED]: 8,
};

class CustomerEventEngine {
  private processedEventIds = new Set<string>();
  private locationDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private bufferedLocation: Location | null = null;

  handleEvent(eventName: EventName, rawPayload: CustomerSocketEventPayload): void {
    const payload = this.normalizePayload(rawPayload);
    if (!this.isValidEvent(payload, eventName)) return;

    const store = useCustomerTripStore.getState();
    const currentTripId = store.currentTrip?.id;
    if (currentTripId && payload.tripId !== currentTripId) {
      this.logIgnored(eventName, payload, 'tripId_mismatch');
      return;
    }

    switch (eventName) {
      case 'trip:searching':
        if (!store.currentTrip) return;
        store.updateStatus(CustomerTripStatus.SEARCHING, payload.timestamp);
        return;
      case 'trip:accepted':
        store.assignDriver(payload.driver ?? null);
        store.updateStatus(CustomerTripStatus.ASSIGNED, payload.timestamp);
        if (store.currentTrip?.id) {
          socketService.instance?.emit('join:trip', { tripId: store.currentTrip.id, role: 'customer' });
        }
        return;
      case 'trip:expired':
        if (store.tripStatus === CustomerTripStatus.SEARCHING) {
          store.resetTrip();
        }
        return;
      case 'trip:cancelled':
        store.resetTrip();
        return;
      case 'trip:status': {
        const next = this.normalizeStatus(payload.status);
        if (!next) return;
        if (!this.isTransitionAllowed(store.tripStatus, next)) {
          this.logIgnored(eventName, payload, 'invalid_transition');
          return;
        }
        store.updateStatus(next, payload.timestamp);
        if (isTerminalStatus(next)) store.resetTrip();
        return;
      }
      case 'location:update':
        if (STATE_ORDER[store.tripStatus] < STATE_ORDER[CustomerTripStatus.ASSIGNED]) {
          this.logIgnored(eventName, payload, 'status_not_ready_for_location');
          return;
        }
        if (!payload.location) return;
        this.bufferedLocation = payload.location;
        if (this.locationDebounceTimer) return;
        this.locationDebounceTimer = setTimeout(() => {
          this.locationDebounceTimer = null;
          if (this.bufferedLocation) {
            useCustomerTripStore.getState().updateLocation(this.bufferedLocation);
          }
        }, LOCATION_DEBOUNCE_MS);
        return;
      default:
        return;
    }
  }

  private isTransitionAllowed(from: CustomerTripStatus, to: CustomerTripStatus): boolean {
    return STATE_ORDER[to] >= STATE_ORDER[from];
  }

  private normalizeStatus(value: unknown): CustomerTripStatus | null {
    const raw = String(value ?? '').toUpperCase();
    switch (raw) {
      case 'SEARCHING':
        return CustomerTripStatus.SEARCHING;
      case 'ASSIGNED':
        return CustomerTripStatus.ASSIGNED;
      case 'ARRIVING':
        return CustomerTripStatus.ARRIVING;
      case 'PICKED_UP':
        return CustomerTripStatus.PICKED_UP;
      case 'IN_TRANSIT':
      case 'IN_PROGRESS':
        return CustomerTripStatus.IN_TRANSIT;
      case 'COMPLETED':
        return CustomerTripStatus.COMPLETED;
      case 'CANCELLED':
        return CustomerTripStatus.CANCELLED;
      case 'EXPIRED':
        return CustomerTripStatus.EXPIRED;
      default:
        return null;
    }
  }

  private normalizePayload(payload: CustomerSocketEventPayload): CustomerSocketEventPayload & { timestamp: number } {
    const fallback = Date.now();
    const parsed =
      typeof payload.timestamp === 'number'
        ? payload.timestamp
        : payload.timestamp
          ? Date.parse(String(payload.timestamp))
          : fallback;
    return {
      ...payload,
      timestamp: Number.isFinite(parsed) ? parsed : fallback,
    };
  }

  private isValidEvent(
    payload: CustomerSocketEventPayload & { timestamp: number },
    eventName: EventName,
  ): payload is CustomerSocketEventPayload & { timestamp: number; tripId: string } {
    if (!payload?.tripId) {
      this.logIgnored(eventName, payload, 'missing_trip_id');
      return false;
    }
    const store = useCustomerTripStore.getState();
    if (payload.timestamp < store.lastEventTimestamp) {
      this.logIgnored(eventName, payload, 'stale_timestamp');
      return false;
    }

    const eventId = payload.eventId ?? `${eventName}:${payload.tripId}:${payload.timestamp}`;
    if (this.processedEventIds.has(eventId)) {
      this.logIgnored(eventName, payload, 'duplicate_event');
      return false;
    }
    this.processedEventIds.add(eventId);
    if (this.processedEventIds.size > 500) {
      const first = this.processedEventIds.values().next().value;
      if (first) this.processedEventIds.delete(first);
    }
    return true;
  }

  private logIgnored(eventName: string, payload: unknown, reason: string): void {
    if (!DEBUG) return;
    console.debug('[customer-event-engine] ignored', { eventName, reason, payload });
  }
}

function isTerminalStatus(status: CustomerTripStatus): boolean {
  return (
    status === CustomerTripStatus.COMPLETED ||
    status === CustomerTripStatus.CANCELLED ||
    status === CustomerTripStatus.EXPIRED
  );
}

export const customerEventEngine = new CustomerEventEngine();
