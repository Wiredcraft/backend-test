import { ObjectId } from "mongodb";

export class Profile {
  _id?: ObjectId;
  userId: ObjectId;
  followers?: Array<Follow>;
  following?: Array<Follow>;
  invites?: Array<Profile>;

  constructor(
    userId: ObjectId,
    followers: Array<Follow>,
    following: Array<Follow>,
    invites: Array<Profile>
  ) {
    this.userId = userId;
    this.followers = followers;
    this.following = following;
    this.invites = invites;
  }
}

export interface Follow {
  userId: ObjectId;
  followDate: Date;
}
