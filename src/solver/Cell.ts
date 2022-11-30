const CHUNK_NUM = 3
const COL_NUM = 9

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
  candidatesCount = COL_NUM
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
    const row = Math.floor(this.pos / COL_NUM)
    const col = this.pos % COL_NUM
    const area33top = Math.floor(row / CHUNK_NUM) * CHUNK_NUM
    const area33left = Math.floor(col / CHUNK_NUM) * CHUNK_NUM
    for (let i = 0; i < COL_NUM; i++) {
      const row33 = area33top + Math.floor(i / CHUNK_NUM)
      const col33 = area33left + (i % CHUNK_NUM)
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
    this.candidatesCount = COL_NUM
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
    const pos = row * COL_NUM + col
    if (pos !== this.pos) {
      const cell = cells[pos]
      if (!this.relatedCells.includes(cell)) {
        this.relatedCells.push(cell)
      }
    }
  }
}
