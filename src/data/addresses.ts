import type { Address } from "@/types/address";

// Saved addresses for the demo customer (usr-customer-1). Exactly one is
// primary; used as checkout snapshots and order-detail address history.
export const addresses: Address[] = [
  {
    id: "addr-home",
    recipientName: "Demo Customer",
    provinceCity: "Ho Chi Minh City",
    district: "District 1",
    ward: "Ben Nghe",
    street: "123 Le Loi Street",
    isPrimary: true,
  },
  {
    id: "addr-office",
    recipientName: "Demo Customer",
    provinceCity: "Hanoi",
    district: "Hoan Kiem",
    ward: "Trang Tien",
    street: "45 Trang Tien Street",
    isPrimary: false,
  },
  {
    id: "addr-gift",
    recipientName: "Minh Anh",
    provinceCity: "Da Nang",
    district: "Hai Chau",
    ward: "Hai Chau 1",
    street: "78 Bach Dang Street",
    isPrimary: false,
  },
];
