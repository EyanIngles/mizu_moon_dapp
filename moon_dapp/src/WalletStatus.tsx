import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

import { useSelector, useDispatch } from 'react-redux'
import { setWalletAddress } from './redux-store/walletStore'

export function WalletStatus() {
  const dispatch = useDispatch();

  const account = useCurrentAccount();
  if(account) {
    try{
      const string_account = account.address.toString();
      dispatch(setWalletAddress(string_account));
    } catch (err) {
      console.log("error", err)
    }
  }
  
  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>

      {account ? (
        <Flex direction="column">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
      <OwnedObjects />
    </Container>
  );
}
