import { useState } from "react";
import { BarChart2, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { C, DAY_LABELS, SEANCE_CONFIG } from "../../constants";
import { useWeek } from "../../hooks/useWeek";
import { calcMaintenance, calcSlotKcal, toKey, fmtDef, getDefColor, fmtDateShort } from "../../utils";
import Card from "../ui/Card";
import SectionLabel from "../ui/SectionLabel";

export default function TabSemaine({ profil, userId }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const { days, weekData } = useWeek(userId, weekOffset);

  const weekDays = days.map((d, i) => {
    const key  = toKey(d);
    const data = weekData[key] || null;
    const maintenance = data ? calcMaintenance(profil, data.kcalDepensees) : null;
    const consomme    = data ? data.repas.reduce((sum, slot) => sum + calcSlotKcal(slot), 0) : 0;
    const deficit     = maintenance !== null && consomme > 0 ? maintenance - consomme : null;
    return { key, label: DAY_LABELS[i], date: d, data, maintenance, consomme, deficit };
  });

  const totalDeficit = weekDays
    .filter(d => d.deficit !== null)
    .reduce((sum, d) => sum + d.deficit, 0);

  const pertePoids   = (totalDeficit / 7700).toFixed(2);
  const isCurrentWeek = weekOffset === 0;
  const weekStart    = fmtDateShort(toKey(days[0]));
  const weekEnd      = fmtDateShort(toKey(days[6]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Navigation semaine */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "10px 14px",
      }}>
        <button onClick={() => setWeekOffset(w => w - 1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {isCurrentWeek ? "Cette semaine" : `${weekStart} — ${weekEnd}`}
          </div>
          {isCurrentWeek && (
            <div style={{ fontSize: 11, color: C.muted }}>{weekStart} — {weekEnd}</div>
          )}
        </div>
        <button onClick={() => setWeekOffset(w => w + 1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Carte perte estimée */}
      <Card style={{
        background: totalDeficit > 0 ? C.accentBg : C.surface,
        border: `1px solid ${totalDeficit > 0 ? C.accentBorder : C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TrendingDown size={28} color={totalDeficit > 0 ? C.accent : C.faint} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: totalDeficit > 0 ? C.accent : C.faint }}>
              {totalDeficit > 0 ? `-${pertePoids} kg` : `${pertePoids} kg`}
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>
              Perte estimée · déficit total {fmtDef(totalDeficit)} kcal
            </div>
          </div>
        </div>
      </Card>

      {/* Grille 7 jours */}
      <Card>
        <SectionLabel icon={BarChart2}>Détail par jour</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {weekDays.map(day => {
            const today     = toKey(new Date()) === day.key;
            const seanceCfg = day.data?.seanceType ? SEANCE_CONFIG[day.data.seanceType] : null;
            const defColor  = getDefColor(day.deficit);

            return (
              <div key={day.key} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 12,
                background: today ? C.accentBg : C.bg,
                border: `1px solid ${today ? C.accentBorder : C.border}`,
              }}>
                <div style={{ width: 32, textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: today ? C.accent : C.text }}>
                    {day.label}
                  </div>
                  <div style={{ fontSize: 10, color: C.faint }}>{fmtDateShort(day.key)}</div>
                </div>
                <div style={{ flex: 1, fontSize: 11, color: seanceCfg ? seanceCfg.color : C.faint, fontWeight: seanceCfg ? 600 : 400 }}>
                  {seanceCfg ? seanceCfg.label : "—"}
                </div>
                <div style={{ fontSize: 12, color: C.muted, minWidth: 50, textAlign: "right" }}>
                  {day.consomme > 0 ? `${day.consomme} kcal` : "—"}
                </div>
                <div style={{ minWidth: 52, textAlign: "right", fontSize: 13, fontWeight: 800, color: defColor }}>
                  {day.deficit !== null ? fmtDef(day.deficit) : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
