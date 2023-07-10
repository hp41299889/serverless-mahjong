import { getPostgres } from "@/database/postgres";
import { record } from "./entity";
import { CreateOneRecordDto } from "./interface";

// Create
const createOne = async (dto: CreateOneRecordDto) => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(record);
    return await repo.save(dto);
  } catch (err) {
    throw err;
  }
};

export const recordModel = {
  createOne,
};
