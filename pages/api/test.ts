import type { NextApiRequest, NextApiResponse } from "next";
import { response } from "@/util/http/response";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return response(res, 200, "success", "hi", "good");
};

export default handler;
