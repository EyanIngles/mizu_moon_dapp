import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { usePublishModule } from "./sdk"
//import { useState } from "react";

//import CONFIG from "./sui network/config.json";
//import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
//import { bcs } from '@mysten/bcs';



function App() {
  const { publishModule } = usePublishModule();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  //const [inputValue, setInputValue] = useState("");

  
  async function inputHandler() {

    console.log("input Handler")
  }
  async function ChangeMetaData() {
    //const client = new SuiClient({
    //  url: getFullnodeUrl('devnet'),
    //});
    const tx = new Transaction();
    //const devnetId = CONFIG[0].packageId.devnet.id;

    tx.moveCall({
      package: "0x2",
      module: "coin",
      function: "update_name",
      // treasuryCap, metadata, name,
      arguments: [
        tx.object("0xafee72f37d3f6432e0258ef4806885aea464356cf9bcce4e439a050b442349a0"), 
        tx.object("0xe2a2247f8afaf1f06e0a123cfc78751d29e670cc4a2d8430577bed485f71ad9f"),
        tx.pure.string("new_name")],
        typeArguments: ["0xb4cd3b43f81795229f7438cae2fcec4b166d795519e2c9d78ff5209faff79239::mizu::MIZU"]
    });
    tx.setGasBudget(10000000)
    //const 
    const result = await signAndExecuteTransaction({
      transaction: tx, chain: 'sui:devnet'
    });
    console.log(result, "result.")

  }
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading size="7">Mizu Moon</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <Button onClick={ChangeMetaData}>change metadata</Button> <hr />
          <Button onClick={publishModule}>try new token</Button>
          <form onSubmit={inputHandler}>
            <input
                type="text"
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter text here"
            />
            <button type="submit">Submit</button>
        </form>

          <WalletStatus />
        </Container>
      </Container>
    </>
  );
}

export default App;
