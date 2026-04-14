import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { toKey, getWeekDays } from "../utils";

export function useWeek(userId, weekOffset = 0) {
  const [weekData, setWeekData] = useState({});

  const refDate = new Date();
  refDate.setDate(refDate.getDate() + weekOffset * 7);
  const days = getWeekDays(refDate);
  const dates = days.map(d => toKey(d));

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("days")
      .select("date, seance_type, kcal_depensees, repas")
      .eq("user_id", userId)
      .in("date", dates)
      .then(({ data }) => {
        const map = {};
        (data || []).forEach(row => {
          map[row.date] = {
            seanceType:    row.seance_type,
            kcalDepensees: row.kcal_depensees ?? 0,
            repas:         row.repas ?? ["", "", "", "", ""],
          };
        });
        setWeekData(map);
      });
  }, [userId, weekOffset]);

  return { days, weekData };
}
