export const SolveStatus = {
  success: 0, // 解けた
  invalidLength: 1, // 配列のサイズが違う
  noEmpty: 2, // 空きマスがない
  duplicated: 3, // 重複がある
  unsolvable: 4, // 解けない
} as const

export type SolveStatus = typeof SolveStatus[keyof typeof SolveStatus]

const NO_EMPTY = (1n << 81n) - 1n

export class SudokuSolver {
  numBits: bigint[] = Array<bigint>(10).fill(0n)
  masks: bigint[]

  constructor() {
    // 各マスのマスクを作成
    this.masks = [...Array(81)].map((_, i) => {
      let mask = 0n
      const row = Math.floor(i / 9)
      const col = i % 9
      const area33top = Math.floor(row / 3) * 3
      const area33left = Math.floor(col / 3) * 3
      for (let i = 0; i < 9; i++) {
        const row33 = area33top + Math.floor(i / 3)
        const col33 = area33left + (i % 3)
        mask |= 1n << BigInt(row * 9 + i)
        mask |= 1n << BigInt(i * 9 + col)
        mask |= 1n << BigInt(row33 * 9 + col33)
      }
      return mask
    })
  }

  /**
   * 現在の盤面のデータを取得
   */
  getNumberArray(): number[] {
    return [...Array(81)].map((_, i) => {
      const bit = 1n << BigInt(i)
      for (let i = 1; i <= 9; i++) {
        if (this.numBits[i] & bit) return i
      }
      return 0
    })
  }

  /**
   * 数独を解く
   */
  solve(numArray: number[]): SolveStatus {
    if (numArray.length !== 81) {
      return SolveStatus.invalidLength
    }
    if (!this.setNumArray(numArray)) {
      return SolveStatus.duplicated
    }
    if (this.numBits[0] === NO_EMPTY) {
      return SolveStatus.noEmpty
    }

    return this.solveRecursive(0, 1n)
      ? SolveStatus.success
      : SolveStatus.unsolvable
  }

  /**
   * solve の内部処理（再帰関数）
   * 解けたら true, 解けなかったら false を返す
   */
  private solveRecursive(pos: number, bit: bigint): boolean {
    while (true) {
      if (pos === 81) return true
      if ((this.numBits[0] & bit) === 0n) break
      pos++
      bit <<= 1n
    }

    for (let i = 1; i <= 9; i++) {
      if (this.setNum(pos, bit, i)) {
        if (this.solveRecursive(pos + 1, bit << 1n)) {
          return true
        }
        this.numBits[0] ^= bit
        this.numBits[i] ^= bit
      }
    }

    return false
  }

  /**
   * 数字をセット
   * 重複していたら false
   */
  private setNum(pos: number, bit: bigint, num: number): boolean {
    if (this.numBits[num] & this.masks[pos]) {
      return false
    }
    this.numBits[0] |= bit
    this.numBits[num] |= bit
    return true
  }

  /**
   * 数字の配列をセット
   * 重複があれば false
   */
  private setNumArray(numArray: number[]): boolean {
    this.numBits.fill(0n)
    return numArray.every((num, i) => {
      const bit: bigint = 1n << BigInt(i)
      return num === 0 || this.setNum(i, bit, num)
    })
  }
}
