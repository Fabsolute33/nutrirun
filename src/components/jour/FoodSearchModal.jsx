import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, ChevronLeft, Plus, Pencil, Loader } from "lucide-react";
import { C } from "../../constants";
import { useFoodSearch } from "../../hooks/useFoodSearch";

export default function FoodSearchModal({ isOpen, mealName, onAdd, onClose }) {
  const { query, setQuery, results, loading, error, reset } = useFoodSearch();
  const [view, setView]             = useState("search"); // "search" | "qty" | "manual"
  const [selected, setSelected]     = useState(null);
  const [qty, setQty]               = useState("100");
  const [manualKcal, setManualKcal] = useState("");
  const [visible, setVisible]       = useState(false);

  // Reset + animation à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      reset();
      setView("search");
      setSelected(null);
      setQty("100");
      setManualKcal("");
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const preview = selected
    ? Math.round(selected.kcalPer100g * (Number(qty) || 0) / 100)
    : 0;

  const handleSelectProduct = (product) => {
    setSelected(product);
    setQty("100");
    setView("qty");
  };

  const handleAddQty = () => {
    if (preview <= 0) return;
    onAdd({ name: selected.name, kcalPer100g: selected.kcalPer100g, qty: Number(qty), kcal: preview });
    onClose();
  };

  const handleAddManual = () => {
    const kcal = Number(manualKcal) || 0;
    if (kcal <= 0) return;
    onAdd({ name: "Saisie manuelle", kcalPer100g: null, qty: null, kcal });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.28s ease",
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "100%"})`,
        width: "100%", maxWidth: 430,
        background: C.surface,
        borderRadius: "20px 20px 0 0",
        padding: "0 0 32px",
        maxHeight: "88dvh",
        display: "flex", flexDirection: "column",
        zIndex: 1001,
        transition: "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
        boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 16px 12px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {view !== "search" && (
              <button onClick={() => setView("search")} style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.muted, padding: 4, display: "flex",
              }}>
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>
                {view === "search"  && `Ajouter à — ${mealName}`}
                {view === "qty"     && selected?.name}
                {view === "manual"  && "Saisie manuelle"}
              </div>
              {view === "qty" && (
                <div style={{ fontSize: 11, color: C.muted }}>{selected?.kcalPer100g} kcal / 100g</div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.faint, padding: 4, display: "flex",
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>

          {/* ── VUE RECHERCHE ── */}
          {view === "search" && (
            <>
              {/* Input recherche */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "10px 14px", marginBottom: 12,
              }}>
                <Search size={16} color={C.faint} />
                <input
                  autoFocus
                  inputMode="search"
                  placeholder="Rechercher un aliment..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    flex: 1, border: "none", background: "transparent",
                    fontSize: 15, color: C.text, outline: "none",
                  }}
                />
                {loading && <Loader size={16} color={C.faint} />}
                {query && !loading && (
                  <button onClick={() => setQuery("")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: C.faint, padding: 0, display: "flex",
                  }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Erreur */}
              {error && (
                <div style={{ fontSize: 13, color: C.danger, textAlign: "center", padding: "12px 0" }}>
                  {error}
                </div>
              )}

              {/* Résultats */}
              {results.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  {results.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px",
                        background: C.bg, border: `1px solid ${C.border}`,
                        borderRadius: 12, cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600, color: C.text,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {product.name}
                        </div>
                        {product.brand && (
                          <div style={{ fontSize: 11, color: C.faint }}>{product.brand}</div>
                        )}
                      </div>
                      <div style={{
                        flexShrink: 0, marginLeft: 12,
                        fontSize: 13, fontWeight: 800, color: C.accent,
                      }}>
                        {product.kcalPer100g} <span style={{ fontSize: 10, fontWeight: 500, color: C.muted }}>kcal/100g</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Aucun résultat */}
              {query.length >= 2 && !loading && results.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "16px 0", color: C.faint, fontSize: 13 }}>
                  Aucun résultat pour « {query} »
                </div>
              )}

              {/* Séparateur */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: 10, color: C.faint, fontSize: 12,
              }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                ou
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              {/* Bouton saisie manuelle */}
              <button
                onClick={() => setView("manual")}
                style={{
                  width: "100%", padding: "11px",
                  borderRadius: 12, border: `1px solid ${C.border}`,
                  background: C.surface, color: C.muted,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Pencil size={15} />
                Saisie manuelle (kcal directement)
              </button>
            </>
          )}

          {/* ── VUE QUANTITÉ ── */}
          {view === "qty" && selected && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Input grammes */}
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Quantité (grammes)</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "10px 14px",
                }}>
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max="2000"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                    style={{
                      flex: 1, border: "none", background: "transparent",
                      fontSize: 22, fontWeight: 900, color: C.text, outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 14, color: C.muted }}>g</span>
                </div>
              </div>

              {/* Preview kcal */}
              <div style={{
                padding: "14px 16px",
                background: preview > 0 ? C.accentBg : C.bg,
                border: `1px solid ${preview > 0 ? C.accentBorder : C.border}`,
                borderRadius: 14, textAlign: "center",
              }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: preview > 0 ? C.accent : C.faint }}>
                  {preview}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>kcal calculés</div>
              </div>

              {/* Bouton ajouter */}
              <button
                onClick={handleAddQty}
                disabled={preview <= 0}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px", borderRadius: 12, border: "none",
                  background: preview > 0 ? C.accent : C.faint,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: preview > 0 ? "pointer" : "not-allowed",
                }}
              >
                <Plus size={18} />
                Ajouter {preview > 0 ? `${preview} kcal` : ""}
              </button>
            </div>
          )}

          {/* ── VUE SAISIE MANUELLE ── */}
          {view === "manual" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Calories (kcal)</div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "10px 14px",
                }}>
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max="5000"
                    placeholder="ex : 450"
                    value={manualKcal}
                    onChange={e => setManualKcal(e.target.value)}
                    style={{
                      flex: 1, border: "none", background: "transparent",
                      fontSize: 22, fontWeight: 900, color: C.text, outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 14, color: C.muted }}>kcal</span>
                </div>
              </div>

              <button
                onClick={handleAddManual}
                disabled={!Number(manualKcal)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px", borderRadius: 12, border: "none",
                  background: Number(manualKcal) > 0 ? C.accent : C.faint,
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: Number(manualKcal) > 0 ? "pointer" : "not-allowed",
                }}
              >
                <Plus size={18} />
                Ajouter {Number(manualKcal) > 0 ? `${Number(manualKcal)} kcal` : ""}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
