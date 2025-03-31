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
import { PACKAGEID, COIN_OBJECTS_ID } from "./constants/token_module";



function App() {
  const { publishModule } = usePublishModule();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  //const [inputValue, setInputValue] = useState("");

  async function HandoverTokenPermission () {
    const tx = new Transaction();
    tx.setGasBudget(10000000)

    tx.moveCall({
      package: PACKAGEID,
      module: "create_token",
      function: "handover_token",

      arguments: [
        tx.object(COIN_OBJECTS_ID),
        tx.object("0x6fd890066166aba7722063724d104e357eedbcf56e6fb51bafd6c7896901ee26"), // Treasurey cap
        tx.object("0xb540442374750c712922ca2ce457bd27e2dae05b1468e2ca4793fd74ef6f6f24") // Metadata 
      ],
      typeArguments: ["0x16de166a6caa5300237a06f4875694283416cc30649d1d34cc402aad299bbdd0::Mizu_coin::MIZU_COIN"]
    });
    const result = await signAndExecuteTransaction({
      transaction: tx, chain: 'sui:devnet'
    })
    console.log(result.digest);
  }
  
  async function inputHandler() {

    console.log("input Handler")
  }
  async function ChangeMetaData() {
    //const client = new SuiClient({
    //  url: getFullnodeUrl('devnet'),
    //});
    const tx = new Transaction();
    //const devnetId = CONFIG[0].packageId.devnet.id;

    tx.moveCall({ // this function works!!
      package: '0x47772402126db00d5ade92994734d8b4a25743df5550f7706f73a16a77fa9206',
      module: "change_metadata",
      function: "change_metadata_without_url",
      // treasuryCap, metadata, name,
      arguments: [
        tx.object("0x2cf61423ea66e8d3a0dcd07817525a0049af6bef76590eb50fe24cbc9820a1d4"), 
        tx.object("0x107a6c3d5bdc1aa4580a0f380752d7859073a8cd9239a9f5afd21c5fba7c684a"),
        tx.pure.string("new_name"),
        tx.pure.string("SY"),
        tx.pure.string("this is a new description test."),
        tx.pure.string("www.bigDAWg.com")
      ],
        typeArguments: ["0x16de166a6caa5300237a06f4875694283416cc30649d1d34cc402aad299bbdd0::Mizu_coin::MIZU_COIN"]
    }); //symbol: String, description: String, url: String
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
          <Button onClick={HandoverTokenPermission}>hand over token permissions</Button> <hr />
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
