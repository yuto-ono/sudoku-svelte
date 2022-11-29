import { describe, expect, it } from "@jest/globals"
import { SudokuSolver, SolveStatus } from "./SudokuSolver"
import {
  sample1,
  answer1,
  sample2,
  answer2,
  duplicated,
  unsolvable,
} from "./samples.json"

describe("Solver", () => {
  const solver = new SudokuSolver()
  it("sample 1", () => {
    expect(solver.solve(sample1.flat())).toBe(SolveStatus.success)
    expect(solver.getNumberArray()).toStrictEqual(answer1.flat())
  })
  it("sample 2", () => {
    expect(solver.solve(sample2.flat())).toBe(SolveStatus.success)
    expect(solver.getNumberArray()).toStrictEqual(answer2.flat())
  })
  it("duplicated", () => {
    expect(solver.solve(duplicated.flat())).toBe(SolveStatus.duplicated)
  })
  it("unsolvable", () => {
    expect(solver.solve(unsolvable.flat())).toBe(SolveStatus.unsolvable)
  })
})
