import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { defaultProfil } from "../utils";

export function useProfil(userId) {
  const [profil, setProfil] = useState(defaultProfil());

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("profil")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data) setProfil({
          poids:  data.poids  ?? "",
          taille: data.taille ?? "",
          age:    data.age    ?? "",
          sexe:   data.sexe   ?? "m",
        });
      });
  }, [userId]);

  const updateProfil = async (field, value) => {
    const updated = { ...profil, [field]: value };
    setProfil(updated);
    await supabase.from("profil").upsert({
      id:     userId,
      poids:  Number(updated.poids)  || null,
      taille: Number(updated.taille) || null,
      age:    Number(updated.age)    || null,
      sexe:   updated.sexe,
      updated_at: new Date().toISOString(),
    });
  };

  return { profil, updateProfil };
}
