import { DeskType } from "@/pages/api/round/interface";
import { EndType } from "@/pages/api/record/interface";

export interface PostPlayer {
  name: string;
}

export interface PostRound {
  deskType: DeskType;
  base: number;
  point: number;
  east: string;
  south: string;
  west: string;
  north: string;
}

export interface PostRecord {
  winner: string;
  losers: string[];
  endType: EndType;
  point: number;
}
