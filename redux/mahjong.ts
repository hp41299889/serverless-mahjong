import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getPlayerStatistics, getCurrentRound } from "@/util/api";
import { CurrentRound, Statistics } from "@/lib/redis/interface";
import { DeskType, RoundStatus } from "@/api/round/interface";
import { Wind } from "@/api/record/interface";

interface Mahjong {
  currentRound: CurrentRound;
  statistics: Statistics;
}

const initialState: Mahjong = {
  currentRound: {
    status: RoundStatus.EMPTY,
    round: {
      uid: "",
      createdAt: new Date().toISOString(),
      deskType: DeskType.AUTO,
      base: 0,
      point: 0,
      records: [],
    },
    records: [],
    players: {
      east: {
        id: 0,
        name: "",
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      south: {
        id: 0,
        name: "",
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      west: {
        id: 0,
        name: "",
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      north: {
        id: 0,
        name: "",
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
    },
    circle: Wind.EAST,
    dealer: Wind.EAST,
    dealerCount: 0,
    venue: [],
  },
  statistics: {},
};

export const fetchCurrentRound = createAsyncThunk(
  "/mahjong/fetchCurrentRound",
  async () => {
    return (await getCurrentRound()).data.data;
  }
);

export const fetchStatistics = createAsyncThunk(
  "/mahjong/fetchStatistics",
  async () => {
    return (await getPlayerStatistics()).data.data;
  }
);

export const slice = createSlice({
  name: "mahjong",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      .addCase(fetchCurrentRound.fulfilled, (state, action) => {
        state.currentRound = action.payload;
      });
  },
});

export const selectCurrentRound = (state: RootState) => {
  return state.mahjong.currentRound;
};

export const selectStatistics = (state: RootState) => {
  return state.mahjong.statistics;
};

export default slice.reducer;
