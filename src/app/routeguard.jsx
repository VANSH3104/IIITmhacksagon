"use client";
import { useAccount } from 'wagmi';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function RouteGuard({ children }) {
  const { isConnected } = useAccount();
   const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected && pathname !== '/') {
      router.push('/');
    }
  }, [isConnected, router, pathname]);

  return <>{children}</>;
}