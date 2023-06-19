/* istanbul ignore file */

import { BN } from '@polkadot/util';
import { ApiRx } from '@polkadot/api';

import { Observable, from, of } from 'rxjs';

import { testBlocksFrom } from '../_blocks.js';

export const testBlocks = testBlocksFrom('blocks.cbor.bin');

const testHeaders = testBlocks.map(tb => tb.block.header);

const apiMock = {
  rpc: {
    chain: {
      subscribeNewHeads: () => from(testHeaders),
      subscribeFinalizedHeads: () => from(testHeaders)
    },
  },
  derive: {
    chain: {
      getBlockByNumber: (blockNumber: BN) =>  of(
        testBlocks.find(
          b => b.block.header.number.toBn().eq(blockNumber)
        )
      ),
      subscribeNewBlocks: () => from(testBlocks),
      subscribeFinalizedHeads: () => from(testHeaders),
      getBlock: (hash: Uint8Array | string) => of(
        testBlocks.find(
          b => b.block.hash.eq(hash)
        )
      )
    },
  },
} as unknown as ApiRx;

export const mockRxApi: Observable<ApiRx> = of(apiMock);