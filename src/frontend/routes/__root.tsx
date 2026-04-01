import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { NotFound } from '@/frontend/components/NotFound'
import { ErrorPage } from '@/frontend/components/ErrorPage'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
})
