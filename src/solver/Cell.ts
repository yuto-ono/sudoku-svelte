// 1-9 すべて候補に上がっている状態の candidates
// ビットで候補を管理している（2進数で 1111111110）
const DEFAULT_CANDIDATES = 0x3fe

/**
 * それぞれのマスを表すクラス
 * そのマスの候補のリストとしても機能する
 * 連結リストのアイテムとしても機能する
 */
export class Cell {
  num: number = 0
  candidatesCount = 9
  prev: Cell
  next: Cell
  pos: number
  private candidates = DEFAULT_CANDIDATES
  private relatedCells: Cell[] = []
  private changedCells: Cell[] = []

  constructor(pos: number) {
    this.pos = pos
    this.prev = this
    this.next = this
  }

  /**
   * 関連セルリストの作成
   */
  setRelatedCells(cells: Cell[]): void {
    const row = Math.floor(this.pos / 9)
    const col = this.pos % 9
    const area33top = Math.floor(row / 3) * 3
    const area33left = Math.floor(col / 3) * 3
    for (let i = 0; i < 9; i++) {
      const row33 = area33top + Math.floor(i / 3)
      const col33 = area33left + (i % 3)
      this.addRelatedCell(cells, row, i)
      this.addRelatedCell(cells, i, col)
      this.addRelatedCell(cells, row33, col33)
    }
  }

  /**
   * 初期化
   */
  init(): void {
    this.num = 0
    this.candidates = DEFAULT_CANDIDATES
    this.candidatesCount = 9
    this.changedCells.splice(0)
  }

  /**
   * 数字をセット 関連セルの候補も更新
   * 矛盾が生じたら false を返す
   */
  setNum(num: number): boolean {
    const mask = 1 << num
    if ((this.candidates & mask) === 0) {
      return false
    }
    this.num = num
    for (const cell of this.relatedCells) {
      if (cell.num === 0 && cell.candidates & mask) {
        if (cell.candidatesCount === 1) {
          this.resetNum()
          return false
        }
        cell.candidates ^= mask
        cell.candidatesCount--
        this.changedCells.push(cell)
      }
    }
    return true
  }

  /**
   * リセット（空きマスに戻す）
   * changedCells をもとに、関連セルの候補も元に戻す
   */
  resetNum(): void {
    const mask = 1 << this.num
    this.changedCells.forEach((cell) => {
      cell.candidates ^= mask
      cell.candidatesCount++
    })
    this.changedCells.splice(0)
    this.num = 0
  }

  /**
   * 指定位置のセルを関連セルのリストに追加
   */
  private addRelatedCell(cells: Cell[], row: number, col: number): void {
    const pos = row * 9 + col
    if (pos !== this.pos) {
      const cell = cells[pos]
      if (!this.relatedCells.includes(cell)) {
        this.relatedCells.push(cell)
      }
    }
  }
}
