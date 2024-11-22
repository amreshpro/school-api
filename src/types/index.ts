import { Request } from "express";

// User roles enumeration
export enum UserRole {
  Admin = "admin",
  User = "user",
}

// User interface with ID and role
export interface User {
  id: string;
  role: UserRole;
}

// CreateUserRequest interface for user creation
export interface CreateSchoolRequest extends Request {
  body: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
}
