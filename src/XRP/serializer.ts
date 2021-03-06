/* eslint-disable  max-lines --
 * gRPC is verbose. Playing code golf with this file would decrease clarity for little readability gain.
 */
import Utils from '../Common/utils'

import { AccountAddress } from './generated/org/xrpl/rpc/v1/account_pb'
import {
  XRPDropsAmount,
  Currency,
  IssuedCurrencyAmount,
  CurrencyAmount,
} from './generated/org/xrpl/rpc/v1/amount_pb'
import {
  Authorize,
  CheckID,
  ClearFlag,
  DestinationTag,
  Domain,
  EmailHash,
  InvoiceID,
  LastLedgerSequence,
  MessageKey,
  SetFlag,
  Sequence,
  TransferRate,
  TickSize,
  Amount,
  MemoData,
  MemoFormat,
  MemoType,
  Unauthorize,
  Destination,
  DeliverMin,
  SendMax,
  TransactionSignature,
  SigningPublicKey,
  Expiration,
  Account,
  TakerGets,
  TakerPays,
  OfferSequence,
  Owner,
  Condition,
  CancelAfter,
  FinishAfter,
  Channel,
  SignerQuorum,
  RegularKey,
  SettleDelay,
  PaymentChannelSignature,
  PublicKey,
  Balance,
  Fulfillment,
  SignerWeight,
  QualityIn,
  QualityOut,
  LimitAmount,
  SignerEntry,
} from './generated/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Memo,
  Payment,
  Transaction,
  DepositPreauth,
  AccountDelete,
  OfferCancel,
  CheckCancel,
  CheckCash,
  CheckCreate,
  OfferCreate,
  EscrowCancel,
  EscrowCreate,
  EscrowFinish,
  SignerListSet,
  PaymentChannelClaim,
  PaymentChannelCreate,
  PaymentChannelFund,
  SetRegularKey,
  TrustSet,
} from './generated/org/xrpl/rpc/v1/transaction_pb'
import XrpUtils from './xrp-utils'

/**
 * Common fields on a transaction.
 */
interface BaseTransactionJSON {
  Account: string
  Fee: XRPDropsAmountJSON
  LastLedgerSequence: LastLedgerSequenceJSON
  Sequence: number
  SigningPubKey: string
  TxnSignature?: string
  Memos?: MemoJSON[]
  Flags?: FlagsJSON
}

/**
 * Transaction Specific Fields.
 */
export interface AccountSetJSON {
  ClearFlag?: ClearFlagJSON
  Domain?: DomainJSON
  EmailHash?: EmailHashJSON
  MessageKey?: MessageKeyJSON
  SetFlag?: SetFlagJSON
  TransferRate?: TransferRateJSON
  TickSize?: TickSizeJSON
  TransactionType: 'AccountSet'
}

export interface CheckCashJSON {
  CheckID: CheckIDJSON
  Amount?: CurrencyAmountJSON
  DeliverMin?: DeliverMinJSON
  TransactionType: 'CheckCash'
}

export interface CheckCreateJSON {
  Destination: DestinationJSON
  SendMax: SendMaxJSON
  DestinationTag?: DestinationTagJSON
  Expiration?: ExpirationJSON
  InvoiceID?: InvoiceIdJSON
  TransactionType: 'CheckCreate'
}

export interface DepositPreauthJSON {
  Authorize?: AuthorizeJSON
  Unauthorize?: UnauthorizeJSON
  TransactionType: 'DepositPreauth'
}

export interface EscrowCancelJSON {
  OfferSequence: OfferSequenceJSON
  Owner: OwnerJSON
  TransactionType: 'EscrowCancel'
}

export interface EscrowCreateJSON {
  Amount: AmountJSON
  CancelAfter?: CancelAfterJSON
  Condition?: ConditionJSON
  Destination: DestinationJSON
  DestinationTag?: DestinationTagJSON
  FinishAfter?: FinishAfterJSON
  TransactionType: 'EscrowCreate'
}

export interface EscrowFinishJSON {
  Condition?: ConditionJSON
  Fulfillment?: FulfillmentJSON
  OfferSequence: OfferSequenceJSON
  Owner: OwnerJSON
  TransactionType: 'EscrowFinish'
}

export interface OfferCancelJSON {
  OfferSequence: OfferSequenceJSON
  TransactionType: 'OfferCancel'
}

export interface PaymentJSON {
  Amount: AmountJSON
  DeliverMin?: DeliverMinJSON
  Destination: DestinationJSON
  DestinationTag?: DestinationTagJSON
  InvoiceID?: InvoiceIdJSON
  Paths?: PathJSON[]
  SendMax?: SendMaxJSON
  TransactionType: 'Payment'
}

export interface AccountDeleteJSON {
  Destination: DestinationJSON
  DestinationTag?: DestinationTagJSON
  TransactionType: 'AccountDelete'
}

export interface CheckCancelJSON {
  CheckID: CheckIDJSON
  TransactionType: 'CheckCancel'
}

export interface PaymentChannelClaimJSON {
  Amount?: AmountJSON
  Balance?: BalanceJSON
  Channel: ChannelJSON
  PublicKey?: PublicKeyJSON
  Signature?: PaymentChannelSignatureJSON
  TransactionType: 'PaymentChannelClaim'
}

export interface PaymentChannelCreateJSON {
  Amount: AmountJSON
  Destination: DestinationJSON
  SettleDelay: SettleDelayJSON
  PublicKey: PublicKeyJSON
  CancelAfter?: CancelAfterJSON
  DestinationTag?: DestinationTagJSON
  TransactionType: 'PaymentChannelCreate'
}

export interface PaymentChannelFundJSON {
  Channel: ChannelJSON
  Amount: AmountJSON
  Expiration?: ExpirationJSON
  TransactionType: 'PaymentChannelFund'
}

export interface OfferCreateJSON {
  Expiration?: ExpirationJSON
  OfferSequence?: OfferSequenceJSON
  TakerGets: TakerGetsJSON
  TakerPays: TakerPaysJSON
  TransactionType: 'OfferCreate'
}

export interface SignerListSetJSON {
  SignerQuorum: SignerQuorumJSON
  SignerEntries: SignerEntryJSON[]
  TransactionType: 'SignerListSet'
}

export interface SetRegularKeyJSON {
  RegularKey?: RegularKeyJSON
  TransactionType: 'SetRegularKey'
}

export interface TrustSetJSON {
  LimitAmount: LimitAmountJSON
  QualityIn?: QualityInJSON
  QualityOut?: QualityOutJSON
  TransactionType: 'TrustSet'
}

// Generic field representing an OR of all above fields.
type TransactionDataJSON =
  | AccountDeleteJSON
  | AccountSetJSON
  | CheckCancelJSON
  | CheckCashJSON
  | CheckCreateJSON
  | DepositPreauthJSON
  | EscrowCancelJSON
  | EscrowCreateJSON
  | EscrowFinishJSON
  | OfferCancelJSON
  | OfferCreateJSON
  | PaymentJSON
  | SignerListSetJSON
  | PaymentChannelClaimJSON
  | PaymentChannelCreateJSON
  | PaymentChannelFundJSON
  | SetRegularKeyJSON
  | TrustSetJSON

/**
 * Individual Transaction Types.
 */
type AccountDeleteTransactionJSON = BaseTransactionJSON & AccountDeleteJSON
type AccountSetTransactionJSON = BaseTransactionJSON & AccountSetJSON
type CheckCancelTransactionJSON = BaseTransactionJSON & CheckCancelJSON
type CheckCashTransactionJSON = BaseTransactionJSON & CheckCashJSON
type CheckCreateTransactionJSON = BaseTransactionJSON & CheckCreateJSON
type DepositPreauthTransactionJSON = BaseTransactionJSON & DepositPreauthJSON
type OfferCancelTransactionJSON = BaseTransactionJSON & OfferCancelJSON
type OfferCreateTransactionJSON = BaseTransactionJSON & OfferCreateJSON
type EscrowCancelTransactionJSON = BaseTransactionJSON & EscrowCancelJSON
type EscrowCreateTransactionJSON = BaseTransactionJSON & EscrowCreateJSON
type EscrowFinishTransactionJSON = BaseTransactionJSON & EscrowFinishJSON
type PaymentTransactionJSON = BaseTransactionJSON & PaymentJSON
type SignerListSetTransactionJSON = BaseTransactionJSON & SignerListSetJSON
type PaymentChannelClaimTransactionJSON = BaseTransactionJSON &
  PaymentChannelClaimJSON
type PaymentChannelCreateTransactionJSON = BaseTransactionJSON &
  PaymentChannelCreateJSON
type PaymentChannelFundTransactionJSON = BaseTransactionJSON &
  PaymentChannelFundJSON
type SetRegularKeyTransactionJSON = BaseTransactionJSON & SetRegularKeyJSON
type TrustSetTransactionJSON = BaseTransactionJSON & TrustSetJSON

/**
 * All Transactions.
 */
export type TransactionJSON =
  | AccountDeleteTransactionJSON
  | AccountSetTransactionJSON
  | CheckCancelTransactionJSON
  | CheckCashTransactionJSON
  | CheckCreateTransactionJSON
  | DepositPreauthTransactionJSON
  | EscrowCancelTransactionJSON
  | EscrowCreateTransactionJSON
  | EscrowFinishTransactionJSON
  | OfferCancelTransactionJSON
  | OfferCreateTransactionJSON
  | PaymentTransactionJSON
  | SignerListSetTransactionJSON
  | PaymentChannelCreateTransactionJSON
  | PaymentChannelClaimTransactionJSON
  | PaymentChannelFundTransactionJSON
  | SetRegularKeyTransactionJSON
  | TrustSetTransactionJSON

/**
 * Types for serialized sub-objects.
 */
interface SignerEntryJSON {
  Account: AccountJSON
  SignerWeight: SignerWeightJSON
}

interface MemoJSON {
  Memo?: MemoDetailsJSON
}

interface MemoDetailsJSON {
  MemoData?: MemoDataJSON
  MemoType?: MemoDataJSON
  MemoFormat?: MemoDataJSON
}

interface PathElementJSON {
  account?: string
  issuer?: string
  currency?: CurrencyJSON
}

interface IssuedCurrencyAmountJSON {
  value: string
  currency: CurrencyJSON
  issuer: string
}

type ChannelJSON = string
type BalanceJSON = CurrencyAmountJSON
type DeliverMinJSON = CurrencyAmountJSON
type AccountAddressJSON = string
type CheckIDJSON = string
type SendMaxJSON = CurrencyAmountJSON
type TransactionSignatureJSON = string
type SigningPublicKeyJSON = string
type ExpirationJSON = number
type AccountJSON = string
type DestinationJSON = AccountAddressJSON
type AmountJSON = CurrencyAmountJSON
type MemoDataJSON = string
type MemoTypeJSON = string
type MemoFormatJSON = string
type UnauthorizeJSON = string
type SequenceJSON = number
type LastLedgerSequenceJSON = number
type XRPDropsAmountJSON = string
type CurrencyAmountJSON = IssuedCurrencyAmountJSON | XRPDropsAmountJSON
type ClearFlagJSON = number
type EmailHashJSON = string
type SetFlagJSON = number
type TickSizeJSON = number
type DestinationTagJSON = number
type TransferRateJSON = number
type DomainJSON = string
type MessageKeyJSON = string
type AuthorizeJSON = string
type InvoiceIdJSON = string
type PathJSON = PathElementJSON[]
type CurrencyJSON = string
type TakerGetsJSON = CurrencyAmountJSON
type TakerPaysJSON = CurrencyAmountJSON
type OfferSequenceJSON = number
type OwnerJSON = string
type ConditionJSON = string
type CancelAfterJSON = number
type FinishAfterJSON = number
type SignerQuorumJSON = number
type RegularKeyJSON = AccountAddressJSON
type SettleDelayJSON = number
type PaymentChannelSignatureJSON = string
type PublicKeyJSON = string
type FulfillmentJSON = string
type SignerWeightJSON = number
type QualityInJSON = number
type QualityOutJSON = number
type LimitAmountJSON = CurrencyAmountJSON
type FlagsJSON = number

/**
 * Provides functionality to serialize from protocol buffers to JSON objects.
 */
const serializer = {
  /**
   * Convert a Transaction to a JSON representation.
   *
   * @param transaction - A Transaction to convert.
   * @param signature - An optional hex encoded signature to include in the transaction.
   * @returns The Transaction as JSON.
   */
  // eslint-disable-next-line max-statements, max-lines-per-function -- No clear way to refactor this because gRPC is verbose.
  transactionToJSON(
    transaction: Transaction,
    signature?: string,
  ): TransactionJSON | undefined {
    const object: BaseTransactionJSON = {
      Account: '',
      Fee: '',
      Sequence: 0,
      LastLedgerSequence: 0,
      SigningPubKey: '',
    }

    const normalizedAccount = getNormalizedAccount(transaction)
    if (!normalizedAccount) {
      return undefined
    }
    object.Account = normalizedAccount

    // Convert XRP denominated fee field.
    const txFee = transaction.getFee()
    if (txFee === undefined) {
      return undefined
    }
    object.Fee = this.xrpAmountToJSON(txFee)

    // Set sequence numbers
    const sequence = transaction.getSequence()
    object.Sequence = sequence !== undefined ? this.sequenceToJSON(sequence) : 0

    const lastLedgerSequence = transaction.getLastLedgerSequence()
    object.LastLedgerSequence =
      lastLedgerSequence !== undefined
        ? this.lastLedgerSequenceToJSON(lastLedgerSequence)
        : 0

    const signingPubKeyBytes = transaction
      .getSigningPublicKey()
      ?.getValue_asU8()
    if (signingPubKeyBytes) {
      object.SigningPubKey = Utils.toHex(signingPubKeyBytes)
    }

    if (signature) {
      object.TxnSignature = signature
    }

    const memoList = transaction.getMemosList()
    if (memoList.length > 0) {
      object.Memos = this.memoListToJSON(memoList)
    }

    const flags = transaction.getFlags()
    if (flags) {
      object.Flags = flags.getValue()
    }

    const additionalTransactionData = getAdditionalTransactionData(transaction)
    if (additionalTransactionData === undefined) {
      return undefined
    }

    const transactionJSON: TransactionJSON = {
      ...object,
      ...additionalTransactionData,
    }
    return transactionJSON
  },

  /**
   * Convert a Payment to a JSON representation.
   *
   * @param payment - The Payment to convert.
   * @returns The Payment as JSON.
   */
  paymentToJSON(payment: Payment): PaymentJSON | undefined {
    // Process required fields.
    const amount = payment.getAmount()
    const destination = payment.getDestination()
    if (amount === undefined || destination === undefined) {
      return undefined
    }

    const amountJson = this.amountToJSON(amount)
    const destinationJson = this.destinationToJSON(destination)
    if (amountJson === undefined || destinationJson === undefined) {
      return undefined
    }

    const json: PaymentJSON = {
      Amount: amountJson,
      Destination: destinationJson,
      TransactionType: 'Payment',
    }

    // Process optional fields.
    // TODO(keefertaylor): Add support for additional optional fields here.
    const destinationTag = payment.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

    const invoiceId = payment.getInvoiceId()
    if (invoiceId !== undefined) {
      json.InvoiceID = this.invoiceIdToJSON(invoiceId)
    }

    const deliverMin = payment.getDeliverMin()
    if (deliverMin !== undefined) {
      json.DeliverMin = this.deliverMinToJSON(deliverMin)
    }

    const sendMax = payment.getSendMax()
    if (sendMax !== undefined) {
      json.SendMax = this.sendMaxToJSON(sendMax)
    }

    const pathList = payment.getPathsList()
    if (pathList.length > 0) {
      json.Paths = pathList.map((path) => {
        return this.pathToJSON(path)
      })
    }

    return json
  },

  /**
   * Convert a DepositPreauth to a JSON representation.
   *
   * @param depositPreauth - The DepositPreauth to convert.
   * @returns The DepositPreauth as JSON.
   */
  depositPreauthToJSON(
    depositPreauth: DepositPreauth,
  ): DepositPreauthJSON | undefined {
    const json: DepositPreauthJSON = {
      TransactionType: 'DepositPreauth',
    }
    const type = depositPreauth.getAuthorizationOneofCase()
    switch (type) {
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZE: {
        const authorize = depositPreauth.getAuthorize()
        if (authorize === undefined) {
          return undefined
        }

        const authorizeJSON = this.authorizeToJSON(authorize)
        json.Authorize = authorizeJSON
        return json
      }
      case DepositPreauth.AuthorizationOneofCase.UNAUTHORIZE: {
        const unauthorize = depositPreauth.getUnauthorize()
        if (unauthorize === undefined) {
          return undefined
        }
        const unauthorizeJSON = this.unauthorizeToJSON(unauthorize)

        json.Unauthorize = unauthorizeJSON
        return json
      }
      case DepositPreauth.AuthorizationOneofCase.AUTHORIZATION_ONEOF_NOT_SET: {
        return undefined
      }
      default: {
        return undefined
      }
    }
  },

  /**
   * Convert an OfferSequence to a JSON representation.
   *
   * @param offerSequence - The OfferSequence to convert.
   * @returns The OfferSequence as JSON.
   */
  offerSequenceToJSON(offerSequence: OfferSequence): OfferSequenceJSON {
    return offerSequence.getValue()
  },

  /**
   * Convert an Owner to a JSON representation.
   *
   * @param owner - The Owner to convert.
   * @returns The Owner as JSON.
   */
  ownerToJSON(owner: Owner): OwnerJSON | undefined {
    const accountAddress = owner.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert an EscrowCancel to a JSON representation.
   *
   * @param escrowCancel - The EscrowCancel to convert.
   * @returns The EscrowCancel as JSON.
   */
  escrowCancelToJSON(escrowCancel: EscrowCancel): EscrowCancelJSON | undefined {
    const offerSequence = escrowCancel.getOfferSequence()
    const owner = escrowCancel.getOwner()
    if (offerSequence === undefined || owner === undefined) {
      return undefined
    }

    const offerSequenceJSON = this.offerSequenceToJSON(offerSequence)
    const ownerJSON = this.ownerToJSON(owner)
    if (!ownerJSON) {
      return undefined
    }

    return {
      OfferSequence: offerSequenceJSON,
      Owner: ownerJSON,
      TransactionType: 'EscrowCancel',
    }
  },

  /**
   * Convert an EscrowCreate to a JSON representation.
   *
   * @param escrowCreate - The EscrowCreate to convert.
   * @returns The EscrowCreate as JSON.
   */
  escrowCreateToJSON(escrowCreate: EscrowCreate): EscrowCreateJSON | undefined {
    const amount = escrowCreate.getAmount()
    const destination = escrowCreate.getDestination()
    if (amount === undefined || destination === undefined) {
      return undefined
    }

    const amountJson = this.amountToJSON(amount)
    const destinationJson = this.destinationToJSON(destination)
    if (amountJson === undefined || destinationJson === undefined) {
      return undefined
    }

    const json: EscrowCreateJSON = {
      Amount: amountJson,
      Destination: destinationJson,
      TransactionType: 'EscrowCreate',
    }

    const cancelAfter = escrowCreate.getCancelAfter()
    if (cancelAfter !== undefined) {
      json.CancelAfter = this.cancelAfterToJSON(cancelAfter)
    }

    const condition = escrowCreate.getCondition()
    if (condition !== undefined) {
      json.Condition = this.conditionToJSON(condition)
    }

    const destinationTag = escrowCreate.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

    const finishAfter = escrowCreate.getFinishAfter()
    if (finishAfter !== undefined) {
      json.FinishAfter = this.finishAfterToJSON(finishAfter)
    }

    return json
  },

  /**
   * Convert an EscrowFinish to a JSON representation.
   *
   * @param escrowFinish - The EscrowFinish to convert.
   * @returns The EscrowFinish as JSON.
   */
  escrowFinishToJSON(escrowFinish: EscrowFinish): EscrowFinishJSON | undefined {
    const offerSequence = escrowFinish.getOfferSequence()
    const owner = escrowFinish.getOwner()
    if (owner === undefined || offerSequence === undefined) {
      return undefined
    }

    const ownerJSON = this.ownerToJSON(owner)
    if (ownerJSON === undefined) {
      return undefined
    }

    const json: EscrowFinishJSON = {
      OfferSequence: this.offerSequenceToJSON(offerSequence),
      Owner: ownerJSON,
      TransactionType: 'EscrowFinish',
    }

    const condition = escrowFinish.getCondition()
    if (condition !== undefined) {
      json.Condition = this.conditionToJSON(condition)
    }

    const fulfillment = escrowFinish.getFulfillment()
    if (fulfillment !== undefined) {
      json.Fulfillment = this.fulfillmentToJSON(fulfillment)
    }

    return json
  },

  /**
   * Convert a AccountSet to a JSON representation.
   *
   * @param accountSet - The AccountSet to convert.
   * @returns The AccountSet as JSON.
   */
  // eslint-disable-next-line max-statements -- No clear way to make this more succinct because gRPC is verbose
  accountSetToJSON(accountSet: AccountSet): AccountSetJSON | undefined {
    const json: AccountSetJSON = { TransactionType: 'AccountSet' }

    const clearFlag = accountSet.getClearFlag()
    if (clearFlag !== undefined) {
      json.ClearFlag = this.clearFlagToJSON(clearFlag)
    }

    const domain = accountSet.getDomain()
    if (domain !== undefined) {
      json.Domain = this.domainToJSON(domain)
    }

    const emailHash = accountSet.getEmailHash()
    if (emailHash !== undefined) {
      json.EmailHash = this.emailHashToJSON(emailHash)
    }

    const messageKey = accountSet.getMessageKey()
    if (messageKey !== undefined) {
      json.MessageKey = this.messageKeyToJSON(messageKey)
    }

    const setFlag = accountSet.getSetFlag()
    if (setFlag !== undefined) {
      json.SetFlag = this.setFlagToJSON(setFlag)
    }

    const transferRate = accountSet.getTransferRate()
    if (transferRate !== undefined) {
      json.TransferRate = this.transferRateToJSON(transferRate)
    }

    const tickSize = accountSet.getTickSize()?.getValue()
    if (tickSize !== undefined) {
      json.TickSize = tickSize
    }

    return json
  },

  /**
   * Convert an XRPDropsAmount to a JSON representation.
   *
   * @param xrpDropsAmount - The XRPAmount to convert.
   * @returns The XRPAmount as JSON.
   */
  xrpAmountToJSON(xrpDropsAmount: XRPDropsAmount): string {
    return `${xrpDropsAmount.getDrops()}`
  },

  /**
   * Convert a list of Paths to a JSON representation.
   *
   * @param pathList - A list of Paths to convert.
   * @returns The list as JSON.
   */
  pathListToJSON(pathList: Payment.Path[]): PathJSON[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Manually assigning `this`.
    return pathList.map(this.pathToJSON, this)
  },

  /**
   * Convert a payment's Path to a JSON representation.
   *
   * @param path - The Path to convert.
   * @returns The Path as JSON.
   */
  pathToJSON(path: Payment.Path): PathJSON {
    const elements = path.getElementsList()
    return elements.map((element) => {
      return this.pathElementToJSON(element)
    })
  },

  /**
   * Convert a payment's PathElement to a JSON representation.
   *
   * @param pathElement - The PathElement to convert.
   * @returns The PathElement as JSON.
   */
  pathElementToJSON(pathElement: Payment.PathElement): PathElementJSON {
    const json: PathElementJSON = {}

    const issuer = pathElement.getIssuer()?.getAddress()
    if (issuer) {
      json.issuer = issuer
    }

    const currency = pathElement.getCurrency()
    if (currency) {
      json.currency = this.currencyToJSON(currency)
    }

    const account = pathElement.getAccount()?.getAddress()
    if (account) {
      json.account = account
    }

    return json
  },

  /**
   * Convert an array of Memo objects to a JSON representation keyed by
   * a field called 'Memos' iff the array is not empty and it contains
   * non-empty objects.
   *
   * @param memos - The Memos to convert.
   *
   * @returns An array of the Memos in JSON format, or undefined.
   */
  memoListToJSON(memos: Memo[]): MemoJSON[] {
    // eslint-disable-next-line @typescript-eslint/unbound-method -- Manually assigning `this`.
    return memos.map(this.memoToJSON, this)
  },

  /**
   * Convert a Memo to a JSON representation.
   *
   * @param memo - The Memo to convert.
   * @returns The Memo as JSON.
   */
  memoToJSON(memo: Memo): MemoJSON {
    const memoData = memo.getMemoData()
    const memoFormat = memo.getMemoFormat()
    const memoType = memo.getMemoType()

    const jsonMemo: MemoDetailsJSON = {
      MemoData: undefined,
      MemoFormat: undefined,
      MemoType: undefined,
    }

    if (memoData !== undefined) {
      jsonMemo.MemoData = this.memoDataToJSON(memoData)
    }

    if (memoFormat !== undefined) {
      jsonMemo.MemoFormat = this.memoFormatToJSON(memoFormat)
    }

    if (memoType !== undefined) {
      jsonMemo.MemoType = this.memoTypeToJSON(memoType)
    }

    return {
      Memo: jsonMemo,
    }
  },

  /**
   * Convert a MemoData to a JSON representation.
   *
   * @param memoData - The MemoData to convert.
   * @returns The MemoData as JSON.
   */
  memoDataToJSON(memoData: MemoData): MemoDataJSON {
    return Utils.toHex(memoData.getValue_asU8())
  },

  /**
   * Convert a MemoFormat to a JSON representation.
   *
   * @param memoFormat - The MemoFormat to convert.
   * @returns The MemoFormat as JSON.
   */
  memoFormatToJSON(memoFormat: MemoFormat): MemoFormatJSON {
    return Utils.toHex(memoFormat.getValue_asU8())
  },

  /**
   * Convert a MemoType to a JSON representation.
   *
   * @param memoType - The MemoType to convert.
   * @returns The MemoType as JSON.
   */
  memoTypeToJSON(memoType: MemoType): MemoTypeJSON {
    return Utils.toHex(memoType.getValue_asU8())
  },

  /**
   * Convert a {@link IssuedCurrencyAmount} to a JSON representation.
   *
   * @param issuedCurrencyAmount - The {@link IssuedCurrencyAmount} to convert.
   * @returns A JSON representation of the input.
   */
  issuedCurrencyAmountToJSON(
    issuedCurrencyAmount: IssuedCurrencyAmount,
  ): IssuedCurrencyAmountJSON | undefined {
    const currencyWrapper = issuedCurrencyAmount.getCurrency()
    const value = issuedCurrencyAmount.getValue()

    const issuer = issuedCurrencyAmount.getIssuer()
    if (currencyWrapper === undefined || value === '' || issuer === undefined) {
      return undefined
    }

    const currency = this.currencyToJSON(currencyWrapper)
    if (currency === undefined) {
      return undefined
    }

    return {
      currency,
      value,
      issuer: this.accountAddressToJSON(issuer),
    }
  },

  /**
   * Convert a Currency to a JSON representation.
   *
   * @param currency - The Currency to convert.
   * @returns The Currency as JSON.
   */
  currencyToJSON(currency: Currency): CurrencyJSON | undefined {
    const currencyName = currency.getName()
    if (currencyName !== '') {
      return currencyName
    }

    const currencyCodeBytes = currency.getCode_asU8()
    if (currencyCodeBytes.length !== 0) {
      return Utils.toHex(currencyCodeBytes)
    }

    return undefined
  },

  /**
   * Convert an Account Address to a JSON representation.
   *
   * @param accountAddress - The AccountAddress to convert.
   * @returns The AccountAddress as JSON.
   */
  accountAddressToJSON(accountAddress: AccountAddress): AccountAddressJSON {
    return accountAddress.getAddress()
  },

  /**
   * Convert an Unauthorize to a JSON representation.
   *
   * @param unauthorize - The Unauthorize to convert.
   * @returns The Unauthorize as JSON.
   */
  unauthorizeToJSON(unauthorize: Unauthorize): UnauthorizeJSON | undefined {
    const accountAddress = unauthorize.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert a Sequence to a JSON representation.
   *
   * @param sequence - The Sequence to convert.
   * @returns The Sequence as JSON.
   */
  sequenceToJSON(sequence: Sequence): SequenceJSON {
    return sequence.getValue()
  },

  /**
   * Convert a LastLedgerSequence to a JSON representation.
   *
   * @param lastLedgerSequence - The LastLedgerSequence to convert.
   * @returns The LastLedgerSequence as JSON.
   */
  lastLedgerSequenceToJSON(
    lastLedgerSequence: LastLedgerSequence,
  ): LastLedgerSequenceJSON {
    return lastLedgerSequence.getValue()
  },

  /**
   * Convert a ClearFlag to a JSON representation.
   *
   * @param clearFlag - The ClearFlag to convert.
   * @returns The ClearFlag as JSON.
   */
  clearFlagToJSON(clearFlag: ClearFlag): ClearFlagJSON {
    return clearFlag.getValue()
  },

  /**
   * Convert an EmailHash to a JSON representation.
   *
   * @param emailHash - The EmailHash to convert.
   * @returns The EmailHash as JSON.
   */
  emailHashToJSON(emailHash: EmailHash): EmailHashJSON {
    const emailHashBytes = emailHash.getValue_asU8()
    return Utils.toHex(emailHashBytes)
  },

  /**
   * Convert a SetFlag to a JSON representation.
   *
   * @param setFlag - The SetFlag to convert.
   * @returns The SetFlag as JSON.
   */
  setFlagToJSON(setFlag: SetFlag): SetFlagJSON {
    return setFlag.getValue()
  },

  /**
   * Convert a TickSize to a JSON representation.
   *
   * @param tickSize - The TickSize to convert.
   * @returns The TickSize as JSON.
   */
  tickSizeToJSON(tickSize: TickSize): TickSizeJSON {
    return tickSize.getValue()
  },

  /**
   * Convert a DestinationTag to a JSON representation.
   *
   * @param destinationTag - The DestinationTag to convert.
   * @returns The DestinationTag as JSON.
   */
  destinationTagToJSON(destinationTag: DestinationTag): DestinationTagJSON {
    return destinationTag.getValue()
  },

  /**
   * Convert a TransferRate to a JSON representation.
   *
   * @param transferRate - The TransferRate to convert.
   * @returns The TransferRate as JSON.
   */
  transferRateToJSON(transferRate: TransferRate): TransferRateJSON {
    return transferRate.getValue()
  },

  /**
   * Convert a Domain to a JSON representation.
   *
   * @param domain - The Domain to convert.
   * @returns The Domain as JSON.
   */
  domainToJSON(domain: Domain): DomainJSON {
    return domain.getValue()
  },

  /**
   * Convert a MessageKey to a JSON representation.
   *
   * @param messageKey - The MessageKey to convert.
   * @returns The MessageKey as JSON.
   */
  messageKeyToJSON(messageKey: MessageKey): MessageKeyJSON {
    const messageKeyBytes = messageKey.getValue_asU8()
    return Utils.toHex(messageKeyBytes)
  },

  /**
   * Convert an Authorize to a JSON representation.
   *
   * @param authorize - The Authorize to convert.
   * @returns The Authorize as JSON.
   */
  authorizeToJSON(authorize: Authorize): AuthorizeJSON | undefined {
    const accountAddress = authorize.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert an InvoiceID to a JSON representation.
   *
   * @param invoiceId - The InvoiceID to convert.
   * @returns The InvoiceID as JSON.
   */
  invoiceIdToJSON(invoiceId: InvoiceID): InvoiceIdJSON {
    return Utils.toHex(invoiceId.getValue_asU8())
  },

  /**
   * Convert an Amount to a JSON representation.
   *
   * @param amount - The Amount to convert.
   * @returns The Amount as JSON.
   */
  amountToJSON(amount: Amount): AmountJSON | undefined {
    const currencyAmount = amount.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a CurrencyAmount to a JSON representation.
   *
   * @param currencyAmount - The CurrencyAmount to convert.
   * @returns The CurrencyAmount as JSON.
   */
  currencyAmountToJSON(
    currencyAmount: CurrencyAmount,
  ): CurrencyAmountJSON | undefined {
    switch (currencyAmount.getAmountCase()) {
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (issuedCurrencyAmount === undefined) {
          return undefined
        }
        return this.issuedCurrencyAmountToJSON(issuedCurrencyAmount)
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const xrpAmount = currencyAmount.getXrpAmount()
        if (xrpAmount === undefined) {
          return undefined
        }
        return this.xrpAmountToJSON(xrpAmount)
      }
      case CurrencyAmount.AmountCase.AMOUNT_NOT_SET:
      default:
        return undefined
    }
  },

  /**
   * Convert a Destination to a JSON representation.
   *
   * @param destination - The Destination to convert.
   * @returns The Destination as JSON.
   */
  destinationToJSON(destination: Destination): DestinationJSON | undefined {
    const accountAddress = destination.getValue()
    if (accountAddress === undefined) {
      return undefined
    }
    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert a DeliverMin to a JSON respresentation.
   *
   * @param deliverMin - The DeliverMin to convert.
   * @returns The DeliverMin as JSON.
   */
  deliverMinToJSON(deliverMin: DeliverMin): DeliverMinJSON | undefined {
    const currencyAmount = deliverMin.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }
    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a CheckID to a JSON representation.
   *
   * @param checkId - The CheckID to convert.
   * @returns The CheckID as JSON.
   */
  checkIDToJSON(checkId: CheckID): CheckIDJSON {
    return Utils.toHex(checkId.getValue_asU8())
  },

  /**
   * Convert a CheckCancel to a JSON representation.
   *
   * @param checkCancel - The CheckCancel to convert.
   * @returns The CheckCancel as JSON.
   */
  checkCancelToJSON(checkCancel: CheckCancel): CheckCancelJSON | undefined {
    const checkId = checkCancel.getCheckId()
    if (checkId === undefined) {
      return undefined
    }

    return {
      CheckID: this.checkIDToJSON(checkId),
      TransactionType: 'CheckCancel',
    }
  },

  /**
   * Convert a SendMax to a JSON respresentation.
   *
   * @param sendMax - The SendMax to convert.
   * @returns The SendMax as JSON.
   */
  sendMaxToJSON(sendMax: SendMax): SendMaxJSON | undefined {
    const currencyAmount = sendMax.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }
    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert an TransactionSignature to a JSON representation.
   *
   * @param transactionSignature - The TransactionSignature to convert.
   * @returns The TransactionSignature as JSON.
   */
  transactionSignatureToJSON(
    transactionSignature: TransactionSignature,
  ): TransactionSignatureJSON {
    return Utils.toHex(transactionSignature.getValue_asU8())
  },

  /**
   * Convert a SigningPublicKey to a JSON representation.
   *
   * @param signingPublicKey - The SigningPublicKey to convert.
   * @returns The SigningPublicKey as JSON.
   */
  signingPublicKeyToJSON(
    signingPublicKey: SigningPublicKey,
  ): SigningPublicKeyJSON {
    return Utils.toHex(signingPublicKey.getValue_asU8())
  },

  /**
   * Convert an Expiration to a JSON representation.
   *
   * @param expiration - The Expiration to convert.
   * @returns The Expiration as JSON.
   */
  expirationToJSON(expiration: Expiration): ExpirationJSON {
    return expiration.getValue()
  },

  /**
   * Convert a TakerGets to a JSON representation.
   *
   * @param takerGets - The TakerGets to convert.
   * @returns The TakerGets as JSON.
   */
  takerGetsToJSON(takerGets: TakerGets): TakerGetsJSON | undefined {
    const currencyAmount = takerGets.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a TakerPays to a JSON representation.
   *
   * @param takerPays - The TakerPays to convert.
   * @returns The TakerPays as JSON.
   */
  takerPaysToJSON(takerPays: TakerPays): TakerPaysJSON | undefined {
    const currencyAmount = takerPays.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert an Account to a JSON representation.
   *
   * @param account - The Account to convert.
   * @returns The Account as JSON.
   */
  accountToJSON(account: Account): AccountJSON | undefined {
    const accountAddress = account.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert an AccountDelete to a JSON representation.
   *
   * @param accountDelete - The AccountDelete to convert.
   * @returns The AccountDelete as JSON.
   */
  accountDeleteToJSON(
    accountDelete: AccountDelete,
  ): AccountDeleteJSON | undefined {
    // Process mandatory fields.
    const destination = accountDelete.getDestination()
    if (destination === undefined) {
      return undefined
    }
    const destinationJSON = this.destinationToJSON(destination)
    if (destinationJSON === undefined) {
      return undefined
    }

    const json: AccountDeleteJSON = {
      Destination: destinationJSON,
      TransactionType: 'AccountDelete',
    }

    // Process optional fields.
    const destinationTag = accountDelete.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

    return json
  },

  /**
   * Convert an OfferCancel to a JSON representation.
   *
   * @param offerCancel - The OfferCancel to convert.
   * @returns The OfferCancel as JSON.
   */
  offerCancelToJSON(offerCancel: OfferCancel): OfferCancelJSON | undefined {
    const offerSequence = offerCancel.getOfferSequence()
    if (offerSequence === undefined) {
      return undefined
    }

    return {
      OfferSequence: this.offerSequenceToJSON(offerSequence),
      TransactionType: 'OfferCancel',
    }
  },

  /**
   * Convert a Condition to a JSON representation.
   *
   * @param condition - The Condition to convert.
   * @returns The Condition as JSON.
   */
  conditionToJSON(condition: Condition): ConditionJSON {
    return Utils.toHex(condition.getValue_asU8())
  },

  /**
   * Convert a CancelAfter to a JSON representation.
   *
   * @param cancelAfter - The CancelAfter to convert.
   * @returns The CancelAfter as JSON.
   */
  cancelAfterToJSON(cancelAfter: CancelAfter): CancelAfterJSON {
    return cancelAfter.getValue()
  },

  /**
   * Convert a QualityIn to a JSON representation.
   *
   * @param qualityIn - The QualityIn to convert.
   * @returns The QualityIn as JSON.
   */
  qualityInToJSON(qualityIn: QualityIn): QualityInJSON {
    return qualityIn.getValue()
  },

  /**
   * Convert a QualityOut to a JSON representation.
   *
   * @param qualityOut - The QualityOut to convert.
   * @returns The QualityOut as JSON.
   */
  qualityOutToJSON(qualityOut: QualityOut): QualityOutJSON {
    return qualityOut.getValue()
  },

  /**
   * Convert a LimitAmount to a JSON representation.
   *
   * @param limitAmount - The LimitAmount to convert.
   * @returns The LimitAmount as JSON.
   */
  limitAmountToJSON(limitAmount: LimitAmount): LimitAmountJSON | undefined {
    const currencyAmount = limitAmount.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a FinishAfter to a JSON representation.
   *
   * @param finishAfter - The FinishAfter to convert.
   * @returns The FinishAfter as JSON.
   */
  finishAfterToJSON(finishAfter: FinishAfter): FinishAfterJSON {
    return finishAfter.getValue()
  },

  /**
   * Convert a Fulfillment to a JSON representation.
   *
   * @param fulfillment - The Fulfillment to convert.
   * @returns The Fulfillment as JSON.
   */
  fulfillmentToJSON(fulfillment: Fulfillment): FulfillmentJSON {
    return Utils.toHex(fulfillment.getValue_asU8())
  },

  /**
   * Convert a CheckCash to a JSON respresentation.
   *
   * @param checkCash - The CheckCash to convert.
   * @returns The CheckCash as JSON.
   */
  checkCashToJSON(checkCash: CheckCash): CheckCashJSON | undefined {
    // Process required fields.
    const checkId = checkCash.getCheckId()
    if (checkId === undefined) {
      return undefined
    }

    const json: CheckCashJSON = {
      CheckID: this.checkIDToJSON(checkId),
      TransactionType: 'CheckCash',
    }

    // One of the following fields must be set.
    switch (checkCash.getAmountOneofCase()) {
      case CheckCash.AmountOneofCase.AMOUNT: {
        const amount = checkCash.getAmount()
        if (amount === undefined) {
          return undefined
        }
        json.Amount = this.amountToJSON(amount)
        break
      }
      case CheckCash.AmountOneofCase.DELIVER_MIN: {
        const deliverMin = checkCash.getDeliverMin()
        if (deliverMin === undefined) {
          return undefined
        }
        json.DeliverMin = this.deliverMinToJSON(deliverMin)
        break
      }
      case CheckCash.AmountOneofCase.AMOUNT_ONEOF_NOT_SET:
      default:
        return undefined
    }
    return json
  },

  /**
   * Convert a CheckCreate to a JSON representation.
   *
   * @param checkCreate - The CheckCreate to convert.
   * @returns The CheckCreate as JSON.
   */
  checkCreateToJSON(checkCreate: CheckCreate): CheckCreateJSON | undefined {
    // Process required fields.
    const destination = checkCreate.getDestination()
    const sendMax = checkCreate.getSendMax()
    if (destination === undefined || sendMax === undefined) {
      return undefined
    }

    const destinationJSON = this.destinationToJSON(destination)
    const sendMaxJSON = this.sendMaxToJSON(sendMax)
    if (destinationJSON === undefined || sendMaxJSON === undefined) {
      return undefined
    }

    const json: CheckCreateJSON = {
      Destination: destinationJSON,
      SendMax: sendMaxJSON,
      TransactionType: 'CheckCreate',
    }

    // Process optional fields.
    const destinationTag = checkCreate.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

    const expiration = checkCreate.getExpiration()
    if (expiration !== undefined) {
      json.Expiration = this.expirationToJSON(expiration)
    }

    const invoiceId = checkCreate.getInvoiceId()
    if (invoiceId !== undefined) {
      json.InvoiceID = this.invoiceIdToJSON(invoiceId)
    }

    return json
  },

  /**
   * Convert a SignerWeight to a JSON representation.
   *
   * @param signerWeight - The SignerWeight to convert.
   * @returns The SignerWeight as JSON.
   */
  signerWeightToJSON(signerWeight: SignerWeight): SignerWeightJSON | undefined {
    return signerWeight.getValue()
  },

  /**
   * Convert a Channel to a JSON representation.
   *
   * @param channel - The Channel to convert.
   * @returns The Channel as JSON.
   */
  channelToJSON(channel: Channel): ChannelJSON {
    return Utils.toHex(channel.getValue_asU8())
  },

  /**
   * Convert a PaymentChannelClaim to a JSON representation.
   *
   * @param paymentChannelClaim - The PaymentChannelClaim to convert.
   * @returns The PaymentChannelClaim as JSON.
   */
  paymentChannelClaimToJSON(
    paymentChannelClaim: PaymentChannelClaim,
  ): PaymentChannelClaimJSON | undefined {
    // Process mandatory fields.
    const channel = paymentChannelClaim.getChannel()
    if (channel === undefined) {
      return undefined
    }

    const json: PaymentChannelClaimJSON = {
      Channel: this.channelToJSON(channel),
      TransactionType: 'PaymentChannelClaim',
    }

    // Process optional fields.
    const balance = paymentChannelClaim.getBalance()
    if (balance !== undefined) {
      json.Balance = this.balanceToJSON(balance)
    }

    const amount = paymentChannelClaim.getAmount()
    if (amount !== undefined) {
      json.Amount = this.amountToJSON(amount)
    }

    const signature = paymentChannelClaim.getPaymentChannelSignature()
    if (signature !== undefined) {
      json.Signature = this.paymentChannelSignatureToJSON(signature)
    }

    const publicKey = paymentChannelClaim.getPublicKey()
    if (publicKey !== undefined) {
      json.PublicKey = this.publicKeyToJSON(publicKey)
    }

    return json
  },

  /**
   * Convert a SignerQuorum to a JSON representation.
   *
   * @param signerQuorum - The SignerQuorum to convert.
   * @returns The SignerQuorum as JSON.
   */
  signerQuorumToJSON(signerQuorum: SignerQuorum): SignerQuorumJSON {
    return signerQuorum.getValue()
  },

  /**
   * Convert an OfferCreate to a JSON representation.
   *
   * @param offerCreate - The OfferCreate to convert.
   * @returns The OfferCreate as JSON.
   */
  offerCreateToJSON(offerCreate: OfferCreate): OfferCreateJSON | undefined {
    // Process mandatory fields.
    const takerGets = offerCreate.getTakerGets()
    const takerPays = offerCreate.getTakerPays()
    if (takerGets === undefined || takerPays === undefined) {
      return undefined
    }

    const takerGetsJSON = this.takerGetsToJSON(takerGets)
    const takerPaysJSON = this.takerPaysToJSON(takerPays)
    if (takerGetsJSON === undefined || takerPaysJSON === undefined) {
      return undefined
    }

    const json: OfferCreateJSON = {
      TakerGets: takerGetsJSON,
      TakerPays: takerPaysJSON,
      TransactionType: 'OfferCreate',
    }

    // Process optional fields.
    const offerSequence = offerCreate.getOfferSequence()
    if (offerSequence !== undefined) {
      json.OfferSequence = this.offerSequenceToJSON(offerSequence)
    }

    const expiration = offerCreate.getExpiration()
    if (expiration !== undefined) {
      json.Expiration = this.expirationToJSON(expiration)
    }

    return json
  },

  /**
   * Convert a RegularKey to a JSON representation.
   *
   * @param regularKey - The RegularKey to convert.
   * @returns The RegularKey as JSON.
   */
  regularKeyToJSON(regularKey: RegularKey): RegularKeyJSON | undefined {
    const accountAddress = regularKey.getValue()
    if (accountAddress === undefined) {
      return undefined
    }

    return this.accountAddressToJSON(accountAddress)
  },

  /**
   * Convert a SetRegularKey to a JSON representation.
   *
   * @param setRegularKey - The SetRegularKey to convert.
   * @returns The SetRegularKey as JSON.
   */
  setRegularKeyToJSON(
    setRegularKey: SetRegularKey,
  ): SetRegularKeyJSON | undefined {
    const json: SetRegularKeyJSON = {
      TransactionType: 'SetRegularKey',
    }

    const regularKey = setRegularKey.getRegularKey()
    if (regularKey) {
      const regularKeyJson = this.regularKeyToJSON(regularKey)
      if (regularKeyJson) {
        json.RegularKey = regularKeyJson
      }
    }

    return json
  },

  /**
   * Convert a SettleDelay to a JSON representation.
   *
   * @param settleDelay - The SettleDelay to convert.
   * @returns The SettleDelay as JSON.
   */
  settleDelayToJSON(settleDelay: SettleDelay): SettleDelayJSON {
    return settleDelay.getValue()
  },

  /**
   * Convert a PaymentChannelSignature to a JSON representation.
   *
   * @param paymentChannelSignature - The PaymentChannelSignature to convert.
   * @returns The PaymentChannelSignature as JSON.
   */
  paymentChannelSignatureToJSON(
    paymentChannelSignature: PaymentChannelSignature,
  ): PaymentChannelSignatureJSON {
    return Utils.toHex(paymentChannelSignature.getValue_asU8())
  },

  /**
   * Convert a PublicKey to a JSON representation.
   *
   * @param publicKey - The PublicKey to convert.
   * @returns The PublicKey as JSON.
   */
  publicKeyToJSON(publicKey: PublicKey): PublicKeyJSON {
    return Utils.toHex(publicKey.getValue_asU8())
  },

  /**
   * Convert a Balance to a JSON representation.
   *
   * @param balance - The Balance to convert.
   * @returns The Balance as JSON.
   */
  balanceToJSON(balance: Balance): BalanceJSON | undefined {
    const currencyAmount = balance.getValue()
    if (currencyAmount === undefined) {
      return undefined
    }

    return this.currencyAmountToJSON(currencyAmount)
  },

  /**
   * Convert a TrustSet to a JSON representation.
   *
   * @param trustSet - The TrustSet to convert.
   * @returns The TrustSet as JSON.
   */
  trustSetToJSON(trustSet: TrustSet): TrustSetJSON | undefined {
    const limitAmount = trustSet.getLimitAmount()
    if (limitAmount === undefined) {
      return undefined
    }

    const limitAmountJson = this.limitAmountToJSON(limitAmount)
    if (limitAmountJson === undefined) {
      return undefined
    }

    const json: TrustSetJSON = {
      LimitAmount: limitAmountJson,
      TransactionType: 'TrustSet',
    }

    const qualityIn = trustSet.getQualityIn()
    if (qualityIn !== undefined) {
      json.QualityIn = this.qualityInToJSON(qualityIn)
    }

    const qualityOut = trustSet.getQualityOut()
    if (qualityOut !== undefined) {
      json.QualityOut = this.qualityOutToJSON(qualityOut)
    }

    return json
  },

  /**
   * Convert a SignerEntry to a JSON representation.
   *
   * @param signerEntry - The SignerEntry to convert.
   * @returns The SignerEntry as JSON.
   */
  signerEntryToJSON(signerEntry: SignerEntry): SignerEntryJSON | undefined {
    const account = signerEntry.getAccount()
    const signerWeight = signerEntry.getSignerWeight()
    if (account === undefined || signerWeight === undefined) {
      return undefined
    }

    const accountJSON = this.accountToJSON(account)
    const signerWeightJSON = this.signerWeightToJSON(signerWeight)
    if (accountJSON === undefined || signerWeightJSON === undefined) {
      return undefined
    }

    return {
      Account: accountJSON,
      SignerWeight: signerWeightJSON,
    }
  },

  /**
   * Convert a list of SignerEntry to a JSON representation.
   *
   * If any entry in the list fails conversion, this method will return undefined.
   *
   * @param signerEntryList - The list of `SignerEntry`s to convert.
   * @returns A list of the same `SignerEntry`s as JSON objects.
   */
  signerEntryListToJSON(
    signerEntryList: SignerEntry[],
  ): SignerEntryJSON[] | undefined {
    const signerEntryListJSON: SignerEntryJSON[] = []
    for (const signerEntry of signerEntryList) {
      const signerEntryJSON = this.signerEntryToJSON(signerEntry)
      if (signerEntryJSON === undefined) {
        return undefined
      }

      signerEntryListJSON.push(signerEntryJSON)
    }

    return signerEntryListJSON
  },

  /**
   * Convert a SignerListSet to a JSON representation.
   *
   * @param signerListSet - The SignerListSet to convert.
   * @returns The SignerListSet as JSON.
   */
  signerListSetToJSON(
    signerListSet: SignerListSet,
  ): SignerListSetJSON | undefined {
    const signerQuorum = signerListSet.getSignerQuorum()
    const signerEntryList = signerListSet.getSignerEntriesList()
    if (signerQuorum === undefined) {
      return undefined
    }

    const signerQuorumJSON = this.signerQuorumToJSON(signerQuorum)
    const signerEntriesJSON = this.signerEntryListToJSON(signerEntryList)
    if (signerEntriesJSON === undefined) {
      return undefined
    }

    return {
      SignerQuorum: signerQuorumJSON,
      SignerEntries: signerEntriesJSON,
      TransactionType: 'SignerListSet',
    }
  },

  /**
   * Convert a PaymentChannelCreate to a JSON representation.
   *
   * @param paymentChannelCreate - The PaymentChannelCreate to convert.
   * @returns The PaymentChannelCreate as JSON.
   */
  paymentChannelCreateToJSON(
    paymentChannelCreate: PaymentChannelCreate,
  ): PaymentChannelCreateJSON | undefined {
    // Process mandatory fields.
    const amount = paymentChannelCreate.getAmount()
    const destination = paymentChannelCreate.getDestination()
    const settleDelay = paymentChannelCreate.getSettleDelay()
    const publicKey = paymentChannelCreate.getPublicKey()
    if (
      amount === undefined ||
      destination === undefined ||
      settleDelay === undefined ||
      publicKey === undefined
    ) {
      return undefined
    }

    const amountJSON = this.amountToJSON(amount)

    const destinationJSON = this.destinationToJSON(destination)
    if (amountJSON === undefined || destinationJSON === undefined) {
      return undefined
    }

    const json: PaymentChannelCreateJSON = {
      Amount: amountJSON,
      Destination: destinationJSON,
      SettleDelay: this.settleDelayToJSON(settleDelay),
      PublicKey: this.publicKeyToJSON(publicKey),
      TransactionType: 'PaymentChannelCreate',
    }

    // Process optional fields.
    const destinationTag = paymentChannelCreate.getDestinationTag()
    if (destinationTag !== undefined) {
      json.DestinationTag = this.destinationTagToJSON(destinationTag)
    }

    const cancelAfter = paymentChannelCreate.getCancelAfter()
    if (cancelAfter !== undefined) {
      json.CancelAfter = this.cancelAfterToJSON(cancelAfter)
    }

    return json
  },

  /**
   * Convert a PaymentChannelFund to a JSON representation.
   *
   * @param paymentChannelFund - The PaymentChannelFund to convert.
   * @returns The PaymentChannelFund as JSON.
   */
  paymentChannelFundToJSON(
    paymentChannelFund: PaymentChannelFund,
  ): PaymentChannelFundJSON | undefined {
    // Process mandatory fields.
    const channel = paymentChannelFund.getChannel()
    const amount = paymentChannelFund.getAmount()
    if (channel === undefined || amount === undefined) {
      return undefined
    }

    const amountJSON = this.amountToJSON(amount)
    if (amountJSON === undefined) {
      return undefined
    }

    const json: PaymentChannelFundJSON = {
      Channel: this.channelToJSON(channel),
      Amount: amountJSON,
      TransactionType: 'PaymentChannelFund',
    }

    // Process optional fields.
    const expiration = paymentChannelFund.getExpiration()
    if (expiration !== undefined) {
      json.Expiration = this.expirationToJSON(expiration)
    }

    return json
  },
}

export default serializer

/**
 * Converts the transaction's account field, handling X-Addresses if needed.
 *
 * @param transaction - The transaction to scrape the account from.
 *
 * @returns A XRP address or undefined.
 */
function getNormalizedAccount(transaction: Transaction): string | undefined {
  const account = transaction.getAccount()?.getValue()?.getAddress()
  if (!account || !XrpUtils.isValidAddress(account)) {
    return undefined
  }

  if (XrpUtils.isValidClassicAddress(account)) {
    return account
  }

  // We already checked that we're a valid address, and if we were a classic address,
  // so we are definitely an X-Address here.
  const decodedClassicAddress = XrpUtils.decodeXAddress(account)
  if (!decodedClassicAddress || decodedClassicAddress.tag !== undefined) {
    // Accounts cannot have a tag.
    return undefined
  }

  return decodedClassicAddress.address
}

/**
 * Given a Transaction, get the JSON representation of data specific to that transaction type.
 *
 * @param transaction - A transaction to check for additional transaction-type specific data.
 *
 * @returns A JSON representation of the transaction-type specific data, or undefined.
 *
 * @throws An error if given a transaction that we do not know how to handle.
 */
// TODO(keefertaylor): There is no reason this should be separate from the serializer functionality. Move into `serializer` object.
// eslint-disable-next-line max-statements -- No clear way to make this more succinct because gRPC is verbose
function getAdditionalTransactionData(
  transaction: Transaction,
): TransactionDataJSON | undefined {
  const transactionDataCase = transaction.getTransactionDataCase()

  switch (transactionDataCase) {
    case Transaction.TransactionDataCase.ACCOUNT_DELETE: {
      const accountDelete = transaction.getAccountDelete()
      if (accountDelete === undefined) {
        return undefined
      }
      return serializer.accountDeleteToJSON(accountDelete)
    }
    case Transaction.TransactionDataCase.ACCOUNT_SET: {
      const accountSet = transaction.getAccountSet()
      if (accountSet === undefined) {
        return undefined
      }
      return serializer.accountSetToJSON(accountSet)
    }
    case Transaction.TransactionDataCase.CHECK_CANCEL: {
      const checkCancel = transaction.getCheckCancel()
      if (checkCancel === undefined) {
        return undefined
      }
      return serializer.checkCancelToJSON(checkCancel)
    }
    case Transaction.TransactionDataCase.CHECK_CASH: {
      const checkCash = transaction.getCheckCash()
      if (checkCash === undefined) {
        return undefined
      }
      return serializer.checkCashToJSON(checkCash)
    }
    case Transaction.TransactionDataCase.CHECK_CREATE: {
      const checkCreate = transaction.getCheckCreate()
      if (checkCreate === undefined) {
        return undefined
      }
      return serializer.checkCreateToJSON(checkCreate)
    }
    case Transaction.TransactionDataCase.DEPOSIT_PREAUTH: {
      const depositPreauth = transaction.getDepositPreauth()
      if (depositPreauth === undefined) {
        return undefined
      }
      return serializer.depositPreauthToJSON(depositPreauth)
    }
    case Transaction.TransactionDataCase.ESCROW_CANCEL: {
      const escrowCancel = transaction.getEscrowCancel()
      if (escrowCancel === undefined) {
        return undefined
      }
      return serializer.escrowCancelToJSON(escrowCancel)
    }
    case Transaction.TransactionDataCase.ESCROW_CREATE: {
      const escrowCreate = transaction.getEscrowCreate()
      if (escrowCreate === undefined) {
        return undefined
      }
      return serializer.escrowCreateToJSON(escrowCreate)
    }
    case Transaction.TransactionDataCase.ESCROW_FINISH: {
      const escrowFinish = transaction.getEscrowFinish()
      if (escrowFinish === undefined) {
        return undefined
      }
      return serializer.escrowFinishToJSON(escrowFinish)
    }
    case Transaction.TransactionDataCase.OFFER_CANCEL: {
      const offerCancel = transaction.getOfferCancel()
      if (offerCancel === undefined) {
        return undefined
      }
      return serializer.offerCancelToJSON(offerCancel)
    }
    case Transaction.TransactionDataCase.OFFER_CREATE: {
      const offerCreate = transaction.getOfferCreate()
      if (offerCreate === undefined) {
        return undefined
      }
      return serializer.offerCreateToJSON(offerCreate)
    }
    case Transaction.TransactionDataCase.PAYMENT: {
      const payment = transaction.getPayment()
      if (payment === undefined) {
        return undefined
      }
      return serializer.paymentToJSON(payment)
    }
    case Transaction.TransactionDataCase.PAYMENT_CHANNEL_CLAIM: {
      const paymentChannelClaim = transaction.getPaymentChannelClaim()
      if (paymentChannelClaim === undefined) {
        return undefined
      }
      return serializer.paymentChannelClaimToJSON(paymentChannelClaim)
    }
    case Transaction.TransactionDataCase.PAYMENT_CHANNEL_CREATE: {
      const paymentChannelCreate = transaction.getPaymentChannelCreate()
      if (paymentChannelCreate === undefined) {
        return undefined
      }
      return serializer.paymentChannelCreateToJSON(paymentChannelCreate)
    }
    case Transaction.TransactionDataCase.PAYMENT_CHANNEL_FUND: {
      const paymentChannelFund = transaction.getPaymentChannelFund()
      if (paymentChannelFund === undefined) {
        return undefined
      }
      return serializer.paymentChannelFundToJSON(paymentChannelFund)
    }
    case Transaction.TransactionDataCase.SET_REGULAR_KEY: {
      const setRegularKey = transaction.getSetRegularKey()
      if (setRegularKey === undefined) {
        return undefined
      }
      return serializer.setRegularKeyToJSON(setRegularKey)
    }
    case Transaction.TransactionDataCase.SIGNER_LIST_SET: {
      const signerListSet = transaction.getSignerListSet()
      if (signerListSet === undefined) {
        return undefined
      }
      return serializer.signerListSetToJSON(signerListSet)
    }

    case Transaction.TransactionDataCase.TRUST_SET: {
      const trustSet = transaction.getTrustSet()
      if (trustSet === undefined) {
        return undefined
      }
      return serializer.trustSetToJSON(trustSet)
    }
    default:
      throw new Error('Unexpected TransactionDataCase')
  }
}
