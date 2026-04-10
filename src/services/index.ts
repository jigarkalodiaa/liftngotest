/**
 * @deprecated Use imports from @/api/services or @/lib/api instead
 * This file is kept for backwards compatibility only
 */
export { default as apiClient } from '@/api/client';
export * from '@/api/services/bookingService';
export * from '@/api/services/driverService';

// Re-export socket and lifecycle services (these are still in /services)
export { socketService } from './socket';
export { customerTripLifecycle } from './customerTripLifecycle';
export { customerEventEngine } from './customerEventEngine';
