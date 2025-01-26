import { relations, sql } from 'drizzle-orm'
import { boolean, check, integer, pgSchema, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
})

export const todos = pgTable('todo', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	description: varchar('description', { length: 255 }).notNull(),
	completed: boolean('completed').notNull().default(false),
	createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
})

export const todoRelations = relations(todos, ({ one }) => ({
	createdBy: one(users, {
		fields: [todos.createdBy],
		references: [users.id],
	}),
}))

/**
 * The PostgreSQL Zero Schema is a schema that is used to store schema metadata.
 * This separate schema helps isolate Zero's internal tables from application tables.
 */
export const zeroSchema = pgSchema('zero')

/**
 * The PostgreSQL Zero schema versions table.
 * This table maintains only a single row tracking the range of supported schema versions.
 *
 * Zero has first-class support for robust schema migrations through a versioning system
 * stored in PostgreSQL. When zero-cache first runs against an upstream Postgres database,
 * it adds a schemaVersions table to track supported schema versions.
 *
 * The schemaVersions table contains only one row with three columns:
 * - minSupportedVersion: The minimum schema version currently supported
 * - maxSupportedVersion: The maximum schema version currently supported
 * - lock: A boolean flag that is always true (used for row locking)
 *
 * Example query result:
 * ```sql
 * select * from zero."schemaVersions";
 * +---------------------+---------------------+------+
 * | minSupportedVersion | maxSupportedVersion | lock |
 * |---------------------+---------------------+------|
 * | 1                   | 1                   | True |
 * +---------------------+---------------------+------+
 * ```
 */
export const zeroSchemaVersions = zeroSchema.table(
	'schemaVersions',
	{
		minSupportedVersion: integer('minSupportedVersion'),
		maxSupportedVersion: integer('maxSupportedVersion'),
		lock: boolean('lock').notNull().default(true).primaryKey(),
	},
	(table) => [check('zero_schema_versions_single_row_constraint', sql`${table.lock}`)],
)
