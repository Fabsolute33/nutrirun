import { ACTIVITY_MULTIPLIER } from "./constants";

export function calcBMR({ poids, taille, age, sexe }) {
  if (!poids || !taille || !age) return null;
  const base = 10 * Number(poids) + 6.25 * Number(taille) - 5 * Number(age);
  return sexe === "f" ? base - 161 : base + 5;
}

export function calcMaintenance(profil, kcalDepensees) {
  const bmr = calcBMR(profil);
  if (!bmr) return null;
  return Math.round(bmr * ACTIVITY_MULTIPLIER) + (Number(kcalDepensees) || 0);
}

export function toKey(d) {
  return d.toISOString().split("T")[0];
}

export function todayKey() {
  return toKey(new Date());
}

export function getWeekDays(ref = new Date()) {
  const day = ref.getDay();
  const mon = new Date(ref);
  mon.setDate(ref.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

export function defaultDay() {
  return { seanceType: null, kcalDepensees: "", repas: ["", "", "", "", ""] };
}

export function defaultProfil() {
  return { poids: "", taille: "", age: "", sexe: "m" };
}

// déficit > 0 = mangé MOINS = BON = vert → "-XXX"
// déficit < 0 = mangé PLUS  = MAUVAIS = rouge → "+XXX"
export function getDefColor(v) {
  if (v === null || v === undefined) return "#94A3B8";
  return v > 0 ? "#16A34A" : v < 0 ? "#DC2626" : "#94A3B8";
}

export function fmtDef(v) {
  if (v === null || v === undefined) return "—";
  if (v > 0) return `-${v}`;
  if (v < 0) return `+${Math.abs(v)}`;
  return "0";
}

export function getMealColor(val, target) {
  if (!target || !val) return "#1E293B";
  const p = val / target;
  if (p > 1.1) return "#DC2626";
  if (p >= 0.85) return "#16A34A";
  return "#D97706";
}

export function fmtDateShort(dateStr) {
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}

export function fmtDateFull(dateStr) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
