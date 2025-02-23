import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';

import { useSelector, useDispatch } from 'react-redux';

const { execSync } = require('child_process');
const cliPath = "sui"; // Ensure your CLI is in PATH or give its full path.
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('devnet'),
});
const { modules, dependencies } = JSON.parse(
	execSync(`${cliPath} move build --dump-bytecode-as-base64 --path ${packagePath}`, {
		encoding: 'utf-8',
	}),
);
const tx = new TransactionBlock();
const [upgradeCap] = tx.publish({
	modules,
	dependencies,
});
tx.transferObjects([upgradeCap], await client.getAddress());
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});