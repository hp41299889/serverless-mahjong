import type { NextApiRequest, NextApiResponse } from "next";

import { response } from "@/util/http/response";
import { getStatistics } from "@/job/mahjong/statistics";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "GET": {
        const statistics = await getStatistics();
        return response(
          res,
          200,
          "success",
          "read players success",
          statistics
        );
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
