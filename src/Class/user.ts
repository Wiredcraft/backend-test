import { ObjectId } from "mongodb";

export default class User {
  _id?: ObjectId; // User ID
  name: string | null; // User Name
  email?: string | null; // User email
  password: string; // User password
  dob: Date | null; // Date of birth
  address: string | null; // User address
  description: string | null; // User description
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
    this.name = name;
    this.email = email;
    this.password = password;
    this.dob = dob;
    this.address = address;
    this.description = description;
    this.createdAt = createdAt;
  }
}
