import { getPostgres } from "@/database/postgres";
import { round } from "./entity";
import { CreateOneRoundDto } from "./interface";

// Create
const createOne = async (dto: CreateOneRoundDto) => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(round);
    return await repo.save(dto);
  } catch (err) {
    throw err;
  }
};

// Read
const readAll = async () => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(round);
    return repo.find({
      relations: {
        records: {
          winner: true,
          losers: true,
        },
        east: true,
        south: true,
        west: true,
        north: true,
      },
      order: {
        records: {
          createdAt: "ASC",
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

const readLastWithPlayers = async () => {
  try {
    const postgres = await getPostgres();
    const repo = postgres.getRepository(round);
    return repo.findOne({
      where: {},
      relations: {
        records: {
          winner: true,
          losers: true,
        },
        east: true,
        south: true,
        west: true,
        north: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  } catch (err) {
    throw err;
  }
};

const readManyByName = async (name: string) => {
  const postgres = await getPostgres();
  const repo = postgres.getRepository(round);
  return repo.findAndCount({
    where: [
      { east: { name: name } },
      { south: { name: name } },
      { west: { name: name } },
      { north: { name: name } },
    ],
    relations: {
      records: true,
    },
  });
};

const deleteLastRound = async () => {
  const postgres = await getPostgres();
  const repo = postgres.getRepository(round);
  const target = await repo.findOne({
    where: {},
    order: {
      createdAt: "DESC",
    },
  });
  if (target) {
    return await repo.remove(target);
  }
  return null;
};

export const roundModel = {
  createOne,
  readAll,
  readLastWithPlayers,
  readManyByName,
  deleteLastRound,
};
