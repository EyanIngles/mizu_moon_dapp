import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WalletAccount } from '@mysten/wallet-standard';


// Define the type for your state
interface WalletState {
  walletKey: {} | null,
  walletAddress: string | null,
  walletObjects: {} | null,
  walletCoins: {} | null,
}

// Set the initial state
const initialState: WalletState = {
  walletKey: {},
  walletAddress: null,
  walletObjects: {},
  walletCoins: {}
}

// Create the slice
const walletSlice = createSlice({
  name: 'WalletState',
  initialState,
  reducers: {
    // Define an action to set the wallet address
    setWallet: (state, action: PayloadAction<{} | null>) => {
      state.walletKey = action.payload;
    },
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.walletAddress = action.payload;
    },
    setWalletObjects: (state, action: PayloadAction<{} | null>) => {
      state.walletObjects = action.payload;
    },
    setWalletCoins: (state, action: PayloadAction<{} | null>) => {
      state.walletCoins = action.payload;
    },
  },
});

// Export the action creator for use in your components
export const { setWallet, setWalletAddress, setWalletObjects, setWalletCoins } = walletSlice.actions;

// Export the reducer to be included in your store
export default walletSlice.reducer;
