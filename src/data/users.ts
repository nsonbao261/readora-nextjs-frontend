import type { User } from "@/types/user";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_CUSTOMER_EMAIL,
  DEMO_CUSTOMER_PASSWORD,
  DEMO_UNVERIFIED_EMAIL,
  DEMO_UNVERIFIED_PASSWORD,
} from "@/constants/auth";

// Plaintext demo passwords for the seeded accounts (UI-only mock data).
// The auth store reads this map when validating login credentials.
export const seedPasswords: Record<string, string> = {
  [DEMO_ADMIN_EMAIL]: DEMO_ADMIN_PASSWORD,
  [DEMO_CUSTOMER_EMAIL]: DEMO_CUSTOMER_PASSWORD,
  [DEMO_UNVERIFIED_EMAIL]: DEMO_UNVERIFIED_PASSWORD,
};

// Seed one admin + one customer, both verified, so both roles are
// demonstrable out of the box. Registered users are added at runtime.
export const seededUsers: User[] = [
  {
    id: "usr-admin-1",
    name: "Readora Admin",
    email: DEMO_ADMIN_EMAIL,
    phone: "0912345678",
    dateOfBirth: "1985-03-12",
    role: "admin",
    provider: "credentials",
    emailVerified: true,
  },
  {
    id: "usr-customer-1",
    name: "Demo Customer",
    email: DEMO_CUSTOMER_EMAIL,
    phone: "0987654321",
    dateOfBirth: "1992-07-24",
    role: "customer",
    provider: "credentials",
    emailVerified: true,
  },
  {
    id: "usr-customer-2",
    name: "Unverified Customer",
    email: DEMO_UNVERIFIED_EMAIL,
    phone: "0901122334",
    dateOfBirth: "1996-11-02",
    role: "customer",
    provider: "credentials",
    emailVerified: false,
  },
];
