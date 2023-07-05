import { EntitySchema } from "typeorm";

import { EndType } from "./interface";
import { Record } from "./interface";

export const record = new EntitySchema<Record>({
  name: "record",
  columns: {
    uid: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    endType: {
      type: "enum",
      enum: EndType,
    },
    point: {
      type: Number,
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
    },
  },
  relations: {
    round: {
      target: "round",
      type: "many-to-one",
    },
    winner: {
      target: "player",
      type: "many-to-one",
      joinColumn: { name: "winnerId" },
      nullable: true,
    },
    losers: {
      target: "player",
      type: "many-to-many",
      joinTable: {
        name: "record_losers",
        joinColumn: {
          name: "recordUid",
        },
      },
      nullable: true,
      cascade: true,
    },
  },
});
