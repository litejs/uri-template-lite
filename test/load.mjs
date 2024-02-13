
import { expand } from "../dist/index.esm.mjs"

describe("Run as ESM module", () => {
	it("should export function", assert => {
		assert.type(expand, "function")
		assert.end()
	})
})

