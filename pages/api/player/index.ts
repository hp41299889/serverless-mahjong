import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { response } from "@/util/http/response";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;
    switch (method) {
      case "GET": {
        const players = await prisma.player.findMany();
        return response(res, 200, "success", "read players success", players);
      }
      case "POST": {
        const player = await prisma.player.create({ data: body });
        return response(res, 201, "success", "create player success", player);
      }
    }
  } catch (err) {
    console.error(err);
    return response(res, 500, "failed", "something error", "server error");
  }
};

export default handler;
