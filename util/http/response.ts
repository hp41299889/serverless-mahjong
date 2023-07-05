import { NextApiResponse } from "next";

export const response = (
  res: NextApiResponse,
  code: number,
  status: string,
  message: string,
  data: any
) => {
  return res.status(code).json({ status, message, data });
};

export const success = (
  res: NextApiResponse,
  code: number,
  status: string,
  message: string,
  data: any
) => {
  return res.status(code).json({ status, message, data });
};

export const failed = (
  res: NextApiResponse,
  code: number,
  status: string,
  message: string,
  data: any
) => {
  return res.status(code).json({ status, message, data });
};
