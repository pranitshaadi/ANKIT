// ============================================================
// WEDDING CONFIGURATION — Edit this file to customise the invite
// Then run: node apply-config.js
// ============================================================

module.exports = {

  // ── Couple ──────────────────────────────────────────────
  // nameOrder: "name1_weds_name2" → Name1 weds Name2
  //            "name2_weds_name1" → Name2 weds Name1
  nameOrder: "name1_weds_name2",
  name1: "ANKIT",
  name2: "PRITI",
  name1Display: "Ankit",
  name2Display: "Priti",

  // ── Mantra ──────────────────────────────────────────────
  mantra: "ॐ श्री गणेशाय नम",

  // ── Invite text ─────────────────────────────────────────
  joinUsText: "You to join us in the wedding celebrations of",

  // ── Couple's message ────────────────────────────────────
  couplesMessage: "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness.We are looking forward to see you at the wedding.",

  // ── Groom's family ──────────────────────────────────────
  groomBlessingOf: "With the blessings of ",
  groomGrandparents: "Chain Sasmal & Late Babaji Sasmal",
  groomRelation: "Son of",
  groomParents: "Mrs. Mamata Sasmal & Mr. Ashok Sasmal",

  // ── Bride's family ──────────────────────────────────────
  brideGrandparents: "Late Shakuntala Devi & Late Tribeni Prasad Gupta",
  brideRelation: "Daughter of",
  brideParents: "Mrs. Pritilaxmi Gupta & Mr. Om Prakash Gupta",

  // ── Events (6 cards) ────────────────────────────────────
  events: [
    { event: "Mehendi",       date: "Friday, 4th Dec 2026",    venue: "Sasmal Residence, Brahmana Sahi, Kataka",   time: "3pm Onwards",  mapsLink: "https://maps.app.goo.gl/nztDZypZiyZP76Kq7" },
    { event: "Sangeet",       date: "Friday, 4th Dec 2026",    venue: "PritiPrakash Niwas, Khannagar, Kataka",     time: "5pm Onwards",  mapsLink: "https://maps.app.goo.gl/nztDZypZiyZP76Kq7" },
    { event: "Haldi",         date: "Saturday, 5th Dec 2026",  venue: "Sasmal Residence, Brahmana Sahi, Kataka",   time: "11am Onwards", mapsLink: "https://maps.app.goo.gl/nztDZypZiyZP76Kq7" },
    { event: "Mangana Handi", date: "Sunday, 6th Dec 2026",    venue: "Sasmal Residence, Brahmana Sahi, Kataka",   time: "3pm Onwards",  mapsLink: "https://maps.app.goo.gl/nztDZypZiyZP76Kq7" },
    { event: "Baarat",        date: "Sunday, 6th Dec 2026",    venue: "Creative Convention, Balikuda, Kataka",     time: "7pm Onwards",  mapsLink: "https://maps.app.goo.gl/tbCjbczNkigvtUYG8" },
    { event: "Reception",     date: "Wednesday, 9th Dec 2026", venue: "Gandarpur Ground, Baranga, Kataka",         time: "7pm Onwards",  mapsLink: "https://maps.app.goo.gl/tbCjbczNkigvtUYG8" },
  ],

  // ── Countdown date (ISO 8601 UTC) ────────────────────────
  countdownDate: "2026-12-06T07:00:00.000Z",

  // ── Links ────────────────────────────────────────────────
  whatsappRsvpLink: "https://wa.me/918093969525",
  mapsCtaLink: "https://www.google.com/maps/place/Das+gadia+mini+stadium/@20.3843891,85.8560771,110m/data=!3m1!1e3!4m6!3m5!1s0x3a190d9d527b205b:0x90876bbc086aae85!8m2!3d20.3843891!4d85.8563757!16s%2Fg%2F11srtvzpml?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D",
  instagramCtaLink: "",

  // ── Music ────────────────────────────────────────────────
  musicUrl: "assets/media/background_music_mono.mp3",

  // ── Event card back-face content ─────────────────────────
  // Keys must match the event name shown on the card front.
  eventHours: 3,
  eventCardBack: {
    "Mehendi":        { title: "Mehendi Ceremony",     lines: ["Music, dance & henna hands", "Dress Code: Colourful Traditional", "Snacks served"] },
    "Sangeet":        { title: "Sangeet Night",        lines: ["Music, dance & celebrations", "Dress Code: Golden / Colourful Traditional", "Dinner follows"] },
    "Haldi":          { title: "Haldi Ceremony",       lines: ["Wear yellow & have fun!", "Dress Code: Yellow / Pastels", "Lunch & refreshments"] },
    "Mangana Handi":  { title: "Mangana Handi",        lines: ["A Odia tradition to get blessings of Gram Devati", "Dress Code: Traditional", "Breakfast served & Lunch follows"] },
    "Baarat":         { title: "The Wedding",           lines: ["Pheras at the auspicious muhurat", "Dress Code: Traditional / Ethnic", "Dinner follows"] },
    "Reception":      { title: "The Reception",         lines: ["Cocktail hour & dinner", "Dress Code: Formal / Semi-Formal", "Dancing & celebrations"] },
  },
};
