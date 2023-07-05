import { DataSource } from "typeorm";

import { player } from "@/api/player/entity";
import { record } from "@/api/record/entity";
import { round } from "@/api/round/entity";

const entities = [player, record, round];

export const postgres = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: entities,
  migrations: [],
  migrationsTableName: "migrations",
  synchronize: true,
});
