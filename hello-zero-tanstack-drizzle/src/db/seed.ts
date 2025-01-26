import { env } from '@/env/server'
import { faker } from '@faker-js/faker'
import { createDb } from './db'
import * as schema from './schema'

// Set seed for faker to ensure consistent data
faker.seed(1)

export const seed = async () => {
	try {
		const db = await createDb(env.ZERO_UPSTREAM_DB, schema)
		const { todos, users } = schema

		await db
			.insert(users)
			.values({
				id: '1',
				name: faker.person.fullName(),
			})
			.onConflictDoNothing()
			.returning()

		const todosData: (typeof todos.$inferInsert)[] = Array.from({ length: 3 }, () => ({
			id: faker.string.uuid(),
			description: faker.lorem.sentence(),
			completed: faker.datatype.boolean(),
		}))

		await db.insert(todos).values(todosData).onConflictDoNothing()

		console.log(`Successfully seeded database with ${todosData.length} todos`)
	} catch (error) {
		console.error('Failed to seed database:', error)
	}
}

await seed()
