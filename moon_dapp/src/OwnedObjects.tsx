import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Skeleton, Card } from "@radix-ui/themes";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setWalletObjects } from "./redux-store/walletStore";

export function OwnedObjects() {
  const dispatch = useDispatch();
  

  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return (
      <Flex>
        <Text size="5">
          <Skeleton>
            Objects owned by the connected wallet <br />
            Objects owned by the connected wallet Objects owned by the connected
            wallet
          </Skeleton>
        </Text>
      </Flex>
    );
  }
  if (data) {
    let array = [data.data];
    dispatch(setWalletObjects(array));
  }
  return (
    <Flex direction="column" my="2">
      {data.data.length === 0 ? (
        <Text>No objects owned by the connected wallet</Text>
      ) : (
        <Heading size="7">Objects owned by the connected wallet</Heading>
      )}
      {data.data.map((object: any) => (
        <Card mb="2" background-color="grey" key={object.data?.objectId}>
          <Flex>
            <Text className="text-center">
              Object ID: {object.data?.objectId}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
