import type { NextApiRequest, NextApiResponse } from "next";

import { playerModel } from "../player/model";
import { roundModel } from "./model";
import { response } from "@/util/http/response";
import { CreateOneRoundDto } from "./interface";
import { initCurrentRound, resetCurrentRound } from "@/job/mahjong/mahjong";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "POST": {
        const names = [body.east, body.south, body.west, body.north];
        const players = await playerModel.readManyByNames(names);
        const east = players.find((player) => player.name === body.east);
        const south = players.find((player) => player.name === body.south);
        const west = players.find((player) => player.name === body.west);
        const north = players.find((player) => player.name === body.north);
        const dto: CreateOneRoundDto = {
          ...body,
          east: east,
          south: south,
          west: west,
          north: north,
        };
        const round = await roundModel.createOne(dto);
        await initCurrentRound();
        return response(res, 201, "success", "create round success", round);
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
