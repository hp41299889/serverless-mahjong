import { Player } from "../player/interface";
import { Round } from "../round/interface";

export enum EndType {
  WINNING = "winning",
  SELF_DRAWN = "self-drawn",
  DRAW = "draw",
  FAKE = "fake",
}

export enum Wind {
  EAST = "east",
  SOUTH = "south",
  WEST = "west",
  NORTH = "north",
}

//entity
export interface Record {
  //generate
  uid: string;
  createdAt: Date;

  //column
  endType: EndType;
  point: number;

  //relation
  winner: Player;
  round: Round;
  losers: Player[];
}

//service

//model
export interface CreateOneRecordDto {
  winner: Player;
  losers: Player[];
  endType: EndType;
  point: number;
  createdAt: Date;
  round: Round;
}
