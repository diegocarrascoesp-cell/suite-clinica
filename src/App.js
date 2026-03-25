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
  const [selEscalon, setSelEscalon] = useState({});
  const [proto, setProto] = useState('original');
  const w = weight;
  const valid = w > 0;

  const DILUCIONES = [
    {nombre:'Fentanilo', prep:'1 mg (1000 mcg) en 100 mL SF', conc:'10 mcg/mL', color:'#22d3ee'},
    {nombre:'Propofol', prep:'200 mg en 20 mL (sin diluir)', conc:'10 mg/mL', color:'#a78bfa'},
    {nombre:'Dexmedetomidina', prep:'200 mcg en 50 mL SF', conc:'4 mcg/mL', color:'#f59e0b'},
    {nombre:'Midazolam', prep:'100 mg en 100 mL SF', conc:'1 mg/mL', color:'#34d399'},
  ];

  const BNM = [
    {nombre:'Cisatracurio', color:'#f472b6', preferido:true, nota:'Eliminación de Hofmann — independiente de función renal y hepática. 1ª opción.',
     bolo:{dosis:'0.1–0.2 mg/kg', lo:0.1, hi:0.2, conc:2},
     bic:{lo:1, hi:3, unidad:'mcg/kg/min', prep:'100 mg en 100 mL SF → 1000 mcg/mL', conc:1000}},
    {nombre:'Vecuronio', color:'#22d3ee', preferido:false, nota:'2ª opción. Metabolismo hepático parcial. Acumulación en IR/IH.',
     bolo:{dosis:'0.1 mg/kg', lo:0.1, hi:null, conc:2},
     bic:{lo:0.8, hi:1.7, unidad:'mcg/kg/min', prep:'10 mg en 100 mL SF → 100 mcg/mL', conc:100}},
    {nombre:'Rocuronio', color:'#34d399', preferido:false, nota:'3ª opción. Reversible con Sugammadex. Mayor dosis requerida en BIC.',
     bolo:{dosis:'0.6–1 mg/kg', lo:0.6, hi:1.0, conc:10},
     bic:{lo:5, hi:12, unidad:'mcg/kg/min', prep:'200 mg en 200 mL SF → 1000 mcg/mL', conc:1000}},
  ];

  const ORIG = [
    {nombre:'Fentanilo / Propofol', color:'#4a9eff',
     esc:[{n:1,f:0.6,s:null},{n:2,f:1.2,s:null},{n:3,f:1.8,s:0.5,i:true},{n:4,f:1.8,s:0.5},{n:5,f:2.4,s:1.0},{n:6,f:2.4,s:1.0},{n:7,f:3.0,s:1.5},{n:8,f:3.0,s:1.5},{n:9,f:3.6,s:2.0},{n:10,f:3.6,s:2.5},{n:11,f:3.6,s:2.5},{n:12,f:3.6,s:3.0}],
     unidadS:'mg/kg/h', farmacoS:'Propofol', concF:10, concS:10, unidadF:'µg/kg/h'},
    {nombre:'Fentanilo / Dexmedetomidina', color:'#f59e0b',
     esc:[{n:1,f:0.3,s:null},{n:2,f:0.6,s:null},{n:3,f:1.2,s:null},{n:4,f:1.2,s:0.2,i:true},{n:5,f:1.2,s:0.4},{n:6,f:1.2,s:0.6},{n:7,f:1.8,s:0.6},{n:8,f:1.8,s:0.8},{n:9,f:1.8,s:1.0},{n:10,f:2.4,s:1.0},{n:11,f:2.4,s:1.2},{n:12,f:2.4,s:1.5}],
     unidadS:'µg/kg/h', farmacoS:'Dexmedetomidina', concF:10, concS:4, unidadF:'µg/kg/h'},
    {nombre:'Fentanilo / Midazolam', color:'#ef4444',
     esc:[{n:1,f:0.6,s:0},{n:2,f:1.2,s:0},{n:3,f:1.8,s:0,i:true},{n:4,f:1.8,s:0.015},{n:5,f:2.4,s:0.015},{n:6,f:2.4,s:0.030},{n:7,f:3.0,s:0.030},{n:8,f:3.0,s:0.045},{n:9,f:3.6,s:0.045},{n:10,f:3.6,s:0.060},{n:11,f:3.6,s:0.075},{n:12,f:3.6,s:0.090}],
     unidadS:'mg/kg/h', farmacoS:'Midazolam', concF:10, concS:1, unidadF:'µg/kg/h'},
  ];

  const ACT_FENT = [{n:1,d:0.6,ini:'sup'},{n:2,d:1.2,ini:'prof'},{n:3,d:1.8},{n:4,d:2.4},{n:5,d:3.0},{n:6,d:3.6}];
  const ACT_DEX  = [{n:1,d:0.2},{n:2,d:0.5},{n:3,d:0.8,ini:true},{n:4,d:1.0},{n:5,d:1.2},{n:6,d:1.5}];
  const ACT_PROP = [{n:1,d:0.5},{n:2,d:1.0},{n:3,d:1.5,ini:true},{n:4,d:2.0},{n:5,d:2.5},{n:6,d:3.0}];

  function mlh(dosis, conc) {
    if(!valid) return '—';
    return ((dosis * w) / conc).toFixed(2);
  }
  function dosisTotal(dosis) {
    if(!valid) return '—';
    return (dosis * w).toFixed(2);
  }

  function Detalle({farmaco, dosis, unidad, conc, concUnit, color}) {
    return (
      <div style={{background:"#040c1c",borderRadius:8,padding:10,borderLeft:`3px solid ${color}`,marginTop:6}}>
        <div style={{fontSize:10,color,letterSpacing:1,marginBottom:8}}>{farmaco.toUpperCase()} — DOSIS CALCULADA</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>DOSIS/kg/h</div>
            <div style={{fontSize:14,fontWeight:700,color}}>{dosis} {unidad}</div>
          </div>
          <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>DOSIS TOTAL/h</div>
            <div style={{fontSize:14,fontWeight:700,color}}>{dosisTotal(dosis)} {concUnit}</div>
          </div>
          <div style={{background:"#0d2a4e",borderRadius:6,padding:8,textAlign:"center",border:`1px solid ${color}44`}}>
            <div style={{fontSize:10,color,marginBottom:2}}>VELOCIDAD</div>
            <div style={{fontSize:18,fontWeight:800,color}}>{mlh(dosis,conc)} mL/h</div>
          </div>
        </div>
        {!valid&&<div style={{marginTop:6,fontSize:11,color:"#3a5a8f",fontStyle:"italic"}}>Ingresa el peso para calcular mL/h</div>}
      </div>
    );
  }

  function toggleEsc(key) {
    setSelEscalon(prev => ({...prev, [key]: prev[key] ? null : true}));
  }

  const thS={background:"#06101f",padding:"6px 8px",textAlign:"center",fontWeight:700,fontSize:10,color:"#4a6a9f",border:"1px solid #1a3060"};
  const tdS={padding:"7px 8px",textAlign:"center",border:"1px solid #1a3060",color:"#e8edf5",fontSize:11};
  const tdI={...tdS,background:"#0d2a4e",color:"#22d3ee",fontWeight:700};

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
        {["📋 Protocolos","🔀 Decisión","📊 SAS/RASS","💊 Diluciones"].map((t,i)=>(
          <button key={i} onClick={()=>setSubTab(i)} style={{padding:"8px 4px",borderRadius:8,fontSize:10,fontFamily:"inherit",fontWeight:700,cursor:"pointer",textAlign:"center",border:subTab===i?"1px solid #22d3ee":"1px solid #1a3060",background:subTab===i?"#0d2a4e":"#0b1730",color:subTab===i?"#22d3ee":"#3a5a8f"}}>{t}</button>
        ))}
      </div>

      {/* PROTOCOLOS */}
      {subTab===0&&(
        <div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {[["original","Protocolo original"],["actualizado","Protocolo actualizado"]].map(([p,label])=>(
                <button key={p} onClick={()=>{setProto(p);setSelEscalon({});}} style={{padding:"7px 14px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:proto===p?"1px solid #22d3ee":"1px solid #1a3060",background:proto===p?"#0d2a4e":"#060d1f",color:proto===p?"#22d3ee":"#4a6a9f"}}>{label}</button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#4a6a9f",lineHeight:1.7}}>
              {proto==='original'?'Protocolo pre-actualización HCUCH. Inicio en escalón 3 ★. Tres asociaciones fijas.':'Protocolo actualizado HCUCH 2019. Escalones independientes. Analgesia-first. Agregar Paracetamol 1g c/8h EV como coadyuvante analgésico cuando esté disponible.'}
            </div>
          </div>

          {proto==='original' && ORIG.map((asoc,ai)=>(
            <div key={ai} style={{background:"#0b1730",border:`1px solid ${asoc.color}44`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:11,color:asoc.color,letterSpacing:2,fontWeight:700,marginBottom:12}}>{asoc.nombre.toUpperCase()}</div>
              {asoc.esc.map((esc,idx)=>{
                const key=`o_${ai}_${idx}`;
                const open=selEscalon[key];
                return (
                  <button key={idx} onClick={()=>setSelEscalon(prev=>({...prev,[key]:!prev[key]}))}
                    style={{width:"100%",textAlign:"left",borderRadius:8,padding:"10px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,border:open?`1px solid ${asoc.color}`:`1px solid ${esc.i?"#f59e0b44":"#1a3060"}`,background:open?asoc.color+"22":"#040c1c",color:"#e8edf5",marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontWeight:700,color:esc.i?"#f59e0b":"#e8edf5"}}>Escalón {esc.n}{esc.i?" ★":""}</span>
                      <span style={{fontSize:11,color:"#4a6a9f"}}>Fent: {esc.f} {asoc.unidadF}{esc.s!=null?" · "+asoc.farmacoS+": "+esc.s+" "+asoc.unidadS:""}</span>
                    </div>
                    {open&&(
                      <div onClick={e=>e.stopPropagation()}>
                        <Detalle farmaco="Fentanilo" dosis={esc.f} unidad={asoc.unidadF} conc={asoc.concF} concUnit="mcg" color={asoc.color}/>
                        {esc.s!=null&&esc.s>0&&<Detalle farmaco={asoc.farmacoS} dosis={esc.s} unidad={asoc.unidadS} conc={asoc.concS} concUnit={asoc.unidadS==='mg/kg/h'?"mg":"mcg"} color="#34d399"/>}
                        {esc.s===0&&<div style={{background:"#040c1c",borderRadius:8,padding:8,marginTop:4,fontSize:11,color:"#4a6a9f"}}>{asoc.farmacoS} no iniciado en este escalón</div>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {proto==='actualizado'&&(
            <div>
              {[
                {titulo:"PASO 1 — ANALGESIA: FENTANILO (µg/kg/h)", sub:"Inicio escalón 1 ★ → sedación superficial · Inicio escalón 2 ★ → sedación profunda", color:"#22d3ee", datos:ACT_FENT, conc:10, unidad:"µg/kg/h", concUnit:"mcg", key:"f"},
                {titulo:"SEDACIÓN SUPERFICIAL — DEXMEDETOMIDINA (µg/kg/h)", sub:"Meta SAS 3–4 · Inicio escalón 3 ★", color:"#f59e0b", datos:ACT_DEX, conc:4, unidad:"µg/kg/h", concUnit:"mcg", key:"d"},
                {titulo:"SEDACIÓN PROFUNDA — PROPOFOL (mg/kg/h)", sub:"Meta SAS 1–2 · Inicio escalón 3 ★", color:"#ef4444", datos:ACT_PROP, conc:10, unidad:"mg/kg/h", concUnit:"mg", key:"p"},
              ].map((cfg,ci)=>(
                <div key={ci} style={{background:"#0b1730",border:`1px solid ${cfg.color}44`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                  <div style={{fontSize:11,color:cfg.color,letterSpacing:2,fontWeight:700,marginBottom:4}}>{cfg.titulo}</div>
                  <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>{cfg.sub}</div>
                  {cfg.datos.map((esc,idx)=>{
                    const esInicio=esc.ini==='sup'||esc.ini==='prof'||esc.ini===true;
                    const key=`a_${ci}_${idx}`;
                    const open=selEscalon[key];
                    return (
                      <button key={idx} onClick={()=>setSelEscalon(prev=>({...prev,[key]:!prev[key]}))}
                        style={{width:"100%",textAlign:"left",borderRadius:8,padding:"10px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,border:open?`1px solid ${cfg.color}`:`1px solid ${esInicio?"#f59e0b44":"#1a3060"}`,background:open?cfg.color+"22":"#040c1c",color:"#e8edf5",marginBottom:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontWeight:700,color:esInicio?"#f59e0b":"#e8edf5"}}>Escalón {esc.n}{esc.ini==='sup'?" ★ (inicio superficial)":esc.ini==='prof'?" ★ (inicio profunda)":esc.ini?" ★":""}</span>
                          <span style={{fontSize:11,color:cfg.color}}>{esc.d} {cfg.unidad}</span>
                        </div>
                        {open&&(
                          <div onClick={e=>e.stopPropagation()}>
                            <Detalle farmaco={ci===0?"Fentanilo":ci===1?"Dexmedetomidina":"Propofol"} dosis={esc.d} unidad={cfg.unidad} conc={cfg.conc} concUnit={cfg.concUnit} color={cfg.color}/>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DECISIÓN */}
      {subTab===1&&(
        <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"16px"}}>
          <div style={{textAlign:"center",fontSize:13,fontWeight:700,marginBottom:12}}>Paciente ≥18 años con necesidad de VM &gt;48h</div>
          <div style={{background:"#040c1c",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e8edf5",marginBottom:6}}>¿El paciente presenta alguna de estas condiciones?</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>1. Insuf. respiratoria aguda/crónica descompensada (PaO₂/FiO₂ &lt;150)<br/>2. Shock severo (NA &gt;0.3 µg/min y/o Lactato &gt;4.0 mmol/L)<br/>3. Hipertensión intracraneana<br/>4. Estatus convulsivo<br/>5. Síndrome compartimental del abdomen</div>
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

      {/* SAS/RASS */}
      {subTab===2&&(
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
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>Meta UCI: –2 a 0 · Sedación profunda: –3 a –5</div>
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

      {/* DILUCIONES */}
      {subTab===3&&(
        <div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:12}}>💊 DILUCIONES ESTÁNDAR — SEDACIÓN UCI</div>
            {DILUCIONES.map((d,i)=>(
              <div key={i} style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:8,borderLeft:`3px solid ${d.color}`}}>
                <div style={{fontSize:13,fontWeight:700,color:d.color,marginBottom:6}}>{d.nombre}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>PREPARACIÓN</div><div style={{fontSize:12,color:"#e8edf5"}}>{d.prep}</div></div>
                  <div><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>CONCENTRACIÓN</div><div style={{fontSize:14,fontWeight:700,color:d.color}}>{d.conc}</div></div>
                </div>
              </div>
            ))}
          </div>

          {/* BNM */}
          <div style={{background:"#0b1730",border:"1px solid #f472b644",borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:10,color:"#f472b6",letterSpacing:2,marginBottom:8}}>💊 BNM — BLOQUEADORES NEUROMUSCULARES EN BIC</div>
            <div style={{background:"#2a0505",borderRadius:8,padding:10,marginBottom:12,fontSize:12,color:"#ef4444",lineHeight:1.7}}>
              <strong>Indicación:</strong> PaO₂/FiO₂ &lt;150 en paciente IOT · SDRA grave · Asincronía severa con ventilador<br/>
              <strong>Monitorización:</strong> TOF (Train of Four) — Objetivo <strong>1–2 respuestas de 4</strong>
            </div>
            {BNM.map((f,i)=>{
              const boloRange = f.bolo.dosis.includes('–');
              const boloLo = f.bolo.lo * (valid?w:0);
              const boloHi = f.bolo.hi ? f.bolo.hi * (valid?w:0) : null;
              const boloMlLo = (boloLo/f.bolo.conc).toFixed(1);
              const boloMlHi = boloHi ? (boloHi/f.bolo.conc).toFixed(1) : null;
              const bicLo = valid ? ((f.bic.lo*w*60)/f.bic.conc).toFixed(2) : '—';
              const bicHi = valid ? ((f.bic.hi*w*60)/f.bic.conc).toFixed(2) : '—';
              return (
                <div key={i} style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:10,borderLeft:`3px solid ${f.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:14,fontWeight:700,color:f.color}}>{f.nombre}{f.preferido?" ⭐":""}</span>
                    {f.preferido&&<span style={{fontSize:10,background:f.color+"22",color:f.color,borderRadius:20,padding:"2px 8px"}}>1ª opción</span>}
                  </div>
                  <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>{f.nota}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div style={{background:"#0b1730",borderRadius:8,padding:10}}>
                      <div style={{fontSize:10,color:f.color,marginBottom:4}}>BOLO IV</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#e8edf5"}}>{f.bolo.dosis}</div>
                      {valid&&<div style={{fontSize:12,color:f.color,marginTop:4}}>{boloHi?`${boloLo.toFixed(1)}–${boloHi.toFixed(1)}`:`${boloLo.toFixed(1)}`} mg → {boloMlHi?`${boloMlLo}–${boloMlHi}`:`${boloMlLo}`} mL</div>}
                      {!valid&&<div style={{fontSize:11,color:"#3a5a8f",marginTop:4}}>Ingresa peso para calcular</div>}
                    </div>
                    <div style={{background:"#0b1730",borderRadius:8,padding:10}}>
                      <div style={{fontSize:10,color:f.color,marginBottom:4}}>BIC MANTENIMIENTO</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#e8edf5"}}>{f.bic.lo}–{f.bic.hi} {f.bic.unidad}</div>
                      <div style={{fontSize:14,fontWeight:800,color:f.color,marginTop:4}}>{bicLo}–{bicHi} mL/h</div>
                    </div>
                  </div>
                  <div style={{background:"#0b1730",borderRadius:6,padding:8,fontSize:11,color:"#4a6a9f"}}>
                    <span style={{color:"#e8edf5",fontWeight:600}}>Preparación BIC:</span> {f.bic.prep}
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:10,background:"#040c1c",borderRadius:8,padding:10,fontSize:11,color:"#7aa2d4",lineHeight:1.8}}>
              ⚠️ Cisatracurio es el fármaco de elección por <strong style={{color:"#e8edf5"}}>eliminación de Hofmann</strong> (independiente de función renal y hepática)<br/>
              ⚠️ Siempre asegurar sedoanalgesia adecuada antes de iniciar BNM<br/>
              ⚠️ Controlar TOF cada 4–6h para ajustar dosis
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
  
    function TobinCard() {
    const [fr,setFr]=useState('');
    const [vt,setVt]=useState('');

    const f=parseFloat(fr), v=parseFloat(vt);
    let rsbi=null, color="#4a6a9f", interp="Ingresa valores", rec="";

    if(f>0 && v>0){
      rsbi = f / (v/1000);
      color = rsbi < 105 ? "#22c55e" : "#ef4444";
      interp = rsbi < 105 ? "Favorable para destete" : "Alto riesgo de fracaso";
      rec = rsbi < 105 
        ? "Considerar prueba de ventilación espontánea"
        : "Optimizar antes de intentar destete";
    }

    const inputStyle = {
      width:"100%",
      background:"#040c1c",
      border:"1px solid #1a3060",
      borderRadius:8,
      color:"#e8edf5",
      fontSize:13,
      padding:"7px 8px",
      outline:"none",
      fontFamily:"inherit",
      boxSizing:"border-box"
    };

    return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 14px",marginBottom:12}}>
        
        <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>TOBIN / RSBI</div>
        <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>
          RSBI = FR / Vt (L) · Punto de corte: 105
        </div>

        {/* 🔽 Inputs más compactos */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:10,color:"#4a6a9f",marginBottom:3}}>FR (rpm)</div>
            <input
              type="number"
              value={fr}
              onChange={e=>setFr(e.target.value)}
              placeholder="22"
              style={inputStyle}
            />
          </div>

          <div style={{minWidth:0}}>
            <div style={{fontSize:10,color:"#4a6a9f",marginBottom:3}}>Vt (mL)</div>
            <input
              type="number"
              value={vt}
              onChange={e=>setVt(e.target.value)}
              placeholder="450"
              style={inputStyle}
            />
          </div>
        </div>

        {/* 🔽 Resultado */}
        {rsbi!==null&&(
          <div style={{background:color+"15",border:`1px solid ${color}44`,borderRadius:10,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontSize:26,fontWeight:800,color}}>{rsbi.toFixed(1)}</div>
            <div style={{fontSize:12,fontWeight:700,color}}>{interp}</div>
            <div style={{fontSize:11,color,marginTop:2}}>{rec}</div>
          </div>
        )}

        {/* 🔽 BLOQUE CLÍNICO (lo que querías) */}
        <div style={{background:"#040c1c",borderRadius:10,padding:"10px 12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#22d3ee",marginBottom:4}}>
            A considerar
          </div>
          <div style={{fontSize:11,color:"#7aa2d4",lineHeight:1.6}}>
            No usar de forma aislada.<br/>
            Integrar con estado neurológico, estabilidad hemodinámica,
            oxigenación, fuerza respiratoria y manejo de secreciones.
          </div>
        </div>

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
        <TobinCard/>
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
function ElectrolyteTab() {
  const [mainTab, setMainTab] = useState(0); // 0=sodio, 1=potasio, 2=calcio
  const [tipo, setTipo] = useState(null);    // hipo/hiper
  const [vec, setVec] = useState(null);
  const [calcOpen, setCalcOpen] = useState(false);
  const [naActual, setNaActual] = useState('');
  const [naObj, setNaObj] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState('0.6');
  const [sol, setSol] = useState('3%');
  const [hipokal, setHipokal] = useState(false);
  const [via, setVia] = useState('oral');
  const [kTab, setKTab] = useState(0);
  const [caTab, setCaTab] = useState(0);
  const [pesoCa, setPesoCa] = useState('');

  const na=parseFloat(naActual), obj=parseFloat(naObj), w=parseFloat(peso), f=parseFloat(sexo);
  const act = w&&f ? w*f : null;
  const wCa = parseFloat(pesoCa)||0;

  // Cálculo hiponatremia
  let defHipo=null, volHipo=null, velHipo=null;
  if(act&&na&&obj&&na<obj){
    const diff=obj-na, maxCorr=Math.min(diff,10);
    defHipo=act*diff;
    const conc=sol==='3%'?513:sol==='2.7%'?462:154;
    volHipo=(act*maxCorr/conc)*1000;
    velHipo=volHipo/(maxCorr/0.5);
  }

  // Cálculo hipernatremia
  let defHiper=null, volHiper=null, velHiper=null, horasHiper=null;
  if(act&&na&&obj&&na>obj&&na>145){
    defHiper=act*((na/obj)-1);
    horasHiper=Math.ceil((na-obj)/0.5);
    volHiper = via==='sf045' ? defHiper*2*1000 : defHiper*1000;
    velHiper=volHiper/horasHiper;
  }

  const inp={background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"8px 12px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  function TtoStep({color, titulo, children}) {
    return (
      <div style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:8,borderLeft:`4px solid ${color}`}}>
        <div style={{fontSize:12,fontWeight:700,color,marginBottom:6}}>{titulo}</div>
        {children}
      </div>
    );
  }

  function EcgHipo() {
    return (
      <div style={{background:"#0b1730",border:"1px solid #f59e0b44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:11,color:"#f59e0b",letterSpacing:2,fontWeight:700,marginBottom:10}}>⚡ ECG SEGÚN NIVEL DE K⁺ — Solicitar siempre</div>
        {[
          {rango:"K⁺ 3.5–5.0",color:"#22c55e",label:"ECG normal",pts:"10,30 40,30 50,20 60,30 70,30 75,15 80,5 85,45 90,30 100,28 110,30 140,30 170,30 175,20 185,30 195,30 200,15 205,5 210,45 215,30 225,28 235,30 260,30",desc:"Normal · onda T positiva · QTc normal"},
          {rango:"K⁺ 2.5–3.5",color:"#f59e0b",label:"Cambios tempranos",pts:"10,35 40,35 50,25 60,35 70,35 75,18 80,5 85,50 90,35 100,33 108,35 115,32 122,35 150,35 180,35 190,25 200,35 210,35 215,18 220,5 225,50 230,35 240,33 248,35 255,32 262,35 280,35",desc:"Aplanamiento onda T · Onda U prominente · ST descendido"},
          {rango:"K⁺ <2.5",color:"#ef4444",label:"Cambios graves",pts:"10,38 35,38 45,28 55,38 65,38 70,15 75,2 80,58 85,38 95,40 108,42 118,38 130,35 145,38 160,38 185,38 195,28 205,38 215,38 220,15 225,2 230,58 235,38 245,40 258,42 268,38 278,35 295,38",desc:"T invertida · Onda U fusionada · QT prolongado · Riesgo Torsades"},
        ].map((ecg,i)=>(
          <div key={i} style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{background:ecg.color+"22",border:`1px solid ${ecg.color}44`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:ecg.color}}>{ecg.rango}</div>
              <span style={{fontSize:12,color:ecg.color}}>{ecg.label}</span>
            </div>
            <svg viewBox="0 0 300 65" style={{width:"100%",height:55}}>
              <rect width="300" height="65" fill="#040c1c"/>
              <line x1="0" y1="35" x2="300" y2="35" stroke="#1a3060" strokeWidth="0.5"/>
              <polyline points={ecg.pts} fill="none" stroke={ecg.color} strokeWidth="1.5"/>
              <text x="5" y="62" fill={ecg.color} fontSize="8">{ecg.desc}</text>
            </svg>
          </div>
        ))}
        <div style={{background:"#2a0505",borderRadius:8,padding:8,fontSize:12,color:"#ef4444"}}>
          ⚠️ Hipomagnesemia concomitante prolonga el QT y dificulta corrección del K⁺ — corregir siempre en paralelo
        </div>
      </div>
    );
  }

  function EcgHiper() {
    return (
      <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:11,color:"#ef4444",letterSpacing:2,fontWeight:700,marginBottom:10}}>⚡ ECG SEGÚN NIVEL DE K⁺ — Solicitar siempre</div>
        {[
          {rango:"K⁺ 5.5–6.5",color:"#f59e0b",label:"Cambios tempranos",pts:"10,35 35,35 45,25 55,35 65,35 70,18 73,2 76,18 80,35 90,35 120,35 145,35 155,25 165,35 175,35 180,18 183,2 186,18 190,35 200,35 230,35 255,35 265,25 275,35 285,35",desc:"Onda T picuda y simétrica (en tienda de campaña) · Cambio más precoz"},
          {rango:"K⁺ 6.5–7.5",color:"#ef4444",label:"Cambios moderados",pts:"10,35 30,35 38,27 46,35 68,35 75,15 80,2 85,55 92,35 105,33 120,35 145,35 165,35 173,27 181,35 203,35 210,15 215,2 220,55 227,35 240,33 255,35 280,35",desc:"PR prolongado · QRS ancho · Bloqueo rama · T picuda"},
          {rango:"K⁺ >7.5",color:"#ef4444",label:"⚠️ Riesgo vital",pts:"10,35 25,35 45,10 65,55 85,10 105,55 125,10 145,55 165,10 185,55 205,10 225,55 245,10 265,55 285,10",desc:"Patrón sinusoidal · Riesgo FV / Paro cardíaco inminente",sinusoidal:true},
        ].map((ecg,i)=>(
          <div key={i} style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{background:ecg.color+"22",border:`1px solid ${ecg.color}${i===2?"":"44"}`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:ecg.color}}>{ecg.rango}</div>
              <span style={{fontSize:12,color:ecg.color}}>{ecg.label}</span>
            </div>
            <svg viewBox="0 0 300 65" style={{width:"100%",height:55}}>
              <rect width="300" height="65" fill="#040c1c"/>
              <line x1="0" y1="35" x2="300" y2="35" stroke="#1a3060" strokeWidth="0.5"/>
              <polyline points={ecg.pts} fill="none" stroke={ecg.color} strokeWidth={ecg.sinusoidal?"2":"1.5"}/>
              <text x="5" y="62" fill={ecg.color} fontSize="8">{ecg.desc}</text>
            </svg>
          </div>
        ))}
      </div>
    );
  }

  function VecHipoContent() {
    if(!vec) return null;
    if(vec==='hipo') return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:10}}>⬇️ Hiponatremia Hipovolémica</div>
        <div style={{background:"#2a0505",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:6}}>🔴 Prioridad: restaurar perfusión</div>
          <div style={{fontSize:12,color:"#ef4444",lineHeight:1.9}}>Antes de corregir el sodio, asegurar:<br/>• <strong>Diuresis</strong> &gt;0.5 mL/kg/h · <strong>PAM</strong> &gt;65 mmHg · <strong>GCS</strong> estable<br/>→ Solicitar ELP + creatinina + BUN una vez estabilizado<br/>→ El volumen de SF entregado superará el calculado por la fórmula</div>
        </div>
        {[["Na urinario <20 mEq/L → Pérdida extrarrenal","• Diarrea / vómitos — causa más frecuente\n• Tercer espacio — pancreatitis, quemaduras, íleo\n• Sudoración excesiva","SF 0.9% · Velocidad según estado hemodinámico · Tratar causa"],
          ["Na urinario >20 mEq/L → Pérdida renal","• Diuréticos tiazídicos\n• Insuficiencia suprarrenal — déficit aldosterona\n• Síndrome pierde sal cerebral — post-HSA, TEC","SF 0.9% · Suspender diurético · Hidrocortisona si insuf. suprarrenal"]
        ].map(([title,causes,tto])=>(
          <div key={title} style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>{title}</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9,marginBottom:8}}>{causes.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>
            <div style={{padding:"8px 12px",background:"#0d2a4e",borderRadius:8,fontSize:12,color:"#22d3ee"}}><strong>Tratamiento:</strong> {tto}</div>
          </div>
        ))}
      </div>
    );
    if(vec==='eu') return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#22c55e",marginBottom:10}}>➡️ Hiponatremia Euvolémica</div>
        <div style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Causas principales</div>
          <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>• <strong>SIADH</strong> — causa más frecuente<br/>• <strong>Hipotiroidismo</strong> — solicitar TSH<br/>• <strong>Insuficiencia suprarrenal secundaria</strong><br/>• <strong>Polidipsia primaria</strong> — Osm urinaria &lt;100 mOsm/kg<br/>• <strong>Beer potomania</strong></div>
        </div>
        <div style={{background:"#0d2a4e",border:"1px solid #22d3ee44",borderRadius:8,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:8}}>SIADH — Receptor V2 tubular renal</div>
          <div style={{fontSize:12,color:"#22d3ee",lineHeight:1.8,marginBottom:8}}>ADH actúa en <strong>receptor V2</strong> → retención agua libre → dilución Na<br/>Criterios: Na &lt;135 · Osm plasmática &lt;275 · Osm urinaria &gt;100 · Na urinario &gt;40 · Euvolemia</div>
          <div style={{fontSize:11,fontWeight:700,color:"#22d3ee",marginBottom:6}}>⚠️ Siempre buscar causa secundaria:</div>
          <div style={{fontSize:12,color:"#22d3ee",lineHeight:1.9,marginBottom:10}}>• <strong>Pulmonar:</strong> neumonía, TBC, EPOC, VM<br/>• <strong>SNC:</strong> ACV, meningitis, TEC, tumores<br/>• <strong>Fármacos:</strong> ISRS, carbamacepina, AINEs, opioides<br/>• <strong>Tumores:</strong> Ca pulmón células pequeñas, Ca páncreas</div>
          <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Tratamiento SIADH</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>1. <strong>Restricción hídrica</strong> 500–800 mL/día<br/>2. <strong>Tratar causa subyacente</strong><br/>3. <strong>NaCl 3%</strong> si Na &lt;120 o sintomático<br/>4. <strong>Urea oral</strong> 15–60 g/día — SIADH crónico<br/>5. <strong>Tolvaptán</strong> — antagonista V2 · uso hospitalario</div>
          </div>
        </div>
      </div>
    );
    if(vec==='hiper') return (
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:10}}>⬆️ Hiponatremia Hipervolémica</div>
        <div style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:8}}>Causas principales</div>
          <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>• <strong>Insuficiencia cardíaca</strong> — ↓ GC → ↑ ADH + ↑ aldosterona<br/>• <strong>Cirrosis hepática</strong> — vasodilatación espláncnica → SRAA<br/>• <strong>Síndrome nefrótico</strong> — ↓ presión oncótica<br/>• <strong>Insuficiencia renal</strong></div>
        </div>
        <div style={{background:"#2a1a00",border:"1px solid #f59e0b44",borderRadius:8,padding:"12px 14px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:10}}>💊 Manejo escalonado de diuréticos</div>
          <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Paso 1 — Test de Furosemida</div>
            <div style={{fontSize:12,color:"#7aa2d4",marginBottom:8}}>Solicitar <strong>Creatinina</strong> antes para evaluar función renal basal.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div style={{background:"#052a10",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:11,color:"#22c55e",marginBottom:2}}>Sin diuréticos previos</div><div style={{fontSize:18,fontWeight:700,color:"#22c55e"}}>1 mg/kg IV</div></div>
              <div style={{background:"#2a1a00",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:11,color:"#f59e0b",marginBottom:2}}>Con diuréticos previos</div><div style={{fontSize:18,fontWeight:700,color:"#f59e0b"}}>1.5 mg/kg IV</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:"#052a10",borderRadius:8,padding:8}}><div style={{fontSize:11,fontWeight:700,color:"#22c55e",marginBottom:4}}>✓ Buena respuesta (2h)</div><div style={{fontSize:12,color:"#22c55e",lineHeight:1.7}}>&gt;200 mL orina en 2h<br/>Na urinario &gt;50–70 mEq/L<br/>→ Función renal conservada</div></div>
              <div style={{background:"#2a0505",borderRadius:8,padding:8}}><div style={{fontSize:11,fontWeight:700,color:"#ef4444",marginBottom:4}}>✗ Sin respuesta (2h)</div><div style={{fontSize:12,color:"#ef4444",lineHeight:1.7}}>&lt;200 mL en 2h<br/>Na urinario &lt;20 mEq/L<br/>→ Evaluar diálisis</div></div>
            </div>
          </div>
          <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22c55e",marginBottom:8}}>✓ Si buena respuesta — Escalada según causa</div>
            {[["Insuficiencia Cardíaca","#22d3ee","1. Aumentar Furosemida oral (máx 160–240 mg/día)\n2. Respuesta insuficiente → agregar Espironolactona 25–100 mg/día\n3. Persistencia → Furosemida + Espironolactona + Restricción hídrica\n4. Refractario → Tolvaptán o ultrafiltración"],
              ["Cirrosis Hepática","#22d3ee","1. Espironolactona 100 mg/día → primera línea\n2. Agregar Furosemida 40 mg/día si insuficiente\n3. Ratio: Espironolactona:Furosemida = 100:40\n4. Ascitis refractaria → paracentesis evacuadora + albúmina"]
            ].map(([title,color,text])=>(
              <div key={title} style={{background:"#0d2a4e",borderRadius:8,padding:10,marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:700,color,marginBottom:6}}>{title}</div>
                <div style={{fontSize:12,color,lineHeight:1.9}}>{text.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>
              </div>
            ))}
            <div style={{background:"#2a1a00",borderRadius:8,padding:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:6}}>⚠️ Monitorización</div>
              <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.9}}>• ELP + creatinina c/24–48h<br/>• Pérdida peso objetivo: <strong>0.5–1 kg/día</strong> (con edema) · <strong>máx 0.5 kg/día</strong> (solo ascitis)<br/>• Suspender si Cr &gt;2 mg/dL o Na &lt;120 mEq/L</div>
            </div>
          </div>
          <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:8}}>Definiciones de diuresis</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
              {[["Normal",">0.5 mL/kg/h","#22c55e","#052a10"],["Oliguria","<0.5 mL/kg/h","#f59e0b","#2a1a00"],["Anuria","<0.2 mL/kg/h","#ef4444","#2a0505"]].map(([label,val,color,bg])=>(
                <div key={label} style={{background:bg,borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:11,color,fontWeight:700}}>{label}</div><div style={{fontSize:12,fontWeight:700,color}}>{val}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    return null;
  }

  return (
    <div>
      {/* Tabs principales */}
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[["🧂 Sodio","Na⁺"],["🧪 Potasio","K⁺"],["🦴 Calcio","Ca²⁺"]].map(([label,ion],i)=>(
          <button key={i} onClick={()=>setMainTab(i)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:mainTab===i?"1px solid #22d3ee":"1px solid #1a3060",background:mainTab===i?"#0d2a4e":"#0b1730",color:mainTab===i?"#22d3ee":"#3a5a8f"}}>{label}</button>
        ))}
      </div>

      {/* ═══════════════════ SODIO ═══════════════════ */}
      {mainTab===0&&(
        <div>
          <div style={{background:"#2a1a00",border:"1px solid #f59e0b44",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:4}}>⚠️ Siempre evaluar glicemia</div>
            <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.7}}>Solicitar <strong>HGT o glicemia</strong> ante toda disnatremia. Por cada 100 mg/dL de glucosa sobre 100 → Na disminuye ~1.6 mEq/L. Corregir glucosa primero.</div>
          </div>

          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:12}}>Na⁺ — ALTERACIÓN</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["hipo","Hiponatremia","Na⁺ <135 mEq/L","#22d3ee"],["hiper","Hipernatremia","Na⁺ >145 mEq/L","#f59e0b"]].map(([t,label,sub,color])=>(
                <button key={t} onClick={()=>{setTipo(t);setVec(null);}} style={{background:tipo===t?color+"22":"#060d1f",border:`1px solid ${tipo===t?color:"#1a3060"}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                  <div style={{fontSize:15,fontWeight:700,color:tipo===t?color:"#e8edf5"}}>{label}</div>
                  <div style={{fontSize:11,color:"#4a6a9f",marginTop:4}}>{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {tipo==='hipo'&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #22d3ee44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>CLASIFICACIÓN POR SEVERIDAD</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
                  {[["Leve","130–134","#22c55e","#052a10"],["Moderada","125–129","#f59e0b","#2a1a00"],["Grave","<125","#ef4444","#2a0505"]].map(([l,v,c,bg])=>(
                    <div key={l} style={{background:bg,borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:c}}>{l}</div><div style={{fontSize:11,color:c}}>{v} mEq/L</div></div>
                  ))}
                </div>
                <div style={{background:"#2a0505",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:8}}>🚨 Hiponatremia sintomática grave — Bolo NaCl 3%</div>
                  <div style={{fontSize:12,color:"#ef4444",marginBottom:8,lineHeight:1.7}}>Indicado ante: <strong>convulsiones · vómitos explosivos · coma · GCS &lt;8</strong></div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Preparación NaCl 3%</div>
                    <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}><strong>Opción 1:</strong> NaCl 3% directo<br/><strong>Opción 2:</strong> 200 mL NaCl 10% + 800 mL SF 0.9% → 2.7%<br/><strong>Opción 3 (jeringa):</strong> 30 mL NaCl 10% + 70 mL SF → 100 mL al 3%</div>
                  </div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Protocolo de bolo</div>
                    <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>→ <strong>150 mL NaCl 3%</strong> IV en 20 min · Repetir hasta 3 veces<br/>→ Objetivo: subir Na 4–6 mEq/L en primeras horas<br/>→ <strong>Límite: 10 mEq/L en 24h</strong> · Controlar Na c/4–6h</div>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#4a6a9f",lineHeight:1.7}}>⚠️ <strong style={{color:"#ef4444"}}>SDO:</strong> riesgo si corrección &gt;10 mEq/L en 24h · Mayor riesgo en: desnutrición, alcoholismo, hipokalemia</div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #f59e0b44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:8}}>⏱ SIEMPRE DIFERENCIAR — Aguda vs Crónica</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"#2a0505",borderRadius:8,padding:10}}><div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:4}}>Aguda (&lt;48h)</div><div style={{fontSize:11,color:"#ef4444",lineHeight:1.7}}><strong>Máx: 10 mEq/L en 24h</strong><br/>Menor riesgo SDO</div></div>
                  <div style={{background:"#2a1a00",borderRadius:8,padding:10}}><div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:4}}>Crónica (&gt;48h)</div><div style={{fontSize:11,color:"#f59e0b",lineHeight:1.7}}><strong>Objetivo: 6–8 mEq/L en 24h</strong><br/>Mayor riesgo SDO</div></div>
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:12}}>VOLUMEN EXTRACELULAR (VEC)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[["hipo","⬇️ Hipovolémico","Piel seca · Taquicardia","#22d3ee"],["eu","➡️ Euvolémico","Sin edema · Sin deshidratación","#22c55e"],["hiper","⬆️ Hipervolémico","Edema · Ascitis","#f59e0b"]].map(([v,label,sub,color])=>(
                    <button key={v} onClick={()=>setVec(v)} style={{background:vec===v?color+"22":"#060d1f",border:`1px solid ${vec===v?color:"#1a3060"}`,borderRadius:10,padding:"10px 8px",cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:vec===v?color:"#e8edf5"}}>{label}</div>
                      <div style={{fontSize:11,color:"#4a6a9f",marginTop:4}}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
              <VecHipoContent/>
            </div>
          )}

          {tipo==='hiper'&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #f59e0b44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:10}}>CLASIFICACIÓN POR SEVERIDAD</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
                  {[["Leve","145–150","#f59e0b","#2a1a00"],["Moderada","150–160","#fb923c","#2a1500"],["Grave",">160","#ef4444","#2a0505"]].map(([l,v,c,bg])=>(
                    <div key={l} style={{background:bg,borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:c}}>{l}</div><div style={{fontSize:11,color:c}}>{v} mEq/L</div></div>
                  ))}
                </div>
                <div style={{background:"#2a0505",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:8}}>⚠️ Velocidad máxima de corrección</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div style={{background:"#040c1c",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#ef4444",marginBottom:4}}>MÁX/hora</div><div style={{fontSize:18,fontWeight:700,color:"#ef4444"}}>0.5 mEq/h</div></div>
                    <div style={{background:"#040c1c",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#ef4444",marginBottom:4}}>MÁX/24h</div><div style={{fontSize:18,fontWeight:700,color:"#ef4444"}}>10–12 mEq</div></div>
                  </div>
                  <div style={{fontSize:11,color:"#ef4444",marginTop:8,lineHeight:1.7}}>⚠️ Corrección rápida → <strong>edema cerebral</strong> · Mayor riesgo en hipernatremia crónica (&gt;48h)</div>
                </div>
                <div style={{background:"#0d1b3e",borderRadius:10,padding:"12px 14px"}}>
                  <div style={{fontSize:11,color:"#a78bfa",letterSpacing:1,fontWeight:700,marginBottom:6}}>SÍNTOMAS — Principalmente neurológicos</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                    {[["Leve","Sed intensa · Irritabilidad · Letargia","#a78bfa"],["Moderada","Confusión · Hiperreflexia · Debilidad","#f59e0b"],["Grave","Convulsiones · Coma · Hemorragia cerebral","#ef4444"]].map(([l,s,c])=>(
                      <div key={l} style={{background:"#040c1c",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:11,color:c,fontWeight:700}}>{l}</div><div style={{fontSize:11,color:"#7aa2d4",marginTop:4}}>{s}</div></div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:12}}>VOLUMEN EXTRACELULAR (VEC)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[["hipo","⬇️ Hipovolémico","Pérdida agua > pérdida Na","#22d3ee"],["eu","➡️ Euvolémico","Pérdida agua pura","#22c55e"],["hiper","⬆️ Hipervolémico","Exceso de sodio","#f59e0b"]].map(([v,label,sub,color])=>(
                    <button key={v} onClick={()=>setVec(v)} style={{background:vec===v?color+"22":"#060d1f",border:`1px solid ${vec===v?color:"#1a3060"}`,borderRadius:10,padding:"10px 8px",cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:vec===v?color:"#e8edf5"}}>{label}</div>
                      <div style={{fontSize:11,color:"#4a6a9f",marginTop:4}}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {vec==='hipo'&&(
                <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:10}}>⬇️ Hipernatremia Hipovolémica</div>
                  <div style={{fontSize:12,color:"#7aa2d4",marginBottom:10,lineHeight:1.7}}>Pérdida de agua <strong>mayor que pérdida de sodio</strong>. La más frecuente.</div>
                  {[["Osm urinaria alta (>800 mOsm/kg) → Pérdida extrarrenal","• Diarrea osmótica — pérdida hipotónica\n• Sudoración excesiva — fiebre, ejercicio\n• Quemaduras extensas — pérdida insensible masiva","Reponer volumen con SF 0.9% si inestable → luego agua libre oral/SNG o SG 5%"],
                    ["Osm urinaria baja (<300 mOsm/kg) → Pérdida renal","• Diuréticos de asa — pérdida de agua libre\n• Diuresis osmótica — glucosuria, manitol, urea","Corregir causa · Agua libre oral/SNG · SG 5% IV si no tolera oral"]
                  ].map(([title,causes,tto])=>(
                    <div key={title} style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>{title}</div>
                      <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9,marginBottom:8}}>{causes.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>
                      <div style={{padding:"8px 12px",background:"#0d2a4e",borderRadius:8,fontSize:12,color:"#22d3ee"}}><strong>Tratamiento:</strong> {tto}</div>
                    </div>
                  ))}
                </div>
              )}

              {vec==='eu'&&(
                <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#22c55e",marginBottom:10}}>➡️ Hipernatremia Euvolémica — Pérdida de agua pura</div>
                  <div style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Pérdidas insensibles puras</div>
                    <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>• <strong>Fiebre alta</strong> — cada 1°C sobre 37 → +100–150 mL/día<br/>• <strong>Hiperventilación</strong><br/>• <strong>Paciente intubado</strong> sin humidificación adecuada</div>
                  </div>
                  <div style={{background:"#0d2a4e",border:"1px solid #22d3ee44",borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:10}}>🔵 Diabetes Insípida (DI)</div>
                    <div style={{fontSize:12,color:"#22d3ee",marginBottom:8,lineHeight:1.7}}>Incapacidad de concentrar la orina → poliuria hipotónica → hipernatremia<br/>Diagnóstico: <strong>Osm urinaria &lt;300 mOsm/kg</strong> con Na &gt;145 y Osm plasmática &gt;295</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[["DI Central","#a78bfa","#1a0a2e","Déficit de ADH por daño hipofisario.\nCausas: Neurocirugía / TEC · Tumores · Infiltración (sarcoidosis) · Isquemia hipofisaria","Test DDAVP → Osm urinaria sube >50% → DI Central","Desmopresina (DDAVP) — receptor V2\nIntranasal: 10–20 mcg c/12–24h\nOral: 0.1–0.4 mg c/8–12h\nSC/IV: 1–4 mcg c/12–24h"],
                        ["DI Nefrogénica","#34d399","#052a10","Resistencia tubular al efecto de ADH.\nCausas: Litio (más frecuente) · Hipercalcemia · Hipokalemia crónica · Congénita","Test DDAVP → Osm urinaria NO sube → DI Nefrogénica","Corregir causa · Restricción sodio · Tiazidas paradójicamente reducen diuresis · AINEs en casos seleccionados"]
                      ].map(([title,color,bg,causas,test,tto])=>(
                        <div key={title} style={{background:bg,borderRadius:8,padding:10}}>
                          <div style={{fontSize:11,fontWeight:700,color,marginBottom:6}}>{title}</div>
                          <div style={{fontSize:11,color:"#7aa2d4",lineHeight:1.7,marginBottom:6}}>{causas.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>
                          <div style={{background:"#040c1c",borderRadius:6,padding:8,marginBottom:6}}>
                            <div style={{fontSize:10,fontWeight:700,color,marginBottom:2}}>Test de desmopresina</div>
                            <div style={{fontSize:11,color,lineHeight:1.5}}>{test}</div>
                          </div>
                          <div style={{background:"#040c1c",borderRadius:6,padding:8}}>
                            <div style={{fontSize:10,fontWeight:700,color,marginBottom:2}}>Tratamiento</div>
                            <div style={{fontSize:11,color,lineHeight:1.7}}>{tto.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {vec==='hiper'&&(
                <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:10}}>⬆️ Hipernatremia Hipervolémica</div>
                  <div style={{background:"#0d1b3e",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:6}}>Causas — generalmente iatrogénica</div>
                    <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>• <strong>Aporte excesivo de NaCl hipertónico</strong><br/>• <strong>NaHCO₃ hipertónico</strong> — corrección de acidosis<br/>• <strong>Alimentación parenteral</strong> hipertónica<br/>• <strong>Hiperaldosteronismo primario</strong> — Conn<br/>• <strong>Síndrome de Cushing</strong></div>
                  </div>
                  <div style={{background:"#2a1a00",border:"1px solid #f59e0b44",borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:8}}>Tratamiento</div>
                    <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.9}}>1. <strong>Suspender aporte de sodio exógeno</strong><br/>2. <strong>Furosemida</strong> para eliminar exceso de Na⁺<br/>3. <strong>Agua libre</strong> oral/SNG o SG 5% IV<br/>4. Tratar causa subyacente</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calculadora sodio */}
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginTop:16}}>
            <button onClick={()=>setCalcOpen(s=>!s)} style={{width:"100%",textAlign:"left",background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center",padding:0,color:"#e8edf5"}}>
              <div style={{fontSize:13,fontWeight:700}}>🧮 Calculadora de corrección de sodio</div>
              <span>{calcOpen?"▲":"▼"}</span>
            </button>
            {calcOpen&&(
              <div style={{marginTop:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  <div><div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Na actual (mEq/L)</div><input type="number" value={naActual} onChange={e=>setNaActual(e.target.value)} placeholder="118" style={inp}/></div>
                  <div><div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Na objetivo (mEq/L)</div><input type="number" value={naObj} onChange={e=>setNaObj(e.target.value)} placeholder="125" style={inp}/></div>
                  <div><div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Peso (kg)</div><input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="70" style={inp}/></div>
                  <div><div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Sexo / edad</div>
                    <select value={sexo} onChange={e=>setSexo(e.target.value)} style={inp}>
                      <option value="0.6">Hombre (0.6)</option>
                      <option value="0.5">Mujer (0.5)</option>
                      <option value="0.45">Adulto mayor (0.45)</option>
                    </select>
                  </div>
                </div>
                {na&&obj&&na<obj&&(
                  <div>
                    <div style={{fontSize:11,color:"#4a6a9f",marginBottom:6}}>Solución (hiponatremia)</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                      {[["3%","NaCl 3%","513 mEq/L"],["2.7%","NaCl 2.7%","200mL 10%+800mL SF"],["0.9%","NaCl 0.9%","154 mEq/L"]].map(([s,label,sub])=>(
                        <button key={s} onClick={()=>setSol(s)} style={{flex:1,minWidth:80,padding:8,borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${sol===s?"#22d3ee":"#1a3060"}`,background:sol===s?"#0d2a4e":"#060d1f",color:sol===s?"#22d3ee":"#4a6a9f"}}>{label}<br/><span style={{fontWeight:400,fontSize:10}}>{sub}</span></button>
                      ))}
                    </div>
                    <div style={{marginBottom:12}}>
                      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"#7aa2d4"}}>
                        <input type="checkbox" checked={hipokal} onChange={e=>setHipokal(e.target.checked)} style={{width:16,height:16}}/>
                        Hipokalemia concomitante (agregar 10g KCl)
                      </label>
                    </div>
                  </div>
                )}
                {na&&obj&&na>obj&&na>145&&(
                  <div>
                    <div style={{fontSize:11,color:"#4a6a9f",marginBottom:6}}>Vía de reposición (hipernatremia)</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                      {[["oral","Agua destilada","Oral / SNG"],["sg5","SG 5% IV","0 mEq/L"],["sf045","SF 0.45% IV","77 mEq/L"]].map(([v,label,sub])=>(
                        <button key={v} onClick={()=>setVia(v)} style={{flex:1,minWidth:80,padding:8,borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${via===v?"#f59e0b":"#1a3060"}`,background:via===v?"#2a1a00":"#060d1f",color:via===v?"#f59e0b":"#4a6a9f"}}>{label}<br/><span style={{fontWeight:400,fontSize:10}}>{sub}</span></button>
                      ))}
                    </div>
                  </div>
                )}
                {defHipo!==null&&(
                  <div style={{background:"#040c1c",borderRadius:10,padding:14}}>
                    <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>RESULTADO — Hiponatremia · Fórmula Adrogue-Madias</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                      <div style={{background:"#0b1730",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>DÉFICIT Na</div><div style={{fontSize:22,fontWeight:700,color:"#22d3ee"}}>{defHipo.toFixed(1)}</div><div style={{fontSize:11,color:"#4a6a9f"}}>mEq</div></div>
                      <div style={{background:"#0b1730",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>ACT</div><div style={{fontSize:22,fontWeight:700,color:"#22d3ee"}}>{act.toFixed(1)}</div><div style={{fontSize:11,color:"#4a6a9f"}}>L</div></div>
                    </div>
                    <div style={{background:"#0b1730",borderRadius:8,padding:12,marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#e8edf5",marginBottom:8}}>Velocidad de corrección segura</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                        <div style={{background:"#052a10",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#22c55e",marginBottom:2}}>MÁX/hora</div><div style={{fontSize:15,fontWeight:700,color:"#22c55e"}}>0.5 mEq/h</div></div>
                        <div style={{background:"#2a1a00",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#f59e0b",marginBottom:2}}>MÁX/24h aguda</div><div style={{fontSize:15,fontWeight:700,color:"#f59e0b"}}>10 mEq</div></div>
                        <div style={{background:"#2a0505",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#ef4444",marginBottom:2}}>MÁX/24h crónica</div><div style={{fontSize:15,fontWeight:700,color:"#ef4444"}}>6–8 mEq</div></div>
                      </div>
                    </div>
                    <div style={{background:"#0d2a4e",borderRadius:8,padding:10,fontSize:12,color:"#22d3ee",lineHeight:1.9,marginBottom:8}}>
                      {(()=>{const diff=obj-na,maxCorr=Math.min(diff,10);const conc=sol==='3%'?513:sol==='2.7%'?462:154;const vol=(act*maxCorr/conc)*1000;const vel=vol/(maxCorr/0.5);const solName=sol==='3%'?'NaCl 3% (513 mEq/L)':sol==='2.7%'?'NaCl 2.7% — 200mL NaCl 10% + 800mL SF':'NaCl 0.9% (154 mEq/L)';return <><strong>{solName}:</strong>{diff>10?' ⚠️ Objetivo ajustado a máx 10 mEq/L':''}<br/>→ <strong>{vol.toFixed(0)} mL</strong> para corregir {maxCorr.toFixed(0)} mEq/L<br/>→ Velocidad sugerida: <strong>{vel.toFixed(1)} mL/hr</strong></>;})()}
                    </div>
                    {sol==='2.7%'&&<div style={{background:"#052a10",borderRadius:8,padding:10,fontSize:12,color:"#22c55e",lineHeight:1.8,marginBottom:8}}>💡 <strong>Tip clínico:</strong> NaCl 2.7% a <strong>1 mL/kg/h</strong>{hipokal?' + 10g KCl':''} → esperar subida 4–6 mEq/L en 4h → repetir ELP y reevaluar.</div>}
                    {hipokal&&<div style={{background:"#2a1a00",borderRadius:8,padding:10,fontSize:12,color:"#f59e0b",lineHeight:1.8,marginBottom:8}}>⚠️ <strong>Hipokalemia concomitante:</strong> Agregar <strong>10g KCl</strong> · La corrección del K⁺ también sube el Na → considerar en cálculo total.</div>}
                    <div style={{padding:"8px 10px",background:"#2a0505",borderRadius:8,fontSize:11,color:"#ef4444"}}>⚠️ Controlar Na c/4–6h · No superar 10 mEq/L en 24h · En hipovolémica pura el volumen real superará el calculado</div>
                  </div>
                )}
                {defHiper!==null&&(
                  <div style={{background:"#040c1c",borderRadius:10,padding:14}}>
                    <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:10}}>RESULTADO — Hipernatremia · Déficit de agua libre</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                      <div style={{background:"#0b1730",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>DÉFICIT AGUA LIBRE</div><div style={{fontSize:22,fontWeight:700,color:"#f59e0b"}}>{defHiper.toFixed(1)}</div><div style={{fontSize:11,color:"#4a6a9f"}}>litros</div></div>
                      <div style={{background:"#0b1730",borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>TIEMPO ESTIMADO</div><div style={{fontSize:22,fontWeight:700,color:"#f59e0b"}}>{horasHiper}h</div><div style={{fontSize:11,color:"#4a6a9f"}}>a 0.5 mEq/h</div></div>
                    </div>
                    <div style={{background:"#2a1a00",borderRadius:8,padding:10,fontSize:12,color:"#f59e0b",lineHeight:1.9,marginBottom:8}}>
                      <strong>{via==='oral'?'Agua destilada oral/SNG':via==='sg5'?'SG 5% IV':'SF 0.45% IV'}:</strong><br/>
                      → Déficit agua libre: <strong>{(defHiper*1000).toFixed(0)} mL</strong> · Volumen {via==='sf045'?'SF 0.45%':'a infundir'}: <strong>{volHiper.toFixed(0)} mL</strong><br/>
                      → Velocidad segura: <strong>{velHiper.toFixed(0)} mL/hr</strong> por {horasHiper}h<br/>
                      → Agregar pérdidas insensibles en curso: +30–50 mL/hr según contexto
                    </div>
                    <div style={{padding:"8px 10px",background:"#2a0505",borderRadius:8,fontSize:11,color:"#ef4444"}}>⚠️ Controlar Na c/4–6h · Corrección rápida → edema cerebral</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ POTASIO ═══════════════════ */}
      {mainTab===1&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[["📉 Hipokalemia","#22d3ee"],["📈 Hiperkalemia","#ef4444"]].map(([label,color],i)=>(
              <button key={i} onClick={()=>setKTab(i)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:kTab===i?`1px solid ${color}`:"1px solid #1a3060",background:kTab===i?color+"22":"#0b1730",color:kTab===i?color:"#3a5a8f"}}>{label}</button>
            ))}
          </div>

          {kTab===0&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>CLASIFICACIÓN</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["LEVE","3.0–3.5","#22c55e","#052a10","Generalmente asintomático"],["MODERADA","2.5–3.0","#f59e0b","#2a1a00","Síntomas musculares"],["GRAVE","<2.5","#ef4444","#2a0505","Parálisis · Arritmias"]].map(([g,v,c,bg,d])=>(
                    <div key={g} style={{background:bg,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:c,marginBottom:4}}>{g}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:c}}>mEq/L</div><div style={{fontSize:11,color:c,marginTop:6}}>{d}</div></div>
                  ))}
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>CAUSAS FRECUENTES</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Pérdidas renales</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Diuréticos (tiazidas, asa)<br/>• Hiperaldosteronismo<br/>• Hipomagnesemia<br/>• ATR distal/proximal<br/>• Síndrome de Cushing</div></div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Pérdidas extrarrenales</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Diarrea / vómitos<br/>• SNG abierta<br/>• Fístulas digestivas<br/>• Ingesta insuficiente<br/>• Desplazamiento intracelular</div></div>
                </div>
                <div style={{background:"#040c1c",borderRadius:8,padding:10,fontSize:12,color:"#7aa2d4"}}><strong style={{color:"#e8edf5"}}>Desplazamiento intracelular:</strong> Insulina · Salbutamol · Alcalosis metabólica · Parálisis periódica hipopotasémica</div>
              </div>
              <EcgHipo/>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>TRATAMIENTO</div>
                <TtoStep color="#22c55e" titulo="Vía oral — Leve a moderada (K⁺ >2.5 asintomático)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• KCl oral: <strong style={{color:"#e8edf5"}}>40–80 mEq/día</strong> dividido en 2–4 dosis<br/>• Preferir alimentos ricos en K⁺: plátano, naranja, legumbres<br/>• Control ELP a las 24–48h</div>
                </TtoStep>
                <TtoStep color="#f59e0b" titulo="Vía IV periférica — Moderada o intolerancia oral">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8,marginBottom:10}}>• KCl: <strong style={{color:"#e8edf5"}}>máx 20 mEq/h</strong> · Monitoreo ECG continuo · Máx 40 mEq por frasco</div>
                  <div style={{background:"#0b1730",borderRadius:10,padding:12,border:"1px solid #f59e0b44"}}>
                    <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,fontWeight:700,marginBottom:8}}>📋 PREPARACIÓN ESTÁNDAR — VÍA PERIFÉRICA</div>
                    <div style={{background:"#040c1c",borderRadius:8,padding:10,fontSize:12,color:"#e8edf5",lineHeight:2}}>
                      <span style={{color:"#f59e0b",fontWeight:700}}>500 mL SF 0.9%</span><br/>
                      + <span style={{color:"#f59e0b",fontWeight:700}}>3 g KCl</span> → 3 amp KCl 10% (10 mL c/u)<br/>
                      + <span style={{color:"#34d399",fontWeight:700}}>2.5 g MgSO₄</span> → 2 amp MgSO₄ 1.25% (25 mL c/u)
                    </div>
                    <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div style={{background:"#040c1c",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>VELOCIDAD</div><div style={{fontSize:18,fontWeight:800,color:"#f59e0b"}}>83–125 mL/h</div><div style={{fontSize:10,color:"#4a6a9f"}}>(pasar en 4–6h)</div></div>
                      <div style={{background:"#040c1c",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>APORTA</div><div style={{fontSize:13,fontWeight:700,color:"#f59e0b"}}>~40 mEq K⁺</div><div style={{fontSize:10,color:"#34d399"}}>+ 2.5 g Mg²⁺</div></div>
                    </div>
                  </div>
                </TtoStep>
                <TtoStep color="#ef4444" titulo="Vía IV central — Grave (K⁺ <2.5) o sintomático">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• KCl: hasta <strong style={{color:"#e8edf5"}}>40 mEq/h</strong> por CVC<br/>• <strong style={{color:"#ef4444"}}>Monitoreo ECG continuo obligatorio</strong><br/>• Mayor concentración de KCl permitida por vía central<br/>• Control ELP c/4–6h</div>
                </TtoStep>
                <div style={{background:"#2a0505",borderRadius:10,padding:12,fontSize:12,color:"#ef4444",lineHeight:1.8}}>
                  ⚠️ <strong>Nunca administrar KCl IV directo sin diluir</strong> — riesgo de paro cardíaco<br/>
                  ⚠️ Corregir hipomagnesemia asociada — Mg²⁺ es cofactor de la Na/K-ATPasa<br/>
                  ⚠️ Cada 10 mEq de K⁺ repuesto ≈ 0.1 mEq/L de aumento (aproximación)
                </div>
              </div>
            </div>
          )}

          {kTab===1&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>CLASIFICACIÓN</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["LEVE","5.1–5.9","#22c55e","#052a10","Sin síntomas"],["MODERADA","6.0–6.4","#f59e0b","#2a1a00","Cambios ECG posibles"],["GRAVE","≥6.5","#ef4444","#2a0505","Arritmias · Paro"]].map(([g,v,c,bg,d])=>(
                    <div key={g} style={{background:bg,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:c,marginBottom:4}}>{g}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:c}}>mEq/L</div><div style={{fontSize:11,color:c,marginTop:6}}>{d}</div></div>
                  ))}
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>CAUSAS FRECUENTES</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Retención renal</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• IRA / ERC<br/>• IECA / ARA II<br/>• Diuréticos ahorradores K⁺<br/>• Hipoaldosteronismo<br/>• Heparina</div></div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Desplazamiento extracelular</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Acidosis metabólica<br/>• Rabdomiólisis · Hemólisis<br/>• Lisis tumoral<br/>• Hiperglicemia grave<br/>• Succinilcolina</div></div>
                </div>
              </div>
              <EcgHiper/>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:12}}>ALGORITMO DE TRATAMIENTO</div>
                <TtoStep color="#ef4444" titulo="PASO 1 — Estabilización de membrana (si cambios ECG)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>💊 <strong style={{color:"#e8edf5"}}>Gluconato de calcio 10%</strong><br/>• <strong style={{color:"#ef4444"}}>1–2 g IV en 10 min</strong> · Inicio 1–3 min · Duración 30–60 min<br/>• Repetir a los 5 min si persisten cambios ECG<br/>• No reduce K⁺ — solo protege el miocardio · ⚠️ Evitar en intoxicación digoxina</div>
                </TtoStep>
                <TtoStep color="#f59e0b" titulo="PASO 2 — Desplazamiento intracelular de K⁺">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>💊 <strong style={{color:"#e8edf5"}}>Insulina + Glucosa:</strong> 10 UI cristalina IV + Glucosa 50% 50 mL · Baja K⁺ ~0.6–1.2 mEq/L · Monitorear glicemia c/1h<br/>💊 <strong style={{color:"#e8edf5"}}>Salbutamol nebulizado:</strong> 10–20 mg · Efecto aditivo con insulina<br/>💊 <strong style={{color:"#e8edf5"}}>Bicarbonato:</strong> solo si acidosis metabólica severa (pH &lt;7.1) · 50–100 mEq IV en 30 min</div>
                </TtoStep>
                <TtoStep color="#22c55e" titulo="PASO 3 — Eliminación de K⁺ del organismo">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>💊 <strong style={{color:"#e8edf5"}}>Furosemida 40–80 mg IV</strong> — solo si función renal conservada<br/>💊 <strong style={{color:"#e8edf5"}}>Kayexalate 15–30 g VO/rectal</strong> — útil en ERC · riesgo necrosis intestinal<br/>💊 <strong style={{color:"#e8edf5"}}>Patiromer / Ciclosilicato de Zirconio</strong> — alternativas más seguras</div>
                </TtoStep>
                <TtoStep color="#a78bfa" titulo="PASO 4 — Diálisis (refractaria o anúrica)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• K⁺ &gt;6.5 con cambios ECG graves que no responde a tratamiento médico<br/>• IRA anúrica · Hemodiálisis intermitente: método más rápido · Contactar nefrología precozmente</div>
                </TtoStep>
                <div style={{background:"#2a0505",borderRadius:10,padding:12,fontSize:12,color:"#ef4444",lineHeight:1.8}}>
                  ⚠️ Pasos 1 y 2 son temporales — no eliminan K⁺ del organismo<br/>
                  ⚠️ Siempre complementar con eliminación (paso 3 o 4)<br/>
                  ⚠️ Suspender fármacos que elevan K⁺ (IECA, ARA II, ahorradores)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ CALCIO ═══════════════════ */}
      {mainTab===2&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[["📉 Hipocalcemia","#22d3ee"],["📈 Hipercalcemia","#ef4444"]].map(([label,color],i)=>(
              <button key={i} onClick={()=>setCaTab(i)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:caTab===i?`1px solid ${color}`:"1px solid #1a3060",background:caTab===i?color+"22":"#0b1730",color:caTab===i?color:"#3a5a8f"}}>{label}</button>
            ))}
          </div>

          {caTab===0&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>VALORES DE REFERENCIA</div>
                <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:10,fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>
                  <strong style={{color:"#e8edf5"}}>Calcio total normal:</strong> 8.5–10.5 mg/dL<br/>
                  <strong style={{color:"#e8edf5"}}>Calcio iónico normal:</strong> 1.15–1.35 mmol/L<br/>
                  <strong style={{color:"#e8edf5"}}>⚠️ Corrección por albúmina:</strong> Ca corregido = Ca medido + 0.8 × (4 − Albúmina g/dL)<br/>
                  Usar <strong>calcio iónico</strong> si hay dudas — es el fisiológicamente activo
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"#052a10",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:"#22c55e",marginBottom:4}}>LEVE</div><div style={{fontSize:20,fontWeight:800,color:"#22c55e"}}>7.5–8.5</div><div style={{fontSize:10,color:"#22c55e"}}>mg/dL</div></div>
                  <div style={{background:"#2a0505",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:"#ef4444",marginBottom:4}}>GRAVE</div><div style={{fontSize:20,fontWeight:800,color:"#ef4444"}}>&lt;7.5</div><div style={{fontSize:10,color:"#ef4444"}}>mg/dL</div></div>
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>CAUSAS Y SÍNTOMAS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Causas frecuentes</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Hipoparatiroidismo<br/>• Déficit vitamina D<br/>• Post-cirugía tiroidea<br/>• Pancreatitis aguda<br/>• IRC / hiperfosfatemia<br/>• Hipomagnesemia<br/>• Transfusión masiva (citrato)</div></div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginBottom:6}}>Síntomas</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Parestesias peribucales<br/>• Tetania · Espasmo carpopedal<br/>• Signo de Chvostek ✓<br/>• Signo de Trousseau ✓<br/>• Laringoespasmo<br/>• Convulsiones<br/>• QT prolongado · Arritmias</div></div>
                </div>
                <div style={{background:"#040c1c",borderRadius:8,padding:10,fontSize:12,color:"#7aa2d4",lineHeight:1.7}}>
                  <strong style={{color:"#e8edf5"}}>Chvostek:</strong> Percutir nervio facial → contracción ipsilateral labio/ala nariz<br/>
                  <strong style={{color:"#e8edf5"}}>Trousseau:</strong> Manguito a 20 mmHg sobre TAS por 3 min → espasmo carpopedal
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>TRATAMIENTO</div>
                <TtoStep color="#ef4444" titulo="Sintomático / Grave — IV urgente">
                  <div style={{background:"#0b1730",borderRadius:10,padding:12,border:"1px solid #ef444444",marginBottom:10}}>
                    <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,fontWeight:700,marginBottom:10}}>📋 INFUSIÓN GLUCONATO DE CALCIO 10% — CALCULADORA</div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <input type="number" value={pesoCa} onChange={e=>setPesoCa(e.target.value)} placeholder="70"
                        style={{width:90,background:"#040c1c",border:"1px solid #1a4080",borderRadius:8,color:"#22d3ee",fontSize:20,fontWeight:800,padding:"5px 12px",outline:"none",fontFamily:"inherit"}}/>
                      <span style={{fontSize:16,color:"#22d3ee",fontWeight:700}}>kg</span>
                    </div>
                    <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:8,borderLeft:"3px solid #f59e0b"}}>
                      <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginBottom:6}}>Vía Periférica</div>
                      <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9,marginBottom:8}}><strong style={{color:"#e8edf5"}}>Preparación:</strong> 11 amp Gluconato Ca 10% (110 mL) en 1 Lt SF<br/><strong style={{color:"#e8edf5"}}>Concentración:</strong> ~1 mg Ca elemental/mL · <strong style={{color:"#e8edf5"}}>Dosis:</strong> 0.5 mL/kg/h</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                        <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>INICIO</div><div style={{fontSize:18,fontWeight:800,color:"#f59e0b"}}>{wCa>0?(wCa*0.5).toFixed(1):"—"}</div><div style={{fontSize:10,color:"#4a6a9f"}}>mL/h</div></div>
                        <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>MÁX (2 mL/kg/h)</div><div style={{fontSize:18,fontWeight:800,color:"#ef4444"}}>{wCa>0?(wCa*2).toFixed(1):"—"}</div><div style={{fontSize:10,color:"#4a6a9f"}}>mL/h</div></div>
                        <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>Control</div><div style={{fontSize:13,fontWeight:700,color:"#22d3ee"}}>c/4–6h</div></div>
                      </div>
                    </div>
                    <div style={{background:"#040c1c",borderRadius:8,padding:10,borderLeft:"3px solid #ef4444"}}>
                      <div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginBottom:6}}>Vía Central</div>
                      <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9,marginBottom:8}}><strong style={{color:"#e8edf5"}}>Preparación:</strong> 11 amp Gluconato Ca 10% (110 mL) en 500 mL SF<br/><strong style={{color:"#e8edf5"}}>Concentración:</strong> ~2 mg Ca elemental/mL · <strong style={{color:"#e8edf5"}}>Dosis:</strong> 0.25 mL/kg/h</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>INICIO (0.25 mL/kg/h)</div><div style={{fontSize:18,fontWeight:800,color:"#ef4444"}}>{wCa>0?(wCa*0.25).toFixed(1):"—"}</div><div style={{fontSize:10,color:"#4a6a9f"}}>mL/h</div></div>
                        <div style={{background:"#0b1730",borderRadius:6,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>MÁX (1 mL/kg/h)</div><div style={{fontSize:18,fontWeight:800,color:"#ef4444"}}>{wCa>0?(wCa*1).toFixed(1):"—"}</div><div style={{fontSize:10,color:"#4a6a9f"}}>mL/h</div></div>
                      </div>
                    </div>
                    <div style={{marginTop:8,fontSize:11,color:"#4a6a9f",lineHeight:1.6}}>
                      ⚠️ Iniciar siempre con dosis baja y titular según calcio iónico/total<br/>
                      ⚠️ Extravasación periférica causa necrosis — preferir vía central en infusión prolongada
                    </div>
                  </div>
                  <div style={{fontSize:12,color:"#7aa2d4"}}>💊 <strong style={{color:"#e8edf5"}}>Bolo inicial si tetania/convulsión:</strong> 1–2 g Gluconato Ca IV en 10–20 min antes de infusión</div>
                </TtoStep>
                <TtoStep color="#22c55e" titulo="Asintomático / Leve — Oral">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>💊 <strong style={{color:"#e8edf5"}}>Carbonato de calcio oral</strong><br/>• 1–2 g calcio elemental/día en 2–3 dosis con comidas<br/>• Asociar vitamina D: calcitriol 0.25–0.5 mcg/día · Control Ca²⁺ a 48–72h</div>
                </TtoStep>
              </div>
            </div>
          )}

          {caTab===1&&(
            <div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>CLASIFICACIÓN</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["LEVE","10.5–12","#22c55e","#052a10"],["MODERADA","12–14","#f59e0b","#2a1a00"],["GRAVE / CRISIS",">14","#ef4444","#2a0505"]].map(([g,v,c,bg])=>(
                    <div key={g} style={{background:bg,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:c,marginBottom:4}}>{g}</div><div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:c}}>mg/dL</div></div>
                  ))}
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>CAUSAS Y SÍNTOMAS</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Causas frecuentes</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Hiperparatiroidismo primario<br/>• Neoplasias (PTHrP)<br/>• Metástasis óseas<br/>• Sarcoidosis<br/>• Exceso vitamina D<br/>• Tiazidas · Litio</div></div>
                  <div style={{background:"#040c1c",borderRadius:8,padding:10}}><div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginBottom:6}}>Síntomas</div><div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>🦴 <strong>Bones:</strong> dolor óseo, fracturas<br/>🪨 <strong>Stones:</strong> nefrolitiasis, poliuria<br/>😣 <strong>Groans:</strong> náuseas, vómitos, constipación<br/>🧠 <strong>Moans:</strong> letargia, confusión, coma<br/>• QT corto · Bradicardia</div></div>
                </div>
              </div>
              <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:10}}>TRATAMIENTO</div>
                <TtoStep color="#22d3ee" titulo="Paso 1 — Hidratación vigorosa (siempre primero)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• <strong style={{color:"#e8edf5"}}>SF 0.9%: 200–300 mL/h</strong> hasta reponer volumen · Objetivo diuresis &gt;100–150 mL/h</div>
                </TtoStep>
                <TtoStep color="#f59e0b" titulo="Paso 2 — Furosemida (solo tras hidratación adecuada)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• <strong style={{color:"#e8edf5"}}>20–40 mg IV</strong> · ⚠️ No usar antes de hidratar — empeora hipercalcemia</div>
                </TtoStep>
                <TtoStep color="#a78bfa" titulo="Paso 3 — Bifosfonatos (Ca²⁺ >12 o causa tumoral)">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>
                    💊 <strong style={{color:"#e8edf5"}}>Zoledronato 4 mg IV</strong> en 100 mL SF en 15 min · Primera línea<br/>
                    💊 <strong style={{color:"#e8edf5"}}>Pamidronato 60–90 mg IV</strong> en 250 mL SF en 2–4h<br/>
                    • Inicio: 24–72h · Ajustar en insuficiencia renal
                  </div>
                </TtoStep>
                <TtoStep color="#34d399" titulo="Paso 4 — Otras medidas según causa">
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>
                    • <strong style={{color:"#e8edf5"}}>Corticoides:</strong> prednisona 40–60 mg/día (sarcoidosis, mieloma, intox. Vit D)<br/>
                    • <strong style={{color:"#e8edf5"}}>Calcitonina:</strong> 4–8 UI/kg SC/IM c/12h — inicio rápido (4–6h), efecto limitado 48h<br/>
                    • <strong style={{color:"#e8edf5"}}>Denosumab:</strong> si refractario a bifosfonatos<br/>
                    • <strong style={{color:"#e8edf5"}}>Hemodiálisis:</strong> crisis hipercalcémica con IR o cardiopatía grave
                  </div>
                </TtoStep>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function RCPTab() {
  const [ciclo, setCiclo] = useState(0);
  const [adreCount, setAdreCount] = useState(0);
  const [amioCount, setAmioCount] = useState(0);
  const [ciclosFV, setCiclosFV] = useState(0);
  const [ritmoActual, setRitmoActual] = useState(null);
  const [vaaHecho, setVaaHecho] = useState(false);
  const [cincoHecho, setCincoHecho] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [log, setLog] = useState([]);
  const [timerSec, setTimerSec] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [metroOn, setMetroOn] = useState(false);
  const [beat, setBeat] = useState(false);
  const timerRef = useState(null);
  const metroRef = useState(null);
  const logEndRef = useState(null);

  function tiempo(sec) {
    const s = sec !== undefined ? sec : timerSec;
    return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
  }

  function addLog(texto, color, bg) {
    setLog(l => [...l, {texto, color: color||'#7aa2d4', bg: bg||'#040c1c'}]);
  }

  function toggleTimer() {
    if(timerOn) {
      clearInterval(timerRef[0]);
      timerRef[0] = null;
      setTimerOn(false);
    } else {
      timerRef[0] = setInterval(() => setTimerSec(s => s+1), 1000);
      setTimerOn(true);
    }
  }

  function resetTodo() {
    clearInterval(timerRef[0]);
    clearInterval(metroRef[0]);
    timerRef[0] = null; metroRef[0] = null;
    setTimerOn(false); setTimerSec(0); setMetroOn(false); setBeat(false);
    setCiclo(0); setAdreCount(0); setAmioCount(0); setCiclosFV(0);
    setRitmoActual(null); setVaaHecho(false); setCincoHecho(false); setIniciado(false);
    setLog([]);
  }

  function toggleMetro() {
    if(metroOn) {
      clearInterval(metroRef[0]);
      metroRef[0] = null;
      setMetroOn(false);
      setBeat(false);
    } else {
      const ms = Math.round(60000/bpm);
      metroRef[0] = setInterval(() => {
        setBeat(b => !b);
        try {
          const ctx = new (window.AudioContext||window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.3, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.08);
          o.start(ctx.currentTime); o.stop(ctx.currentTime+0.09);
        } catch(e) {}
      }, ms);
      setMetroOn(true);
    }
  }

  function updateBpm(v) {
    setBpm(parseInt(v));
    if(metroOn) {
      clearInterval(metroRef[0]);
      const ms = Math.round(60000/parseInt(v));
      metroRef[0] = setInterval(() => {
        setBeat(b => !b);
        try {
          const ctx = new (window.AudioContext||window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.3, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.08);
          o.start(ctx.currentTime); o.stop(ctx.currentTime+0.09);
        } catch(e) {}
      }, ms);
    }
  }

  function setCicloRitmo(ritmo) {
    const cambio = iniciado && ritmoActual && ritmoActual !== ritmo;
    setRitmoActual(ritmo);
    if(!iniciado) {
      setIniciado(true);
      const logs = [];
      logs.push({texto:'⏱ '+tiempo(timerSec)+' — <strong>PCR iniciada</strong> · RCP de alta calidad · Acceso IV/IO · Monitorización continua', color:'#e8edf5', bg:'#0b1730'});
      if(ritmo==='fv') {
        logs.push({texto:'⚡ <strong>FV / TVSP detectada</strong> — ritmo DESFIBRILABLE<br/>Preparar desfibrilador: <strong>120–200 J bifásico</strong> · Aplicar gel · Cargar · Desfibrilar y reiniciar RCP inmediatamente', color:'#ef4444', bg:'#2a0505'});
      } else {
        logs.push({texto:'🔲 <strong>AESP / Asistolia detectada</strong> — ritmo NO desfibrilable<br/>Confirmar en 2 derivaciones', color:'#22d3ee', bg:'#0d2a4e'});
        logs.push({texto:'💊 <strong>Adrenalina 1 mg IV/IO</strong> — dosis #1 administrada · Flush 20 mL SF · No interrumpir RCP', color:'#f59e0b', bg:'#2a1a00'});
        setAdreCount(1);
      }
      setLog(l => [...l, ...logs]);
    } else if(cambio) {
      if(ritmo==='fv') {
        addLog('⚠️ '+tiempo(timerSec)+' — <strong>Cambio de ritmo: FV / TVSP</strong> — ahora DESFIBRILABLE<br/>⚡ Desfibrilar: <strong>120–200 J</strong> · Reiniciar RCP inmediatamente','#ef4444','#2a0505');
        setCiclosFV(0);
      } else {
        addLog('⚠️ '+tiempo(timerSec)+' — <strong>Cambio de ritmo: AESP / Asistolia</strong> — NO desfibrilable<br/>Continuar RCP · No desfibrilar','#22d3ee','#0d2a4e');
        setCiclosFV(0);
      }
    }
  }

  function siguienteCiclo() {
    if(!ritmoActual || !iniciado) return;
    const newCiclo = ciclo + 1;
    const newLogs = [];
    let newAdre = adreCount;
    let newAmio = amioCount;
    let newCiclosFV = ciclosFV;
    let newVaa = vaaHecho;
    let newCinco = cincoHecho;

    newLogs.push({texto:'───── CICLO '+newCiclo+' · '+tiempo(timerSec)+' ─────', color:'#1a3060', bg:'#060d1f'});
    newLogs.push({texto:'🔄 Cambio de reanimador · RCP 2 min · Verificar ritmo al terminar', color:'#22d3ee', bg:'#0d2a4e'});

    // Adrenalina
    let darAdre = false;
    if(ritmoActual==='fv' && newCiclo>=2 && newCiclo%2===0) darAdre=true;
    if(ritmoActual==='aesp' && newCiclo%2===0) darAdre=true;
    if(darAdre) {
      newAdre++;
      newLogs.push({texto:'💊 <strong>Adrenalina 1 mg IV/IO</strong> — dosis #'+newAdre+' · Flush 20 mL SF · Elevar extremidad', color:'#f59e0b', bg:'#2a1a00'});
    }

    // Desfibrilación FV
    if(ritmoActual==='fv' && newCiclo%2===1) {
      newLogs.push({texto:'⚡ <strong>Desfibrilar si persiste FV/TVSP</strong> — '+(newCiclo===1?'120–200 J bifásico':'aumentar si no responde')+' · Reiniciar RCP inmediatamente', color:'#ef4444', bg:'#2a0505'});
    }

    // Amiodarona FV — contar ciclos en FV
    if(ritmoActual==='fv') {
      newCiclosFV++;
      if(newCiclosFV===3 && newAmio===0) {
        newAmio=1;
        newLogs.push({texto:'💊 <strong>Amiodarona 300 mg IV/IO</strong> — 1° dosis · Diluir en 20 mL SG5% · Bolo rápido<br/>Alternativa: Lidocaína 1–1.5 mg/kg si no hay amiodarona', color:'#f472b6', bg:'#1a0a2e'});
      } else if(newCiclosFV===5 && newAmio===1) {
        newAmio=2;
        newLogs.push({texto:'💊 <strong>Amiodarona 150 mg IV/IO</strong> — 2° dosis · Si FV/TVSP persiste', color:'#f472b6', bg:'#1a0a2e'});
      }
    }

    // VAA ciclo 1-2
    if(!newVaa && newCiclo<=2) {
      newVaa=true;
      newLogs.push({texto:'🫁 Considerar <strong>vía aérea avanzada</strong> — IOT o supraglótico · Confirmar con capnografía<br/>Con VAA: 1 ventilación cada 6 seg sin interrumpir compresiones', color:'#34d399', bg:'#052a10'});
    }

    // 5H5T ciclo 3-4
    if(!newCinco && newCiclo>=3 && newCiclo<=4) {
      newCinco=true;
      newLogs.push({texto:'🔍 <strong>Buscar causas reversibles — 5H 5T</strong><br/><strong>5H:</strong> Hipovolemia · Hipoxia · H⁺ (acidosis) · Hipo/Hipercalemia · Hipotermia<br/><strong>5T:</strong> Neumotórax tensión · Taponamiento · Tóxicos · Trombosis pulmonar · Trombosis coronaria', color:'#22d3ee', bg:'#0d2a4e'});
    }

    // Aviso tardío
    if(newCiclo>=10 && newCiclo%2===0) {
      newLogs.push({texto:'⚠️ '+newCiclo+' ciclos completados (~'+(newCiclo*2)+' min) — Evaluar pronóstico · Considerar finalización si no hay causa reversible', color:'#4a6a9f', bg:'#0a1a38'});
    }

    setCiclo(newCiclo);
    setAdreCount(newAdre);
    setAmioCount(newAmio);
    setCiclosFV(newCiclosFV);
    setVaaHecho(newVaa);
    setCincoHecho(newCinco);
    setLog(l => [...l, ...newLogs]);
  }

  function ritmoOrganizado() {
    const resumen = [
      {texto:'────────────────────────────────────────', color:'#1a3060', bg:'#060d1f'},
      {texto:'✅ <strong>RITMO ORGANIZADO — Verificar pulso (máx 10 seg)</strong>', color:'#22c55e', bg:'#052a10'},
      {texto:'Si hay pulso → <strong>ROSC logrado</strong><br/>• FiO₂ 100% inicial · Titular SpO₂ 94–98%<br/>• ECG 12 derivaciones urgente · Coronariografía si sospecha SCA<br/>• TTM 32–36°C si coma post-PCR · Trasladar a UCI', color:'#22c55e', bg:'#052a10'},
      {texto:'Si no hay pulso → <strong>continuar RCP</strong> · Tratar como AESP', color:'#f59e0b', bg:'#2a1a00'},
      {texto:'📋 Resumen: <strong>'+ciclo+' ciclos</strong> · <strong>'+adreCount+' adrenalinas</strong> · Amiodarona: <strong>'+(amioCount===0?'no administrada':amioCount===1?'300mg':'300mg + 150mg')+'</strong> · Tiempo: <strong>'+tiempo(timerSec)+'</strong>', color:'#7aa2d4', bg:'#040c1c'},
    ];
    setLog(l => [...l, ...resumen]);
    setIniciado(false);
    setRitmoActual(null);
  }

  const bpmColor = bpm>=100&&bpm<=120?'#22c55e':'#f59e0b';
  const drugRows = [
    {d:'Adrenalina',dose:'1 mg IV/IO',freq:'Cada 3–5 min (cada 2 ciclos)',prep:'1 amp (1 mg/mL) directa · Flush 20 mL SF',color:'#f59e0b'},
    {d:'Amiodarona',dose:'300 mg (1°) · 150 mg (2°)',freq:'FV: ciclo 3 y ciclo 5 en FV',prep:'300 mg en 20 mL SG5% · Bolo rápido IV',color:'#f472b6'},
    {d:'Lidocaína',dose:'1–1.5 mg/kg IV/IO',freq:'Alternativa a amiodarona',prep:'Directa · Bolo IV · Mant: 1–4 mg/min',color:'#22d3ee'},
    {d:'Atropina',dose:'1 mg IV · Máx 3 mg',freq:'c/3–5 min en bradicardia',prep:'Directa IV rápido',color:'#34d399'},
    {d:'Bicarbonato',dose:'1 mEq/kg IV',freq:'Según gasometría',prep:'Directo IV lento · No rutinario',color:'#4a6a9f'},
  ];

  const inp = {background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"8px 12px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  return (
    <div>
      <div style={{background:"#2a0505",border:"1px solid #ef444444",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#ef4444",marginBottom:2}}>❤️ RCP — Guías AHA/ACLS 2020</div>
        <div style={{fontSize:12,color:"#ef4444"}}>Algoritmo continuo · El ritmo puede cambiar en cualquier ciclo sin reiniciar.</div>
      </div>

      {/* Timer + Metrónomo */}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"#040c1c",borderRadius:10,padding:12,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:6}}>TIEMPO DE PCR</div>
            <div style={{fontSize:36,fontWeight:800,color:timerOn?"#ef4444":"#e8edf5",fontFamily:"monospace",marginBottom:8}}>{tiempo(timerSec)}</div>
            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
              <button onClick={toggleTimer} style={{padding:"6px 14px",borderRadius:8,fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",border:`1px solid ${timerOn?"#ef4444":"#22c55e"}`,background:timerOn?"#2a0505":"#052a10",color:timerOn?"#ef4444":"#22c55e"}}>{timerOn?"⏸ Pausar":"▶ Iniciar"}</button>
              <button onClick={resetTodo} style={{padding:"6px 14px",borderRadius:8,fontFamily:"inherit",fontSize:12,cursor:"pointer",border:"1px solid #1a3060",background:"#060d1f",color:"#4a6a9f"}}>Reset</button>
            </div>
          </div>
          <div style={{background:"#040c1c",borderRadius:10,padding:12,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:4}}>METRÓNOMO</div>
            <div style={{width:50,height:50,borderRadius:"50%",margin:"0 auto 8px",background:metroOn&&beat?"#ef4444":"#2a0505",border:`3px solid ${metroOn?"#ef4444":"#1a3060"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,transition:"background 0.05s"}}>❤️</div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:3}}>BPM: <strong style={{color:bpmColor}}>{bpm}</strong></div>
            <input type="range" min="90" max="140" value={bpm} onChange={e=>updateBpm(e.target.value)} style={{width:"100%",marginBottom:4,accentColor:"#22d3ee"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#4a6a9f",marginBottom:6}}><span>90</span><span style={{color:"#22c55e"}}>100–120</span><span>140</span></div>
            <button onClick={toggleMetro} style={{width:"100%",padding:6,borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${metroOn?"#ef4444":"#22c55e"}`,background:metroOn?"#2a0505":"#052a10",color:metroOn?"#ef4444":"#22c55e"}}>{metroOn?"⏹ Detener":"▶ Metrónomo"}</button>
          </div>
        </div>
      </div>

      {/* Técnica */}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:8}}>TÉCNICA RCP</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
          {[["Frecuencia","100–120/min","#22d3ee"],["Profundidad","≥5 cm (máx 6)","#22c55e"],["Relación","30:2 sin VAA","#f59e0b"],["Con VAA","1 c/6 seg","#a78bfa"],["Interrupciones","Máx 10 seg","#ef4444"],["Cambio reanimador","Cada 2 min","#34d399"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#040c1c",borderRadius:8,padding:8,textAlign:"center"}}><div style={{fontSize:10,color:"#4a6a9f"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div></div>
          ))}
        </div>
      </div>

      {/* Verificación pulso */}
      <div style={{background:"#0b1730",border:"1px solid #22c55e44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#22c55e",letterSpacing:2,marginBottom:8}}>⏱ CUÁNDO VERIFICAR PULSO</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{background:"#052a10",borderRadius:8,padding:10,fontSize:12,color:"#22c55e",lineHeight:1.8}}>✓ Cada 2 min (cambio reanimador)<br/>✓ Si ritmo organizado en monitor<br/>✓ Si paciente se mueve/abre ojos</div>
          <div style={{background:"#2a0505",borderRadius:8,padding:10,fontSize:12,color:"#ef4444",lineHeight:1.8}}>✗ Durante compresiones<br/>✗ Al dar medicamentos<br/>✗ Tras desfibrilación inmediata</div>
        </div>
        <div style={{fontSize:11,color:"#4a6a9f"}}>Pulso máx 10 seg · Carotídeo adultos · Braquial lactantes · Si duda → continuar RCP</div>
      </div>

      {/* Panel algoritmo */}
      <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:4}}>ESTADO ACTUAL</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:"#4a6a9f"}}>Ciclo: <strong style={{color:"#e8edf5",fontSize:16}}>{ciclo}</strong></span>
              <span style={{fontSize:12,color:"#4a6a9f"}}>· Adrenalinas: <strong style={{color:"#f59e0b"}}>{adreCount}</strong></span>
              <span style={{fontSize:12,color:"#4a6a9f"}}>· Amiodarona: <strong style={{color:"#a78bfa"}}>{amioCount===0?"—":amioCount===1?"300mg ✓":"300+150mg ✓"}</strong></span>
            </div>
          </div>
          <div style={{fontSize:11,padding:"4px 10px",background:"#040c1c",borderRadius:20,color:ritmoActual==='fv'?"#ef4444":ritmoActual==='aesp'?"#22d3ee":"#4a6a9f"}}>
            {ritmoActual==='fv'?"⚡ FV / TVSP":ritmoActual==='aesp'?"🔲 AESP / Asistolia":"Sin iniciar"}
          </div>
        </div>
        <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:2,marginBottom:8}}>RITMO EN MONITOR — Seleccionar al verificar cada 2 min</div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {[["fv","⚡ FV / TVSP","#ef4444","#2a0505"],["aesp","🔲 AESP / Asistolia","#22d3ee","#0d2a4e"]].map(([r,label,color,bg])=>(
            <button key={r} onClick={()=>setCicloRitmo(r)} style={{flex:1,padding:"8px 14px",borderRadius:8,fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",border:`1px solid ${ritmoActual===r?color:"#1a3060"}`,background:ritmoActual===r?bg:"#060d1f",color:ritmoActual===r?color:"#4a6a9f"}}>{label}</button>
          ))}
          <button onClick={ritmoOrganizado} style={{flex:1,padding:"8px 14px",borderRadius:8,fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid #22c55e",background:"#052a10",color:"#22c55e"}}>✓ Ritmo organizado</button>
        </div>
        <button onClick={siguienteCiclo} disabled={!iniciado} style={{width:"100%",padding:12,borderRadius:10,fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:iniciado?"pointer":"not-allowed",border:`1px solid ${iniciado?"#ef4444":"#1a3060"}`,background:iniciado?"#2a0505":"#060d1f",color:iniciado?"#ef4444":"#4a6a9f",marginBottom:12}}>⏭ Siguiente ciclo (2 min)</button>
        <div style={{maxHeight:420,overflowY:"auto"}}>
          {[...log].reverse().map((l,i)=>(
            <div key={i} style={{padding:"8px 12px",borderRadius:8,marginBottom:6,fontSize:12,lineHeight:1.7,background:l.bg,border:`1px solid ${l.color}55`,color:l.color}} dangerouslySetInnerHTML={{__html:l.texto}}/>
          ))}
        </div>
      </div>

      {/* Energías */}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,marginBottom:10}}>⚡ ENERGÍAS DE DESFIBRILACIÓN</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{background:"#2a0505",borderRadius:8,padding:10}}>
            <div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginBottom:6}}>Adulto</div>
            <div style={{fontSize:12,color:"#ef4444",lineHeight:1.9}}>Bifásico: <strong>120–200 J</strong><br/>Si no responde → duplicar<br/>Monofásico: <strong>360 J siempre</strong></div>
          </div>
          <div style={{background:"#2a1a00",borderRadius:8,padding:10}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginBottom:6}}>Pediátrico</div>
            <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.9}}>1° choque: <strong>2 J/kg</strong><br/>2° choque: <strong>4 J/kg</strong><br/>Siguientes: <strong>4–10 J/kg</strong> (máx 200 J)</div>
          </div>
        </div>
      </div>

      {/* Drogas */}
      <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
        <div style={{fontSize:10,color:"#a78bfa",letterSpacing:2,marginBottom:12}}>💊 DROGAS — Preparación y dosis</div>
        {drugRows.map((d,i)=>(
          <div key={i} style={{background:"#040c1c",borderRadius:10,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${d.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:700,color:d.color}}>{d.d}</span>
              <span style={{fontSize:10,color:"#4a6a9f"}}>{d.freq}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><span style={{fontSize:10,color:"#4a6a9f"}}>DOSIS: </span><span style={{fontSize:12,fontWeight:700,color:"#e8edf5"}}>{d.dose}</span></div>
              <div><span style={{fontSize:10,color:"#4a6a9f"}}>PREP: </span><span style={{fontSize:11,color:"#7aa2d4"}}>{d.prep}</span></div>
            </div>
            <div style={{fontSize:11,color:"#4a6a9f",marginTop:4}}>{d.nota}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"12px 16px",background:"#08111f",border:"1px solid #1a2a4f",borderRadius:10,fontSize:11,color:"#2a4a7f",lineHeight:1.7}}>
        ⚠️ Basado en guías AHA/ACLS 2020. Verificar con protocolos institucionales. No reemplaza entrenamiento certificado en RCP.
      </div>
    </div>
  );
}

function VMITab() {
  const [subTab, setSubTab] = useState('equipo');
  const [talla, setTalla] = useState('');
  const [sexo, setSexo] = useState('h');
  const [peso, setPeso] = useState('');

  const t = parseFloat(talla);
  const pi = t > 0 ? (sexo==='h' ? 50+0.91*(t-152.4) : 45.5+0.91*(t-152.4)) : null;
  const piVal = pi && pi > 30 ? pi : pi && pi <= 30 ? 30 : null;

  const inp = {background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"8px 12px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  return (
    <div>
      <div style={{background:"#0d2a4e",border:"1px solid #22d3ee44",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#22d3ee",marginBottom:2}}>🫁 Ventilación Mecánica Invasiva</div>
        <div style={{fontSize:12,color:"#22d3ee"}}>Programación inicial · Equipamiento IOT · Perfiles clínicos</div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[["equipo","🔧 Equipo IOT"],["estandar","⚙️ VMI Estándar"],["paro","❤️ Post-ROSC"],["rcpactivo","🫁 VMI en Paro"],["transporte","🚑 Transporte"]].map(([s,label])=>(
          <button key={s} onClick={()=>setSubTab(s)} style={{padding:"8px 12px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",border:`1px solid ${subTab===s?"#22d3ee":"#1a3060"}`,background:subTab===s?"#0d2a4e":"#0b1730",color:subTab===s?"#22d3ee":"#3a5a8f"}}>{label}</button>
        ))}
      </div>

      {subTab==='equipo'&&(
        <div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:12}}>🔧 TUBOS ENDOTRAQUEALES</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div style={{background:"#0d2a4e",borderRadius:10,padding:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:8}}>👨 Hombre adulto</div>
                <div style={{fontSize:12,color:"#22d3ee",lineHeight:1.9}}>TET <strong>7.0 – 7.5 – 8.0</strong> mm<br/>Fijación: <strong>22–24 cm</strong> comisura labial<br/>Hoja: <strong>Macintosh 3–4</strong><br/>Alternativa: <strong>Miller 3</strong></div>
              </div>
              <div style={{background:"#1a0a2e",borderRadius:10,padding:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#a78bfa",marginBottom:8}}>👩 Mujer adulta</div>
                <div style={{fontSize:12,color:"#a78bfa",lineHeight:1.9}}>TET <strong>6.0 – 6.5 – 7.0</strong> mm<br/>Fijación: <strong>20–22 cm</strong> comisura labial<br/>Hoja: <strong>Macintosh 3</strong><br/>Alternativa: <strong>Miller 2–3</strong></div>
              </div>
            </div>
            <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:10}}>MÁSCARA LARÍNGEA — Número según peso</div>
            <div style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:12,overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr>{["Peso","Nº ML","Vol. cuff"].map(h=><th key={h} style={{padding:"6px 8px",color:"#4a6a9f",textAlign:"left",borderBottom:"1px solid #1a3060"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["<5 kg","1","≤4 mL"],["5–10 kg","1.5","≤7 mL"],["10–20 kg","2","≤10 mL"],["20–30 kg","2.5","≤14 mL"],["30–50 kg","3","≤20 mL"],["50–70 kg","4","≤30 mL"],[">70 kg","5","≤40 mL"]].map(([p,n,v])=>(
                    <tr key={p} style={{borderBottom:"1px solid #1a3060"}}>
                      <td style={{padding:"6px 8px",color:"#7aa2d4"}}>{p}</td>
                      <td style={{padding:"6px 8px",fontWeight:700,color:"#22d3ee",textAlign:"center"}}>{n}</td>
                      <td style={{padding:"6px 8px",color:"#34d399",textAlign:"center"}}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:10}}>HOJAS DE LARINGOSCOPIO</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:6}}>Macintosh (curva)</div>
                <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>Nº 3 → adulto promedio<br/>Nº 4 → adulto grande<br/>Va en vallécula</div>
              </div>
              <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
                <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:6}}>Miller (recta)</div>
                <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>Nº 2 → adulto pequeño/mujer<br/>Nº 3 → adulto hombre<br/>Eleva epiglotis directamente</div>
              </div>
            </div>
            <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,marginBottom:10}}>CHECKLIST PRE-IOT</div>
            <div style={{background:"#2a0505",borderRadius:10,padding:12,fontSize:12,color:"#ef4444",lineHeight:2}}>
              ☐ Monitorización: SpO₂ · ECG · ETCO₂ · PA<br/>
              ☐ Preoxigenación O₂ 100% × 3–5 min<br/>
              ☐ Vía venosa permeable · Fluidos disponibles<br/>
              ☐ Aspiración lista y funcional<br/>
              ☐ Medicamentos SRI preparados<br/>
              ☐ Plan B: mascarilla · ML · cricotirotomía<br/>
              ☐ Ventilador encendido y parámetros programados<br/>
              ☐ Confirmar posición: capnografía + auscultación bilateral
            </div>
          </div>
        </div>
      )}

      {subTab==='estandar'&&(
        <div>
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:12}}>⚙️ VMI ESTÁNDAR — Volumen Control</div>
            <div style={{fontSize:10,color:"#4a6a9f",letterSpacing:1,marginBottom:8}}>Calcular Vt según talla y sexo (ARDSnet)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Talla (cm)</div>
                <input type="number" value={talla} onChange={e=>setTalla(e.target.value)} placeholder="170" style={inp}/>
              </div>
              <div>
                <div style={{fontSize:11,color:"#4a6a9f",marginBottom:4}}>Sexo</div>
                <select value={sexo} onChange={e=>setSexo(e.target.value)} style={inp}>
                  <option value="h">Hombre</option>
                  <option value="m">Mujer</option>
                </select>
              </div>
            </div>
            {piVal&&(
              <div style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:8}}>PESO IDEAL: <strong style={{color:"#e8edf5"}}>{piVal.toFixed(1)} kg</strong></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[[6,"SDRA","#22c55e","#052a10"],[7,"Estándar","#22d3ee","#0d2a4e"],[8,"Límite","#f59e0b","#2a1a00"]].map(([ml,label,color,bg])=>(
                    <div key={ml} style={{background:bg,borderRadius:8,padding:10,textAlign:"center"}}>
                      <div style={{fontSize:10,color,marginBottom:4}}>{ml} mL/kg · {label}</div>
                      <div style={{fontSize:22,fontWeight:800,color}}>{(piVal*ml).toFixed(0)} mL</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8,fontSize:11,color:"#4a6a9f"}}>💡 Ajustar al valor más cercano disponible en el ventilador</div>
              </div>
            )}
            <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PARÁMETROS INICIALES SUGERIDOS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[["Vt","6–8 mL/kg peso ideal","#22d3ee","SDRA: 6 · Normal: 7–8"],["FR","12–20 /min","#22c55e","Similar a FR previa al IOT"],["PEEP","5 cmH₂O inicial","#f59e0b","↑ según FiO₂ y PaO₂"],["FiO₂","100% al inicio","#ef4444","Titular SpO₂ 94–98%"],["I:E","1:2 estándar","#a78bfa","Obstrucción: 1:3 · SDRA: 1:1"],["Flujo","40–60 L/min","#34d399","Ajustar según curva flujo-tiempo"]].map(([l,v,c,n])=>(
                <div key={l} style={{background:"#040c1c",borderRadius:8,padding:10}}>
                  <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:15,fontWeight:700,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:"#4a6a9f",marginTop:2}}>{n}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#2a1a00",borderRadius:10,padding:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:6}}>⚠️ Objetivos de ventilación</div>
              <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.9}}>
                • SpO₂: <strong>94–98%</strong> (EPOC: 88–92%)<br/>
                • PaCO₂: <strong>35–45 mmHg</strong> (SDRA: hipercapnia permisiva hasta 50–55)<br/>
                • Presión plateau: <strong>&lt;30 cmH₂O</strong><br/>
                • Driving pressure: <strong>&lt;15 cmH₂O</strong> (plateau − PEEP)
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab==='paro'&&(
        <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,marginBottom:12}}>❤️ VMI POST-ROSC</div>
          <div style={{background:"#2a0505",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:8}}>Durante RCP activa</div>
            <div style={{fontSize:12,color:"#ef4444",lineHeight:1.9}}>
              • Con VAA avanzada: <strong>10 ventilaciones/min</strong> (1 c/6 seg)<br/>
              • Sin VAA: 30:2 — no interrumpir compresiones<br/>
              • FiO₂ 100% durante el paro<br/>
              • Evitar hiperventilación → ↓ RV → ↓ GC
            </div>
          </div>
          <div style={{background:"#052a10",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#22c55e",marginBottom:8}}>Post-ROSC — Programación inicial</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Vt","6 mL/kg peso ideal"],["FR","10–12 /min"],["FiO₂","Titular SpO₂ 94–98%"],["PEEP","5 cmH₂O inicial"],["Objetivo PaCO₂","35–45 mmHg"],["Evitar","Hiperoxia (SpO₂ <100%)"]].map(([l,v])=>(
                <div key={l} style={{background:"#040c1c",borderRadius:8,padding:8}}>
                  <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#22c55e"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#0d2a4e",borderRadius:10,padding:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22d3ee",marginBottom:6}}>🌡️ Control temperatura post-ROSC</div>
            <div style={{fontSize:12,color:"#22d3ee",lineHeight:1.9}}>
              • TTM: <strong>32–36°C</strong> por 24h si coma post-PCR<br/>
              • Evitar hiperpirexia (&gt;37.5°C) en primeras 72h<br/>
              • Normoglicemia: <strong>140–180 mg/dL</strong>
            </div>
          </div>
        </div>
      )}
      {subTab==='rcpactivo'&&(
        <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,marginBottom:12}}>🫁 VMI DURANTE RCP ACTIVA</div>
          <div style={{background:"#2a0505",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:6}}>⚠️ Objetivo durante el paro</div>
            <div style={{fontSize:12,color:"#ef4444",lineHeight:1.9}}>Evitar hiperventilación — aumenta presión intratorácica → ↓ retorno venoso → ↓ GC durante RCP<br/>Priorizar compresiones de calidad sobre ventilación</div>
          </div>
          <div style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:10,color:"#ef4444",letterSpacing:2,marginBottom:10}}>PARÁMETROS DURANTE PCR</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                ["Vt","8 mL/kg","#f59e0b","Mayor para asegurar volumen sin interrupción de compresiones"],
                ["FR","10 /min","#22c55e","1 ventilación cada 6 seg — no interrumpir compresiones"],
                ["PEEP","0 cmH₂O","#22d3ee","Sin PEEP durante paro — facilita retorno venoso"],
                ["FiO₂","100%","#ef4444","Máxima durante paro"],
                ["I:E","1:5","#a78bfa","Espiración prolongada — evitar atrapamiento aéreo"],
                ["Trigger","Apagado","#4a6a9f","Evitar autociclos por movimiento de compresiones"],
                ["P máx","60 cmH₂O","#f472b6","Límite de seguridad — compresiones pueden elevar presión"],
                ["Flujo","Alto","#34d399","Para completar inspiración rápida entre compresiones"],
              ].map(([l,v,c,n])=>(
                <div key={l} style={{background:"#0b1730",borderRadius:8,padding:10}}>
                  <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:"#4a6a9f",marginTop:2,lineHeight:1.4}}>{n}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#0d2a4e",borderRadius:10,padding:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#22d3ee",marginBottom:6}}>✓ Al lograr ROSC — cambiar a Post-ROSC</div>
            <div style={{fontSize:12,color:"#22d3ee",lineHeight:1.9}}>
              • Reducir Vt a <strong>6 mL/kg</strong> peso ideal<br/>
              • Reducir FR a <strong>10–12 /min</strong><br/>
              • Activar trigger · Ajustar PEEP a <strong>5 cmH₂O</strong><br/>
              • Titular FiO₂ para SpO₂ <strong>94–98%</strong><br/>
              • Ver pestaña Post-ROSC para manejo completo
            </div>
          </div>
        </div>
      )}
      {subTab==='transporte'&&(
        <div style={{background:"#0b1730",border:"1px solid #34d39944",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <div style={{fontSize:10,color:"#34d399",letterSpacing:2,marginBottom:12}}>🚑 VENTILADOR DE TRANSPORTE — AirMix</div>
          <div style={{background:"#052a10",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#34d399",marginBottom:8}}>Modo AirMix</div>
            <div style={{fontSize:12,color:"#34d399",lineHeight:1.9}}>
              • Mezcla aire ambiente + O₂ → FiO₂ aproximada <strong>50–60%</strong><br/>
              • Útil para conservar O₂ en traslados prolongados<br/>
              • <strong>NO usar</strong> en pacientes que requieren FiO₂ &gt;60% (SDRA grave, hipoxemia refractaria)
            </div>
          </div>
          <div style={{background:"#040c1c",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e8edf5",marginBottom:8}}>Parámetros de transporte</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Vt","6–8 mL/kg peso ideal"],["FR","12–16 /min"],["FiO₂","100% o AirMix según SpO₂"],["PEEP","5 cmH₂O"],["Monitorizar","SpO₂ continua + ETCO₂"],["Alarmas","Revisar antes de salir"]].map(([l,v])=>(
                <div key={l} style={{background:"#0b1730",borderRadius:8,padding:8}}>
                  <div style={{fontSize:10,color:"#4a6a9f",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#34d399"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#2a1a00",borderRadius:10,padding:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:6}}>⚠️ Checklist pre-traslado</div>
            <div style={{fontSize:12,color:"#f59e0b",lineHeight:2}}>
              ☐ O₂ suficiente para traslado + 30 min extra<br/>
              ☐ Batería del ventilador cargada<br/>
              ☐ Sedación y analgesia adecuadas<br/>
              ☐ TET bien fijado y posición confirmada<br/>
              ☐ Aspiración portátil disponible<br/>
              ☐ Signos vitales estables antes de mover
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AirwayTab() {
  const [subTab, setSubTab] = useState(0);
  const [testOpen, setTestOpen] = useState({});
  const [macocha, setMacocha] = useState(Array(7).fill(false));
  const [heaven, setHeaven] = useState(Array(6).fill(false));
  const [ulbt, setUlbt] = useState(null);

  const TESTS = [
    {nombre:"Mallampati (modificado)", color:"#22d3ee", desc:"Paciente sentado, boca abierta máxima, sin fonación.\nClase I: úvula, pilares, paladar blando visibles — fácil\nClase II: úvula parcialmente visible\nClase III: solo paladar blando visible — difícil\nClase IV: solo paladar duro visible — muy difícil\nMallampati 3–4 asociado a intubación difícil."},
    {nombre:"Apertura bucal", color:"#a78bfa", desc:"Distancia interincisiva en apertura máxima.\n< 3 cm → intubación difícil.\nValorar causa: trismus, articulación temporomandibular."},
    {nombre:"Distancia tiromentoniana (Patil)", color:"#22c55e", desc:"Distancia del mentón al cartílago tiroideo con cuello en extensión máxima.\n> 6.5 cm → normal\n6–6.5 cm → posible dificultad\n< 6 cm → intubación probable difícil (laríngea anterior)."},
    {nombre:"Distancia esternomentoniana", color:"#34d399", desc:"Distancia del esternón al mentón con cuello en extensión máxima.\n> 12.5 cm → normal\n12–12.5 cm → limitado\n< 12 cm → extensión cervical muy limitada."},
    {nombre:"Upper Lip Bite Test (ULBT)", color:"#f59e0b", desc:"El de mayor precisión diagnóstica individual (DAS 2025).\nClase I: incisivos inferiores muerden bermellón del labio superior → normal\nClase II: llegan solo al borde del bermellón → posible dificultad\nClase III: no pueden morder el labio superior → dificultad probable"},
    {nombre:"Extensión atlanto-occipital", color:"#f472b6", desc:"Extensión normal del cuello: ~35°.\nReducción >1/3 → dificultad para alinear ejes.\nValorar en: artritis reumatoide, espondilitis anquilosante, lesión cervical."},
    {nombre:"SAHOS / Ronquido", color:"#ef4444", desc:"DAS 2025: predictor más confiable junto a historia previa de VAD.\nSolicitar polisomnografía si no se tiene diagnóstico.\nAsociado a ventilación difícil con mascarilla e intubación difícil."},
  ];

  const MACOCHA_ITEMS = [
    {label:"Mallampati 3 o 4", pts:5},
    {label:"SAHOS (síndrome apnea-hipopnea)", pts:2},
    {label:"Reducción de la movilidad cervical", pts:1},
    {label:"Apertura bucal limitada (<3.5 cm)", pts:1},
    {label:"Coma (GCS <13)", pts:1},
    {label:"Hipoxemia grave (SpO₂ <80% pre-intubación)", pts:1},
    {label:"Operador no anestesiólogo", pts:1},
  ];

  const HEAVEN_ITEMS = [
    {label:"H — Hypoxemia (SpO₂ <93% pese a O₂)"},
    {label:"E — Extremes of size (obesidad mórbida o <8 años)"},
    {label:"A — Anatomic challenge (cuello corto, macroglosia, apertura limitada)"},
    {label:"V — Vomit / blood / disruption (vómito, sangre o lesión en vía aérea)"},
    {label:"E — Exsanguination (shock hemorrágico con alteración conciencia)"},
    {label:"N — Neck mobility issues (inmovilización cervical, rigidez)"},
  ];

  const EFONA_STEPS = [
    "Posicionarse a la izquierda del paciente (si diestro). Extensión máxima del cuello.",
    "Palpar anatomía laríngea con mano no dominante. Localizar línea media.",
    "Aplicar tensión a la piel y estabilizar la laringe con mano no dominante.",
    "Realizar incisión vertical en piel de hasta 8 cm, de caudal a cefálico (de abajo hacia arriba).",
    "Disección roma con dedos de ambas manos para separar tejidos. Identificar y estabilizar laringe.",
    "Con dedo índice de mano no dominante, identificar la membrana cricotiroidea.",
    "Con bisturí en mano dominante, realizar incisión transversal a través de la membrana cricotiroidea (filo hacia el operador).",
    "Mantener bisturí perpendicular a la piel y girarlo 90° para que el filo apunte hacia caudal (pies).",
    "Cambiar el bisturí a mano no dominante. Mantener tracción lateral suave hacia el operador.",
    "Con mano dominante, tomar el bougie.",
    "Deslizar la punta coudé del bougie por el lado del bisturí hacia la tráquea.",
    "Rotar y alinear el bougie con la tráquea. Avanzar suavemente 10–15 cm.",
    "Retirar el bisturí.",
    "Estabilizar la tráquea. Tomar el TET 6.0 mm con mano dominante.",
    "Deslizar el TET sobre el bougie con rotación hasta la tráquea.",
    "Retirar el bougie.",
    "Inflar el cuff. Ventilar con FiO₂ 100%. Confirmar con capnografía de onda.",
    "Fijar el tubo.",
  ];

  const macTotal = MACOCHA_ITEMS.reduce((s,item,i)=>macocha[i]?s+item.pts:s, 0);
  const macColor = macTotal===0?"#22c55e":macTotal<=2?"#f59e0b":"#ef4444";
  const macLabel = macTotal===0?"Riesgo bajo":macTotal<=2?"Riesgo moderado":"Riesgo alto (score ≥3)";
  const macRec = macTotal===0?"Proceder con plan estándar":macTotal<=2?"Preparar videolaringoscopio · Tener SAD disponible":"Considerar intubación vigil · Experto presente · Plan A→D preparado";

  const heavTotal = heaven.filter(Boolean).length;
  const heavColor = heavTotal===0?"#22c55e":heavTotal<=1?"#f59e0b":heavTotal<=3?"#f59e0b":"#ef4444";
  const heavLabel = heavTotal===0?"Sin criterios":heavTotal===1?"Riesgo leve":heavTotal<=3?"Riesgo moderado-alto":"Riesgo muy alto";
  const heavRec = heavTotal===0?"Vía aérea sin factores de riesgo evidentes":heavTotal===1?"Preparar videolaringoscopio · Considerar plan alternativo":heavTotal<=3?"Videolaringoscopio · SAD disponible · Operador experto":"Considerar intubación vigil · Plan A→D completo · eFONA preparado";

  const inp = {background:"#040c1c",border:"1px solid #1a3060",borderRadius:8,color:"#e8edf5",fontSize:14,padding:"8px 12px",outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  return (
    <div>
      <div style={{background:"#0d2a4e",border:"1px solid #22d3ee44",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#22d3ee",marginBottom:2}}>🪸 Vía Aérea Difícil</div>
        <div style={{fontSize:12,color:"#22d3ee"}}>Basado en guías DAS 2025 · Algoritmo Plan A→B→C→D</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14}}>
        {["🔍 Evaluación","📊 Scores","📋 Algoritmo","⚔️ eFONA"].map((t,i)=>(
          <button key={i} onClick={()=>setSubTab(i)} style={{padding:"8px 4px",borderRadius:8,fontSize:10,fontFamily:"inherit",fontWeight:700,cursor:"pointer",textAlign:"center",border:subTab===i?"1px solid #22d3ee":"1px solid #1a3060",background:subTab===i?"#0d2a4e":"#0b1730",color:subTab===i?"#22d3ee":"#3a5a8f"}}>{t}</button>
        ))}
      </div>

      {/* EVALUACIÓN */}
      {subTab===0&&(
        <div>
          <div style={{background:"#2a1a00",border:"1px solid #f59e0b44",borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginBottom:4}}>⚠️ SIEMPRE LLAMAR A AYUDA ANTE CUALQUIER DIFICULTAD</div>
            <div style={{fontSize:12,color:"#f59e0b",lineHeight:1.8}}>La evaluación preoperatoria permite formular una <strong>estrategia de vía aérea individualizada</strong> (Plan A→D).<br/>El predictor más confiable de dificultad es la <strong>historia previa de vía aérea difícil</strong>.</div>
          </div>

          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:11,color:"#22d3ee",letterSpacing:2,fontWeight:700,marginBottom:8}}>TESTS DE CABECERA</div>
            <div style={{fontSize:11,color:"#4a6a9f",marginBottom:10}}>Ninguno es suficiente solo. Combinar múltiples tests mejora la sensibilidad.</div>
            {TESTS.map((t,i)=>(
              <div key={i} style={{marginBottom:6}}>
                <button onClick={()=>setTestOpen(p=>({...p,[i]:!p[i]}))} style={{width:"100%",textAlign:"left",background:testOpen[i]?t.color+"22":"#040c1c",border:`1px solid ${testOpen[i]?t.color:"#1a3060"}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:t.color}}>{t.nombre}</span>
                  <span style={{color:"#4a6a9f",fontSize:14}}>{testOpen[i]?"▲":"▼"}</span>
                </button>
                {testOpen[i]&&(
                  <div style={{background:"#0b1730",borderRadius:"0 0 8px 8px",padding:"10px 12px",fontSize:12,color:"#7aa2d4",lineHeight:1.8,whiteSpace:"pre-line",border:`1px solid ${t.color}44`,borderTop:"none"}}>
                    {t.desc}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:11,color:"#a78bfa",letterSpacing:2,fontWeight:700,marginBottom:10}}>FACTORES DE RIESGO</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
                <div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:6}}>Ventilación difícil</div>
                <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• SAHOS / ronquido<br/>• Barba<br/>• Obesidad (IMC &gt;35)<br/>• Mallampati 3–4<br/>• Edentado · Cuello grueso</div>
              </div>
              <div style={{background:"#040c1c",borderRadius:8,padding:10}}>
                <div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginBottom:6}}>Intubación difícil</div>
                <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>• Historia previa VAD<br/>• Mallampati 3–4<br/>• Apertura bucal &lt;3 cm<br/>• Cuello corto/rígido<br/>• Retrognatia · Radioterapia</div>
              </div>
            </div>
            <div style={{background:"#040c1c",borderRadius:8,padding:10,fontSize:12,color:"#7aa2d4",lineHeight:1.7}}>
              <strong style={{color:"#e8edf5"}}>Membrana cricotiroidea:</strong> Identificar por palpación o ecografía <strong>antes</strong> de la inducción con cuello en extensión máxima. Documentar si es palpable — guía la técnica eFONA.
            </div>
          </div>

          <div style={{background:"#0b1730",border:"1px solid #22c55e44",borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:11,color:"#22c55e",letterSpacing:2,fontWeight:700,marginBottom:8}}>💨 PEROXYGENACIÓN — DAS 2025</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>
              • <strong style={{color:"#e8edf5"}}>Preoxigenación:</strong> Posición cabeza elevada ≥30° · Técnica presión positiva (mascarilla+PEEP, VNI o CNAF)<br/>
              • <strong style={{color:"#e8edf5"}}>Apnoeic oxygenation:</strong> Cánula nasal 15 L/min o CNAF durante laringoscopia<br/>
              • <strong style={{color:"#e8edf5"}}>Objetivo:</strong> EtO₂ ≥0.9 antes de inducción · Continuar O₂ en todo momento<br/>
              • CNAF especialmente útil en vía aérea fisiológicamente difícil
            </div>
          </div>
        </div>
      )}

      {/* SCORES */}
      {subTab===1&&(
        <div>
          {/* MACOCHA */}
          <div style={{background:"#0b1730",border:"1px solid #22d3ee44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>MACOCHA Score</div>
            <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Predictor de intubación difícil en paciente crítico. Score ≥3 → alto riesgo.</div>
            {MACOCHA_ITEMS.map((item,i)=>(
              <div key={i} onClick={()=>setMacocha(p=>{const n=[...p];n[i]=!n[i];return n;})} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a3060",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${macocha[i]?"#22d3ee":"#1a3060"}`,background:macocha[i]?"#22d3ee":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#040c1c",flexShrink:0}}>{macocha[i]&&"✓"}</div>
                  <span style={{fontSize:13,color:macocha[i]?"#e8edf5":"#7aa2d4"}}>{item.label}</span>
                </div>
                <span style={{fontSize:12,color:"#4a6a9f",minWidth:32,textAlign:"right"}}>+{item.pts}</span>
              </div>
            ))}
            <div style={{marginTop:12,background:macColor+"15",border:`1px solid ${macColor}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontSize:36,fontWeight:800,color:macColor,minWidth:48,textAlign:"center"}}>{macTotal}</div>
              <div><div style={{fontSize:13,fontWeight:700,color:macColor}}>{macLabel}</div><div style={{fontSize:12,color:macColor,marginTop:2}}>{macRec}</div></div>
            </div>
            <button onClick={()=>setMacocha(Array(7).fill(false))} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
          </div>

          {/* HEAVEN */}
          <div style={{background:"#0b1730",border:"1px solid #f59e0b44",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>HEAVEN Criteria</div>
            <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Predictor de dificultad en intubación prehospitalaria y urgencias.</div>
            {HEAVEN_ITEMS.map((item,i)=>(
              <div key={i} onClick={()=>setHeaven(p=>{const n=[...p];n[i]=!n[i];return n;})} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a3060",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${heaven[i]?"#22d3ee":"#1a3060"}`,background:heaven[i]?"#22d3ee":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#040c1c",flexShrink:0}}>{heaven[i]&&"✓"}</div>
                  <span style={{fontSize:12,color:heaven[i]?"#e8edf5":"#7aa2d4"}}>{item.label}</span>
                </div>
                <span style={{fontSize:12,color:"#4a6a9f",minWidth:24,textAlign:"right"}}>+1</span>
              </div>
            ))}
            <div style={{marginTop:12,background:heavColor+"15",border:`1px solid ${heavColor}44`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontSize:36,fontWeight:800,color:heavColor,minWidth:48,textAlign:"center"}}>{heavTotal}</div>
              <div><div style={{fontSize:13,fontWeight:700,color:heavColor}}>{heavLabel}</div><div style={{fontSize:12,color:heavColor,marginTop:2}}>{heavRec}</div></div>
            </div>
            <button onClick={()=>setHeaven(Array(6).fill(false))} style={{marginTop:10,background:"transparent",border:"1px solid #1a3060",color:"#4a6a9f",borderRadius:8,padding:"5px 14px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reiniciar</button>
          </div>

          {/* ULBT */}
          <div style={{background:"#0b1730",border:"1px solid #1a3060",borderRadius:14,padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Upper Lip Bite Test (ULBT)</div>
            <div style={{fontSize:12,color:"#4a6a9f",marginBottom:12}}>Mayor precisión diagnóstica individual entre los tests de cabecera (DAS 2025).</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {[[1,"Clase I","Incisivos inferiores muerden el bermellón del labio superior (por encima del rojo del labio)","#22c55e","#052a10"],[2,"Clase II","Incisivos inferiores llegan solo al borde del bermellón","#f59e0b","#2a1a00"],[3,"Clase III","Incisivos inferiores NO pueden morder el labio superior","#ef4444","#2a0505"]].map(([cls,label,desc,color,bg])=>(
                <button key={cls} onClick={()=>setUlbt(cls)} style={{flex:1,minWidth:100,padding:"10px 8px",borderRadius:8,fontFamily:"inherit",cursor:"pointer",border:`1px solid ${ulbt===cls?color:color+"44"}`,background:ulbt===cls?bg:"#040c1c",textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color}}>{label}</div>
                  <div style={{fontSize:11,color:"#7aa2d4",marginTop:4,lineHeight:1.5}}>{desc}</div>
                </button>
              ))}
            </div>
            {ulbt&&(
              <div style={{background:ulbt===1?"#052a10":ulbt===2?"#2a1a00":"#2a0505",border:`1px solid ${ulbt===1?"#22c55e":ulbt===2?"#f59e0b":"#ef4444"}44`,borderRadius:10,padding:12,fontSize:12,color:ulbt===1?"#22c55e":ulbt===2?"#f59e0b":"#ef4444"}}>
                {ulbt===1?"Clase I — Sin restricción de subluxación mandibular · Laringoscopia probable sin dificultad":ulbt===2?"Clase II — Subluxación mandibular limitada · Posible dificultad · Preparar videolaringoscopio":"Clase III — Sin subluxación mandibular · Predictor de intubación difícil · Considerar plan alternativo"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALGORITMO DAS */}
      {subTab===2&&(
        <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:14}}>⚠️ SI HAY DIFICULTAD — LLAMAR A AYUDA INMEDIATAMENTE</div>
          {[
            {plan:"PLAN A",color:"#22d3ee",bg:"#0d2a4e",titulo:"Intubación traqueal — máx 3+1 intentos",
             body:"• Usar videolaringoscopio de primera línea siempre que sea posible\n• Asegurar BNM adecuado antes de intentar\n• Confirmar con capnografía de onda + visualización del tubo\n• Hoja hiperangulada → bougie o estilete obligatorio",
             ok:"✓ Éxito → Check de 2 puntos: capnografía + visualización",
             fail:"✗ Fallo → Declarar intubación fallida · Asegurar kit eFONA accesible · Pasar a Plan B"},
            {plan:"PLAN B",color:"#22c55e",bg:"#052a10",titulo:"Dispositivo supraglótico (SAD) — máx 3 intentos",
             body:"• Usar SAD de 2ª generación (mayor sello, canal de drenaje)\n• Confirmar ventilación con capnografía\n• Asegurar BNM completo",
             ok:"✓ Ventilación lograda → STOP · PENSAR · COMUNICAR\nDecisión default: despertar al paciente",
             fail:"✗ Fallo → Declarar fallo SAD · Abrir kit eFONA · Pasar a Plan C"},
            {plan:"PLAN C",color:"#f59e0b",bg:"#2a1a00",titulo:"Último intento ventilación con mascarilla facial",
             body:"• BNM completo asegurado · Posición óptima\n• Cánula orofaríngea y/o nasofaríngea\n• Técnica a 4 manos (dos personas)",
             ok:"✓ Ventilación lograda → STOP · PENSAR · COMUNICAR con experto\nConsiderar: revertir BNM + despertar · FONA electiva",
             fail:'✗ Fallo → Declarar "NO PUEDO INTUBAR, NO PUEDO OXIGENAR" (CICO) → PLAN D'},
            {plan:"PLAN D",color:"#ef4444",bg:"#2a0505",titulo:"🚨 eFONA — Vía Aérea Frontal de Emergencia",
             body:"• Escenario CICO → riesgo vital inminente\n• Equipamiento: bisturí #10 · bougie · TET 6.0 mm\n• Extensión máxima del cuello · BNM completo",
             ok:"Ver pestaña eFONA para técnica paso a paso →",
             fail:null},
          ].map((p,i)=>(
            <div key={i}>
              <div style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                <div style={{minWidth:60,height:36,borderRadius:8,background:p.bg,border:`1px solid ${p.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:p.color,flexShrink:0}}>{p.plan}</div>
                <div style={{flex:1,background:p.bg,borderRadius:10,padding:12,border:`1px solid ${p.color}44`}}>
                  <div style={{fontSize:13,fontWeight:700,color:p.color,marginBottom:6}}>{p.titulo}</div>
                  <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8,marginBottom:8}}>{p.body.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}</div>
                  <div style={{padding:"6px 10px",background:"#040c1c",borderRadius:6,fontSize:11,color:p.color,marginBottom:p.fail?6:0,lineHeight:1.6}}>{p.ok.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}</div>
                  {p.fail&&<div style={{padding:"6px 10px",background:"#2a0505",borderRadius:6,fontSize:11,color:"#ef4444"}}>{p.fail}</div>}
                </div>
              </div>
              {i<3&&<div style={{textAlign:"center",fontSize:20,color:"#1a3060",margin:"4px 0"}}>↓</div>}
            </div>
          ))}
          <div style={{marginTop:14,background:"#040c1c",borderRadius:10,padding:12,fontSize:12,color:"#7aa2d4",lineHeight:1.9}}>
            <strong style={{color:"#e8edf5"}}>PRIMING (DAS 2025):</strong> Desde el fallo del Plan A, el asistente debe asegurar que el kit eFONA esté accesible e identificar quién realizará el procedimiento.<br/>
            <strong style={{color:"#e8edf5"}}>TRANSITIONING:</strong> Reconocer el fallo de un plan y avanzar al siguiente sin demora — el retraso por fijación en la técnica que falla es causa frecuente de complicaciones.
          </div>
        </div>
      )}

      {/* eFONA */}
      {subTab===3&&(
        <div style={{background:"#0b1730",border:"1px solid #ef444444",borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:8}}>🚨 eFONA — Indicación: escenario CICO</div>
          <div style={{background:"#2a0505",borderRadius:8,padding:10,marginBottom:12,fontSize:12,color:"#ef4444",lineHeight:1.7}}>
            Sin intervención inmediata → daño cerebral hipóxico o muerte.<br/>
            <strong>Equipamiento: bisturí hoja nº10 · bougie · TET 6.0 mm con cuff · aspiración</strong>
          </div>
          <div style={{background:"#040c1c",borderRadius:8,padding:10,marginBottom:12}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,marginBottom:6}}>PREPARACIÓN INMEDIATA</div>
            <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>
              • Asignar roles: operador · asistente · persona que entrega O₂ por vía superior<br/>
              • <strong style={{color:"#e8edf5"}}>Extensión máxima del cuello</strong> — almohada bajo hombros<br/>
              • BNM completo obligatorio<br/>
              • Continuar O₂ por vía superior: mascarilla, SAD o cánula nasal
            </div>
          </div>
          <div style={{fontSize:11,color:"#ef4444",letterSpacing:2,fontWeight:700,marginBottom:10}}>TÉCNICA — INCISIÓN VERTICAL (DAS 2025)</div>
          {EFONA_STEPS.map((step,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #1a3060",alignItems:"flex-start"}}>
              <div style={{minWidth:28,height:28,borderRadius:"50%",background:"#2a0505",border:"1px solid #ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#ef4444",flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:12,color:"#7aa2d4",lineHeight:1.6}}>{step}</div>
            </div>
          ))}
          <div style={{marginTop:12,background:"#040c1c",borderRadius:8,padding:10,fontSize:12,color:"#7aa2d4",lineHeight:1.8}}>
            <strong style={{color:"#e8edf5"}}>Si el intento falla:</strong> Extender la incisión · Mayor disección roma · Cambiar posición u operador · Tubo más pequeño<br/>
            <strong style={{color:"#e8edf5"}}>Post-eFONA:</strong> Excluir intubación bronquial y neumotórax · Revisión quirúrgica para manejo definitivo
          </div>
        </div>
      )}
    </div>
  );
}

function GasesCalculator() {
  const [step, setStep] = useState(1);
  const [sampleType, setSampleType] = useState("venoso");
  const [values, setValues] = useState({
    ph: "",
    pco2: "",
    hco3: "",
    na: "",
    cl: "",
    alb: "",
    po2: "",
    fio2: "",
    pco2a: "",
    pco2v: "",
    lactato: "",
    lactato2: "",
  });

  const card = { background:"#0b1730", border:"1px solid #1a3060", borderRadius:14, padding:"14px 16px", marginBottom:12 };
  const input = { width:"100%", background:"#040c1c", border:"1px solid #1a3060", borderRadius:8, color:"#e8edf5", fontSize:14, padding:"9px 12px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  const label = { fontSize:11, color:"#4a6a9f", marginBottom:4 };
  const small = { fontSize:11, color:"#7aa2d4", lineHeight:1.7 };

  function setField(key, value) {
    setValues(prev => ({ ...prev, [key]: value }));
  }

  function num(v) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }

  function fmt(n, d = 1) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number(n).toFixed(d).replace(/\.0$/, "");
  }

  const ph = num(values.ph);
  const pco2 = num(values.pco2);
  const hco3 = num(values.hco3);
  const na = num(values.na);
  const cl = num(values.cl);
  const alb = num(values.alb);
  const po2 = num(values.po2);
  const fio2 = num(values.fio2);
  const pco2a = num(values.pco2a);
  const pco2v = num(values.pco2v);
  const lactato = num(values.lactato);
  const lactato2 = num(values.lactato2);

  const effectivePco2 = sampleType === "venoso" && pco2 !== null ? pco2 - 5 : pco2;

  let phState = null;
  if (ph !== null) {
    if (ph < 7.35) phState = { label:"Acidemia", color:"#ef4444" };
    else if (ph > 7.45) phState = { label:"Alcalemia", color:"#22d3ee" };
    else phState = { label:"pH casi normal", color:"#f59e0b" };
  }

  let primary = null;
  if (ph !== null && pco2 !== null && hco3 !== null) {
    if (ph < 7.35) {
      if (hco3 < 22 && effectivePco2 <= 45) primary = { label:"Acidosis metabólica primaria", color:"#ef4444" };
      else if (effectivePco2 > 45 && hco3 >= 22) primary = { label:"Acidosis respiratoria primaria", color:"#ef4444" };
      else if (hco3 < 22 && effectivePco2 > 45) primary = { label:"Acidosis mixta metabólica + respiratoria", color:"#ef4444" };
    } else if (ph > 7.45) {
      if (hco3 > 26 && effectivePco2 >= 35) primary = { label:"Alcalosis metabólica primaria", color:"#22d3ee" };
      else if (effectivePco2 < 35 && hco3 <= 26) primary = { label:"Alcalosis respiratoria primaria", color:"#22d3ee" };
      else if (hco3 > 26 && effectivePco2 < 35) primary = { label:"Alcalosis mixta metabólica + respiratoria", color:"#22d3ee" };
    } else {
      if (hco3 < 22 && effectivePco2 < 35) primary = { label:"pH casi normal: probable trastorno mixto", color:"#f59e0b" };
      else if (hco3 > 26 && effectivePco2 > 45) primary = { label:"pH casi normal: probable trastorno mixto", color:"#f59e0b" };
    }
  }

  let compensation = null;
  if (hco3 !== null && effectivePco2 !== null) {
    if (hco3 < 22) {
      const exp = 1.5 * hco3 + 8;
      const lo = exp - 2;
      const hi = exp + 2;
      let text = `Winter esperado: PaCO₂ ${fmt(lo)}–${fmt(hi)} mmHg`;
      let color = "#22d3ee";
      if (effectivePco2 < lo) {
        text += " · además alcalosis respiratoria";
        color = "#f59e0b";
      } else if (effectivePco2 > hi) {
        text += " · además acidosis respiratoria";
        color = "#ef4444";
      } else {
        text += " · compensación apropiada";
      }
      compensation = { title:"Compensación en acidosis metabólica", text, color };
    } else if (hco3 > 26) {
      const exp = 0.7 * (hco3 - 24) + 40;
      const lo = exp - 5;
      const hi = exp + 5;
      let text = `Esperado en alcalosis metabólica: PaCO₂ ${fmt(lo)}–${fmt(hi)} mmHg`;
      let color = "#22d3ee";
      if (effectivePco2 < lo) {
        text += " · además alcalosis respiratoria";
        color = "#f59e0b";
      } else if (effectivePco2 > hi) {
        text += " · además acidosis respiratoria";
        color = "#ef4444";
      } else {
        text += " · compensación apropiada";
      }
      compensation = { title:"Compensación en alcalosis metabólica", text, color };
    } else if (effectivePco2 > 45) {
      const d = effectivePco2 - 40;
      const acute = 24 + (d / 10) * 1;
      const chronic = 24 + (d / 10) * 3.5;
      compensation = {
        title:"Compensación en acidosis respiratoria",
        text:`HCO₃ esperado: aguda ${fmt(acute)} / crónica ${fmt(chronic)} mEq/L`,
        color:"#22d3ee"
      };
    } else if (effectivePco2 < 35) {
      const d = 40 - effectivePco2;
      const acute = 24 - (d / 10) * 2;
      const chronic = 24 - (d / 10) * 5;
      compensation = {
        title:"Compensación en alcalosis respiratoria",
        text:`HCO₃ esperado: aguda ${fmt(acute)} / crónica ${fmt(chronic)} mEq/L`,
        color:"#22d3ee"
      };
    }
  }

  let ag = null;
  let agCorr = null;
  let deltaGap = null;
  let deltaHco3 = null;
  let deltaNote = null;
  if (na !== null && cl !== null && hco3 !== null) {
    ag = na - cl - hco3;
    agCorr = ag + (alb !== null ? 2.5 * (4 - alb) : 0);
    deltaGap = agCorr - 12;
    deltaHco3 = 24 - hco3;

    if (deltaGap > 0 && deltaHco3 > 0) {
      if (deltaGap - deltaHco3 > 6) deltaNote = { text:"AG elevado con alcalosis metabólica asociada", color:"#f59e0b" };
      else if (deltaHco3 - deltaGap > 6) deltaNote = { text:"AG elevado con acidosis metabólica hiperclorémica asociada", color:"#ef4444" };
      else deltaNote = { text:"AG elevado aislado o predominante", color:"#22d3ee" };
    }
  }

  let chlorideNote = null;
  if (na !== null && cl !== null) {
    const diff = na - cl;
    if (diff < 32) chlorideNote = { text:"Cloro relativamente alto para el sodio → pensar en acidosis hiperclorémica o alcalosis respiratoria crónica", color:"#f59e0b" };
    else if (diff > 38) chlorideNote = { text:"Cloro relativamente bajo para el sodio → pensar en alcalosis metabólica o acidosis respiratoria crónica", color:"#22d3ee" };
  }

  let pf = null;
  let aa = null;
  let sdra = null;
  if (sampleType === "arterial" && po2 !== null && fio2 !== null && effectivePco2 !== null) {
    const fi = fio2 > 1 ? fio2 / 100 : fio2;
    if (fi > 0) {
      pf = po2 / fi;
      const pAO2 = fi * (760 - 47) - (effectivePco2 / 0.8);
      aa = pAO2 - po2;
      if (pf < 100) sdra = { text:"SDRA grave", color:"#ef4444" };
      else if (pf < 200) sdra = { text:"SDRA moderado", color:"#f59e0b" };
      else if (pf < 300) sdra = { text:"SDRA leve", color:"#f59e0b" };
    }
  }

  let deltaPco2 = null;
  if (pco2a !== null && pco2v !== null) {
    deltaPco2 = pco2v - pco2a;
  }

  let lactatoMsg = null;
  let clearance = null;
  if (lactato !== null) {
    if (lactato < 2) lactatoMsg = { text:"Lactato normal", color:"#22c55e" };
    else if (lactato < 4) lactatoMsg = { text:"Lactato elevado", color:"#f59e0b" };
    else lactatoMsg = { text:"Hiperlactatemia severa / shock láctico", color:"#ef4444" };
  }
  if (lactato !== null && lactato2 !== null && lactato > 0) {
    clearance = ((lactato - lactato2) / lactato) * 100;
  }

  const steps = ["Muestra", "Datos", "Ácido-base", "Oxigenación", "Perfusión", "Referencias"];

  function resetAll() {
    setStep(1);
    setSampleType("venoso");
    setValues({
      ph: "",
      pco2: "",
      hco3: "",
      na: "",
      cl: "",
      alb: "",
      po2: "",
      fio2: "",
      pco2a: "",
      pco2v: "",
      lactato: "",
      lactato2: "",
    });
  }

  return (
    <div>
      <div style={card}>
        <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>FLUJO GUIADO</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                padding:"8px 10px",
                borderRadius:999,
                border:`1px solid ${i + 1 < step ? "#22c55e" : i + 1 === step ? "#22d3ee" : "#1a3060"}`,
                color:i + 1 < step ? "#22c55e" : i + 1 === step ? "#22d3ee" : "#4a6a9f",
                background:i + 1 < step ? "#052a10" : i + 1 === step ? "#0d2a4e" : "#060d1f",
                fontSize:12
              }}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 1</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Tipo de muestra</div>
          <div style={{display:"flex",gap:8}}>
            {["venoso","arterial"].map(t=>(
              <button
                key={t}
                onClick={()=>setSampleType(t)}
                style={{
                  flex:1,
                  padding:"10px 12px",
                  borderRadius:8,
                  fontFamily:"inherit",
                  fontSize:12,
                  fontWeight:700,
                  cursor:"pointer",
                  border:sampleType===t?"1px solid #22d3ee":"1px solid #1a3060",
                  background:sampleType===t?"#0d2a4e":"#060d1f",
                  color:sampleType===t?"#22d3ee":"#4a6a9f"
                }}
              >
                {t === "venoso" ? "Venoso" : "Arterial"}
              </button>
            ))}
          </div>
          <div style={{...small, marginTop:10}}>
            Para interpretación ácido-base en urgencias, venoso y arterial suelen ser clínicamente comparables.
            Usa arterial cuando necesites evaluar oxigenación, PAFI o gradiente A-a.
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <span />
            <button onClick={()=>setStep(2)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #22d3ee",
  background:"#0d2a4e",
  color:"#22d3ee"
}}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 2</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Datos básicos</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            <div>
              <div style={label}>pH</div>
              <input style={input} type="number" step="0.01" value={values.ph} onChange={e=>setField("ph", e.target.value)} />
            </div>
            <div>
              <div style={label}>{sampleType === "venoso" ? "PvCO₂" : "PaCO₂"} (mmHg)</div>
              <input style={input} type="number" step="0.1" value={values.pco2} onChange={e=>setField("pco2", e.target.value)} />
            </div>
            <div>
              <div style={label}>HCO₃⁻ (mEq/L)</div>
              <input style={input} type="number" step="0.1" value={values.hco3} onChange={e=>setField("hco3", e.target.value)} />
            </div>
            <div>
              <div style={label}>Na (mEq/L)</div>
              <input style={input} type="number" step="0.1" value={values.na} onChange={e=>setField("na", e.target.value)} />
            </div>
            <div>
              <div style={label}>Cl (mEq/L)</div>
              <input style={input} type="number" step="0.1" value={values.cl} onChange={e=>setField("cl", e.target.value)} />
            </div>
            <div>
              <div style={label}>Albúmina (g/dL)</div>
              <input style={input} type="number" step="0.1" value={values.alb} onChange={e=>setField("alb", e.target.value)} />
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <button onClick={()=>setStep(1)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Atrás</button>
            <button onClick={()=>setStep(3)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #22d3ee",
  background:"#0d2a4e",
  color:"#22d3ee"
}}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 3</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Interpretación ácido-base</div>

          {(!ph || !pco2 || !hco3) ? (
            <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px"}}>
              <div style={{fontSize:12,color:"#7aa2d4"}}>Completa al menos pH, PCO₂ y HCO₃⁻ para interpretar.</div>
            </div>
          ) : (
            <>
              {phState && (
                <div style={{background:phState.color+"18", border:`1px solid ${phState.color}44`, borderRadius:10, padding:"10px 12px", marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:phState.color}}>Estado del pH</div>
                  <div style={{fontSize:13,color:phState.color,marginTop:2}}>{phState.label}</div>
                </div>
              )}

              {primary && (
                <div style={{background:primary.color+"18", border:`1px solid ${primary.color}44`, borderRadius:10, padding:"10px 12px", marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:primary.color}}>Trastorno primario</div>
                  <div style={{fontSize:13,color:primary.color,marginTop:2}}>{primary.label}</div>
                </div>
              )}

              {compensation && (
                <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", marginBottom:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:compensation.color}}>{compensation.title}</div>
                  <div style={{fontSize:12,color:"#7aa2d4",marginTop:4}}>{compensation.text}</div>
                  {sampleType === "venoso" && (
                    <div style={{fontSize:11,color:"#4a6a9f",marginTop:6}}>
                      En gas venoso se estima PaCO₂ restando aprox. 5 mmHg para esta orientación rápida.
                    </div>
                  )}
                </div>
              )}

              {agCorr !== null && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                  <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>Anion gap</div>
                    <div style={{fontSize:22,fontWeight:800,color: agCorr > 12 ? "#ef4444" : "#22c55e"}}>{fmt(agCorr)}</div>
                  </div>
                  <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>Δ gap / Δ HCO₃</div>
                    <div style={{fontSize:22,fontWeight:800,color:"#22d3ee"}}>
                      {deltaGap !== null && deltaHco3 !== null ? `${fmt(deltaGap)} / ${fmt(deltaHco3)}` : "—"}
                    </div>
                  </div>
                </div>
              )}

              {deltaNote && (
                <div style={{background:deltaNote.color+"18", border:`1px solid ${deltaNote.color}44`, borderRadius:10, padding:"10px 12px", marginBottom:8}}>
                  <div style={{fontSize:12,color:deltaNote.color,fontWeight:700}}>{deltaNote.text}</div>
                </div>
              )}

              {chlorideNote && (
                <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", marginBottom:8}}>
                  <div style={{fontSize:12,color:"#7aa2d4"}}>{chlorideNote.text}</div>
                </div>
              )}
            </>
          )}

          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <button onClick={()=>setStep(2)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Atrás</button>
            <button onClick={()=>setStep(4)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #22d3ee",
  background:"#0d2a4e",
  color:"#22d3ee"
}}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 4</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Oxigenación</div>

          {sampleType === "venoso" ? (
            <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",marginBottom:4}}>Muestra venosa seleccionada</div>
              <div style={{fontSize:12,color:"#7aa2d4"}}>La evaluación de oxigenación, PAFI y gradiente A-a requiere gas arterial.</div>
            </div>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <div style={label}>PaO₂ (mmHg)</div>
                  <input style={input} type="number" step="0.1" value={values.po2} onChange={e=>setField("po2", e.target.value)} />
                </div>
                <div>
                  <div style={label}>FiO₂ (%)</div>
                  <input style={input} type="number" step="0.1" value={values.fio2} onChange={e=>setField("fio2", e.target.value)} />
                </div>
              </div>

              {(po2 !== null && fio2 !== null && effectivePco2 !== null) ? (
                <div style={{marginTop:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>PAFI</div>
                      <div style={{fontSize:24,fontWeight:800,color: pf < 300 ? "#ef4444" : "#22c55e"}}>{fmt(pf,0)}</div>
                    </div>
                    <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#4a6a9f",marginBottom:4}}>Gradiente A-a</div>
                      <div style={{fontSize:24,fontWeight:800,color: aa > 20 ? "#f59e0b" : "#22c55e"}}>{fmt(aa,0)}</div>
                    </div>
                  </div>

                  {sdra && (
                    <div style={{gridColumn:"1 / -1", background:sdra.color+"18", border:`1px solid ${sdra.color}44`, borderRadius:10, padding:"10px 12px", marginTop:8}}>
                      <div style={{fontSize:12,fontWeight:700,color:sdra.color}}>{sdra.text}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{background:"#040c1c", borderRadius:10, padding:"10px 12px", marginTop:10}}>
                  <div style={{fontSize:12,color:"#7aa2d4"}}>Completa PaO₂, FiO₂ y PCO₂ para calcular PAFI y gradiente A-a.</div>
                </div>
              )}
            </>
          )}

          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <button onClick={()=>setStep(3)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Atrás</button>
            <button onClick={()=>setStep(5)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #22d3ee",
  background:"#0d2a4e",
  color:"#22d3ee"
}}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 5</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Perfusión</div>

          <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px", marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:6}}>ΔPCO₂</div>
            <div style={{...small, marginBottom:10}}>
              Requiere sangre arterial y sangre venosa central. La muestra venosa ideal es desde CVC con punta en VCS / unión cavoauricular.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <div style={label}>PaCO₂ arterial</div>
                <input style={input} type="number" step="0.1" value={values.pco2a} onChange={e=>setField("pco2a", e.target.value)} />
              </div>
              <div>
                <div style={label}>PvCO₂ venosa central</div>
                <input style={input} type="number" step="0.1" value={values.pco2v} onChange={e=>setField("pco2v", e.target.value)} />
              </div>
            </div>

            {deltaPco2 !== null && (
              <div style={{marginTop:10, background:deltaPco2 <= 6 ? "#052a10" : "#2a0505", border:`1px solid ${deltaPco2 <= 6 ? "#22c55e44" : "#ef444444"}`, borderRadius:10, padding:"12px 14px"}}>
                <div style={{fontSize:24,fontWeight:800,color: deltaPco2 <= 6 ? "#22c55e" : "#ef4444"}}>{fmt(deltaPco2)}</div>
                <div style={{fontSize:12,color: deltaPco2 <= 6 ? "#22c55e" : "#ef4444"}}>
                  {deltaPco2 <= 6 ? "ΔPCO₂ normal: flujo suficiente" : "ΔPCO₂ elevado: bajo flujo / hipoperfusión persistente"}
                </div>
              </div>
            )}
          </div>

          <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:6}}>Lactato</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <div style={label}>Lactato inicial (mmol/L)</div>
                <input style={input} type="number" step="0.1" value={values.lactato} onChange={e=>setField("lactato", e.target.value)} />
              </div>
              <div>
                <div style={label}>Lactato control 2h (mmol/L)</div>
                <input style={input} type="number" step="0.1" value={values.lactato2} onChange={e=>setField("lactato2", e.target.value)} />
              </div>
            </div>

            {lactatoMsg && (
              <div style={{marginTop:10, background:lactatoMsg.color+"18", border:`1px solid ${lactatoMsg.color}44`, borderRadius:10, padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:700,color:lactatoMsg.color}}>{lactatoMsg.text}</div>
              </div>
            )}

            {clearance !== null && (
              <div style={{marginTop:10, background:clearance >= 30 ? "#052a10" : clearance >= 10 ? "#2a1a00" : "#2a0505", borderRadius:10, padding:"12px 14px"}}>
                <div style={{fontSize:24,fontWeight:800,color: clearance >= 30 ? "#22c55e" : clearance >= 10 ? "#f59e0b" : "#ef4444"}}>
                  {fmt(clearance)}%
                </div>
                <div style={{fontSize:12,color: clearance >= 30 ? "#22c55e" : clearance >= 10 ? "#f59e0b" : "#ef4444"}}>
                  {clearance >= 30 ? "Buen clearance" : clearance >= 10 ? "Clearance parcial" : "Sin clearance adecuado"}
                </div>
              </div>
            )}
          </div>

          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <button onClick={()=>setStep(4)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Atrás</button>
            <button onClick={()=>setStep(6)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #22d3ee",
  background:"#0d2a4e",
  color:"#22d3ee"
}}>Siguiente</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div style={card}>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:10}}>PASO 6</div>
          <div style={{fontSize:16,fontWeight:800,marginBottom:10}}>Referencias venosas</div>

          <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px", marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:6}}>Utilidad gas venoso</div>
            <div style={small}>
              Útil para evaluación ácido-base, seguimiento seriado y correlación con gas arterial.<br/>
              No reemplaza al arterial cuando necesitas evaluar oxigenación o calcular PAFI.
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:6}}>Correlación venoso-arterial</div>
              <div style={small}>
                pH venoso ≈ 0.03–0.04 menor<br/>
                PCO₂ venoso ≈ 3–8 mmHg mayor<br/>
                HCO₃⁻ venoso ≈ 2–3 mEq/L mayor
              </div>
            </div>
            <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:6}}>Cuándo no usarlo solo</div>
              <div style={small}>
                Hipoxemia / SDRA<br/>
                Necesidad de PAFI<br/>
                Gradiente A-a<br/>
                Evaluación precisa de oxigenación
              </div>
            </div>
          </div>

          <div style={{background:"#040c1c", borderRadius:10, padding:"12px 14px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#22d3ee",marginBottom:6}}>SvCO₂ / ScvO₂</div>
            <div style={small}>
              ScvO₂: 70–80%<br/>
              SvO₂: 65–75%<br/>
              Baja → bajo DO₂ o alto VO₂<br/>
              Alta inapropiada → alteración extracción / sepsis / shunt
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
            <button onClick={()=>setStep(5)} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Atrás</button>
            <button onClick={resetAll} style={{
  padding:"10px 12px",
  borderRadius:8,
  fontFamily:"inherit",
  fontSize:12,
  fontWeight:700,
  cursor:"pointer",
  border:"1px solid #1a3060",
  background:"#060d1f",
  color:"#4a6a9f"
}}>Reiniciar</button>
          </div>
        </div>
      )}
    </div>
  );
}
function ArritmiasTab() {
  const [rhythmType, setRhythmType] = useState("taqui");
  const [stability, setStability] = useState("estable");
  const [qrs, setQrs] = useState("angosto");
  const [regularity, setRegularity] = useState("regular");
  const [bradyHr, setBradyHr] = useState("");
 
  // ── Estilos base ──────────────────────────────────────────────────
 
  const card = {
    background: "#0b1730",
    border: "1px solid #1a3060",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 12,
  };
 
  const inp = {
    background: "#040c1c",
    border: "1px solid #1a3060",
    borderRadius: 8,
    color: "#e8edf5",
    fontSize: 14,
    padding: "8px 12px",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  };
 
  const grid2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  };
 
  // ── Helpers de UI ─────────────────────────────────────────────────
 
  function sectionTitle(text) {
    return (
      <div style={{ fontSize: 11, color: "#22d3ee", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
        {text}
      </div>
    );
  }
 
  function segButton(label, active, onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          flex: 1,
          padding: "9px 10px",
          borderRadius: 8,
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          border: active ? "1px solid #22d3ee" : "1px solid #1a3060",
          background: active ? "#0d2a4e" : "#060d1f",
          color: active ? "#22d3ee" : "#4a6a9f",
        }}
      >
        {label}
      </button>
    );
  }
 
  function actionCard(title, body, tone = "cyan") {
    const bg =
      tone === "red" ? "#2a0505" :
      tone === "yellow" ? "#2a1a00" :
      tone === "green" ? "#052a10" :
      "#062534";
    const border =
      tone === "red" ? "#ef444444" :
      tone === "yellow" ? "#f59e0b44" :
      tone === "green" ? "#22c55e44" :
      "#22d3ee44";
    const color =
      tone === "red" ? "#ef4444" :
      tone === "yellow" ? "#f59e0b" :
      tone === "green" ? "#22c55e" :
      "#22d3ee";
    return (
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#7aa2d4", lineHeight: 1.7 }}>{body}</div>
      </div>
    );
  }
 
  function heroCard(title, summary, titleColor) {
    const bg =
      titleColor === "#ef4444" ? "#2a0505" :
      titleColor === "#f59e0b" ? "#2a1a00" :
      "#062534";
    const border =
      titleColor === "#ef4444" ? "#ef444444" :
      titleColor === "#f59e0b" ? "#f59e0b44" :
      "#22d3ee44";
    return (
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: titleColor, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#7aa2d4", lineHeight: 1.7 }}>{summary}</div>
      </div>
    );
  }
 
  // ── Lógica taquiarritmia ──────────────────────────────────────────
 
  let taquiTitle, taquiTitleColor, taquiSummary, taquiActions;
 
  if (stability === "inestable") {
    taquiTitle = "Taquiarritmia inestable";
    taquiTitleColor = "#ef4444";
    taquiSummary = "Prioriza cardioversión sincronizada si hay pulso. Si no hay pulso, manejo como paro según ritmo.";
    taquiActions = [
      actionCard("Tratamiento eléctrico", "Cardioversión sincronizada inmediata. Sedar si el tiempo y la condición lo permiten, sin retrasar la descarga.", "red"),
      actionCard("Antes / durante", "Monitor, desfibrilador listo, acceso venoso, oxígeno si precisa y búsqueda rápida de causa reversible.", "yellow"),
      actionCard("Si QRS ancho", "Asume TV hasta demostrar lo contrario, sobre todo si es regular.", "yellow"),
      actionCard("No retrasar por ECG fino", "La inestabilidad manda la conducta. El detalle electrocardiográfico puede afinarse después del rescate inicial.", "cyan"),
    ];
  } else if (qrs === "angosto" && regularity === "regular") {
    taquiTitle = "TSV probable";
    taquiTitleColor = "#22d3ee";
    taquiSummary = "Taquicardia regular de QRS angosto en paciente estable: TSV es lo más probable.";
    taquiActions = [
      actionCard("Primer paso", "Maniobras vagales si el paciente colabora y no hay contraindicación.", "cyan"),
      actionCard("Fármaco", "Adenosina 6 mg IV en bolo rápido + flush. Si no revierte: 12 mg, luego 12 mg.", "green"),
      actionCard("Si no revierte", "Revalorar diagnóstico, ECG de 12 derivaciones y considerar flutter 2:1 u otra TSV.", "yellow"),
      actionCard("Advertencia", "Evitar adenosina si sospechas FA preexcitada o taquicardia irregular de QRS ancho.", "red"),
    ];
  } else if (qrs === "angosto" && regularity === "irregular") {
    taquiTitle = "FA / Flutter variable probable";
    taquiTitleColor = "#f59e0b";
    taquiSummary = "Taquicardia irregular de QRS angosto en paciente estable: pensar primero en FA o flutter con conducción variable.";
    taquiActions = [
      actionCard("Control de frecuencia", "Betabloqueador o diltiazem según contexto si no hay contraindicación ni inestabilidad.", "cyan"),
      actionCard("Cardioversión", "Considerarla según tiempo de evolución, síntomas, riesgo tromboembólico y estrategia global.", "yellow"),
      actionCard("Buscar gatillantes", "Sepsis, hipovolemia, hipoxia, dolor, tirotoxicosis, alcohol, postoperatorio.", "green"),
      actionCard("No adenosina como tratamiento de FA", "Puede ayudar a desenmascarar flutter, pero no trata la FA.", "red"),
    ];
  } else if (qrs === "ancho" && regularity === "regular") {
    taquiTitle = "TV monomorfa hasta demostrar lo contrario";
    taquiTitleColor = "#ef4444";
    taquiSummary = "Taquicardia regular de QRS ancho en estable: asumir TV hasta demostrar lo contrario.";
    taquiActions = [
      actionCard("Diagnóstico operativo", "Trata como TV si hay duda. Es la conducta más segura.", "red"),
      actionCard("Fármacos", "Amiodarona 150 mg IV en 10 min. Luego infusión si responde o mientras preparas siguiente estrategia.", "cyan"),
      actionCard("Revalorar permanente", "Si empeora o aparece inestabilidad, cardioversión sincronizada inmediata.", "yellow"),
      actionCard("Corregir factores", "K, Mg, isquemia, hipoxia, acidosis, fármacos proarrítmicos.", "green"),
    ];
  } else {
    taquiTitle = "Taquicardia irregular de QRS ancho";
    taquiTitleColor = "#ef4444";
    taquiSummary = "Escenario de alto riesgo: pensar en FA preexcitada, TV polimorfa u otras arritmias complejas.";
    taquiActions = [
      actionCard("Prioridad", "Monitor estricto y preparación para cardioversión / desfibrilación según evolución.", "red"),
      actionCard("Evitar", "No bloqueadores del nodo AV si sospechas FA preexcitada: adenosina, verapamilo, diltiazem, digoxina.", "red"),
      actionCard("Si torsades", "Magnesio 2 g IV y corregir QT largo, hipokalemia e hipomagnesemia.", "cyan"),
      actionCard("Si inestabiliza", "Tratamiento eléctrico inmediato.", "yellow"),
    ];
  }
 
  const taquiEnergyCards = [
    actionCard(
      "Cardioversión / Desfibrilación",
      <>
        TSV regular angosto: <strong>50–100 J sincronizado</strong><br/>
        FA / Flutter: <strong>120–200 J bifásico</strong><br/>
        TV monomorfa con pulso: <strong>100 J sincronizado</strong> → escalar<br/>
        FV / TV sin pulso: <strong>200 J bifásico</strong>
      </>,
      "red"
    ),
    actionCard(
      "Magnesio",
      <>
        Torsades / QT largo: <strong>2 g IV</strong> en <strong>5–15 min</strong><br/>
        Puede repetirse · Infusión posterior: <strong>1–2 g/h</strong><br/>
        Preparación: <strong>2 g = 4 mL</strong> sulfato de magnesio al 50%,
        diluir en <strong>10–20 mL</strong> para bolo lento
      </>,
      "cyan"
    ),
    actionCard(
      "Amiodarona",
      <>
        Carga: <strong>150 mg IV en 10 min</strong><br/>
        Infusión: <strong>1 mg/min × 6 h</strong>, luego <strong>0,5 mg/min</strong><br/>
        Dosis máxima 24 h: <strong>2,2 g</strong>
      </>,
      "cyan"
    ),
    actionCard(
      "Perlas rápidas",
      <>
        En inestabilidad no retrasar el tratamiento eléctrico por definir el ritmo fino.<br/>
        Si es irregular y ancho: evita bloqueadores del nodo AV si sospechas preexcitación.
      </>,
      "yellow"
    ),
  ];
 
  // ── Lógica bradiarritmia ──────────────────────────────────────────
 
  const bradiTitleColor = stability === "inestable" ? "#ef4444" : "#f59e0b";
  const bradiTitle = stability === "inestable" ? "Bradicardia inestable" : "Bradicardia estable";
  const bradiSummary = stability === "inestable"
    ? "Si la bradicardia explica la clínica, iniciar tratamiento inmediato sin retrasar soporte por espera diagnóstica."
    : "Si está perfundiendo bien, monitoriza, busca causa y decide necesidad de observación, ajuste farmacológico o marcapasos según ECG.";
 
  const bradiActions = stability === "inestable"
    ? [
        actionCard("Primera línea", "Atropina 1 mg IV, repetir cada 3–5 min hasta 3 mg.", "cyan"),
        actionCard("Si falla o alto grado", "Marcapasos transcutáneo mientras preparas vía definitiva.", "red"),
        actionCard("Puente vasoactivo", "Epinefrina o dopamina mientras resuelves la causa o consigues pacing.", "yellow"),
        actionCard("Buscar causa reversible", "Hipoxia, IAM, hiperkalemia, betabloqueador, calcioantagonista, digoxina, hipotermia.", "green"),
      ]
    : [
        actionCard("Observación y ECG", "Confirmar ritmo, QRS, PR y presencia de BAV o pausas.", "cyan"),
        actionCard("Revisar fármacos", "Betabloqueadores, calcioantagonistas, amiodarona, digoxina, sedantes.", "green"),
        actionCard("Laboratorio", "Electrolitos, troponina según contexto, gases, TSH si aplica.", "yellow"),
        actionCard("Escalar si cambia", "Si aparece inestabilidad, tratar como bradicardia inestable.", "red"),
      ];
 
  const bradiDrugCards = [
    actionCard(
      "Isoproterenol",
      <><strong>2–10 mcg/min IV</strong><br/>Útil en BAV alto grado o escape lento como puente.<br/>Puede inducir arritmias.</>,
      "cyan"
    ),
    actionCard(
      "Dopamina",
      <><strong>5–20 mcg/kg/min</strong><br/>Opción de puente en bradicardia inestable si no hay pacing inmediato.</>,
      "yellow"
    ),
    actionCard(
      "Epinefrina",
      <><strong>2–10 mcg/min IV</strong><br/>Alternativa a dopamina en bradicardia severa o shock asociado.</>,
      "red"
    ),
    actionCard(
      "Dobutamina",
      <><strong>2–20 mcg/kg/min</strong><br/>Útil si predomina bajo gasto cardíaco. No es cronotrópico puro.</>,
      "cyan"
    ),
  ];
 
  // ── Render ────────────────────────────────────────────────────────
 
  return (
    <div>
      {/* Header */}
      <div style={{ background: "#0d2a4e", border: "1px solid #22d3ee44", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#22d3ee", marginBottom: 2 }}>Arritmias</div>
        <div style={{ fontSize: 12, color: "#22d3ee" }}>Taquiarritmia · Bradiarritmia · Fármacos</div>
      </div>
 
      {/* Tipo de arritmia */}
      <div style={card}>
        {sectionTitle("TIPO DE ARRITMIA")}
        <div style={{ display: "flex", gap: 8 }}>
          {segButton("Taquiarritmia", rhythmType === "taqui", () => setRhythmType("taqui"))}
          {segButton("Bradiarritmia", rhythmType === "bradi", () => setRhythmType("bradi"))}
        </div>
      </div>
 
      {/* Inestabilidad */}
      <div style={card}>
        {sectionTitle("INESTABILIDAD")}
        <div style={{ display: "flex", gap: 8 }}>
          {segButton("Paciente estable",   stability === "estable",   () => setStability("estable"))}
          {segButton("Paciente inestable", stability === "inestable", () => setStability("inestable"))}
        </div>
        {stability === "inestable" && (
          <div style={{ marginTop: 12, background: "#2a0505", border: "1px solid #ef444444", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 7 }}>Signos de inestabilidad</div>
            <div style={{ fontSize: 12, color: "#7aa2d4", lineHeight: 1.8 }}>
              · Hipotensión: PAS &lt; 90 mmHg o mala perfusión asociada<br/>
              · Alteración del sensorio: confusión, síncope, compromiso neurológico<br/>
              · Shock / hipoperfusión: piel fría, oliguria, lactato alto<br/>
              · Dolor torácico isquémico<br/>
              · Insuficiencia cardiaca aguda / edema pulmonar
            </div>
          </div>
        )}
      </div>
 
      {/* ── TAQUIARRITMIA ── */}
      {rhythmType === "taqui" && (
        <>
          {/* Características — QRS y Ritmo en 2 columnas */}
          <div style={card}>
            {sectionTitle("CARACTERÍSTICAS DE LA TAQUICARDIA")}
            <div style={grid2}>
              <div style={{ background: "#040c1c", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "#4a6a9f", marginBottom: 6 }}>QRS</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {segButton("Angosto", qrs === "angosto", () => setQrs("angosto"))}
                  {segButton("Ancho",   qrs === "ancho",   () => setQrs("ancho"))}
                </div>
              </div>
              <div style={{ background: "#040c1c", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "#4a6a9f", marginBottom: 6 }}>Ritmo</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {segButton("Regular",   regularity === "regular",   () => setRegularity("regular"))}
                  {segButton("Irregular", regularity === "irregular", () => setRegularity("irregular"))}
                </div>
              </div>
            </div>
          </div>
 
          {/* Orientación clínica */}
          <div style={card}>
            {sectionTitle("ORIENTACIÓN CLÍNICA")}
            {heroCard(taquiTitle, taquiSummary, taquiTitleColor)}
          </div>
 
          {/* Conducta inmediata */}
          <div style={card}>
            {sectionTitle("CONDUCTA INMEDIATA")}
            <div style={grid2}>{taquiActions}</div>
          </div>
 
          {/* Energía y fármacos */}
          <div style={card}>
            {sectionTitle("ENERGÍA Y FÁRMACOS CLAVE")}
            <div style={grid2}>{taquiEnergyCards}</div>
          </div>
        </>
      )}
 
      {/* ── BRADIARRITMIA ── */}
      {rhythmType === "bradi" && (
        <>
          <div style={card}>
            {sectionTitle("BRADIARRITMIA")}
            <div style={grid2}>
              <div style={{ background: "#040c1c", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "#4a6a9f", marginBottom: 6 }}>Frecuencia cardíaca</div>
                <input
                  style={inp}
                  type="number"
                  value={bradyHr}
                  onChange={e => setBradyHr(e.target.value)}
                  placeholder="Ej: 32"
                />
              </div>
              <div style={{ background: "#040c1c", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "#4a6a9f", marginBottom: 6 }}>Contexto</div>
                <div style={{ fontSize: 12, color: "#7aa2d4", lineHeight: 1.7 }}>
                  Pensar en BAV alto grado, nodo enfermo, fármacos, hiperkalemia, IAM inferior, hipoxia y otras causas reversibles.
                </div>
              </div>
            </div>
          </div>
 
          <div style={card}>
            {sectionTitle("ORIENTACIÓN CLÍNICA")}
            {heroCard(bradiTitle, bradiSummary, bradiTitleColor)}
          </div>
 
          <div style={card}>
            {sectionTitle("CONDUCTA INMEDIATA")}
            <div style={grid2}>{bradiActions}</div>
          </div>
 
          <div style={card}>
            {sectionTitle("FÁRMACOS EN BRADIARRITMIA")}
            <div style={grid2}>{bradiDrugCards}</div>
          </div>
        </>
      )}
    </div>
  );
}

const TABS=["💉 SRI","🩸 DVA","⚗️ CRI","🧠 Glasgow","🛏️ Sedación UCI","🔧 Procedimientos","📊 Scores","🧂 Electrolitos","❤️ RCP","🫁 VMI","🪸 Vía Aérea", "🧪Gases","💕Arritmias"];

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
        {tab===7&&<ElectrolyteTab/>}
        {tab===8&&<RCPTab/>}
        {tab===9&&<VMITab/>}
        {tab===10&&<AirwayTab/>}
        {tab===11&&<GasesCalculator/>}
        {tab===12&&<ArritmiasTab/>} 
        <div style={{marginTop:24,padding:"12px 16px",background:"#08111f",border:"1px solid #1a2a4f",borderRadius:10,fontSize:11,color:"#2a4a7f",lineHeight:1.7}}>
          ⚠️ Herramienta de apoyo clínico. Verificar siempre con protocolos institucionales y criterio médico.
        </div>
      </div>
    </div>
  );
}