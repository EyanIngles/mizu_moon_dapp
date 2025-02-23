import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text, Badge, Em } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import type { RootState } from '../src/redux-store/mainStore';
import { setWalletAddress, setWallet } from './redux-store/walletStore'
import { getWalletCoins } from "../src/redux-store/interactions/walletInteractions"

export function WalletStatus() {

  // const setState
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const walletAddress = useSelector((state: RootState) => state.walletStore.walletAddress);

  const account = useCurrentAccount();
  useEffect(() => {
    if (account) {
      try {
        const stringAccount = account.address.toString();
        dispatch(setWalletAddress(stringAccount));
        dispatch(setWallet(account.publicKey));
        //await getWalletCoins(walletAddress)
        setStatus(true);
      } catch (err) {
        console.error("Error updating wallet address:", err);
      }
    }
  }, [account, dispatch]);
  
  
  return (
    <Container my="2">
      <Heading mb="2"><Em>Wallet Status</Em>
      </Heading>

      {account && status ? (
        <Flex direction="column">
          <Text>
          <Badge color="green" size="2">Wallet connected</Badge>
          </Text>
        </Flex>
      ) : (
        <Text>
        <Badge color="red" size="2">Wallet not connected</Badge>
        </Text>
      )}
      <br /> 
      <OwnedObjects />
    </Container>
  );
}
