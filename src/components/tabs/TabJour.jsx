import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { C, MEAL_TARGETS } from "../../constants";
import { useDay } from "../../hooks/useDay";
import { calcMaintenance, calcSlotKcal, toKey, fmtDateFull } from "../../utils";
import Card from "../ui/Card";
import SectionLabel from "../ui/SectionLabel";
import SeanceSelector from "../jour/SeanceSelector";
import MontreInput from "../jour/MontreInput";
import RepasTable from "../jour/RepasTable";
import SummaryCards from "../jour/SummaryCards";

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return toKey(d);
}

export default function TabJour({ profil, userId }) {
  const [dayKey, setDayKey] = useState(toKey(new Date()));
  const { data, updateDay } = useDay(userId, dayKey);

  const setSeance = (type) => updateDay(prev => ({ ...prev, seanceType: type }));
  const setKcal   = (val)  => updateDay(prev => ({ ...prev, kcalDepensees: val }));
  const setRepas  = (i, val) => updateDay(prev => {
    const repas = [...prev.repas];
    repas[i] = val;
    return { ...prev, repas };
  });

  const targets     = data.seanceType ? MEAL_TARGETS[data.seanceType] : null;
  const cible       = targets ? targets.reduce((a, b) => a + b, 0) : null;
  const consomme    = data.repas.reduce((sum, slot) => sum + calcSlotKcal(slot), 0);
  const maintenance = calcMaintenance(profil, data.kcalDepensees);
  const deficit     = maintenance !== null && consomme > 0 ? maintenance - consomme : null;

  const isToday = dayKey === toKey(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Navigation date */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "10px 14px",
      }}>
        <button onClick={() => setDayKey(addDays(dayKey, -1))}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.muted }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {isToday ? "Aujourd'hui" : fmtDateFull(dayKey)}
          </div>
          {isToday && <div style={{ fontSize: 11, color: C.muted }}>{fmtDateFull(dayKey)}</div>}
        </div>
        <button onClick={() => setDayKey(addDays(dayKey, 1))}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: C.muted }}>
          <ChevronRight size={20} />
        </button>
      </div>

      <Card>
        <SectionLabel icon={CalendarDays}>Type de séance</SectionLabel>
        <SeanceSelector value={data.seanceType} onChange={setSeance} />
      </Card>

      <MontreInput value={data.kcalDepensees} onChange={setKcal} />

      <Card>
        <SectionLabel>Repas</SectionLabel>
        <RepasTable seanceType={data.seanceType} repas={data.repas} onChange={setRepas} />
      </Card>

      <Card>
        <SectionLabel>Résumé du jour</SectionLabel>
        <SummaryCards cible={cible} consomme={consomme} maintenance={maintenance} deficit={deficit} />
      </Card>
    </div>
  );
}
