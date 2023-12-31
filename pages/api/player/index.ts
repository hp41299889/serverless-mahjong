import type { NextApiRequest, NextApiResponse } from "next";

import { playerModel } from "./model";
import { response } from "@/util/http/response";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "GET": {
        const players = await playerModel.readAll();
        return response(res, 200, "success", "read players success", players);
      }
      case "POST": {
        const player = await playerModel.createOne(body);
        return response(res, 201, "success", "create player success", player);
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
