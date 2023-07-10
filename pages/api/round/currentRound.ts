import type { NextApiRequest, NextApiResponse } from "next";

import { response } from "@/util/http/response";
import {
  getCurrentRoundState,
  resetCurrentRound,
  saveRecords,
} from "@/job/mahjong/mahjong";
import { roundModel } from "./model";
import {
  getHistory,
  getStatistics,
  setHistory,
  setStatistics,
  updateHistory,
  updateStatistics,
} from "@/job/mahjong/statistics";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "GET": {
        const currentRound = await getCurrentRoundState();
        return response(
          res,
          200,
          "success",
          "read players success",
          currentRound
        );
      }
      case "POST": {
        const currentRound = await getCurrentRoundState();
        const statistics = await getStatistics();
        const history = await getHistory();
        await saveRecords(currentRound);
        const updatedStatistics = await updateStatistics(
          statistics,
          currentRound
        );
        const updatedHistory = await updateHistory(history, currentRound);
        await setStatistics(updatedStatistics);
        await setHistory(updatedHistory);
        await resetCurrentRound();
        return response(
          res,
          200,
          "success",
          "read players success",
          "reset currentRound"
        );
      }
      case "DELETE": {
        await roundModel.deleteLastRound();
        await resetCurrentRound();
        return response(res, 200, "success", "delete round success", "delete");
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
