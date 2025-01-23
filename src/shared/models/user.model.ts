import { UserRole } from "../roles/user-role.enum";

export type User = {
  id: string;
  username: string;
  age: number;
  role: UserRole
};
