import { DataSource } from "typeorm";
import "dotenv/config";

import { player } from "../pages/api/player/entity";
import { record } from "../pages/api/record/entity";
import { round } from "../pages/api/round/entity";
import { Migration1688955623174 } from "./migrations/1688955623174-migration";

const entities = [player, record, round];
let postgres: DataSource | null;

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: entities,
  migrations: [Migration1688955623174],
  migrationsTableName: "migrations",
  ssl: {
    rejectUnauthorized: true,
    ca: Buffer.from(process.env.POSTGRES_CA!, "base64").toString(),
  },
});

export const getPostgres = async () => {
  if (!postgres) {
    postgres = await datasource.initialize();
  }
  return postgres;
};
