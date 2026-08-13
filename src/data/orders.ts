import { SHIPPING_FEE } from "@/constants/shipping";
import { addresses } from "@/data/addresses";
import { OrderStatus, type Order } from "@/types/order";

// Order history for the demo customer (usr-customer-1), newest-first.
// Item/total fields are snapshots (frozen at checkout), so history is stable.
export const orders: Order[] = [
  {
    id: "RD-1047",
    placedAt: "2026-08-10T09:24:00.000Z",
    status: OrderStatus.Pending,
    items: [
      {
        bookId: "cartographers-daughter",
        title: "The Cartographer's Daughter",
        cover: "/assets/books/book1.png",
        price: 189000,
        quantity: 1,
      },
      {
        bookId: "salt-and-sea",
        title: "Salt & Sea",
        cover: "/assets/books/book2.png",
        price: 145000,
        quantity: 2,
      },
    ],
    subtotal: 479000,
    shippingFee: SHIPPING_FEE,
    total: 504000,
    shippingAddress: addresses[0],
  },
  {
    id: "RD-1046",
    placedAt: "2026-08-02T14:05:00.000Z",
    status: OrderStatus.Processing,
    items: [
      {
        bookId: "orbital-decay",
        title: "Orbital Decay",
        cover: "/assets/books/book13.png",
        price: 225000,
        quantity: 1,
      },
      {
        bookId: "the-art-of-stillness",
        title: "The Art of Stillness",
        cover: "/assets/books/book17.png",
        price: 219000,
        quantity: 1,
      },
    ],
    subtotal: 444000,
    shippingFee: SHIPPING_FEE,
    total: 469000,
    shippingAddress: addresses[0],
  },
  {
    id: "RD-1045",
    placedAt: "2026-07-28T11:42:00.000Z",
    status: OrderStatus.Shipped,
    items: [
      {
        bookId: "the-last-library",
        title: "The Last Library",
        cover: "/assets/books/book14.png",
        price: 175000,
        quantity: 2,
      },
      {
        bookId: "voices-in-velvet",
        title: "Voices in Velvet",
        cover: "/assets/books/book16.png",
        price: 99000,
        quantity: 1,
      },
    ],
    subtotal: 449000,
    shippingFee: SHIPPING_FEE,
    total: 474000,
    shippingAddress: addresses[0],
  },
  {
    id: "RD-1044",
    placedAt: "2026-07-15T16:30:00.000Z",
    status: OrderStatus.Delivered,
    items: [
      {
        bookId: "silent-clockmaker",
        title: "The Silent Clockmaker",
        cover: "/assets/books/book11.png",
        price: 155000,
        quantity: 1,
      },
      {
        bookId: "midnight-on-cedar-lane",
        title: "Midnight on Cedar Lane",
        cover: "/assets/books/book4.png",
        price: 139000,
        quantity: 1,
      },
      {
        bookId: "small-hours",
        title: "Small Hours",
        cover: "/assets/books/book8.png",
        price: 89000,
        quantity: 1,
      },
    ],
    subtotal: 383000,
    shippingFee: SHIPPING_FEE,
    total: 408000,
    shippingAddress: addresses[1],
  },
  {
    id: "RD-1043",
    placedAt: "2026-07-01T10:12:00.000Z",
    status: OrderStatus.Cancelled,
    items: [
      {
        bookId: "atlas-of-broken-stars",
        title: "Atlas of Broken Stars",
        cover: "/assets/books/book13.png",
        price: 229000,
        quantity: 1,
      },
      {
        bookId: "weight-of-wings",
        title: "The Weight of Wings",
        cover: "/assets/books/book7.png",
        price: 209000,
        quantity: 1,
      },
    ],
    subtotal: 438000,
    shippingFee: SHIPPING_FEE,
    total: 463000,
    shippingAddress: addresses[0],
  },
];
