// Authentication provider used to create the account.
export type UserProvider = "credentials" | "google";

// Access level; only "customer" accounts are created by register/Google flows,
// admin accounts are seeded in mock data.
export type UserRole = "customer" | "admin";

// Authenticated user profile held by the auth store (in-memory only).
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ISO date string (e.g. "1990-06-15").
  dateOfBirth: string;
  role: UserRole;
  provider: UserProvider;
  emailVerified: boolean;
};
