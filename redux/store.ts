import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mahjongReducer from './mahjong';

export const store = configureStore({
    reducer: {
        mahjong: mahjongReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
