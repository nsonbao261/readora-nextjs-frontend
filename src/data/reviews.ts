import type { Review } from "@/types/review";

// Mock reviews keyed by book slug, shown on the `/book/[slug]` detail page.
// UI-only: submitted reviews are not persisted here. Books without an entry
// fall back to an "no reviews yet" empty state.
export const reviewsBySlug: Record<string, Review[]> = {
  "cartographers-daughter": [
    {
      id: "cd-r1",
      bookId: "cartographers-daughter",
      userName: "Minh Anh",
      rating: 5,
      date: "2026-02-14",
      content:
        "I read this in two sittings and barely slept between them. The map that draws itself is one of the most inventive conceits I've met in years — and it earns every page.",
    },
    {
      id: "cd-r2",
      bookId: "cartographers-daughter",
      userName: "Thao Nguyen",
      rating: 4,
      date: "2025-12-03",
      content:
        "Beautiful and strange. The grief underneath the adventure is what stays with you. The pacing sags a little in the middle, but the ending is worth it.",
    },
    {
      id: "cd-r3",
      bookId: "cartographers-daughter",
      userName: "David Tran",
      rating: 5,
      date: "2025-10-28",
      content:
        "Gave this to my daughter for her birthday and she finished it in a weekend. We've been arguing about the final chapter ever since. High praise.",
    },
    {
      id: "cd-r4",
      bookId: "cartographers-daughter",
      userName: "Linh Pham",
      rating: 4,
      date: "2026-04-19",
      content:
        "The world-building is immersive and the writing is quietly gorgeous. Would have given five stars if the side characters got a bit more room to breathe.",
    },
  ],
  "salt-and-sea": [
    {
      id: "ss-r1",
      bookId: "salt-and-sea",
      userName: "Hannah Cole",
      rating: 5,
      date: "2025-08-22",
      content:
        "A quiet book that hits like a wave. The two sisters felt so real I had to call my own. Marlow writes seawater and memory into the same sentence.",
    },
    {
      id: "ss-r2",
      bookId: "salt-and-sea",
      userName: "Marco Diaz",
      rating: 4,
      date: "2025-11-09",
      content:
        "Slow, but deliberately so. Every detail earns its place. The final chapter recontextualizes the whole novel — I went back and reread it immediately.",
    },
    {
      id: "ss-r3",
      bookId: "salt-and-sea",
      userName: "Elena R.",
      rating: 4,
      date: "2026-01-30",
      content:
        "Perfect book for a rainy evening. Not much plot, but it doesn't need one. It's about being seen by the people who knew you before.",
    },
  ],
  "glass-orchard": [
    {
      id: "go-r1",
      bookId: "glass-orchard",
      userName: "Priya Sharma",
      rating: 5,
      date: "2026-03-11",
      content:
        "Luminous is the only word for it. I've never read anything quite like the description of the trees blooming. Cole is doing something special here.",
    },
    {
      id: "go-r2",
      bookId: "glass-orchard",
      userName: "Sam Whitfield",
      rating: 4,
      date: "2026-02-02",
      content:
        "A fable with real teeth. The speculation subplot is a bit on the nose, but the central metaphor about regeneration is handled with real subtlety.",
    },
    {
      id: "go-r3",
      bookId: "glass-orchard",
      userName: "Ngoc Tram",
      rating: 5,
      date: "2026-04-27",
      content:
        "I've recommended this to everyone I know. It made me cry in a coffee shop. The ending is perfect and I will not spoil it.",
    },
  ],
  "midnight-on-cedar-lane": [
    {
      id: "mc-r1",
      bookId: "midnight-on-cedar-lane",
      userName: "Raj Patel",
      rating: 4,
      date: "2025-06-14",
      content:
        "Solid, old-fashioned mystery with a great lead in Mabel. Figured out part of it early, but the reveal about the neighbor still got me.",
    },
    {
      id: "mc-r2",
      bookId: "midnight-on-cedar-lane",
      userName: "Alicia Gomez",
      rating: 3,
      date: "2025-09-01",
      content:
        "Atmospheric and well-written, but it drags in the middle. The last fifty pages are genuinely excellent, though.",
    },
    {
      id: "mc-r3",
      bookId: "midnight-on-cedar-lane",
      userName: "Jonah Lee",
      rating: 4,
      date: "2025-12-20",
      content:
        "The best kind of cozy-adjacent thriller — warm characters, cold secrets. Okafor paces the reveals perfectly.",
    },
  ],
  "field-notes-from-nowhere": [
    {
      id: "fn-r1",
      bookId: "field-notes-from-nowhere",
      userName: "Dr. Mai Vo",
      rating: 5,
      date: "2026-07-05",
      content:
        "Lang writes science with a novelist's heart. I've been in the field for two decades and this is the first book that made me cry about my own work.",
    },
    {
      id: "fn-r2",
      bookId: "field-notes-from-nowhere",
      userName: "Oliver Chen",
      rating: 5,
      date: "2026-06-28",
      content:
        "Equal parts elegy and warning. Everyone who cares about the natural world should read this. The chapter on the songbirds is devastating.",
    },
    {
      id: "fn-r3",
      bookId: "field-notes-from-nowhere",
      userName: "Sofia B.",
      rating: 4,
      date: "2026-08-01",
      content:
        "Beautiful and important. Occasionally the science gets dense for a general reader, but the people at the center always pull it back to the heart.",
    },
  ],
  "study-in-starlight": [
    {
      id: "ss2-r1",
      bookId: "study-in-starlight",
      userName: "Kiran Malhotra",
      rating: 5,
      date: "2026-06-09",
      content:
        "Smart sci-fi that cares about people. The signal conceit is mind-bending, but it's the protagonist's arc that kept me turning pages at 2am.",
    },
    {
      id: "ss2-r2",
      bookId: "study-in-starlight",
      userName: "Tessa Nguyen",
      rating: 4,
      date: "2026-07-18",
      content:
        "Cerebral and elegant. Took me a chapter to find my footing, then I couldn't stop. Would love a sequel.",
    },
    {
      id: "ss2-r3",
      bookId: "study-in-starlight",
      userName: "Adam Brooks",
      rating: 4,
      date: "2026-08-10",
      content:
        "Hale balances the big ideas and the small human moments beautifully. The final reveal reframes everything — go back and reread the first chapter after.",
    },
  ],
  "weight-of-wings": [
    {
      id: "ww-r1",
      bookId: "weight-of-wings",
      userName: "Gina Rossi",
      rating: 5,
      date: "2026-03-03",
      content:
        "Sweeping, gorgeous, heartbreaking. Marchetti makes you feel the hunger of wanting something so badly. The Milan scenes are worth the price alone.",
    },
    {
      id: "ww-r2",
      bookId: "weight-of-wings",
      userName: "Peter Hall",
      rating: 4,
      date: "2026-02-20",
      content:
        "A big, warm historical novel in the best tradition. The grandmother is my favorite character. Wished the ending lingered a bit longer.",
    },
    {
      id: "ww-r3",
      bookId: "weight-of-wings",
      userName: "Huyen Dang",
      rating: 5,
      date: "2026-04-05",
      content:
        "I don't usually read historical fiction and I loved this. The voice is so immediate it feels contemporary. Passing it to my sister next.",
    },
  ],
  "letters-to-a-younger-self": [
    {
      id: "ly-r1",
      bookId: "letters-to-a-younger-self",
      userName: "Marcus Webb",
      rating: 4,
      date: "2025-11-17",
      content:
        "Sharp, funny, and surprisingly tender. Kwon's letter to his twenty-year-old self about money is the best essay I've read in a decade.",
    },
    {
      id: "ly-r2",
      bookId: "letters-to-a-younger-self",
      userName: "Renee Adams",
      rating: 5,
      date: "2026-01-09",
      content:
        "The kind of book that makes you want to write letters to your own past self. Devastating in the quietest possible way.",
    },
    {
      id: "ly-r3",
      bookId: "letters-to-a-younger-self",
      userName: "Thanh Binh",
      rating: 4,
      date: "2025-12-01",
      content:
        "Witty and wise. Some essays landed harder than others, but the ones that landed — they stayed. Great gift book.",
    },
  ],
  "orbital-decay": [
    {
      id: "od-r1",
      bookId: "orbital-decay",
      userName: "Jules Moreau",
      rating: 5,
      date: "2026-08-06",
      content:
        "Claustrophobic in the best way. I finished this holding my breath. Sarkis turns a single escape pod into one of the tensest set pieces I've read.",
    },
    {
      id: "od-r2",
      bookId: "orbital-decay",
      userName: "Nadia Kovac",
      rating: 5,
      date: "2026-08-14",
      content:
        "Relentless. The countdown structure is brutal and perfect. The crew dynamics are what make it — you'll flip between rooting for and fearing each one.",
    },
    {
      id: "od-r3",
      bookId: "orbital-decay",
      userName: "Ben Zhang",
      rating: 4,
      date: "2026-08-20",
      content:
        "A rocket-ride of a thriller. Loses a star only because the ending sets up a sequel I'm now desperately waiting for.",
    },
  ],
  "the-last-library": [
    {
      id: "ll-r1",
      bookId: "the-last-library",
      userName: "Ivy Summers",
      rating: 5,
      date: "2025-08-30",
      content:
        "As someone who works in a library, I sobbed. This is a love letter to books and the people who keep them alive. The night-opening library is pure magic.",
    },
    {
      id: "ll-r2",
      bookId: "the-last-library",
      userName: "Carlos Mendez",
      rating: 4,
      date: "2025-10-12",
      content:
        "Spellbinding world and a tender central friendship. A touch predictable in places, but I didn't care — I was too busy being moved.",
    },
    {
      id: "ll-r3",
      bookId: "the-last-library",
      userName: "Anh Vu",
      rating: 5,
      date: "2026-05-30",
      content:
        "The best fantasy I've read this year. Vane writes about memory and resistance without ever getting preachy. The last chapter is a masterpiece.",
    },
  ],
  "the-art-of-stillness": [
    {
      id: "as-r1",
      bookId: "the-art-of-stillness",
      userName: "Grace Osei",
      rating: 5,
      date: "2024-06-12",
      content:
        "This book changed how I structure my days. Practical, warm, and never preachy. Chisom backs every claim with real research.",
    },
    {
      id: "as-r2",
      bookId: "the-art-of-stillness",
      userName: "Daniel Reyes",
      rating: 4,
      date: "2023-11-25",
      content:
        "A much-needed counterargument to hustle culture. Some chapters repeat themselves, but the core message is genuinely life-altering.",
    },
    {
      id: "as-r3",
      bookId: "the-art-of-stillness",
      userName: "Minh Phuc",
      rating: 5,
      date: "2026-02-17",
      content:
        "I've bought four copies to give away. The chapter on the science of boredom alone is worth the price.",
    },
  ],
  "atlas-of-broken-stars": [
    {
      id: "ab-r1",
      bookId: "atlas-of-broken-stars",
      userName: "Rowan Ellis",
      rating: 5,
      date: "2026-02-08",
      content:
        "Epic in every sense — the scale, the grief, the hope. Alderman maps loss onto the cosmos and somehow makes it comforting. A masterpiece.",
    },
    {
      id: "ab-r2",
      bookId: "atlas-of-broken-stars",
      userName: "Sakura Ito",
      rating: 4,
      date: "2026-03-22",
      content:
        "Stunning prose and an unforgettable premise. The middle section meanders a little, but the final act is transcendent.",
    },
    {
      id: "ab-r3",
      bookId: "atlas-of-broken-stars",
      userName: "Tom Wright",
      rating: 5,
      date: "2026-06-15",
      content:
        "I picked it up for the spaceship cartography and stayed for the heart. Quinn Alderman is a name to watch.",
    },
  ],
};
