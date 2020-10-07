/* eslint-disable max-params -- Allow lots of sample data to be used. */
/* eslint-disable max-statements -- Allow many lines per function. */
/* eslint-disable max-lines -- Allow many lines of test util functions. */
import Utils from '../../../src/Common/utils'
import { AccountAddress } from '../../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
  Currency,
  IssuedCurrencyAmount,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Account,
  Amount,
  Destination,
  Domain,
  Sequence,
  SigningPublicKey,
  Authorize,
  Unauthorize,
  ClearFlag,
  EmailHash,
  MessageKey,
  SetFlag,
  TransferRate,
  TickSize,
  LimitAmount,
  QualityIn,
  QualityOut,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  Payment,
  Transaction,
  DepositPreauth,
  AccountSet,
  TrustSet,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'

const xrpTestUtils = {
  /**
   * Create a new `Transaction` object with the given inputs.
   *
   * @param value - The amount of XRP to send, in drops.
   * @param destinationAddress - The destination address.
   * @param fee - The amount of XRP to use as a fee, in drops.
   * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
   * @param sequenceNumber - The sequence number for the sending account.
   * @param senderAddress - The address of the sending account.
   * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
   *
   * @returns A new `Transaction` object comprised of the provided Transaction properties.
   */
  makePaymentTransaction(
    value: string,
    destinationAddress: string,
    fee: string,
    lastLedgerSequenceNumber: number,
    sequenceNumber: number,
    senderAddress: string | undefined,
    publicKey: string,
  ): Transaction {
    const paymentAmount = new XRPDropsAmount()
    paymentAmount.setDrops(value)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(paymentAmount)

    const amount = new Amount()
    amount.setValue(currencyAmount)

    const destinationAccountAddress = new AccountAddress()
    destinationAccountAddress.setAddress(destinationAddress)

    const destination = new Destination()
    destination.setValue(destinationAccountAddress)

    const payment = new Payment()
    payment.setDestination(destination)
    payment.setAmount(amount)

    const transaction = this.makeBaseTransaction(
      fee,
      lastLedgerSequenceNumber,
      sequenceNumber,
      senderAddress,
      publicKey,
    )
    transaction.setPayment(payment)

    return transaction
  },

  /**
   * Create a new `DepositPreauth` object with the given inputs.
   *
   * Note: Either the `authorizeAddress` or `unauthorizeAddress`, but not both, must be set to get a
   * valid output. This precondition is not enforced by the function.
   *
   * @param authorizeAddress - The address to authorize.
   * @param unauthorizeAddress - The address to unauthorize.
   * @param fee - The amount of XRP to use as a fee, in drops.
   * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
   * @param sequenceNumber - The sequence number for the sending account.
   * @param senderAddress - The address of the sending account.
   * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
   *
   * @returns A new `Transaction` object comprised of the provided properties.
   */
  makeDepositPreauth(
    authorizeAddress: string | undefined,
    unauthorizeAddress: string | undefined,
    fee: string,
    lastLedgerSequenceNumber: number,
    sequenceNumber: number,
    senderAddress: string | undefined,
    publicKey: string,
  ): Transaction {
    const depositPreauth = new DepositPreauth()
    if (authorizeAddress) {
      const accountAddress = new AccountAddress()
      accountAddress.setAddress(authorizeAddress)

      const authorize = new Authorize()
      authorize.setValue(accountAddress)

      depositPreauth.setAuthorize(authorize)
    } else if (unauthorizeAddress) {
      const accountAddress = new AccountAddress()
      accountAddress.setAddress(unauthorizeAddress)

      const unauthorize = new Unauthorize()
      unauthorize.setValue(accountAddress)

      depositPreauth.setUnauthorize(unauthorize)
    }

    const transaction = this.makeBaseTransaction(
      fee,
      lastLedgerSequenceNumber,
      sequenceNumber,
      senderAddress,
      publicKey,
    )
    transaction.setDepositPreauth(depositPreauth)

    return transaction
  },

  /**
   * Make a Transaction representing an AccountSet operation.
   *
   * @param clearFlagValue - The ClearFlag value to use for the AccountSet.
   * @param domainValue - The Domain value to use for the AccountSet.
   * @param emailHashValue - The EmailHash value to use for the AccountSet.
   * @param messageKeyValue - The MesssageKey value to use for AccountSet.
   * @param setFlagValue - The SetFlag value to use for the AccountSet.
   * @param transferRateValue - The TransferRate value to use for the Accountset.
   * @param tickSizeValue - The TickSize value to use for the AccountSet.
   * @param fee - The amount of XRP to use as a fee, in drops.
   * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
   * @param sequenceNumber - The sequence number for the sending account.
   * @param senderAddress - The address of the sending account.
   * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
   * @returns A new `Transaction` object comprised of the provided properties.
   */
  makeAccountSetTransaction(
    clearFlagValue: number | undefined,
    domainValue: string | undefined,
    emailHashValue: Uint8Array | undefined,
    messageKeyValue: Uint8Array | undefined,
    setFlagValue: number | undefined,
    transferRateValue: number | undefined,
    tickSizeValue: number | undefined,
    fee: string,
    lastLedgerSequenceNumber: number,
    sequenceNumber: number,
    senderAddress: string | undefined,
    publicKey: string,
  ): Transaction {
    const accountSet = this.makeAccountSet(
      clearFlagValue,
      domainValue,
      emailHashValue,
      messageKeyValue,
      setFlagValue,
      transferRateValue,
      tickSizeValue,
    )
    const transaction = this.makeBaseTransaction(
      fee,
      lastLedgerSequenceNumber,
      sequenceNumber,
      senderAddress,
      publicKey,
    )
    transaction.setAccountSet(accountSet)

    return transaction
  },

  /**
   * Make an AccountSet protocol buffer from the given inputs.
   *
   * @param clearFlagValue - The ClearFlag value to use for the AccountSet.
   * @param domainValue - The Domain value to use for the AccountSet.
   * @param emailHashValue - The EmailHash value to use for the AccountSet.
   * @param messageKeyValue - The MesssageKey value to use for AccountSet.
   * @param setFlagValue - The SetFlag value to use for the AccountSet.
   * @param transferRateValue - The TransferRate value to use for the Accountset.
   * @param tickSizeValue - The TickSize value to use for the AccountSet.
   * @returns An AccountSet protocol buffer from the given inputs.
   */
  makeAccountSet(
    clearFlagValue: number | undefined,
    domainValue: string | undefined,
    emailHashValue: Uint8Array | undefined,
    messageKeyValue: Uint8Array | undefined,
    setFlagValue: number | undefined,
    transferRateValue: number | undefined,
    tickSizeValue: number | undefined,
  ): AccountSet {
    const accountSet = new AccountSet()
    accountSet.setClearFlag()

    if (clearFlagValue !== undefined) {
      const clearFlag = new ClearFlag()
      clearFlag.setValue(clearFlagValue)
      accountSet.setClearFlag(clearFlag)
    }

    if (domainValue !== undefined) {
      const domain = new Domain()
      domain.setValue(domainValue)
      accountSet.setDomain(domain)
    }

    if (emailHashValue !== undefined) {
      const emailHash = new EmailHash()
      emailHash.setValue(emailHashValue)
      accountSet.setEmailHash(emailHash)
    }

    if (messageKeyValue !== undefined) {
      const messageKey = new MessageKey()
      messageKey.setValue(messageKeyValue)
      accountSet.setMessageKey(messageKey)
    }

    if (setFlagValue !== undefined) {
      const setFlag = new SetFlag()
      setFlag.setValue(setFlagValue)
      accountSet.setSetFlag(setFlag)
    }

    if (transferRateValue !== undefined) {
      const transferRate = new TransferRate()
      transferRate.setValue(transferRateValue)
      accountSet.setTransferRate(transferRate)
    }

    if (tickSizeValue !== undefined) {
      const tickSize = new TickSize()
      tickSize.setValue(tickSizeValue)
      accountSet.setTickSize(tickSize)
    }

    return accountSet
  },

  /**
   * Make a Transaction representing a TrustSet operation.
   *
   * @param limitAmountCurrency - The currency name to use for the LimitAmount for the TrustSet.
   * @param limitAmountIssuer - The issuer address to use for the LimitAmount for the TrustSet.
   * @param limitAmountValue - The value to use for the LimitAmount for the TrustSet.
   * @param qualityInValue - The QualityIn value to use for the LimitAmount for the TrustSet.
   * @param qualityOutValue - The QualityOut value to use for the LimitAmount for the TrustSet.
   * @param fee - The amount of XRP to use as a fee, in drops.
   * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
   * @param sequenceNumber - The sequence number for the sending account.
   * @param senderAddress - The address of the sending account.
   * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
   * @returns A new `Transaction` object comprised of the provided properties.
   */
  makeTrustSetTransaction(
    limitAmountCurrency: string,
    limitAmountIssuer: string,
    limitAmountValue: string,
    qualityInValue: number | undefined,
    qualityOutValue: number | undefined,
    fee: string,
    lastLedgerSequenceNumber: number,
    sequenceNumber: number,
    senderAddress: string | undefined,
    publicKey: string,
  ): Transaction {
    const trustSet = this.makeTrustSet(
      limitAmountCurrency,
      limitAmountIssuer,
      limitAmountValue,
      qualityInValue,
      qualityOutValue,
    )
    const transaction = this.makeBaseTransaction(
      fee,
      lastLedgerSequenceNumber,
      sequenceNumber,
      senderAddress,
      publicKey,
    )
    transaction.setTrustSet(trustSet)

    return transaction
  },

  /**
   * Make a TrustSet protocol buffer from the given inputs.
   *
   * @param limitAmountCurrency - The currency name to use for the LimitAmount for the TrustSet.
   * @param limitAmountIssuer - The issuer address to use for the LimitAmount for the TrustSet.
   * @param limitAmountValue - The value to use for the LimitAmount for the TrustSet.
   * @param qualityInValue - The QualityIn value to use for the LimitAmount for the TrustSet.
   * @param qualityOutValue - The QualityOut value to use for the LimitAmount for the TrustSet.
   * @returns A TrustSet protocol buffer from the given inputs.
   */
  makeTrustSet(
    limitAmountCurrency: string,
    limitAmountIssuer: string,
    limitAmountValue: string,
    qualityInValue: number | undefined,
    qualityOutValue: number | undefined,
  ): TrustSet {
    const trustSet = new TrustSet()

    const currency = new Currency()
    currency.setName(limitAmountCurrency)

    const issuerAccountAddress = new AccountAddress()
    issuerAccountAddress.setAddress(limitAmountIssuer)

    const issuedCurrencyAmount = new IssuedCurrencyAmount()
    issuedCurrencyAmount.setCurrency(currency)
    issuedCurrencyAmount.setIssuer(issuerAccountAddress)
    issuedCurrencyAmount.setValue(limitAmountValue)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setIssuedCurrencyAmount(issuedCurrencyAmount)

    const limitAmount = new LimitAmount()
    limitAmount.setValue(currencyAmount)

    trustSet.setLimitAmount(limitAmount)

    if (qualityInValue !== undefined) {
      const qualityIn = new QualityIn()
      qualityIn.setValue(qualityInValue)
      trustSet.setQualityIn(qualityIn)
    }

    if (qualityOutValue !== undefined) {
      const qualityOut = new QualityOut()
      qualityOut.setValue(qualityOutValue)
      trustSet.setQualityOut(qualityOut)
    }

    return trustSet
  },

  /**
   * Make a transaction protocol buffer containing all the common fields.
   *
   * @param fee - The amount of XRP to use as a fee, in drops.
   * @param lastLedgerSequenceNumber - The last ledger sequence the transaction will be valid in.
   * @param sequenceNumber - The sequence number for the sending account.
   * @param senderAddress - The address of the sending account.
   * @param publicKey - The public key of the sending account, encoded as a hexadecimal string.
   *
   * @returns A transaction with common fields set.
   */
  makeBaseTransaction(
    fee: string,
    lastLedgerSequenceNumber: number,
    sequenceNumber: number,
    senderAddress: string | undefined,
    publicKey: string,
  ): Transaction {
    const transactionFee = new XRPDropsAmount()
    transactionFee.setDrops(fee)

    const sequence = new Sequence()
    sequence.setValue(sequenceNumber)

    const lastLedgerSequence = new Sequence()
    lastLedgerSequence.setValue(lastLedgerSequenceNumber)

    const signingPublicKey = new SigningPublicKey()
    signingPublicKey.setValue(Utils.toBytes(publicKey))

    const transaction = new Transaction()
    transaction.setFee(transactionFee)
    transaction.setSequence(sequence)
    transaction.setSigningPublicKey(signingPublicKey)
    transaction.setLastLedgerSequence(lastLedgerSequence)

    // Account is an optional input so that malformed transaction serialization can be tested.
    if (senderAddress) {
      const senderAccountAddress = new AccountAddress()
      senderAccountAddress.setAddress(senderAddress)

      const senderAccount = new Account()
      senderAccount.setValue(senderAccountAddress)

      transaction.setAccount(senderAccount)
    }

    return transaction
  },

  /**
   * Make a PathElement.
   *
   * Note: A valid path element should have either an account OR a currency and issuer but never both.
   *
   * @param account - The account to ripple through. Must not be provided if currency and issuer are provided.
   * @param currencyCode - The currency code of the new currency on the path. Must not be provided if account is provided.
   * @param issuer - The issuer of the new currency. Must not be provided if account is provided.
   * @returns A PathElement with the given properties.
   */
  makePathElement(
    account: AccountAddress | undefined,
    currencyCode: Uint8Array | undefined,
    issuer: AccountAddress | undefined,
  ): Payment.PathElement {
    const pathElement = new Payment.PathElement()

    if (account !== undefined) {
      pathElement.setAccount(account)
    }

    if (currencyCode !== undefined) {
      const currency = new Currency()
      currency.setCode(currencyCode)
      pathElement.setCurrency(currency)
    }

    if (issuer !== undefined) {
      pathElement.setIssuer(issuer)
    }

    return pathElement
  },

  /**
   * Make an XRPDropsAmount.
   *
   * @param drops - A numeric string representing the number of drops.
   * @returns A new XRPDropsAmount.
   */
  makeXrpDropsAmount(drops: string): XRPDropsAmount {
    const xrpDropsAmount = new XRPDropsAmount()
    xrpDropsAmount.setDrops(drops)

    return xrpDropsAmount
  },

  /**
   * Make an IssuedCurrencyAmount.
   *
   * @param accountAddress - The account address.
   * @param issuedCurrencyValue - The value.
   * @param currency - The currency.
   * @returns A new IssuedCurrencyAmount.
   */
  makeIssuedCurrencyAmount(
    accountAddress: AccountAddress,
    issuedCurrencyValue: string,
    currency: Currency,
  ): IssuedCurrencyAmount {
    const issuedCurrency = new IssuedCurrencyAmount()
    issuedCurrency.setIssuer(accountAddress)
    issuedCurrency.setValue(issuedCurrencyValue)
    issuedCurrency.setCurrency(currency)

    return issuedCurrency
  },

  /**
   * Returns a CurrencyAmount representing drops of XRP.
   *
   * @param drops - The number of drops to represent.
   * @returns A CurrencyAmount representing the input.
   */
  makeXrpCurrencyAmount(drops: string): CurrencyAmount {
    const xrpDropsAmount = this.makeXrpDropsAmount(drops)

    const currencyAmount = new CurrencyAmount()
    currencyAmount.setXrpAmount(xrpDropsAmount)

    return currencyAmount
  },

  /**
   * Returns a new account address.
   *
   * @param address - The address to wrap.
   * @returns The requested object.
   */
  makeAccountAddress(address: string): AccountAddress {
    const accountAddress = new AccountAddress()
    accountAddress.setAddress(address)

    return accountAddress
  },
}

export default xrpTestUtils
