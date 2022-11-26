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

/**
 * 数独の盤面を管理し、解くクラス
 */
export class Solver {
  private cells: Cell[] = []
  private emptyList: EmptyList

  constructor() {
    this.emptyList = new EmptyList()
  }

  /**
   * 数独を解く
   */
  solve(data: number[]): SolveStatus {
    if (data.length !== CELL_NUMBER) {
      return SolveStatus.invalidLength // 配列の長さが違う
    }

    this.cells = data.map((num, i) => new Cell(i, num))

    this.emptyList.clear()

    // セルの初期化と空きマスリストの作成
    for (const cell of this.cells) {
      if (!cell.init(this.cells)) {
        return SolveStatus.duplicated // 重複を発見
      }
      if (cell.value === 0) {
        this.emptyList.push(cell)
      }
    }

    if (this.emptyList.length === 0) {
      return SolveStatus.noEmpty // 空きマスがない
    }
    return this.solveRecursive() ? SolveStatus.success : SolveStatus.unsolvable
  }

  /**
   * 現在の盤面のデータを取得
   */
  getNumberArray(): number[] {
    return this.cells.map((cell) => cell.value)
  }

  /**
   * solve の内部処理
   * 解けたら true, 解けなかったら false を返す
   * 改良バックトラック
   */
  private solveRecursive(): boolean {
    // 空きマスを1つ選ぶ
    const cell = this.emptyList.pop()

    // 候補に上がっている数字を入れてみる
    for (let i = 1; i <= 9; i++) {
      if (cell.setValue(i)) {
        if (this.emptyList.length === 0 || this.solveRecursive()) {
          return true
        }
        cell.resetValue()
      }
    }

    // 解けなかったので、もとに戻してやり直し
    this.emptyList.restore(cell)
    return false
  }
}
