import { useState } from "react";
import { Coffee, Apple, ChefHat, Cookie, Moon, Plus, Trash2, Pencil } from "lucide-react";
import { MEAL_CONFIG, MEAL_TARGETS, C } from "../../constants";
import { getMealColor, calcSlotKcal } from "../../utils";
import FoodSearchModal from "./FoodSearchModal";

const ICONS = { Coffee, Apple, ChefHat, Cookie, Moon };

export default function RepasTable({ seanceType, repas, onChange }) {
  const [openSearchIndex, setOpenSearchIndex] = useState(null);
  const [editItem, setEditItem]               = useState(null); // { mealIndex, itemIndex }

  const targets = seanceType ? MEAL_TARGETS[seanceType] : null;

  // Ajouter un item à un slot
  const handleAdd = (mealIndex, item) => {
    const newSlot = [...(repas[mealIndex] || []), item];
    onChange(mealIndex, newSlot);
    setOpenSearchIndex(null);
  };

  // Supprimer un item
  const handleDelete = (mealIndex, itemIndex) => {
    const newSlot = repas[mealIndex].filter((_, i) => i !== itemIndex);
    onChange(mealIndex, newSlot);
  };

  // Modifier la quantité d'un item (inline)
  const handleQtyChange = (mealIndex, itemIndex, newVal) => {
    const item = repas[mealIndex][itemIndex];
    let updated;
    if (item.kcalPer100g != null) {
      // Produit OFF : recalcul automatique
      const newQty = Number(newVal) || 0;
      updated = { ...item, qty: newQty, kcal: Math.round(item.kcalPer100g * newQty / 100) };
    } else {
      // Saisie manuelle : kcal direct
      updated = { ...item, kcal: Number(newVal) || 0 };
    }
    const newSlot = repas[mealIndex].map((it, i) => i === itemIndex ? updated : it);
    onChange(mealIndex, newSlot);
  };

  const openMeal = openSearchIndex !== null ? openSearchIndex : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {MEAL_CONFIG.map((meal, mealIndex) => {
        const Icon     = ICONS[meal.icon];
        const target   = targets ? targets[mealIndex] : null;
        const slot     = repas[mealIndex] || [];
        const total    = calcSlotKcal(slot);
        const hasItems = slot.length > 0;
        const totalColor = total > 0 ? getMealColor(total, target) : C.muted;

        return (
          <div
            key={mealIndex}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {/* En-tête du repas */}
            <div style={{
              display: "flex", alignItems: "center",
              padding: "10px 12px",
              background: hasItems ? C.bg : C.surface,
              borderBottom: hasItems ? `1px solid ${C.border}` : "none",
              gap: 8,
            }}>
              <Icon size={15} color={C.muted} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>
                {meal.name}
              </span>
              {target && (
                <span style={{ fontSize: 11, color: C.faint }}>Cible {target} kcal</span>
              )}
              {total > 0 && (
                <span style={{ fontSize: 14, fontWeight: 900, color: totalColor, marginLeft: 6 }}>
                  {total} <span style={{ fontSize: 10, fontWeight: 500, color: C.faint }}>kcal</span>
                </span>
              )}
            </div>

            {/* Liste des items */}
            {hasItems && (
              <div style={{ padding: "6px 0" }}>
                {slot.map((item, itemIndex) => {
                  const isEditing = editItem?.mealIndex === mealIndex && editItem?.itemIndex === itemIndex;
                  return (
                    <div
                      key={itemIndex}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 12px",
                        borderBottom: itemIndex < slot.length - 1 ? `1px solid ${C.bg}` : "none",
                      }}
                    >
                      {/* Nom */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, color: C.text, fontWeight: 500,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </div>
                        {/* Édition inline de la quantité */}
                        {isEditing ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <input
                              autoFocus
                              type="number"
                              min="1"
                              value={item.kcalPer100g != null ? item.qty : item.kcal}
                              onChange={e => handleQtyChange(mealIndex, itemIndex, e.target.value)}
                              onBlur={() => setEditItem(null)}
                              style={{
                                width: 70, padding: "3px 6px",
                                border: `1px solid ${C.accent}`,
                                borderRadius: 6, fontSize: 12, color: C.text,
                                background: C.accentBg, outline: "none",
                              }}
                            />
                            <span style={{ fontSize: 11, color: C.muted }}>
                              {item.kcalPer100g != null ? "g" : "kcal"}
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: C.faint }}>
                            {item.kcalPer100g != null
                              ? `${item.qty}g · ${item.kcalPer100g} kcal/100g`
                              : "saisie directe"}
                          </div>
                        )}
                      </div>

                      {/* kcal de l'item */}
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.accent, flexShrink: 0 }}>
                        {item.kcal}
                      </span>

                      {/* Bouton modifier */}
                      <button
                        onClick={() => setEditItem(isEditing ? null : { mealIndex, itemIndex })}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: isEditing ? C.accent : C.faint, padding: 4, display: "flex",
                        }}
                      >
                        <Pencil size={13} />
                      </button>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleDelete(mealIndex, itemIndex)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: C.faint, padding: 4, display: "flex",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bouton ajouter */}
            <button
              onClick={() => setOpenSearchIndex(mealIndex)}
              style={{
                width: "100%", padding: "9px 12px",
                border: "none", borderTop: hasItems ? `1px solid ${C.border}` : "none",
                background: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                color: C.accent, fontSize: 12, fontWeight: 600,
              }}
            >
              <Plus size={14} />
              Ajouter un aliment
            </button>
          </div>
        );
      })}

      {/* Modal recherche */}
      <FoodSearchModal
        isOpen={openMeal !== null}
        mealName={openMeal !== null ? MEAL_CONFIG[openMeal]?.name : ""}
        onAdd={(item) => handleAdd(openMeal, item)}
        onClose={() => setOpenSearchIndex(null)}
      />
    </div>
  );
}
