import { Cell } from "./Cell"
import { EmptyList } from "./EmptyList"

const CELL_NUMBER = 81

/**
 * ソルブ失敗時の種別
 * invalidLength 配列のサイズが違う
 * noEmpty 空きマスがない
 * duplicated 重複がある
 * unsolvable 解けない
 */
export const SolveStatus = {
  invalidLength: 1,
  noEmpty: 2,
  duplicated: 3,
  unsolvable: 4,
} as const

export type SolveStatus = typeof SolveStatus[keyof typeof SolveStatus]

/**
 * ソルブ成功したときの戻り値
 */
export type SolveAnswer = {
  success: true
  solution: number[]
}

/**
 * ソルブ失敗したときの戻り値
 */
export type SolveFailed = {
  success: false
  status: SolveStatus
}

export type SolveResult = SolveAnswer | SolveFailed

const emptyList = new EmptyList()
const cells = [...Array(CELL_NUMBER)].map((_, i) => new Cell(i))
cells.forEach((cell) => cell.setRelatedCells(cells))

/**
 * 数独を解く
 * @param numArray 数独を表す配列
 * @returns succes: true の場合 answer にソルブ済の配列が入ります。
 * success: false なら、 status にステータスコードが入ります。
 */
export const solve = (numArray: number[]): SolveResult => {
  if (numArray.length !== CELL_NUMBER) {
    return { success: false, status: SolveStatus.invalidLength }
  }
  cells.forEach((cell) => cell.init())
  emptyList.clear()
  for (const cell of cells) {
    const num = numArray[cell.pos]
    if (num === 0) {
      emptyList.push(cell)
    } else if (!cell.setNum(num)) {
      return { success: false, status: SolveStatus.duplicated }
    }
  }
  if (emptyList.length === 0) {
    return { success: false, status: SolveStatus.noEmpty }
  }
  if (!solveRecursive()) {
    return { success: false, status: SolveStatus.unsolvable }
  }
  return { success: true, solution: cells.map((cell) => cell.num) }
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
