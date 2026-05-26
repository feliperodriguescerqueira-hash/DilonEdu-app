/**
 * DilonEduPlatform.jsx
 * Three interconnected portals with shared live-event state:
 *   1. Admin Web Portal   — Diretoria · Secretaria · Professor
 *   2. Parent Mobile App  — Home · Agenda · Mensagens · Financeiro · Filho
 *   3. Student Portal     — Web & App modes
 *
 * Cross-portal communication via shared `events` array + `emit()` helper.
 */

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, DollarSign,
  TrendingUp, TrendingDown, Bell, Search, Play, CheckCircle, Clock,
  AlertCircle, BarChart2, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Check, X, FileText, Download, Plus, Video, Award, LogOut, Calendar,
  Heart, UserCheck, Activity, MessageSquare, Send, Home, QrCode, Star,
  Zap, Shield, LogIn, Medal, Target, Flame, Lock, CreditCard,
  Edit2, ArrowRight, Map, Trophy, Layers, Wifi, Filter, Phone,
  Smartphone, Monitor, ChevronUp, MoreHorizontal, Sparkles, BookMarked,
} from "lucide-react";

// ─── Design System ─────────────────────────────────────────────────────────
const C = {
  navy: "#03254C", navyL: "#0a4080",
  teal: "#00F5D4", tealBg: "#E0FDF8", tealD: "#0a7a6a",
  bg: "#F4F6F9",
  green: "#16a34a", greenBg: "#dcfce7",
  amber: "#f59e0b", amberBg: "#fef3c7",
  red: "#dc2626",   redBg: "#fee2e2",
  purple: "#8b5cf6",purpleBg: "#ede9fe",
  blue: "#3b82f6",  blueBg: "#eff6ff",
};

// ─── SHARED MOCK DATA ───────────────────────────────────────────────────────
const STUDENTS = [
  { id:1,  name:"Sofia Oliveira",       av:"SO", class:"7º Ano A", plan:"Anual",  status:"PAGO",    value:"R$ 1.350", paid:"01/05/2025", days:0  },
  { id:2,  name:"Pedro Souza",          av:"PS", class:"7º Ano A", plan:"Mensal", status:"PAGO",    value:"R$ 1.350", paid:"02/05/2025", days:0  },
  { id:3,  name:"Ana Clara Ferreira",   av:"AC", class:"9º Ano A", plan:"Anual",  status:"PAGO",    value:"R$ 1.350", paid:"01/05/2025", days:0  },
  { id:4,  name:"Bruno Monteiro",       av:"BM", class:"7º Ano B", plan:"Mensal", status:"PENDENTE",value:"R$ 1.350", paid:"03/04/2025", days:0  },
  { id:5,  name:"Carla Beatriz Nunes",  av:"CB", class:"9º Ano A", plan:"Mensal", status:"PAGO",    value:"R$ 1.350", paid:"02/05/2025", days:0  },
  { id:6,  name:"Diego Alves Pereira",  av:"DA", class:"8º Ano C", plan:"Anual",  status:"VENCIDO", value:"R$ 1.350", paid:"10/03/2025", days:45 },
  { id:7,  name:"Elena Santos Costa",   av:"ES", class:"6º Ano A", plan:"Mensal", status:"PAGO",    value:"R$ 950",   paid:"01/05/2025", days:0  },
  { id:8,  name:"Felipe Rocha Lima",    av:"FR", class:"7º Ano A", plan:"Mensal", status:"PENDENTE",value:"R$ 1.350", paid:"05/04/2025", days:0  },
  { id:9,  name:"Gabriela Teixeira",    av:"GT", class:"1º EM A",  plan:"Anual",  status:"PAGO",    value:"R$ 1.600", paid:"01/05/2025", days:0  },
  { id:10, name:"Hugo Bastos Vieira",   av:"HB", class:"8º Ano B", plan:"Mensal", status:"PAGO",    value:"R$ 1.350", paid:"02/05/2025", days:0  },
  { id:11, name:"Isabela Moura Lopes",  av:"IM", class:"1º EM B",  plan:"Anual",  status:"VENCIDO", value:"R$ 1.600", paid:"01/03/2025", days:52 },
  { id:12, name:"João Victor Castro",   av:"JV", class:"9º Ano B", plan:"Mensal", status:"PAGO",    value:"R$ 1.350", paid:"03/05/2025", days:0  },
];

const GRADES_SOFIA = [
  { s:"Matemática",  t:"Prof. Ricardo Alves",  av1:8.5, av2:9.0,  color:C.blue   },
  { s:"Português",   t:"Profa. Carla Santos",  av1:7.5, av2:8.0,  color:C.purple },
  { s:"Ciências",    t:"Prof. Eduardo Lima",   av1:9.0, av2:null, color:C.green  },
  { s:"História",    t:"Profa. Ana Beatriz",   av1:6.5, av2:7.0,  color:C.amber  },
  { s:"Inglês",      t:"Profa. Amanda Clark",  av1:9.5, av2:9.0,  color:"#06b6d4"},
  { s:"Artes",       t:"Prof. Carlos Mendes",  av1:10,  av2:null, color:"#ec4899"},
  { s:"Ed. Física",  t:"Prof. Roberto Silva",  av1:9.0, av2:null, color:"#84cc16"},
];

const EMOTIONAL_SOFIA = [
  { label:"Resiliência",  value:78, color:C.purple, icon:"💪" },
  { label:"Participação", value:91, color:C.teal,   icon:"🙋" },
  { label:"Socialização", value:85, color:C.blue,   icon:"🤝" },
  { label:"Foco",         value:62, color:C.amber,  icon:"🎯" },
  { label:"Responsab.",   value:88, color:C.green,  icon:"✅" },
];

const MODULES = [
  { id:1, title:"Módulo 1: Funções Matemáticas",  done:2, total:4, lessons:[
    { id:1, title:"Introdução ao Conceito de Função",  dur:"12:35", done:true  },
    { id:2, title:"Funções de 1º Grau",                dur:"18:20", done:true  },
    { id:3, title:"Funções de 2º Grau",                dur:"22:45", done:false },
    { id:4, title:"Funções Exponenciais",              dur:"19:10", done:false },
  ]},
  { id:2, title:"Módulo 2: Geometria Analítica",  done:0, total:3, lessons:[
    { id:5, title:"Plano Cartesiano",                  dur:"14:00", done:false },
    { id:6, title:"Distância entre Pontos",            dur:"16:30", done:false },
    { id:7, title:"Equação da Reta",                   dur:"20:15", done:false },
  ]},
  { id:3, title:"Módulo 3: Trigonometria",        done:0, total:2, lessons:[
    { id:8, title:"Seno, Cosseno e Tangente",          dur:"25:00", done:false },
    { id:9, title:"Círculo Trigonométrico",            dur:"18:45", done:false },
  ]},
];

const KNOWLEDGE_TRAIL = [
  { id:1, title:"Álgebra Básica",      status:"done",   xp:150, icon:"🔢" },
  { id:2, title:"Equações 1º Grau",    status:"done",   xp:200, icon:"📏" },
  { id:3, title:"Equações 2º Grau",    status:"done",   xp:250, icon:"📐" },
  { id:4, title:"Funções",             status:"active", xp:300, icon:"📈" },
  { id:5, title:"Geometria Analítica", status:"locked", xp:350, icon:"🗺️" },
  { id:6, title:"Trigonometria",       status:"locked", xp:400, icon:"⭕" },
  { id:7, title:"Logaritmos",          status:"locked", xp:450, icon:"🔬" },
  { id:8, title:"Progressões",         status:"locked", xp:500, icon:"🧮" },
];

const QUESTIONS = [
  { id:1, s:"Matemática",q:"Qual é a solução de 2x² − 8x + 6 = 0?",                                             opts:["x=1 ou x=3","x=2 ou x=4","x=−1 ou x=−3","x=0 ou x=4"],              ans:0 },
  { id:2, s:"Português", q:"'O tempo é dinheiro.' Qual figura de linguagem está presente?",                     opts:["Hipérbole","Metáfora","Metonímia","Antítese"],                          ans:1 },
  { id:3, s:"História",  q:"Em que ano foi proclamada a República no Brasil?",                                   opts:["1822","1888","1889","1891"],                                            ans:2 },
  { id:4, s:"Biologia",  q:"Qual organela é responsável pela maior parte da produção de ATP celular?",           opts:["Ribossomo","Retículo Endoplasmático","Mitocôndria","Ap. de Golgi"],     ans:2 },
  { id:5, s:"Física",    q:"Com m = 5 kg e a = 3 m/s², qual é a força resultante (F = m·a)?",                   opts:["8 N","10 N","15 N","20 N"],                                            ans:2 },
  { id:6, s:"Química",   q:"Qual é o número atômico do Carbono (C) na Tabela Periódica?",                        opts:["4","6","8","12"],                                                      ans:1 },
  { id:7, s:"Geografia", q:"Qual é o maior rio do Brasil em extensão?",                                          opts:["Rio São Francisco","Rio Paraná","Rio Amazonas","Rio Tocantins"],       ans:2 },
  { id:8, s:"Inglês",    q:"Choose the CORRECT sentence:",                                                       opts:["She don't like coffee.","She doesn't likes coffee.","She doesn't like coffee.","She not like coffee."], ans:2 },
  { id:9, s:"Matemática",q:"A área de um triângulo com base 8 cm e altura 5 cm é:",                             opts:["20 cm²","40 cm²","13 cm²","16 cm²"],                                   ans:0 },
  { id:10,s:"História",  q:"Quem liderou a Inconfidência Mineira?",                                              opts:["Dom Pedro I","Tiradentes","Deodoro da Fonseca","José Bonifácio"],      ans:1 },
];

const BADGES_SOFIA = [
  { title:"Assiduidade Perfeita", icon:"🏅", desc:"30 dias sem falta",  earned:true,  color:C.amberBg, border:C.amber  },
  { title:"Aluno Destaque",       icon:"⭐", desc:"Top 5% da turma",     earned:true,  color:C.purpleBg,border:C.purple },
  { title:"Líder de Turma",       icon:"🎖️", desc:"Votado pelos colegas",earned:true,  color:C.tealBg,  border:C.tealD  },
  { title:"Maratonista",          icon:"📚", desc:"10 livros lidos",     earned:false, color:C.redBg,   border:C.red    },
  { title:"Cientista",            icon:"🔬", desc:"Projeto aprovado",    earned:false, color:C.greenBg, border:C.green  },
  { title:"Artista",              icon:"🎨", desc:"Exposição escolar",   earned:false, color:C.blueBg,  border:C.blue   },
];

const AGENDA_EVENTS = [
  { date:"Hoje",   time:"08:00", title:"Matemática", type:"Aula",  teacher:"Prof. Ricardo", color:C.blue   },
  { date:"Hoje",   time:"09:45", title:"Redação",    type:"Prova", teacher:"Profa. Carla",  color:C.red    },
  { date:"Hoje",   time:"11:30", title:"Ciências",   type:"Aula",  teacher:"Prof. Eduardo", color:C.green  },
  { date:"Amanhã", time:"08:00", title:"Inglês",     type:"Aula",  teacher:"Profa. Amanda", color:C.purple },
  { date:"Amanhã", time:"10:15", title:"Matemática", type:"Prova", teacher:"Prof. Ricardo", color:C.blue   },
  { date:"27/05",  time:"19:00", title:"Reunião Pais",type:"Evento",teacher:"Direção",       color:C.amber  },
];

const FINANCIAL_HIST = [
  { month:"Maio/2025",  value:"R$ 1.350,00", status:"Pendente", due:"25/05" },
  { month:"Abril/2025", value:"R$ 1.350,00", status:"Pago",     due:"25/04" },
  { month:"Mar/2025",   value:"R$ 1.350,00", status:"Pago",     due:"25/03" },
  { month:"Fev/2025",   value:"R$ 1.350,00", status:"Pago",     due:"25/02" },
];

const EMOTIONAL_CRIT = [
  { key:"res", label:"Resiliência",  icon:"💪" },
  { key:"foc", label:"Foco",         icon:"🎯" },
  { key:"par", label:"Participação", icon:"🙋" },
  { key:"col", label:"Colaboração",  icon:"🤝" },
  { key:"cri", label:"Criatividade", icon:"✨" },
];

const ROSTER = [
  { id:1, name:"Ana Clara Ferreira",  av:"AC", present:true  },
  { id:2, name:"Bruno Monteiro",      av:"BM", present:true  },
  { id:3, name:"Carla Beatriz",       av:"CB", present:false },
  { id:4, name:"Diego Alves",         av:"DA", present:true  },
  { id:5, name:"Elena Santos",        av:"ES", present:true  },
  { id:6, name:"Felipe Rocha",        av:"FR", present:false },
  { id:7, name:"Gabriela Teixeira",   av:"GT", present:true  },
  { id:8, name:"Hugo Bastos",         av:"HB", present:true  },
];

const CRM_FUNNEL = [
  { stage:"Agendou Visita",      color:C.blue,  bg:C.blueBg,   count:12, icon:"📅" },
  { stage:"Prova de Bolsa",      color:C.amber, bg:C.amberBg,  count:7,  icon:"✏️" },
  { stage:"Matrícula Efetivada", color:C.green, bg:C.greenBg,  count:31, icon:"✅" },
];

const INIT_MSGS = [
  { id:1, from:"Prof. Ricardo Alves",    role:"prof",  av:"RA", time:"14:25", text:"Sofia teve excelente participação hoje! Nota AV1: 9.0 em Matemática. Continue assim!",      read:false },
  { id:2, from:"Secretaria",             role:"admin", av:"SE", time:"11:10", text:"Confirmamos sua presença na Reunião de Pais dia 27/05 às 19h. Local: Auditório Principal.", read:false },
  { id:3, from:"Profa. Carla Santos",    role:"prof",  av:"CS", time:"09:30", text:"Lembrete: trabalho de Redação para entregar sexta-feira.",                                  read:true  },
  { id:4, from:"Coordenação Pedagógica", role:"admin", av:"CP", time:"Ontem", text:"Calendário Escolar de Junho disponível no portal. Confira as datas importantes.",           read:true  },
];

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────

function Av({ i, s = 34, bg }) {
  return (
    <div style={{ width:s, height:s, background:bg||C.teal, color:C.navy, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:Math.round(s*0.34), flexShrink:0 }}>
      {i}
    </div>
  );
}

function SBadge({ s }) {
  const m = { PAGO:"bg-green-100 text-green-700", PENDENTE:"bg-amber-100 text-amber-700", VENCIDO:"bg-red-100 text-red-700", Pago:"bg-green-100 text-green-700", Pendente:"bg-amber-100 text-amber-700" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${m[s]||"bg-gray-100 text-gray-500"}`}>{s}</span>;
}

function TBadge({ children }) {
  return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:C.tealBg,color:C.tealD}}>{children}</span>;
}

function PhoneFrame({ children }) {
  return (
    <div className="flex items-start justify-center pt-4 pb-4" style={{background:C.bg, minHeight:"100%"}}>
      <div style={{width:375, background:C.bg, borderRadius:36, boxShadow:"0 24px 64px rgba(3,37,76,0.20), 0 2px 8px rgba(0,0,0,0.08)", overflow:"hidden", border:"8px solid #1a1a2e"}}>
        <div style={{background:"#1a1a2e", height:28, display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
          <div style={{width:60, height:6, background:"#333", borderRadius:99}} />
        </div>
        <div style={{maxHeight:500, overflowY:"auto"}}>{children}</div>
        <div style={{background:"#1a1a2e", height:20, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div style={{width:100, height:4, background:"#333", borderRadius:99}} />
        </div>
      </div>
    </div>
  );
}

// ─── PORTAL 1: ADMIN WEB ────────────────────────────────────────────────────

const ADMIN_NAV = [
  { k:"diretoria", l:"Diretoria",        ic:LayoutDashboard },
  { k:"secretaria",l:"Secretaria",       ic:Users           },
  { k:"professor", l:"Portal Professor", ic:BookOpen        },
];

function AdminSidebar({ section, setSection, adminNotif }) {
  return (
    <aside className="flex flex-col flex-shrink-0" style={{width:240, background:C.navy, minHeight:"100%"}}>
      <div className="px-5 py-5" style={{borderBottom:"1px solid rgba(255,255,255,0.09)"}}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:C.teal}}>
            <GraduationCap size={18} style={{color:C.navy}} />
          </div>
          <div>
            <p className="text-white font-extrabold text-lg leading-none tracking-tight">Dilon Edu</p>
            <p className="font-bold text-xs" style={{color:C.teal}}>Plataforma Web</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-white" style={{background:"rgba(255,255,255,0.06)"}}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
            <span className="font-medium text-sm">Unidade Laranjeiras</span>
          </div>
          <ChevronDown size={13} style={{color:"rgba(255,255,255,0.35)"}}/>
        </button>
      </div>
      <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.28)"}}>Módulos</p>
        {ADMIN_NAV.map(item => (
          <button key={item.k} onClick={()=>setSection(item.k)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={section===item.k?{background:C.teal,color:C.navy}:{color:"rgba(255,255,255,0.55)"}}>
            <div className="flex items-center gap-3"><item.ic size={15}/>{item.l}</div>
            {item.k==="professor" && adminNotif>0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{background:C.red,color:"#fff"}}>{adminNotif}</span>}
          </button>
        ))}
        <div className="mt-6 flex flex-col gap-1">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.28)"}}>Sistema</p>
          {[{l:"Financeiro",ic:DollarSign},{l:"Calendário",ic:Calendar},{l:"Relatórios",ic:BarChart2},{l:"Configurações",ic:Settings}].map(({l,ic:Ic})=>(
            <button key={l} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{color:"rgba(255,255,255,0.32)"}}>
              <Ic size={14}/>{l}
            </button>
          ))}
        </div>
      </nav>
      <div className="px-4 py-4" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div className="flex items-center gap-3 px-2">
          <Av i="AG" s={34} bg={C.teal}/>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Admin Geral</p>
            <p className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>admin@dilonedu.com.br</p>
          </div>
          <LogOut size={14} style={{color:"rgba(255,255,255,0.28)"}}/>
        </div>
      </div>
    </aside>
  );
}

function DiretoriaView({ emit }) {
  const [notified, setNotified] = useState(new Set());
  const bars = [52,59,63,55,68,72,70,77,82,78,87,91];
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return (
    <div className="p-7" style={{background:C.bg, minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold" style={{color:C.navy}}>Painel da Diretoria</h1>
          <p className="text-sm text-gray-500 mt-0.5">Visão consolidada · Todas as unidades · Maio 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{background:C.navy}}>
            <Download size={13}/> Exportar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 mb-7">
        {[
          {l:"Faturamento Maio",  v:"R$ 287.400", sub:"+12,3% vs abril",   trend:"up",   ic:DollarSign,  ac:"bg-emerald-50 text-emerald-500"},
          {l:"Inadimplência",     v:"6,4%",        sub:"−2,1pp mês ant.",   trend:"down", ic:AlertCircle, ac:"bg-red-50 text-red-400"},
          {l:"Total de Alunos",   v:"1.247",        sub:"+98 novos em 2025", trend:"up",   ic:Users,       ac:"bg-blue-50 text-blue-400"},
          {l:"Matrículas / Mês",  v:"31",           sub:"Meta 40 · 77% ✓",  trend:"up",   ic:UserCheck,   ac:"bg-purple-50 text-purple-400"},
        ].map(({l,v,sub,trend,ic:Ic,ac})=>(
          <div key={l} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{l}</span>
              <div className={`p-2 rounded-lg ${ac}`}><Ic size={14}/></div>
            </div>
            <p className="text-[26px] font-bold leading-none" style={{color:C.navy}}>{v}</p>
            <p className={`text-xs font-medium flex items-center gap-1 mt-2 ${trend==="up"?"text-green-600":"text-red-500"}`}>
              {trend==="up"?<TrendingUp size={12}/>:<TrendingDown size={12}/>}{sub}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5 mb-7">
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div><p className="font-bold text-sm" style={{color:C.navy}}>Receita Mensal 2025</p><p className="text-xs text-gray-400">R$ mil</p></div>
            <TBadge>+15,8% no ano</TBadge>
          </div>
          <div className="flex items-end gap-2 h-20">
            {bars.map((v,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t-md" style={{height:`${(v/91)*80}px`, background:i===4?C.teal:"#bfdbfe"}}/>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">{months.map(m=><span key={m} className="text-xs text-gray-300">{m}</span>)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="font-bold text-sm mb-4" style={{color:C.navy}}>Funil de Captação</p>
          {CRM_FUNNEL.map((col,i)=>(
            <div key={i} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{background:col.bg}}>{col.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600">{col.stage}</p>
                <div className="bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="h-1.5 rounded-full" style={{width:`${Math.min(100,col.count*2)}%`, background:col.color}}/>
                </div>
              </div>
              <span className="text-sm font-bold" style={{color:col.color}}>{col.count}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Conversão geral</p>
            <p className="text-xl font-bold mt-0.5" style={{color:C.navy}}>61,3%</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-base" style={{color:C.navy}}>Gestão de Alunos</h2>
          <button onClick={()=>{emit("secretaria","Novo aluno cadastrado: Rafael Lima","Secretaria","admin"); alert("Funcionalidade na aba Secretaria!");}}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white" style={{background:C.navy}}>
            <Plus size={12}/> Novo Aluno
          </button>
        </div>
        <table className="w-full">
          <thead><tr className="bg-gray-50 border-b border-gray-100">
            {["Aluno","Turma","Plano","Valor","Status","Ação"].map((h,i)=>(
              <th key={h} className={`py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wide ${i===0?"text-left pl-6":i===5?"text-right pr-6":"text-left"}`}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {STUDENTS.slice(0,8).map((s,idx)=>(
              <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${idx<7?"border-b border-gray-50":""}`}>
                <td className="py-3 pl-6 pr-4"><div className="flex items-center gap-3"><Av i={s.av} s={28}/><span className="text-sm font-semibold" style={{color:C.navy}}>{s.name}</span></div></td>
                <td className="py-3 px-4 text-sm text-gray-500">{s.class}</td>
                <td className="py-3 px-4"><span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">{s.plan}</span></td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-700">{s.value}</td>
                <td className="py-3 px-4"><SBadge s={s.status}/></td>
                <td className="py-3 px-4 pr-6 text-right">
                  {notified.has(s.id)
                    ? <span className="text-xs text-green-600 font-bold flex items-center gap-1 justify-end"><Check size={11}/>Enviado</span>
                    : <button onClick={()=>{setNotified(p=>new Set([...p,s.id])); if(s.status!=="PAGO") emit("financeiro",`Aviso financeiro enviado para família de ${s.name}`,"Admin","parent");}}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={s.status!=="PAGO"?{background:C.navy,color:"#fff"}:{color:"#d1d5db",background:"#f9fafb"}}>
                        Notificar
                      </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecretariaView({ emit }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TODOS");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({name:"",class:"7º Ano A",plan:"Mensal",parent:"",phone:""});
  const [saved, setSaved] = useState(false);

  const list = STUDENTS.filter(s => {
    const q = search.toLowerCase();
    return (s.name.toLowerCase().includes(q)||s.class.toLowerCase().includes(q)) && (filter==="TODOS"||s.status===filter);
  });

  const submit = () => {
    if(!form.name) return;
    emit("matricula",`Nova matrícula: ${form.name} — ${form.class}`,"Secretaria","admin");
    setSaved(true); setTimeout(()=>{setSaved(false); setModal(false); setForm({name:"",class:"7º Ano A",plan:"Mensal",parent:"",phone:""});},1500);
  };

  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Secretaria</h1><p className="text-sm text-gray-500 mt-0.5">Gestão de matrículas e cadastros</p></div>
        <button onClick={()=>setModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{background:C.teal,color:C.navy}}>
          <Plus size={14}/> Novo Aluno
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5 mb-7">
        {CRM_FUNNEL.map((col,i)=>(
          <div key={i} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{col.stage}</span>
              <div className="w-3 h-3 rounded-full" style={{background:col.color}}/>
            </div>
            <p className="text-3xl font-black" style={{color:col.color}}>{col.count}</p>
            <div className="bg-gray-100 rounded-full h-1.5 mt-3">
              <div className="h-1.5 rounded-full" style={{width:`${Math.min(100,col.count*2.5)}%`,background:col.color}}/>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 flex-wrap">
          <h2 className="font-bold text-base flex-1" style={{color:C.navy}}>Alunos Matriculados <span className="text-gray-400 font-normal text-sm">({list.length})</span></h2>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400 flex-shrink-0"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="bg-transparent text-sm outline-none w-36 placeholder-gray-300 text-gray-700"/>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
            {["TODOS","PAGO","PENDENTE","VENCIDO"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={filter===f?{background:C.navy,color:"#fff"}:{color:"#9ca3af"}}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {["Aluno","Turma","Plano","Mensalidade","Últ. Pagamento","Status"].map((h,i)=>(
                <th key={h} className={`py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wide ${i===0?"text-left pl-6":"text-left"}`}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {list.map((s,idx)=>(
                <tr key={s.id} className={`hover:bg-gray-50 ${idx<list.length-1?"border-b border-gray-50":""}`}>
                  <td className="py-3 pl-6 pr-4"><div className="flex items-center gap-3"><Av i={s.av} s={28}/><span className="text-sm font-semibold" style={{color:C.navy}}>{s.name}</span></div></td>
                  <td className="py-3 px-4 text-sm text-gray-500">{s.class}</td>
                  <td className="py-3 px-4"><span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">{s.plan}</span></td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-700">{s.value}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{s.paid}</td>
                  <td className="py-3 px-4"><SBadge s={s.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background:"rgba(3,37,76,0.5)"}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{color:C.navy}}>Nova Matrícula</h2>
              <button onClick={()=>setModal(false)}><X size={18} className="text-gray-400"/></button>
            </div>
            <div className="space-y-4">
              {[{l:"Nome completo",k:"name",ph:"Ex: Rafael Lima"},{l:"Nome do Responsável",k:"parent",ph:"Ex: Paulo Lima"},{l:"Telefone",k:"phone",ph:"(21) 99999-9999"}].map(({l,k,ph})=>(
                <div key={k}>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{l}</label>
                  <input value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-gray-700" style={{"--tw-ring-color":C.teal}}/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Turma</label>
                  <select value={form.class} onChange={e=>setForm(p=>({...p,class:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none text-gray-700">
                    {["6º Ano A","7º Ano A","7º Ano B","8º Ano B","8º Ano C","9º Ano A","9º Ano B","1º EM A","1º EM B"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Plano</label>
                  <select value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none text-gray-700">
                    {["Mensal","Trimestral","Anual"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={()=>setModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50">Cancelar</button>
              <button onClick={submit} className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all" style={{background:saved?"#16a34a":C.navy}}>
                {saved?<span className="flex items-center justify-center gap-2"><Check size={14}/>Matriculado!</span>:"Confirmar Matrícula"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfessorView({ emit, adminNotif, setAdminNotif }) {
  const [tab, setTab] = useState("diary");
  const [presence, setPresence] = useState(()=>Object.fromEntries(ROSTER.map(s=>[s.id,s.present])));
  const [grades, setGrades] = useState(()=>Object.fromEntries(ROSTER.map(s=>[s.id,{g1:null,g2:null}])));
  const [selSt, setSelSt] = useState(1);
  const [ratings, setRatings] = useState(()=>Object.fromEntries(EMOTIONAL_CRIT.map(c=>[c.key,3])));
  const [obs, setObs] = useState("");
  const [saved, setSaved] = useState(false);
  const [annText, setAnnText] = useState("");
  const [announcements, setAnnouncements] = useState([{id:1,from:"Família Oliveira",text:"Boa tarde! Posso buscar Sofia às 15h hoje?",time:"14:30",read:false}]);

  const present = Object.values(presence).filter(Boolean).length;
  const selData = ROSTER.find(s=>s.id===selSt);

  const doSave=()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000); emit("nota",`Prof. Ricardo lançou notas da turma 7º Ano A`,"Professor","parent"); emit("nota",`Novas notas disponíveis em Matemática`,"Professor","student"); };
  const sendAnn=()=>{
    if(!annText.trim()) return;
    emit("comunicado",annText,"Professor","parent");
    setAnnText("");
  };

  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Portal do Professor</h1><p className="text-sm text-gray-500 mt-0.5">Profa. Mariana Costa · Matemática · 7º Ano A</p></div>
        <div className="flex gap-3">
          {[{l:"Turma:",v:"7º Ano A"},{l:"Data:",v:"23/05/2025"},{l:"Aula Nº:",v:"24"}].map(({l,v})=>(
            <div key={l} className="bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-sm">
              <span className="text-gray-400">{l}</span><span className="font-bold ml-1.5" style={{color:C.navy}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="inline-flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-7">
        {[{k:"diary",l:"Diário de Classe",ic:FileText},{k:"emotional",l:"Socioemocional",ic:Heart},{k:"messages",l:"Recados",ic:MessageSquare}].map(({k,l,ic:Ic})=>(
          <button key={k} onClick={()=>{setTab(k); if(k==="messages")setAdminNotif(0);}}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={tab===k?{background:C.navy,color:"#fff"}:{color:"#9ca3af"}}>
            <Ic size={13}/>{l}
            {k==="messages"&&adminNotif>0&&<span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{background:C.red,color:"#fff"}}>{adminNotif}</span>}
          </button>
        ))}
      </div>

      {tab==="diary"&&(
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[{l:"Presentes",v:present,c:"text-green-600"},{l:"Ausentes",v:ROSTER.length-present,c:"text-red-500"},{l:"Frequência",v:`${Math.round(present/ROSTER.length*100)}%`,c:""},{l:"Total",v:ROSTER.length,c:""}].map(({l,v,c})=>(
              <div key={l} className="bg-white rounded-xl p-5 shadow-sm"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{l}</p><p className={`text-2xl font-bold ${c}`} style={!c?{color:C.navy}:{}}>{v}</p></div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-base" style={{color:C.navy}}>Chamada & Notas</h2>
              <button onClick={doSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={saved?{background:C.greenBg,color:C.green}:{background:C.teal,color:C.navy}}>
                {saved?<><Check size={13}/>Salvo!</>:<><CheckCircle size={13}/>Salvar Diário</>}
              </button>
            </div>
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {["Aluno","Presença","Nota AV1","Nota AV2","Média","Situação"].map((h,i)=>(
                  <th key={h} className={`py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wide ${i===0?"text-left pl-6":"text-center"}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {ROSTER.map((s,idx)=>{
                  const g=grades[s.id]; const av=(g.g1!=null&&g.g2!=null)?((g.g1+g.g2)/2).toFixed(1):"—";
                  const n=parseFloat(av); const sit=av==="—"?null:n>=7?"APROVADO":n>=5?"RECUPERAÇÃO":"REPROVADO";
                  const sc={APROVADO:"bg-green-50 text-green-700",RECUPERAÇÃO:"bg-amber-50 text-amber-700",REPROVADO:"bg-red-50 text-red-700"};
                  return (
                    <tr key={s.id} className={`hover:bg-gray-50 ${idx<ROSTER.length-1?"border-b border-gray-50":""}`}>
                      <td className="py-3 pl-6 pr-4"><div className="flex items-center gap-3"><Av i={s.av} s={28}/><span className="text-sm font-semibold" style={{color:C.navy}}>{s.name}</span></div></td>
                      <td className="py-3 px-4 text-center">
                        <button onClick={()=>setPresence(p=>({...p,[s.id]:!p[s.id]}))} className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto ${presence[s.id]?"bg-green-100":"bg-red-100"}`}>
                          {presence[s.id]?<Check size={12} className="text-green-600"/>:<X size={12} className="text-red-500"/>}
                        </button>
                      </td>
                      {["g1","g2"].map(f=>(
                        <td key={f} className="py-3 px-4 text-center">
                          <input type="number" min="0" max="10" step="0.5" value={g[f]??""} onChange={e=>{ const v=e.target.value; if(v===""||(!isNaN(+v)&&+v>=0&&+v<=10)) setGrades(p=>({...p,[s.id]:{...p[s.id],[f]:v===""?null:+v}})); }}
                            className="w-14 text-center text-sm font-bold border border-gray-200 rounded-xl py-1.5 focus:outline-none focus:border-teal-400" style={{color:C.navy}} placeholder="—"/>
                        </td>
                      ))}
                      <td className="py-3 px-4 text-center"><span className={`text-sm font-bold ${av==="—"?"text-gray-200":n>=7?"text-green-600":n>=5?"text-amber-500":"text-red-500"}`}>{av}</span></td>
                      <td className="py-3 px-4 text-center">{sit&&<span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc[sit]}`}>{sit}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab==="emotional"&&(
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-sm" style={{color:C.navy}}>Selecionar Aluno</h3></div>
            {ROSTER.map(s=>(
              <button key={s.id} onClick={()=>setSelSt(s.id)} className="w-full flex items-center gap-3 px-5 py-3.5 text-left border-b border-gray-50 transition-colors hover:bg-gray-50" style={selSt===s.id?{background:"#eff6ff"}:{}}>
                <Av i={s.av} s={28} bg={selSt===s.id?"#bfdbfe":C.teal}/>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate" style={{color:C.navy}}>{s.name}</p></div>
                {selSt===s.id&&<ChevronRight size={12} className="text-blue-400"/>}
              </button>
            ))}
          </div>
          <div className="col-span-2 bg-white rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3"><Av i={selData?.av||"??"} s={38}/><div><p className="font-bold" style={{color:C.navy}}>{selData?.name}</p><p className="text-xs text-gray-400">Avaliação Socioemocional</p></div></div>
              <button onClick={()=>{setSaved(true); setTimeout(()=>setSaved(false),2000); emit("socioemocional",`Avaliação socioemocional atualizada para ${selData?.name}`,"Professor","parent");}}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={saved?{background:C.greenBg,color:C.green}:{background:C.navy,color:"#fff"}}>
                {saved?<><Check size={13}/>Salvo!</>:<><CheckCircle size={13}/>Salvar</>}
              </button>
            </div>
            <div className="p-7 space-y-5">
              {EMOTIONAL_CRIT.map(c=>(
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2"><span className="text-xl">{c.icon}</span><span className="font-semibold text-sm" style={{color:C.navy}}>{c.label}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">{ratings[c.key]}/5</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold" style={ratings[c.key]>=4?{background:C.greenBg,color:C.green}:ratings[c.key]>=3?{background:C.amberBg,color:C.amber}:{background:C.redBg,color:C.red}}>
                        {ratings[c.key]>=4?"Ótimo":ratings[c.key]>=3?"Regular":"Atenção"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(v=>(
                      <button key={v} onClick={()=>setRatings(p=>({...p,[c.key]:v}))} className="flex-1 h-3 rounded-full transition-all cursor-pointer"
                        style={{background:v<=ratings[c.key]?(ratings[c.key]>=4?"#22c55e":ratings[c.key]>=3?"#f59e0b":"#ef4444"):"#f3f4f6"}}/>
                    ))}
                  </div>
                </div>
              ))}
              <div><label className="block text-sm font-bold mb-2" style={{color:C.navy}}>Observações</label>
                <textarea value={obs} onChange={e=>setObs(e.target.value)} rows={3} placeholder="Descreva o desenvolvimento do aluno..." className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none resize-none placeholder-gray-300 text-gray-700"/>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="messages"&&(
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-bold text-sm" style={{color:C.navy}}>Mensagens de Pais</h3></div>
            {announcements.map((a,i)=>(
              <div key={a.id} className={`flex items-start gap-3 px-5 py-4 ${i<announcements.length-1?"border-b border-gray-50":""} ${!a.read?"bg-blue-50":""}`}>
                {!a.read&&<div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background:C.teal}}/>}
                {a.read&&<div className="w-2 flex-shrink-0"/>}
                <div className="flex-1 min-w-0"><p className="text-sm font-bold" style={{color:C.navy}}>{a.from}</p><p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.text}</p></div>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-sm mb-4" style={{color:C.navy}}>Enviar Comunicado para Pais</h3>
            <textarea value={annText} onChange={e=>setAnnText(e.target.value)} rows={4} placeholder="Digite o comunicado para todas as famílias da turma 7º Ano A..."
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none resize-none placeholder-gray-300 text-gray-700 mb-4"/>
            <button onClick={sendAnn} className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{background:C.navy,color:"#fff"}}>
              <Send size={13}/> Enviar para Pais
            </button>
            {!annText && <p className="text-xs text-gray-400 text-center mt-3">O comunicado aparecerá no App dos Pais instantaneamente</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPortal({ events, emit }) {
  const [section, setSection] = useState("diretoria");
  const [adminNotif, setAdminNotif] = useState(1);
  const parentNotif = events.filter(e=>e.to==="admin").length;

  return (
    <div className="flex" style={{height:"100%"}}>
      <AdminSidebar section={section} setSection={setSection} adminNotif={parentNotif+adminNotif}/>
      <main className="flex-1 overflow-y-auto">
        {section==="diretoria"&&<DiretoriaView emit={emit}/>}
        {section==="secretaria"&&<SecretariaView emit={emit}/>}
        {section==="professor"&&<ProfessorView emit={emit} adminNotif={parentNotif+adminNotif} setAdminNotif={setAdminNotif}/>}
      </main>
    </div>
  );
}

// ─── PORTAL 2: PARENT APP ──────────────────────────────────────────────────

function ParentHomeScreen({ events }) {
  const newNotifs = events.filter(e=>e.to==="parent").slice(0,3);
  return (
    <div>
      <div style={{background:C.navy, padding:"18px 20px 24px", borderRadius:"0 0 24px 24px"}}>
        <div className="flex items-center justify-between mb-3">
          <div><p style={{color:"rgba(255,255,255,0.55)", fontSize:12}}>Olá de volta,</p><p style={{color:"#fff", fontSize:18, fontWeight:800}}>Família Oliveira</p></div>
          <div className="relative"><Bell size={18} color="#fff"/>{newNotifs.length>0&&<span style={{position:"absolute",top:-2,right:-2,width:8,height:8,background:C.teal,borderRadius:"50%",border:`2px solid ${C.navy}`}}/>}</div>
        </div>
        <div style={{background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"11px 14px", display:"flex", alignItems:"center", gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:C.navy,flexShrink:0}}>SO</div>
          <div style={{flex:1}}><p style={{color:"#fff",fontWeight:700,fontSize:14}}>Sofia Oliveira</p><p style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>7º Ano A · Turno Manhã</p></div>
          <span style={{background:C.tealBg,color:C.tealD,borderRadius:99,fontSize:10,fontWeight:700,padding:"3px 9px"}}>Ativa</span>
        </div>
      </div>
      <div style={{padding:"16px 14px"}}>
        {/* Catraca */}
        <div style={{background:"#fff",borderRadius:16,padding:"14px 16px",marginBottom:12,boxShadow:"0 2px 8px rgba(3,37,76,0.07)"}}>
          <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:10}}>🚪 Registro de Acesso</p>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1,background:"#F0FDF4",borderRadius:12,padding:"10px 12px",borderLeft:`3px solid ${C.green}`}}>
              <p style={{fontSize:9,fontWeight:700,color:C.green,marginBottom:2}}>ENTRADA</p>
              <p style={{fontSize:18,fontWeight:800,color:C.green}}>07:15</p>
              <p style={{fontSize:9,color:"#4b7a59"}}>Hoje · Catraca 2</p>
            </div>
            <div style={{flex:1,background:"#F8FAFC",borderRadius:12,padding:"10px 12px",borderLeft:"3px solid #9ca3af"}}>
              <p style={{fontSize:9,fontWeight:700,color:"#6b7280",marginBottom:2}}>SAÍDA</p>
              <p style={{fontSize:18,fontWeight:800,color:"#9ca3af"}}>—</p>
              <p style={{fontSize:9,color:"#9ca3af"}}>Aguardando</p>
            </div>
          </div>
        </div>
        {/* Notifs cross-portal */}
        {newNotifs.length>0&&(
          <div style={{marginBottom:12}}>
            <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8}}>🔔 Avisos Recentes</p>
            {newNotifs.map((e,i)=>(
              <div key={e.id||i} style={{background:C.tealBg,borderRadius:12,padding:"10px 14px",marginBottom:6,borderLeft:`3px solid ${C.teal}`}}>
                <p style={{fontSize:12,fontWeight:600,color:C.navy}}>{e.from}</p>
                <p style={{fontSize:11,color:"#374151",marginTop:2,lineHeight:1.4}}>{e.msg}</p>
                <p style={{fontSize:9,color:C.tealD,marginTop:3}}>{e.ts}</p>
              </div>
            ))}
          </div>
        )}
        {/* Próximos eventos */}
        <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8}}>📅 Próximos Eventos</p>
        {AGENDA_EVENTS.slice(0,3).map((ev,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:ev.color,flexShrink:0}}/>
            <div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:C.navy}}>{ev.title}</p><p style={{fontSize:10,color:"#6b7280"}}>{ev.date} · {ev.time}</p></div>
            <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99,background:ev.type==="Prova"?C.redBg:ev.type==="Evento"?C.amberBg:C.blueBg,color:ev.type==="Prova"?C.red:ev.type==="Evento"?C.amber:C.blue}}>{ev.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentAgendaScreen() {
  const [selDay, setSelDay] = useState(23);
  const days = Array.from({length:10},(_,i)=>i+21);
  const dayLabels = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom","Seg","Ter","Qua"];
  const evForDay = AGENDA_EVENTS.filter(e=>e.date==="Hoje"||e.date==="Amanhã"||e.date==="27/05");
  return (
    <div>
      <div style={{background:C.navy, padding:"16px 20px 20px"}}>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:600}}>MAIO 2025</p>
        <p style={{color:"#fff",fontSize:18,fontWeight:800,marginBottom:14}}>Agenda</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:2}}>
          {days.map((d,i)=>(
            <button key={d} onClick={()=>setSelDay(d)} style={{background:selDay===d?C.teal:"rgba(255,255,255,0.1)",borderRadius:12,padding:"8px 10px",border:"none",cursor:"pointer",flexShrink:0,textAlign:"center",minWidth:44}}>
              <p style={{fontSize:9,fontWeight:700,color:selDay===d?C.navy:"rgba(255,255,255,0.5)",marginBottom:2}}>{dayLabels[i]}</p>
              <p style={{fontSize:16,fontWeight:800,color:selDay===d?C.navy:"#fff"}}>{d}</p>
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"14px 14px"}}>
        {AGENDA_EVENTS.map((ev,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:8,boxShadow:"0 2px 6px rgba(3,37,76,0.06)",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,flexShrink:0,textAlign:"center"}}>
              <p style={{fontSize:11,fontWeight:700,color:ev.color}}>{ev.time}</p>
            </div>
            <div style={{width:3,background:ev.color,borderRadius:99,alignSelf:"stretch"}}/>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:700,color:C.navy}}>{ev.title}</p>
              <p style={{fontSize:10,color:"#6b7280"}}>{ev.teacher}</p>
            </div>
            <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,background:ev.type==="Prova"?C.redBg:ev.type==="Evento"?C.amberBg:C.blueBg,color:ev.type==="Prova"?C.red:ev.type==="Evento"?C.amber:C.blue}}>{ev.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentMensagensScreen({ messages, setMessages, emit }) {
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState("");
  const unread = messages.filter(m=>!m.read).length;
  const send=()=>{
    if(!reply.trim()) return;
    const newMsg={id:Date.now(),from:"Família Oliveira",role:"parent",av:"FO",time:"Agora",text:reply,read:false,sent:true};
    setMessages(p=>[newMsg,...p]);
    emit("mensagem",`Família Oliveira: "${reply.substring(0,60)}..."`,"Pais","admin");
    setReply("");
  };
  return (
    <div>
      <div style={{background:C.navy,padding:"16px 20px 20px"}}>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:600}}>COMUNICAÇÃO</p>
        <p style={{color:"#fff",fontSize:18,fontWeight:800}}>Mensagens</p>
        {unread>0&&<span style={{background:C.teal,color:C.navy,borderRadius:99,fontSize:11,fontWeight:700,padding:"3px 10px",marginTop:8,display:"inline-block"}}>{unread} não lidas</span>}
      </div>
      {!open ? (
        <div style={{padding:"12px 14px"}}>
          {messages.map((m,i)=>(
            <button key={m.id} onClick={()=>{setOpen(m); setMessages(p=>p.map(x=>x.id===m.id?{...x,read:true}:x));}}
              style={{background:"#fff",borderRadius:14,padding:"12px 14px",marginBottom:8,width:"100%",textAlign:"left",border:"none",cursor:"pointer",boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",gap:10,alignItems:"flex-start"}}>
              {!m.read&&<div style={{width:7,height:7,borderRadius:"50%",background:C.teal,marginTop:5,flexShrink:0}}/>}
              {m.read&&<div style={{width:7,flexShrink:0}}/>}
              <Av i={m.av} s={34} bg={m.role==="prof"?C.purpleBg:C.blueBg}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.navy}}>{m.from}</p>
                  <p style={{fontSize:10,color:"#9ca3af",flexShrink:0}}>{m.time}</p>
                </div>
                <p style={{fontSize:11,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.text}</p>
              </div>
            </button>
          ))}
          {/* Quick compose */}
          <div style={{background:"#fff",borderRadius:14,padding:"14px",marginTop:4,boxShadow:"0 1px 4px rgba(3,37,76,0.06)"}}>
            <p style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:8}}>Enviar mensagem para escola</p>
            <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={2} placeholder="Digite uma mensagem para a secretaria ou professores..."
              style={{width:"100%",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 12px",fontSize:12,resize:"none",outline:"none",color:"#374151"}}/>
            <button onClick={send} style={{marginTop:8,background:C.navy,color:"#fff",border:"none",borderRadius:10,padding:"9px 20px",fontSize:12,fontWeight:700,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Send size={12}/> Enviar
            </button>
          </div>
        </div>
      ) : (
        <div style={{padding:"12px 14px"}}>
          <button onClick={()=>setOpen(null)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:C.navy,fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:14}}>
            <ChevronLeft size={16}/> Voltar
          </button>
          <div style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(3,37,76,0.07)"}}>
            <div style={{display:"flex",gap:10,marginBottom:10}}><Av i={open.av} s={36} bg={open.role==="prof"?C.purpleBg:C.blueBg}/><div><p style={{fontWeight:700,color:C.navy,fontSize:13}}>{open.from}</p><p style={{fontSize:10,color:"#9ca3af"}}>{open.time}</p></div></div>
            <p style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{open.text}</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Responder..."
              style={{flex:1,border:"1px solid #e5e7eb",borderRadius:12,padding:"10px 14px",fontSize:12,outline:"none",color:"#374151"}}/>
            <button onClick={send} style={{background:C.navy,border:"none",borderRadius:12,padding:"10px 14px",cursor:"pointer"}}><Send size={14} color="#fff"/></button>
          </div>
        </div>
      )}
    </div>
  );
}

function ParentFinanceiroScreen({ emit }) {
  const [pixState, setPixState] = useState("idle");
  return (
    <div>
      <div style={{background:C.navy,padding:"16px 20px 20px"}}>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:600}}>FINANCEIRO</p>
        <p style={{color:"#fff",fontSize:18,fontWeight:800}}>Mensalidades</p>
      </div>
      <div style={{padding:"14px 14px"}}>
        {pixState==="idle"&&(
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"20px",marginBottom:14,boxShadow:"0 4px 20px rgba(3,37,76,0.18)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"rgba(255,255,255,0.65)",fontSize:11,fontWeight:700}}>MENSALIDADE · MAIO 2025</span>
              <span style={{background:C.amberBg,color:C.amber,borderRadius:99,fontSize:10,fontWeight:700,padding:"3px 8px"}}>Vence em 7d</span>
            </div>
            <p style={{color:"#fff",fontSize:32,fontWeight:800,letterSpacing:-1,marginBottom:3}}>R$ 1.350,00</p>
            <p style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginBottom:18}}>PIX com 5% de desconto à vista</p>
            <button onClick={()=>setPixState("qr")} style={{background:C.teal,color:C.navy,border:"none",borderRadius:12,padding:"13px",width:"100%",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Zap size={16}/> Pagar com PIX
            </button>
          </div>
        )}
        {pixState==="qr"&&(
          <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"20px",marginBottom:14}}>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:11,fontWeight:700,marginBottom:14}}>MENSALIDADE · MAIO 2025 · ESCANEIE O QR CODE</p>
            <div style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:16,textAlign:"center"}}>
              <div style={{background:"#fff",borderRadius:12,padding:12,width:90,height:90,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}><QrCode size={66} color={C.navy}/></div>
              <p style={{color:"rgba(255,255,255,0.7)",fontSize:11,marginBottom:12}}>Válido por 30 minutos</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setPixState("paid");emit("financeiro","Pagamento PIX confirmado: Mensalidade Maio 2025","Pais","admin");}} style={{flex:1,background:C.teal,color:C.navy,border:"none",borderRadius:10,padding:11,fontSize:12,fontWeight:800,cursor:"pointer"}}>✓ Simular Pgto</button>
                <button onClick={()=>setPixState("idle")} style={{background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:10,padding:11,fontSize:12,cursor:"pointer"}}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {pixState==="paid"&&(
          <div style={{background:"#F0FDF4",borderRadius:20,padding:"24px 18px",marginBottom:14,textAlign:"center",border:"2px solid #bbf7d0"}}>
            <div style={{width:52,height:52,background:C.greenBg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><CheckCircle size={28} color={C.green}/></div>
            <p style={{color:C.green,fontSize:19,fontWeight:800,marginBottom:4}}>Pagamento Confirmado!</p>
            <p style={{color:"#4b7a59",fontSize:13,marginBottom:14}}>R$ 1.350,00 · Maio 2025</p>
            <button onClick={()=>setPixState("idle")} style={{background:C.greenBg,border:"none",borderRadius:10,padding:"8px 20px",fontSize:12,color:C.green,cursor:"pointer",fontWeight:600}}>Ver comprovante</button>
          </div>
        )}
        <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:10}}>Histórico</p>
        {FINANCIAL_HIST.map((f,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:12,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:f.status==="Pago"?C.greenBg:C.amberBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <CreditCard size={16} color={f.status==="Pago"?C.green:C.amber}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:12,fontWeight:700,color:C.navy}}>{f.month}</p>
              <p style={{fontSize:10,color:"#6b7280"}}>Venc. {f.due}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:13,fontWeight:700,color:C.navy}}>{f.value}</p>
              <SBadge s={f.status}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentFilhoScreen() {
  return (
    <div>
      <div style={{background:C.navy,padding:"16px 20px 20px"}}>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:600}}>ACOMPANHAMENTO</p>
        <p style={{color:"#fff",fontSize:18,fontWeight:800}}>Sofia Oliveira</p>
      </div>
      <div style={{padding:"14px 14px"}}>
        {/* Boletim */}
        <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8}}>📊 Boletim Parcial</p>
        {GRADES_SOFIA.map((g,i)=>{
          const avg=g.av1&&g.av2?((g.av1+g.av2)/2).toFixed(1):g.av1?`${g.av1}*`:"—";
          return (
            <div key={i} style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:g.color,flexShrink:0}}/>
              <p style={{flex:1,fontSize:12,fontWeight:600,color:C.navy}}>{g.s}</p>
              <p style={{fontSize:14,fontWeight:800,color:parseFloat(avg)>=7?C.green:parseFloat(avg)>=5?C.amber:C.red}}>{avg}</p>
            </div>
          );
        })}
        {/* Socioemocional */}
        <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8,marginTop:16}}>💡 Radar Socioemocional</p>
        <div style={{background:"#fff",borderRadius:14,padding:"14px",boxShadow:"0 1px 4px rgba(3,37,76,0.06)"}}>
          {EMOTIONAL_SOFIA.map((e,i)=>(
            <div key={i} style={{marginBottom:i<EMOTIONAL_SOFIA.length-1?10:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{e.icon} {e.label}</span>
                <span style={{fontSize:12,fontWeight:700,color:e.color}}>{e.value}%</span>
              </div>
              <div style={{background:"#f4f6f9",borderRadius:99,height:6,overflow:"hidden"}}>
                <div style={{width:`${e.value}%`,height:"100%",background:e.color,borderRadius:99}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParentApp({ events, emit }) {
  const [tab, setTab] = useState("home");
  const [messages, setMessages] = useState(INIT_MSGS);
  const parentNotifs = events.filter(e=>e.to==="parent").length;
  const TABS=[{k:"home",l:"Início",ic:Home},{k:"agenda",l:"Agenda",ic:Calendar},{k:"mensagens",l:"Mensagens",ic:MessageSquare},{k:"financeiro",l:"Financeiro",ic:DollarSign},{k:"filho",l:"Sofia",ic:GraduationCap}];
  return (
    <div className="flex items-start justify-center py-6" style={{background:"#e8edf5",minHeight:"100%"}}>
      <div style={{width:375,background:C.bg,borderRadius:40,boxShadow:"0 32px 72px rgba(3,37,76,0.25),0 2px 8px rgba(0,0,0,0.12)",overflow:"hidden",border:"10px solid #181830"}}>
        <div style={{background:"#181830",height:30,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:80,height:6,background:"#2a2a40",borderRadius:99}}/>
        </div>
        <div style={{maxHeight:520,overflowY:"auto"}}>
          {tab==="home"&&<ParentHomeScreen events={events}/>}
          {tab==="agenda"&&<ParentAgendaScreen/>}
          {tab==="mensagens"&&<ParentMensagensScreen messages={messages} setMessages={setMessages} emit={emit}/>}
          {tab==="financeiro"&&<ParentFinanceiroScreen emit={emit}/>}
          {tab==="filho"&&<ParentFilhoScreen/>}
        </div>
        {/* Bottom nav */}
        <div style={{background:"#fff",borderTop:"1px solid #f0f0f0",padding:"8px 4px 10px",display:"flex"}}>
          {TABS.map(({k,l,ic:Ic})=>{
            const isAct=tab===k; const notif=(k==="mensagens"&&parentNotifs>0)||(k==="home"&&parentNotifs>0);
            return (
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",position:"relative"}}>
                {notif&&<span style={{position:"absolute",top:2,right:"50%",transform:"translateX(10px)",width:7,height:7,background:C.teal,borderRadius:"50%"}}/>}
                <div style={{padding:"5px 14px",borderRadius:12,background:isAct?C.tealBg:"transparent"}}>
                  <Ic size={19} color={isAct?C.tealD:"#9ca3af"}/>
                </div>
                <span style={{fontSize:9,fontWeight:700,color:isAct?C.tealD:"#9ca3af"}}>{l}</span>
              </button>
            );
          })}
        </div>
        <div style={{background:"#181830",height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:100,height:4,background:"#2a2a40",borderRadius:99}}/>
        </div>
      </div>
    </div>
  );
}

// ─── PORTAL 3: STUDENT PORTAL ──────────────────────────────────────────────

const STUDENT_WEB_NAV = [
  { k:"dashboard", l:"Dashboard",     ic:LayoutDashboard },
  { k:"lms",       l:"Aulas & Vídeos",ic:Video           },
  { k:"trilha",    l:"Trilha do Conhecimento", ic:Map    },
  { k:"boletim",   l:"Boletim",       ic:BarChart2       },
  { k:"simulado",  l:"Simulado",      ic:FileText        },
  { k:"carteirinha",l:"Carteirinha",  ic:QrCode          },
];

function StudentSidebar({ section, setSection, notif }) {
  return (
    <aside className="flex flex-col flex-shrink-0" style={{width:228,background:C.navy,minHeight:"100%"}}>
      <div className="px-5 py-5" style={{borderBottom:"1px solid rgba(255,255,255,0.09)"}}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:C.teal}}>
            <Sparkles size={17} style={{color:C.navy}}/>
          </div>
          <div><p className="text-white font-extrabold text-base leading-tight">Student Hub</p><p className="font-bold text-xs" style={{color:C.teal}}>Dilon Edu · 2025</p></div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"12px 14px"}}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{width:38,height:38,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:C.navy}}>SO</div>
            <div><p className="text-white font-bold text-sm">Sofia Oliveira</p><p className="text-xs" style={{color:"rgba(255,255,255,0.45)"}}>Nível 7 · Exploradora</p></div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,height:6}}>
            <div style={{width:"82%",height:"100%",background:C.teal,borderRadius:99}}/>
          </div>
          <div className="flex justify-between mt-1">
            <span style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>1.240 XP</span>
            <span style={{fontSize:9,color:C.teal,fontWeight:700}}>1.500 XP</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-0.5">
        <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.28)"}}>Módulos</p>
        {STUDENT_WEB_NAV.map(item=>(
          <button key={item.k} onClick={()=>setSection(item.k)}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={section===item.k?{background:C.teal,color:C.navy}:{color:"rgba(255,255,255,0.55)"}}>
            <div className="flex items-center gap-3"><item.ic size={14}/>{item.l}</div>
            {item.k==="boletim"&&notif>0&&<span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" style={{background:C.teal,color:C.navy}}>{notif}</span>}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4" style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div className="flex items-center gap-3 px-2">
          <Av i="SO" s={30} bg={C.teal}/>
          <div className="flex-1 min-w-0"><p className="text-white text-xs font-semibold">sofia.oliveira@aluno.com</p></div>
          <LogOut size={13} style={{color:"rgba(255,255,255,0.28)"}}/>
        </div>
      </div>
    </aside>
  );
}

function StudentDashboardView({ events }) {
  const newNotifs = events.filter(e=>e.to==="student");
  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Olá, Sofia! 👋</h1><p className="text-sm text-gray-500 mt-0.5">Quinta-feira, 23 de Maio de 2025</p></div>
        <TBadge><Trophy size={12}/> 3 conquistas desbloqueadas</TBadge>
      </div>
      {newNotifs.length>0&&(
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6" style={{borderLeft:`4px solid ${C.teal}`}}>
          <p className="font-bold text-sm mb-2" style={{color:C.navy}}>🔔 Notificações</p>
          {newNotifs.map((e,i)=><p key={i} className="text-sm text-gray-600 mb-1">• {e.msg} <span className="text-xs text-gray-400">({e.ts})</span></p>)}
        </div>
      )}
      <div className="grid grid-cols-4 gap-5 mb-7">
        {[{l:"Frequência",v:"96,2%",sub:"3 faltas no ano",c:"text-green-600",ic:UserCheck},{l:"Média Geral",v:"8,7",sub:"Excelente ✨",c:"text-blue-600",ic:Star},{l:"XP Total",v:"1.240",sub:"+80 esta semana",c:"",ic:Zap},{l:"Posição",v:"4º",sub:"na turma 7º A",c:"",ic:Medal}].map(({l,v,sub,c,ic:Ic})=>(
          <div key={l} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2"><Ic size={15} className="text-gray-400"/></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{l}</p>
            <p className={`text-2xl font-black ${c}`} style={!c?{color:C.navy}:{}}>{v}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <p className="font-bold text-sm mb-4" style={{color:C.navy}}>Aulas de Hoje</p>
          {AGENDA_EVENTS.filter(e=>e.date==="Hoje").map((ev,i)=>(
            <div key={i} className="flex items-center gap-4 mb-3 p-3 rounded-xl" style={{background:C.bg}}>
              <div className="w-12 text-center"><p className="text-xs font-bold text-gray-400">{ev.time}</p></div>
              <div className="w-1 h-8 rounded-full" style={{background:ev.color}}/>
              <div className="flex-1"><p className="text-sm font-bold" style={{color:C.navy}}>{ev.title}</p><p className="text-xs text-gray-400">{ev.teacher}</p></div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{background:ev.type==="Prova"?C.redBg:C.blueBg,color:ev.type==="Prova"?C.red:C.blue}}>{ev.type}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="font-bold text-sm mb-4" style={{color:C.navy}}>Conquistas</p>
          {BADGES_SOFIA.filter(b=>b.earned).map((b,i)=>(
            <div key={i} className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{background:b.color,border:`1.5px solid ${b.border}`}}>
              <span className="text-xl">{b.icon}</span>
              <div><p className="text-xs font-bold" style={{color:C.navy}}>{b.title}</p><p className="text-xs text-gray-500">{b.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentLMSView() {
  const [openMods, setOpenMods] = useState({1:true});
  const [activeL, setActiveL] = useState(3);
  const lesson = MODULES.flatMap(m=>m.lessons).find(l=>l.id===activeL);
  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Aulas & Conteúdo</h1><p className="text-sm text-gray-500">Matemática · Prof. Ricardo Alves</p></div>
        <TBadge><BookMarked size={11}/> 2 / 9 concluídas</TBadge>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center" style={{aspectRatio:"16/9"}}>
            <div className="text-center">
              <button className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform" style={{background:C.teal}}>
                <Play size={26} fill={C.navy} style={{color:C.navy,marginLeft:3}}/>
              </button>
              <p className="text-gray-400 text-sm mt-3 font-medium">{lesson?.title}</p>
              <p className="text-gray-600 text-xs mt-1">{lesson?.dur}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="font-bold text-lg" style={{color:C.navy}}>{lesson?.title}</h2><p className="text-sm text-gray-400 mt-1">Módulo 1 · Funções Matemáticas</p></div>
              <TBadge><Activity size={11}/> Em andamento</TBadge>
            </div>
            <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100 leading-relaxed">Aprenda a resolver equações de 2º grau usando a fórmula de Bhaskara, identificar coeficientes a, b e c, e interpretar o discriminante Δ para determinar o número de raízes reais.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm" style={{color:C.navy}}>Conteúdo do Curso</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{width:"22%",background:C.teal}}/></div>
              <span className="text-xs text-gray-400 flex-shrink-0">2/9</span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1" style={{maxHeight:380}}>
            {MODULES.map(m=>(
              <div key={m.id}>
                <button onClick={()=>setOpenMods(p=>({...p,[m.id]:!p[m.id]}))}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100 transition-colors hover:bg-gray-100">
                  <span className="text-xs font-bold text-gray-600 text-left">{m.title}</span>
                  <ChevronDown size={12} className="text-gray-400" style={{transform:openMods[m.id]?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
                </button>
                {openMods[m.id]&&m.lessons.map(l=>(
                  <button key={l.id} onClick={()=>setActiveL(l.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left border-b border-gray-50 transition-colors"
                    style={activeL===l.id?{background:C.tealBg}:{}}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:l.done?C.greenBg:activeL===l.id?C.teal:"#f3f4f6"}}>
                      {l.done?<Check size={10} className="text-green-600"/>:<Play size={8} fill={activeL===l.id?C.navy:"#9ca3af"} style={{color:activeL===l.id?C.navy:"#9ca3af",marginLeft:1}}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{color:activeL===l.id?C.navy:l.done?"#9ca3af":"#374151"}}>{l.title}</p>
                      <p className="text-xs text-gray-400">{l.dur}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentTrilhaView() {
  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Trilha do Conhecimento</h1><p className="text-sm text-gray-500">Matemática · Progresso atual</p></div>
        <TBadge><Flame size={11}/> 3 nós concluídos</TBadge>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-0 overflow-x-auto">
          {KNOWLEDGE_TRAIL.map((node,i)=>(
            <div key={node.id} className="flex items-center">
              <div className="flex flex-col items-center" style={{minWidth:100}}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-all" style={node.status==="done"?{background:C.tealBg,border:`2px solid ${C.teal}`}:node.status==="active"?{background:C.navy,border:`3px solid ${C.teal}`,boxShadow:`0 0 0 4px ${C.tealBg}`}:{background:"#f3f4f6",border:"2px solid #e5e7eb",opacity:0.5}}>
                  {node.status==="locked"?<Lock size={20} color="#9ca3af"/>:<span>{node.icon}</span>}
                </div>
                <p className="text-xs font-bold text-center leading-tight" style={{color:node.status==="done"?C.tealD:node.status==="active"?C.navy:"#9ca3af"}}>{node.title}</p>
                <p className="text-xs mt-1 font-medium" style={{color:node.status==="done"?C.tealD:node.status==="active"?C.teal:"#d1d5db"}}>+{node.xp} XP</p>
                {node.status==="done"&&<span className="mt-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{background:C.greenBg,color:C.green}}>✓</span>}
                {node.status==="active"&&<span className="mt-1 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse" style={{background:C.teal,color:C.navy}}>Atual</span>}
              </div>
              {i<KNOWLEDGE_TRAIL.length-1&&(
                <div className="flex-shrink-0 mx-1" style={{width:32,height:2,background:i<3?C.teal:"#e5e7eb"}}/>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-5">
        <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">XP Acumulado</p><p className="text-3xl font-black" style={{color:C.navy}}>1.240</p></div>
        <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Nós Concluídos</p><p className="text-3xl font-black text-green-600">3/8</p></div>
        <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Próximo Nível</p><p className="text-3xl font-black" style={{color:C.tealD}}>260 XP</p></div>
      </div>
    </div>
  );
}

function StudentBoletimView({ events }) {
  const notifs = events.filter(e=>e.to==="student"&&e.type==="nota");
  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex items-center justify-between mb-7">
        <div><h1 className="text-2xl font-bold" style={{color:C.navy}}>Boletim Escolar</h1><p className="text-sm text-gray-500">7º Ano A · Ano Letivo 2025</p></div>
        <TBadge><Star size={11}/> Média: 8,7</TBadge>
      </div>
      {notifs.length>0&&<div className="bg-white rounded-xl p-4 mb-6 shadow-sm" style={{borderLeft:`4px solid ${C.teal}`}}><p className="text-sm font-semibold" style={{color:C.navy}}>🔔 Novas notas disponíveis!</p></div>}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-7 gap-4">
          <div className="col-span-2"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Disciplina</p></div>
          {["AV1","AV2","AV3","AV4","Média"].map(h=><div key={h} className="text-center"><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</p></div>)}
        </div>
        {GRADES_SOFIA.map((g,i)=>{
          const avg=g.av1&&g.av2?((g.av1+g.av2)/2).toFixed(1):g.av1?g.av1:null;
          return (
            <div key={i} className={`px-6 py-4 grid grid-cols-7 gap-4 items-center ${i<GRADES_SOFIA.length-1?"border-b border-gray-50":""} hover:bg-gray-50`}>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:g.color}}/>
                <div><p className="text-sm font-semibold" style={{color:C.navy}}>{g.s}</p><p className="text-xs text-gray-400">{g.t}</p></div>
              </div>
              {[g.av1,g.av2,null,null].map((v,j)=>(
                <div key={j} className="text-center">
                  {v!=null?<span className={`text-sm font-bold ${v>=7?"text-green-600":v>=5?"text-amber-500":"text-red-500"}`}>{v}</span>:<span className="text-xs text-gray-200">—</span>}
                </div>
              ))}
              <div className="text-center">
                <span className={`text-base font-black ${avg&&parseFloat(avg)>=7?"text-green-600":avg&&parseFloat(avg)>=5?"text-amber-500":avg?"text-red-500":"text-gray-200"}`}>{avg||"—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentSimuladoView() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(900);
  const timerRef = useRef();

  useEffect(()=>{
    if(submitted) return;
    timerRef.current = setInterval(()=>setTime(p=>{if(p<=1){setSubmitted(true);return 0;}return p-1;}),1000);
    return ()=>clearInterval(timerRef.current);
  },[submitted]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const answered=answers.filter(a=>a!==null).length;
  const score=submitted?answers.reduce((a,ans,i)=>a+(ans===QUESTIONS[i].ans?1:0),0):0;
  const q=QUESTIONS[cur];

  if(submitted) return (
    <div className="p-7 flex items-center justify-center" style={{background:C.bg,minHeight:"100%"}}>
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md">
        <div className="text-5xl mb-4">{score>=7?"🏆":score>=5?"📘":"📖"}</div>
        <h2 className="text-2xl font-bold mb-1" style={{color:C.navy}}>Simulado Concluído!</h2>
        <p className="text-gray-400 mb-6">10 questões · ENEM Simulado</p>
        <p className="text-7xl font-black mb-2" style={{color:C.navy}}>{score}<span className="text-2xl text-gray-200">/10</span></p>
        <p className="text-gray-500 mb-8">{score>=7?"Excelente! Continue assim 🎉":score>=5?"Bom resultado! Revise os pontos fracos.":"Continue estudando!"}</p>
        <div className="grid grid-cols-10 gap-1.5 mb-8">
          {QUESTIONS.map((_,i)=>(
            <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold"
              style={{background:answers[i]===QUESTIONS[i].ans?C.greenBg:C.redBg,color:answers[i]===QUESTIONS[i].ans?C.green:C.red}}>{i+1}</div>
          ))}
        </div>
        <button onClick={()=>{setAnswers(Array(10).fill(null));setCur(0);setTime(900);setSubmitted(false);}} className="px-8 py-3 rounded-xl text-sm font-bold text-white" style={{background:C.navy}}>Tentar Novamente</button>
      </div>
    </div>
  );

  return (
    <div className="p-7" style={{background:C.bg,minHeight:"100%"}}>
      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={17} className={time<120?"text-red-500":"text-gray-400"}/>
              <span className={`font-mono text-xl font-bold ${time<120?"text-red-500":""}`} style={time>=120?{color:C.navy}:{}}>{fmt(time)}</span>
              {time<120&&<span className="text-xs text-red-500 font-bold animate-pulse">⚠ Tempo!</span>}
            </div>
            <div className="flex items-center gap-5 text-sm">
              <span className="text-gray-400"><span className="font-bold text-green-600">{answered}</span> resp.</span>
              <span className="text-gray-400"><span className="font-bold text-gray-500">{10-answered}</span> pend.</span>
              <button onClick={()=>setSubmitted(true)} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{background:C.navy}}>Finalizar</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-7 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <TBadge>{q.s}</TBadge>
              <span className="text-xs text-gray-400">Questão {cur+1} de 10</span>
            </div>
            <p className="text-base font-semibold leading-relaxed mb-7" style={{color:C.navy}}>{q.q}</p>
            <div className="space-y-3">
              {q.opts.map((opt,i)=>{
                const sel=answers[cur]===i;
                return (
                  <button key={i} onClick={()=>{const a=[...answers];a[cur]=i;setAnswers(a);}}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
                    style={sel?{borderColor:C.navy,background:`${C.navy}0a`}:{borderColor:"#f3f4f6",background:"#fafafa"}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={sel?{background:C.navy,color:"#fff"}:{background:"#f3f4f6",color:"#9ca3af"}}>
                      {String.fromCharCode(65+i)}
                    </div>
                    <span className="text-sm font-medium" style={{color:sel?C.navy:"#374151"}}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-7 pt-5 border-t border-gray-100">
              <button onClick={()=>setCur(q=>Math.max(0,q-1))} disabled={cur===0} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 disabled:opacity-30">
                <ChevronLeft size={14}/> Anterior
              </button>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_,i)=>(
                  <button key={i} onClick={()=>setCur(i)} className="w-7 h-7 rounded-lg text-xs font-bold"
                    style={cur===i?{background:C.navy,color:"#fff"}:answers[i]!==null?{background:C.tealBg,color:C.tealD}:{background:"#f3f4f6",color:"#9ca3af"}}>{i+1}</button>
                ))}
              </div>
              <button onClick={()=>setCur(q=>Math.min(9,q+1))} disabled={cur===9} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-30" style={{background:C.navy}}>
                Próxima <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        </div>
        <div className="w-52 flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-100"><h3 className="font-bold text-sm" style={{color:C.navy}}>Mapa</h3><p className="text-xs text-gray-400">{answered}/10 resp.</p></div>
            <div className="p-4 grid grid-cols-5 gap-2">
              {QUESTIONS.map((_,i)=>(
                <button key={i} onClick={()=>setCur(i)} className="aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all"
                  style={cur===i?{background:C.navy,color:"#fff"}:answers[i]!==null?{background:"#22c55e",color:"#fff"}:{background:"#f3f4f6",color:"#9ca3af"}}>{i+1}</button>
              ))}
            </div>
          </div>
          <button onClick={()=>setSubmitted(true)} className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{background:answered===10?"#22c55e":C.navy}}>
            {answered===10?"✓ Entregar Prova":`Finalizar (${answered}/10)`}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentCarteirinhaView() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="p-7 flex flex-col items-center justify-start" style={{background:C.bg,minHeight:"100%"}}>
      <div className="mb-7 text-center"><h1 className="text-2xl font-bold" style={{color:C.navy}}>Carteirinha Digital</h1><p className="text-sm text-gray-500">Toque no cartão para virar</p></div>
      <div style={{perspective:1200,width:380,height:220,cursor:"pointer",marginBottom:32}} onClick={()=>setFlipped(!flipped)}>
        <div style={{position:"relative",width:"100%",height:"100%",transition:"transform 0.6s",transformStyle:"preserve-3d",transform:flipped?"rotateY(180deg)":"none"}}>
          <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:24,padding:"24px 28px",boxShadow:"0 16px 48px rgba(3,37,76,0.3)",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,top:-20,width:130,height:130,borderRadius:"50%",background:"rgba(0,245,212,0.05)"}}/>
            <div style={{position:"absolute",right:24,bottom:-30,width:90,height:90,borderRadius:"50%",background:"rgba(0,245,212,0.08)"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <p style={{color:C.teal,fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>Dilon Edu · Carteirinha Digital</p>
                <p style={{color:"#fff",fontSize:18,fontWeight:800}}>Sofia Oliveira</p>
                <p style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginTop:2}}>7º Ano A · Matrícula: 2025-1247</p>
              </div>
              <GraduationCap size={30} color={C.teal}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div><p style={{color:"rgba(255,255,255,0.35)",fontSize:8,fontWeight:600,marginBottom:2}}>VÁLIDO ATÉ</p><p style={{color:"#fff",fontSize:13,fontWeight:600}}>12/2025</p></div>
              <div style={{textAlign:"right"}}><p style={{color:"rgba(255,255,255,0.35)",fontSize:8,fontWeight:600,marginBottom:2}}>UNIDADE</p><p style={{color:"#fff",fontSize:12,fontWeight:600}}>Laranjeiras</p></div>
              <div style={{background:"#fff",borderRadius:10,padding:8,display:"flex",alignItems:"center",justifyContent:"center"}}><QrCode size={40} color={C.navy}/></div>
            </div>
          </div>
          <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",background:"#fff",borderRadius:24,padding:"24px 28px",boxShadow:"0 16px 48px rgba(3,37,76,0.15)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <QrCode size={110} color={C.navy}/>
            <p style={{fontSize:14,fontWeight:700,color:C.navy,marginTop:14}}>QR Code de Acesso</p>
            <p style={{fontSize:11,color:"#9ca3af",marginTop:4}}>Sofia Oliveira · Mat. 2025-1247</p>
            <div style={{marginTop:10,background:C.tealBg,color:C.tealD,borderRadius:99,fontSize:11,fontWeight:700,padding:"4px 12px",display:"flex",alignItems:"center",gap:4}}><Wifi size={11}/> Sincronizado</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {[{l:"Matrícula",v:"2025-1247"},{l:"Turma",v:"7º Ano A"},{l:"Válidade",v:"12/2025"},{l:"Status",v:"✓ Ativa"}].map(({l,v})=>(
          <div key={l} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{l}</p>
            <p className="font-bold" style={{color:C.navy}}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentWebPortal({ events, emit }) {
  const [section, setSection] = useState("dashboard");
  const notif = events.filter(e=>e.to==="student"&&e.type==="nota").length;
  return (
    <div className="flex" style={{height:"100%"}}>
      <StudentSidebar section={section} setSection={setSection} notif={notif}/>
      <main className="flex-1 overflow-y-auto">
        {section==="dashboard"&&<StudentDashboardView events={events}/>}
        {section==="lms"&&<StudentLMSView/>}
        {section==="trilha"&&<StudentTrilhaView/>}
        {section==="boletim"&&<StudentBoletimView events={events}/>}
        {section==="simulado"&&<StudentSimuladoView/>}
        {section==="carteirinha"&&<StudentCarteirinhaView/>}
      </main>
    </div>
  );
}

function StudentAppPortal({ events }) {
  const [tab, setTab] = useState("inicio");
  const notif = events.filter(e=>e.to==="student").length;
  const TABS=[{k:"inicio",l:"Início",ic:Home},{k:"aulas",l:"Aulas",ic:Video},{k:"notas",l:"Notas",ic:BarChart2},{k:"simulado",l:"Simulado",ic:FileText},{k:"perfil",l:"Perfil",ic:GraduationCap}];
  return (
    <div className="flex items-start justify-center py-6" style={{background:"#e8edf5",minHeight:"100%"}}>
      <div style={{width:375,background:C.bg,borderRadius:40,boxShadow:"0 32px 72px rgba(3,37,76,0.25)",overflow:"hidden",border:"10px solid #181830"}}>
        <div style={{background:"#181830",height:30,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:80,height:6,background:"#2a2a40",borderRadius:99}}/></div>
        <div style={{maxHeight:520,overflowY:"auto"}}>
          {/* Simple mobile views */}
          {tab==="inicio"&&(
            <div>
              <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,padding:"18px 18px 24px"}}>
                <p style={{color:C.teal,fontSize:10,fontWeight:700,letterSpacing:"1.5px",marginBottom:2}}>STUDENT HUB</p>
                <p style={{color:"#fff",fontSize:18,fontWeight:800,marginBottom:14}}>Olá, Sofia! 👋</p>
                <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700}}>NÍVEL 7 · EXPLORADORA</span>
                    <span style={{color:C.teal,fontSize:10,fontWeight:700}}>1.240/1.500 XP</span>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.15)",borderRadius:99,height:7}}>
                    <div style={{width:"82%",height:"100%",background:C.teal,borderRadius:99}}/>
                  </div>
                </div>
              </div>
              <div style={{padding:"14px"}}>
                {notif>0&&<div style={{background:C.tealBg,borderRadius:12,padding:"10px 14px",marginBottom:10,borderLeft:`3px solid ${C.teal}`}}><p style={{fontSize:12,fontWeight:700,color:C.navy}}>🔔 {notif} nova(s) notificação(ões) do professor</p></div>}
                <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8}}>Aulas de Hoje</p>
                {AGENDA_EVENTS.filter(e=>e.date==="Hoje").map((ev,i)=>(
                  <div key={i} style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:4,height:36,borderRadius:99,background:ev.color,flexShrink:0}}/>
                    <div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:C.navy}}>{ev.title}</p><p style={{fontSize:10,color:"#9ca3af"}}>{ev.time} · {ev.teacher}</p></div>
                    <span style={{fontSize:9,fontWeight:700,padding:"3px 7px",borderRadius:99,background:ev.type==="Prova"?C.redBg:C.blueBg,color:ev.type==="Prova"?C.red:C.blue}}>{ev.type}</span>
                  </div>
                ))}
                <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:8,marginTop:14}}>Conquistas Recentes</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {BADGES_SOFIA.filter(b=>b.earned).map((b,i)=>(
                    <div key={i} style={{background:b.color,borderRadius:14,padding:"12px",textAlign:"center",border:`1.5px solid ${b.border}`}}>
                      <span style={{fontSize:24}}>{b.icon}</span>
                      <p style={{fontSize:11,fontWeight:700,color:C.navy,marginTop:4,lineHeight:1.2}}>{b.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab==="aulas"&&(
            <div style={{padding:"14px"}}>
              <div style={{background:C.navy,padding:"16px",borderRadius:16,marginBottom:14}}>
                <div style={{aspectRatio:"16/9",background:"rgba(0,0,0,0.4)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <button style={{width:48,height:48,borderRadius:"50%",background:C.teal,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Play size={20} fill={C.navy} style={{color:C.navy}}/></button>
                </div>
                <p style={{color:"rgba(255,255,255,0.7)",fontSize:10,marginTop:8}}>Módulo 1 · Aula 3</p>
                <p style={{color:"#fff",fontWeight:700,fontSize:13}}>Funções de 2º Grau</p>
              </div>
              {MODULES.map(m=>(
                <div key={m.id} style={{background:"#fff",borderRadius:12,marginBottom:8,overflow:"hidden",boxShadow:"0 1px 4px rgba(3,37,76,0.06)"}}>
                  <div style={{background:"#f8fafc",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.navy,flex:1}}>{m.title}</p>
                    <span style={{fontSize:9,color:C.tealD,fontWeight:700}}>{m.done}/{m.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab==="notas"&&(
            <div style={{padding:"14px"}}>
              <p style={{fontWeight:700,color:C.navy,fontSize:14,marginBottom:10}}>Boletim · 7º Ano A</p>
              {GRADES_SOFIA.map((g,i)=>{
                const avg=g.av1&&g.av2?((g.av1+g.av2)/2).toFixed(1):g.av1||"—";
                return (
                  <div key={i} style={{background:"#fff",borderRadius:12,padding:"12px 14px",marginBottom:6,boxShadow:"0 1px 4px rgba(3,37,76,0.06)",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:g.color,flexShrink:0}}/>
                    <div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:C.navy}}>{g.s}</p><p style={{fontSize:9,color:"#9ca3af"}}>{g.t}</p></div>
                    <p style={{fontSize:16,fontWeight:800,color:parseFloat(avg)>=7?C.green:parseFloat(avg)>=5?C.amber:C.red}}>{avg}</p>
                  </div>
                );
              })}
            </div>
          )}
          {tab==="simulado"&&(
            <div style={{padding:"14px"}}>
              <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:20,padding:"20px",textAlign:"center",marginBottom:14}}>
                <p style={{color:C.teal,fontSize:11,fontWeight:700,marginBottom:6}}>SIMULADO ENEM</p>
                <p style={{color:"#fff",fontSize:22,fontWeight:800,marginBottom:4}}>10 Questões</p>
                <p style={{color:"rgba(255,255,255,0.55)",fontSize:11,marginBottom:16}}>Tempo: 15 minutos · 8 matérias</p>
                <button style={{background:C.teal,color:C.navy,border:"none",borderRadius:12,padding:"13px",width:"100%",fontSize:14,fontWeight:800,cursor:"pointer"}}>Iniciar Simulado</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{s:"Matemática",q:2},{s:"Português",q:2},{s:"História",q:2},{s:"Ciências",q:4}].map((m,i)=>(
                  <div key={i} style={{background:"#fff",borderRadius:12,padding:"12px",boxShadow:"0 1px 4px rgba(3,37,76,0.06)"}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.navy}}>{m.s}</p>
                    <p style={{fontSize:9,color:"#9ca3af",marginTop:2}}>{m.q} questões</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==="perfil"&&(
            <div style={{padding:"14px"}}>
              <div style={{background:"#fff",borderRadius:16,padding:"20px",textAlign:"center",marginBottom:14,boxShadow:"0 2px 8px rgba(3,37,76,0.07)"}}>
                <div style={{width:60,height:60,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22,color:C.navy,margin:"0 auto 10px"}}>SO</div>
                <p style={{fontWeight:800,color:C.navy,fontSize:16}}>Sofia Oliveira</p>
                <p style={{color:"#9ca3af",fontSize:11}}>7º Ano A · Matrícula 2025-1247</p>
                <div style={{marginTop:10,display:"inline-flex",gap:6}}>
                  {BADGES_SOFIA.filter(b=>b.earned).map((b,i)=><span key={i} style={{fontSize:16}}>{b.icon}</span>)}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:16,padding:"16px",boxShadow:"0 2px 8px rgba(3,37,76,0.07)"}}>
                <p style={{fontWeight:700,color:C.navy,fontSize:13,marginBottom:10}}>Minha Carteirinha</p>
                <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,borderRadius:14,padding:"16px",textAlign:"center"}}>
                  <div style={{background:"#fff",borderRadius:8,padding:8,width:64,height:64,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center"}}><QrCode size={48} color={C.navy}/></div>
                  <p style={{color:"#fff",fontWeight:700,fontSize:12}}>Sofia Oliveira</p>
                  <p style={{color:"rgba(255,255,255,0.5)",fontSize:10}}>Válido até 12/2025</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{background:"#fff",borderTop:"1px solid #f0f0f0",padding:"8px 4px 10px",display:"flex"}}>
          {TABS.map(({k,l,ic:Ic})=>{
            const isAct=tab===k; const hasN=k==="inicio"&&notif>0;
            return (
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",position:"relative"}}>
                {hasN&&<span style={{position:"absolute",top:2,right:"50%",transform:"translateX(10px)",width:7,height:7,background:C.teal,borderRadius:"50%"}}/>}
                <div style={{padding:"5px 12px",borderRadius:12,background:isAct?C.tealBg:"transparent"}}><Ic size={18} color={isAct?C.tealD:"#9ca3af"}/></div>
                <span style={{fontSize:8,fontWeight:700,color:isAct?C.tealD:"#9ca3af"}}>{l}</span>
              </button>
            );
          })}
        </div>
        <div style={{background:"#181830",height:22,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:100,height:4,background:"#2a2a40",borderRadius:99}}/></div>
      </div>
    </div>
  );
}

function StudentPortal({ events, emit }) {
  const [mode, setMode] = useState("web");
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div className="flex items-center justify-center gap-2 py-3 flex-shrink-0" style={{background:C.bg,borderBottom:"1px solid #e5e7eb"}}>
        <p className="text-xs font-bold text-gray-400 mr-2">Modo de visualização:</p>
        {[{k:"web",l:"Web",ic:Monitor},{k:"app",l:"App Mobile",ic:Smartphone}].map(({k,l,ic:Ic})=>(
          <button key={k} onClick={()=>setMode(k)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={mode===k?{background:C.navy,color:"#fff"}:{background:"#fff",color:"#9ca3af",border:"1px solid #e5e7eb"}}>
            <Ic size={14}/>{l}
          </button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden"}}>
        {mode==="web"&&<StudentWebPortal events={events} emit={emit}/>}
        {mode==="app"&&<StudentAppPortal events={events}/>}
      </div>
    </div>
  );
}

// ─── PORTAL SELECTOR & LIVE TICKER ─────────────────────────────────────────

const PORTALS = [
  { k:"admin",   l:"Gestão Web",      sub:"Diretoria · Secretaria · Professor", ic:Monitor,    color:C.navy  },
  { k:"parent",  l:"App dos Pais",     sub:"Agenda · Financeiro · Mensagens",    ic:Smartphone, color:"#6366f1"},
  { k:"student", l:"Portal do Aluno",  sub:"LMS · Trilha · Simulado · QR Card",  ic:GraduationCap,color:C.tealD },
];

function PortalSelector({ portal, setPortal, events }) {
  const notifParent  = events.filter(e=>e.to==="parent").length;
  const notifAdmin   = events.filter(e=>e.to==="admin").length;
  const notifStudent = events.filter(e=>e.to==="student").length;
  const notifs = { admin:notifAdmin, parent:notifParent, student:notifStudent };

  return (
    <div style={{background:C.navy,padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{background:C.teal,borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <GraduationCap size={16} style={{color:C.navy}}/>
          </div>
          <div><p style={{color:"#fff",fontWeight:800,fontSize:16,lineHeight:1}}>Dilon Edu</p><p style={{color:C.teal,fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>Ecossistema Integrado · Demo</p></div>
        </div>
        <div className="flex items-center gap-2">
          {PORTALS.map(p=>{
            const n = notifs[p.k]||0;
            return (
              <button key={p.k} onClick={()=>setPortal(p.k)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={portal===p.k?{background:C.teal,color:C.navy}:{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.65)"}}>
                <p.ic size={14}/>
                {p.l}
                {n>0&&<span style={{background:C.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,padding:"1px 5px"}}>{n}</span>}
              </button>
            );
          })}
        </div>
      </div>
      {events.length>0&&(
        <div style={{marginTop:8,background:"rgba(0,245,212,0.06)",borderRadius:10,padding:"6px 14px",display:"flex",alignItems:"center",gap:10,overflow:"hidden"}}>
          <span style={{fontSize:9,fontWeight:800,color:C.teal,letterSpacing:"1px",flexShrink:0}}>LIVE</span>
          <span style={{color:"rgba(255,255,255,0.5)",fontSize:9,flexShrink:0}}>•</span>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            <span style={{color:C.teal,fontWeight:600}}>{events[0].from}</span> → {events[0].msg}
            <span style={{color:"rgba(255,255,255,0.3)",marginLeft:8}}>{events[0].ts}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export default function DilonEduPlatform() {
  const [portal, setPortal] = useState("admin");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const emit = (type, msg, from, to) => {
    const ts = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    setEvents(p=>[{id:Date.now(),type,msg,from,to,ts},...p.slice(0,19)]);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <PortalSelector portal={portal} setPortal={setPortal} events={events}/>
      <div style={{flex:1,overflow:"hidden"}}>
        {portal==="admin"&&<AdminPortal events={events} emit={emit}/>}
        {portal==="parent"&&<ParentApp events={events} emit={emit}/>}
        {portal==="student"&&<StudentPortal events={events} emit={emit}/>}
      </div>
    </div>
  );
}