import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { usePublishModule } from "./sdk"
import { useState } from "react";

import CONFIG from "./sui network/config.json";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/bcs';





function App() {
  const { publishModule } = usePublishModule();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [inputValue, setInputValue] = useState("");


  function decodeBytecode(String: string) {
    preventDefault();
    try {
      console.log("start")
        // Decode Base64 string to a byte array (Uint8Array)
        const byteArray = Uint8Array.from(atob(String), c => c.charCodeAt(0));

        // Convert to a readable UTF-8 string
        const decodedText = new TextDecoder("utf-8").decode(byteArray);

        // Extract only printable characters (to remove binary noise)
        const filteredText = decodedText.replace(/[^ -~]+/g, ""); // Keep only readable ASCII chars
        window.alert(`filtered text = ${filteredText}`)
        console.log("filtered text: ", filteredText)
        return filteredText;
    } catch (error) {
        console.error("Error decoding bytecode:", error);
        return "";
    }
}

  async function ChangeMetaData() {
    const client = new SuiClient({
      url: getFullnodeUrl('devnet'),
    });
    const tx = new Transaction();
    const devnetId = CONFIG[0].packageId.devnet.id;

    const originalBytecode = "oRzrCwYAAAAKAQAMAgweAyocBEYIBU5RB58BmQEIuAJgBpgDLQrFAwUMygMtAAoBDAIGAg8CEAIRAAECAAECBwEAAAIADAEAAQIDDAEAAQQEAgAFBQcAAAkAAQABCwEEAQACBwYHAQIDDQsBAQwEDggJAAEDAgUDCgMMAggABwgEAAILAgEIAAsDAQgAAQgFAQsBAQkAAQgABwkAAgoCCgIKAgsBAQgFBwgEAgsDAQkACwIBCQABBggEAQUBCwIBCAACCQAFAQsDAQgADENvaW5NZXRhZGF0YQRNSVpVBk9wdGlvbgtUcmVhc3VyeUNhcAlUeENvbnRleHQDVXJsBGNvaW4PY3JlYXRlX2N1cnJlbmN5C2R1bW15X2ZpZWxkBGluaXQEbWl6dQRub25lBm9wdGlvbg9wdWJsaWNfdHJhbnNmZXIGc2VuZGVyCHRyYW5zZmVyCnR4X2NvbnRleHQDdXJsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCgIDAk1aCgIFBE1penUKAhwbVGhpcyBpcyBNaXp1IGRlZmF1bHQgdG9rZW4uAAIBCAEAAAAAAhULADEJBwAHAQcCOAAKATgBDAIMAwsCCgEuEQQ4AgsDCwEuEQQ4AwIA";
    // Decode base64 bytecode to binary
    const oldName = "Mizu"
    const newName = "Test"
    let bytecodeBuffer = Buffer.from(originalBytecode, 'base64');
    let bytecodeString = bytecodeBuffer.toString('utf8');

    // Replace token name in bytecode
    bytecodeString = bytecodeString.replace(oldName, newName);

    // Convert back to base64
    const modifiedBytecode = Buffer.from(bytecodeString, 'utf8').toString('base64');

    console.log("below here\n\n",modifiedBytecode)


    tx.moveCall({
      package: "0x2",
      module: "coin",
      function: "update_name",
      // treasuryCap, metadata, name,
      arguments: [tx.object("0x32119b180522a5aa610540e349b8036199955b7256d210884e06f5f61d9e64e9"), 
        tx.object("0x0ba3691054469ff340abfb2fa809daf88ae0b5c80bf7923cbc6666fe5440151e"), 
        tx.pure.string("new_name")]
    });
    tx.setGasBudget(1000000)
    //const 
   // const result = await signAndExecuteTransaction({
   //   transaction: tx, chain: 'sui:devnet'
   // });
    //console.log(result, "result.")

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
          <form onSubmit={decodeBytecode => (inputValue)}>
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
