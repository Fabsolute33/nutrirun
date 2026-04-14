import { User, Flame } from "lucide-react";
import { C } from "../../constants";
import Card from "../ui/Card";
import SectionLabel from "../ui/SectionLabel";
import ProfilForm from "../profil/ProfilForm";
import BMRCard from "../profil/BMRCard";

export default function TabProfil({ profil, onUpdate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card>
        <SectionLabel icon={User}>Informations personnelles</SectionLabel>
        <ProfilForm profil={profil} onUpdate={onUpdate} />
      </Card>

      <Card>
        <SectionLabel icon={Flame}>Besoins caloriques</SectionLabel>
        <BMRCard profil={profil} />
      </Card>
    </div>
  );
}
