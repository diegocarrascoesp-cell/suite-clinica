import { useState } from "react";

const DRUGS_VASOA = [
  { name: "Norepinefrina", conc_mg_ml: 1, ind: null, cri: { lo: 0.01, hi: 3, unit: "mcg/kg/min" }, dilucion: "Diluir en SG5% (no SF). Concentración habitual: 4–8 mcg/mL en 250 mL." },
  { name: "Dopamina", conc_mg_ml: 40, ind: null, cri: { lo: 2, hi: 20, unit: "mcg/kg/min" }, dilucion: "Diluir en SG5% o SF hasta 1600–3200 mcg/mL." },
  { name: "Dobutamina", conc_mg_ml: 12.5, ind: null, cri: { lo: 2, hi: 20, unit: "mcg/kg/min" }, dilucion: "Reconstituir y diluir hasta 1000–2000 mcg/mL en SG5% o SF." },
  { name: "Epinefrina", conc_mg_ml: 1, ind: { lo: 0.01, hi: 0.01, unit: "mg/kg" }, cri: { lo: 0.01, hi: 1, unit: "mcg/kg/min" }, dilucion: "Para infusión: diluir en SG5%. Concentración habitual 4–8 mcg/mL." },
];

const SRI_DRUGS = {
  ind: [
    { name: "Ketamina", lo: 1, hi: 2, conc: 50, unit: "mg/kg", nota: "Primera línea en inestabilidad hemodinámica. Broncodilatador." },
    { name: "Propofol", lo: 1.5, hi: 2.5, conc: 10, unit: "mg/kg", nota: "Cuidado en hipotensión. Inicio rápido." },
    { name: "Etomidato", lo: 0.2, hi: 0.3, conc: 2, unit: "mg/kg", nota: "Mejor estabilidad hemodinámica. Evitar en sepsis severa (supresión adrenal)." },
    { name: "Midazolam", lo: 0.05, hi: 0.1, conc: 5, unit: "mg/kg", nota: "Útil como coadyuvante. Precaución en inestabilidad." },
  ],
  anal: [
    { name: "Fentanilo", lo: 1, hi: 3, conc: 0.05, unit: "mcg/kg", nota: "Primera línea. Administrar 3 min antes de la inducción." },
    { name: "Ketamina (analgésica)", lo: 0.3, hi: 0.5, conc: 50, unit: "mg/kg", nota: "Dosis subanestésica. Alternativa si contraindicado opiáceo." },
  ],
  bnm: [
    { name: "Rocuronio", lo: 1, hi: 1.2, conc: 10, unit: "mg/kg", nota: "Reversible con sugammadex. De elección si contraindicada succinilcolina." },
    { name: "Succinilcolina", lo: 1.5, hi: 2, conc: 20, unit: "mg/kg", nota: "Inicio ultrarrápido. Contraindicado en hipercalemia, quemados >48h, denervación." },
  ],
};

const PROC_DRUGS = [
  { name: "Etomidato", lo: 0.05, hi: 0.1, conc: 2, unit: "mg/kg", duracion: "3–5 min", indicacion: "Cardioversión, procedimientos cortos. Excelente estabilidad HD.", color: "#a78bfa" },
  { name: "Ketamina", lo: 0.5, hi: 1.5, conc: 50, unit: "mg/kg", duracion: "10–20 min", indicacion: "Reducción fracturas, curaciones, procedimientos dolorosos. Analgesia + sedación.", color: "#22d3ee" },
  { name: "Midazolam", lo: 0.02, hi: 0.05, conc: 5, unit: "mg/kg", duracion: "20–30 min", indicacion: "Ansiolisis, procedimientos menores. Combinar con analgésico.", color: "#34d399" },
  { name: "Fentanilo", lo: 1, hi: 2, conc: 0.05, unit: "mcg/kg", duracion: "30–60 min", indicacion: "Analgesia procedimental. Siempre acompañar con sedante si necesario.", color: "#f59e0b" },
  { name: "Propofol", lo: 0.5, hi: 1.5, conc: 10, unit: "mg/kg", duracion: "5–10 min", indicacion: "Cardioversión, endoscopia, procedimientos rápidos. Vigilar hipotensión.", color: "#f87171" },
  { name: "Dexmedetomidina", lo: 0.5, hi: 1, conc: 0.2, unit: "mcg/kg", duracion: "Bolo pre-procedimiento", indicacion: "Sedación cooperativa. CVC, curaciones, procedimientos que requieren colaboración.", color: "#818cf8" },
];

function calcInd(w, drug) {
  if (!drug.ind) return null;
  const f = drug.ind.unit === "mcg/kg" ? 0.001 : 1;
  const loMg = drug.ind.lo * w * f, hiMg = drug.ind.hi * w * f;
  return { loMg, hiMg, loMl: loMg / drug.conc_mg_ml, hiMl: hiMg / drug.conc_mg_ml, unit: drug.ind.unit };
}
function calcCRI(w, drug) {
  const { cri, conc_mg_ml } = drug; if (!cri) return null;
  if (cri.unit === "mcg/kg/min") return { loMlhr: (cri.lo*w*60)/(conc_mg_ml*1000), hiMlhr: (cri.hi*w*60)/(conc_mg_ml*1000), loMcghr: cri.lo*w*60, hiMcghr: cri.hi*w*60, unit: cri.unit };
  if (cri.unit === "mg/kg/hr") return { loMlhr: (cri.lo*w)/conc_mg_ml, hiMlhr: (cri.hi*w)/conc_mg_ml, loMcghr: cri.lo*w*1000, hiMcghr: cri.hi*w*1000, unit: cri.unit };
  return null;
}
function fmt(n, d=2) { if (n===undefined||n===null||isNaN(n)) return "—"; return n.toFixed(d).replace(/\.?0+$/,"")||"0"; }

function Badge({ children, color }) {
  return <span style={{ background: color+"18", border:`1px solid ${color}44`, color, borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{children}</span>;
}
function Section({ label, color, children }) {
  return <div style={{ background:"#06101f", borderRadius:8, padding:"12px 14px", borderLeft:`3px solid ${color}` }}><div style={{ fontSize:9, color, letterSpacing:2, marginBottom:8, fontWeight:700 }}>{label}</div>{children}</div>;
}

function DrugCard({ drug, weight }) {
  const [showDil, setShowDil] = useState(false);
  const valid = weight > 0;
  const ind = valid ? calcInd(weight, drug) : null;
  const cri = valid ? calcCRI(weight, drug) : null;
  return (
    <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px 18px", marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:15, fontWeight:700 }}>{drug.name}</span>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {drug.ind && <Badge color="#a78bfa">Inducción</Badge>}
          {drug.cri && <Badge color="#22d3ee">CRI</Badge>}
        </div>
      </div>
      {!valid && <p style={{ color:"#3a5a8f", fontSize:12, fontStyle:"italic", margin:0 }}>Ingresa el peso para ver los cálculos</p>}
      {valid && (
        <div style={{ display:"grid", gridTemplateColumns: ind&&cri?"1fr 1fr":"1fr", gap:10, marginBottom:10 }}>
          {ind && <Section label="DOSIS INDUCCIÓN" color="#a78bfa"><div style={{ fontSize:16, fontWeight:800, color:"#e8edf5" }}>{fmt(ind.loMg,1)}–{fmt(ind.hiMg,1)} {ind.unit==="mcg/kg"?"mcg":"mg"}</div><div style={{ fontSize:12, color:"#a78bfa", marginTop:3 }}>{fmt(ind.loMl,2)}–{fmt(ind.hiMl,2)} mL</div></Section>}
          {cri && <Section label={`CRI (${drug.cri.unit})`} color="#22d3ee"><div style={{ fontSize:15, fontWeight:800, color:"#e8edf5" }}>{fmt(cri.loMlhr,2)}–{fmt(cri.hiMlhr,2)} mL/hr</div><div style={{ fontSize:11, color:"#22d3ee", marginTop:3 }}>{fmt(cri.loMcghr,1)}–{fmt(cri.hiMcghr,1)} {cri.unit.startsWith("mcg")?"mcg":"mg"}/hr</div></Section>}
        </div>
      )}
      <button onClick={() => setShowDil(s=>!s)} style={{ background:"transparent", border:"1px solid #1a3060", color:"#4a6a9f", borderRadius:8, padding:"5px 12px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
        {showDil?"▲ Ocultar dilución":"▼ Ver dilución"}
      </button>
      {showDil && <div style={{ marginTop:10, padding:"10px 14px", background:"#040c1c", borderRadius:8, fontSize:12, color:"#7aa2d4", lineHeight:1.7, borderLeft:"3px solid #1a3060" }}>{drug.dilucion}</div>}
    </div>
  );
}

function SRITab({ weight }) {
  const [sel, setSel] = useState({ ind:null, anal:null, bnm:null });
  const valid = weight > 0;
  function pick(g, d) { setSel(p=>({...p,[g]:p[g]?.name===d.name?null:d})); }
  const colors = { ind:"#a78bfa", anal:"#22d3ee", bnm:"#34d399" };
  const labels = { ind:"1. Inductor", anal:"2. Analgesia", bnm:"3. Bloqueador neuromuscular" };
  const allSel = sel.ind && sel.anal && sel.bnm;

  function calcDose(d) {
    if (!valid || !d) return null;
    const isMcg = d.unit==="mcg/kg", f = isMcg?0.001:1;
    const loMg=d.lo*weight*f, hiMg=d.hi*weight*f;
    return { loMg, hiMg, loMl: loMg/d.conc, hiMl: hiMg/d.conc, isMcg };
  }

  return (
    <div>
      {["ind","anal","bnm"].map(g => (
        <div key={g} style={{ background:"#0b1730", border:`1px solid ${sel[g]?"#1a3060":"#1a3060"}`, borderRadius:14, padding:"16px 18px", marginBottom:12 }}>
          <div style={{ fontSize:10, color:colors[g], letterSpacing:2, fontWeight:700, marginBottom:10 }}>{labels[g].toUpperCase()}</div>
          {SRI_DRUGS[g].map(d => {
            const isSelected = sel[g]?.name===d.name;
            const dose = isSelected ? calcDose(d) : null;
            return (
              <button key={d.name} onClick={()=>pick(g,d)} style={{ width:"100%", textAlign:"left", background: isSelected?colors[g]+"22":"#060d1f", border: isSelected?`1px solid ${colors[g]}`:"1px solid #1a3060", borderRadius:10, padding:"10px 14px", cursor:"pointer", marginBottom:6, fontFamily:"inherit" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700, color: isSelected?colors[g]:"#e8edf5" }}>{d.name}</span>
                  <span style={{ fontSize:11, background:"#040c1c", borderRadius:20, padding:"2px 10px", color: isSelected?colors[g]:"#4a6a9f" }}>{d.lo}–{d.hi} {d.unit}</span>
                </div>
                {isSelected && valid && dose && (
                  <div style={{ marginTop:6, fontSize:12, color:colors[g] }}>
                    {fmt(dose.loMg,1)}–{fmt(dose.hiMg,1)} {dose.isMcg?"mcg":"mg"} · {fmt(dose.loMl,2)}–{fmt(dose.hiMl,2)} mL
                  </div>
                )}
                <div style={{ fontSize:11, color:"#4a6a9f", marginTop:4 }}>{d.nota}</div>
              </button>
            );
          })}
        </div>
      ))}
      {allSel && valid && (
        <div style={{ background:"#040c1c", border:"1px solid #22d3ee44", borderRadius:14, padding:"18px" }}>
          <div style={{ fontSize:10, color:"#22d3ee", letterSpacing:2, fontWeight:700, marginBottom:14 }}>RESUMEN SRI — {weight} kg</div>
          {[["ind","Inductor"],["anal","Analgesia"],["bnm","BNM"]].map(([g,label]) => {
            const d=sel[g], dose=calcDose(d);
            return (
              <div key={g} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #1a3060" }}>
                <div style={{ fontSize:10, color:colors[g], fontWeight:700, minWidth:64 }}>{label}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#e8edf5" }}>{d.name}</div>
                  <div style={{ fontSize:12, color:colors[g], marginTop:2 }}>{fmt(dose.loMg,1)}–{fmt(dose.hiMg,1)} {dose.isMcg?"mcg":"mg"} · {fmt(dose.loMl,2)}–{fmt(dose.hiMl,2)} mL</div>
                </div>
              </div>
            );
          })}
          <button onClick={()=>setSel({ind:null,anal:null,bnm:null})} style={{ marginTop:12, background:"transparent", border:"1px solid #1a3060", color:"#4a6a9f", borderRadius:8, padding:"6px 16px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Reiniciar</button>
        </div>
      )}
      {!valid && <div style={{ color:"#3a5a8f", fontSize:12, fontStyle:"italic", textAlign:"center", padding:16 }}>Ingresa el peso arriba para ver las dosis calculadas</div>}
    </div>
  );
}

function CustomCRI({ weight }) {
  const [state, setState] = useState({ drug:"", dose:"", unit:"mcg/kg/min", conc:"", vol:"50" });
  const valid = weight > 0;
  function set(k,v) { setState(p=>({...p,[k]:v})); }
  const d=parseFloat(state.dose), c=parseFloat(state.conc), v=parseFloat(state.vol);
  let result=null;
  if(valid&&d>0&&c>0&&v>0){
    const concDil=(c*1000)/v;
    if(state.unit==="mcg/kg/min") result={mlhr:(d*weight*60)/concDil,totalPerMin:d*weight,totalPerHr:d*weight*60};
    else if(state.unit==="mg/kg/hr") result={mlhr:(d*weight*1000)/concDil,totalPerMin:(d*weight*1000)/60,totalPerHr:d*weight*1000};
    else if(state.unit==="mcg/kg/hr") result={mlhr:(d*weight)/concDil,totalPerMin:(d*weight)/60,totalPerHr:d*weight};
  }
  const inp = { display:"block", width:"100%", marginTop:6, background:"#040c1c", border:"1px solid #1a3060", borderRadius:8, color:"#e8edf5", fontSize:14, padding:"9px 13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  return (
    <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"20px" }}>
      <div style={{ fontSize:11, color:"#34d399", letterSpacing:2, marginBottom:16 }}>INFUSIÓN PERSONALIZADA</div>
      <div style={{ marginBottom:14 }}><label style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>FÁRMACO</label><input value={state.drug} onChange={e=>set("drug",e.target.value)} placeholder="Ej: Vasopresina..." style={inp}/></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div><label style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>DOSIS DESEADA</label><input type="number" value={state.dose} onChange={e=>set("dose",e.target.value)} placeholder="0.1" style={inp}/></div>
        <div><label style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>UNIDAD</label><select value={state.unit} onChange={e=>set("unit",e.target.value)} style={{...inp,marginTop:6}}><option>mcg/kg/min</option><option>mcg/kg/hr</option><option>mg/kg/hr</option></select></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div><label style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>CONC. DILUCIÓN (mg/mL)</label><input type="number" value={state.conc} onChange={e=>set("conc",e.target.value)} placeholder="mg totales" style={inp}/></div>
        <div><label style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>VOLUMEN JERINGA (mL)</label><input type="number" value={state.vol} onChange={e=>set("vol",e.target.value)} placeholder="50" style={inp}/></div>
      </div>
      {result && (
        <div style={{ background:"#040c1c", borderRadius:10, padding:"16px", border:"1px solid #34d39944" }}>
          <div style={{ fontSize:10, color:"#34d399", letterSpacing:2, marginBottom:12 }}>✓ {state.drug||"Fármaco"} — {weight} kg</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[{label:"VELOCIDAD",value:fmt(result.mlhr,2)+" mL/hr",accent:"#34d399"},{label:"DOSIS/min",value:fmt(result.totalPerMin,2)+" mcg/min",accent:"#22d3ee"},{label:"DOSIS/hr",value:fmt(result.totalPerHr,1)+" mcg/hr",accent:"#a78bfa"}].map(item=>(
              <div key={item.label} style={{ background:"#0b1730", borderRadius:8, padding:"10px", borderTop:`2px solid ${item.accent}` }}>
                <div style={{ fontSize:9, color:item.accent, letterSpacing:1, marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:800, color:"#e8edf5" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GlasgowTab() {
  const [sc, setSc] = useState({E:0,V:0,M:0});
  function select(g,v) { setSc(p=>({...p,[g]:v})); }
  const {E,V,M}=sc, total=E&&V&&M?E+V+M:null;
  let color="#4a6a9f", interp="Selecciona E + V + M", rec="";
  if(total!==null){
    if(total>=13){color="#22c55e";interp="TEC leve";rec="Observación · TAC según criterios clínicos";}
    else if(total>=9){color="#f59e0b";interp="TEC moderado";rec="Hospitalización · TAC · monitorización neurológica";}
    else{color="#ef4444";interp="TEC grave — considerar intubación";rec="IOT si GCS ≤ 8 · UCI · neurocirugía";}
  }
  const BtnG=({group,val,label})=>(
    <button onClick={()=>select(group,val)} style={{ width:"100%", textAlign:"left", background:sc[group]===val?color+"22":"#060d1f", border:sc[group]===val?`1px solid ${color}`:"1px solid #1a3060", borderRadius:8, padding:"9px 12px", cursor:"pointer", marginBottom:5, display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"inherit" }}>
      <span style={{ fontSize:13, color:sc[group]===val?color:"#e8edf5" }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, background:"#06101f", borderRadius:20, padding:"2px 9px", color:sc[group]===val?color:"#4a6a9f" }}>{val}</span>
    </button>
  );
  return (
    <div>
      <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px 18px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"center", minWidth:64 }}>
            <div style={{ fontSize:44, fontWeight:800, lineHeight:1, color:total?color:"#3a5a8f" }}>{total||"—"}</div>
            <div style={{ fontSize:12, color:"#4a6a9f", marginTop:2 }}>/ 15</div>
          </div>
          <div style={{ flex:1, borderLeft:"1px solid #1a3060", paddingLeft:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:total?color:"#4a6a9f" }}>{interp}</div>
            <div style={{ fontSize:12, color:"#4a6a9f", marginTop:3 }}>E: {E||"—"} &nbsp; V: {V||"—"} &nbsp; M: {M||"—"}</div>
            {rec&&<div style={{ fontSize:12, color:"#7aa2d4", marginTop:3 }}>{rec}</div>}
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
        <div>
          <div style={{ fontSize:10, color:"#a78bfa", letterSpacing:2, marginBottom:8, fontWeight:700, textAlign:"center" }}>👁 APERTURA OCULAR</div>
          <BtnG group="E" val={4} label="Espontánea"/><BtnG group="E" val={3} label="Al sonido"/><BtnG group="E" val={2} label="A la presión"/><BtnG group="E" val={1} label="Ausente"/>
        </div>
        <div>
          <div style={{ fontSize:10, color:"#22d3ee", letterSpacing:2, marginBottom:8, fontWeight:700, textAlign:"center" }}>💬 VERBAL</div>
          <BtnG group="V" val={5} label="Orientado"/><BtnG group="V" val={4} label="Confuso"/><BtnG group="V" val={3} label="Palabras"/><BtnG group="V" val={2} label="Sonidos"/><BtnG group="V" val={1} label="Ausente"/>
        </div>
        <div>
          <div style={{ fontSize:10, color:"#34d399", letterSpacing:2, marginBottom:8, fontWeight:700, textAlign:"center" }}>✋ MOTORA</div>
          <BtnG group="M" val={6} label="Obedece"/><BtnG group="M" val={5} label="Localiza"/><BtnG group="M" val={4} label="Flex. normal"/><BtnG group="M" val={3} label="Flex. anormal"/><BtnG group="M" val={2} label="Extensión"/><BtnG group="M" val={1} label="Ausente"/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0, borderRadius:10, overflow:"hidden" }}>
        <div style={{ background:"#052a10", padding:"10px", textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>Leve</div><div style={{ fontSize:12, color:"#22c55e" }}>13 – 15</div></div>
        <div style={{ background:"#2a1a00", padding:"10px", textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:"#f59e0b" }}>Moderado</div><div style={{ fontSize:12, color:"#f59e0b" }}>9 – 12</div></div>
        <div style={{ background:"#2a0505", padding:"10px", textAlign:"center" }}><div style={{ fontSize:13, fontWeight:700, color:"#ef4444" }}>Grave</div><div style={{ fontSize:12, color:"#ef4444" }}>3 – 8</div></div>
      </div>
      <button onClick={()=>setSc({E:0,V:0,M:0})} style={{ marginTop:12, background:"transparent", border:"1px solid #1a3060", color:"#4a6a9f", borderRadius:8, padding:"6px 16px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Reiniciar</button>
    </div>
  );
}

function SedacionTab({ weight }) {
  const [subTab, setSubTab] = useState(0);
  const valid = weight > 0;
  const w = weight;

  const FP_F=[0.6,1.2,1.8,1.8,2.4,2.4,3.0,3.0,3.6,3.6,3.6,3.6];
  const FP_P=[null,null,null,0.5,0.5,1,1,1.5,1.5,2,2.5,3];
  const FD_F=[0.3,0.6,1.2,1.2,1.2,1.2,1.8,1.8,1.8,2.4,2.4,2.4];
  const FD_D=[null,null,null,0.2,0.4,0.6,0.6,0.8,1.0,1.0,1.2,1.5];
  const FM_F=[0.6,1.2,1.8,1.8,2.4,2.4,3.0,3.0,3.6,3.6,3.6,3.6];
  const FM_M=[0,0,0,0.015,0.015,0.03,0.03,0.045,0.045,0.06,0.075,0.09];
  const ACT_F=[0.6,1.2,1.8,2.4,3.0,3.6];
  const DEX=[0.2,0.5,0.8,1.0,1.2,1.5];
  const PROP=[0.5,1.0,1.5,2.0,2.5,3.0];

  function fmtEsc(base, w, unit) {
    if (!valid) return fmt(base, unit==="mg/kg/h"&&base<0.1?3:1);
    return fmt(base*w, 0)+" ("+fmt(base, base<0.1?3:1)+")";
  }

  const subTabs = ["Protocolo original","Protocolo actualizado","Decisión","SAS / RASS"];

  const thStyle = { background:"#06101f", padding:"6px 8px", textAlign:"center", fontWeight:700, fontSize:10, color:"#4a6a9f", border:"1px solid #1a3060", letterSpacing:1 };
  const tdStyle = { padding:"7px 8px", textAlign:"center", border:"1px solid #1a3060", color:"#e8edf5", fontSize:12 };
  const tdInit = { ...tdStyle, background:"#0d2a4e", color:"#22d3ee", fontWeight:700 };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:16 }}>
        {subTabs.map((t,i)=>(
          <button key={i} onClick={()=>setSubTab(i)} style={{ padding:"8px 4px", borderRadius:8, fontSize:10, fontFamily:"inherit", fontWeight:700, cursor:"pointer", textAlign:"center", border:subTab===i?"1px solid #22d3ee":"1px solid #1a3060", background:subTab===i?"#0d2a4e":"#0b1730", color:subTab===i?"#22d3ee":"#3a5a8f" }}>{t}</button>
        ))}
      </div>

      {subTab===0 && (
        <div>
          <p style={{ fontSize:12, color:"#4a6a9f", marginBottom:12 }}>Protocolo HCUCH pre-actualización. Inicio en escalón 3. {valid&&`Dosis calculadas para ${w} kg.`}</p>
          {[["Fentanilo / Propofol","#4a9eff",FP_F,FP_P,"Propofol mg/kg/h","mg/h"],["Fentanilo / Dexmedetomidina","#f59e0b",FD_F,FD_D,"Dexmedetomidina µg/kg/h","µg/h"],["Fentanilo / Midazolam","#ef4444",FM_F,FM_M,"Midazolam mg/kg/h","mg/h"]].map(([title,color,fArr,sArr,secLabel])=>(
            <div key={title} style={{ background:"#0b1730", border:`1px solid #1a3060`, borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
              <div style={{ fontSize:11, color, letterSpacing:2, fontWeight:700, marginBottom:10 }}>{title.toUpperCase()}</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead>
                    <tr><th style={thStyle}>Escalón</th>{[1,2,3,4,5,6,7,8,9,10,11,12].map(n=><th key={n} style={n===3?{...thStyle,background:"#0d2a4e",color:"#22d3ee"}:thStyle}>{n}{n===3&&" ★"}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td style={{...tdStyle,textAlign:"left",fontWeight:700,fontSize:11}}>Fentanilo<br/><span style={{fontSize:10,color:"#4a6a9f"}}>µg/kg/h</span></td>{fArr.map((v,i)=><td key={i} style={i===2?tdInit:tdStyle}>{fmtEsc(v,w,"µg/kg/h")}</td>)}</tr>
                    <tr><td style={{...tdStyle,textAlign:"left",fontWeight:700,fontSize:11}}>{secLabel.split(" ")[0]}<br/><span style={{fontSize:10,color:"#4a6a9f"}}>{secLabel.split(" ").slice(1).join(" ")}</span></td>{sArr.map((v,i)=><td key={i} style={i===2?tdInit:tdStyle}>{v===null?"—":fmtEsc(v,w,secLabel.includes("mg")?"mg/kg/h":"µg/kg/h")}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab===1 && (
        <div>
          <p style={{ fontSize:12, color:"#4a6a9f", marginBottom:12 }}>Protocolo actualizado HCUCH 2019. Analgesia y sedación se titulan de forma independiente. Paracetamol 1g/8h cuando disponible.</p>
          <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:"#0d2a4e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#22d3ee" }}>1</div>
              <div style={{ fontSize:11, color:"#22d3ee", letterSpacing:2, fontWeight:700 }}>ESCALÓN ANALGESIA — FENTANILO (µg/kg/h)</div>
            </div>
            <div style={{ fontSize:11, color:"#4a6a9f", marginBottom:8 }}>Inicio escalón 1 → sedación superficial · Inicio escalón 2 → sedación profunda</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr><th style={thStyle}>Escalón</th>{[1,2,3,4,5,6].map(n=><th key={n} style={thStyle}>{n}</th>)}</tr></thead>
                <tbody><tr><td style={{...tdStyle,textAlign:"left",fontWeight:700}}>Fentanilo µg/kg/h</td>{ACT_F.map((v,i)=><td key={i} style={tdStyle}>{fmtEsc(v,w,"µg/kg/h")}</td>)}</tr></tbody>
              </table>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"14px 16px" }}>
              <div style={{ fontSize:10, color:"#22c55e", letterSpacing:2, fontWeight:700, marginBottom:6 }}>SEDACIÓN SUPERFICIAL<br/>Meta SAS 3–4 · Inicio escalón 3</div>
              <div style={{ fontSize:10, color:"#4a6a9f", marginBottom:8 }}>Dexmedetomidina µg/kg/h</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead><tr>{[1,2,3,4,5,6].map(n=><th key={n} style={n===3?{...thStyle,background:"#0d2a4e",color:"#22d3ee"}:thStyle}>{n}{n===3&&"★"}</th>)}</tr></thead>
                  <tbody><tr>{DEX.map((v,i)=><td key={i} style={i===2?tdInit:tdStyle}>{fmtEsc(v,w,"µg/kg/h")}</td>)}</tr></tbody>
                </table>
              </div>
            </div>
            <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"14px 16px" }}>
              <div style={{ fontSize:10, color:"#ef4444", letterSpacing:2, fontWeight:700, marginBottom:6 }}>SEDACIÓN PROFUNDA<br/>Meta SAS 1–2 · Inicio escalón 3</div>
              <div style={{ fontSize:10, color:"#4a6a9f", marginBottom:8 }}>Propofol mg/kg/h</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                  <thead><tr>{[1,2,3,4,5,6].map(n=><th key={n} style={n===3?{...thStyle,background:"#0d2a4e",color:"#22d3ee"}:thStyle}>{n}{n===3&&"★"}</th>)}</tr></thead>
                  <tbody><tr>{PROP.map((v,i)=><td key={i} style={i===2?tdInit:tdStyle}>{fmtEsc(v,w,"mg/kg/h")}</td>)}</tr></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab===2 && (
        <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px" }}>
          <div style={{ textAlign:"center", fontSize:13, fontWeight:700, marginBottom:12 }}>Paciente ≥18 años con necesidad de VM &gt;48h</div>
          <div style={{ background:"#040c1c", borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:6, color:"#e8edf5" }}>¿El paciente presenta alguna de estas condiciones?</div>
            <div style={{ fontSize:12, color:"#7aa2d4", lineHeight:1.9 }}>
              1. Insuf. respiratoria aguda/crónica descompensada moderada-severa (PaO₂/FiO₂ &lt;150)<br/>
              2. Shock severo (NA &gt;0.3 µg/min y/o Lactato &gt;4.0 mmol/L)<br/>
              3. Hipertensión intracraneana<br/>
              4. Estatus convulsivo<br/>
              5. Síndrome compartimental del abdomen
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
            {[["NO","#22c55e","Sedación superficial","Meta SAS 3–4","Escalón 1 Fentanilo + Escalón 3 Dexmedetomidina"],["NO SEGURO","#f59e0b","Evaluar con equipo","Iniciar superficial","Reevaluar c/6h"],["SÍ","#ef4444","Sedación profunda","Meta SAS 1–2","Escalón 2 Fentanilo + Escalón 3 Propofol"]].map(([tag,color,t1,t2,t3])=>(
              <div key={tag} style={{ background:color+"11", border:`1px solid ${color}44`, borderRadius:10, padding:"12px", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color }}>{tag}</div>
                <div style={{ fontSize:13, fontWeight:700, color, marginTop:4 }}>{t1}</div>
                <div style={{ fontSize:11, color, marginTop:2 }}>{t2}</div>
                <div style={{ fontSize:10, color, marginTop:6 }}>{t3}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#040c1c", borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#e8edf5", marginBottom:6 }}>Evaluar meta SAS c/6h</div>
            <div style={{ fontSize:12, color:"#7aa2d4", lineHeight:1.8 }}>
              ✓ Meta cumplida → Mantener esquema<br/>
              ✗ SAS ≥5 → Titular según escalones / considerar asociación de sedantes<br/>
              ✗ SAS 1–2 en meta superficial → Bajar 1 escalón
            </div>
          </div>
        </div>
      )}

      {subTab===3 && (
        <div>
          <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px", marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#22d3ee", letterSpacing:2, fontWeight:700, marginBottom:10 }}>SEDATION-AGITATION SCALE (SAS)</div>
            <div style={{ fontSize:11, color:"#4a6a9f", marginBottom:10 }}>1–2 = Sedación profunda · 3–4 = Sedación superficial · 5–7 = Agitación</div>
            {[[1,"No despertable","Se mueve o gesticula levemente con estímulos dolorosos.","#ef4444"],[2,"Muy sedado","Puede despertar con estímulo físico. No comunica ni obedece órdenes.","#ef4444"],[3,"Sedado","Difícil de despertar. Obedece órdenes sencillas.","#22c55e"],[4,"Calmado y cooperador","Fácilmente despertable. Obedece órdenes.","#22c55e"],[5,"Agitado","Ansioso. Intenta sentarse, se calma con estímulo verbal.","#f59e0b"],[6,"Muy agitado","Muerde TET. Necesita contención física.","#f59e0b"],[7,"Agitación peligrosa","Intenta retirar TET y catéteres. Arremete contra el personal.","#ef4444"]].map(([n,term,desc,color])=>(
              <div key={n} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:"1px solid #1a3060" }}>
                <div style={{ minWidth:30, height:30, borderRadius:8, background:color+"22", border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, color }}>{n}</div>
                <div><div style={{ fontSize:13, fontWeight:700, color:"#e8edf5" }}>{term}</div><div style={{ fontSize:12, color:"#7aa2d4", marginTop:2 }}>{desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px" }}>
            <div style={{ fontSize:11, color:"#a78bfa", letterSpacing:2, fontWeight:700, marginBottom:10 }}>RICHMOND AGITATION-SEDATION SCALE (RASS)</div>
            <div style={{ fontSize:11, color:"#4a6a9f", marginBottom:10 }}>Meta UCI: –2 a 0 · Sedación profunda: –3 a –5 · Agitación: +1 a +4</div>
            {[["+4","Combativo","Violento, peligro inmediato para el personal","#ef4444"],["+3","Muy agitado","Agresivo, intenta retirar tubos/catéteres","#ef4444"],["+2","Agitado","Movimientos frecuentes, lucha con el ventilador","#f59e0b"],["+1","Inquieto","Ansioso, movimientos no agresivos","#f59e0b"],["0","Alerta y calmado","Estado normal","#22c55e"],["-1","Somnoliento","No completamente alerta, se mantiene despierto >10 seg","#22c55e"],["-2","Sedación leve","Despierta brevemente (<10 seg) con voz, contacto visual","#22d3ee"],["-3","Sedación moderada","Movimiento o apertura ocular a la voz. Sin contacto visual","#22d3ee"],["-4","Sedación profunda","Sin respuesta a voz. Responde a estímulo físico","#ef4444"],["-5","No despertable","Sin respuesta a voz ni estímulo físico","#ef4444"]].map(([n,term,desc,color])=>(
              <div key={n} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"7px 0", borderBottom:"1px solid #1a3060" }}>
                <div style={{ minWidth:34, height:28, borderRadius:8, background:color+"22", border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color }}>{n}</div>
                <div><div style={{ fontSize:13, fontWeight:700, color:"#e8edf5" }}>{term}</div><div style={{ fontSize:11, color:"#7aa2d4", marginTop:1 }}>{desc}</div></div>
              </div>
            ))}
            <div style={{ marginTop:10, padding:"10px 12px", background:"#040c1c", borderRadius:8, fontSize:11, color:"#7aa2d4" }}>
              <strong style={{ color:"#e8edf5" }}>Equivalencia SAS/RASS:</strong> SAS 1–2 ≈ RASS –4/–5 · SAS 3 ≈ RASS –2/–3 · SAS 4 ≈ RASS 0/–1 · SAS 5–7 ≈ RASS +1/+4
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcedimientosTab({ weight }) {
  const [sel, setSel] = useState(null);
  const valid = weight > 0;

  function calcDose(d) {
    if (!valid) return null;
    const isMcg = d.unit === "mcg/kg", f = isMcg ? 0.001 : 1;
    const loMg = d.lo * weight * f, hiMg = d.hi * weight * f;
    return { loMg, hiMg, loMl: loMg / d.conc, hiMl: hiMg / d.conc, isMcg };
  }

  return (
    <div>
      <p style={{ fontSize:12, color:"#4a6a9f", marginBottom:14 }}>Sedación de corta duración para procedimientos. Selecciona un fármaco para ver la dosis calculada.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {PROC_DRUGS.map(d => {
          const isSelected = sel?.name === d.name;
          const dose = isSelected ? calcDose(d) : null;
          return (
            <div key={d.name} onClick={()=>setSel(isSelected?null:d)}
              style={{ background: isSelected?d.color+"18":"#0b1730", border:`1px solid ${isSelected?d.color:"#1a3060"}`, borderRadius:12, padding:"14px", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:14, fontWeight:700, color: isSelected?d.color:"#e8edf5" }}>{d.name}</span>
                <span style={{ fontSize:10, background:"#040c1c", borderRadius:20, padding:"2px 8px", color:"#4a6a9f" }}>{d.duracion}</span>
              </div>
              <div style={{ fontSize:11, color:"#4a6a9f", marginBottom:8, lineHeight:1.5 }}>{d.indicacion}</div>
              <div style={{ fontSize:11, color: isSelected?d.color:"#3a5a8f", background:"#040c1c", borderRadius:6, padding:"4px 8px", display:"inline-block" }}>
                {d.lo}–{d.hi} {d.unit}
              </div>
              {isSelected && valid && dose && (
                <div style={{ marginTop:10, padding:"10px 12px", background:"#040c1c", borderRadius:8, borderLeft:`3px solid ${d.color}` }}>
                  <div style={{ fontSize:10, color:d.color, letterSpacing:1, marginBottom:4 }}>DOSIS CALCULADA — {weight} kg</div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#e8edf5" }}>{fmt(dose.loMg,2)}–{fmt(dose.hiMg,2)} {dose.isMcg?"mcg":"mg"}</div>
                  <div style={{ fontSize:12, color:d.color, marginTop:2 }}>{fmt(dose.loMl,2)}–{fmt(dose.hiMl,2)} mL</div>
                </div>
              )}
              {isSelected && !valid && (
                <div style={{ marginTop:8, fontSize:12, color:"#3a5a8f", fontStyle:"italic" }}>Ingresa el peso arriba para calcular</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:14, padding:"12px 16px", background:"#0b1730", border:"1px solid #1a3060", borderRadius:10, fontSize:11, color:"#4a6a9f", lineHeight:1.8 }}>
        <strong style={{ color:"#e8edf5" }}>Recordar siempre:</strong> monitorización continua · vía aérea disponible · revertir si necesario · dosis según respuesta clínica
      </div>
    </div>
  );
}

const TABS = ["💉 SRI","🩸 DVA","⚗️ CRI","🧠 Glasgow","🛏️ Sedación UCI","🔧 Procedimientos"];

export default function App() {
  const [weight, setWeight] = useState("");
  const [tab, setTab] = useState(0);
  const w = parseFloat(weight);
  const valid = w > 0 && w < 250;

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 20% 0%, #0d1f40 0%, #050d1c 60%)", color:"#e8edf5", fontFamily:"'IBM Plex Mono','Courier New',monospace", paddingBottom:60 }}>
      <div style={{ background:"linear-gradient(180deg,#0a1a38 0%,#050d1c 100%)", borderBottom:"1px solid #1a3060", padding:"20px 20px 16px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ fontSize:10, color:"#22d3ee", letterSpacing:3, marginBottom:4 }}>ANESTESIOLOGÍA · URGENCIAS · UCI</div>
          <div style={{ fontSize:22, fontWeight:800 }}>💉 Suite Clínica</div>
          <div style={{ fontSize:11, color:"#3a5a8f", marginTop:2 }}>SRI · DVA · CRI · Glasgow · Sedación · Procedimientos</div>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"20px 16px 0" }}>
        <div style={{ background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:10, color:"#22d3ee", letterSpacing:2, marginBottom:6 }}>PESO DEL PACIENTE</div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="70"
                style={{ width:100, background:"#040c1c", border:"1px solid #1a4080", borderRadius:8, color:"#22d3ee", fontSize:26, fontWeight:800, padding:"6px 14px", outline:"none", fontFamily:"inherit" }}/>
              <span style={{ fontSize:18, color:"#22d3ee", fontWeight:700 }}>kg</span>
            </div>
          </div>
          {valid && <div style={{ marginLeft:"auto", textAlign:"right" }}><div style={{ fontSize:10, color:"#34d399", letterSpacing:2 }}>ACTIVO</div><div style={{ fontSize:22, fontWeight:800, color:"#34d399" }}>{w} kg</div></div>}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:20 }}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{ padding:"10px 4px", borderRadius:10, fontSize:10, fontFamily:"inherit", fontWeight:700, cursor:"pointer", textAlign:"center", lineHeight:1.4, border:tab===i?"1px solid #22d3ee":"1px solid #1a3060", background:tab===i?"#0d2a4e":"#0b1730", color:tab===i?"#22d3ee":"#3a5a8f" }}>{t}</button>
          ))}
        </div>

        {tab===0 && <SRITab weight={valid?w:0}/>}
        {tab===1 && DRUGS_VASOA.map(d=><DrugCard key={d.name} drug={d} weight={valid?w:0}/>)}
        {tab===2 && <CustomCRI weight={valid?w:0}/>}
        {tab===3 && <GlasgowTab/>}
        {tab===4 && <SedacionTab weight={valid?w:0}/>}
        {tab===5 && <ProcedimientosTab weight={valid?w:0}/>}

        <div style={{ marginTop:24, padding:"12px 16px", background:"#08111f", border:"1px solid #1a2a4f", borderRadius:10, fontSize:11, color:"#2a4a7f", lineHeight:1.7 }}>
          ⚠️ Herramienta de apoyo clínico. Verificar siempre con protocolos institucionales y criterio médico.
        </div>
      </div>
    </div>
  );
}

