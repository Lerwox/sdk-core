import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'
import invariant from 'tiny-invariant'

import { BigintIsh, MaxUint256 } from '../constants'
import { Fraction } from './Fraction'

const Big = toFormat(_Big)
Big.PE = 1000000
Big.NE = -1000000

export class WeiAmount extends Fraction {
  public readonly decimalScale: JSBI
  public static readonly decimals = 18

  public static fromRawAmount(rawAmount: BigintIsh): WeiAmount {
    return new WeiAmount(rawAmount)
  }

  public static fromEtherAmount(etherAmount: number | string): WeiAmount {
    const rawAmount = WeiAmount.rawAmountFromEtherAmount(etherAmount)
    return new WeiAmount(rawAmount)
  }

  private static rawAmountFromEtherAmount(etherAmount: number | string): BigintIsh {
    return Big(etherAmount).mul(Big(10).pow(WeiAmount.decimals)).toString()
  }

  protected constructor(numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MaxUint256), 'AMOUNT')

    this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(WeiAmount.decimals))
  }

  // operations

  public add(other: Fraction | BigintIsh): WeiAmount {
    const added = super.add(other)
    return new WeiAmount(added.numerator, added.denominator)
  }

  public subtract(other: Fraction | BigintIsh): WeiAmount {
    const subtracted = super.subtract(other)
    return new WeiAmount(subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): WeiAmount {
    const multiplied = super.multiply(other)
    return new WeiAmount(multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): WeiAmount {
    const divided = super.divide(other)
    return new WeiAmount(divided.numerator, divided.denominator)
  }

  // conversion

  public toSignificant(
    significantDigits: number = 6,
    roundingMode?: number,
    format?: object,
  ): string {
    return super.divide(this.decimalScale).toSignificant(significantDigits, roundingMode, format)
  }

  public toFixed(
    decimalPlaces: number = WeiAmount.decimals,
    roundingMode?: number,
    format?: object,
  ): string {
    invariant(decimalPlaces <= WeiAmount.decimals, 'DECIMALS')
    return super.divide(this.decimalScale).toFixed(decimalPlaces, roundingMode, format)
  }
}
