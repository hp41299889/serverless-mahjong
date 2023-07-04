import { Round } from "../round/interface";

//entity
export interface Player {
  //generate
  id: number;
  createdAt: Date;

  //column
  name: string;

  //relation
  rounds: Round[];
  winner: Player;
}

//model
export interface ICreateOnePlayerDto {
  name: string;
}
