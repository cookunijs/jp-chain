const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWAD } = require('../config');

describe('Transaction', () => {
    let transaction ,wallet, receipient, amount;
    beforeEach( () => {
        wallet = new Wallet();
        amount = 50;
        receipient = 'r2c1e0p24nt';
        transaction = Transaction.newTransaction(wallet, receipient, amount);
    });

    it('残高差し引きテスト', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - amount);
    });

    it('送金テスト', () => {
        expect(transaction.outputs.find(output => output.address === receipient).amount)
          .toEqual(amount);
    });

    it('取引署名テスト', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('正常な取引の検証テスト', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('不正な取引の検証テスト', () => {
        transaction.outputs[0].amount = 5555;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });
    describe('残高超過テスト', () => {
        beforeEach( () => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, receipient, amount);
        });

        it('取引省略テスト', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('取引更新テスト', () => {
        let nextAmount, nextReceipient;

        beforeEach( () => {
            nextAmount = 20;
            nextReceipient = 'n32st-13rpi4nt';
            transaction = transaction.update(wallet, nextReceipient, nextAmount);
        });

        it('取引金額差引テスト', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });

        it('送信先取引金額テスト', () => {
            expect(transaction.outputs.find(output => output.address === nextReceipient).amount)
            .toEqual(nextAmount);
        });
    });

    describe('報酬取引作成', () => {
        beforeEach( () => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());

        });

        it('口座採掘報酬テスト', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(MINING_REWAD);
        });
    });

});
