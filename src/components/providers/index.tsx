'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';

/**
 * Root-level Providers
 *
 * Only ThemeProvider lives here so the initial / route stays lean.
 * WalletProvider and QueryProvider (which pull in @stellar/* SDKs) are
 * mounted by DashboardProviders inside the dashboard layout instead.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
