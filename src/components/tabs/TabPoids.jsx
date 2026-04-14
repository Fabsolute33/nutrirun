import { Scale, BarChart2, List } from "lucide-react";
import { C } from "../../constants";
import { useWeights } from "../../hooks/useWeights";
import Card from "../ui/Card";
import SectionLabel from "../ui/SectionLabel";
import WeightForm from "../poids/WeightForm";
import WeightStats from "../poids/WeightStats";
import WeightChart from "../poids/WeightChart";
import WeightHistory from "../poids/WeightHistory";

export default function TabPoids({ profil, userId }) {
  const { entries, addEntry, deleteEntry } = useWeights(userId);
  const objectif = profil.poids ? Number(profil.poids) - 10 : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card>
        <SectionLabel icon={Scale}>Nouvelle mesure</SectionLabel>
        <WeightForm onAdd={addEntry} />
      </Card>

      {entries.length > 0 && (
        <WeightStats entries={entries} objectif={objectif} />
      )}

      {entries.length >= 2 && (
        <Card>
          <SectionLabel icon={BarChart2}>Évolution</SectionLabel>
          <WeightChart entries={entries} objectif={objectif} />
        </Card>
      )}

      <Card>
        <SectionLabel icon={List}>Historique</SectionLabel>
        <WeightHistory entries={entries} onDelete={deleteEntry} />
      </Card>
    </div>
  );
}
