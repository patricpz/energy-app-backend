import { healthService } from '../services/health.service';

class HealthController {
  async getStatus() {
    const status = await healthService.getStatus();
    return status;
  }
}

export const healthController = new HealthController();

