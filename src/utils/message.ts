import { MessageContext, WITHDRAW_MESSAGE } from '../constants'
import { ParsedMessage } from '../types'
import { uint256HexToStrHex } from './uint256'

export function parseMessage(context: string, payload: string[]): ParsedMessage | null {
  switch (context) {
    case MessageContext.STARKGATE:
      if (payload[0] !== WITHDRAW_MESSAGE) return null

      return {
        type: 'withdraw',
        l1Recipient: payload[1],
        amount: uint256HexToStrHex({ low: payload[2], high: payload[3] }),
      }
  }

  return null
}