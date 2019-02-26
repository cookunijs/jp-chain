const Block =  require('./block');

describe('Block', () => {

    let data, lastBlock, block;

    beforeEach( () => {
         data = "sato";
         lastBlock = Block.genesis();
         block = Block.mineBlock(lastBlock, data);
    })

    it('data test', () => {
        expect(block.data).toEqual(data);
    });

    it('hash test', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('指定難易度のハッシュ値でテスト', () => {
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());

    });

    it ('低速ブロック採掘で難易度を下げるテスト', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty-1);
    });

    it('高速ブロックで採掘難易度を上げるテスト', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty+1);
    });
});
