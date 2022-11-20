import { Cell } from "./Cell"
import { EmptyList } from "./EmptyList"

const CELL_NUMBER = 81

export const SolveStatus = {
  success: 0,
  invalidLength: 1,
  noEmpty: 2,
  duplicated: 3,
  unsolvable: 4,
} as const

export type SolveStatus = typeof SolveStatus[keyof typeof SolveStatus]

/**
 * 数独の盤面を管理し、解くクラス
 */
export class Solver {
  private status: SolveStatus = SolveStatus.success
  private cells: Cell[] = []
  private emptyList: EmptyList

  constructor(data: number[]) {
    this.emptyList = new EmptyList()

    if (data.length !== CELL_NUMBER) {
      this.status = SolveStatus.invalidLength // 配列の長さが違う
      return
    }

    this.cells = data.map((num, i) => new Cell(i, num))

    // セルの初期化と空きマスリストの作成
    for (const cell of this.cells) {
      if (!cell.init(this.cells)) {
        this.status = SolveStatus.duplicated // 重複を発見
        return
      }
      if (cell.value === 0) {
        this.emptyList.push(cell)
      }
    }

    if (this.emptyList.length === 0) {
      this.status = SolveStatus.noEmpty // 空きマスがない
    }
  }

  /**
   * 数独を解く
   */
  solve(): SolveStatus {
    if (this.status !== SolveStatus.success) {
      return this.status
    }
    return this.solveInternal() ? SolveStatus.success : SolveStatus.unsolvable
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
  private solveInternal(): boolean {
    // 空きマスを1つ選ぶ
    const cell = this.emptyList.pop()

    // 候補に上がっている数字を入れてみる
    for (let i = 1; i <= 9; i++) {
      if (cell.setValue(i)) {
        if (this.emptyList.length === 0 || this.solveInternal()) {
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
