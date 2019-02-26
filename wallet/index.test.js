const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach( () => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('取引作成テスト', () => {
        let transaction, sendAmount, recipient;
        beforeEach( () => {
            sendAmount = 50;
            recipient = 'r39310-3ndrs';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });
        describe('同一取引生成テスト', () => {
            beforeEach( () => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it('残高から倍額差し引かれる', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                  .toEqual(wallet.balance - sendAmount*2);
            });

            it('送り先への取引金額記載テスト', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});