const { FiatAmount } = require('../generated/FiatAmount_pb.js');
const Serializer = require('../serializer.js')
const { Transaction } = require('../generated/Transaction_pb.js');
const { Payment } = require('../generated/Payment_pb.js');
const { XRPAmount } = require('../generated/XRPAmount_pb.js');
const { assert } = require('chai')


const tx_json = {
    Account: 'r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ',
    Amount: '1000',
    Destination: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    Fee: '10',
    Sequence: 1,
    TransactionType: 'Payment',
};


<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
describe('serializer', () => {
    it('serializes', () => {
        const paymentAmount = new XRPAmount();
        paymentAmount.setDrops(1000);

        const payment = new Payment();
        payment.setDestination("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");
        payment.setXrpAmount(paymentAmount);

        const fee = new XRPAmount();
        fee.setDrops(10);

        const transaction = new Transaction();
        transaction.setAccount("r9LqNeG6qHxjeUocjvVki2XR35weJ9mZgQ");
        transaction.setFee(fee);
        transaction.setSequence(1);
        transaction.setPayment(payment);
        
        const serialized = Serializer.serializeTransaction(transaction);


        console.log(JSON.stringify(serialized));

        assert.deepEqual(serialized, tx_json);


    });

    // it('serializes XRP Amount', () => {
    //     const drops = "100"; 
    //     const amount = new XRPAmount();
    //     amount.setDrops(drops);
    //     const serialized = Serializer.serializeXRPAmount(amount);
    //     assert.equal(serialized, drops);
    // });

});
