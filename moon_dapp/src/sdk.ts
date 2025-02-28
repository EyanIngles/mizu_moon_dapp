import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useSelector } from 'react-redux';
import { RootState } from './redux-store/mainStore';
import { COIN_MODULE_BYTESCODE, COIN_DEPENDENCIES_BYTESCODE } from './constants/token_module';

export function usePublishModule() {
    const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentAccount = useCurrentAccount();

    async function publishModule() {
        const client = new SuiClient({
            url: getFullnodeUrl('devnet'),
        });

        // Fetch gas coins
        const gasCoins = await client.getCoins({
			owner: '0xf1bf11fd80459367c747fd8b6522cc5481162f9ec4478a967cdf5503eaf50ce9',
			coinType: "0x2::sui::SUI" // Ensure we fetch only SUI gas coins
		});
		
		// Ensure there is at least one gas coin available
		if (gasCoins.data.length === 0) {
			console.error("No gas coins available! Please request SUI from the faucet.");
			return;
		}
		
		// Extract the first available gas coin
		const gasCoin = gasCoins.data[0]; // ✅ Selects the entire object, not just `coinObjectId`
		const formattedGasCoin = {
			objectId: gasCoin.coinObjectId, // ✅ Rename `coinObjectId` to `objectId`
			version: gasCoin.version, // ✅ Ensure `version` is included
			digest: gasCoin.digest // ✅ Ensure `digest` is included
		}

        const modules = COIN_MODULE_BYTESCODE 
        const dependencies = COIN_DEPENDENCIES_BYTESCODE
        try {
            const tx = new Transaction();

            // Publish Move module
            const [upgradeCap] = tx.publish({
                modules: modules,
                dependencies: dependencies
            });

            // Transfer upgrade capability only if it exists
            tx.transferObjects([upgradeCap], "0xf1bf11fd80459367c747fd8b6522cc5481162f9ec4478a967cdf5503eaf50ce9");

            tx.setGasBudget(100000000); // 0.1 sui cap
            //tx.setGasPayment([formattedGasCoin]); // Explicitly setting gas coin
             
            //Execute the transaction
            const result = await signAndExecuteTransaction(
                { transaction: tx, chain: 'sui:devnet' }
            );
            
           window.alert(`Tx complete. \n digest: ${result.digest}`)
           console.log(`Tx complete. \n digest: ${result.digest}`)
           console.log(`Tx complete. \n bytes: ${result.bytes}`)
           console.log(`Tx complete. \n effects: ${result.effects}`)
           console.log(`Tx complete. \n sigs: ${result.signature}`)

        } catch (error) {
            console.error("Transaction execution failed:", error);
        }
    }

    return { publishModule };
}
