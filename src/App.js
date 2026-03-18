/* eslint-disable */
import { useState } from "react";

const DRUGS_VASOA = [
  { name:"Norepinefrina", conc_mg_ml:1, ind:null, cri:{lo:0.02,hi:3,unit:"mcg/kg/min"}, dilucion:"Diluir en SG5% (preferido). 8 mg en 50 mL (160 mcg/mL) o 16 mg en 100 mL. Vía central preferible.", nota:"Primera línea en shock séptico. Sin ajuste renal/hepático." },
  { name:"Epinefrina", conc_mg_ml:1, ind:{lo:0.01,hi:0.01,unit:"mg/kg"}, cri:{lo:0.01,hi:1,unit:"mcg/kg/min"}, dilucion:"Diluir en SG5%. 4 mg en 50 mL (80 mcg/mL) o 8 mg en 100 mL.", nota:"Shock refractario con bajo GC, anafilaxia. Vigilar taquiarritmias e hiperlactatemia." },
  { name:"Dobutamina", conc_mg_ml:12.5, ind:null, cri:{lo:2.5,hi:20,unit:"mcg/kg/min"}, dilucion:"250 mg en 50 mL o 500 mg en 250 mL en SG5% o SF.", nota:"Inotrópico puro. Shock cardiogénico con bajo GC. Vigilar arritmias e hipotensión." },
  { name:"Dopamina", conc_mg_ml:40, ind:null, cri:{lo:2,hi:20,unit:"mcg/kg/min"}, dilucion:"400 mg en 250 mL SF o SG5% (1600 mcg/mL).", nota:"⚠️ Las guías actuales (SSC 2021) desaconsejan su uso en shock séptico. Preferir Norepinefrina." },
  { name:"Milrinona", conc_mg_ml:1, ind:null, cri:{lo:0.25,hi:0.75,unit:"mcg/kg/min"}, dilucion:"10 mg en 50 mL SF (200 mcg/mL). Evitar bolo en hipotensos. Vía central.", nota:"⚠️ Disponibilidad variable. Inodilatador. Útil en shock cardiogénico con HTP/VD. Ajustar en IR." },
  { name:"Vasopresina", conc_mg_ml:20, ind:null, cri:{lo:0.01,hi:0.04,unit:"U/min"}, dilucion:"20 UI en 50 mL SF (0.4 UI/mL). CVC OBLIGATORIA.", nota:"Dosis fija 0.03–0.04 U/min. No titular. Segunda línea en shock séptico refractario." },
  { name:"Azul de metileno", conc_mg_ml:5, ind:null, cri:{lo:0.25,hi:2,unit:"mcg/kg/min"}, dilucion:"50 mg en 50 mL SG5% (1000 mcg/mL). Infusión 1–4 horas.", nota:"Inhibidor de óxido nítrico. Shock vasodilatador refractario." },
];

const DVA_PREP = {
  'Norepinefrina':{ ampolla:'4 mg/4 mL (1 mg/mL)', preparaciones:[{vol:'50 mL',mg:'8 mg (2 amp)',conc:'160 mcg/mL',nota:'Jeringa estándar UCI'},{vol:'100 mL',mg:'16 mg (4 amp)',conc:'160 mcg/mL',nota:'Fleboclisis'},{vol:'250 mL',mg:'8 mg (2 amp)',conc:'32 mcg/mL',nota:'Fleboclisis diluida'}], disolvente:'SG5% (preferido)', nota:'No mezclar con soluciones alcalinas. Usar vía central.' },
  'Epinefrina':{ ampolla:'1 mg/1 mL', preparaciones:[{vol:'50 mL',mg:'4 mg (4 amp)',conc:'80 mcg/mL',nota:'Jeringa estándar UCI'},{vol:'100 mL',mg:'8 mg (8 amp)',conc:'80 mcg/mL',nota:'Fleboclisis'}], disolvente:'SG5% (preferido)', nota:'Efecto α y β. Usar en shock anafiláctico o refractario.' },
  'Dobutamina':{ ampolla:'250 mg/20 mL (12.5 mg/mL)', preparaciones:[{vol:'50 mL',mg:'250 mg (1 amp + 30 mL)',conc:'5000 mcg/mL',nota:'Jeringa estándar'},{vol:'250 mL',mg:'500 mg (2 amp)',conc:'2000 mcg/mL',nota:'Fleboclisis'}], disolvente:'SG5% o SF 0.9%', nota:'Inotrópico puro. Vigilar arritmias e hipotensión.' },
  'Dopamina':{ ampolla:'200 mg/5 mL (40 mg/mL)', preparaciones:[{vol:'250 mL',mg:'400 mg (2 amp)',conc:'1600 mcg/mL',nota:'Fleboclisis estándar'}], disolvente:'SG5% o SF 0.9%', nota:'⚠️ Desaconsejada en shock séptico (SSC 2021).' },
  'Milrinona':{ ampolla:'10 mg/10 mL (1 mg/mL)', preparaciones:[{vol:'50 mL',mg:'10 mg (1 amp + 40 mL)',conc:'200 mcg/mL',nota:'Jeringa estándar'},{vol:'100 mL',mg:'20 mg (2 amp)',conc:'200 mcg/mL',nota:'Fleboclisis'}], disolvente:'SF 0.9% o SG5%', nota:'⚠️ Disponibilidad variable. Evitar bolo en hipotensos. Vía central.' },
  'Vasopresina':{ ampolla:'20 UI/mL', preparaciones:[{vol:'50 mL',mg:'20 UI (1 amp + 49 mL SF)',conc:'0.4 UI/mL',nota:'Jeringa estándar'},{vol:'100 mL',mg:'40 UI (2 amp)',conc:'0.4 UI/mL',nota:'Fleboclisis'}], disolvente:'SF 0.9% o SG5%', nota:'Dosis fija. No titular. Se agrega a Norepinefrina.' },
  'Azul de metileno':{ ampolla:'50 mg/10 mL (5 mg/mL)', preparaciones:[{vol:'50 mL',mg:'50 mg (1 amp + 40 mL)',conc:'1000 mcg/mL',nota:'Infusión habitual'}], disolvente:'SG5%', nota:'Infusión 1–4 horas. Puede teñir orina de azul.' },
};

const DVA_ESCALA = {
  'Norepinefrina':[{at:0.2,color:'warning',title:'Umbral de escalada',body:'Norepinefrina ≥0.2 mcg/kg/min → Agregar Vasopresina 0.03–0.04 U/min (SSC 2021)'},{at:0.5,color:'danger',title:'Shock refractario',body:'Considerar Epinefrina o Azul de metileno. Evaluar causa reversible.'}],
  'Epinefrina':[{at:0.5,color:'warning',title:'Dosis alta',body:'Epinefrina >0.5 mcg/kg/min → vigilar hiperlactatemia, arritmias e isquemia coronaria.'}],
  'Dobutamina':[{at:15,color:'warning',title:'Dosis alta de inotrópico',body:'Dobutamina >15 mcg/kg/min → mayor riesgo de arritmias.'}],
  'Dopamina':[{at:10,color:'warning',title:'Dosis vasopresora',body:'Dopamina >10 mcg/kg/min → efecto alfa predominante. Considerar cambio a Norepinefrina.'},{at:20,color:'danger',title:'Dosis máxima',body:'Dosis límite alcanzada.'}],
  'Milrinona':[{at:0.5,color:'warning',title:'Dosis alta',body:'Milrinona >0.5 mcg/kg/min → vigilar hipotensión. Ajustar si IR.'},{at:0.75,color:'danger',title:'Dosis máxima',body:'Dosis máxima alcanzada.'}],
  'Vasopresina':[{at:0.04,color:'warning',title:'Dosis habitual máxima',body:'Vasopresina >0.04 U/min → mayor riesgo de isquemia. Mantener dosis fija.'}],
  'Azul de metileno':[{at:2,color:'danger',title:'Dosis máxima',body:'Dosis máxima alcanzada. Infusión por 1–4 horas.'}],
};

const SRI_DRUGS = {
  ind:[
    {name:"Ketamina",lo:1,hi:2,conc:50,unit:"mg/kg",nota:"Primera línea en inestabilidad hemodinámica. Broncodilatador."},
    {name:"Propofol",lo:1.5,hi:2.5,conc:10,unit:"mg/kg",nota:"Cuidado en hipotensión. Inicio rápido."},
    {name:"Etomidato",lo:0.2,hi:0.3,conc:2,unit:"mg/kg",nota:"Mejor estabilidad hemodinámica. Evitar en sepsis severa."},
    {name:"Midazolam",lo:0.05,hi:0.1,conc:5,unit:"mg/kg",nota:"Útil como coadyuvante. Precaución en inestabilidad."},
  ],
  anal:[
    {name:"Fentanilo",lo:1,hi:3,conc:0.05,unit:"mcg/kg",nota:"Primera línea. Administrar 3 min antes de la inducción."},
    {name:"Ketamina (analgésica)",lo:0.3,hi:0.5,conc:50,unit:"mg/kg",nota:"Dosis subanestésica. Alternativa si contraindicado opiáceo."},
  ],
  bnm:[
    {name:"Rocuronio",lo:1,hi:1.2,conc:10,unit:"mg/kg",nota:"Reversible con sugammadex. De elección si contraindicada succinilcolina."},
    {name:"Succinilcolina",lo:1.5,hi:2,conc:20,unit:"mg/kg",nota:"Inicio ultrarrápido. Contraindicado en hipercalemia, quemados >48h, denervación."},
  ],
};

const PROC_DRUGS = [
  {name:"Etomidato",lo:0.05,hi:0.1,conc:2,unit:"mg/kg",duracion:"3–5 min",indicacion:"Cardioversión, procedimientos cortos. Excelente estabilidad HD.",color:"#a78bfa"},
  {name:"Ketamina",lo:0.5,hi:1.5,conc:50,unit:"mg/kg",duracion:"10–20 min",indicacion:"Reducción fracturas, curaciones, procedimientos dolorosos.",color:"#22d3ee"},
  {name:"Midazolam",lo:0.02,hi:0.05,conc:5,unit:"mg/kg",duracion:"20–30 min",indicacion:"Ansiolisis, procedimientos menores. Combinar con analgésico.",color:"#34d399"},
  {name:"Fentanilo",lo:1,hi:2,conc:0.05,unit:"mcg/kg",duracion:"30–60 min",indicacion:"Analgesia procedimental. Acompañar con sedante si necesario.",color:"#f59e0b"},
  {name:"Propofol",lo:0.5,hi:1.5,conc:10,unit:"mg/kg",duracion:"5–10 min",indicacion:"Cardioversión, procedimientos rápidos. Vigilar hipotensión.",color:"#f87171"},
  {name:"Dexmedetomidina",lo:0.5,hi:1,conc:0.2,unit:"mcg/kg",duracion:"Bolo pre-procedimiento",indicacion:"Sedación cooperativa. CVC, curaciones con colaboración.",color:"#818cf8"},
];

function fmt(n,d=2){ if(n===undefined||n===null||isNaN(n)) return "—"; return n.toFixed(d).replace(/\.?0+$/,"")||"0"; }

function DVATab({ weight }) {
  const [selDrug, setSelDrug] = useState('Norepinefrina');
  const [showPrep, setShowPrep] = useState(false);
  const [mg, setMg] = useState('');
  const [vol, setVol] = useState('50');
  const [dose, setDose] = useState('');
  const valid = weight > 0;
  const drug = DRUGS_VASOA.find(d=>d.name===selDrug);
  const prep = DVA_PREP[selDrug];
  const escala = DVA_ESCALA[selDrug];
  const concMcgMl = mg&&vol ? (parseFloat(mg)*1000)/parseFloat(vol) : null;
  const doseNum = parseFloat(dose);
  const isU = drug.cri.unit==='U/min';
  let mlhr=null, mcgMin=null, mcgHr=null;
  if(valid&&concMcgMl&&doseNum>0){
    if(isU){ mlhr=(doseNum*60*parseFloat(vol))/(parseFloat(mg)*1000); mcgMin=doseNum; mcgHr=doseNum*60; }
    else{ mcgMin=doseNum*weight; mcgHr=mcgMin*60; mlhr=(mcgMin*60)/concMcgMl; }
  }
  const pct = doseNum>0 ? Math.min((doseNum/drug.cri.hi)*100,100) : 0;
  const barColor = pct<40?'#22c55e':pct<70?'#f59e0b':'#ef4444';
  const triggered = doseNum>0 ? escala.slice().reverse().find(e=>doseNum>=e.at) : null;
  return (
    <div>
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:8}}>FÁRMACO — toca el nombre para ver preparación</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {DRUGS_VASOA.map(d=>(
            <button key={d.name} onClick={()=>{if(selDrug===d.name){setShowPrep(s=>!s);}else{setSelDrug(d.name);setShowPrep(true);setDose('');} }}
              style={{padding:"7px 12px",borderRadius:8,fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",border:selDrug===d.name?"1px solid #22d3ee":"1px solid #1a3060",background:selDrug===d.name?"#0d2a4e":"#060d1f",color:selDrug===d.name?"#22d3ee":"#4a6a9f"}}>
              {d.name}
            </button>
          ))}
        </div>
      </div>
      {showPrep&&prep&&(
        <div style={{background:"#0b1730",border:"1px solid #22d3ee44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700}}>💊 PREPARACIÓN — {selDrug}</div>
            <button onClick={()=>setShowPrep(false)} style={{background:"transparent",border:"none",color:"#4a6a9f",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{fontSize:12,color:"#7aa2d4",marginBottom:6}}><strong style={{color:"#e8edf5"}}>Presentación:</strong> {prep.ampolla}</div>
          <div style={{fontSize:12,color:"#7aa2d4",marginBottom:10}}><strong style={{color:"#e8edf5"}}>Disolvente:</strong> {prep.disolvente}</div>
          {prep.preparaciones.map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1a3060",fontSize:12}}>
              <span style={{color:"#7aa2d4"}}>{p.nota} · {p.vol} · {p.mg}</span>
              <span style={{color:"#22d3ee",fontWeight:700}}>{p.conc}</span>
            </div>
          ))}
          <div style={{marginTop:10,padding:"8px 10px",background:"#040c1c",borderRadius:8,fontSize:11,color:"#7aa2d4"}}>{prep.nota}</div>
        </div>
      )}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:10}}>DILUCIÓN PREPARADA</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
          <div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>mg en la jeringa/fleboclisis</div>
            <input type="number" value={mg} onChange={e=>setMg(e.target.value)} placeholder="Ej: 8"
              style={{width:"100%",background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:15,padding:"8px 12px",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Volumen total (mL)</div>
            <div style={{display:"flex",gap:6,marginBottom:6}}>
              {['50','100','250'].map(v=>(
                <button key={v} onClick={()=>setVol(v)} style={{flex:1,padding:"5px 0",borderRadius:6,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:vol===v?"1px solid #22d3ee":"1px solid #1a3060",background:vol===v?"#0d2a4e":"#060d1f",color:vol===v?"#22d3ee":"#4a6a9f"}}>{v}</button>
              ))}
            </div>
            <input type="number" value={vol} onChange={e=>setVol(e.target.value)}
              style={{width:"100%",background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:13,padding:"7px 12px",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
        </div>
        {concMcgMl&&<div style={{fontSize:12,color:"#4a9eff"}}>→ Concentración: {(parseFloat(mg)/parseFloat(vol)).toFixed(3)} mg/mL = {concMcgMl.toFixed(1)} mcg/mL</div>}
      </div>
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:6}}>DOSIS QUE ESTÁS ADMINISTRANDO ({drug.cri.unit})</div>
        <input type="number" value={dose} onChange={e=>setDose(e.target.value)} placeholder={fmt(drug.cri.lo,3)} step="0.01"
          style={{width:"140px",background:"#040c1c",border:"1px solid #1a4080",borderRadius:8,color:"#22d3ee",fontSize:22,fontWeight:800,padding:"6px 14px",outline:"none",fontFamily:"inherit"}}/>
        {doseNum>0&&(
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a6a9f",marginBottom:4}}>
              <span>{drug.cri.lo} {drug.cri.unit}</span><span>{((drug.cri.lo+drug.cri.hi)/2).toFixed(2)}</span><span>{drug.cri.hi} {drug.cri.unit}</span>
            </div>
            <div style={{background:"#040c1c",borderRadius:20,height:10,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:20,width:pct+"%",background:barColor,transition:"width 0.3s"}}/>
            </div>
          </div>
        )}
      </div>
      {mlhr!==null&&(
        <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:triggered?12:0}}>
            {[{label:"VELOCIDAD",val:fmt(mlhr,2),unit:"mL/hr"},{label:isU?"DOSIS":"DOSIS TOTAL",val:fmt(mcgMin,4),unit:isU?"U/min":"mcg/min"},{label:"DOSIS/HR",val:fmt(mcgHr,2),unit:isU?"U/hr":"mcg/hr"}].map(item=>(
              <div key={item.label} style={{background:"#040c1c",borderRadius:8,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"#4a6a9f",letterSpacing:1,marginBottom:4}}>{item.label}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#22d3ee"}}>{item.val}</div>
                <div style={{fontSize:11,color:"#4a6a9f"}}>{item.unit}</div>
              </div>
            ))}
          </div>
          {triggered&&(
            <div style={{background:triggered.color==='danger'?"#2a0505":"#2a1a00",border:`1px solid ${triggered.color==='danger'?"#ef444444":"#f59e0b44"}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:triggered.color==='danger'?"#ef4444":"#f59e0b"}}>⚡ {triggered.title}</div>
              <div style={{fontSize:12,color:triggered.color==='danger'?"#ef4444":"#f59e0b",marginTop:4}}>{triggered.body}</div>
            </div>
          )}
        </div>
      )}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:8}}>RANGOS DE REFERENCIA — {selDrug}</div>
        <div style={{fontSize:12,color:"#7aa2d4",lineHeight:2}}>
          Rango: {drug.cri.lo}–{drug.cri.hi} {drug.cri.unit}<br/>
          {escala.map(e=><span key={e.at}>⚡ {e.at} {drug.cri.unit}: {e.title}<br/></span>)}
        </div>
        {drug.nota&&<div style={{marginTop:8,padding:"8px 10px",background:"#040c1c",borderRadius:8,fontSize:11,color:"#7aa2d4"}}>{drug.nota}</div>}
      </div>
    </div>
  );
}

function SRITab({ weight }) {
  const [sel, setSel] = useState({ind:null,anal:null,bnm:null});
  const valid = weight > 0;
  function pick(g,d){ setSel(p=>({...p,[g]:p[g]?.name===d.name?null:d})); }
  const colors={ind:"#a78bfa",anal:"#22d3ee",bnm:"#34d399"};
  const labels={ind:"1. Inductor",anal:"2. Analgesia",bnm:"3. Bloqueador neuromuscular"};
  const allSel=sel.ind&&sel.anal&&sel.bnm;
  function calcDose(d){
    if(!valid||!d) return null;
    const isMcg=d.unit==="mcg/kg";
    const loMg=d.lo*weight, hiMg=d.hi*weight;
    return {loMg,hiMg,isMcg};
  }
  return (
    <div>
      {["ind","anal","bnm"].map(g=>(
        <div key={g} style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px 18px",marginBottom:12}}>
          <div style={{fontSize:10,color:colors[g],letterSpacing:2,fontWeight:700,marginBottom:10}}>{labels[g].toUpperCase()}</div>
          {SRI_DRUGS[g].map(d=>{
            const isSelected=sel[g]?.name===d.name;
            const dose=isSelected?calcDose(d):null;
            return (
              <button key={d.name} onClick={()=>pick(g,d)} style={{width:"100%",textAlign:"left",background:isSelected?colors[g]+"22":"#060d1f",border:isSelected?`1px solid ${colors[g]}`:"1px solid #1a3060",borderRadius:10,padding:"10px 14px",cursor:"pointer",marginBottom:6,fontFamily:"inherit"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:700,color:isSelected?colors[g]:"#e8edf5"}}>{d.name}</span>
                  <span style={{fontSize:11,background:"#040c1c",borderRadius:20,padding:"2px 10px",color:isSelected?colors[g]:"#4a6a9f"}}>{d.lo}–{d.hi} {d.unit}</span>
                </div>
                {isSelected&&valid&&dose&&(
                  <div style={{marginTop:8,padding:"8px 12px",background:"#040c1c",borderRadius:8,borderLeft:`3px solid ${colors[g]}`}}>
                    <div style={{fontSize:11,color:colors[g],letterSpacing:1,marginBottom:4}}>DOSIS CALCULADA — {weight} kg</div>
                    <div style={{fontSize:22,fontWeight:800,color:"#e8edf5"}}>
                      {fmt(dose.loMg,1)}–{fmt(dose.hiMg,1)} {dose.isMcg?"mcg":"mg"}
                    </div>
                  </div>
                )}
                <div style={{fontSize:11,color:"#4a6a9f",marginTop:4}}>{d.nota}</div>
              </button>
            );
          })}
        </div>
      ))}
      {allSel&&valid&&(
        <div style={{background:"#040c1c",border:"1px solid #22d3ee44",borderRadius:14,padding:"18px"}}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:14}}>RESUMEN SRI — {weight} kg</div>
          {[["ind","Inductor"],["anal","Analgesia"],["bnm","BNM"]].map(([g,label])=>{
            const d=sel[g], dose=calcDose(d);
            return (
              <div key={g} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #1a3060"}}>
                <div style={{fontSize:10,color:colors[g],fontWeight:700,minWidth:64}}>{label}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#e8edf5"}}>{d.name}</div>
                  <div style={{fontSize:24,fontWeight:800,color:colors[g],marginTop:4}}>
                    {fmt(dose.loMg,1)}–{fmt(dose.hiMg,1)} {dose.isMcg?"mcg":"mg"}
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={()=>setSel({ind:null,anal:null,bnm:null})} style={{marginTop:12,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"6px 16px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
        </div>
      )}
      {!valid&&<div style={{color:"#3a5a8f",fontSize:12,fontStyle:"italic",textAlign:"center",padding:16}}>Ingresa el peso arriba para ver las dosis calculadas</div>}
    </div>
  );
}

function CRITab({ weight }) {
  const [unit, setUnit] = useState('mg/h');
  const [drug, setDrug] = useState('');
  const [mg, setMg] = useState('');
  const [vol, setVol] = useState('');
  const [w, setW] = useState('');
  const [dose, setDose] = useState('');
  const peso = parseFloat(w)||weight;
  const mgNum=parseFloat(mg), volNum=parseFloat(vol), doseNum=parseFloat(dose);
  const mgMl = mgNum>0&&volNum>0 ? mgNum/volNum : null;
  let mghr=null, mlhr=null, mlmin=null, mg24=null;
  if(mgMl&&doseNum>0){
    if(unit==='mg/h'){ mghr=doseNum; }
    else if(unit==='mcg/kg/min'&&peso>0){ mghr=(doseNum*peso*60)/1000; }
    else if(unit==='mcg/kg/h'&&peso>0){ mghr=(doseNum*peso)/1000; }
    if(mghr!==null){ mlhr=mghr/mgMl; mlmin=mlhr/60; mg24=mghr*24; }
  }
  const inp={background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"9px 13px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"20px"}}>
      <div style={{fontSize:11,color:"#34d399",letterSpacing:2,marginBottom:16}}>CALCULADORA DE INFUSIÓN</div>

      <div style={{marginBottom:14}}>
        <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>UNIDAD DE DOSIS</label>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          {['mg/h','mcg/kg/min','mcg/kg/h'].map(u=>(
            <button key={u} onClick={()=>setUnit(u)} style={{flex:1,padding:"10px 4px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:unit===u?"1px solid #34d399":"1px solid #1a3060",background:unit===u?"#052a10":"#060d1f",color:unit===u?"#34d399":"#4a6a9f"}}>{u}</button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:14}}>
        <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>FÁRMACO</label>
        <input value={drug} onChange={e=>setDrug(e.target.value)} placeholder="Ej: Morfina, Midazolam, Fentanilo..." style={inp}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div>
          <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>mg CARGADOS EN JERINGA</label>
          <input type="number" value={mg} onChange={e=>setMg(e.target.value)} placeholder="Ej: 100" style={inp}/>
        </div>
        <div>
          <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>VOLUMEN TOTAL (mL)</label>
          <input type="number" value={vol} onChange={e=>setVol(e.target.value)} placeholder="Ej: 250" style={inp}/>
        </div>
      </div>

      {mgMl&&<div style={{fontSize:12,color:"#4a9eff",marginBottom:14}}>→ Concentración: {mgMl.toFixed(3)} mg/mL = {(mgMl*1000).toFixed(1)} mcg/mL</div>}

      {unit!=='mg/h'&&(
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>PESO (kg)</label>
          <input type="number" value={w||(weight||'')} onChange={e=>setW(e.target.value)} placeholder={weight||"70"} style={inp}/>
        </div>
      )}

      <div style={{marginBottom:14}}>
        <label style={{fontSize:10,color:"#34d399",letterSpacing:2}}>DOSIS DESEADA ({unit})</label>
        <input type="number" value={dose} onChange={e=>setDose(e.target.value)} placeholder="Ej: 2" step="0.01"
          style={{...inp,fontSize:22,fontWeight:700,color:"#34d399"}}/>
      </div>

      {mlhr!==null&&(
        <div style={{background:"#040c1c",borderRadius:10,padding:"16px",border:"1px solid #34d39944"}}>
          <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:12}}>✓ {drug||"Fármaco"} — {mg} mg en {vol} mL{unit!=='mg/h'&&peso>0?` — ${peso} kg`:''}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{background:"#0b1730",borderRadius:10,padding:"14px",borderTop:"3px solid #34d399",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#34d399",letterSpacing:1,marginBottom:4}}>VELOCIDAD</div>
              <div style={{fontSize:28,fontWeight:800,color:"#e8edf5"}}>{fmt(mlhr,2)}</div>
              <div style={{fontSize:13,color:"#34d399",fontWeight:700}}>mL/hr</div>
            </div>
            <div style={{background:"#0b1730",borderRadius:10,padding:"14px",borderTop:"3px solid #22d3ee",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#22d3ee",letterSpacing:1,marginBottom:4}}>VELOCIDAD</div>
              <div style={{fontSize:28,fontWeight:800,color:"#e8edf5"}}>{fmt(mlmin,3)}</div>
              <div style={{fontSize:13,color:"#22d3ee",fontWeight:700}}>mL/min</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{background:"#0b1730",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"#a78bfa",letterSpacing:1,marginBottom:4}}>DOSIS/HR</div>
              <div style={{fontSize:16,fontWeight:800,color:"#e8edf5"}}>{fmt(mghr,3)} mg/hr</div>
            </div>
            <div style={{background:"#0b1730",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"#f59e0b",letterSpacing:1,marginBottom:4}}>DOSIS/24H</div>
              <div style={{fontSize:16,fontWeight:800,color:"#e8edf5"}}>{fmt(mg24,1)} mg/24h</div>
            </div>
          </div>
          <div style={{background:"#052a10",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#34d399",lineHeight:1.8}}>
            <strong>Indicación enfermería:</strong> {drug||"Fármaco"} {mg} mg en {vol} mL → <strong>{fmt(mlhr,2)} mL/hr</strong> ({fmt(mlmin,3)} mL/min)
          </div>
        </div>
      )}
    </div>
  );
}

function GlasgowTab() {
  const [sc, setSc] = useState({E:0,V:0,M:0});
  const [four, setFour] = useState({E:0,M:0,B:0,R:0});
  const [iot, setIot] = useState(false);
  function selectG(g,v){ setSc(p=>({...p,[g]:v})); }
  function selectF(g,v){ setFour(p=>({...p,[g]:v})); }
  const {E,V,M}=sc, total=E&&V&&M?E+V+M:null;
  let gColor="#4a6a9f",gInterp="Selecciona E + V + M",gRec="";
  if(total!==null){
    if(total>=13){gColor="#22c55e";gInterp="TEC leve";gRec="Observación · TAC según criterios clínicos";}
    else if(total>=9){gColor="#f59e0b";gInterp="TEC moderado";gRec="Hospitalización · TAC · monitorización neurológica";}
    else{gColor="#ef4444";gInterp="TEC grave — considerar intubación";gRec="IOT si GCS ≤8 · UCI · neurocirugía";}
  }
  const {E:FE,M:FM,B:FB,R:FR}=four;
  const fourTotal=FE+FM+FB+FR;
  const fourValid=FE>0||FM>0||FB>0||FR>0;
  let fColor="#4a6a9f",fInterp="Selecciona los componentes",fRec="";
  if(fourValid){
    if(fourTotal>=13){fColor="#22c55e";fInterp="Función neurológica conservada";fRec="Monitorización neurológica estrecha";}
    else if(fourTotal>=8){fColor="#f59e0b";fInterp="Compromiso neurológico moderado";fRec="UCI · Evaluar necesidad de intubación";}
    else if(fourTotal>=4){fColor="#ef4444";fInterp="Compromiso neurológico grave";fRec="IOT · UCI · Neuroprotección";}
    else{fColor="#ef4444";fInterp="Compromiso neurológico crítico";fRec="IOT · UCI · Evaluar pronóstico";}
  }
  const showFourAlert=total!==null&&total<=8;
  const BtnG=({group,val,label})=>(
    <button onClick={()=>selectG(group,val)} style={{width:"100%",textAlign:"left",background:sc[group]===val?gColor+"22":"#060d1f",border:sc[group]===val?`1px solid ${gColor}`:"1px solid #1a3060",borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
      <span style={{fontSize:13,color:sc[group]===val?gColor:"#e8edf5"}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,background:"#06101f",borderRadius:20,padding:"2px 9px",color:sc[group]===val?gColor:"#4a6a9f"}}>{val}</span>
    </button>
  );
  const BtnF=({group,val,label})=>(
    <button onClick={()=>selectF(group,val)} style={{width:"100%",textAlign:"left",background:four[group]===val?fColor+"22":"#060d1f",border:four[group]===val?`1px solid ${fColor}`:"1px solid #1a3060",borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:5,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
      <span style={{fontSize:13,color:four[group]===val?fColor:"#e8edf5"}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,background:"#06101f",borderRadius:20,padding:"2px 9px",color:four[group]===val?fColor:"#4a6a9f"}}>{val}</span>
    </button>
  );
  return (
    <div>
      <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>ESCALA DE GLASGOW (GCS)</div>
      <div style={{fontSize:11,color:"#4a6a9f",marginBottom:12}}>Usar en pacientes que pueden responder verbalmente. Si GCS ≤8 o paciente IOT → complementar con FOUR.</div>
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px 18px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"center",minWidth:64}}>
            <div style={{fontSize:44,fontWeight:800,lineHeight:1,color:total?gColor:"#3a5a8f"}}>{total||"—"}</div>
            <div style={{fontSize:12,color:"#4a6a9f",marginTop:2}}>/ 15</div>
          </div>
          <div style={{flex:1,borderLeft:"1px solid #1a3060",paddingLeft:16}}>
            <div style={{fontSize:15,fontWeight:700,color:total?gColor:"#4a6a9f"}}>{gInterp}</div>
            <div style={{fontSize:12,color:"#4a6a9f",marginTop:3}}>E: {E||"—"} &nbsp; V: {V||"—"} &nbsp; M: {M||"—"}</div>
            {gRec&&<div style={{fontSize:12,color:"#7aa2d4",marginTop:3}}>{gRec}</div>}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        <div>
          <div style={{fontSize:10,color:"#a78bfa",letterSpacing:2,marginBottom:8,fontWeight:700,textAlign:"center"}}>👁 APERTURA OCULAR</div>
          <BtnG group="E" val={4} label="Espontánea"/><BtnG group="E" val={3} label="Al sonido"/><BtnG group="E" val={2} label="A la presión"/><BtnG group="E" val={1} label="Ausente"/>
        </div>
        <div>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:8,fontWeight:700,textAlign:"center"}}>💬 VERBAL</div>
          <BtnG group="V" val={5} label="Orientado"/><BtnG group="V" val={4} label="Confuso"/><BtnG group="V" val={3} label="Palabras"/><BtnG group="V" val={2} label="Sonidos"/><BtnG group="V" val={1} label="Ausente"/>
        </div>
        <div>
          <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:8,fontWeight:700,textAlign:"center"}}>✋ MOTORA</div>
          <BtnG group="M" val={6} label="Obedece"/><BtnG group="M" val={5} label="Localiza"/><BtnG group="M" val={4} label="Flex. normal"/><BtnG group="M" val={3} label="Flex. anormal"/><BtnG group="M" val={2} label="Extensión"/><BtnG group="M" val={1} label="Ausente"/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:0,borderRadius:10,overflow:"hidden",marginBottom:12}}>
        <div style={{background:"#052a10",padding:"10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#22c55e"}}>Leve</div><div style={{fontSize:12,color:"#22c55e"}}>13–15</div></div>
        <div style={{background:"#2a1a00",padding:"10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#f59e0b"}}>Moderado</div><div style={{fontSize:12,color:"#f59e0b"}}>9–12</div></div>
        <div style={{background:"#2a0505",padding:"10px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>Grave</div><div style={{fontSize:12,color:"#ef4444"}}>3–8</div></div>
      </div>
      {showFourAlert&&(
        <div style={{background:"#2a1000",border:"1px solid #f59e0b44",borderRadius:10,padding:"12px 14px",marginBottom:14,fontSize:12,color:"#f59e0b"}}>
          ⚡ GCS ≤8 detectado → Complementar con <strong>FOUR Score</strong> abajo.
        </div>
      )}
      <button onClick={()=>setSc({E:0,V:0,M:0})} style={{background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"6px 16px",fontSize:11,cursor:"pointer",fontFamily:"inherit",marginBottom:24}}>Reiniciar Glasgow</button>

      <div style={{borderTop:"1px solid #1a3060",paddingTop:20,marginTop:8}}>
        <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:6}}>FOUR SCORE (Full Outline of UnResponsiveness)</div>
        <div style={{fontSize:11,color:"#4a6a9f",marginBottom:8}}>Indicado en: GCS ≤8 · Paciente IOT · Imposibilidad de evaluar respuesta verbal. Máximo 16 puntos.</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button onClick={()=>setIot(s=>!s)} style={{background:iot?"#0d2a4e":"transparent",border:`1px solid ${iot?"#22d3ee":"#1a3060"}`,color:iot?"#22d3ee":"#4a6a9f",borderRadius:8,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
            {iot?"✓ Paciente IOT":"Paciente IOT"}
          </button>
          {iot&&<span style={{fontSize:11,color:"#f59e0b"}}>Componente verbal no evaluable — FOUR es la escala indicada</span>}
        </div>
        <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px 18px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{textAlign:"center",minWidth:64}}>
              <div style={{fontSize:44,fontWeight:800,lineHeight:1,color:fourValid?fColor:"#3a5a8f"}}>{fourValid?fourTotal:"—"}</div>
              <div style={{fontSize:12,color:"#4a6a9f",marginTop:2}}>/ 16</div>
            </div>
            <div style={{flex:1,borderLeft:"1px solid #1a3060",paddingLeft:16}}>
              <div style={{fontSize:15,fontWeight:700,color:fourValid?fColor:"#4a6a9f"}}>{fInterp}</div>
              <div style={{fontSize:12,color:"#4a6a9f",marginTop:3}}>E: {FE} · M: {FM} · B: {FB} · R: {FR}</div>
              {fRec&&<div style={{fontSize:12,color:"#7aa2d4",marginTop:3}}>{fRec}</div>}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div>
            <div style={{fontSize:10,color:"#a78bfa",letterSpacing:2,marginBottom:8,fontWeight:700}}>👁 RESPUESTA OCULAR (E)</div>
            <BtnF group="E" val={4} label="Ojos abiertos, sigue con mirada"/>
            <BtnF group="E" val={3} label="Ojos abiertos pero no sigue"/>
            <BtnF group="E" val={2} label="Ojos abiertos al estímulo verbal"/>
            <BtnF group="E" val={1} label="Ojos abiertos al dolor"/>
            <BtnF group="E" val={0} label="Sin apertura ocular"/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:8,fontWeight:700}}>✋ RESPUESTA MOTORA (M)</div>
            <BtnF group="M" val={4} label="Pulgar arriba / puño / signo de paz"/>
            <BtnF group="M" val={3} label="Localiza el dolor"/>
            <BtnF group="M" val={2} label="Respuesta en flexión al dolor"/>
            <BtnF group="M" val={1} label="Respuesta en extensión al dolor"/>
            <BtnF group="M" val={0} label="Sin respuesta o mioclonías"/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:8,fontWeight:700}}>🧠 REFLEJOS DE TRONCO (B)</div>
            <BtnF group="B" val={4} label="Reflejo pupilar y corneal presentes"/>
            <BtnF group="B" val={3} label="Una pupila dilatada y fija"/>
            <BtnF group="B" val={2} label="Reflejos pupilares o corneales ausentes"/>
            <BtnF group="B" val={1} label="Pupilas y reflejo corneal ausentes"/>
            <BtnF group="B" val={0} label="Pupilas, corneal y tos ausentes"/>
          </div>
          <div>
            <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:8,fontWeight:700}}>🫁 RESPIRACIÓN (R)</div>
            <BtnF group="R" val={4} label="No intubado, patrón regular"/>
            <BtnF group="R" val={3} label="No intubado, Cheyne-Stokes"/>
            <BtnF group="R" val={2} label="No intubado, respiración irregular"/>
            <BtnF group="R" val={1} label="Intubado, FR > ventilador"/>
            <BtnF group="R" val={0} label="Intubado, FR = ventilador o apnea"/>
          </div>
        </div>
        <div style={{background:"#040c1c",borderRadius:10,padding:"12px 14px",fontSize:11,color:"#4a6a9f",lineHeight:1.8,marginBottom:12}}>
          <strong style={{color:"#e8edf5"}}>Ventaja del FOUR sobre Glasgow:</strong> evalúa reflejos de tronco y patrón respiratorio · útil en pacientes IOT · detecta síndrome de enclaustramiento · FOUR = 0 sugiere estado vegetativo o muerte cerebral.
        </div>
        <button onClick={()=>setFour({E:0,M:0,B:0,R:0})} style={{background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"6px 16px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar FOUR</button>
      </div>
    </div>
  );
}

function SedacionTab({ weight }) {
  const [subTab, setSubTab] = useState(0);
  const w=weight, valid=w>0;
  const FP_F=[0.6,1.2,1.8,1.8,2.4,2.4,3.0,3.0,3.6,3.6,3.6,3.6];
  const FP_P=[null,null,null,0.5,0.5,1,1,1.5,1.5,2,2.5,3];
  const FD_F=[0.3,0.6,1.2,1.2,1.2,1.2,1.8,1.8,1.8,2.4,2.4,2.4];
  const FD_D=[null,null,null,0.2,0.4,0.6,0.6,0.8,1.0,1.0,1.2,1.5];
  const FM_F=[0.6,1.2,1.8,1.8,2.4,2.4,3.0,3.0,3.6,3.6,3.6,3.6];
  const FM_M=[0,0,0,0.015,0.015,0.03,0.03,0.045,0.045,0.06,0.075,0.09];
  const ACT_F=[0.6,1.2,1.8,2.4,3.0,3.6];
  const DEX=[0.2,0.5,0.8,1.0,1.2,1.5];
  const PROP=[0.5,1.0,1.5,2.0,2.5,3.0];
  function fe(base,w,d=1){ return valid?`${fmt(base*w,0)} (${fmt(base,d)})`:fmt(base,d); }
  const thS={background:"#06101f",padding:"6px 8px",textAlign:"center",fontWeight:700,fontSize:10,color:"#4a6a9f",border:"1px solid #1a3060"};
  const tdS={padding:"7px 8px",textAlign:"center",border:"1px solid #1a3060",color:"#e8edf5",fontSize:11};
  const tdI={...tdS,background:"#0d2a4e",color:"#22d3ee",fontWeight:700};
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
        {["Protocolo original","Protocolo actualizado","Decisión","SAS / RASS"].map((t,i)=>(
          <button key={i} onClick={()=>setSubTab(i)} style={{padding:"8px 4px",borderRadius:8,fontSize:10,fontFamily:"inherit",fontWeight:700,cursor:"pointer",textAlign:"center",border:subTab===i?"1px solid #22d3ee":"1px solid #1a3060",background:subTab===i?"#0d2a4e":"#0b1730",color:subTab===i?"#22d3ee":"#3a5a8f"}}>{t}</button>
        ))}
      </div>
      {subTab===0&&(
        <div>
          <p style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Protocolo HCUCH pre-actualización. Inicio escalón 3. {valid&&`Calculado para ${w} kg.`}</p>
          {[["Fentanilo / Propofol","#4a9eff",FP_F,FP_P,"Propofol mg/kg/h"],["Fentanilo / Dexmedetomidina","#f59e0b",FD_F,FD_D,"Dexmedetomidina µg/kg/h"],["Fentanilo / Midazolam","#ef4444",FM_F,FM_M,"Midazolam mg/kg/h"]].map(([title,color,fArr,sArr,secLabel])=>(
            <div key={title} style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:11,color,letterSpacing:2,fontWeight:700,marginBottom:10}}>{title.toUpperCase()}</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr><th style={thS}>Escalón</th>{[1,2,3,4,5,6,7,8,9,10,11,12].map(n=><th key={n} style={n===3?{...thS,background:"#0d2a4e",color:"#22d3ee"}:thS}>{n}{n===3&&"★"}</th>)}</tr></thead>
                  <tbody>
                    <tr><td style={{...tdS,textAlign:"left",fontWeight:700}}>Fentanilo µg/kg/h</td>{fArr.map((v,i)=><td key={i} style={i===2?tdI:tdS}>{fe(v,w)}</td>)}</tr>
                    <tr><td style={{...tdS,textAlign:"left",fontWeight:700}}>{secLabel.split(" ")[0]}</td>{sArr.map((v,i)=><td key={i} style={i===2?tdI:tdS}>{v===null?"—":fe(v,w,3)}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      {subTab===1&&(
        <div>
          <p style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Protocolo actualizado HCUCH 2019. Escalones independientes. Paracetamol 1g/8h cuando disponible.</p>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:"#0d2a4e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#22d3ee"}}>1</div>
              <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700}}>ESCALÓN ANALGESIA — FENTANILO (µg/kg/h)</div>
            </div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:8}}>Inicio escalón 1 → sedación superficial · Inicio escalón 2 → sedación profunda</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr><th style={thS}>Escalón</th>{[1,2,3,4,5,6].map(n=><th key={n} style={thS}>{n}</th>)}</tr></thead>
                <tbody><tr><td style={{...tdS,textAlign:"left",fontWeight:700}}>Fentanilo µg/kg/h</td>{ACT_F.map((v,i)=><td key={i} style={tdS}>{fe(v,w)}</td>)}</tr></tbody>
              </table>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Sedación Superficial — Meta SAS 3–4","#22c55e","Dexmedetomidina µg/kg/h · Inicio escalón 3",DEX],["Sedación Profunda — Meta SAS 1–2","#ef4444","Propofol mg/kg/h · Inicio escalón 3",PROP]].map(([title,color,sub,arr])=>(
              <div key={title} style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:10,color,letterSpacing:1,fontWeight:700,marginBottom:4}}>{title}</div>
                <div style={{fontSize:10,color:"#4a6a9f",marginBottom:8}}>{sub}</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr>{[1,2,3,4,5,6].map(n=><th key={n} style={n===3?{...thS,background:"#0d2a4e",color:"#22d3ee"}:thS}>{n}{n===3&&"★"}</th>)}</tr></thead>
                    <tbody><tr>{arr.map((v,i)=><td key={i} style={i===2?tdI:tdS}>{fe(v,w)}</td>)}</tr></tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {subTab===2&&(
        <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px"}}>
          <div style={{textAlign:"center",fontSize:13,fontWeight:700,marginBottom:12}}>Paciente ≥18 años con necesidad de VM &gt;48h</div>
          <div style={{background:"#040c1c",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e8edf5",marginBottom:6}}>¿El paciente presenta alguna de estas condiciones?</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>1. Insuf. respiratoria aguda/crónica descompensada moderada-severa (PaO₂/FiO₂ &lt;150)<br/>2. Shock severo (NA &gt;0.3 µg/min y/o Lactato &gt;4.0 mmol/L)<br/>3. Hipertensión intracraneana<br/>4. Estatus convulsivo<br/>5. Síndrome compartimental del abdomen</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
            {[["NO","#22c55e","Sedación superficial","Meta SAS 3–4","Escalón 1 Fentanilo + Escalón 3 Dexmedetomidina"],["NO SEGURO","#f59e0b","Evaluar con equipo","Iniciar superficial","Reevaluar c/6h"],["SÍ","#ef4444","Sedación profunda","Meta SAS 1–2","Escalón 2 Fentanilo + Escalón 3 Propofol"]].map(([tag,color,t1,t2,t3])=>(
              <div key={tag} style={{background:color+"11",border:`1px solid ${color}44`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:700,color}}>{tag}</div>
                <div style={{fontSize:13,fontWeight:700,color,marginTop:4}}>{t1}</div>
                <div style={{fontSize:11,color,marginTop:2}}>{t2}</div>
                <div style={{fontSize:10,color,marginTop:6}}>{t3}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#040c1c",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Evaluar meta SAS c/6h</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>✓ Meta cumplida → Mantener esquema<br/>✗ SAS ≥5 → Titular según escalones / considerar asociación<br/>✗ SAS 1–2 en meta superficial → Bajar 1 escalón</div>
          </div>
        </div>
      )}
      {subTab===3&&(
        <div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
            <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>SEDATION-AGITATION SCALE (SAS)</div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>1–2 = Sedación profunda · 3–4 = Sedación superficial · 5–7 = Agitación</div>
            {[[1,"No despertable","Se mueve o gesticula levemente con estímulos dolorosos.","#ef4444"],[2,"Muy sedado","Puede despertar con estímulo físico. No comunica ni obedece órdenes.","#ef4444"],[3,"Sedado","Difícil de despertar. Obedece órdenes sencillas.","#22c55e"],[4,"Calmado y cooperador","Fácilmente despertable. Obedece órdenes.","#22c55e"],[5,"Agitado","Ansioso. Intenta sentarse, se calma con estímulo verbal.","#f59e0b"],[6,"Muy agitado","Muerde TET. Necesita contención física.","#f59e0b"],[7,"Agitación peligrosa","Intenta retirar TET y catéteres. Arremete contra el personal.","#ef4444"]].map(([n,term,desc,color])=>(
              <div key={n} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:"1px solid #1a3060"}}>
                <div style={{minWidth:30,height:30,borderRadius:8,background:color+"22",border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color}}>{n}</div>
                <div><div style={{fontSize:13,fontWeight:700,color:"#e8edf5"}}>{term}</div><div style={{fontSize:12,color:"#7aa2d4",marginTop:2}}>{desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px"}}>
            <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>RICHMOND AGITATION-SEDATION SCALE (RASS)</div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>Meta UCI: –2 a 0 · Sedación profunda: –3 a –5 · Agitación: +1 a +4</div>
            {[["+4","Combativo","Violento, peligro inmediato","#ef4444"],["+3","Muy agitado","Agresivo, intenta retirar tubos","#ef4444"],["+2","Agitado","Movimientos frecuentes, lucha con VM","#f59e0b"],["+1","Inquieto","Ansioso, movimientos no agresivos","#f59e0b"],["0","Alerta y calmado","Estado normal","#22c55e"],["-1","Somnoliento","Se mantiene despierto >10 seg con voz","#22c55e"],["-2","Sedación leve","Despierta brevemente con voz, contacto visual","#22d3ee"],["-3","Sedación moderada","Movimiento a la voz. Sin contacto visual","#22d3ee"],["-4","Sedación profunda","Sin respuesta a voz. Responde a estímulo físico","#ef4444"],["-5","No despertable","Sin respuesta a voz ni estímulo físico","#ef4444"]].map(([n,term,desc,color])=>(
              <div key={n} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:"1px solid #1a3060"}}>
                <div style={{minWidth:34,height:28,borderRadius:8,background:color+"22",border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color}}>{n}</div>
                <div><div style={{fontSize:13,fontWeight:700,color:"#e8edf5"}}>{term}</div><div style={{fontSize:11,color:"#7aa2d4",marginTop:1}}>{desc}</div></div>
              </div>
            ))}
            <div style={{marginTop:10,padding:"10px 12px",background:"#040c1c",borderRadius:8,fontSize:11,color:"#7aa2d4"}}><strong style={{color:"#e8edf5"}}>Equivalencia SAS/RASS:</strong> SAS 1–2 ≈ RASS –4/–5 · SAS 3 ≈ RASS –2/–3 · SAS 4 ≈ RASS 0/–1 · SAS 5–7 ≈ RASS +1/+4</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcedimientosTab({ weight }) {
  const [sel, setSel] = useState(null);
  const valid = weight > 0;
  function calcDose(d){
    if(!valid) return null;
    const isMcg=d.unit==="mcg/kg", f=isMcg?0.001:1;
    const loMg=d.lo*weight*f, hiMg=d.hi*weight*f;
    return {loMg,hiMg,isMcg};
  }
  return (
    <div>
      <p style={{fontSize:12,color:"#4a6a9f",marginBottom:14}}>Sedación de corta duración. Selecciona un fármaco para ver la dosis.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {PROC_DRUGS.map(d=>{
          const isSelected=sel?.name===d.name;
          const dose=isSelected?calcDose(d):null;
          return (
            <div key={d.name} onClick={()=>setSel(isSelected?null:d)} style={{background:isSelected?d.color+"18":"#0b1730",border:`1px solid ${isSelected?d.color:"#1a3060"}`,borderRadius:12,padding:"14px",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:700,color:isSelected?d.color:"#e8edf5"}}>{d.name}</span>
                <span style={{fontSize:10,background:"#040c1c",borderRadius:20,padding:"2px 8px",color:"#4a6a9f"}}>{d.duracion}</span>
              </div>
              <div style={{fontSize:11,color:"#4a6a9f",marginBottom:8,lineHeight:1.5}}>{d.indicacion}</div>
              <div style={{fontSize:11,color:isSelected?d.color:"#3a5a8f",background:"#040c1c",borderRadius:6,padding:"4px 8px",display:"inline-block"}}>{d.lo}–{d.hi} {d.unit}</div>
              {isSelected&&valid&&dose&&(
                <div style={{marginTop:10,padding:"10px 12px",background:"#040c1c",borderRadius:8,borderLeft:`3px solid ${d.color}`}}>
                  <div style={{fontSize:10,color:d.color,letterSpacing:1,marginBottom:4}}>DOSIS — {weight} kg</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#e8edf5"}}>{fmt(dose.loMg,2)}–{fmt(dose.hiMg,2)} {dose.isMcg?"mcg":"mg"}</div>
                </div>
              )}
              {isSelected&&!valid&&<div style={{marginTop:8,fontSize:12,color:"#3a5a8f",fontStyle:"italic"}}>Ingresa el peso arriba para calcular</div>}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:14,padding:"12px 16px",background:"#0b1730",border:"1px solid #1a3060",borderRadius:10,fontSize:11,color:"#4a6a9f",lineHeight:1.8}}>
        <strong style={{color:"#e8edf5"}}>Recordar siempre:</strong> monitorización continua · vía aérea disponible · dosis según respuesta clínica
      </div>
    </div>
  );
}

function ScoresTab() {
  const [cat, setCat] = useState(0);
  const cats=["🚨 Sepsis","🫁 Trombosis","❤️ Cardio","🧠 Neuro/Infección","🩸 Digestivo","🦠 EII"];

  function ScoreCard({ title, sub, items, scores, levels }) {
    const [vals, setVals] = useState(Array(items.length).fill(false));
    const total=vals.reduce((s,v,i)=>v?s+scores[i]:s,0);
    const found=levels.slice().reverse().find(l=>total>=l.min)||levels[0];
    function toggle(i){ setVals(v=>{ const n=[...v]; n[i]=!n[i]; return n; }); }
    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{title}</div>
        <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>{sub}</div>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a3060",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${vals[i]?"#22d3ee":"#1a3060"}`,background:vals[i]?"#22d3ee":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#040c1c",flexShrink:0}}>{vals[i]&&"✓"}</div>
              <span style={{fontSize:13,color:vals[i]?"#e8edf5":"#7aa2d4"}}>{item}</span>
            </div>
            <span style={{fontSize:12,color:"#4a6a9f",minWidth:32,textAlign:"right"}}>{scores[i]>0?"+"+scores[i]:scores[i]}</span>
          </div>
        ))}
        <div style={{marginTop:12,background:found.color+"15",border:`1px solid ${found.color}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:36,fontWeight:800,color:found.color,minWidth:48,textAlign:"center"}}>{fmt(total,1)}</div>
          <div><div style={{fontSize:13,fontWeight:700,color:found.color}}>{found.label}</div><div style={{fontSize:12,color:found.color,marginTop:2}}>{found.rec}</div></div>
        </div>
        <button onClick={()=>setVals(Array(items.length).fill(false))} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
      </div>
    );
  }

  function SofaCard() {
    const opts=[
      {label:"Resp PaO₂/FiO₂",options:[">400 (0)","301–400 (1)","201–300 (2)","101–200+VM (3)","≤100+VM (4)"]},
      {label:"Coag Plaquetas ×10³",options:[">150 (0)","101–150 (1)","51–100 (2)","21–50 (3)","≤20 (4)"]},
      {label:"Hígado Bilirrubina",options:["<1.2 (0)","1.2–1.9 (1)","2–5.9 (2)","6–11.9 (3)","≥12 (4)"]},
      {label:"Cardiovascular",options:["PAM≥70 (0)","PAM<70 (1)","Dopa≤5 o Dobu (2)","Dopa5-15 o Epi≤0.1 (3)","Dopa>15 o Epi>0.1 (4)"]},
      {label:"SNC Glasgow",options:["15 (0)","13–14 (1)","10–12 (2)","6–9 (3)","<6 (4)"]},
      {label:"Renal Creatinina",options:["<1.2 (0)","1.2–1.9 (1)","2–3.4 (2)","3.5–4.9 o <500mL/d (3)","≥5 o <200mL/d (4)"]},
    ];
    const [vals,setVals]=useState(Array(6).fill(0));
    const total=vals.reduce((a,b)=>a+b,0);
    const color=total<=1?"#22c55e":total<=6?"#f59e0b":"#ef4444";
    const interp=total<=1?"Sin disfunción orgánica":total<=6?"Disfunción leve-moderada":total<=9?"Disfunción moderada":"Disfunción grave";
    const rec=total<=1?"Mortalidad <10%":total<=6?"Mortalidad ~10–20%":total<=9?"Mortalidad ~40%":"Mortalidad >50%";
    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>SOFA</div>
        <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Disfunción orgánica en UCI. Aumento ≥2 = criterio de sepsis.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {opts.map((o,i)=>(
            <div key={i}>
              <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>{o.label}</div>
              <select value={vals[i]} onChange={e=>{const n=[...vals];n[i]=parseInt(e.target.value);setVals(n);}}
                style={{width:"100%",background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:12,padding:"6px 8px",outline:"none",fontFamily:"inherit"}}>
                {o.options.map((opt,j)=><option key={j} value={j}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:36,fontWeight:800,color,minWidth:48,textAlign:"center"}}>{total}</div>
          <div><div style={{fontSize:13,fontWeight:700,color}}>{interp}</div><div style={{fontSize:12,color,marginTop:2}}>{rec}</div></div>
        </div>
        <button onClick={()=>setVals(Array(6).fill(0))} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
      </div>
    );
  }

  function NewsCard() {
    const opts=[
      {label:"SpO₂ (%)",vals:[3,2,1,0],opts:["≤91","92–93","94–95","≥96"]},
      {label:"O₂ suplementario",vals:[0,2],opts:["No","Sí"]},
      {label:"Frecuencia respiratoria",vals:[3,1,0,2,3],opts:["≤8","9–11","12–20","21–24","≥25"]},
      {label:"PAS (mmHg)",vals:[3,2,1,0,3],opts:["≤90","91–100","101–110","111–219","≥220"]},
      {label:"Frecuencia cardíaca",vals:[3,1,0,1,2,3],opts:["≤40","41–50","51–90","91–110","111–130","≥131"]},
      {label:"Temperatura (°C)",vals:[3,1,0,1,2],opts:["≤35.0","35.1–36.0","36.1–38.0","38.1–39.0","≥39.1"]},
      {label:"Conciencia",vals:[0,3],opts:["Alerta","Confuso/AVPU≠A"]},
    ];
    const [vals,setVals]=useState(opts.map(()=>0));
    const total=opts.reduce((s,o,i)=>s+o.vals[vals[i]],0);
    const color=total<=4?"#22c55e":total<=6?"#f59e0b":"#ef4444";
    const interp=total<=4?"Riesgo bajo":total<=6?"Riesgo intermedio":"Riesgo alto";
    const rec=total<=4?"Control cada 12h":total<=6?"Avisar médico · control horario":"Evaluación urgente · considerar UCI";
    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>NEWS2</div>
        <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Deterioro clínico agudo. Score ≥7 → respuesta de emergencia.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {opts.map((o,i)=>(
            <div key={i}>
              <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>{o.label}</div>
              <select value={vals[i]} onChange={e=>{const n=[...vals];n[i]=parseInt(e.target.value);setVals(n);}}
                style={{width:"100%",background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:12,padding:"6px 8px",outline:"none",fontFamily:"inherit"}}>
                {o.opts.map((opt,j)=><option key={j} value={j}>{opt} (+{o.vals[j]})</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontSize:36,fontWeight:800,color,minWidth:48,textAlign:"center"}}>{total}</div>
          <div><div style={{fontSize:13,fontWeight:700,color}}>{interp}</div><div style={{fontSize:12,color,marginTop:2}}>{rec}</div></div>
        </div>
        <button onClick={()=>setVals(opts.map(()=>0))} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
      </div>
    );
  }

  function SDRACard() {
    const opts=[
      {label:"Inicio",options:["Agudo <1 semana","No cumple criterio"]},
      {label:"Imagen (Rx/TC tórax)",options:["Opacidades bilaterales no explicadas","No cumple criterio"]},
      {label:"Origen del edema",options:["No explicado por IC o sobrecarga","No cumple criterio"]},
      {label:"PaO₂/FiO₂ con PEEP ≥5",options:["Leve: 201–300","Moderado: 101–200","Grave: ≤100"]},
    ];
    const [vals,setVals]=useState([0,0,0,0]);
    const cumple=vals[0]===0&&vals[1]===0&&vals[2]===0;
    const pafi=vals[3];
    const color=!cumple?"#4a6a9f":pafi===0?"#f59e0b":"#ef4444";
    const interp=!cumple?"No cumple criterios Berlin":pafi===0?"SDRA Leve":pafi===1?"SDRA Moderado":"SDRA Grave";
    const rec=!cumple?"Verificar criterios":pafi===0?"PaO₂/FiO₂ 201–300 · Mortalidad ~27%":pafi===1?"PaO₂/FiO₂ 101–200 · Mortalidad ~32%":"PaO₂/FiO₂ ≤100 · Mortalidad ~45%";
    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>SDRA — Criterios de Berlín</div>
        <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Diagnóstico y clasificación del Síndrome de Distrés Respiratorio Agudo.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {opts.map((o,i)=>(
            <div key={i}>
              <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>{o.label}</div>
              <select value={vals[i]} onChange={e=>{const n=[...vals];n[i]=parseInt(e.target.value);setVals(n);}}
                style={{width:"100%",background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:12,padding:"6px 8px",outline:"none",fontFamily:"inherit"}}>
                {o.options.map((opt,j)=><option key={j} value={j}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontSize:13,fontWeight:700,color}}>{interp}</div>
          <div style={{fontSize:12,color,marginTop:2}}>{rec}</div>
        </div>
        <button onClick={()=>setVals([0,0,0,0])} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
      </div>
    );
  }

  function IROXCard() {
    const [spo2,setSpo2]=useState('');
    const [fio2,setFio2]=useState('');
    const [rr,setRr]=useState('');
    const s=parseFloat(spo2),f=parseFloat(fio2),r=parseFloat(rr);
    let irox=null,color="#4a6a9f",interp="Ingresa los valores",rec="";
    if(s>0&&f>0&&r>0){ irox=(s/f)/r; color=irox>=4?"#22c55e":irox>=3.85?"#f59e0b":"#ef4444"; interp=irox>=4?"CNAF probable éxito":irox>=3.85?"Zona de incertidumbre":"CNAF probable fracaso"; rec=irox>=4?"Continuar CNAF · Reevaluar en 2h":irox>=3.85?"Vigilancia estrecha · Preparar intubación":"Considerar intubación precoz"; }
    const inp={background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"8px 10px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};
    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>IROX — Predictor de éxito CNAF</div>
        <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Índice ROX = (SpO₂/FiO₂)/FR. Evaluar a las 2h de inicio. ≥4.88 → bajo riesgo de intubación.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[{label:"SpO₂ (%)",val:spo2,set:setSpo2,ph:"95"},{label:"FiO₂ (0–1)",val:fio2,set:setFio2,ph:"0.4"},{label:"FR (rpm)",val:rr,set:setRr,ph:"25"}].map((o,i)=>(
            <div key={i}><div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>{o.label}</div><input type="number" value={o.val} onChange={e=>o.set(e.target.value)} placeholder={o.ph} style={inp}/></div>
          ))}
        </div>
        {irox!==null&&(
          <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
            <div style={{fontSize:36,fontWeight:800,color,minWidth:60,textAlign:"center"}}>{irox.toFixed(2)}</div>
            <div><div style={{fontSize:13,fontWeight:700,color}}>{interp}</div><div style={{fontSize:12,color,marginTop:2}}>{rec}</div></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:16}}>
        {cats.map((c,i)=><button key={i} onClick={()=>setCat(i)} style={{padding:"8px 4px",borderRadius:8,fontSize:10,fontFamily:"inherit",fontWeight:700,cursor:"pointer",textAlign:"center",border:cat===i?"1px solid #22d3ee":"1px solid #1a3060",background:cat===i?"#0d2a4e":"#0b1730",color:cat===i?"#22d3ee":"#3a5a8f"}}>{c}</button>)}
      </div>

      {cat===0&&<>
        <ScoreCard title="qSOFA" sub="Screening rápido de sepsis fuera de UCI. Score ≥2 → alta sospecha." items={["FR ≥22/min","Alteración estado mental (GCS <15)","PAS ≤100 mmHg"]} scores={[1,1,1]} levels={[{min:0,label:"Sin criterios de alarma",rec:"Reevaluar según evolución",color:"#22c55e"},{min:2,label:"Alta sospecha de sepsis",rec:"Evaluar lactato · Hemocultivos · Antibióticos",color:"#ef4444"}]}/>
        <SofaCard/>
        <NewsCard/>
        <ScoreCard title="MEWS" sub="Deterioro clínico en sala. Score ≥5 → considerar UCI." items={["FC <40 o ≥130","PAS <70 mmHg","PAS 71–80 mmHg","FR <9 o ≥30","Temperatura <35°C o ≥38.5°C","AVPU: responde al dolor","AVPU: sin respuesta"]} scores={[2,3,2,2,2,2,3]} levels={[{min:0,label:"Bajo riesgo",rec:"Control habitual",color:"#22c55e"},{min:3,label:"Riesgo intermedio",rec:"Aumentar frecuencia de controles",color:"#f59e0b"},{min:5,label:"Alto riesgo",rec:"Evaluación médica urgente / UCI",color:"#ef4444"}]}/>
        <IROXCard/>
        <SDRACard/>
      </>}

      {cat===1&&<>
        <ScoreCard title="Wells TVP" sub="Probabilidad pretest de trombosis venosa profunda." items={["Cáncer activo","Parálisis/paresia/inmovilización EEII","Encamado >3 días o cirugía mayor <12 sem","Dolor a palpación trayecto venoso profundo","Edema en toda la pierna","Edema con fóvea mayor en pierna sintomática","Circulación colateral superficial (no várices)","TVP previa documentada","Diagnóstico alternativo tan probable o más"]} scores={[1,1,1,1,1,1,1,1,-2]} levels={[{min:-9,label:"Probabilidad baja",rec:"D-dímero. Si positivo: Eco doppler",color:"#22c55e"},{min:1,label:"Probabilidad moderada",rec:"Eco doppler directo",color:"#f59e0b"},{min:3,label:"Probabilidad alta",rec:"Eco doppler urgente · Anticoagular si demora",color:"#ef4444"}]}/>
        <ScoreCard title="Wells TEP" sub="Probabilidad pretest de tromboembolismo pulmonar." items={["TVP o TEP previo (+1.5)","FC >100/min (+1.5)","Cirugía o inmovilización últimas 4 sem (+1.5)","Signos clínicos de TVP (+3)","TEP es diagnóstico más probable (+3)","Hemoptisis (+1)","Cáncer activo últimos 6 meses (+1)"]} scores={[1.5,1.5,1.5,3,3,1,1]} levels={[{min:0,label:"Probabilidad baja",rec:"D-dímero. Si positivo: AngioTC",color:"#22c55e"},{min:2,label:"Probabilidad intermedia",rec:"AngioTC de tórax",color:"#f59e0b"},{min:6,label:"Probabilidad alta",rec:"AngioTC urgente · Anticoagular",color:"#ef4444"}]}/>
        <ScoreCard title="sPESI — TEP" sub="Severidad del tromboembolismo pulmonar (versión simplificada)." items={["Edad >80 años","Cáncer activo","Enfermedad cardiopulmonar crónica","FC ≥110/min","PAS <100 mmHg","SpO₂ <90%"]} scores={[1,1,1,1,1,1]} levels={[{min:0,label:"Bajo riesgo (sPESI = 0)",rec:"Mortalidad 30d ~1% · Considerar ambulatorio",color:"#22c55e"},{min:1,label:"Alto riesgo (sPESI ≥1)",rec:"Mortalidad 30d ~10% · Hospitalización",color:"#ef4444"}]}/>
        <ScoreCard title="PADUA" sub="Riesgo de TEV en paciente hospitalizado. Score ≥4 → profilaxis anticoagulante." items={["Cáncer activo (+3)","TEV previo excepto trombosis superficial (+3)","Movilidad reducida ≥3 días (+3)","Trombofilia conocida (+3)","Trauma o cirugía reciente ≤1 mes (+2)","Edad ≥70 años","Insuficiencia cardíaca o respiratoria","IAM o ACV","Infección aguda / enfermedad reumatológica","Obesidad IMC ≥30","Tratamiento hormonal activo"]} scores={[3,3,3,3,2,1,1,1,1,1,1]} levels={[{min:0,label:"Riesgo bajo",rec:"Movilización precoz",color:"#22c55e"},{min:4,label:"Riesgo alto",rec:"Profilaxis anticoagulante indicada",color:"#ef4444"}]}/>
      </>}

      {cat===2&&<>
        <ScoreCard title="HEART Score — Dolor torácico" sub="Riesgo de MACE en dolor torácico en urgencias." items={["Historia altamente sospechosa (+2)","Historia moderadamente sospechosa (+1)","ECG: BRIHH nuevo / depresión ST (+2)","ECG: alteración inespecífica (+1)","Edad ≥65 años (+2)","Edad 45–64 años (+1)","≥3 factores de riesgo CV o aterosclerosis conocida (+2)","1–2 factores de riesgo CV (+1)","Troponina >3x normal (+2)","Troponina 1–3x normal (+1)"]} scores={[2,1,2,1,2,1,2,1,2,1]} levels={[{min:0,label:"Bajo riesgo",rec:"Score 0–3 · MACE <2% · Alta con seguimiento",color:"#22c55e"},{min:4,label:"Riesgo intermedio",rec:"Score 4–6 · MACE ~12% · Observación y troponinas seriadas",color:"#f59e0b"},{min:7,label:"Alto riesgo",rec:"Score 7–10 · MACE ~65% · Cath urgente",color:"#ef4444"}]}/>
        <ScoreCard title="TIMI — SCASEST" sub="Riesgo de muerte/IAM/revascularización urgente en SCASEST a 14 días." items={["Edad ≥65 años","≥3 factores de riesgo coronario","Estenosis coronaria previa ≥50%","Desviación ST en ECG","≥2 eventos anginosos en últimas 24h","Uso de AAS en últimos 7 días","Marcadores cardíacos elevados"]} scores={[1,1,1,1,1,1,1]} levels={[{min:0,label:"Riesgo bajo",rec:"Score 0–2 · Riesgo ~5%",color:"#22c55e"},{min:3,label:"Riesgo intermedio",rec:"Score 3–4 · Riesgo ~13%",color:"#f59e0b"},{min:5,label:"Riesgo alto",rec:"Score 5–7 · Riesgo ~26% · Estrategia invasiva precoz",color:"#ef4444"}]}/>
        <ScoreCard title="GRACE — SCA" sub="Mortalidad intrahospitalaria en SCA." items={["Edad ≥75 años (+3)","Edad 65–74 años (+2)","Historia de IC o depresión ST (+2)","Historia de IAM previo o PCI (+1)","FC >100/min (+2)","PAS <100 mmHg (+3)","Killip II–III (+2)","Killip IV (+3)","Creatinina >2 mg/dL (+2)","Paro cardíaco al ingreso (+3)"]} scores={[3,2,2,1,2,3,2,3,2,3]} levels={[{min:0,label:"Riesgo bajo",rec:"Mortalidad intrahospitalaria <1%",color:"#22c55e"},{min:9,label:"Riesgo intermedio",rec:"Mortalidad ~1–3% · Estrategia invasiva precoz",color:"#f59e0b"},{min:15,label:"Riesgo alto",rec:"Mortalidad >3% · Estrategia invasiva urgente",color:"#ef4444"}]}/>
        <ScoreCard title="CHA₂DS₂-VA" sub="Riesgo de ACV en fibrilación auricular no valvular. (ESC 2024)" items={["Insuficiencia cardíaca congestiva","Hipertensión arterial","Edad ≥75 años (+2)","Diabetes mellitus","ACV/AIT/tromboembolismo previo (+2)","Enfermedad vascular (IAM, arteriopatía, placa aórtica)","Edad 65–74 años"]} scores={[1,1,2,1,2,1,1]} levels={[{min:0,label:"Riesgo bajo",rec:"No anticoagulación rutinaria",color:"#22c55e"},{min:2,label:"Riesgo moderado",rec:"Considerar anticoagulación oral",color:"#f59e0b"},{min:3,label:"Riesgo alto",rec:"Anticoagulación oral indicada",color:"#ef4444"}]}/>
        <ScoreCard title="HAS-BLED" sub="Riesgo de sangrado mayor en anticoagulación. Score ≥3 → alto riesgo." items={["HTA no controlada (PAS >160 mmHg)","Función renal anormal (diálisis, Cr >2.26)","Función hepática anormal (cirrosis, bili >2x)","ACV previo","Sangrado previo o predisposición","INR lábil (TTR <60%)","Edad >65 años","Drogas (antiagregantes, AINEs) o alcohol"]} scores={[1,1,1,1,1,1,1,1]} levels={[{min:0,label:"Riesgo bajo",rec:"Anticoagular si indicado",color:"#22c55e"},{min:3,label:"Riesgo alto de sangrado",rec:"Corregir factores modificables · Vigilancia estrecha",color:"#ef4444"}]}/>
      </>}

      {cat===3&&<>
        <ScoreCard title="mRS — Modified Rankin Scale" sub="Evaluación de discapacidad neurológica. Clave para elegibilidad de trombólisis y pronóstico post-ACV." items={["0 — Sin síntomas","1 — Sin discapacidad significativa · Actividades habituales conservadas","2 — Discapacidad leve · Independiente pero con limitaciones","3 — Discapacidad moderada · Requiere ayuda · Camina sin asistencia","4 — Discapacidad moderada-grave · Requiere asistencia para caminar y AVD","5 — Discapacidad grave · Postrado · Incontinente · Cuidados constantes","6 — Muerte"]} scores={[0,1,2,3,4,5,6]} levels={[{min:0,label:"Sin discapacidad",rec:"mRS 0–1 · Funcionamiento normal o casi normal",color:"#22c55e"},{min:2,label:"Discapacidad leve-moderada",rec:"mRS 2–3 · Independiente con limitaciones",color:"#f59e0b"},{min:4,label:"Discapacidad grave",rec:"mRS 4–5 · Dependiente · Evaluar objetivos terapéuticos",color:"#ef4444"}]}/>
        <div style={{background:"#2a1a00",border:"1px solid #f59e0b44",borderRadius:10,padding:"12px 14px",marginBottom:12,fontSize:12,color:"#f59e0b",lineHeight:1.8}}>
          <strong style={{color:"#fbbf24"}}>⚡ Sospecha de ACV agudo:</strong> Calcular <strong>NIHSS</strong> para cuantificar déficit neurológico y guiar decisión de trombólisis/trombectomía. Usar{" "}
          <a href="https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss" target="_blank" rel="noopener noreferrer" style={{color:"#22d3ee"}}>MDCalc NIHSS</a>.
        </div>
        <ScoreCard title="ABCD² — Riesgo de ACV post-AIT" sub="Riesgo de ACV en las 48h siguientes a un AIT." items={["Edad ≥60 años","PAS ≥140 o PAD ≥90 mmHg","Debilidad focal unilateral (+2)","Alteración del habla sin debilidad","Duración AIT ≥60 min (+2)","Duración AIT 10–59 min","Diabetes mellitus"]} scores={[1,1,2,1,2,1,1]} levels={[{min:0,label:"Riesgo bajo",rec:"Riesgo ACV 48h ~1%",color:"#22c55e"},{min:4,label:"Riesgo moderado",rec:"Riesgo ACV 48h ~4% · Hospitalizar",color:"#f59e0b"},{min:6,label:"Riesgo alto",rec:"Riesgo ACV 48h ~8% · Hospitalizar urgente",color:"#ef4444"}]}/>
        <ScoreCard title="CURB-65 — Severidad NAC" sub="Gravedad de neumonía adquirida en la comunidad." items={["Confusión (desorientación o GCS <15)","Urea >7 mmol/L (BUN >19 mg/dL)","FR ≥30/min","PAS <90 o PAD ≤60 mmHg","Edad ≥65 años"]} scores={[1,1,1,1,1]} levels={[{min:0,label:"Bajo riesgo",rec:"Tratamiento ambulatorio",color:"#22c55e"},{min:2,label:"Riesgo intermedio",rec:"Hospitalización o supervisión estrecha",color:"#f59e0b"},{min:3,label:"Alto riesgo — NAC grave",rec:"Hospitalización · Considerar UCI",color:"#ef4444"}]}/>
        <ScoreCard title="PSI/PORT — Severidad NAC" sub="Índice de severidad de neumonía. Complementa CURB-65." items={["Edad >50 años","Neoplasia","Insuficiencia hepática","ICC o enfermedad cerebrovascular","Insuficiencia renal","Alteración del estado mental","FR ≥30/min","PAS <90 mmHg","Temperatura <35°C o ≥40°C","FC ≥125/min","pH <7.35","BUN ≥30 mg/dL","Na <130 mEq/L","Glucosa ≥250 mg/dL","Hematocrito <30%","PaO₂ <60 mmHg","Derrame pleural"]} scores={[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]} levels={[{min:0,label:"Clase I–II — Bajo riesgo",rec:"Mortalidad <1% · Tratamiento ambulatorio",color:"#22c55e"},{min:5,label:"Clase III — Riesgo bajo-moderado",rec:"Mortalidad ~3% · Hospitalización breve",color:"#f59e0b"},{min:9,label:"Clase IV–V — Alto riesgo",rec:"Mortalidad >10% · Hospitalización · UCI si clase V",color:"#ef4444"}]}/>
        <ScoreCard title="Alvarado — Apendicitis aguda" sub="Probabilidad de apendicitis aguda. Score ≥7 → alta probabilidad quirúrgica." items={["Migración del dolor a FID","Anorexia","Náuseas / vómitos","Dolor en FID a la palpación (+2)","Rebote positivo","Temperatura ≥37.3°C","Leucocitosis ≥10.000 (+2)","Desviación izquierda (neutrofilia)"]} scores={[1,1,1,2,1,1,2,1]} levels={[{min:0,label:"Baja probabilidad",rec:"Score 1–4 · Observación · Baja sospecha quirúrgica",color:"#22c55e"},{min:5,label:"Probabilidad intermedia",rec:"Score 5–6 · Observación · Imagen complementaria",color:"#f59e0b"},{min:7,label:"Alta probabilidad",rec:"Score 7–10 · Evaluación quirúrgica urgente",color:"#ef4444"}]}/>
      </>}

      {cat===4&&<>
        <ScoreCard title="Glasgow-Blatchford — HDA" sub="Riesgo de intervención en hemorragia digestiva alta. Score 0 → bajo riesgo." items={["BUN ≥25 mg/dL (+6)","BUN 18.2–24.9 (+4)","BUN 12.6–18.1 (+3)","BUN 10–12.5 (+2)","Hb <10 g/dL hombre (+6)","Hb 10–12 g/dL hombre (+3)","Hb <10 g/dL mujer (+6)","Hb 10–12 g/dL mujer (+1)","PAS 100–109 (+1)","PAS 90–99 (+2)","PAS <90 (+3)","FC ≥100/min","Melena","Síncope","Hepatopatía","ICC"]} scores={[6,4,3,2,6,3,6,1,1,2,3,1,1,2,2,2]} levels={[{min:0,label:"Score 0 — Muy bajo riesgo",rec:"Alta precoz · Sin endoscopia urgente",color:"#22c55e"},{min:1,label:"Riesgo bajo-intermedio",rec:"Endoscopia electiva · Monitorización",color:"#f59e0b"},{min:7,label:"Alto riesgo",rec:"Endoscopia urgente · UCI si inestable",color:"#ef4444"}]}/>
        <ScoreCard title="Oakland — HDB" sub="Seguridad del alta en hemorragia digestiva baja. Score ≤8 → alta segura." items={["Edad 40–69 años (+1)","Edad ≥70 años (+2)","Sexo masculino","Ingreso previo por HDB","FC 70–89 (+1)","FC 90–109 (+2)","FC ≥110 (+3)","PAS 90–119 (+2)","PAS 120–159 (+1)","Hb 3–6.9 g/dL (+4)","Hb 7–8.9 g/dL (+3)","Hb 9–10.9 g/dL (+2)","Hb 11–12.9 g/dL (+1)","Rectorragia: sangre con coágulos (+1)","Rectorragia: sangre fresca (+2)"]} scores={[1,2,1,1,1,2,3,2,1,4,3,2,1,1,2]} levels={[{min:0,label:"Score ≤8 — Bajo riesgo",rec:"Alta segura con seguimiento ambulatorio",color:"#22c55e"},{min:9,label:"Riesgo intermedio",rec:"Hospitalización · Colonoscopia electiva",color:"#f59e0b"},{min:14,label:"Alto riesgo",rec:"Colonoscopia urgente · UCI si inestable",color:"#ef4444"}]}/>
        <ScoreCard title="Ranson — Pancreatitis aguda" sub="Severidad de pancreatitis. ≥3 criterios → pancreatitis grave." items={["Al ingreso: Edad >55 años","Al ingreso: Leucocitos >16.000","Al ingreso: Glucosa >200 mg/dL","Al ingreso: LDH >350 UI/L","Al ingreso: AST >250 UI/L","A las 48h: Caída Hto >10%","A las 48h: BUN aumenta >5 mg/dL","A las 48h: Ca <8 mg/dL","A las 48h: PaO₂ <60 mmHg","A las 48h: Déficit de bases >4 mEq/L","A las 48h: Secuestro de líquidos >6L"]} scores={[1,1,1,1,1,1,1,1,1,1,1]} levels={[{min:0,label:"Leve",rec:"Score 0–2 · Mortalidad <1% · Manejo conservador",color:"#22c55e"},{min:3,label:"Moderada-grave",rec:"Score 3–5 · Mortalidad ~15% · UCI",color:"#f59e0b"},{min:6,label:"Grave",rec:"Score ≥6 · Mortalidad ~40% · UCI · Soporte intensivo",color:"#ef4444"}]}/>
        <ScoreCard title="BISAP — Pancreatitis grave" sub="Predictor de mortalidad en pancreatitis aguda en primeras 24h." items={["BUN >25 mg/dL","Alteración del estado mental","SIRS (≥2 criterios)","Edad >60 años","Derrame pleural en imagen"]} scores={[1,1,1,1,1]} levels={[{min:0,label:"Bajo riesgo",rec:"Score 0–2 · Mortalidad <1%",color:"#22c55e"},{min:3,label:"Alto riesgo",rec:"Score ≥3 · Mortalidad >5% · UCI",color:"#ef4444"}]}/>
      </>}

      {cat===5&&<>
        <ScoreCard title="Truelove-Witts — Colitis Ulcerosa" sub="Severidad del brote de colitis ulcerosa." items={["Deposiciones >6/día con sangre","FC >90/min","Temperatura >37.8°C","Hb <10.5 g/dL","VSG >30 mm/h","PCR >30 mg/L"]} scores={[1,1,1,1,1,1]} levels={[{min:0,label:"Brote leve",rec:"Score 0–1 · Manejo ambulatorio · Mesalazina",color:"#22c55e"},{min:2,label:"Brote moderado",rec:"Score 2–4 · Hospitalización · Corticoides orales",color:"#f59e0b"},{min:5,label:"Brote grave",rec:"Score 5–6 · Hospitalización · Corticoides IV · Evaluar cirugía",color:"#ef4444"}]}/>
      </>}

      <div style={{marginTop:16,padding:"12px 16px",background:"#0b1730",border:"1px solid #1a3060",borderRadius:10,fontSize:12,color:"#4a6a9f",textAlign:"center"}}>
        Para más scores visita{" "}
        <a href="https://www.mdcalc.com" target="_blank" rel="noopener noreferrer" style={{color:"#22d3ee",textDecoration:"none"}}>MDCalc.com</a>
        {" "}· Referencia de uso libre para profesionales de salud
      </div>
    </div>
  );
}

const TABS=["💉 SRI","🩸 DVA","⚗️ CRI","🧠 Glasgow","🛏️ Sedación UCI","🔧 Procedimientos","📊 Scores"];

export default function App() {
  const [weight, setWeight] = useState("");
  const [tab, setTab] = useState(0);
  const w=parseFloat(weight);
  const valid=w>0&&w<250;
  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 0%,#0d1f40 0%,#050d1c 60%)",color:"#e8edf5",fontFamily:"'IBM Plex Mono','Courier New',monospace",paddingBottom:60}}>
      <div style={{background:"linear-gradient(180deg,#0a1a38 0%,#050d1c 100%)",borderBottom:"1px solid #1a3060",padding:"20px 20px 16px"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:3,marginBottom:4}}>ANESTESIOLOGÍA · URGENCIAS · UCI</div>
          <div style={{fontSize:22,fontWeight:800}}>💉 Suite Clínica</div>
          <div style={{fontSize:11,color:"#3a5a8f",marginTop:2}}>SRI · DVA · CRI · Glasgow · Sedación · Procedimientos · Scores</div>
        </div>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"20px 16px 0"}}>
        <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:6}}>PESO DEL PACIENTE</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="70"
                style={{width:100,background:"#040c1c",border:"1px solid #1a4080",borderRadius:8,color:"#22d3ee",fontSize:26,fontWeight:800,padding:"6px 14px",outline:"none",fontFamily:"inherit"}}/>
              <span style={{fontSize:18,color:"#22d3ee",fontWeight:700}}>kg</span>
            </div>
          </div>
          {valid&&<div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:10,color:"#34d399",letterSpacing:2}}>ACTIVO</div><div style={{fontSize:22,fontWeight:800,color:"#34d399"}}>{w} kg</div></div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:20}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{padding:"10px 4px",borderRadius:10,fontSize:9,fontFamily:"inherit",fontWeight:700,cursor:"pointer",textAlign:"center",lineHeight:1.4,border:tab===i?"1px solid #22d3ee":"1px solid #1a3060",background:tab===i?"#0d2a4e":"#0b1730",color:tab===i?"#22d3ee":"#3a5a8f"}}>{t}</button>
          ))}
        </div>
        {tab===0&&<SRITab weight={valid?w:0}/>}
        {tab===1&&<DVATab weight={valid?w:0}/>}
        {tab===2&&<CRITab weight={valid?w:0}/>}
        {tab===3&&<GlasgowTab/>}
        {tab===4&&<SedacionTab weight={valid?w:0}/>}
        {tab===5&&<ProcedimientosTab weight={valid?w:0}/>}
        {tab===6&&<ScoresTab/>}
        <div style={{marginTop:24,padding:"12px 16px",background:"#08111f",border:"1px solid #1a2a4f",borderRadius:10,fontSize:11,color:"#2a4a7f",lineHeight:1.7}}>
          ⚠️ Herramienta de apoyo clínico. Verificar siempre con protocolos institucionales y criterio médico.
        </div>
      </div>
    </div>
  );
}