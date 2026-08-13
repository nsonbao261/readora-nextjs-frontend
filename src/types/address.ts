// Saved shipping/billing address snapshot. Exactly one address per user is
// primary (the default for checkout).
export type Address = {
  id: string;
  recipientName: string;
  provinceCity: string;
  district: string;
  ward: string;
  street: string;
  // Whether this is the user's default (primary) address.
  isPrimary: boolean;
};
