import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { defaultDay, migrateRepas } from "../utils";

export function useDay(userId, dayKey) {
  const [data, setData] = useState(defaultDay());

  useEffect(() => {
    if (!userId || !dayKey) return;
    supabase
      .from("days")
      .select("*")
      .eq("user_id", userId)
      .eq("date", dayKey)
      .single()
      .then(({ data: row }) => {
        if (row) {
          setData({
            seanceType:    row.seance_type,
            kcalDepensees: row.kcal_depensees ?? "",
            repas:         migrateRepas(row.repas ?? [[], [], [], [], []]),
          });
        } else {
          setData(defaultDay());
        }
      });
  }, [userId, dayKey]);

  // Mise à jour optimiste : état local immédiat + persist async
  const updateDay = useCallback((updater) => {
    setData(prev => {
      const updated = updater(prev);
      supabase.from("days").upsert({
        user_id:        userId,
        date:           dayKey,
        seance_type:    updated.seanceType,
        kcal_depensees: Number(updated.kcalDepensees) || 0,
        repas:          updated.repas,
      }).then(() => {});
      return updated;
    });
  }, [userId, dayKey]);

  return { data, updateDay };
}
