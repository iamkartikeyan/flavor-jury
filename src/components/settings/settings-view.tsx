"use client";

/**
 * Settings — the biological profile control room.
 * Personal info, medical profile, kitchen inventory, notifications,
 * API keys and data ownership.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Eye, EyeOff, KeyRound, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useJury } from "@/lib/store";
import { CONDITIONS } from "@/lib/engine/compounds";
import { cn } from "@/lib/utils";
import type { ConditionId } from "@/lib/types";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "medical", label: "Medical Profile" },
  { id: "inventory", label: "Kitchen" },
  { id: "notifications", label: "Notifications" },
  { id: "api", label: "API Keys" },
  { id: "data", label: "Data & Privacy" },
];

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-bio/10 bg-ink-3 p-6 md:p-7">
      <h2 className="font-display text-2xl text-cream">{title}</h2>
      <p className="mt-1.5 text-[13px] text-bone">{sub}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="caption text-dim">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-line bg-ink-2 px-4 py-3 text-[14px] text-cream outline-none transition-colors placeholder:text-dim/60 focus:border-bio/50"
      />
    </label>
  );
}

export default function SettingsView() {
  const profile = useJury((s) => s.profile);
  const settings = useJury((s) => s.settings);
  const settingsTab = useJury((s) => s.settingsTab);
  const openSettings = useJury((s) => s.openSettings);
  const saveProfile = useJury((s) => s.saveProfile);
  const updateSettings = useJury((s) => s.updateSettings);
  const resetAll = useJury((s) => s.resetAll);
  const deliberations = useJury((s) => s.deliberations);

  const [tab, setTab] = useState(settingsTab);
  /* render-time adjustment: follow external navigation into a specific tab */
  const [lastExternal, setLastExternal] = useState(settingsTab);
  if (settingsTab !== lastExternal) {
    setLastExternal(settingsTab);
    setTab(settingsTab);
  }

  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [meds, setMeds] = useState((profile?.medications ?? []).join(", "));
  const [allergies, setAllergies] = useState((profile?.allergies ?? []).join(", "));
  const [pantry, setPantry] = useState<string[]>(profile?.pantry ?? []);
  const [pantryDraft, setPantryDraft] = useState("");
  const [conditions, setConditions] = useState<ConditionId[]>(profile?.conditions ?? []);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const persistBase = (extra?: Partial<typeof profile & { conditions: ConditionId[]; pantry: string[] }>) => {
    if (!profile) return;
    saveProfile({
      ...profile,
      name: name.trim() || profile.name,
      email: email.trim() || profile.email,
      medications: meds.split(",").map((m) => m.trim()).filter(Boolean),
      allergies: allergies.split(",").map((a) => a.trim()).filter(Boolean),
      ...extra,
    });
    toast.success("Profile updated — the Jury has been informed.");
  };

  const exportData = () => {
    const payload = { profile, settings, deliberations, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flavor-jury-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full biological history exported.");
  };

  const maskKey = (k: string) => (revealed[k] ? k : `${k.slice(0, 9)}${"•".repeat(10)}`);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 lg:px-10 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="caption text-bio">SETTINGS</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-cream md:text-5xl">Your control room<span className="text-bio">.</span></h1>
      </motion.div>

      <div className="caption mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Settings sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setTab(t.id); openSettings(t.id); }}
            className={cn(
              "rounded-full border px-4 py-2 text-[11px] transition-all",
              tab === t.id ? "border-bio/60 bg-bio/10 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 space-y-5">
        {tab === "personal" && (
          <>
            <Section title="Personal information" sub="How the Jury addresses you and where verdicts are sent.">
              <div className="mb-6 flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-bio to-lime font-display text-xl font-bold text-ink">
                  {(profile?.name ?? "FJ").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="text-[13px] text-dim">
                  Avatar is generated from your initials.<br />Upload coming post-MVP.
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="FULL NAME" value={name} onChange={setName} />
                <Field label="EMAIL" value={email} onChange={setEmail} type="email" />
                <Field label="NEW PASSWORD" value="" onChange={() => {}} placeholder="••••••••" type="password" />
                <Field label="CONFIRM PASSWORD" value="" onChange={() => {}} placeholder="••••••••" type="password" />
              </div>
              <button onClick={() => persistBase()} className="mt-6 flex items-center gap-2 rounded-full bg-bio px-6 py-2.5 text-[13.5px] font-semibold text-ink transition-all hover:shadow-[0_10px_26px_-10px_rgba(14,122,82,0.5)]">
                <Save className="h-4 w-4" /> Save changes
              </button>
            </Section>
          </>
        )}

        {tab === "medical" && (
          <>
            <Section title="Medical profile" sub="These constraints are hard safety boundaries in every deliberation.">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CONDITIONS.map((c) => {
                  const active = conditions.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setConditions((cs) => (cs.includes(c.id) ? cs.filter((x) => x !== c.id) : [...cs, c.id]))}
                      className={cn(
                        "rounded-2xl border p-3.5 text-left transition-all",
                        active ? "border-bio/60 bg-bio/10" : "border-line bg-ink-2 hover:border-bio/30"
                      )}
                    >
                      <span className={cn("block text-[13.5px] font-medium", active ? "text-bio" : "text-cream")}>{c.label}</span>
                      <span className="caption mt-0.5 block text-[8.5px] text-dim">{c.short}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="MEDICATIONS (COMMA SEPARATED)" value={meds} onChange={setMeds} placeholder="Amlodipine, Metformin…" />
                <Field label="ALLERGIES (COMMA SEPARATED)" value={allergies} onChange={setAllergies} placeholder="Penicillin, Shellfish…" />
              </div>
              <button onClick={() => persistBase({ conditions })} className="mt-6 flex items-center gap-2 rounded-full bg-bio px-6 py-2.5 text-[13.5px] font-semibold text-ink transition-all hover:shadow-[0_10px_26px_-10px_rgba(14,122,82,0.5)]">
                <Save className="h-4 w-4" /> Update constraints
              </button>
            </Section>
          </>
        )}

        {tab === "inventory" && (
          <Section title="Kitchen inventory" sub="Molecular substitutes are sourced from these nodes first.">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-ink-2 px-4 focus-within:border-bio/50">
              <input
                value={pantryDraft}
                onChange={(e) => setPantryDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pantryDraft.trim()) {
                    setPantry((p) => (p.includes(pantryDraft.trim()) ? p : [...p, pantryDraft.trim()]));
                    setPantryDraft("");
                  }
                }}
                placeholder="add a staple and press Enter…"
                className="w-full bg-transparent py-3 text-[14px] text-cream outline-none placeholder:text-dim/60"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {pantry.map((p) => (
                <span key={p} className="flex items-center gap-1.5 rounded-full border border-bio/40 bg-bio/10 px-3 py-1.5 text-[12.5px] text-cream">
                  {p}
                  <button onClick={() => setPantry(pantry.filter((x) => x !== p))} aria-label={`remove ${p}`} className="text-dim hover:text-rose">×</button>
                </span>
              ))}
              {pantry.length === 0 && <span className="text-[13px] text-dim">No staples yet — add what you always keep around.</span>}
            </div>
            <button onClick={() => persistBase({ pantry })} className="mt-6 flex items-center gap-2 rounded-full bg-bio px-6 py-2.5 text-[13.5px] font-semibold text-ink transition-all hover:shadow-[0_10px_26px_-10px_rgba(14,122,82,0.5)]">
              <Save className="h-4 w-4" /> Save inventory
            </button>
          </Section>
        )}

        {tab === "notifications" && (
          <Section title="Notifications" sub="How often the Jury whispers in your ear.">
            <div className="space-y-4">
              {[
                { key: "emailNotifications" as const, label: "Email notifications", sub: "verdict summaries and weekly reports" },
                { key: "healthTips" as const, label: "Health tips", sub: "small sensory-science notes, twice a week" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between rounded-2xl border border-line bg-ink-2 px-5 py-4">
                  <div>
                    <div className="text-[14px] text-cream">{n.label}</div>
                    <div className="text-[12px] text-dim">{n.sub}</div>
                  </div>
                  <Switch checked={settings[n.key]} onCheckedChange={(v) => updateSettings({ [n.key]: v })} aria-label={n.label} />
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl border border-line bg-ink-2 px-5 py-4">
                <div>
                  <div className="text-[14px] text-cream">Recipe reminders</div>
                  <div className="text-[12px] text-dim">when to cook what</div>
                </div>
                <div className="flex gap-2">
                  {(["daily", "weekly", "never"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => updateSettings({ recipeReminders: r })}
                      className={cn(
                        "rounded-lg border px-3.5 py-2 text-[12.5px] capitalize transition-all",
                        settings.recipeReminders === r ? "border-bio/60 bg-bio/10 text-bio" : "border-line text-bone hover:border-bio/30"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {tab === "api" && (
          <Section title="API keys" sub="For advanced users wiring the engine into their own stack.">
            <div className="space-y-3">
              {([
                ["flavorDbKey", "FlavorDB — volatile compound mapping"],
                ["recipeDbKey", "RecipeDB — culinary instruction graph"],
                ["cocktailDbKey", "CocktailDB — beverage pairing (optional)"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3 rounded-2xl border border-line bg-ink-2 px-4 py-3">
                  <KeyRound className="h-4.5 w-4.5 shrink-0 text-dim" />
                  <div className="min-w-0 flex-1">
                    <div className="caption text-[8.5px] text-dim">{label}</div>
                    <div className="truncate font-mono text-[13px] text-cream">{maskKey(key)}</div>
                  </div>
                  <button
                    onClick={() => setRevealed((r) => ({ ...r, [key]: !r[key] }))}
                    aria-label="toggle key visibility"
                    className="rounded-lg p-2 text-dim transition-colors hover:text-cream"
                  >
                    {revealed[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(settings[key]); toast.success("Key copied."); }}
                    aria-label="copy key"
                    className="rounded-lg p-2 text-dim transition-colors hover:text-bio"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="caption mt-4 text-[8.5px] text-dim">keys are demo credentials minted for the ForkIT prototype</p>
          </Section>
        )}

        {tab === "data" && (
          <>
            <Section title="Data & privacy" sub="Your biology belongs to you. Take it anywhere.">
              <div className="flex flex-wrap gap-3">
                <button onClick={exportData} className="flex items-center gap-2 rounded-full border border-bio/30 bg-bio/10 px-6 py-3 text-[13.5px] font-medium text-bio transition-colors hover:bg-bio/15">
                  <Download className="h-4 w-4" /> Export all data (JSON)
                </button>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toast.info("Privacy policy — this prototype stores everything locally in your browser. Nothing leaves this device."); }}
                  className="flex items-center rounded-full border border-line px-6 py-3 text-[13.5px] text-cream transition-colors hover:border-bio/40"
                >
                  Privacy policy
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toast.info("Terms — the Jury is a prototype, not a medical device."); }}
                  className="flex items-center rounded-full border border-line px-6 py-3 text-[13.5px] text-cream transition-colors hover:border-bio/40"
                >
                  Terms of service
                </a>
              </div>
            </Section>

            <section className="rounded-3xl border border-rose/30 bg-rose/5 p-6 md:p-7">
              <h2 className="flex items-center gap-2.5 font-display text-2xl text-rose"><Trash2 className="h-5 w-5" /> Danger zone</h2>
              <p className="mt-1.5 text-[13px] text-bone">
                Deleting your account wipes the profile, every deliberation and all thermal logs from this device.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="mt-5 rounded-full border border-rose/50 px-6 py-2.5 text-[13.5px] font-medium text-rose transition-colors hover:bg-rose/10">
                    Delete account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-rose/30 bg-ink-2">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-cream">Dissolve the Jury?</AlertDialogTitle>
                    <AlertDialogDescription className="text-bone">
                      This permanently removes your biological profile and all {deliberations.length} deliberations. There is no undo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-line bg-transparent text-bone hover:bg-ink-3 hover:text-cream">Keep my profile</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-rose text-ink hover:bg-rose/85"
                      onClick={() => { resetAll(); toast.success("Account dissolved. The Jury adjourns."); }}
                    >
                      Delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
}
