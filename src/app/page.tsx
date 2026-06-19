'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

/**
 * The root / page lazily loads WalletConnector and DeviceProvisioner through
 * a dynamic import that also brings in DashboardProviders (QueryProvider +
 * WalletProvider). This keeps @stellar/* SDKs out of the initial bundle while
 * still allowing wallet interactions on the home page.
 */
const HomeContent = dynamic(
  () => import('@/components/home/HomeContent').then((m) => ({ default: m.HomeContent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-400">Loading IoT Billing Service…</p>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
              <p className="mt-4 text-sm text-gray-400">Loading IoT Billing Service…</p>
            </div>
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  );
}
