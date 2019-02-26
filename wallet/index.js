const Transition = require('./transaction');
const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
            publicKey : ${this.publicKey.toString()}
            balance   : ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool){
        this.balance = this.calculateBalance(blockchain);
        if (amount > this.balance) {
            console.log(`金額: ${amount}が残高超過しています。`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transition.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(
            t => {
                transactions.push(t);
            }
        );

        const walletInputTs = transactions.filter(
            t => t.address === this.publicKey
        );

        let startTime = 0;

        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce(
                (prev, current) =>
                    prev.input.timestamp > current.input.timestamp ?
                        prev : current
            );

            balance = recentInputT.outputs.find(
                output =>
                    output.address === this.publicKey
            ).amount;

            startTime = recentInputT.input.timestamp;

            transactions.forEach(
                t => {
                    if (t.input.timestamp > startTime) {
                        t.outputs.find(
                            output => {
                                if (output.address === this.publicKey) {
                                    balance += output.amount;
                                }
                            }
                        )
                    }
                }
            );
        }
        return balance;
    }
    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-address';
        return blockchainWallet;
    }
}

module.exports = Wallet;

