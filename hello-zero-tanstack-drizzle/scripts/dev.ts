import type { SpawnOptions } from 'bun'

const spawnOptions: SpawnOptions.OptionsObject = {
	stdin: 'inherit',
	stdout: 'inherit',
	stderr: 'inherit',
}

const run = async () => {
	// Start the database
	Bun.spawn(['bun', 'run', 'docker', 'compose', '-f', './docker/docker-compose.yml', 'up'], spawnOptions)

	// Start the zero-cache-dev
	Bun.spawn(['bun', 'run', 'zero-cache-dev', '--port', '4949', '-p', './src/db/schema/zero.ts'], spawnOptions)

	// Start the dev server
	Bun.spawn(['bun', 'run', 'vite'], spawnOptions)

	// Closing scripts
	process.on('SIGINT', async () => {
		console.log('Cleaning up...')
		Bun.spawn(['bun', 'run', 'docker', 'compose', '-f', './docker/docker-compose.yml', 'down'], spawnOptions)
		// await $`bun run db:down` will also work
	})
}

run()
