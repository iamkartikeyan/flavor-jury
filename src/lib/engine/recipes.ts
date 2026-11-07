/**
 * RecipeDB simulation — dish archetypes + base protocols.
 *
 * Each archetype is a molecular blueprint: base ingredients, the classic
 * (unrestricted) protocol with its thermal profile, and the sensory target
 * the Jury must rebuild. The deliberation engine rewrites these protocols
 * thermodynamically per user constraints.
 */

import type { RecipeStep } from "@/lib/types";

export interface Archetype {
  id: string;
  title: string;               // enhanced dish name used in the verdict
  keywords: string[];          // lowercase matchers
  cuisine: string;
  base: { ing: string; qty: string }[];   // ingredient ids from FlavorDB
  steps: { text: string; temp?: number; timeMin?: number }[];
  mimic: ("salt" | "sweet")[]; // which restricted tastes the dish leans on
  finish: string;              // plating / sensory finishing note
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "tomato_bisque",
    title: "Neuro-Augmented Tomato Bisque",
    keywords: ["tomato soup", "tomato bisque", "creamy tomato", "tomato"],
    cuisine: "French",
    base: [
      { ing: "tomato", qty: "800 g (ripe, roasted)" },
      { ing: "onion", qty: "1 large, sliced" },
      { ing: "garlic", qty: "4 cloves" },
      { ing: "olive_oil", qty: "2 tbsp" },
      { ing: "cream", qty: "120 ml" },
      { ing: "cornstarch", qty: "1 tsp (optional body)" },
    ],
    steps: [
      { text: "Char the tomatoes under a hot grill until skins blister — charred glutamates are the depth of this bisque.", temp: 220, timeMin: 12 },
      { text: "Sweat onion and garlic in olive oil over a medium flame until translucent and sweet.", temp: 140, timeMin: 6 },
      { text: "Add roasted tomatoes and simmer the base so the flavours marry.", temp: 120, timeMin: 10 },
      { text: "Blend until silk-smooth, then pass through a fine sieve for a bisque texture." },
      { text: "Stir in cream off the heat; mount until glossy." },
    ],
    mimic: ["salt"],
    finish: "Finish with a crack of pepper and cold-pressed olive oil beadwork.",
  },
  {
    id: "butter_chicken",
    title: "Trigeminal Butter Chicken (Zero-Sodium Makhani)",
    keywords: ["butter chicken", "murgh makhani", "tikka masala", "chicken curry", "makhani"],
    cuisine: "Indian",
    base: [
      { ing: "chicken", qty: "500 g, thigh, cubed" },
      { ing: "yogurt", qty: "120 g (marinade)" },
      { ing: "ghee", qty: "2 tbsp" },
      { ing: "tomato", qty: "500 g puree" },
      { ing: "cashew", qty: "40 g, ground" },
      { ing: "garam_masala", qty: "1½ tsp" },
      { ing: "ginger", qty: "20 g" },
      { ing: "garlic", qty: "5 cloves" },
      { ing: "cream", qty: "80 ml" },
      { ing: "fenugreek", qty: "1 tsp kasuri methi" },
    ],
    steps: [
      { text: "Marinate chicken in yogurt, ginger and garlic for 30 minutes — lactic acid tenderises without salt." },
      { text: "Sear the marinated chicken in ghee until edges char.", temp: 230, timeMin: 8 },
      { text: "Bloom garam masala and ginger-garlic in the same pan until fragrant.", temp: 160, timeMin: 3 },
      { text: "Add tomato puree and cashew cream; boil hard to break the rawness.", temp: 110, timeMin: 10 },
      { text: "Crush kasuri methi over the pot, finish with cream, rest 5 minutes." },
    ],
    mimic: ["salt"],
    finish: "Serve with charred naan-points for crunchy trigeminal contrast.",
  },
  {
    id: "chocolate_mousse",
    title: "Aroma-Illusion Chocolate Mousse (0g Sugar)",
    keywords: ["chocolate mousse", "chocolate pudding", "chocolate dessert", "mousse", "chocolate"],
    cuisine: "French",
    base: [
      { ing: "egg", qty: "3, separated" },
      { ing: "cream", qty: "200 ml" },
      { ing: "sugar", qty: "60 g (classic)" },
      { ing: "vanilla", qty: "½ bean" },
      { ing: "cinnamon", qty: "1 small stick" },
      { ing: "strawberry", qty: "3, for garnish" },
    ],
    steps: [
      { text: "Melt the chocolate base gently in a bain-marie — never above body-warm.", temp: 65, timeMin: 4 },
      { text: "Whip yolks with the classic sweetener blend until pale and ribbony." },
      { text: "Fold whipped cream and whipped whites in thirds, keeping the foam alive." },
      { text: "Bloom cinnamon and vanilla in the warm base to release benzaldehyde." },
      { text: "Chill the mousse to set for at least 4 hours.", temp: 4, timeMin: 240 },
    ],
    mimic: ["sweet"],
    finish: "Crown with furaneol-rich strawberry petals dusted in cocoa.",
  },
  {
    id: "dal_tadka",
    title: "Umami-Stacked Dal Tadka",
    keywords: ["dal", "daal", "lentil soup", "tadka", "lentils"],
    cuisine: "Indian",
    base: [
      { ing: "lentils", qty: "200 g toor dal" },
      { ing: "turmeric", qty: "½ tsp" },
      { ing: "ghee", qty: "1½ tbsp" },
      { ing: "cumin", qty: "1 tsp" },
      { ing: "garlic", qty: "4 cloves" },
      { ing: "onion", qty: "1, fine diced" },
      { ing: "tomato", qty: "1, diced" },
      { ing: "dried_mushrooms", qty: "10 g, ground (secret umami)" },
      { ing: "garam_masala", qty: "1 tsp" },
    ],
    steps: [
      { text: "Pressure-cook dal with turmeric until it collapses into silk." },
      { text: "For the tadka, bloom cumin in ghee until they dance.", temp: 180, timeMin: 2 },
      { text: "Add onion, garlic, tomato; fry until the edges caramelise.", temp: 170, timeMin: 8 },
      { text: "Whisk the tadka into the dal and let the pot murmur till combined.", temp: 105, timeMin: 10 },
      { text: "Kill the heat, fold through mushroom powder and garam masala." },
    ],
    mimic: ["salt"],
    finish: "Finish with lemon squeeze — citric acid lifts the umami 2×.",
  },
  {
    id: "biryani",
    title: "Aroma-Layered Hyderabadi Biryani",
    keywords: ["biryani", "pulao", "pilaf", "biryani rice"],
    cuisine: "Indian",
    base: [
      { ing: "rice", qty: "300 g aged basmati" },
      { ing: "chicken", qty: "450 g" },
      { ing: "yogurt", qty: "150 g" },
      { ing: "onion", qty: "2, fried crisp" },
      { ing: "ghee", qty: "3 tbsp" },
      { ing: "cardamom", qty: "5 pods" },
      { ing: "bay_leaf", qty: "2" },
      { ing: "mint", qty: "handful" },
      { ing: "saffron_note", qty: "pinch (optional)" },
    ],
    steps: [
      { text: "Fry onions in ghee to deep bronze birista; reserve half.", temp: 165, timeMin: 12 },
      { text: "Marinate chicken in yogurt, birista and whole spices for 1 hour." },
      { text: "Parboil rice with whole spices until 70% done.", temp: 100, timeMin: 6 },
      { text: "Layer marinated chicken and rice in a heavy pot; seal with dough." },
      { text: "Dum-cook sealed on the lowest flame so steam perfumes every grain.", temp: 95, timeMin: 35 },
    ],
    mimic: ["salt"],
    finish: "Open at the table — the aroma burst IS the first course.",
  },
  {
    id: "pasta_margherita",
    title: "Glutamate-Lifted Margherita Pasta",
    keywords: ["pasta", "margherita", "pizza", "spaghetti", "alfredo", "pesto", "marinara"],
    cuisine: "Italian",
    base: [
      { ing: "wheat_flour", qty: "200 g pasta (classic)" },
      { ing: "tomato", qty: "400 g san marzano" },
      { ing: "garlic", qty: "3 cloves" },
      { ing: "olive_oil", qty: "3 tbsp" },
      { ing: "basil", qty: "15 leaves" },
      { ing: "parmesan", qty: "40 g, grated" },
    ],
    steps: [
      { text: "Confit the garlic in olive oil until blonde and mellow.", temp: 120, timeMin: 8 },
      { text: "Crush tomatoes by hand; simmer hard to reduce and concentrate glutamates.", temp: 115, timeMin: 12 },
      { text: "Boil the pasta one minute shy of al dente.", temp: 100, timeMin: 8 },
      { text: "Toss pasta in the sauce with starchy pasta water to emulsify." },
      { text: "Kill the flame; shower in parmesan and torn basil off-heat." },
    ],
    mimic: ["salt"],
    finish: "Basil raw, cheese off-heat — volatile aromatics never touch the flame.",
  },
  {
    id: "pancakes",
    title: "Aroma-Stacked Morning Pancakes",
    keywords: ["pancake", "french toast", "waffle", "crepe", "pancakes"],
    cuisine: "American",
    base: [
      { ing: "wheat_flour", qty: "180 g" },
      { ing: "milk", qty: "240 ml" },
      { ing: "egg", qty: "1" },
      { ing: "sugar", qty: "2 tbsp (classic)" },
      { ing: "butter", qty: "30 g" },
      { ing: "vanilla", qty: "1 tsp" },
    ],
    steps: [
      { text: "Whisk wet ingredients; rest the batter 10 minutes for gluten relaxation." },
      { text: "Ladle onto a buttered pan and bake until bubbles set the surface.", temp: 190, timeMin: 3 },
      { text: "Flip once; cook till golden.", temp: 180, timeMin: 2 },
      { text: "Warm the classic syrup with a strip of citrus peel.", temp: 85, timeMin: 3 },
    ],
    mimic: ["sweet"],
    finish: "Stack, then perfume with orange zest at the table.",
  },
  {
    id: "smoothie",
    title: "Sweet-Illusion Sunrise Smoothie",
    keywords: ["smoothie", "lassi", "shake", "juice"],
    cuisine: "Modern",
    base: [
      { ing: "mango", qty: "150 g frozen" },
      { ing: "banana", qty: "1 (classic)" },
      { ing: "yogurt", qty: "120 g" },
      { ing: "mint", qty: "6 leaves" },
      { ing: "strawberry", qty: "50 g" },
    ],
    steps: [
      { text: "Blend fruit and yogurt until completely smooth." },
      { text: "Flash-blend with mint last — menthol volatiles survive seconds, not minutes." },
      { text: "Serve immediately in a chilled glass; cold slows aroma loss.", temp: 6, timeMin: 1 },
    ],
    mimic: ["sweet"],
    finish: "No sugar needed — ethyl butyrate does the talking.",
  },
  {
    id: "salad_bowl",
    title: "Crunch-Engineered Power Bowl",
    keywords: ["salad", "poke bowl", "buddha bowl", "bowl", "quinoa bowl"],
    cuisine: "Mediterranean",
    base: [
      { ing: "chickpea", qty: "200 g, roasted" },
      { ing: "spinach", qty: "100 g" },
      { ing: "tomato", qty: "150 g" },
      { ing: "olive_oil", qty: "2 tbsp" },
      { ing: "lemon", qty: "1, juiced" },
      { ing: "seaweed", qty: "5 g, crumbled" },
    ],
    steps: [
      { text: "Roast chickpeas until they detonate with crunch.", temp: 200, timeMin: 22 },
      { text: "Whisk lemon and olive oil into a citric vinaigrette." },
      { text: "Massage spinach 30 seconds — bruising releases glutamate." },
      { text: "Assemble in layers; seaweed crumble last to stay crisp.", temp: 90, timeMin: 1 },
    ],
    mimic: ["salt"],
    finish: "Audible crunch is a trigeminal event — texture is seasoning here.",
  },
  {
    id: "grilled_fish",
    title: "Volatiles-First Grilled Fish",
    keywords: ["grilled fish", "salmon", "baked fish", "pan seared fish", "fish"],
    cuisine: "Mediterranean",
    base: [
      { ing: "fish", qty: "2 fillets, 150 g each" },
      { ing: "lemon", qty: "1" },
      { ing: "olive_oil", qty: "1 tbsp" },
      { ing: "rosemary", qty: "1 sprig" },
      { ing: "black_pepper", qty: "1 tsp, cracked" },
    ],
    steps: [
      { text: "Rub fish with oil; rest 10 minutes with rosemary laid on top." },
      { text: "Sear skin-side down in a ripping hot pan until crisp.", temp: 210, timeMin: 4 },
      { text: "Flip, then lower to finish gently till just opaque.", temp: 90, timeMin: 5 },
      { text: "Rest the fillets; warmth redistributes, aromas settle." },
    ],
    mimic: ["salt"],
    finish: "Lemon squeezed at the table so citric volatiles hit fresh.",
  },
  {
    id: "khichdi",
    title: "One-Pot Comfort Khichdi",
    keywords: ["khichdi", "kitchari", "kichdi"],
    cuisine: "Indian",
    base: [
      { ing: "rice", qty: "150 g" },
      { ing: "lentils", qty: "100 g moong dal" },
      { ing: "ghee", qty: "2 tbsp" },
      { ing: "cumin", qty: "1 tsp" },
      { ing: "ginger", qty: "15 g" },
      { ing: "turmeric", qty: "½ tsp" },
      { ing: "peas", qty: "80 g" },
    ],
    steps: [
      { text: "Sizzle cumin in ghee until fragrant.", temp: 175, timeMin: 2 },
      { text: "Add rice, dal, turmeric and 4× water by volume.", },
      { text: "Simmer covered till the grains surrender into porridge.", temp: 98, timeMin: 25 },
      { text: "Fold in peas and ginger in the last 5 minutes." },
    ],
    mimic: ["salt"],
    finish: "A spoon of ghee pooled on top — fat carries aroma retronasally.",
  },
  {
    id: "veg_stirfry",
    title: "Wok-Breath Veg Stir-Fry",
    keywords: ["stir fry", "stir-fry", "fried rice", "noodles", "hakka", "chow mein", "fried"],
    cuisine: "Chinese",
    base: [
      { ing: "rice", qty: "250 g cooked (day-old)" },
      { ing: "garlic", qty: "4 cloves" },
      { ing: "ginger", qty: "15 g" },
      { ing: "soy_sauce", qty: "2 tbsp (classic)" },
      { ing: "peas", qty: "80 g" },
      { ing: "egg", qty: "2" },
      { ing: "olive_oil", qty: "2 tbsp (high-smoke alternative)" },
    ],
    steps: [
      { text: "Scramble eggs till just set; remove." },
      { text: "Blast garlic and ginger in oil till fragrant — 20 seconds only.", temp: 200, timeMin: 1 },
      { text: "Add rice, toss hard for wok-breath char.", temp: 190, timeMin: 4 },
      { text: "Return egg, splash the classic seasoning, toss to coat.", temp: 120, timeMin: 2 },
    ],
    mimic: ["salt"],
    finish: "Charred edges = pyrazines = the 'restaurant taste' without sodium.",
  },
];

/* Fallback generic protocol — used when no archetype matches */
export function genericArchetype(dish: string, cuisine: string): Archetype {
  return {
    id: "generic",
    title: `Re-Engineered ${dish.replace(/\b\w/g, (c) => c.toUpperCase())}`,
    keywords: [],
    cuisine: cuisine || "Fusion",
    base: [
      { ing: "olive_oil", qty: "2 tbsp" },
      { ing: "garlic", qty: "3 cloves" },
      { ing: "onion", qty: "1, diced" },
      { ing: "tomato", qty: "200 g or seasonal base" },
      { ing: "dried_mushrooms", qty: "8 g, ground" },
      { ing: "lemon", qty: "½, juiced" },
      { ing: "black_pepper", qty: "1 tsp, cracked" },
    ],
    steps: [
      { text: `Build the aromatic base — sweat onion and garlic until translucent.`, temp: 140, timeMin: 6 },
      { text: `Add your main components for “${dish}” and colour them properly.`, temp: 200, timeMin: 10 },
      { text: `Deglaze with tomato and a splash of water; braise to combine.`, temp: 110, timeMin: 12 },
      { text: `Off-heat, fold in mushroom powder, lemon and cracked pepper.` },
    ],
    mimic: ["salt"],
    finish: "Taste, then adjust the acid — brightness is the low-sodium volume knob.",
  };
}

export function matchArchetype(dish: string): Archetype {
  const d = dish.toLowerCase();
  let best: Archetype | null = null;
  let bestScore = 0;
  for (const a of ARCHETYPES) {
    for (const k of a.keywords) {
      if (d.includes(k) && k.length > bestScore) {
        best = a;
        bestScore = k.length;
      }
    }
  }
  return best ?? genericArchetype(dish.trim() || "Signature Bowl", "");
}

/* RecipeDB API call strings used in logs / processing overlay */
export function recipeApiCalls(dish: string): string[] {
  const q = encodeURIComponent(dish.toLowerCase().slice(0, 42));
  return [
    `GET /api/recipes/search?q=${q}`,
    `POST /api/instructions/modify → thermodynamic rewrite`,
  ];
}
