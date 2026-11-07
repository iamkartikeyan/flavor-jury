/**
 * Flavor Jury — core domain types
 * The Bio-Adaptive Sensory Augmentation Engine
 */

export type View =
  | "landing"
  | "onboarding"
  | "dashboard"
  | "deliberation"
  | "verdict"
  | "visualizer"
  | "logs"
  | "settings";

/* ── Medical domain ─────────────────────────────────────── */

export type RestrictionId =
  | "sodium"
  | "sugar"
  | "gluten"
  | "dairy"
  | "nuts"
  | "potassium"
  | "phosphorus"
  | "fodmap";

export type ConditionId =
  | "hypertension"
  | "diabetes"
  | "dysgeusia"
  | "kidney"
  | "celiac"
  | "lactose"
  | "nut_allergy"
  | "low_fodmap"
  | "custom";

export interface Condition {
  id: ConditionId;
  label: string;
  short: string;
  detail: string;
  restricts: RestrictionId[];
  severity: "critical" | "high" | "moderate";
  icon: string; // lucide icon name key
}

export type TasteAxis = "umami" | "sweet" | "sour" | "bitter" | "salty" | "trigeminal";

/* ── User ───────────────────────────────────────────────── */

export type SpiceLevel = "mild" | "medium" | "hot" | "extra_hot";

export interface UserProfile {
  name: string;
  age: number | null;
  gender: "male" | "female" | "other" | "";
  email: string;
  conditions: ConditionId[];
  customCondition: string;
  cuisines: string[];
  spice: SpiceLevel;
  textures: string[];
  pantry: string[];
  medications: string[];
  allergies: string[];
  createdAt: string;
}

/* ── Engine output ──────────────────────────────────────── */

export interface CompoundUse {
  id: string;
  name: string;
  source: string;
  quantity: string;
  fn: string;
  receptor: TasteAxis;
  evapTemp: number;
  accent: "bio" | "amber" | "violet" | "lime" | "ember";
}

export interface OverrideRecord {
  id: string;
  stepIndex: number;
  method: string;            // e.g. "Boil"
  originalTemp: number;
  newTemp: number;
  originalTime: number;
  newTime: number;
  compound: string;          // compound preserved
  evapTemp: number;
  reason: string;
}

export interface RecipeStep {
  id: string;
  text: string;
  temp?: number;
  timeMin?: number;
  override?: OverrideRecord;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: string;
  note?: string;
  kind: "base" | "molecular" | "swapped";
}

export interface RadarData {
  axes: TasteAxis[];
  original: number[];    // 0..100 — what the dish would taste like unrestricted
  augmented: number[];   // 0..100 — what it tastes like with substitutes
}

export interface SafetyCheck {
  label: string;
  pass: boolean;
  note: string;
}

export interface SafetyReport {
  sodiumMg: number;
  addedSugarG: number;
  potassiumMg: number;
  checks: SafetyCheck[];
}

export interface Substitution {
  missing: string;
  alternatives: { name: string; quantity: string }[];
  scoreImpact: number; // negative delta on illusion score
}

export interface Deliberation {
  id: string;
  number: number;          // DELIBERATION #2847
  dish: string;
  cuisine: string;
  servings: number;
  flexible: boolean;
  createdAt: string;       // ISO
  score: number;           // sensory illusion score 0..100
  trigeminalIndex: number; // 0..100
  dopamineIndex: number;   // 0..100
  constraints: ConditionId[];
  strategyLabel: string;   // e.g. "Umami-Led Salt Illusion"
  compounds: CompoundUse[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  radar: RadarData;
  overrides: OverrideRecord[];
  safety: SafetyReport;
  substitutions: Substitution[];
  apiLog: string[];
  warnings?: string[];
  feedback?: { rating: number; helpful: boolean | null };
}

export interface DayStat {
  date: string;        // YYYY-MM-DD
  compliance: number;  // 0..100
  score: number;       // illusion score that day (or last)
  overrides: number;
  trigeminal: number;
  gustatory: number;
}

/* ── Settings ───────────────────────────────────────────── */

export interface AppSettings {
  emailNotifications: boolean;
  recipeReminders: "daily" | "weekly" | "never";
  healthTips: boolean;
  flavorDbKey: string;
  recipeDbKey: string;
  cocktailDbKey: string;
}
