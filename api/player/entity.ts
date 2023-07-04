import { EntitySchema } from "typeorm";

import { Player } from "./interface";

export const player = new EntitySchema<Player>({
  name: "player",
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    rounds: {
      target: "round",
      type: "one-to-many",
      joinColumn: { name: "roundUid" },
    },
    winner: {
      type: "one-to-many",
      target: "record",
    },
  },
});
