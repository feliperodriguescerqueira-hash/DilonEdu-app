import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, GraduationCap, BookOpen, Users, Bell, Search,
  ChevronDown, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  DollarSign, UserPlus, BarChart2, Send, Play, Lock, Star,
  ChevronRight, ChevronLeft, Clock, MoreHorizontal, Filter,
  Download, RefreshCw, Layers, Target, Award, Activity,
  MessageSquare, LogOut, Settings, HelpCircle, Menu, X,
  Check, Minus, PlayCircle, PauseCircle, Volume2, Maximize,
  FileText, Zap, Shield, BookMarked, ListChecks, PenLine,
  CalendarDays, Eye, ArrowUpRight, Sparkles, Flame, Circle,
} from "lucide-react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const NAVY = "#03254C";
const TEAL = "#00F5D4";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const students = [
  { id: 1,  name: "Sophia Oliveira",     turma: "9º A", resp: "Ana Oliveira",     value: 1350, status: "PAGO",      daysLate: 0,  photo: "SO", email: "sophia.o@dilon.edu" },
  { id: 2,  name: "Lucas Ferreira",      turma: "9º A", resp: "Paulo Ferreira",   value: 1350, status: "PENDENTE",  daysLate: 8,  photo: "LF", email: "lucas.f@dilon.edu" },
  { id: 3,  name: "Mariana Costa",       turma: "8º B", resp: "Cláudia Costa",    value: 1200, status: "PAGO",      daysLate: 0,  photo: "MC", email: "mariana.c@dilon.edu" },
  { id: 4,  name: "Rafael Monteiro",     turma: "7º A", resp: "Jorge Monteiro",   value: 950,  status: "VENCIDA",   daysLate: 22, photo: "RM", email: "rafael.m@dilon.edu" },
  { id: 5,  name: "Isabela Rodrigues",   turma: "9º B", resp: "Fátima Rodrigues", value: 1350, status: "PAGO",      daysLate: 0,  photo: "IR", email: "isabela.r@dilon.edu" },
  { id: 6,  name: "Gabriel Santos",      turma: "8º A", resp: "Roberto Santos",   value: 1200, status: "PENDENTE",  daysLate: 3,  photo: "GS", email: "gabriel.s@dilon.edu" },
  { id: 7,  name: "Valentina Alves",     turma: "6º A", resp: "Sandra Alves",     value: 950,  status: "PAGO",      daysLate: 0,  photo: "VA", email: "valentina.a@dilon.edu" },
  { id: 8,  name: "Mateus Carvalho",     turma: "7º B", resp: "Ricardo Carvalho", value: 950,  status: "VENCIDA",   daysLate: 15, photo: "MC", email: "mateus.c@dilon.edu" },
  { id: 9,  name: "Beatriz Lima",        turma: "6º B", resp: "Marcos Lima",      value: 950,  status: "PAGO",      daysLate: 0,  photo: "BL", email: "beatriz.l@dilon.edu" },
  { id: 10, name: "Pedro Nascimento",    turma: "8º B", resp: "Júlia Nascimento", value: 1200, status: "PENDENTE",  daysLate: 1,  photo: "PN", email: "pedro.n@dilon.edu" },
  { id: 11, name: "Alice Barbosa",       turma: "9º A", resp: "Tiago Barbosa",    value: 1350, status: "PAGO",      daysLate: 0,  photo: "AB", email: "alice.b@dilon.edu" },
  { id: 12, name: "Henrique Melo",       turma: "7º A", resp: "Denise Melo",      value: 950,  status: "VENCIDA",   daysLate: 31, photo: "HM", email: "henrique.m@dilon.edu" },
];

const turmaStudents = [
  { id: 1, name: "Sophia Oliveira",   numero: 1,  present: true,  grades: { M: 8.5, P: 9.0, H: 7.5, C: 8.0, I: 9.5 } },
  { id: 2, name: "Lucas Ferreira",    numero: 2,  present: true,  grades: { M: 7.0, P: 6.5, H: 8.0, C: 7.5, I: 6.0 } },
  { id: 3, name: "Isabela Rodrigues", numero: 3,  present: false, grades: { M: 9.5, P: 9.0, H: 9.5, C: 8.5, I: 9.0 } },
  { id: 4, name: "Gabriel Santos",    numero: 4,  present: true,  grades: { M: 5.5, P: 6.0, H: 5.0, C: 6.5, I: 7.0 } },
  { id: 5, name: "Alice Barbosa",     numero: 5,  present: true,  grades: { M: 8.0, P: 7.5, H: 8.5, C: 9.0, I: 8.0 } },
  { id: 6, name: "Pedro Nascimento",  numero: 6,  present: true,  grades: { M: 6.5, P: 7.0, H: 6.0, C: 5.5, I: 7.5 } },
  { id: 7, name: "Mateus Carvalho",   numero: 7,  present: false, grades: { M: 4.5, P: 5.0, H: 4.0, C: 5.5, I: 6.0 } },
  { id: 8, name: "Beatriz Lima",      numero: 8,  present: true,  grades: { M: 9.0, P: 8.5, H: 9.0, C: 9.5, I: 8.5 } },
];

const lmsModules = [
  {
    id: 1, title: "Módulo 1 — Equações do 2º Grau", done: true, locked: false,
    aulas: [
      { id: 1, title: "Introdução e Conceitos Fundamentais", duration: "18:42", done: true, active: false },
      { id: 2, title: "Fórmula de Bhaskara na Prática",      duration: "24:15", done: true, active: false },
      { id: 3, title: "Discriminante: Δ e os Tipos de Raíz", duration: "21:30", done: false, active: true  },
      { id: 4, title: "Exercícios Resolvidos — Parte I",      duration: "32:00", done: false, active: false },
    ]
  },
  {
    id: 2, title: "Módulo 2 — Funções e Gráficos", done: false, locked: false,
    aulas: [
      { id: 5, title: "Definição de Função e Domínio",        duration: "20:10", done: false, active: false },
      { id: 6, title: "Gráfico da Parábola",                   duration: "28:50", done: false, active: false },
    ]
  },
  {
    id: 3, title: "Módulo 3 — Geometria Analítica", done: false, locked: true,
    aulas: [
      { id: 7, title: "Plano Cartesiano e Distâncias",        duration: "22:00", done: false, active: false },
      { id: 8, title: "Equação da Reta",                      duration: "19:45", done: false, active: false },
    ]
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "Dada a equação 2x² − 8x + 6 = 0, quais são as raízes utilizando a fórmula de Bhaskara?",
    options: ["x₁ = 1 e x₂ = 3", "x₁ = 2 e x₂ = 4", "x₁ = −1 e x₂ = −3", "x₁ = 0 e x₂ = 4"],
    correct: 0,
  },
  {
    id: 2,
    question: "O discriminante Δ de uma equação do 2º grau é negativo. Isso significa que:",
    options: ["A equação possui duas raízes reais e distintas", "A equação possui uma raiz real dupla", "A equação não possui raízes reais", "A equação possui raízes complexas conjugadas"],
    correct: 2,
  },
  {
    id: 3,
    question: "Qual é o valor do discriminante (Δ) para x² − 4x + 4 = 0?",
    options: ["Δ = 0", "Δ = 8", "Δ = −4", "Δ = 16"],
    correct: 0,
  },
  {
    id: 4,
    question: "Uma parábola tem vértice no ponto (3, −2) e abre para cima. O número mínimo que a função assume é:",
    options: ["3", "−3", "−2", "2"],
    correct: 2,
  },
  {
    id: 5,
    question: "Se f(x) = x² − 6x + 5, qual é a forma fatorada de f(x)?",
    options: ["(x + 1)(x + 5)", "(x − 1)(x − 5)", "(x − 1)(x + 5)", "(x + 1)(x − 5)"],
    correct: 1,
  },
  { id: 6,  question: "Qual é a soma das raízes de 3x² − 9x + 6 = 0?",         options: ["3", "−3", "2", "6"],               correct: 0 },
  { id: 7,  question: "O produto das raízes de x² + 5x + 6 = 0 é:",            options: ["5", "−5", "6", "−6"],              correct: 2 },
  { id: 8,  question: "Para Δ = 0, a equação possui:",                           options: ["Sem solução real","Duas soluções distintas","Uma solução dupla","Infinitas soluções"], correct: 2 },
  { id: 9,  question: "O coeficiente 'a' em ax² + bx + c = 0 determina:",       options: ["O vértice","A abertura da parábola","A raiz","O eixo de simetria"], correct: 1 },
  { id: 10, question: "Qual equação tem raízes x = 2 e x = 5?",                 options: ["x² − 7x + 10 = 0","x² + 7x + 10 = 0","x² − 3x + 10 = 0","x² + 3x − 10 = 0"], correct: 0 },
];

const socioEmocional = [
  { key: "resiliencia",    label: "Resiliência",    icon: Shield },
  { key: "foco",          label: "Foco",            icon: Target },
  { key: "participacao",  label: "Participação",    icon: Activity },
  { key: "colaboracao",   label: "Colaboração",     icon: Users },
  { key: "criatividade",  label: "Criatividade",    icon: Sparkles },
];

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
const Avatar = ({ initials, size = "md", color = "teal" }) => {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  const colors = {
    teal:  "bg-[#E0FDF8] text-[#0a7a6a]",
    navy:  "bg-[#EFF6FF] text-[#03254C]",
    amber: "bg-amber-50 text-amber-700",
    red:   "bg-red-50 text-red-700",
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const StatusBadge = ({ status, days }) => {
  const cfg = {
    PAGO:     { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",  dot: "bg-emerald-500", label: "Pago" },
    PENDENTE: { cls: "bg-amber-50  text-amber-700  border border-amber-200",   dot: "bg-amber-500",  label: days > 0 ? `${days}d atraso` : "Pendente" },
    VENCIDA:  { cls: "bg-red-50    text-red-700    border border-red-200",     dot: "bg-red-500",    label: `${days}d atraso` },
  };
  const c = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

const KpiCard = ({ label, value, sub, trend, icon: Icon, accent = false }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ? "bg-[#03254C]" : "bg-[#E0FDF8]"}`}>
        <Icon size={16} className={accent ? "text-[#00F5D4]" : "text-[#0a7a6a]"} />
      </div>
    </div>
    <div className="text-3xl font-extrabold text-[#03254C] tracking-tight">{value}</div>
    {sub && (
      <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>
        {trend === "up"   && <TrendingUp size={13} />}
        {trend === "down" && <TrendingDown size={13} />}
        {sub}
      </div>
    )}
  </div>
);

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
const navItems = [
  { view: "admin",   label: "Gestão & Secretaria", icon: LayoutDashboard },
  { view: "teacher", label: "Portal do Professor",  icon: PenLine },
  { view: "student", label: "Ambiente do Aluno",    icon: BookOpen },
];

function Sidebar({ active, onChange, collapsed, onToggle }) {
  return (
    <aside
      className="flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? 72 : 248, background: NAVY, flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
          <GraduationCap size={20} color={NAVY} />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-extrabold text-base leading-tight">Dilon Edu</div>
            <div className="text-xs font-medium" style={{ color: TEAL, opacity: 0.8 }}>ERP Escolar</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-hidden">
        {!collapsed && <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-2">Módulos</p>}
        {navItems.map(({ view, label, icon: Icon }) => {
          const isActive = active === view;
          return (
            <button
              key={view}
              onClick={() => onChange(view)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 w-full text-left group
                ${isActive
                  ? "text-[#03254C]"
                  : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              style={isActive ? { background: TEAL, color: NAVY } : {}}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && isActive && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-3 flex flex-col gap-1">
        {[{ icon: Settings, label: "Configurações" }, { icon: HelpCircle, label: "Suporte" }].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-sm w-full" title={collapsed ? label : undefined}>
            <Icon size={16} className="flex-shrink-0" />
            {!collapsed && <span className="text-xs">{label}</span>}
          </button>
        ))}
        <button onClick={onToggle} className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all text-sm w-full mt-1">
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Recolher</span></>}
        </button>
      </div>
    </aside>
  );
}

// ─── TOP BAR ────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-lg font-extrabold text-[#03254C] leading-tight">{title}</h1>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-56 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00F5D4] focus:ring-2 focus:ring-[#00F5D4]/30 transition-all"
            placeholder="Pesquisar..."
          />
        </div>
        <button className="relative w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <Avatar initials="AD" size="sm" color="navy" />
          <div className="hidden md:block">
            <p className="text-xs font-bold text-[#03254C] leading-none">Admin Gestor</p>
            <p className="text-[10px] text-gray-400">Unidade Laranjeiras</p>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────────
function AdminView() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [notified, setNotified] = useState({});
  const [sortBy, setSortBy] = useState("name");

  const filtered = students
    .filter(s => {
      const q = search.toLowerCase();
      return (
        (filterStatus === "TODOS" || s.status === filterStatus) &&
        (s.name.toLowerCase().includes(q) || s.turma.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "value") return b.value - a.value;
      if (sortBy === "days")  return b.daysLate - a.daysLate;
      return 0;
    });

  const totalBilling  = students.reduce((a, s) => a + s.value, 0);
  const totalPaid     = students.filter(s => s.status === "PAGO").reduce((a, s) => a + s.value, 0);
  const inadRate      = ((students.filter(s => s.status !== "PAGO").length / students.length) * 100).toFixed(1);
  const newMatriculas = 31;

  const handleNotify = (id) => {
    setNotified(p => ({ ...p, [id]: true }));
  };

  const barData = [72, 81, 76, 88, 84, 93, 89, 97, 91, 95, 87, 103];
  const maxBar  = Math.max(...barData);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F6F9] p-8 space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5">
        <KpiCard label="Faturamento Maio"   value="R$ 287k"       sub="+12% vs abril"         trend="up"   icon={DollarSign}  accent />
        <KpiCard label="Inadimplência"      value={`${inadRate}%`} sub="−2,1pp mês anterior"  trend="up"   icon={AlertCircle} />
        <KpiCard label="Total de Alunos"    value="1.247"          sub="98 novas matrículas"   trend="up"   icon={Users}       />
        <KpiCard label="Matrículas no Mês"  value={newMatriculas}  sub="Meta: 40 matrículas"   trend={null} icon={UserPlus}    />
      </div>

      {/* Revenue chart + breakdown */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#03254C] text-sm">Receita Mensal — 2025</h3>
              <p className="text-xs text-gray-400">Faturamento bruto por mês</p>
            </div>
            <div className="flex gap-2">
              {["3M","6M","12M"].map((p, i) => (
                <button key={p} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${i === 2 ? "bg-[#03254C] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {barData.map((v, i) => {
              const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
              const isLast = i === barData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(v / maxBar) * 140}px`,
                      background: isLast ? TEAL : i >= 8 ? "#bfdbfe" : "#dbeafe",
                    }}
                  />
                  <span className="text-[10px] text-gray-400 font-medium">{months[i]}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: TEAL }} /><span className="text-xs text-gray-500">Mês atual</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-200" /><span className="text-xs text-gray-500">Histórico</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-[#03254C] text-sm">Distribuição de Receita</h3>
          {[
            { label: "Mensalidades",  value: 84, color: TEAL,      amount: "R$ 241k" },
            { label: "Matrículas",    value: 10, color: "#3b82f6",  amount: "R$ 29k"  },
            { label: "Taxas / Outros",value: 6,  color: "#f59e0b",  amount: "R$ 17k"  },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-600">{item.label}</span>
                <span className="font-bold text-[#03254C]">{item.amount}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
              <span className="text-[10px] text-gray-400">{item.value}%</span>
            </div>
          ))}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-1">Inadimplência</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-400 transition-all" style={{ width: `${inadRate}%` }} />
              </div>
              <span className="text-xs font-bold text-red-500">{inadRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-[#03254C] text-sm">Gestão de Alunos</h3>
            <p className="text-xs text-gray-400">{filtered.length} alunos · {students.filter(s => s.status !== "PAGO").length} com pendências</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status filter */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {["TODOS", "PAGO", "PENDENTE", "VENCIDA"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    filterStatus === f ? "bg-white shadow-sm text-[#03254C]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >{f}</button>
              ))}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar aluno..."
                className="pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-[#00F5D4] focus:ring-1 focus:ring-[#00F5D4]/30 w-44"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03254C] text-white rounded-lg text-xs font-semibold hover:bg-[#0a3a6b] transition-colors">
              <Download size={13} /> Exportar
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {[
                { key: "name",  label: "Aluno" },
                { key: null,    label: "Turma" },
                { key: null,    label: "Responsável" },
                { key: "value", label: "Mensalidade" },
                { key: "days",  label: "Status" },
                { key: null,    label: "Ação" },
              ].map((col, i) => (
                <th
                  key={i}
                  className={`text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider ${col.key ? "cursor-pointer hover:text-gray-600 select-none" : ""}`}
                  onClick={() => col.key && setSortBy(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.key && sortBy === col.key && <ChevronDown size={11} className="text-[#00F5D4]" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={s.photo} color={s.status === "PAGO" ? "teal" : s.status === "VENCIDA" ? "red" : "amber"} />
                    <div>
                      <p className="text-sm font-semibold text-[#03254C]">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">{s.turma}</span>
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-600 font-medium">{s.resp}</td>
                <td className="px-6 py-3.5 text-sm font-bold text-[#03254C]">
                  R$ {s.value.toLocaleString("pt-BR")},00
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={s.status} days={s.daysLate} />
                </td>
                <td className="px-6 py-3.5">
                  {s.status !== "PAGO" ? (
                    <button
                      onClick={() => handleNotify(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${notified[s.id]
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-[#03254C] text-white hover:bg-[#0a3a6b]"
                        }`}
                    >
                      {notified[s.id] ? <><CheckCircle size={13} /> Enviado</> : <><Send size={13} /> Notificar</>}
                    </button>
                  ) : (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 border border-gray-200 hover:border-gray-300 transition-all">
                      <Eye size={13} /> Ver Recibo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Nenhum aluno encontrado</p>
          </div>
        )}

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} de {students.length} alunos exibidos</p>
          <div className="flex gap-1">
            {[1,2,3,"..."].map((n,i) => (
              <button key={i} className={`w-7 h-7 rounded text-xs font-semibold transition-all ${n === 1 ? "bg-[#03254C] text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEACHER VIEW ─────────────────────────────────────────────────────────────
function TeacherView() {
  const [attendance, setAttendance] = useState(
    Object.fromEntries(turmaStudents.map(s => [s.id, s.present]))
  );
  const [grades, setGrades] = useState(
    Object.fromEntries(turmaStudents.map(s => [s.id, { ...s.grades }]))
  );
  const [selectedStudent, setSelectedStudent] = useState(turmaStudents[0]);
  const [sEval, setSEval] = useState(
    Object.fromEntries(socioEmocional.map(c => [c.key, 3]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("chamada");

  const subjects = [
    { key: "M", label: "Mat." },
    { key: "P", label: "Port." },
    { key: "H", label: "Hist." },
    { key: "C", label: "Ciên." },
    { key: "I", label: "Ingl." },
  ];

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount  = turmaStudents.length - presentCount;

  const handleGradeChange = (sid, sub, val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 10) return;
    setGrades(prev => ({ ...prev, [sid]: { ...prev[sid], [sub]: num } }));
  };

  const avg = (sid) => {
    const g = grades[sid];
    const vals = Object.values(g);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const gradeColor = (v) => {
    if (v >= 7) return "text-emerald-600 font-bold";
    if (v >= 5) return "text-amber-600 font-bold";
    return "text-red-500 font-bold";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F6F9] p-8 space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-5">
        <KpiCard label="Turma"          value="9º Ano A"       sub="Turno Manhã"            trend={null} icon={Layers}       />
        <KpiCard label="Presentes Hoje" value={presentCount}   sub={`de ${turmaStudents.length} alunos`} trend="up" icon={CheckCircle} />
        <KpiCard label="Ausentes"       value={absentCount}    sub="2 sem justificativa"    trend="down" icon={AlertCircle}  />
        <KpiCard label="Média da Turma" value="7,8"            sub="+0.4 vs bimestre ant."  trend="up"   icon={BarChart2}    />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 w-fit">
        {[
          { key: "chamada", label: "Chamada & Notas",            icon: ListChecks },
          { key: "socio",   label: "Feedback Socioemocional",    icon: Heart },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? "text-[#03254C] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={activeTab === key ? { background: TEAL + "30", color: NAVY } : {}}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "chamada" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-[#03254C] text-sm">Diário de Classe Digital</h3>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <CheckCircle size={13} /> {presentCount} Presentes
              </div>
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertCircle size={13} /> {absentCount} Ausentes
              </div>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all" style={{ background: NAVY }}>
                <Download size={13} /> Salvar Diário
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-8">Nº</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aluno</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Presença</th>
                  {subjects.map(s => (
                    <th key={s.key} className="px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-20">{s.label}</th>
                  ))}
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Média</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {turmaStudents.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-mono font-bold">{String(s.numero).padStart(2, "0")}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={s.name.split(" ").map(w => w[0]).slice(0,2).join("")} size="sm" color="navy" />
                        <span className="text-sm font-semibold text-[#03254C]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setAttendance(p => ({ ...p, [s.id]: !p[s.id] }))}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm transition-all
                          ${attendance[s.id]
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : "bg-red-100 text-red-500 hover:bg-red-200"
                          }`}
                      >
                        {attendance[s.id] ? <Check size={15} /> : <Minus size={15} />}
                      </button>
                    </td>
                    {subjects.map(sub => (
                      <td key={sub.key} className="px-3 py-3.5 text-center">
                        <input
                          type="number"
                          min={0} max={10} step={0.5}
                          value={grades[s.id][sub.key]}
                          onChange={e => handleGradeChange(s.id, sub.key, e.target.value)}
                          className={`w-16 text-center py-1.5 rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#00F5D4]/40 focus:border-[#00F5D4] transition-all
                            ${grades[s.id][sub.key] >= 7 ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : grades[s.id][sub.key] >= 5 ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-red-600"}`}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-base ${gradeColor(parseFloat(avg(s.id)))}`}>{avg(s.id)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "socio" && (
        <div className="grid grid-cols-3 gap-5">
          {/* Student selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-[#03254C] text-sm mb-4">Selecionar Aluno</h3>
            <div className="space-y-2">
              {turmaStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudent(s); setSubmitted(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                    ${selectedStudent.id === s.id
                      ? "shadow-sm border-2"
                      : "hover:bg-gray-50 border border-gray-100"
                    }`}
                  style={selectedStudent.id === s.id ? { borderColor: TEAL, background: TEAL + "15" } : {}}
                >
                  <Avatar initials={s.name.split(" ").map(w => w[0]).slice(0,2).join("")} size="sm" color={selectedStudent.id === s.id ? "teal" : "navy"} />
                  <span className="text-sm font-semibold text-[#03254C] truncate">{s.name}</span>
                  {selectedStudent.id === s.id && <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: TEAL }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Evaluation panel */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
              <Avatar initials={selectedStudent.name.split(" ").map(w => w[0]).slice(0,2).join("")} size="lg" color="teal" />
              <div>
                <h3 className="font-bold text-[#03254C] text-base">{selectedStudent.name}</h3>
                <p className="text-xs text-gray-400">Avaliação Socioemocional — {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
              </div>
              {submitted && (
                <div className="ml-auto flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <CheckCircle size={13} /> Avaliação Salva
                </div>
              )}
            </div>

            <div className="space-y-6">
              {socioEmocional.map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: TEAL + "25" }}>
                        <Icon size={14} style={{ color: "#0a7a6a" }} />
                      </div>
                      <span className="text-sm font-bold text-[#03254C]">{label}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                      background: sEval[key] >= 4 ? "#DCFCE7" : sEval[key] >= 3 ? "#FEF3C7" : "#FEE2E2",
                      color: sEval[key] >= 4 ? "#15803d" : sEval[key] >= 3 ? "#92400e" : "#991b1b",
                    }}>
                      {["", "Necessita Atenção", "Abaixo do Esperado", "Regular", "Bom", "Excelente"][sEval[key]]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        onClick={() => setSEval(p => ({ ...p, [key]: n }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border"
                        style={
                          sEval[key] >= n
                            ? { background: TEAL, color: NAVY, borderColor: TEAL }
                            : { background: "#F4F6F9", color: "#9ca3af", borderColor: "#e5e7eb" }
                        }
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="text-sm font-bold text-[#03254C] block mb-2">Observação do Professor</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#00F5D4] focus:ring-2 focus:ring-[#00F5D4]/30 transition-all"
                  rows={3}
                  placeholder="Ex: Aluno demonstrou evolução na participação em debates. Precisa de apoio em gestão emocional durante avaliações..."
                />
              </div>

              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-xl text-sm font-extrabold text-[#03254C] transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: TEAL }}
              >
                Salvar Avaliação Socioemocional
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STUDENT VIEW ─────────────────────────────────────────────────────────────
function StudentView() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeAula, setActiveAula] = useState(
    lmsModules[0].aulas.find(a => a.active)?.id ?? 3
  );
  const [mode, setMode] = useState("lms"); // "lms" | "quiz"

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [quizDone, setQuizDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode !== "quiz" || quizDone) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setQuizDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode, quizDone]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timerColor = timeLeft < 300 ? "text-red-500" : timeLeft < 600 ? "text-amber-500" : "text-emerald-600";

  const handleAnswer = (qi, ai) => {
    if (quizDone) return;
    setAnswers(p => ({ ...p, [qi]: ai }));
  };

  const answered   = Object.keys(answers).length;
  const unanswered = quizQuestions.length - answered;
  const score      = quizDone
    ? quizQuestions.filter((q, i) => answers[i] === q.correct).length
    : null;

  const q = quizQuestions[currentQ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F6F9] p-8 space-y-6">
      {/* Mode switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#03254C]">Olá, Sophia! 👋</h2>
          <p className="text-xs text-gray-400">Continue de onde parou — Módulo 1, Aula 3</p>
        </div>
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
          {[
            { key: "lms",  label: "Ambiente de Aprendizagem", icon: PlayCircle },
            { key: "quiz", label: "Área de Simulado",          icon: FileText   },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setMode(key); if (key === "quiz") { setCurrentQ(0); setAnswers({}); setTimeLeft(30*60); setQuizDone(false); } }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === key ? "shadow-sm text-[#03254C]" : "text-gray-500 hover:text-gray-700"
              }`}
              style={mode === key ? { background: TEAL + "30" } : {}}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── LMS ── */}
      {mode === "lms" && (
        <div className="grid grid-cols-3 gap-5 items-start">
          {/* Video Player */}
          <div className="col-span-2 space-y-4">
            <div className="bg-[#03254C] rounded-2xl overflow-hidden shadow-xl aspect-video flex flex-col items-center justify-center relative group cursor-pointer">
              {/* Simulated thumbnail content */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#03254C] via-[#0a3a6b] to-[#0f4d8a] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform mx-auto backdrop-blur-sm">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                  <p className="text-white/70 text-sm font-medium">Aula 3 — Discriminante Δ</p>
                  <p className="text-white/40 text-xs mt-1">21:30 de duração</p>
                </div>
              </div>
              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#00F5D4] rounded-full w-[38%]" />
                </div>
                <div className="flex items-center gap-3">
                  <button><Play size={18} className="text-white" fill="white" /></button>
                  <span className="text-white/70 text-xs">08:12 / 21:30</span>
                  <div className="ml-auto flex gap-3">
                    <Volume2 size={16} className="text-white/70" />
                    <Maximize size={16} className="text-white/70" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-extrabold text-[#03254C] text-base">Discriminante: Δ e os Tipos de Raíz</h3>
                  <p className="text-xs text-gray-400 mt-1">Módulo 1 · Aula 3 de 4 · Prof. Ricardo Alves · Matemática</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                    <BookMarked size={13} /> Salvar
                  </button>
                  <button className="px-4 py-1.5 text-xs font-bold rounded-lg text-[#03254C] flex items-center gap-1.5 transition-all hover:brightness-105" style={{ background: TEAL }}>
                    <ChevronRight size={14} /> Próxima aula
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nesta aula, aprendemos a calcular o discriminante Δ = b² − 4ac e interpretar seus resultados para determinar a natureza das raízes: duas reais distintas (Δ&gt;0), uma real dupla (Δ=0) ou complexas conjugadas (Δ&lt;0).
              </p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center gap-1.5"><Eye size={13} /> 1.247 visualizações</div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5"><Star size={13} className="text-amber-400" fill="#fbbf24" /> 4,9 (324 avaliações)</div>
                <button className="ml-auto text-xs text-[#03254C] font-semibold flex items-center gap-1 hover:underline" onClick={() => setMode("quiz")}>
                  Fazer simulado desta aula <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Module list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#03254C] text-sm">Conteúdo do Curso</h3>
              <span className="text-xs text-gray-400">3 módulos</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 380px)" }}>
              {lmsModules.map((mod, mi) => (
                <div key={mod.id} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setActiveModule(mi === activeModule ? -1 : mi)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    {mod.locked ? <Lock size={14} className="text-gray-300 flex-shrink-0" /> : mod.done ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" /> : <Circle size={14} className="text-gray-300 flex-shrink-0" />}
                    <span className={`text-sm font-semibold flex-1 text-left ${mod.locked ? "text-gray-400" : "text-[#03254C]"}`}>{mod.title}</span>
                    {!mod.locked && (
                      <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${activeModule === mi ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {activeModule === mi && !mod.locked && (
                    <div className="bg-gray-50/60">
                      {mod.aulas.map(aula => (
                        <button
                          key={aula.id}
                          onClick={() => setActiveAula(aula.id)}
                          className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50/40 transition-colors border-t border-gray-100 ${activeAula === aula.id ? "bg-[#E0FDF8]/60" : ""}`}
                        >
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: aula.active ? TEAL : aula.done ? "#DCFCE7" : "#f4f6f9" }}>
                            {aula.done ? <CheckCircle size={13} className="text-emerald-600" /> : <Play size={11} fill={aula.active ? NAVY : "#9ca3af"} className={aula.active ? `text-[${NAVY}]` : "text-gray-400"} />}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-xs font-semibold truncate ${aula.active ? "text-[#03254C]" : "text-gray-600"}`}>{aula.title}</p>
                            <p className="text-[10px] text-gray-400">{aula.duration}</p>
                          </div>
                          {aula.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: TEAL, color: NAVY }}>ASSISTINDO</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {mode === "quiz" && (
        <div className="grid grid-cols-4 gap-5 items-start">
          {/* Main quiz area */}
          <div className="col-span-3 space-y-5">
            {/* Timer bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3 flex items-center gap-4">
              <div className={`flex items-center gap-2 font-extrabold text-xl tracking-widest font-mono ${timerColor}`}>
                <Clock size={18} />
                {fmtTime(timeLeft)}
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mx-2">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / (30 * 60)) * 100}%`, background: timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : TEAL }}
                />
              </div>
              <div className="text-xs text-gray-400 font-medium whitespace-nowrap">
                {answered}/{quizQuestions.length} respondidas
              </div>
              {quizDone && (
                <div className="ml-4 flex items-center gap-2 text-sm font-bold text-[#03254C]">
                  <Award size={16} style={{ color: TEAL }} />
                  Resultado: {score}/{quizQuestions.length} ({Math.round((score/quizQuestions.length)*100)}%)
                </div>
              )}
            </div>

            {/* Question */}
            {!quizDone ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: TEAL + "30", color: NAVY }}>
                    Questão {currentQ + 1} de {quizQuestions.length}
                  </span>
                  <span className="text-xs text-gray-400">Equações do 2º Grau</span>
                </div>
                <p className="text-base font-semibold text-[#03254C] leading-relaxed mb-7">{q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[currentQ] === oi;
                    const showResult = quizDone;
                    const isCorrect  = oi === q.correct;
                    let optStyle = "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100";
                    if (isSelected && !showResult) optStyle = `border-[${TEAL}] bg-[${TEAL}]/10 text-[${NAVY}] font-semibold`;
                    if (showResult && isCorrect)    optStyle = "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold";
                    if (showResult && isSelected && !isCorrect) optStyle = "border-red-400 bg-red-50 text-red-700 font-semibold";

                    return (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(currentQ, oi)}
                        disabled={quizDone}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all text-sm ${optStyle}`}
                        style={isSelected && !showResult ? { borderColor: TEAL, background: TEAL + "18" } : {}}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                          style={isSelected && !showResult ? { background: TEAL, color: NAVY } : { background: "#e5e7eb", color: "#6b7280" }}
                        >
                          {["A","B","C","D"][oi]}
                        </div>
                        {opt}
                        {showResult && isCorrect  && <CheckCircle size={16} className="ml-auto text-emerald-500 flex-shrink-0" />}
                        {showResult && isSelected && !isCorrect && <X size={16} className="ml-auto text-red-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                    disabled={currentQ === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span className="text-xs text-gray-400">{unanswered} questões em branco</span>
                  {currentQ < quizQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQ(q => Math.min(quizQuestions.length - 1, q + 1))}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#03254C] transition-all hover:brightness-105"
                      style={{ background: TEAL }}
                    >
                      Próxima <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setQuizDone(true); clearInterval(timerRef.current); }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:bg-[#0a3a6b]"
                      style={{ background: NAVY }}
                    >
                      <CheckCircle size={16} /> Finalizar Simulado
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Result Card */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: score >= 7 ? "#DCFCE7" : "#FEF3C7" }}>
                  <Award size={36} className={score >= 7 ? "text-emerald-600" : "text-amber-600"} />
                </div>
                <h3 className="text-3xl font-extrabold text-[#03254C] mb-2">{score} / {quizQuestions.length}</h3>
                <p className="text-gray-500 mb-1">Você acertou {Math.round((score / quizQuestions.length) * 100)}% das questões</p>
                <p className={`text-sm font-bold mb-6 ${score >= 7 ? "text-emerald-600" : "text-amber-600"}`}>
                  {score >= 7 ? "Excelente desempenho! Continue assim! 🎉" : "Bom esforço! Revise os tópicos e tente novamente."}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Acertos",  value: score,                             color: "text-emerald-600" },
                    { label: "Erros",    value: quizQuestions.length - score,      color: "text-red-500"     },
                    { label: "Precisão", value: `${Math.round((score/quizQuestions.length)*100)}%`, color: "text-[#03254C]" },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setAnswers({}); setCurrentQ(0); setTimeLeft(30*60); setQuizDone(false); }}
                  className="px-8 py-3 rounded-xl text-sm font-extrabold text-[#03254C] transition-all hover:brightness-105"
                  style={{ background: TEAL }}
                >
                  <RefreshCw size={14} className="inline mr-2" />
                  Refazer Simulado
                </button>
              </div>
            )}
          </div>

          {/* Question map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-0">
            <h3 className="font-bold text-[#03254C] text-sm mb-1">Mapa de Questões</h3>
            <p className="text-xs text-gray-400 mb-4">{answered} respondidas · {unanswered} em branco</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {quizQuestions.map((_, qi) => {
                const isAnswered = qi in answers;
                const isCurrent  = qi === currentQ;
                const isCorrect  = quizDone && answers[qi] === quizQuestions[qi].correct;
                const isWrong    = quizDone && isAnswered && !isCorrect;
                return (
                  <button
                    key={qi}
                    onClick={() => setCurrentQ(qi)}
                    className="w-full aspect-square rounded-lg text-xs font-extrabold flex items-center justify-center transition-all"
                    style={{
                      background: isWrong ? "#FEE2E2" : isCorrect ? "#DCFCE7" : isCurrent ? TEAL : isAnswered ? NAVY : "#F4F6F9",
                      color: isWrong ? "#991b1b" : isCorrect ? "#15803d" : isCurrent ? NAVY : isAnswered ? "#fff" : "#9ca3af",
                      border: isCurrent ? `2px solid ${TEAL}` : "2px solid transparent",
                      transform: isCurrent ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {qi + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                { bg: NAVY,     color: "#fff",     label: "Respondida" },
                { bg: TEAL,     color: NAVY,       label: "Atual" },
                { bg: "#F4F6F9",color: "#9ca3af",  label: "Em branco" },
                ...(quizDone ? [
                  { bg: "#DCFCE7", color: "#15803d", label: "Correta" },
                  { bg: "#FEE2E2", color: "#991b1b", label: "Incorreta" },
                ] : []),
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex-shrink-0" style={{ background: item.bg }} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
            {!quizDone && (
              <button
                onClick={() => { setQuizDone(true); clearInterval(timerRef.current); }}
                className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:bg-[#0a3a6b]"
                style={{ background: NAVY }}
              >
                Entregar Simulado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function DilonEduWeb() {
  const [view, setView] = useState("admin");
  const [collapsed, setCollapsed] = useState(false);

  const meta = {
    admin:   { title: "Gestão & Secretaria",  subtitle: "Dashboard financeiro e operacional · Unidade Laranjeiras · Maio 2025" },
    teacher: { title: "Portal do Professor",  subtitle: "9º Ano A · Turno Manhã · Prof. Ricardo Alves"                        },
    student: { title: "Ambiente do Aluno",    subtitle: "Sophia Oliveira · 9º Ano A · Matemática — Equações do 2º Grau"       },
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar active={view} onChange={setView} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={meta[view].title} subtitle={meta[view].subtitle} />
        {view === "admin"   && <AdminView />}
        {view === "teacher" && <TeacherView />}
        {view === "student" && <StudentView />}
      </div>
    </div>
  );
}