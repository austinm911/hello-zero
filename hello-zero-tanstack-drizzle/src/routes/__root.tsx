import { NotFound } from '@/components/not-found'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
	notFoundComponent: () => <NotFound />,
})

function RootComponent() {
	return <App />
}

function App() {
	return (
		<div className="bg-stone-300 min-h-screen">
			<div className="p-2 flex gap-2 text-lg text-blue-500">
				<Link
					to="/"
					activeProps={{
						className: 'font-bold',
					}}
					activeOptions={{ exact: true }}
				>
					Home
				</Link>{' '}
			</div>
			<hr />
			<Outlet />
			<ReactQueryDevtools buttonPosition="top-right" />
			<TanStackRouterDevtools position="bottom-right" />
		</div>
	)
}
