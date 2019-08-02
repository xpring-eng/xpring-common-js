

/**
 * Abstract super class for all transaction operations.
 * 
 * TODO: We should really represent these objects with a protocol buffer or other similar object.
 */
class Transaction {
    constructor(
        account, 
        transactionType, 
        fee, 
        sequence, 
    ) {
        this.Account = account;
        this.TransactionType = transactionType;
        this.Fee = fee;
        this.Sequence = sequence;
        this.SigningPubKey = "";
        this.TxnSignature = "";
    }
}