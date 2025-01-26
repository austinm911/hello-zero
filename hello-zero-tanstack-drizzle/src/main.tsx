import { schema } from '@/db/schema/zero'
import { env } from '@/env/client'
import { Zero } from '@rocicorp/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { decodeJwt } from 'jose'
import Cookies from 'js-cookie'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'
import { routeTree } from './routeTree.gen'

const encodedJWT = Cookies.get('jwt')
const decodedJWT = encodedJWT && decodeJwt(encodedJWT)
const userID = decodedJWT?.sub ? (decodedJWT.sub as string) : 'anon'

const z = new Zero({
	userID,
	auth: () => encodedJWT,
	server: env.VITE_PUBLIC_SERVER,
	schema,
	// This is often easier to develop with if you're frequently changing
	// the schema. Switch to 'idb' for local-persistence.
	kvStore: 'mem',
})

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: 'intent',
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	Wrap: ({ children }) => {
		return (
			<ZeroProvider zero={z}>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</ZeroProvider>
		)
	},
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<RouterProvider router={router} />)
}
