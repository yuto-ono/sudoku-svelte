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
    const { solveStatus, numArray } = solve(sample1.flat())
    expect(solveStatus).toBe(SolveStatus.success)
    expect(numArray).toStrictEqual(answer1.flat())
  })
  it("sample 2", () => {
    const { solveStatus, numArray } = solve(sample2.flat())
    expect(solveStatus).toBe(SolveStatus.success)
    expect(numArray).toStrictEqual(answer2.flat())
  })
  it("duplicated", () => {
    const { solveStatus } = solve(duplicated.flat())
    expect(solveStatus).toBe(SolveStatus.duplicated)
  })
  it("unsolvable", () => {
    const { solveStatus } = solve(unsolvable.flat())
    expect(solveStatus).toBe(SolveStatus.unsolvable)
  })
})
