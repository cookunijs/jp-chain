const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE} = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp =  timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }
    toString() {
        return `Block
            Timestamp : ${this.timestamp}
            lastHash  : ${this.lastHash.substring(0, 10)}
            hash      : ${this.hash.substring(0, 10)}
            nonce     : ${this.nonce}
            difficulty: ${this.difficulty}
            data      : ${this.data}`;
    }

    static genesis() {
        return new this("timestamp", "----", "h4r0-h123", [], 0, DIFFICULTY);
    }
    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let timestamp,hash;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty =this.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);

        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;

        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}


module.exports = Block;
