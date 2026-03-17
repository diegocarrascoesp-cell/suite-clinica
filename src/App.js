import { useState } from "react";

// ─── BASE DE DATOS DE FÁRMACOS ───────────────────────────────────────────────
const DRUGS = {
  inductores: [
    {
      name: "Propofol",
      conc_mg_ml: 10,
      ind: { lo: 1.5, hi: 2.5, unit: "mg/kg" },
      cri: { lo: 25, hi: 75, unit: "mcg/kg/min" },
      dilucion: "Listo para usar (10 mg/mL). Puede diluir con SG5% hasta 2 mg/mL.",
    },
    {
      name: "Ketamina",
      conc_mg_ml: 50,
      ind: { lo: 1, hi: 2, unit: "mg/kg" },
      cri: { lo: 0.1, hi: 0.5, unit: "mg/kg/hr" },
      dilucion: "Diluir en SF o SG5%. Concentración habitual 1–2 mg/mL.",
    },
    {
      name: "Etomidato",
      conc_mg_ml: 2,
      ind: { lo: 0.2, hi: 0.3, unit: "mg/kg" },
      cri: null,
      dilucion: "Listo para usar (2 mg/mL). No diluir.",
    },
    {
      name: "Tiopental",
      conc_mg_ml: 25,
      ind: { lo: 3, hi: 5, unit: "mg/kg" },
      cri: null,
      dilucion: "Reconstituir 500 mg en 20 mL agua inyectable → 25 mg/mL.",
    },
    {
      name: "Midazolam",
      conc_mg_ml: 5,
      ind: { lo: 0.05, hi: 0.1, unit: "mg/kg" },
      cri: { lo: 0.02, hi: 0.1, unit: "mg/kg/hr" },
      dilucion: "Diluir en SF o SG5% hasta 1 mg/mL para infusión.",
    },
    {
      name: "Fentanilo",
      conc_mg_ml: 0.05,
      ind: { lo: 1, hi: 3, unit: "mcg/kg" },
      cri: { lo: 1, hi: 5, unit: "mcg/kg/hr" },
      dilucion: "Diluir en SF hasta 10–50 mcg/mL.",
    },
    {
      name: "Remifentanilo",
      conc_mg_ml: 0.05,
      ind: null,
      cri: { lo: 0.1, hi: 0.5, unit: "mcg/kg/min" },
      dilucion: "Reconstituir 1 mg en 1 mL agua → diluir hasta 25–50 mcg/mL en SF o SG5%.",
    },
  ],
  vasoactivos: [
    {
      name: "Norepinefrina",
      conc_mg_ml: 1,
      ind: null,
      cri: { lo: 0.01, hi: 3, unit: "mcg/kg/min" },
      dilucion: "Diluir en SG5% (no SF). Concentración habitual: 4–8 mcg/mL en 250 mL.",
    },
    {
      name: "Dopamina",
      conc_mg_ml: 40,
      ind: null,
      cri: { lo: 2, hi: 20, unit: "mcg/kg/min" },
      dilucion: "Diluir en SG5% o SF hasta 1600–3200 mcg/mL. Regla de los 6 aplicable.",
    },
    {
      name: "Dobutamina",
      conc_mg_ml: 12.5,
      ind: null,
      cri: { lo: 2, hi: 20, unit: "mcg/kg/min" },
      dilucion: "Reconstituir y diluir hasta 1000–2000 mcg/mL en SG5% o SF.",
    },
    {
      name: "Epinefrina",
      conc_mg_ml: 1,
      ind: { lo: 0.01, hi: 0.01, unit: "mg/kg" },
      cri: { lo: 0.01, hi: 1, unit: "mcg/kg/min" },
      dilucion: "Para infusión: diluir en SG5%. Concentración habitual 4–8 mcg/mL.",
    },
  ],
};

// ─── UTILIDADES DE CÁLCULO ────────────────────────────────────────────────────
function calcInd(weight, drug) {
  const { ind, conc_mg_ml } = drug;
  if (!ind) return null;
  const factor = ind.unit === "mcg/kg" ? 0.001 : 1;
  const loMg = ind.lo * weight * factor;
  const hiMg = ind.hi * weight * factor;
  const loMl = loMg / conc_mg_ml;
  const hiMl = hiMg / conc_mg_ml;
  return { loMg, hiMg, loMl, hiMl, unit: ind.unit };
}

function calcCRI(weight, drug) {
  const { cri, conc_mg_ml } = drug;
  if (!cri) return null;
  if (cri.unit === "mcg/kg/min") {
    const loMlhr = (cri.lo * weight * 60) / (conc_mg_ml * 1000);
    const hiMlhr = (cri.hi * weight * 60) / (conc_mg_ml * 1000);
    const loMcghr = cri.lo * weight * 60;
    const hiMcghr = cri.hi * weight * 60;
    return { lo: cri.lo, hi: cri.hi, loMlhr, hiMlhr, loMcghr, hiMcghr, unit: cri.unit };
  }
  if (cri.unit === "mg/kg/hr") {
    const loMlhr = (cri.lo * weight) / conc_mg_ml;
    const hiMlhr = (cri.hi * weight) / conc_mg_ml;
    return { lo: cri.lo, hi: cri.hi, loMlhr, hiMlhr, loMcghr: cri.lo * weight * 1000, hiMcghr: cri.hi * weight * 1000, unit: cri.unit };
  }
  if (cri.unit === "mcg/kg/hr") {
    const loMlhr = (cri.lo * weight) / (conc_mg_ml * 1000);
    const hiMlhr = (cri.hi * weight) / (conc_mg_ml * 1000);
    return { lo: cri.lo, hi: cri.hi, loMlhr, hiMlhr, loMcghr: cri.lo * weight, hiMcghr: cri.hi * weight, unit: cri.unit };
  }
  return null;
}

function regla6(weight) {
  // Regla de los 6: 6 × peso (kg) mg del fármaco en 100 mL → 1 mL/hr = 1 mcg/kg/min
  const mg = 6 * weight;
  return mg;
}

function fmt(n, d = 2) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  return n.toFixed(d).replace(/\.?0+$/, "") || "0";
}

// ─── COMPONENTES ──────────────────────────────────────────────────────────────
const TABS = ["Inductores / Sedación", "Vasoactivos / DVA", "Regla de los 6", "CRI Personalizado"];
const TAB_ICONS = ["💊", "🩸", "🔢", "⚗️"];

function Badge({ children, color = "#4a9eff" }) {
  return (
    <span style={{
      background: color + "18", border: `1px solid ${color}44`,
      color, borderRadius: 20, padding: "2px 10px", fontSize: 10,
      fontWeight: 700, letterSpacing: 1, textTransform: "uppercase"
    }}>{children}</span>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{
      background: "#06101f", borderRadius: 8, padding: "12px 14px",
      borderLeft: `3px solid ${color}`
    }}>
      <div style={{ fontSize: 9, color, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>{label}</div>
      {children}
    </div>
  );
}

function DrugCard({ drug, weight }) {
  const [showDil, setShowDil] = useState(false);
  const valid = weight > 0;
  const ind = valid ? calcInd(weight, drug) : null;
  const cri = valid ? calcCRI(weight, drug) : null;

  return (
    <div style={{
      background: "#0b1730", border: "1px solid #1a3060",
      borderRadius: 14, padding: "16px 18px", marginBottom: 10,
      transition: "border-color 0.2s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>{drug.name}</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {drug.ind && <Badge color="#a78bfa">Inducción</Badge>}
          {drug.cri && <Badge color="#22d3ee">CRI</Badge>}
        </div>
      </div>

      {!valid && (
        <p style={{ color: "#3a5a8f", fontSize: 12, fontStyle: "italic", margin: 0 }}>
          Ingresa el peso para ver los cálculos
        </p>
      )}

      {valid && (
        <div style={{ display: "grid", gridTemplateColumns: ind && cri ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 10 }}>
          {ind && (
            <Section label="DOSIS INDUCCIÓN" color="#a78bfa">
              <div style={{ fontSize: 16, fontWeight: 800, color: "#e8edf5" }}>
                {fmt(ind.loMg, 1)}–{fmt(ind.hiMg, 1)} {ind.unit === "mcg/kg" ? "mcg" : "mg"}
              </div>
              <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 3 }}>
                {fmt(ind.loMl, 2)}–{fmt(ind.hiMl, 2)} mL
              </div>
            </Section>
          )}
          {cri && (
            <Section label={`CRI (${drug.cri.unit})`} color="#22d3ee">
              <div style={{ fontSize: 15, fontWeight: 800, color: "#e8edf5" }}>
                {fmt(cri.loMlhr, 2)}–{fmt(cri.hiMlhr, 2)} mL/hr
              </div>
              <div style={{ fontSize: 11, color: "#22d3ee", marginTop: 3 }}>
                {fmt(cri.loMcghr, 1)}–{fmt(cri.hiMcghr, 1)} {cri.unit.startsWith("mcg") ? "mcg" : "mg"}/hr
              </div>
            </Section>
          )}
        </div>
      )}

      <button onClick={() => setShowDil(s => !s)} style={{
        background: "transparent", border: "1px solid #1a3060", color: "#4a6a9f",
        borderRadius: 8, padding: "5px 12px", fontSize: 11, cursor: "pointer",
        fontFamily: "inherit", letterSpacing: 1
      }}>
        {showDil ? "▲ Ocultar dilución" : "▼ Ver dilución"}
      </button>
      {showDil && (
        <div style={{
          marginTop: 10, padding: "10px 14px", background: "#040c1c",
          borderRadius: 8, fontSize: 12, color: "#7aa2d4", lineHeight: 1.7,
          borderLeft: "3px solid #1a3060"
        }}>
          {drug.dilucion}
        </div>
      )}
    </div>
  );
}

function Regla6Tab({ weight }) {
  const [drug, setDrug] = useState("Dopamina");
  const valid = weight > 0;
  const mg = valid ? regla6(weight) : null;

  return (
    <div>
      <div style={{
        background: "#0b1730", border: "1px solid #1a3060",
        borderRadius: 14, padding: "18px", marginBottom: 12
      }}>
        <div style={{ fontSize: 11, color: "#f59e0b", letterSpacing: 2, marginBottom: 6 }}>¿QUÉ ES LA REGLA DE LOS 6?</div>
        <p style={{ fontSize: 13, color: "#7aa2d4", lineHeight: 1.7, margin: 0 }}>
          Mezclar <strong style={{ color: "#f59e0b" }}>6 × peso (kg) mg</strong> del fármaco en 100 mL de solución.
          Con esta dilución: <strong style={{ color: "#f59e0b" }}>1 mL/hr = 1 mcg/kg/min</strong>.
          Útil en neonatos y pediátricos para simplificar el ajuste de dosis.
        </p>
      </div>

      <div style={{
        background: "#0b1730", border: "1px solid #1a3060",
        borderRadius: 14, padding: "18px", marginBottom: 12
      }}>
        <label style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2 }}>FÁRMACO</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {["Dopamina", "Dobutamina", "Norepinefrina", "Epinefrina"].map(d => (
            <button key={d} onClick={() => setDrug(d)}
              style={{
                padding: "7px 14px", borderRadius: 8, fontFamily: "inherit", fontSize: 12,
                cursor: "pointer", fontWeight: drug === d ? 700 : 400,
                border: drug === d ? "1px solid #f59e0b" : "1px solid #1a3060",
                background: drug === d ? "#2a1a00" : "#060d1f",
                color: drug === d ? "#f59e0b" : "#4a6a9f"
              }}>{d}</button>
          ))}
        </div>
      </div>

      {!valid && (
        <div style={{ color: "#3a5a8f", fontSize: 13, fontStyle: "italic", textAlign: "center", padding: 20 }}>
          Ingresa el peso del paciente arriba para calcular
        </div>
      )}

      {valid && (
        <div style={{
          background: "#0b1730", border: "1px solid #f59e0b44",
          borderRadius: 14, padding: "20px"
        }}>
          <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, marginBottom: 14 }}>RESULTADO PARA {weight} kg</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Section label="CANTIDAD A MEZCLAR" color="#f59e0b">
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>
                {fmt(mg, 1)} mg
              </div>
              <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 2 }}>de {drug}</div>
            </Section>
            <Section label="VOLUMEN FINAL" color="#f59e0b">
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>100 mL</div>
              <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 2 }}>SG5% o SF</div>
            </Section>
          </div>
          <div style={{
            marginTop: 12, background: "#040c1c", borderRadius: 8, padding: "10px 14px",
            fontSize: 12, color: "#7aa2d4", lineHeight: 1.8
          }}>
            <strong style={{ color: "#fbbf24" }}>Equivalencia directa:</strong><br />
            1 mL/hr → 1 mcg/kg/min<br />
            5 mL/hr → 5 mcg/kg/min<br />
            10 mL/hr → 10 mcg/kg/min
          </div>
        </div>
      )}
    </div>
  );
}

function CustomCRI({ weight }) {
  const [state, setState] = useState({
    drug: "", dose: "", unit: "mcg/kg/min", conc: "", vol: "50"
  });
  const valid = weight > 0;

  function set(k, v) { setState(p => ({ ...p, [k]: v })); }

  const d = parseFloat(state.dose);
  const c = parseFloat(state.conc);
  const v = parseFloat(state.vol);

  let result = null;
  if (valid && d > 0 && c > 0 && v > 0) {
    const concDil = (c * 1000) / v; // mcg/mL in syringe
    if (state.unit === "mcg/kg/min") {
      const mlhr = (d * weight * 60) / concDil;
      result = { mlhr, totalPerMin: d * weight, totalPerHr: d * weight * 60 };
    } else if (state.unit === "mg/kg/hr") {
      const mlhr = (d * weight * 1000) / concDil;
      result = { mlhr, totalPerMin: (d * weight * 1000) / 60, totalPerHr: d * weight * 1000 };
    } else if (state.unit === "mcg/kg/hr") {
      const mlhr = (d * weight) / concDil;
      result = { mlhr, totalPerMin: (d * weight) / 60, totalPerHr: d * weight };
    }
  }

  return (
    <div style={{
      background: "#0b1730", border: "1px solid #1a3060",
      borderRadius: 14, padding: "20px"
    }}>
      <div style={{ fontSize: 11, color: "#34d399", letterSpacing: 2, marginBottom: 16 }}>INFUSIÓN PERSONALIZADA</div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>FÁRMACO (nombre)</label>
        <input value={state.drug} onChange={e => set("drug", e.target.value)}
          placeholder="Ej: Vasopresina, Nicardipino..."
          style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>DOSIS DESEADA</label>
          <input type="number" value={state.dose} onChange={e => set("dose", e.target.value)}
            placeholder="0.1" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>UNIDAD</label>
          <select value={state.unit} onChange={e => set("unit", e.target.value)}
            style={{ ...inputStyle, marginTop: 6 }}>
            <option>mcg/kg/min</option>
            <option>mcg/kg/hr</option>
            <option>mg/kg/hr</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>CONC. DILUCIÓN (mg/mL)</label>
          <input type="number" value={state.conc} onChange={e => set("conc", e.target.value)}
            placeholder="Mg totales en jeringa" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>VOLUMEN JERINGA (mL)</label>
          <input type="number" value={state.vol} onChange={e => set("vol", e.target.value)}
            placeholder="50" style={inputStyle} />
        </div>
      </div>

      {result && (
        <div style={{
          background: "#040c1c", borderRadius: 10, padding: "16px",
          border: "1px solid #34d39944", marginTop: 4
        }}>
          <div style={{ fontSize: 10, color: "#34d399", letterSpacing: 2, marginBottom: 12 }}>
            ✓ RESULTADO — {state.drug || "Fármaco"} para {weight} kg
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { label: "VELOCIDAD", value: fmt(result.mlhr, 2) + " mL/hr", accent: "#34d399" },
              { label: "DOSIS/min", value: fmt(result.totalPerMin, 2) + " mcg/min", accent: "#22d3ee" },
              { label: "DOSIS/hr", value: fmt(result.totalPerHr, 1) + " mcg/hr", accent: "#a78bfa" },
            ].map(item => (
              <div key={item.label} style={{
                background: "#0b1730", borderRadius: 8, padding: "10px",
                borderTop: `2px solid ${item.accent}`
              }}>
                <div style={{ fontSize: 9, color: item.accent, letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#e8edf5" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", marginTop: 6,
  background: "#040c1c", border: "1px solid #1a3060",
  borderRadius: 8, color: "#e8edf5", fontSize: 14,
  padding: "9px 13px", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box"
};

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [weight, setWeight] = useState("");
  const [tab, setTab] = useState(0);
  const w = parseFloat(weight);
  const valid = w > 0 && w < 250;

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 0%, #0d1f40 0%, #050d1c 60%)",
      color: "#e8edf5",
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      paddingBottom: 60
    }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #0a1a38 0%, #050d1c 100%)",
        borderBottom: "1px solid #1a3060",
        padding: "20px 20px 16px"
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 10, color: "#22d3ee", letterSpacing: 3, marginBottom: 4 }}>
            ANESTESIOLOGÍA · URGENCIAS · UCI
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>
            💉 Calculadora de Infusiones
          </div>
          <div style={{ fontSize: 11, color: "#3a5a8f", marginTop: 2 }}>
            Dosis · CRI · Diluciones · Regla de los 6
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* PESO */}
        <div style={{
          background: "#0b1730", border: "1px solid #1a3060",
          borderRadius: 14, padding: "16px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#22d3ee", letterSpacing: 2, marginBottom: 6 }}>
              PESO DEL PACIENTE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number" value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="70"
                style={{
                  width: 100, background: "#040c1c", border: "1px solid #1a4080",
                  borderRadius: 8, color: "#22d3ee", fontSize: 26, fontWeight: 800,
                  padding: "6px 14px", outline: "none", fontFamily: "inherit"
                }}
              />
              <span style={{ fontSize: 18, color: "#22d3ee", fontWeight: 700 }}>kg</span>
            </div>
          </div>
          {valid && (
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#34d399", letterSpacing: 2 }}>ACTIVO</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399" }}>{w} kg</div>
            </div>
          )}
        </div>

        {/* TABS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "10px 4px", borderRadius: 10, fontSize: 10,
              fontFamily: "inherit", fontWeight: 700, letterSpacing: 0.5,
              cursor: "pointer", textAlign: "center", lineHeight: 1.4,
              border: tab === i ? "1px solid #22d3ee" : "1px solid #1a3060",
              background: tab === i ? "#0d2a4e" : "#0b1730",
              color: tab === i ? "#22d3ee" : "#3a5a8f"
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{TAB_ICONS[i]}</div>
              {t}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        {tab === 0 && DRUGS.inductores.map(d => (
          <DrugCard key={d.name} drug={d} weight={valid ? w : 0} />
        ))}
        {tab === 1 && DRUGS.vasoactivos.map(d => (
          <DrugCard key={d.name} drug={d} weight={valid ? w : 0} />
        ))}
        {tab === 2 && <Regla6Tab weight={valid ? w : 0} />}
        {tab === 3 && <CustomCRI weight={valid ? w : 0} />}

        {/* DISCLAIMER */}
        <div style={{
          marginTop: 24, padding: "12px 16px",
          background: "#08111f", border: "1px solid #1a2a4f",
          borderRadius: 10, fontSize: 11, color: "#2a4a7f", lineHeight: 1.7
        }}>
          ⚠️ Herramienta de apoyo clínico. Verificar siempre con protocolos institucionales y criterio médico.
          No reemplaza el juicio clínico del profesional de salud.
        </div>
      </div>
    </div>
  );
}