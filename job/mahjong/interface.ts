import { EndType, Wind } from "@/pages/api/record/interface";
import { DeskType, Round } from "@/pages/api/round/interface";

export interface CurrentRound {
  status: string;
  round: Round | null;
  records: AddRecord[];
  players: Players;
  circle: Wind;
  dealer: Wind;
  dealerCount: number;
  venue: AddRecord[];
}

export interface Players {
  [key: string]: PlayerScore;
  east: PlayerScore;
  south: PlayerScore;
  west: PlayerScore;
  north: PlayerScore;
}

export interface AddRecord {
  circle: Wind;
  dealer: Wind;
  dealerCount: number;
  winner: string;
  losers: string[];
  endType: EndType;
  point: number;
  createdAt: Date;
}

export interface PlayerScore {
  id: number;
  name: string;
  win: number;
  lose: number;
  selfDrawn: number;
  draw: number;
  beSelfDrawn: number;
  fake: number;
  amount: number;
}

export interface Statistics {
  [key: string]: PlayerStatistics;
}

export interface History {
  [key: string]: HistoryRound[];
}

export interface HistoryRound {
  uid: string;
  createdAt: Date;
  deskType: DeskType;
  base: number;
  point: number;
  east: PlayerScore;
  south: PlayerScore;
  west: PlayerScore;
  north: PlayerScore;
  records: AddRecord[];
  venue: AddRecord[];
}

export interface PlayerStatistics {
  id: number;
  name: string;
  createdAt?: Date;
  winds: {
    [key: string]: any;
    east: any;
    south: any;
    west: any;
    north: any;
  };
}

export interface WindStatistics {
  round: number;
  record: number;
  win: number;
  lose: number;
  selfDrawn: number;
  draw: number;
  beSelfDrawn: number;
  fake: number;
  amount: number;
}
