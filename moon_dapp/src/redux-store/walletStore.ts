import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the type for your state
interface WalletState {
  walletAddress: string | null;
}

// Set the initial state
const initialState: WalletState = {
  walletAddress: null,
}

// Create the slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Define an action to set the wallet address
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.walletAddress = action.payload;
    },
  },
});

// Export the action creator for use in your components
export const { setWalletAddress } = walletSlice.actions;

// Export the reducer to be included in your store
export default walletSlice.reducer;
