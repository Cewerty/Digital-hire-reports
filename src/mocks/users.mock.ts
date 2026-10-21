import type { BaseEntity } from "@/types";

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: "admin" | "user";
}

export const usersMock: User[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    role: "user",
    createdAt: "2025-01-02",
    updatedAt: "2025-01-02",
  },
];
