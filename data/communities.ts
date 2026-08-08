/**
 * SAMPLE DATA — everything here is invented for a look-and-feel prototype.
 * Builder names, community names, agent name, prices and incentives are fake.
 *
 * Shape notes for the eventual Sanity migration:
 *  - Every document has a stable `id` and a `slug`.
 *  - Fields are flat and primitive wherever possible (no nested objects for
 *    scalar data, no computed values). Ranges are stored as two numbers, not
 *    as a formatted string, so they stay filterable/sortable.
 *  - Cross-document references are by slug (`communitySlug`) rather than by
 *    nesting, so `incentives` can become its own Sanity document type with a
 *    reference field. Incentives churn constantly and need to be editable
 *    without touching the community record.
 *  - `floorPlans` stays nested on the community because plans are owned by the
 *    community and never queried on their own — that maps cleanly to a Sanity
 *    array-of-objects field.
 *  - Dates are ISO `YYYY-MM-DD` strings, not Date objects, so they serialize.
 */

export type County =
  | "Bergen"
  | "Burlington"
  | "Hunterdon"
  | "Middlesex"
  | "Monmouth"
  | "Morris"
  | "Ocean"
  | "Somerset"
  | "Union";

export type HomeType = "single-family" | "townhome" | "condo" | "55-plus";

export type CommunityStatus = "now-selling" | "coming-soon" | "final-phase";

/** Ordered soonest → furthest out. Order matters for quiz matching. */
export type MoveInWindow = "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months";

export type IncentiveKind =
  | "rate-buydown"
  | "closing-cost-credit"
  | "design-center-allowance"
  | "price-improvement"
  | "lot-premium-waived";

export type FloorPlanStatus = "available" | "quick-move-in" | "final-release" | "sold-out";

export interface FloorPlan {
  id: string;
  name: string;
  homeType: HomeType;
  squareFeet: number;
  beds: number;
  baths: number;
  garageSpaces: number;
  basePrice: number;
  status: FloorPlanStatus;
}

export interface Incentive {
  id: string;
  /** Reference → Community.slug */
  communitySlug: string;
  kind: IncentiveKind;
  headline: string;
  detail: string;
  /** Human-facing value chip, e.g. "$25,000" or "4.99%" */
  value: string;
  /** ISO date. Incentives change monthly — this drives the "expires" badge. */
  expiresOn: string;
  /** Editorial note from the agent. Set to "" when there's nothing to add. */
  insiderNote: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  builder: string;
  town: string;
  county: County;
  status: CommunityStatus;
  featured: boolean;

  /** One-line hook used on cards. Keep under ~90 characters. */
  hook: string;

  homeTypes: HomeType[];
  priceMin: number;
  priceMax: number;
  squareFeetMin: number;
  squareFeetMax: number;
  bedsMin: number;
  bedsMax: number;
  bathsMin: number;
  bathsMax: number;

  totalHomes: number;
  homesRemaining: number;
  moveInWindow: MoveInWindow;

  /** Placeholder image dimensions — no real asset yet. */
  heroImageWidth: number;
  heroImageHeight: number;
  heroImageAlt: string;

  areaOverview: string;
  schoolsNote: string;
  commuteNote: string;

  floorPlans: FloorPlan[];
}

export interface VideoPlaceholder {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationLabel: string;
  category: string;
}

/* ------------------------------------------------------------------ */
/* Label maps — keep display strings out of components                 */
/* ------------------------------------------------------------------ */

export const HOME_TYPE_LABELS: Record<HomeType, string> = {
  "single-family": "Single-family",
  townhome: "Townhome",
  condo: "Condo",
  "55-plus": "55+ / Active adult",
};

export const STATUS_LABELS: Record<CommunityStatus, string> = {
  "now-selling": "Now selling",
  "coming-soon": "Coming soon",
  "final-phase": "Final phase",
};

export const MOVE_IN_LABELS: Record<MoveInWindow, string> = {
  "0-3-months": "Within 3 months",
  "3-6-months": "3–6 months",
  "6-12-months": "6–12 months",
  "12-plus-months": "12+ months",
};

export const MOVE_IN_ORDER: MoveInWindow[] = [
  "0-3-months",
  "3-6-months",
  "6-12-months",
  "12-plus-months",
];

export const INCENTIVE_KIND_LABELS: Record<IncentiveKind, string> = {
  "rate-buydown": "Rate buydown",
  "closing-cost-credit": "Closing cost credit",
  "design-center-allowance": "Design center allowance",
  "price-improvement": "Price improvement",
  "lot-premium-waived": "Lot premium waived",
};

export const FLOOR_PLAN_STATUS_LABELS: Record<FloorPlanStatus, string> = {
  available: "Available",
  "quick-move-in": "Quick move-in",
  "final-release": "Final release",
  "sold-out": "Sold out",
};

/* ------------------------------------------------------------------ */
/* Communities                                                         */
/* ------------------------------------------------------------------ */

export const communities: Community[] = [
  {
    id: "com-001",
    slug: "hawthorne-reserve",
    name: "Hawthorne Reserve",
    builder: "Kestrel Home Group",
    town: "Marlboro Township",
    county: "Monmouth",
    status: "now-selling",
    featured: true,
    hook: "The only Marlboro community still releasing half-acre homesites.",
    homeTypes: ["single-family"],
    priceMin: 875000,
    priceMax: 1145000,
    squareFeetMin: 2650,
    squareFeetMax: 3980,
    bedsMin: 4,
    bedsMax: 5,
    bathsMin: 2.5,
    bathsMax: 4.5,
    totalHomes: 64,
    homesRemaining: 19,
    moveInWindow: "6-12-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Community entrance / model exterior",
    areaOverview:
      "Marlboro is the classic Monmouth County trade: you give up walkability and you get land, quiet, and a school district people move for. Hawthorne Reserve sits on the western edge of town, backing to preserved farmland that can't be built on — worth confirming the easement language in your contract, because it's the reason the rear lots carry a premium. Shopping is a ten-minute drive to Route 9, which is convenient and ugly in equal measure.",
    schoolsNote:
      "Marlboro Township district K–8, then Marlboro High School in the Freehold Regional district. Freehold Regional runs magnet programs by application, which is a real factor for families here and worth asking about before you pick a school year to close in.",
    commuteNote:
      "No train in town. Most commuters drive 15 minutes to the Hazlet or Aberdeen-Matawan stations for the North Jersey Coast Line, or use the Route 9 park-and-ride bus into Port Authority — roughly 75 minutes door to door on a good morning.",
    floorPlans: [
      {
        id: "fp-001-a",
        name: "The Ashford",
        homeType: "single-family",
        squareFeet: 2650,
        beds: 4,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 875000,
        status: "available",
      },
      {
        id: "fp-001-b",
        name: "The Brantley",
        homeType: "single-family",
        squareFeet: 3120,
        beds: 4,
        baths: 3.5,
        garageSpaces: 2,
        basePrice: 949000,
        status: "available",
      },
      {
        id: "fp-001-c",
        name: "The Corwin",
        homeType: "single-family",
        squareFeet: 3540,
        beds: 5,
        baths: 4,
        garageSpaces: 3,
        basePrice: 1025000,
        status: "quick-move-in",
      },
      {
        id: "fp-001-d",
        name: "The Delacroix",
        homeType: "single-family",
        squareFeet: 3980,
        beds: 5,
        baths: 4.5,
        garageSpaces: 3,
        basePrice: 1145000,
        status: "final-release",
      },
    ],
  },
  {
    id: "com-002",
    slug: "cobblers-run",
    name: "Cobbler's Run",
    builder: "Alder & Vine Communities",
    town: "Freehold Township",
    county: "Monmouth",
    status: "now-selling",
    featured: true,
    hook: "Townhomes with real two-car garages — rarer here than the brochures suggest.",
    homeTypes: ["townhome"],
    priceMin: 545000,
    priceMax: 689000,
    squareFeetMin: 1750,
    squareFeetMax: 2340,
    bedsMin: 3,
    bedsMax: 4,
    bathsMin: 2.5,
    bathsMax: 3.5,
    totalHomes: 118,
    homesRemaining: 41,
    moveInWindow: "3-6-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Townhome streetscape",
    areaOverview:
      "Freehold Township is the practical middle of Monmouth County — you are close to everything and precious about nothing. Cobbler's Run is tucked behind an existing neighborhood off Stonehurst Boulevard, which means the construction traffic ends when the last unit closes rather than continuing for another five years. The interior units are noticeably cheaper and, honestly, fine.",
    schoolsNote:
      "Freehold Township schools K–8, feeding into Freehold Township High School. The elementary assignment for this section of town has shifted twice in six years — get the current boundary map in writing rather than trusting the sales office.",
    commuteNote:
      "Route 9 and Route 33 both within five minutes. Academy bus service to New York from the Freehold Raceway Mall park-and-ride, about 80 minutes. Red Bank and its train station are 20 minutes east.",
    floorPlans: [
      {
        id: "fp-002-a",
        name: "The Larkin",
        homeType: "townhome",
        squareFeet: 1750,
        beds: 3,
        baths: 2.5,
        garageSpaces: 1,
        basePrice: 545000,
        status: "available",
      },
      {
        id: "fp-002-b",
        name: "The Merrow",
        homeType: "townhome",
        squareFeet: 1980,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 599000,
        status: "quick-move-in",
      },
      {
        id: "fp-002-c",
        name: "The Norwood",
        homeType: "townhome",
        squareFeet: 2340,
        beds: 4,
        baths: 3.5,
        garageSpaces: 2,
        basePrice: 689000,
        status: "available",
      },
    ],
  },
  {
    id: "com-003",
    slug: "the-sycamores-at-beacon-hill",
    name: "The Sycamores at Beacon Hill",
    builder: "Rothbury Residential",
    town: "Bridgewater Township",
    county: "Somerset",
    status: "now-selling",
    featured: true,
    hook: "Two product lines on one site — the townhomes price like a different town.",
    homeTypes: ["single-family", "townhome"],
    priceMin: 615000,
    priceMax: 1049000,
    squareFeetMin: 2050,
    squareFeetMax: 3620,
    bedsMin: 3,
    bedsMax: 5,
    bathsMin: 2.5,
    bathsMax: 4,
    totalHomes: 96,
    homesRemaining: 33,
    moveInWindow: "6-12-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Model home exterior, front elevation",
    areaOverview:
      "Bridgewater is the Somerset County default for a reason: corporate campuses, a good hospital, and a mall that people genuinely use. The Sycamores splits into a townhome section near the entrance and single-family homes on the wooded rise behind it. The rise is the whole point — ask which lots are actually on it, because the marketing map flattens the topography.",
    schoolsNote:
      "Bridgewater-Raritan Regional, one of the larger and better-regarded districts in the county. The intermediate-school model means students change buildings more often than in neighboring towns, which some families love and some don't.",
    commuteNote:
      "Raritan Valley Line from Bridgewater or Somerville, with a transfer at Newark Penn for New York — call it 75 to 90 minutes. Routes 22, 202-206 and I-287 all converge here, which is why the driving commute to the 78 corridor is genuinely quick.",
    floorPlans: [
      {
        id: "fp-003-a",
        name: "The Pemberly",
        homeType: "townhome",
        squareFeet: 2050,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 615000,
        status: "available",
      },
      {
        id: "fp-003-b",
        name: "The Quimby",
        homeType: "townhome",
        squareFeet: 2280,
        beds: 3,
        baths: 3,
        garageSpaces: 2,
        basePrice: 674000,
        status: "available",
      },
      {
        id: "fp-003-c",
        name: "The Rutherford",
        homeType: "single-family",
        squareFeet: 3140,
        beds: 4,
        baths: 3.5,
        garageSpaces: 2,
        basePrice: 899000,
        status: "quick-move-in",
      },
      {
        id: "fp-003-d",
        name: "The Sattersfield",
        homeType: "single-family",
        squareFeet: 3620,
        beds: 5,
        baths: 4,
        garageSpaces: 3,
        basePrice: 1049000,
        status: "available",
      },
    ],
  },
  {
    id: "com-004",
    slug: "lantern-ridge",
    name: "Lantern Ridge",
    builder: "Vantage & Co. Homes",
    town: "Toms River",
    county: "Ocean",
    status: "final-phase",
    featured: true,
    hook: "55+ with a finished clubhouse — you can see what you're buying today.",
    homeTypes: ["55-plus"],
    priceMin: 425000,
    priceMax: 589000,
    squareFeetMin: 1480,
    squareFeetMax: 2210,
    bedsMin: 2,
    bedsMax: 3,
    bathsMin: 2,
    bathsMax: 3,
    totalHomes: 212,
    homesRemaining: 14,
    moveInWindow: "0-3-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Clubhouse and amenity area",
    areaOverview:
      "Toms River has more active-adult inventory than anywhere else in the state, and most of it is a slide deck. Lantern Ridge is in its final phase, so the clubhouse, pool and pickleball courts are all built and running — you are buying a real place instead of a rendering. The tradeoff is that the fourteen remaining homes are the lots nobody picked first.",
    schoolsNote:
      "Age-restricted community — school assignment does not apply. Ocean County property taxes here run meaningfully lower than the Monmouth communities, which is most of the reason buyers move south.",
    commuteNote:
      "Garden State Parkway exit 82 is four minutes away. Seaside beaches in 20 minutes off-season, considerably more in July. Community Medical Center is a seven-minute drive, which matters to this buyer more than any commute.",
    floorPlans: [
      {
        id: "fp-004-a",
        name: "The Thistle",
        homeType: "55-plus",
        squareFeet: 1480,
        beds: 2,
        baths: 2,
        garageSpaces: 2,
        basePrice: 425000,
        status: "quick-move-in",
      },
      {
        id: "fp-004-b",
        name: "The Underwood",
        homeType: "55-plus",
        squareFeet: 1790,
        beds: 2,
        baths: 2,
        garageSpaces: 2,
        basePrice: 489000,
        status: "quick-move-in",
      },
      {
        id: "fp-004-c",
        name: "The Vesper",
        homeType: "55-plus",
        squareFeet: 2210,
        beds: 3,
        baths: 3,
        garageSpaces: 2,
        basePrice: 589000,
        status: "final-release",
      },
    ],
  },
  {
    id: "com-005",
    slug: "weatherly-commons",
    name: "Weatherly Commons",
    builder: "Marchetti Signature Homes",
    town: "Piscataway Township",
    county: "Middlesex",
    status: "now-selling",
    featured: false,
    hook: "Walkable to the campus shuttle — the rental math here is unusually good.",
    homeTypes: ["townhome", "condo"],
    priceMin: 465000,
    priceMax: 619000,
    squareFeetMin: 1240,
    squareFeetMax: 2080,
    bedsMin: 2,
    bedsMax: 3,
    bathsMin: 2,
    bathsMax: 2.5,
    totalHomes: 144,
    homesRemaining: 58,
    moveInWindow: "3-6-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Townhome and condo building exterior",
    areaOverview:
      "Piscataway is unglamorous and extremely well located. Weatherly Commons is the first new construction in this pocket in over a decade, and the condo building at the back is the only elevator product in the community — relevant if stairs are a factor now or later. HOA covers the exterior entirely, which is the actual selling point.",
    schoolsNote:
      "Piscataway Township district, single high school. Rutgers' Busch and Livingston campuses are minutes away, which shapes the character of the area more than the K–12 district does.",
    commuteNote:
      "Dunellen and Edison stations both about ten minutes. I-287 and Route 18 give you the whole central Jersey job corridor within a half hour. New Brunswick, and the train options there, is fifteen minutes south.",
    floorPlans: [
      {
        id: "fp-005-a",
        name: "The Wexley",
        homeType: "condo",
        squareFeet: 1240,
        beds: 2,
        baths: 2,
        garageSpaces: 1,
        basePrice: 465000,
        status: "available",
      },
      {
        id: "fp-005-b",
        name: "The Yardley",
        homeType: "townhome",
        squareFeet: 1720,
        beds: 3,
        baths: 2.5,
        garageSpaces: 1,
        basePrice: 549000,
        status: "available",
      },
      {
        id: "fp-005-c",
        name: "The Ainsworth",
        homeType: "townhome",
        squareFeet: 2080,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 619000,
        status: "quick-move-in",
      },
    ],
  },
  {
    id: "com-006",
    slug: "foxglove-crossing",
    name: "Foxglove Crossing",
    builder: "Kestrel Home Group",
    town: "Chester Township",
    county: "Morris",
    status: "coming-soon",
    featured: false,
    hook: "Pre-release pricing closes when the model opens — this is the window.",
    homeTypes: ["single-family"],
    priceMin: 1050000,
    priceMax: 1465000,
    squareFeetMin: 3200,
    squareFeetMax: 4650,
    bedsMin: 4,
    bedsMax: 6,
    bathsMin: 3.5,
    bathsMax: 5.5,
    totalHomes: 38,
    homesRemaining: 38,
    moveInWindow: "12-plus-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Site rendering / pre-construction elevation",
    areaOverview:
      "Chester is horse country that happens to be commutable, and Foxglove Crossing is a small 38-home release on a former nursery property. Nothing is built yet — you are buying a rendering and a lot number, which is exactly why the pre-release pricing exists. If you can tolerate an 18-month build, this is the best per-square-foot value in the western county right now.",
    schoolsNote:
      "Chester Township elementary and middle, then West Morris Mendham High School. Small graduating classes compared to the Monmouth and Middlesex options, which families here treat as a feature.",
    commuteNote:
      "This is a car commute. Route 206 to I-80 or I-78 depending on where you're headed. The Gladstone Branch at Peapack is about twenty minutes, and it is a long, scenic, slow ride into Manhattan — plan on two hours door to door.",
    floorPlans: [
      {
        id: "fp-006-a",
        name: "The Bellweather",
        homeType: "single-family",
        squareFeet: 3200,
        beds: 4,
        baths: 3.5,
        garageSpaces: 3,
        basePrice: 1050000,
        status: "available",
      },
      {
        id: "fp-006-b",
        name: "The Caraway",
        homeType: "single-family",
        squareFeet: 3880,
        beds: 5,
        baths: 4.5,
        garageSpaces: 3,
        basePrice: 1249000,
        status: "available",
      },
      {
        id: "fp-006-c",
        name: "The Dunmore",
        homeType: "single-family",
        squareFeet: 4650,
        beds: 6,
        baths: 5.5,
        garageSpaces: 3,
        basePrice: 1465000,
        status: "available",
      },
    ],
  },
  {
    id: "com-007",
    slug: "ellsworth-yard",
    name: "Ellsworth Yard",
    builder: "Dorset Urban Builders",
    town: "Rahway",
    county: "Union",
    status: "now-selling",
    featured: false,
    hook: "Six-minute walk to the platform — the cheapest new build on this train line.",
    homeTypes: ["condo"],
    priceMin: 389000,
    priceMax: 545000,
    squareFeetMin: 720,
    squareFeetMax: 1310,
    bedsMin: 1,
    bedsMax: 2,
    bathsMin: 1,
    bathsMax: 2,
    totalHomes: 86,
    homesRemaining: 29,
    moveInWindow: "0-3-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Mid-rise condo building exterior",
    areaOverview:
      "Rahway has been quietly rebuilding its downtown around the station for fifteen years, and Ellsworth Yard is the newest piece of it. Deeded parking is sold separately here — a detail buyers routinely miss until closing. Units facing the courtyard cost less and are dramatically quieter than the ones over the street.",
    schoolsNote:
      "Rahway Public Schools. Most buyers in this building are single professionals or couples without school-age children, and the pricing reflects transit access rather than district reputation.",
    commuteNote:
      "The reason to be here. Rahway station is on both the Northeast Corridor and the North Jersey Coast Line — 40 minutes to Penn Station New York, 25 to Newark, and one seat to Trenton. Airport is 15 minutes.",
    floorPlans: [
      {
        id: "fp-007-a",
        name: "Residence 1A",
        homeType: "condo",
        squareFeet: 720,
        beds: 1,
        baths: 1,
        garageSpaces: 0,
        basePrice: 389000,
        status: "quick-move-in",
      },
      {
        id: "fp-007-b",
        name: "Residence 2C",
        homeType: "condo",
        squareFeet: 1050,
        beds: 2,
        baths: 2,
        garageSpaces: 1,
        basePrice: 469000,
        status: "available",
      },
      {
        id: "fp-007-c",
        name: "Residence 3B Corner",
        homeType: "condo",
        squareFeet: 1310,
        beds: 2,
        baths: 2,
        garageSpaces: 1,
        basePrice: 545000,
        status: "final-release",
      },
    ],
  },
  {
    id: "com-008",
    slug: "cedar-and-main",
    name: "Cedar & Main",
    builder: "Alder & Vine Communities",
    town: "Moorestown",
    county: "Burlington",
    status: "now-selling",
    featured: false,
    hook: "South Jersey pricing with a Main Street you'd actually walk to.",
    homeTypes: ["townhome", "single-family"],
    priceMin: 495000,
    priceMax: 749000,
    squareFeetMin: 1820,
    squareFeetMax: 2900,
    bedsMin: 3,
    bedsMax: 4,
    bathsMin: 2.5,
    bathsMax: 3.5,
    totalHomes: 72,
    homesRemaining: 44,
    moveInWindow: "6-12-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Townhome row, front elevations",
    areaOverview:
      "Moorestown consistently lands on national 'best places to live' lists, which locals find funny and buyers find persuasive. Cedar & Main is a small infill project a few blocks off the actual Main Street. The single-family lots are compact — this is a walkable-town product, not a land play, and pricing it against Monmouth acreage is comparing two different purchases.",
    schoolsNote:
      "Moorestown Township Public Schools, a genuinely strong district and a large part of what you are paying for. Rutgers-Camden and several private options are within a reasonable drive.",
    commuteNote:
      "Philadelphia is 25 minutes over the Betsy Ross or Tacony-Palmyra bridges. PATCO from Haddonfield is about 20 minutes away for a rail option. New York is not a realistic daily commute from here and no one should tell you otherwise.",
    floorPlans: [
      {
        id: "fp-008-a",
        name: "The Everly",
        homeType: "townhome",
        squareFeet: 1820,
        beds: 3,
        baths: 2.5,
        garageSpaces: 1,
        basePrice: 495000,
        status: "available",
      },
      {
        id: "fp-008-b",
        name: "The Fairholm",
        homeType: "townhome",
        squareFeet: 2140,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 569000,
        status: "available",
      },
      {
        id: "fp-008-c",
        name: "The Grantley",
        homeType: "single-family",
        squareFeet: 2900,
        beds: 4,
        baths: 3.5,
        garageSpaces: 2,
        basePrice: 749000,
        status: "quick-move-in",
      },
    ],
  },
  {
    id: "com-009",
    slug: "quarry-bend",
    name: "Quarry Bend",
    builder: "Rothbury Residential",
    town: "Raritan Township",
    county: "Hunterdon",
    status: "now-selling",
    featured: false,
    hook: "Acre-plus lots under $900K — the last of them in this part of the county.",
    homeTypes: ["single-family"],
    priceMin: 690000,
    priceMax: 895000,
    squareFeetMin: 2400,
    squareFeetMax: 3450,
    bedsMin: 3,
    bedsMax: 5,
    bathsMin: 2.5,
    bathsMax: 4,
    totalHomes: 47,
    homesRemaining: 22,
    moveInWindow: "6-12-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Single-family model exterior on wooded lot",
    areaOverview:
      "Raritan Township wraps around Flemington, and Quarry Bend sits on the quiet northern side of it. Lots run just over an acre with mature tree lines left standing on the perimeter — get the tree preservation plan in writing, because 'existing vegetation to remain' is a phrase that has disappointed a lot of buyers. Well and septic on the outer lots, public utilities on the inner ring.",
    schoolsNote:
      "Flemington-Raritan Regional K–8, then Hunterdon Central Regional High School, which is large, well funded, and the main reason families choose this township over its neighbors.",
    commuteNote:
      "Route 202 to I-78 puts you in Bridgewater in 25 minutes and Newark in about an hour. There is no train. Buyers here are typically hybrid, remote, or commuting to the 78 corridor rather than into Manhattan.",
    floorPlans: [
      {
        id: "fp-009-a",
        name: "The Hollis",
        homeType: "single-family",
        squareFeet: 2400,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 690000,
        status: "available",
      },
      {
        id: "fp-009-b",
        name: "The Ivorie",
        homeType: "single-family",
        squareFeet: 2880,
        beds: 4,
        baths: 3,
        garageSpaces: 2,
        basePrice: 779000,
        status: "available",
      },
      {
        id: "fp-009-c",
        name: "The Jessamine",
        homeType: "single-family",
        squareFeet: 3450,
        beds: 5,
        baths: 4,
        garageSpaces: 3,
        basePrice: 895000,
        status: "final-release",
      },
    ],
  },
  {
    id: "com-010",
    slug: "saltmeadow-village",
    name: "Saltmeadow Village",
    builder: "Vantage & Co. Homes",
    town: "Barnegat Township",
    county: "Ocean",
    status: "now-selling",
    featured: false,
    hook: "Lowest entry price on this list, and the taxes are the real story.",
    homeTypes: ["55-plus", "single-family"],
    priceMin: 379000,
    priceMax: 519000,
    squareFeetMin: 1320,
    squareFeetMax: 2140,
    bedsMin: 2,
    bedsMax: 3,
    bathsMin: 2,
    bathsMax: 2.5,
    totalHomes: 165,
    homesRemaining: 71,
    moveInWindow: "3-6-months",
    heroImageWidth: 1600,
    heroImageHeight: 900,
    heroImageAlt: "Single-story model exterior",
    areaOverview:
      "Barnegat is about as far south as most buyers will go and still call it a commute. Saltmeadow Village mixes an age-restricted section with a smaller all-ages section — they share the amenity center but have separate HOA schedules, and the fee difference between them is not obvious from the sales sheet. Ask for both.",
    schoolsNote:
      "Barnegat Township schools serve the all-ages section. The 55+ section is age-restricted and exempt from school assignment. Property tax rates here are among the lowest of any community on this site.",
    commuteNote:
      "Parkway exit 67 is right there. Long Beach Island is a 20-minute drive off-season. Atlantic City is 45 minutes south; Toms River, with the nearest full hospital and big-box retail, is 25 minutes north.",
    floorPlans: [
      {
        id: "fp-010-a",
        name: "The Kestrel",
        homeType: "55-plus",
        squareFeet: 1320,
        beds: 2,
        baths: 2,
        garageSpaces: 1,
        basePrice: 379000,
        status: "quick-move-in",
      },
      {
        id: "fp-010-b",
        name: "The Linden",
        homeType: "55-plus",
        squareFeet: 1680,
        beds: 2,
        baths: 2,
        garageSpaces: 2,
        basePrice: 434000,
        status: "available",
      },
      {
        id: "fp-010-c",
        name: "The Mayfair",
        homeType: "single-family",
        squareFeet: 2140,
        beds: 3,
        baths: 2.5,
        garageSpaces: 2,
        basePrice: 519000,
        status: "available",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Incentives — separate collection, referenced by community slug      */
/* ------------------------------------------------------------------ */

export const incentives: Incentive[] = [
  {
    id: "inc-001",
    communitySlug: "hawthorne-reserve",
    kind: "rate-buydown",
    headline: "4.99% fixed for 30 years",
    detail:
      "Permanent buydown through the builder's affiliated lender on contracts signed before the deadline. Requires financing through the in-house lender.",
    value: "4.99%",
    expiresOn: "2026-09-30",
    insiderNote:
      "The rate is real, but the lender's origination fee is about half a point above market. Run both numbers before you commit.",
  },
  {
    id: "inc-002",
    communitySlug: "hawthorne-reserve",
    kind: "design-center-allowance",
    headline: "$25,000 design center allowance",
    detail: "Applies to structural and finish selections on the Corwin and Delacroix plans only.",
    value: "$25,000",
    expiresOn: "2026-08-31",
    insiderNote: "Structural options eat this fast. Prioritize anything you can't add later.",
  },
  {
    id: "inc-003",
    communitySlug: "cobblers-run",
    kind: "closing-cost-credit",
    headline: "$15,000 toward closing costs",
    detail: "Available on all quick move-in homes with a 45-day close.",
    value: "$15,000",
    expiresOn: "2026-09-15",
    insiderNote: "",
  },
  {
    id: "inc-004",
    communitySlug: "the-sycamores-at-beacon-hill",
    kind: "design-center-allowance",
    headline: "$20,000 design studio credit",
    detail: "Single-family plans only. Cannot be combined with the lot premium waiver.",
    value: "$20,000",
    expiresOn: "2026-10-15",
    insiderNote: "The townhome buyers get a smaller version of this — ask, it isn't advertised.",
  },
  {
    id: "inc-005",
    communitySlug: "the-sycamores-at-beacon-hill",
    kind: "lot-premium-waived",
    headline: "Lot premiums waived on remaining wooded homesites",
    detail: "Nine homesites in the rear section. Premiums ranged from $18,000 to $45,000.",
    value: "Up to $45,000",
    expiresOn: "2026-09-01",
    insiderNote: "This is the best value on the site right now and it will not last the month.",
  },
  {
    id: "inc-006",
    communitySlug: "lantern-ridge",
    kind: "price-improvement",
    headline: "Final-phase pricing reduced up to $32,000",
    detail: "Applies to the fourteen remaining homes. Reflected in listed pricing.",
    value: "$32,000",
    expiresOn: "2026-08-29",
    insiderNote: "Final-phase homes close fast. The two Underwood plans have been there longest.",
  },
  {
    id: "inc-007",
    communitySlug: "lantern-ridge",
    kind: "closing-cost-credit",
    headline: "$10,000 closing credit for cash buyers",
    detail: "No financing contingency required. Proof of funds at contract.",
    value: "$10,000",
    expiresOn: "2026-09-30",
    insiderNote: "",
  },
  {
    id: "inc-008",
    communitySlug: "weatherly-commons",
    kind: "rate-buydown",
    headline: "2-1 temporary rate buydown",
    detail: "Two points below market in year one, one point in year two, then the note rate.",
    value: "2-1 buydown",
    expiresOn: "2026-10-31",
    insiderNote:
      "Temporary buydowns look great on a payment sheet. Make sure you can carry the year-three payment.",
  },
  {
    id: "inc-009",
    communitySlug: "foxglove-crossing",
    kind: "price-improvement",
    headline: "Pre-release pricing — $40,000 below model-opening list",
    detail: "First twelve contracts only. Pricing increases when the model opens.",
    value: "$40,000",
    expiresOn: "2026-11-30",
    insiderNote: "Pre-release always carries build risk. Read the delivery-date language closely.",
  },
  {
    id: "inc-010",
    communitySlug: "ellsworth-yard",
    kind: "closing-cost-credit",
    headline: "One year of HOA fees paid",
    detail: "Approximately $4,800 value, credited at closing. Quick move-in residences only.",
    value: "~$4,800",
    expiresOn: "2026-09-12",
    insiderNote: "Parking is deeded separately here. Negotiate that instead if you can.",
  },
  {
    id: "inc-011",
    communitySlug: "cedar-and-main",
    kind: "design-center-allowance",
    headline: "$12,500 finish allowance",
    detail: "All plans. Applies to flooring, cabinetry and lighting packages.",
    value: "$12,500",
    expiresOn: "2026-10-01",
    insiderNote: "",
  },
  {
    id: "inc-012",
    communitySlug: "quarry-bend",
    kind: "rate-buydown",
    headline: "5.25% fixed, seller-paid",
    detail: "Permanent buydown on the three remaining final-release homesites.",
    value: "5.25%",
    expiresOn: "2026-09-20",
    insiderNote: "",
  },
  {
    id: "inc-013",
    communitySlug: "saltmeadow-village",
    kind: "closing-cost-credit",
    headline: "$8,000 closing cost credit",
    detail: "All-ages section only. The 55+ section runs a separate incentive.",
    value: "$8,000",
    expiresOn: "2026-08-25",
    insiderNote: "",
  },
  {
    id: "inc-014",
    communitySlug: "saltmeadow-village",
    kind: "design-center-allowance",
    headline: "$9,500 appliance and finish package",
    detail: "55+ section. Includes the upgraded appliance package at no cost.",
    value: "$9,500",
    expiresOn: "2026-10-10",
    insiderNote: "",
  },
];

/* ------------------------------------------------------------------ */
/* Video library — placeholders only, no real assets yet               */
/* ------------------------------------------------------------------ */

export const videoPlaceholders: VideoPlaceholder[] = [
  {
    id: "vid-001",
    slug: "walking-a-model-home",
    title: "What to look for walking a model home",
    description:
      "The eleven things in every model that are upgrades, and how to tell before you ask.",
    durationLabel: "8 min",
    category: "Buyer education",
  },
  {
    id: "vid-002",
    slug: "reading-a-builder-contract",
    title: "Reading a builder contract without a lawyer's help",
    description:
      "Delivery windows, change-order language, and the clauses that quietly favor the builder.",
    durationLabel: "12 min",
    category: "Contracts",
  },
  {
    id: "vid-003",
    slug: "monmouth-vs-ocean",
    title: "Monmouth vs. Ocean County: the real tax difference",
    description:
      "Same house, two counties, and the annual number that actually changes your budget.",
    durationLabel: "6 min",
    category: "Market",
  },
];

/* ------------------------------------------------------------------ */
/* Derived lookups — cheap enough to compute at module load            */
/* ------------------------------------------------------------------ */

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((community) => community.slug === slug);
}

export function getIncentivesForCommunity(slug: string): Incentive[] {
  return incentives.filter((incentive) => incentive.communitySlug === slug);
}

export function getFeaturedCommunities(): Community[] {
  return communities.filter((community) => community.featured);
}

/** Counties that actually have inventory, sorted, with counts for the quiz. */
export function getActiveCounties(): { county: County; count: number }[] {
  const counts = new Map<County, number>();
  for (const community of communities) {
    counts.set(community.county, (counts.get(community.county) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([county, count]) => ({ county, count }))
    .sort((a, b) => a.county.localeCompare(b.county));
}
