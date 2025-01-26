import { env } from '@/env/server'
import type { Config } from 'drizzle-kit'

export default {
	// run this from root of the package, but pass the custom location of drizzle.config.ts to script
	schema: 'src/db/schema/index.ts',
	out: 'src/db/migrations',
	dialect: 'postgresql',
	strict: true,
	verbose: true,
	dbCredentials: {
		url: env.ZERO_UPSTREAM_DB,
	},
} satisfies Config
