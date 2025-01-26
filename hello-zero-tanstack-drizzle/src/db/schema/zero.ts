import { ANYONE_CAN, type ExpressionBuilder, type Row, definePermissions, relationships } from '@rocicorp/zero'
import { createZeroSchema } from 'drizzle-zero'
import * as drizzleSchema from './index'

// Define AuthData type explicitly
interface AuthData {
	sub: string // assuming sub is the user identifier
	// Add other authentication-related fields as needed
}

export const schema = createZeroSchema(drizzleSchema, {
	version: 1,
	// Specify which tables and columns to include in the Zero schema.
	// This allows for the "expand/migrate/contract" pattern recommended in the Zero docs.
	// When a column is first added, it should be set to false, and then changed to true
	// once the migration has been run.
	tables: {
		todo: {
			id: true,
			description: true,
			completed: true,
			created_at: true,
			created_by: true,
			updated_at: true,
		},
		users: {
			id: true,
			name: true,
		},
	},
	
})

// Define permissions with explicit types
export type Schema = typeof schema

// Need to define permissions better
export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {
		todo: {
			row: {
				select: ANYONE_CAN,
				insert: ANYONE_CAN,
				update: ANYONE_CAN,
				delete: ANYONE_CAN,
			},
			users: {
				select: ANYONE_CAN,
				insert: ANYONE_CAN,
				update: ANYONE_CAN,
				delete: ANYONE_CAN,
			},
		},
	}
})
