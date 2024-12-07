import { ObjectId } from "mongodb";

export default class User {
  _id?: ObjectId; // User ID
  name: string; // User Name
  email: string; // User email
  password: string; // User password
  dob: Date; // Date of birth
  address: string; // User address
  description: string; // User description
  createdAt?: Date; // User created date
  updatedAt?: Date; // User updated date

  constructor(
    name: string,
    email: string,
    password: string,
    dob: Date,
    address: string,
    description: string,
    createdAt: Date
  ) {
    (this.name = name),
      (this.email = email),
      (this.password = password),
      (this.dob = dob),
      (this.address = address),
      (this.description = description),
      (this.createdAt = createdAt);
  }
}
