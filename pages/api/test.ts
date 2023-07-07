import { redis } from "@/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(redis);

  return res.json("goo");
};

export default handler;
