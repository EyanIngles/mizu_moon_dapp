import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useDispatch } from 'react-redux';

import { setWalletCoins } from "../walletStore"


const client = new SuiClient({ url: getFullnodeUrl('devnet') });
const dispatch = useDispatch();

export const getWalletCoins = async (walletAddress: string) => {
    const coins = await client.getCoins({
      owner: walletAddress,
    });
    dispatch(setWalletCoins(coins));

  };
