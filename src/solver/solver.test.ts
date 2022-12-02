import { describe, expect, it } from "@jest/globals"
import { solve, SolveStatus } from "./solver"
import {
  sample1,
  answer1,
  sample2,
  answer2,
  duplicated,
  unsolvable,
} from "./samples.json"

describe("Solver", () => {
  it("sample 1", () => {
    const result = solve(sample1.flat())
    expect(result.success).toStrictEqual(true)
    if (result.success) {
      expect(result.solution).toStrictEqual(answer1.flat())
    }
  })
  it("sample 2", () => {
    const result = solve(sample2.flat())
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.solution).toStrictEqual(answer2.flat())
    }
  })
  it("duplicated", () => {
    const result = solve(duplicated.flat())
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.status).toBe(SolveStatus.duplicated)
    }
  })
  it("no empty", () => {
    const result = solve(answer1.flat())
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.status).toBe(SolveStatus.noEmpty)
    }
  })
  it("unsolvable", () => {
    const result = solve(unsolvable.flat())
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.status).toBe(SolveStatus.unsolvable)
    }
  })
})
