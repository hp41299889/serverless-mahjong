import type { NextApiRequest, NextApiResponse } from "next";

import { response } from "@/util/http/response";
import {
  addRecord,
  getCurrentRoundState,
  initCurrentRound,
  recoverCurrentRound,
  removeLastRecord,
  setCurrentRoundState,
  updateCurrentRound,
} from "@/job/mahjong/mahjong";
import { AddRecord } from "@/job/mahjong/interface";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "POST": {
        const currentRound = await getCurrentRoundState();
        const { body }: { body: AddRecord } = req;
        const { winner, losers, point, endType } = body;
        const { circle, dealer, dealerCount } = currentRound;
        const addRecordDto: AddRecord = {
          circle: circle,
          dealer: dealer,
          dealerCount: dealerCount,
          winner: winner,
          losers: losers,
          point: point,
          endType: endType,
          createdAt: new Date(),
        };
        const addedCurrentRound = await addRecord(currentRound, addRecordDto);
        const updatedCurrentRound = await updateCurrentRound(
          addedCurrentRound,
          addRecordDto
        );
        await setCurrentRoundState(updatedCurrentRound);
        return response(
          res,
          201,
          "success",
          "create record success",
          addRecordDto
        );
      }
      case "DELETE": {
        const currentRound = await getCurrentRoundState();
        const removed = currentRound.records[currentRound.records.length - 1];
        if (removed) {
          const recoveredCurrentRound = await recoverCurrentRound(
            currentRound,
            removed
          );
          const removedCurrentRound = await removeLastRecord(
            recoveredCurrentRound
          );
          await setCurrentRoundState(removedCurrentRound);
        } else {
          await initCurrentRound();
        }
        return response(res, 201, "success", "delete record success", "result");
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
