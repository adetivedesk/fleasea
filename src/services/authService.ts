/**
 * MOCK auth only (spec §51). No passwords, no server. Resolves a demo email to a role.
 * Replace with a real session/token exchange in V2.
 */
import { DEMO_ACCOUNTS, MERCHANT_STATUS } from '@/constants';
import { merchantService } from './merchantService';
import { delay } from './mock/db';
import type { DemoRole } from '@/types';

export interface LoginResult {
  role: DemoRole;
  label: string;
}

export const authService = {
  async login(email: string): Promise<LoginResult> {
    const e = email.trim().toLowerCase();

    if (e === DEMO_ACCOUNTS.admin) return delay({ role: 'admin', label: 'Administrator' });
    if (e === DEMO_ACCOUNTS.merchant)
      return delay({ role: 'merchant', label: 'Approved merchant' });
    if (e === DEMO_ACCOUNTS.pending)
      return delay({ role: 'pending', label: 'Pending merchant' });

    const merchant = await merchantService.getByEmail(e);
    if (!merchant) {
      throw new Error('No account found for that email. Please register as a merchant.');
    }
    switch (merchant.status) {
      case MERCHANT_STATUS.APPROVED:
        return { role: 'merchant', label: merchant.companyName };
      case MERCHANT_STATUS.PENDING:
        return { role: 'pending', label: merchant.companyName };
      case MERCHANT_STATUS.REJECTED:
        throw new Error('This application was not approved. Please contact the Fleasea team.');
      case MERCHANT_STATUS.SUSPENDED:
        throw new Error('This account is suspended. Please contact Fleasea finance.');
      default:
        throw new Error('Unable to sign in.');
    }
  },
};

export const ROLE_HOME: Record<DemoRole, string> = {
  visitor: '/',
  pending: '/merchant/application-status',
  merchant: '/merchant',
  admin: '/admin',
};
