import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

const prefixes = {
	todo: 'tod',
	user: 'usr',
} as const

export function createId(prefix: keyof typeof prefixes): string {
	return [prefixes[prefix], nanoid(13)].join('_')
}
