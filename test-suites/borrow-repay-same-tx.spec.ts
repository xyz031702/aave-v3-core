import { TestEnv, makeSuite } from './helpers/make-suite';
import { ProtocolErrors } from '../helpers/types';
import {
  MockBorrowRepayTest,
  MockBorrowRepayTestFactory,
  MintableERC20,
  WETH9Mocked,
} from '../types';
import { BigNumber } from 'ethers';
import { getFirstSigner } from '../helpers/contracts-getters';
import { expect } from 'chai';

makeSuite('Borrow/repay in the same tx', (testEnv: TestEnv) => {
  const { VL_SAME_BLOCK_BORROW_REPAY } = ProtocolErrors;
  const unitParse = async (token: WETH9Mocked | MintableERC20, nb: string) =>
    BigNumber.from(nb).mul(BigNumber.from('10').pow((await token.decimals()) - 3));

  let testContract: MockBorrowRepayTest;

  it('Deploys the test contract', async () => {
    const { weth, dai, pool } = testEnv;

    testContract = await (
      await new MockBorrowRepayTestFactory(await getFirstSigner())
    ).deploy(pool.address, weth.address, dai.address);
  });

  it('Executes a test borrow/repay in the same transaction at variable (revert expected)', async () => {
    await expect(testContract.executeBorrowRepayVariable()).to.be.revertedWith(
      VL_SAME_BLOCK_BORROW_REPAY,
      'Borrow/repay in the same transaction did not revert as expected'
    );
  });

  it('Executes a test borrow/repay in the same transaction at stabke (revert expected)', async () => {
    await expect(testContract.executeBorrowRepayStable()).to.be.revertedWith(
      VL_SAME_BLOCK_BORROW_REPAY,
      'Borrow/repay in the same transaction did not revert as expected'
    );
  });
});
