import { useState } from "react";
import {
  LayoutDashboard, Users, DollarSign, ChevronDown, TrendingUp,
  TrendingDown, Bell, GraduationCap, AlertCircle, Zap, CheckCircle
} from "lucide-react";

const NAVY = "#03254C";
const TEAL = "#00F5D4";
const TEAL_LIGHT = "#E0FDF8";
const BG_MOBILE = "#F4F6F9";

const BadgeMobile = ({ children, color = "teal" }) => {
  const map = {
    teal: { bg: TEAL_LIGHT, color: "#0a7a6a" },
    green: { bg: "#DCFCE7", color: "#15803d" },
    amber: { bg: "#FEF3C7", color: "#92400e" },
    red: { bg: "#FEE2E2", color: "#991b1b" },
  };
  const s = map[color] || map.teal;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 99, fontSize: 11, fontWeight: 600, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
};

const KpiCardMobile = ({ label, value, sub, icon: Icon, trend }) => (
  <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(3,37,76,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <div style={{ background: TEAL_LIGHT, borderRadius: 8, padding: 6, color: "#0a7a6a" }}><Icon size={16} /></div>
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: NAVY, letterSpacing: -0.5 }}>{value}</div>
    {sub && (
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : "#6b7280" }}>
        {trend === "up" && <TrendingUp size={13} />}
        {trend === "down" && <TrendingDown size={13} />}
        {sub}
      </div>
    )}
  </div>
);

const AvatarMobile = ({ name, size = 36, bg = TEAL }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

function AdminViewMobile() {
  const [unit, setUnit] = useState(0);
  const [expandedCol, setExpandedCol] = useState(null);
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: NAVY, padding: "16px 20px", borderRadius: "0 0 20px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>Gestão Escolar</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>Dilon Edu</div>
          </div>
          <AvatarMobile name="Admin Gestor" size={34} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {["Unidade Caxias", "Unidade Laranjeiras"].map((u, i) => (
            <button key={u} onClick={() => setUnit(i)} style={{ background: unit === i ? TEAL : "rgba(255,255,255,0.12)", color: unit === i ? NAVY : "#fff", border: "none", borderRadius: 99, padding: "7px 14px", fontSize: 12, fontWeight: 700 }}>{u}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <KpiCardMobile label="Faturamento" value="R$ 287k" sub="+12%" trend="up" icon={DollarSign} />
          <KpiCardMobile label="Inadimplência" value="6,4%" sub="-2.1pp" trend="down" icon={AlertCircle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[
            { stage: "Agendou Visita", count: 12, leads: [{ name: "Família Souza", child: "Pedro, 8 anos" }] },
            { stage: "Matrícula Efetivada", count: 31, leads: [{ name: "Família Oliveira", child: "Sofia, 7 anos" }] }
          ].map((col, ci) => (
            <div key={ci} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(3,37,76,0.07)", overflow: "hidden" }}>
              <div onClick={() => setExpandedCol(expandedCol === ci ? null : ci)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>{col.stage} ({col.count})</span>
                <ChevronDown size={16} />
              </div>
              {expandedCol === ci && (
                <div style={{ borderTop: "1px solid #f4f6f9", padding: "12px 18px" }}>
                  {col.leads.map((l, li) => (
                    <div key={li} style={{ fontSize: 13, color: NAVY, fontWeight: 650, marginBottom: 4 }}>{l.name} - <span style={{fontSize:11, color:"#6b7280"}}>{l.child}</span></div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParentViewMobile() {
  const [pixPaid, setPixPaid] = useState(false);
  const [showPix, setShowPix] = useState(false);
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ background: pixPaid ? "#F0FDF4" : `linear-gradient(135deg, ${NAVY} 0%, #0a4080 100%)`, borderRadius: 20, padding: "20px", color: "#fff" }}>
        {!pixPaid ? (
          <>
            <div style={{ fontSize: 12, opacity: 0.7 }}>MENSALIDADE · MAIO 2025</div>
            <div style={{ fontSize: 34, fontWeight: 800, margin: "4px 0 12px" }}>R$ 1.350,00</div>
            {!showPix ? (
              <button onClick={() => setShowPix(true)} style={{ background: TEAL, color: NAVY, border: "none", borderRadius: 12, padding: "12px", width: "100%", fontWeight: 800, cursor: "pointer" }}>Pagar com PIX</button>
            ) : (
              <button onClick={() => setPixPaid(true)} style={{ background: TEAL, color: NAVY, border: "none", borderRadius: 12, padding: "12px", width: "100%", fontWeight: 800, cursor: "pointer" }}>✓ Confirmar Simulação</button>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#15803d", fontWeight: 700 }}>✓ Pagamento Confirmado!</div>
        )}
      </div>
    </div>
  );
}

function StudentViewMobile() {
  const [activeTab, setActiveTab] = useState("agenda");
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setActiveTab("agenda")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: activeTab === "agenda" ? NAVY : "#fff", color: activeTab === "agenda" ? "#fff" : "#6b7280", fontWeight: 700 }}>Agenda</button>
        <button onClick={() => setActiveTab("tasks")} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: activeTab === "tasks" ? NAVY : "#fff", color: activeTab === "tasks" ? "#fff" : "#6b7280", fontWeight: 700 }}>Tarefas</button>
      </div>
      <div style={{ background: "#fff", padding: "16px", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {activeTab === "agenda" ? (
          <div>
            <div style={{骨weight: 750, fontWeight: 700, color: NAVY, marginBottom: 4 }}>08:00 - Matemática</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Prof. Ricardo · Sala 12</div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, color: "#dc2626" }}>Lista de Exercícios Bhaskara</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Entrega: Hoje, até às 23:59</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileView() {
  const [activeTab, setActiveTab] = useState("admin");
  return (
    <div style={{ background: BG_MOBILE, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {activeTab === "admin" && <AdminViewMobile />}
        {activeTab === "parent" && <ParentViewMobile />}
        {activeTab === "student" && <StudentViewMobile />}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #f0f4f8", padding: "10px 12px 16px", display: "flex", boxShadow: "0 -4px 24px rgba(3,37,76,0.10)", zIndex: 50 }}>
        {[{ k: "admin", l: "Gestão", i: LayoutDashboard }, { k: "parent", l: "Pais", i: Users }, { k: "student", l: "Aluno", i: GraduationCap }].map(t => (
          <button key={t.k} onClick={() => setActiveTab(t.k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer" }}>
            <t.i size={20} color={activeTab === t.k ? "#0a7a6a" : "#9ca3af"} />
            <span style={{ fontSize: 10, fontWeight: 700, color: activeTab === t.k ? "#0a7a6a" : "#9ca3af", marginTop: 4 }}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
