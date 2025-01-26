import { getRequestListener } from '@hono/node-server'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { app } from './src/api'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react(),
		tsConfigPaths({ projects: ['./tsconfig.json'] }),
		{
			name: 'api-server',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					// confirm server is running
					if (!req.url?.startsWith('/api')) {
						return next()
					}
					getRequestListener(async (request) => {
						console.log('request', request)
						return await app.fetch(request, {})
					})(req, res)
				})
			},
		},
	],
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2022',
		},
	},
})
