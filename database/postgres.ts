import { DataSource } from "typeorm";
import { readFileSync } from "fs";
import "dotenv/config";

import { player } from "../pages/api/player/entity";
import { record } from "../pages/api/record/entity";
import { round } from "../pages/api/round/entity";
import { Migration1688955623174 } from "./migrations/1688955623174-migration";

const entities = [player, record, round];
let postgres: DataSource | null;

export const datasource = new DataSource({
  type: "postgres",
  host: "huihui-mahjong-hp4129889-1258.aivencloud.com",
  port: 17088,
  username: "avnadmin",
  password: "AVNS_MeeGIX13bRcLbqOXog4",
  database: "defaultdb",
  entities: entities,
  migrations: [Migration1688955623174],
  migrationsTableName: "migrations",
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync("./asset/ca.pem").toString(),
  },
});

export const getPostgres = async () => {
  if (!postgres) {
    postgres = await datasource.initialize();
  }
  return postgres;
};
