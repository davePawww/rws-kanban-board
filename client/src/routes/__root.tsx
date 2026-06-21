import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'; // different import
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { RouterContext } from '@/types/shared.types';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Header />
      <hr />
      <Outlet />
      <Footer />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  );
}
