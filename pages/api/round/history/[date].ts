import type { NextApiRequest, NextApiResponse } from "next";

import { response } from "@/util/http/response";
import { getHistory } from "@/job/mahjong/statistics";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      method,
      body,
      query: { date },
    } = req;
    switch (method) {
      case "GET": {
        const history = await getHistory();
        const histories = history[date as string];
        return response(res, 200, "success", "read history success", histories);
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
