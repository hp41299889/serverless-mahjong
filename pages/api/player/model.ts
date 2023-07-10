import { In } from "typeorm";

import { getPostgres } from "@/database/postgres";
import { player } from "./entity";
import { CreateOnePlayerDto } from "./interface";

// Create
const createOne = async (dto: CreateOnePlayerDto) => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(player);
    return repo.save(dto);
  } catch (err) {
    throw err;
  }
};

// Read
const readAll = async () => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(player);
    return await repo.find();
  } catch (err) {
    throw err;
  }
};

const readOneByName = async (name: string) => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(player);
    return await repo.findOne({
      where: {
        name: name,
      },
    });
  } catch (err) {
    throw err;
  }
};

const readManyByNames = async (name: string[]) => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(player);
    return repo.find({
      where: {
        name: In(name),
      },
    });
  } catch (err) {
    throw err;
  }
};

// Update
//TODO not finish
const updateOneByName = async (name: string) => {
  const postgres = await getPostgres();
  const repo = postgres.getRepository(player);
  const target = await repo.findOneBy({ name: name });
  if (target) {
    await repo.save(target);
  }
};

export const playerModel = {
  createOne,
  readAll,
  readManyByNames,
  readOneByName,
  updateOneByName,
};
