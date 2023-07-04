import axios, { AxiosInstance } from "axios";

const request = (baseUrl = ""): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
  });
  return instance;
};

export const mahjongApi = request("/api");
