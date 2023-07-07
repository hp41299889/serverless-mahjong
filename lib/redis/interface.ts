import { DeskType, Round, RoundStatus } from "@/pages/api/round/interface";
import { Wind, EndType } from "@/pages/api/record/interface";

export interface CurrentRound {
  status: RoundStatus;
  round: Round;
  records: AddRecord[];
  players: Players;
  circle: Wind;
  dealer: Wind;
  dealerCount: number;
  venue: AddRecord[];
}

export interface Statistics {
  [key: string]: PlayerStatistics;
}

export interface PlayerStatistics {
  id: number;
  name: string;
  createdAt?: Date;
  winds: {
    [key: string]: WindStatistics;
    east: WindStatistics;
    south: WindStatistics;
    west: WindStatistics;
    north: WindStatistics;
  };
}

export interface Players {
  [key: string]: PlayerScore;
  east: PlayerScore;
  south: PlayerScore;
  west: PlayerScore;
  north: PlayerScore;
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

export interface WindStatistics {
  [key: string]: number;
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
