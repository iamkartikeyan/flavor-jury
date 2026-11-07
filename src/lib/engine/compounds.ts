/**
 * FlavorDB simulation — volatile compound mapping + ingredient safety graph.
 *
 * Every compound lists the receptor class it stimulates, its approximate
 * volatilisation threshold (the temperature above which the molecule
 * evaporates/degrades and stops reaching the olfactory bulb), and the
 * ingredients that carry it in meaningful quantity.
 *
 * The safety graph flags every ingredient that carries a restricted
 * substance — this is the guardrail that makes the Jury refuse dangerous
 * substitutions (e.g. Kala Namak for a hypertensive patient).
 */

import type { Condition, RestrictionId, TasteAxis } from "@/lib/types";

/* ── Conditions ─────────────────────────────────────────── */

export const CONDITIONS: Condition[] = [
  {
    id: "hypertension",
    label: "Hypertension (High Blood Pressure)",
    short: "No Sodium",
    detail: "Sodium restricted to <1,500 mg/day. Salt is replaced by umami-citric illusion.",
    restricts: ["sodium"],
    severity: "critical",
    icon: "heart-pulse",
  },
  {
    id: "diabetes",
    label: "Diabetes (Type 1 / Type 2)",
    short: "No Sugar · Low Glycemic",
    detail: "Added sugar and high-glycemic load restricted. Sweetness rebuilt from aroma esters.",
    restricts: ["sugar"],
    severity: "critical",
    icon: "activity",
  },
  {
    id: "dysgeusia",
    label: "Dysgeusia (Taste Loss)",
    short: "Chemo / Aging / Neurological",
    detail: "Gustatory signal faded. We route flavor through trigeminal + olfactory channels.",
    restricts: [],
    severity: "high",
    icon: "zap",
  },
  {
    id: "kidney",
    label: "Kidney Disease",
    short: "Low Potassium · Low Phosphorus",
    detail: "Potassium <2,000 mg, phosphorus <800 mg. High-K produce is swapped, never assumed.",
    restricts: ["potassium", "phosphorus"],
    severity: "critical",
    icon: "droplets",
  },
  {
    id: "celiac",
    label: "Celiac Disease",
    short: "Gluten-Free",
    detail: "Zero gluten tolerance. Thickening and binding re-engineered grain-free.",
    restricts: ["gluten"],
    severity: "critical",
    icon: "wheat-off",
  },
  {
    id: "lactose",
    label: "Lactose Intolerance",
    short: "Dairy-Free",
    detail: "Lactose excluded. Creaminess restored via fat chemistry, not dairy.",
    restricts: ["dairy"],
    severity: "moderate",
    icon: "milk-off",
  },
  {
    id: "nut_allergy",
    label: "Nut Allergy",
    short: "No Nuts",
    detail: "Anaphylaxis risk — hard-blocked at engine level, never suggested.",
    restricts: ["nuts"],
    severity: "critical",
    icon: "shield-alert",
  },
  {
    id: "low_fodmap",
    label: "Low-FODMAP",
    short: "Gut-Safe",
    detail: "Fermentable oligosaccharides limited; allium load controlled.",
    restricts: ["fodmap"],
    severity: "moderate",
    icon: "leaf",
  },
  {
    id: "custom",
    label: "Custom Condition",
    short: "User-defined",
    detail: "Describe your restriction; the Jury applies conservative defaults.",
    restricts: [],
    severity: "moderate",
    icon: "plus-circle",
  },
];

export const RESTRICTION_LABEL: Record<RestrictionId, string> = {
  sodium: "Sodium",
  sugar: "Added Sugar",
  gluten: "Gluten",
  dairy: "Dairy",
  nuts: "Nuts",
  potassium: "Potassium",
  phosphorus: "Phosphorus",
  fodmap: "FODMAP",
};

/* ── Compounds (FlavorDB) ───────────────────────────────── */

export interface CompoundDef {
  id: string;
  name: string;
  receptor: TasteAxis;
  evapTemp: number; // °C — above this the volatile is lost before it reaches the nose
  fn: string;       // human-readable function
  accent: "bio" | "amber" | "violet" | "lime" | "ember";
  sources: string[]; // ingredient ids
}

export const COMPOUNDS: CompoundDef[] = [
  { id: "glutamate",  name: "Glutamates",        receptor: "umami",  evapTemp: 150, fn: "Primary umami receptor (T1R1/T1R3) activation — the backbone of savory depth",        accent: "bio",    sources: ["tomato", "shiitake", "parmesan", "miso", "seaweed", "nutritional_yeast", "peas", "green_tea"] },
  { id: "guanylate",  name: "Guanylates",        receptor: "umami",  evapTemp: 100, fn: "Umami amplifier — synergises with glutamates for up to 8× receptor response",         accent: "bio",    sources: ["shiitake_powder", "dried_mushrooms", "seaweed"] },
  { id: "kokumi",     name: "γ-Glutamyl Peptides", receptor: "umami", evapTemp: 155, fn: "Kokumi sensation — rounds mouthfeel, makes low-salt broths taste 'complete'",          accent: "bio",    sources: ["garlic", "onion", "yeast_extract"] },
  { id: "citric",     name: "Citric Acid",       receptor: "sour",   evapTemp: 175, fn: "Sour receptor trigger; brightens and mimics salt-perception enhancement",              accent: "lime",   sources: ["lemon", "lime", "amchur", "tamarind"] },
  { id: "malic",      name: "Malic Acid",        receptor: "sour",   evapTemp: 160, fn: "Green-apple sourness; extends saliva flow, carrying aroma retronasally",              accent: "lime",   sources: ["apple", "tamarind", "rhubarb"] },
  { id: "acetic",     name: "Acetic Acid",       receptor: "sour",   evapTemp: 118, fn: "Sharp vinegar lift — cuts fat perception and amplifies salt illusion",                 accent: "lime",   sources: ["vinegar", "pickles", "tamarind"] },
  { id: "maltol",     name: "Maltol",            receptor: "sweet",  evapTemp: 98,  fn: "Cotton-candy sweetness aroma — fires sweet receptors without any glycemic load",       accent: "amber",  sources: ["malted_bean", "roasted_grain", "caramel_note"] },
  { id: "furaneol",   name: "Furaneol",          receptor: "sweet",  evapTemp: 92,  fn: "Strawberry-caramel volatile — illusion of dessert richness from zero sugar",           accent: "amber",  sources: ["strawberry", "date_extract_note", "roasted_grain"] },
  { id: "vanillin",   name: "Vanillin",          receptor: "sweet",  evapTemp: 170, fn: "Sweet aroma anchor; brain pairs vanilla scent with calorie-safety signal",             accent: "amber",  sources: ["vanilla", "cinnamon"] },
  { id: "ethyl_butyrate", name: "Ethyl Butyrate", receptor: "sweet", evapTemp: 121, fn: "Fruity ester (pineapple/mango) — top-note sweetness for the olfactory bulb",           accent: "amber",  sources: ["orange", "mango", "pineapple"] },
  { id: "benzaldehyde", name: "Benzaldehyde",   receptor: "sweet",  evapTemp: 179, fn: "Almond-cherry aroma — Marzipan illusion without nut or sugar load",                    accent: "amber",  sources: ["cinnamon", "vanilla"] },
  { id: "rotundone",  name: "Rotundone",         receptor: "trigeminal", evapTemp: 185, fn: "Peppery warmth — trigeminal spark that fakes 'seasoned' intensity",               accent: "violet", sources: ["black_pepper", "basil", "rosemary"] },
  { id: "capsaicin",  name: "Capsaicin",         receptor: "trigeminal", evapTemp: 180, fn: "TRPV1 heat channel ignition — pain-glow that replaces lost taste intensity",     accent: "violet", sources: ["chili", "cayenne", "paprika"] },
  { id: "piperine",   name: "Piperine",          receptor: "trigeminal", evapTemp: 190, fn: "Sharp trailing heat; extends salivation and aroma carry",                        accent: "violet", sources: ["black_pepper"] },
  { id: "gingerol",   name: "Gingerol",          receptor: "trigeminal", evapTemp: 170, fn: "Warming tingle — keeps mid-palate engaged through long dishes",                  accent: "violet", sources: ["ginger"] },
  { id: "menthol",    name: "Menthol",           receptor: "trigeminal", evapTemp: 212, fn: "TRPM8 cool channel — fresh contrast that resets fatigued palates",              accent: "violet", sources: ["mint"] },
  { id: "eugenol",    name: "Eugenol",           receptor: "trigeminal", evapTemp: 254, fn: "Clove warmth — deep aromatic glow perceived as 'richness'",                     accent: "violet", sources: ["clove", "cinnamon", "basil"] },
  { id: "sotolon",    name: "Sotolon",           receptor: "sweet",  evapTemp: 102, fn: "Maple-fenugreek volatile — the scent signature of sweetness",                          accent: "amber",  sources: ["fenugreek", "roasted_grain"] },
];

export const COMPOUND_BY_ID = Object.fromEntries(COMPOUNDS.map((c) => [c.id, c]));

/* ── Ingredients (safety graph + compound carriers) ─────── */

export interface IngredientDef {
  id: string;
  name: string;
  aliases?: string[];
  carries: string[];          // compound ids
  restricted: RestrictionId[];// what it carries that may be forbidden
}

export const INGREDIENTS: IngredientDef[] = [
  // umami carriers
  { id: "tomato",             name: "Tomato",               carries: ["glutamate", "malic"], restricted: ["potassium"], aliases: ["tomatoes", "cherry tomato", "tomato puree"] },
  { id: "shiitake",           name: "Shiitake (fresh)",     carries: ["glutamate", "guanylate"], restricted: [], aliases: ["shiitake"] },
  { id: "shiitake_powder",    name: "Shiitake Powder",      carries: ["guanylate", "glutamate"], restricted: [], aliases: ["dried shiitake powder", "mushroom powder"] },
  { id: "dried_mushrooms",    name: "Dried Mushrooms",      carries: ["guanylate", "glutamate"], restricted: [], aliases: ["porcini", "dried porcini", "mixed mushrooms"] },
  { id: "parmesan",           name: "Parmesan (aged)",      carries: ["glutamate"], restricted: ["dairy", "sodium"], aliases: ["parmigiano", "parmesan cheese"] },
  { id: "miso",               name: "Miso",                 carries: ["glutamate", "kokumi"], restricted: ["sodium"], aliases: ["white miso", "chickpea miso"] },
  { id: "seaweed",            name: "Kombu / Seaweed",      carries: ["glutamate", "guanylate"], restricted: ["sodium", "potassium"], aliases: ["kombu", "nori", "wakame"] },
  { id: "nutritional_yeast",  name: "Nutritional Yeast",    carries: ["glutamate", "kokumi"], restricted: [], aliases: ["nooch"] },
  { id: "yeast_extract",      name: "Yeast Extract",        carries: ["kokumi", "glutamate"], restricted: ["sodium"], aliases: ["marmite"] },
  { id: "peas",               name: "Green Peas",           carries: ["glutamate"], restricted: [], aliases: ["pea", "matar"] },
  { id: "green_tea",          name: "Green Tea",            carries: ["glutamate"], restricted: [], aliases: ["matcha", "sencha"] },
  // sour carriers
  { id: "lemon",              name: "Lemon",                carries: ["citric"], restricted: [], aliases: ["lemon juice", "lemon zest"] },
  { id: "lime",               name: "Lime",                 carries: ["citric"], restricted: [], aliases: ["lime juice", "nimbu"] },
  { id: "amchur",             name: "Amchur (dried mango)", carries: ["citric", "malic"], restricted: [], aliases: ["amchoor", "dried mango powder"] },
  { id: "tamarind",           name: "Tamarind",             carries: ["citric", "malic", "acetic"], restricted: [], aliases: ["imli"] },
  { id: "vinegar",            name: "Rice / Apple Vinegar", carries: ["acetic"], restricted: [], aliases: ["vinegar", "apple cider vinegar"] },
  { id: "pickles",            name: "Pickled Vegetables",   carries: ["acetic"], restricted: ["sodium"], aliases: ["pickle", "achaar"] },
  { id: "apple",              name: "Apple (green)",        carries: ["malic"], restricted: ["sugar"], aliases: ["green apple"] },
  { id: "rhubarb",            name: "Rhubarb",              carries: ["malic"], restricted: [], aliases: [] },
  // sweet-illusion carriers
  { id: "vanilla",            name: "Vanilla Bean",         carries: ["vanillin", "benzaldehyde"], restricted: [], aliases: ["vanilla", "vanilla extract"] },
  { id: "cinnamon",           name: "Cinnamon",             carries: ["vanillin", "benzaldehyde", "eugenol"], restricted: [], aliases: ["dalchini", "cassia"] },
  { id: "clove",              name: "Clove",                carries: ["eugenol"], restricted: [], aliases: ["laung"] },
  { id: "orange",             name: "Orange (zest & juice)",carries: ["ethyl_butyrate", "citric"], restricted: ["sugar"], aliases: ["orange zest", "orange juice"] },
  { id: "mango",              name: "Mango",                carries: ["ethyl_butyrate"], restricted: ["sugar"], aliases: ["aam"] },
  { id: "pineapple",          name: "Pineapple",            carries: ["ethyl_butyrate"], restricted: ["sugar"], aliases: ["ananas"] },
  { id: "strawberry",         name: "Strawberry",           carries: ["furaneol"], restricted: ["sugar"], aliases: ["strawberries"] },
  { id: "date_extract_note",  name: "Date Fiber Extract",   carries: ["furaneol"], restricted: [], aliases: ["date fiber", "date note"] },
  { id: "fenugreek",          name: "Fenugreek (methi)",    carries: ["sotolon"], restricted: [], aliases: ["methi", "kasuri methi"] },
  { id: "malted_bean",        name: "Roasted Malt Notes",   carries: ["maltol"], restricted: ["gluten"], aliases: ["malt", "roasted barley"] },
  { id: "roasted_grain",      name: "Toasted Oats",         carries: ["maltol", "furaneol"], restricted: [], aliases: ["toasted oats", "oats", "granola"] },
  { id: "caramel_note",       name: "Caramelized Onion",    carries: ["maltol", "furaneol"], restricted: ["fodmap"], aliases: ["caramelised onion"] },
  // trigeminal carriers
  { id: "black_pepper",       name: "Black Pepper",         carries: ["rotundone", "piperine"], restricted: [], aliases: ["pepper", "kali mirch"] },
  { id: "chili",              name: "Chili",                carries: ["capsaicin"], restricted: [], aliases: ["chilli", "red chili", "mirchi"] },
  { id: "cayenne",            name: "Cayenne",              carries: ["capsaicin"], restricted: [], aliases: ["cayenne pepper"] },
  { id: "paprika",            name: "Smoked Paprika",       carries: ["capsaicin"], restricted: [], aliases: ["smoked paprika"] },
  { id: "ginger",             name: "Ginger",               carries: ["gingerol"], restricted: [], aliases: ["adrak", "fresh ginger"] },
  { id: "mint",               name: "Mint",                 carries: ["menthol"], restricted: [], aliases: ["pudina", "peppermint"] },
  { id: "basil",              name: "Basil",                carries: ["rotundone", "eugenol"], restricted: [], aliases: ["tulsi", "sweet basil"] },
  { id: "rosemary",           name: "Rosemary",             carries: ["rotundone"], restricted: [], aliases: [] },
  // kitchen base
  { id: "salt",               name: "Table Salt",           carries: [], restricted: ["sodium"], aliases: ["salt", "nacl"] },
  { id: "kala_namak",         name: "Kala Namak (black salt)", carries: [], restricted: ["sodium"], aliases: ["black salt", "kala namak"] },
  { id: "soy_sauce",          name: "Soy Sauce",            carries: ["glutamate"], restricted: ["sodium", "gluten"], aliases: ["soy", "shoyu"] },
  { id: "butter",             name: "Butter",               carries: [], restricted: ["dairy"], aliases: ["makhan"] },
  { id: "ghee",               name: "Ghee",                 carries: [], restricted: ["dairy"], aliases: ["clarified butter"] },
  { id: "cream",              name: "Heavy Cream",          carries: [], restricted: ["dairy"], aliases: ["cream", "double cream", "malai"] },
  { id: "milk",               name: "Milk",                 carries: [], restricted: ["dairy"], aliases: ["doodh", "whole milk"] },
  { id: "yogurt",             name: "Yogurt",               carries: [], restricted: ["dairy"], aliases: ["curd", "dahi", "greek yogurt"] },
  { id: "coconut_milk",       name: "Coconut Milk",         carries: [], restricted: [], aliases: ["coconut cream"] },
  { id: "cashew",             name: "Cashew",               carries: [], restricted: ["nuts"], aliases: ["cashews", "kaju"] },
  { id: "almond",             name: "Almond",               carries: [], restricted: ["nuts"], aliases: ["almonds", "badam"] },
  { id: "peanut",             name: "Peanut",               carries: [], restricted: ["nuts"], aliases: ["peanuts", "moongfali"] },
  { id: "olive_oil",          name: "Olive Oil",            carries: [], restricted: [], aliases: ["oil", "extra virgin olive oil"] },
  { id: "garlic",             name: "Garlic",               carries: ["kokumi"], restricted: ["fodmap"], aliases: ["lahsun"] },
  { id: "onion",              name: "Onion",                carries: ["kokumi"], restricted: ["fodmap"], aliases: ["pyaz", "shallots"] },
  { id: "honey",              name: "Honey",                carries: [], restricted: ["sugar"], aliases: ["shahad"] },
  { id: "jaggery",            name: "Jaggery",              carries: [], restricted: ["sugar"], aliases: ["gur"] },
  { id: "sugar",              name: "Sugar",                carries: [], restricted: ["sugar"], aliases: ["white sugar", "cane sugar", "cheeni"] },
  { id: "stevia",             name: "Stevia",               carries: [], restricted: [], aliases: ["stevia leaf"] },
  { id: "monk_fruit",         name: "Monk Fruit",           carries: [], restricted: [], aliases: ["monk fruit sweetener", "luo han guo"] },
  { id: "wheat_flour",        name: "Wheat Flour",          carries: [], restricted: ["gluten"], aliases: ["atta", "flour", "maida", "all purpose flour"] },
  { id: "rice",               name: "Rice",                 carries: [], restricted: [], aliases: ["chawal", "basmati", "jasmine rice"] },
  { id: "chickpea",           name: "Chickpea",             carries: ["glutamate"], restricted: ["fodmap"], aliases: ["chana", "garbanzo"] },
  { id: "lentils",            name: "Lentils",              carries: ["glutamate"], restricted: ["potassium"], aliases: ["dal", "moong", "masoor", "toor"] },
  { id: "chicken",            name: "Chicken",              carries: [], restricted: [], aliases: ["chicken breast", "chicken thigh"] },
  { id: "fish",               name: "Fish",                 carries: [], restricted: [], aliases: ["salmon", "cod", "tilapia"] },
  { id: "tofu",               name: "Tofu",                 carries: [], restricted: [], aliases: ["bean curd"] },
  { id: "potato",             name: "Potato",               carries: [], restricted: ["potassium"], aliases: ["potatoes", "aloo"] },
  { id: "banana",             name: "Banana",               carries: [], restricted: ["potassium"], aliases: ["kela"] },
  { id: "spinach",            name: "Spinach",              carries: ["glutamate"], restricted: ["potassium"], aliases: ["palak"] },
  { id: "oats",               name: "Oats",                 carries: [], restricted: [], aliases: ["rolled oats"] },
  { id: "cumin",              name: "Cumin",                carries: [], restricted: [], aliases: ["jeera"] },
  { id: "turmeric",           name: "Turmeric",             carries: [], restricted: [], aliases: ["haldi"] },
  { id: "garam_masala",       name: "Garam Masala",         carries: ["eugenol"], restricted: [], aliases: ["masala"] },
  { id: "bay_leaf",           name: "Bay Leaf",             carries: ["eugenol"], restricted: [], aliases: ["tejpatta"] },
  { id: "cardamom",           name: "Cardamom",             carries: [], restricted: [], aliases: ["elaichi"] },
  { id: "coconut",            name: "Coconut",              carries: [], restricted: [], aliases: ["nariyal"] },
  { id: "egg",                name: "Egg",                  carries: [], restricted: [], aliases: ["eggs", "anda"] },
  { id: "cornstarch",         name: "Cornstarch",           carries: [], restricted: [], aliases: ["corn flour", "arrowroot"] },
  { id: "aquafaba",           name: "Aquafaba",             carries: [], restricted: [], aliases: ["chickpea water"] },
  { id: "sunflower_seed_cream", name: "Sunflower Seed Cream", carries: [], restricted: [], aliases: ["sunflower cream", "seed cream"] },
  { id: "oat_cream",          name: "Oat Cream",            carries: [], restricted: [], aliases: ["oatly", "oat milk"] },
];

export const INGREDIENT_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

/* fuzzy ingredient lookup: by id, name or alias */
export function findIngredient(query: string): IngredientDef | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  for (const ing of INGREDIENTS) {
    if (ing.id === q || ing.name.toLowerCase() === q) return ing;
  }
  for (const ing of INGREDIENTS) {
    if (ing.aliases?.some((a) => a === q)) return ing;
  }
  for (const ing of INGREDIENTS) {
    if (
      ing.name.toLowerCase().includes(q) ||
      q.includes(ing.name.toLowerCase()) ||
      ing.aliases?.some((a) => a.includes(q) || q.includes(a))
    ) {
      return ing;
    }
  }
  return null;
}

/* Quick-add pantry grid */
export const PANTRY_STAPLES = [
  "Olive Oil", "Garlic", "Onion", "Ginger", "Lemon", "Black Pepper",
  "Cumin", "Turmeric", "Tomato", "Rice", "Chili", "Cinnamon",
  "Vanilla Bean", "Mint", "Cornstarch", "Salt",
];

export const SPICE_LEVELS = [
  { id: "mild", label: "Mild", note: "gentle warmth" },
  { id: "medium", label: "Medium", note: "a soft glow" },
  { id: "hot", label: "Hot", note: "trigeminal workout" },
  { id: "extra_hot", label: "Extra Hot", note: "full nerve fire" },
] as const;

export const CUISINE_OPTIONS = [
  "Indian", "Italian", "Mexican", "Chinese", "Japanese",
  "Thai", "Mediterranean", "Middle Eastern", "French", "American",
];

export const TEXTURE_OPTIONS = ["Crunchy", "Creamy", "Soft", "Crispy", "Silky", "Charred", "Juicy", "Flaky"];
