import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
	resolve: {
		alias: {
			obsidian: path.resolve(__dirname, 'test/obsidian-stub.ts'),
		},
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
})
