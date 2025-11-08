import { healthRepository } from '../repositories/health.repository';
import type { HealthStatus } from '../types/health';

class HealthService {
  async getStatus(): Promise<HealthStatus> {
    const status = await healthRepository.getStatus();
    return status;
  }
}

export const healthService = new HealthService();

