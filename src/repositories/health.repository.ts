import type { HealthStatus } from '../types/health';

class HealthRepository {
  async getStatus(): Promise<HealthStatus> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}

export const healthRepository = new HealthRepository();

