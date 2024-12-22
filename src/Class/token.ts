import { ObjectId } from "mongodb";

export class Token {
  _id?: ObjectId;
  token: string;
  createdAt: Date;

  constructor(token: string, createdAt: Date) {
    this.token = token;
    this.createdAt = createdAt;
  }
}
