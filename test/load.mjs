
import { expand } from "../index.js"

describe("Run as ESM module", () => {
	it("should export function", assert => {
		assert.type(expand, "function")
		assert.end()
	})
})

