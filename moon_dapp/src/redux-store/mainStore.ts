import { configureStore } from '@reduxjs/toolkit'
import walletStore from './walletStore';

export const store = configureStore({
  reducer: {
    walletStore,
    
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>;
