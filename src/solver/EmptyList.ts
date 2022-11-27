import { Cell } from "./Cell"

// 最小の要素を探すための初期値
const MIN_LENGTH_INITIAL = 10

/**
 * 空きマスリスト
 * 双方向連結リストによる実装
 */
export class EmptyList extends Cell {
  length = 0

  constructor() {
    super(-1)
  }

  /**
   * 要素を最後尾に追加
   */
  push(cell: Cell): void {
    cell.prev = this.prev
    cell.next = this
    cell.prev.next = cell
    this.prev = cell
    this.length++
  }

  /**
   * リストの中から要素を1つ取り出す
   */
  pop(): Cell {
    let cell: Cell = this
    let selectedCell: Cell = this
    let minLength = MIN_LENGTH_INITIAL

    while ((cell = cell.next) !== this) {
      if (cell.candidatesCount === 1) {
        selectedCell = cell
        break
      }
      if (cell.candidatesCount < minLength) {
        minLength = cell.candidatesCount
        selectedCell = cell
      }
    }

    selectedCell.prev.next = selectedCell.next
    selectedCell.next.prev = selectedCell.prev
    this.length--
    return selectedCell
  }

  /**
   * 要素を復活
   */
  restore(cell: Cell): void {
    cell.prev.next = cell
    cell.next.prev = cell
    this.length++
  }

  /**
   * 空にする
   */
  clear(): void {
    this.prev = this
    this.next = this
    this.length = 0
  }
}
