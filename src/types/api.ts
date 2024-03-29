import { MessageToL1, TransactionType } from 'starknet'

export interface FullMessageToL1 extends MessageToL1 {
  from_address: string
}

export interface Transaction {
  sender_address?: string
  transaction_hash?: string
  type?: TransactionType
  contract_address?: string
  class_hash?: string
}