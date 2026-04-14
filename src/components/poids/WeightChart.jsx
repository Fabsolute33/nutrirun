import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { C } from "../../constants";
import { fmtDateShort, fmtDateFull } from "../../utils";

function CustomTooltip({ active, payload, label, objectif }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const diff = objectif ? (val - objectif).toFixed(1) : null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    }}>
      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
        {fmtDateFull(label)}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: "#1E293B" }}>
        {val} <span style={{ fontSize: 13, color: "#64748B" }}>kg</span>
      </div>
      {diff !== null && (
        <div style={{
          fontSize: 11, marginTop: 4, fontWeight: 700,
          color: Number(diff) < 0 ? "#16A34A" : "#DC2626",
        }}>
          {Number(diff) < 0 ? `${diff} kg vs objectif ✓` : `+${diff} kg vs objectif`}
        </div>
      )}
    </div>
  );
}

const FILTERS = [
  { label: "1 mois", value: "1m" },
  { label: "3 mois", value: "3m" },
  { label: "Tout",   value: "all" },
];

export default function WeightChart({ entries, objectif }) {
  const [filter, setFilter] = useState("all");

  if (entries.length < 2) return (
    <div style={{
      textAlign: "center",
      padding: "24px 0",
      color: C.faint,
      fontSize: 13,
    }}>
      Ajoutez au moins 2 mesures pour voir le graphique
    </div>
  );

  const now = new Date();
  const filtered = entries.filter(e => {
    if (filter === "all") return true;
    const d = new Date(e.date + "T12:00:00");
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return filter === "1m" ? diff <= 31 : diff <= 92;
  });

  const data = filtered.map(e => ({ date: e.date, poids: e.value }));
  const values = data.map(d => d.poids);
  const minV = Math.min(...values) - 1;
  const maxV = Math.max(...values) + 1;

  return (
    <div>
      {/* Filtres */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, justifyContent: "flex-end" }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              border: `1px solid ${filter === f.value ? C.accent : C.border}`,
              background: filter === f.value ? C.accentBg : C.surface,
              color: filter === f.value ? C.accent : C.muted,
              fontSize: 12,
              fontWeight: filter === f.value ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.accent} stopOpacity={0.25} />
              <stop offset="95%" stopColor={C.accent} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDateShort}
            tick={{ fontSize: 10, fill: C.faint }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minV, maxV]}
            tick={{ fontSize: 10, fill: C.faint }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip objectif={objectif} />} />
          {objectif && (
            <ReferenceLine
              y={objectif}
              stroke={C.warn}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: `Obj. ${objectif}kg`, fill: C.warn, fontSize: 10, position: "insideTopRight" }}
            />
          )}
          <Area
            type="monotone"
            dataKey="poids"
            stroke={C.accent}
            strokeWidth={2.5}
            fill="url(#colorPoids)"
            dot={{ r: 3, fill: C.accent, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
