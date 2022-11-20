import { describe, expect, it } from "@jest/globals"
import { Solver, SolveStatus } from "./Solver"
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
    const solver = new Solver(sample1.flat())
    expect(solver.solve()).toBe(SolveStatus.success)
    expect(solver.getNumberArray()).toStrictEqual(answer1.flat())
  })
  it("sample 2", () => {
    const solver = new Solver(sample2.flat())
    expect(solver.solve()).toBe(SolveStatus.success)
    expect(solver.getNumberArray()).toStrictEqual(answer2.flat())
  })
  it("duplicated", () => {
    const solver = new Solver(duplicated.flat())
    expect(solver.solve()).toBe(SolveStatus.duplicated)
  })
  it("unsolvable", () => {
    const solver = new Solver(unsolvable.flat())
    expect(solver.solve()).toBe(SolveStatus.unsolvable)
  })
})
