import { useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast"; // Ensure toast is imported
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

// Utility function to convert object to Base64 string
const toBase64 = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64");

export function useCreate() {
    const account = useCurrentAccount();
    const [loading, setLoading] = useState<"Creating" | "Adding" | "False">("False");
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    // Function to create a token
    const createToken = async (
        tokenName: string,
        tokenSymbol: string,
        tokenDescription: string,
        tokenLogo: string,
        website: string,
        telegram: string,
        twitter: string,
        inputAmount: number,
        outputTokenAmount: number
    ) => {
        setLoading("Creating");
        tokenSymbol = tokenSymbol.toUpperCase();

        try {
            if (!account?.address) {
                toast.error("Wallet not connected!");
                setLoading("False");
                return;
            }

            // Encode token metadata in Base64
            const pkg = toBase64({
                symbol: tokenSymbol,
                name: tokenName,
                description: tokenDescription,
                iconUrl: tokenLogo
            });

            // Define necessary dependencies (adjust as needed)
            const dependencies = [
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002"
            ];

            // Create a new transaction block
            const tx = new TransactionBlock();

            // Publish the new token contract
            const [upgradeCap] = tx.publish({
                modules: [pkg],
                dependencies
            });

            // Transfer upgrade capability to the creator (user)
            tx.transferObjects([upgradeCap], tx.pure(account.address));

            // Deduct a transaction fee (ensure FeeWallet is defined)
            const FeeWallet = "0xFEEWALLET_ADDRESS"; // Replace with actual fee wallet address
            const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(990000000))]);
            tx.transferObjects([coin], tx.pure(FeeWallet));

            // Sign & execute the transaction
            //signAndExecuteTransaction(
            //    { transaction: tx },
            //    {
            //        onSuccess: async (result) => {
            //            const digest = result.digest;
            //            if (digest) {
            //                toast.success(`Successfully created token! Transaction: ${digest}`);
            //                // Call `createPool` after successful token creation
            //                //createPool(digest, tokenName, tokenSymbol, tokenDescription, tokenLogo, website, telegram, twitter, inputAmount, outputTokenAmount);
            //            }
            //        },
            //        onError: (error) => {
            //            console.error("Transaction failed:", error);
            //            toast.error("Token creation failed!");
            //            setLoading("False");
            //        }
            //    }
            //);
        } catch (error) {
            console.error(error);
            toast.error("Token creation failed!");
            setLoading("False");
        }
    };

    return { createToken, loading };
}
