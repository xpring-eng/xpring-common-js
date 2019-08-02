class Payment extends Transaction {
    constructor(
        amount, 

        destination, 
        destinationTag, 
        invoiceID, 
        paths, 
        sendMax, 
        deliverMin,
        account,
        fee,
        sequence,
    ) {
        this.amount = amount;
        this.destination = destination;
        this.destinationTag = destinationTag;
        this.invoiceID = invoiceID;
        this.paths = paths;
        this.sendMax = sendMax;
        this.deliverMin = deliverMin;

        super(
            account,
            "Payment",
            fee,
            sequence,
            
        ) 
    }
}