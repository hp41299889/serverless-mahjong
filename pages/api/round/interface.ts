import { Player } from "../player/interface";
import { Record, Wind } from "../record/interface";

export enum DeskType {
  AUTO = "auto",
  MANUAL = "manual",
}

export enum RoundStatus {
  EMPTY = "empty",
  IN_PROGRESS = "in progress",
  END = "end",
}

//entity
export interface Round {
  //generate
  uid: string;
  createdAt: Date | string;

  //column
  deskType: DeskType;
  base: number;
  point: number;

  //relation
  east: Player;
  south: Player;
  west: Player;
  north: Player;
  records: Record[];
  // updatedAt: Date;
}

//service
export interface PostOne {
  deskType: DeskType;
  base: number;
  point: number;
  east: string;
  south: string;
  west: string;
  north: string;
}

//model
export interface CreateOneRoundDto {
  deskType: DeskType;
  base: number;
  point: number;
  east: Player;
  south: Player;
  west: Player;
  north: Player;
}
