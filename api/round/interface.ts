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
  east?: Player;
  south?: Player;
  west?: Player;
  north?: Player;
  records: Record[];
  // updatedAt: Date;
}

export interface ICurrentRound {
  roundUid: string;
  deskType: DeskType;
  base: number;
  point: number;
  players: {
    [key: string]: Player;
    east: Player;
    south: Player;
    west: Player;
    north: Player;
  };
  circle: Wind;
  dealer: Wind;
  dealerCount: number;
  recordCount: number;
  drawCount: number;
  fakeCount: number;
}

//service
export interface IPostOne {
  deskType: DeskType;
  base: number;
  point: number;
  east: string;
  south: string;
  west: string;
  north: string;
}

//model
export interface ICreateOneRoundDto {
  deskType: DeskType;
  base: number;
  point: number;
  east: Player;
  south: Player;
  west: Player;
  north: Player;
}
