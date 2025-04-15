// tenant.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TenantService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  runWithTenant<T>(tenantId: string, callback: () => T): T {
    const store = new Map<string, any>();
    store.set('tenantId', tenantId);
    return this.asyncLocalStorage.run(store, callback);
  }

  getTenantId(): string | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store?.get('tenantId');
  }
}
