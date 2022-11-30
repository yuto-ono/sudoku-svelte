import { Cell } from "./Cell"
import { EmptyList } from "./EmptyList"

const CELL_NUMBER = 81

export const SolveStatus = {
  success: 0, // 解けた
  invalidLength: 1, // 配列のサイズが違う
  noEmpty: 2, // 空きマスがない
  duplicated: 3, // 重複がある
  unsolvable: 4, // 解けない
} as const

export type SolveStatus = typeof SolveStatus[keyof typeof SolveStatus]

export type SolveReturn = {
  solveStatus: SolveStatus
  numArray: number[]
}

const emptyList = new EmptyList()
const cells = [...Array(CELL_NUMBER)].map((_, i) => new Cell(i))
cells.forEach((cell) => cell.setRelatedCells(cells))

/**
 * 数独を解く
 * @param numArray 数独を表す配列
 * @returns solveStatus ソルブ状態, numArray ソルブ済の配列
 */
export const solve = (numArray: number[]): SolveReturn => {
  if (numArray.length !== CELL_NUMBER) {
    return { solveStatus: SolveStatus.invalidLength, numArray }
  }
  cells.forEach((cell) => cell.init())
  emptyList.clear()
  for (const cell of cells) {
    const num = numArray[cell.pos]
    if (num === 0) {
      emptyList.push(cell)
    } else if (!cell.setNum(num)) {
      return { solveStatus: SolveStatus.duplicated, numArray }
    }
  }
  if (emptyList.length === 0) {
    return { solveStatus: SolveStatus.noEmpty, numArray }
  }
  if (!solveRecursive()) {
    return { solveStatus: SolveStatus.unsolvable, numArray }
  }
  return {
    solveStatus: SolveStatus.success, // 解けた
    numArray: cells.map((cell) => cell.num),
  }
}

/**
 * solve の内部処理
 * 解けたら true, 解けなかったら false を返す
 * 改良バックトラック
 */
const solveRecursive = (): boolean => {
  // 空きマスを1つ選ぶ
  const cell = emptyList.pop()

  // 候補に上がっている数字を入れてみる
  for (let i = 1; i <= 9; i++) {
    if (cell.setNum(i)) {
      if (emptyList.length === 0 || solveRecursive()) {
        return true
      }
      cell.resetNum()
    }
  }

  // 解けなかったので、もとに戻してやり直し
  emptyList.restore(cell)
  return false
}
