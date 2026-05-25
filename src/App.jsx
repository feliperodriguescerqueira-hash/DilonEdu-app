import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Star,
  QrCode,
  Shield,
  Bell,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Zap,
  Award,
  Target,
  Heart,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Smartphone,
  UserCheck,
  CreditCard,
  BarChart2,
  Activity,
  Calendar,
  Layers,
  GraduationCap,
  Fingerprint,
  LogIn,
  LogOut,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  MessageSquare,
  Wifi,
} from 'lucide-react';

const NAVY = '#03254C';
const TEAL = '#00F5D4';
const TEAL_LIGHT = '#E0FDF8';
const BG = '#F4F6F9';

// ─── SHARED UI PRIMITIVES ─────────────────────────────────────────────────

const Badge = ({ children, color = 'teal' }) => {
  const map = {
    teal: { bg: TEAL_LIGHT, color: '#0a7a6a' },
    green: { bg: '#DCFCE7', color: '#15803d' },
    amber: { bg: '#FEF3C7', color: '#92400e' },
    red: { bg: '#FEE2E2', color: '#991b1b' },
    navy: { bg: '#EFF6FF', color: NAVY },
  };
  const s = map[color] || map.teal;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {children}
    </span>
  );
};

const KpiCard = ({ label, value, sub, icon: Icon, trend, color = NAVY }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 16,
      padding: '18px 20px',
      boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      <div
        style={{
          background: TEAL_LIGHT,
          borderRadius: 8,
          padding: 6,
          color: '#0a7a6a',
        }}
      >
        <Icon size={16} />
      </div>
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 700,
        color: NAVY,
        letterSpacing: -0.5,
      }}
    >
      {value}
    </div>
    {sub && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color:
            trend === 'up'
              ? '#16a34a'
              : trend === 'down'
              ? '#dc2626'
              : '#6b7280',
        }}
      >
        {trend === 'up' && <TrendingUp size={13} />}
        {trend === 'down' && <TrendingDown size={13} />}
        {sub}
      </div>
    )}
  </div>
);

const Avatar = ({ name, size = 36, bg = TEAL }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: NAVY,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────

const UNITS = ['Unidade Caxias', 'Unidade Laranjeiras', 'Unidade Barra'];

const crmFunnel = [
  {
    stage: 'Agendou Visita',
    color: '#3b82f6',
    bg: '#EFF6FF',
    count: 12,
    leads: [
      { name: 'Família Souza', child: 'Pedro, 8 anos', date: 'Hoje, 14h' },
      { name: 'Família Carvalho', child: 'Ana, 6 anos', date: 'Amanhã, 10h' },
      { name: 'Família Lima', child: 'Marcos, 11 anos', date: '24/05, 16h' },
    ],
  },
  {
    stage: 'Prova de Bolsa',
    color: '#f59e0b',
    bg: '#FEF3C7',
    count: 7,
    leads: [
      { name: 'Família Ribeiro', child: 'Clara, 9 anos', date: 'Hoje, 10h' },
      { name: 'Família Ferreira', child: 'Lucas, 12 anos', date: '24/05, 9h' },
    ],
  },
  {
    stage: 'Matrícula Efetivada',
    color: '#16a34a',
    bg: '#DCFCE7',
    count: 31,
    leads: [
      { name: 'Família Oliveira', child: 'Sofia, 7 anos', date: '22/05' },
      { name: 'Família Costa', child: 'Gabriel, 10 anos', date: '21/05' },
    ],
  },
];

const invoices = [
  {
    name: 'Carlos Henrique Souza',
    turma: '9º Ano B',
    value: 'R$ 1.350,00',
    status: 'Vencida',
    days: 12,
  },
  {
    name: 'Mariana Alves Pereira',
    turma: '6º Ano A',
    value: 'R$ 1.350,00',
    status: 'Vencida',
    days: 5,
  },
  {
    name: 'Rafael Monteiro',
    turma: '3º Ano',
    value: 'R$ 950,00',
    status: 'Hoje',
    days: 0,
  },
  {
    name: 'Beatriz Castro',
    turma: '1º EM',
    value: 'R$ 1.600,00',
    status: 'Paga',
    days: null,
  },
];

const notifications = [
  { text: 'Nova matrícula: Sofia Oliveira', time: 'há 2min', type: 'success' },
  { text: 'Alerta de inadimplência: 3 novos', time: 'há 1h', type: 'warning' },
  { text: 'Relatório mensal disponível', time: 'há 3h', type: 'info' },
];

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────

function AdminView() {
  const [unit, setUnit] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [expandedCol, setExpandedCol] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top Bar */}
      <div
        style={{
          background: NAVY,
          padding: '16px 20px',
          borderRadius: '0 0 20px 20px',
          marginBottom: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                color: TEAL,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              Gestão Escolar
            </div>
            <div
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              Dilon Edu
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 10,
                padding: 8,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={18} color="#fff" />
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 7,
                  height: 7,
                  background: TEAL,
                  borderRadius: '50%',
                  border: '2px solid ' + NAVY,
                }}
              />
            </button>
            <Avatar name="Admin Gestor" size={34} bg={TEAL} />
          </div>
        </div>
        {/* Unit Selector */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {UNITS.map((u, i) => (
            <button
              key={u}
              onClick={() => setUnit(i)}
              style={{
                background: unit === i ? TEAL : 'rgba(255,255,255,0.12)',
                color: unit === i ? NAVY : '#fff',
                border: 'none',
                borderRadius: 99,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {u}
            </button>
          ))}
        </div>
        {/* Notification Dropdown */}
        {showNotif && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 16,
              width: 280,
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(3,37,76,0.18)',
              zIndex: 100,
              overflow: 'hidden',
              marginTop: 4,
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 700,
                fontSize: 13,
                color: NAVY,
              }}
            >
              Notificações
            </div>
            {notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 16px',
                  borderBottom: '1px solid #f9f9f9',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background:
                      n.type === 'success'
                        ? '#16a34a'
                        : n.type === 'warning'
                        ? '#f59e0b'
                        : '#3b82f6',
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, color: NAVY, fontWeight: 500 }}>
                    {n.text}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPIs */}
      <div style={{ padding: '0 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <KpiCard
            label="Faturamento Maio"
            value="R$ 287k"
            sub="+12% vs abril"
            trend="up"
            icon={DollarSign}
          />
          <KpiCard
            label="Inadimplência"
            value="6,4%"
            sub="-2.1pp vs mês ant."
            trend="down"
            icon={AlertCircle}
          />
          <KpiCard
            label="Total de Alunos"
            value="1.247"
            sub="98 novos este ano"
            trend="up"
            icon={GraduationCap}
          />
          <KpiCard
            label="NPS Famílias"
            value="82"
            sub="Excelente"
            icon={Heart}
          />
        </div>

        {/* Revenue Mini Chart */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>
              Receita vs Inadimplência
            </div>
            <Badge color="teal">Maio 2025</Badge>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'flex-end',
              height: 60,
            }}
          >
            {[52, 58, 61, 55, 68, 72, 70, 75, 80, 77, 85, 88].map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    height: v * 0.68,
                    background: i === 11 ? TEAL : '#e0f2fe',
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.3s',
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 6,
              fontSize: 10,
              color: '#9ca3af',
            }}
          >
            <span>Jan</span>
            <span>Mar</span>
            <span>Jun</span>
            <span>Set</span>
            <span>Dez</span>
          </div>
        </div>

        {/* CRM Kanban */}
        <div
          style={{
            fontWeight: 700,
            color: NAVY,
            fontSize: 15,
            marginBottom: 12,
          }}
        >
          Máquina de Matrículas
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {crmFunnel.map((col, ci) => (
            <div
              key={ci}
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setExpandedCol(expandedCol === ci ? null : ci)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: col.color,
                    }}
                  />
                  <span style={{ fontWeight: 700, fontSize: 13, color: NAVY }}>
                    {col.stage}
                  </span>
                  <span
                    style={{
                      background: col.bg,
                      color: col.color,
                      borderRadius: 99,
                      padding: '2px 9px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {col.count}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  color="#9ca3af"
                  style={{
                    transform: expandedCol === ci ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </div>
              {expandedCol === ci && (
                <div style={{ borderTop: '1px solid #f4f6f9' }}>
                  {col.leads.map((l, li) => (
                    <div
                      key={li}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 18px',
                        borderBottom: '1px solid #f4f6f9',
                      }}
                    >
                      <Avatar name={l.name} size={32} bg={col.bg} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: NAVY,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {l.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>
                          {l.child}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#9ca3af',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {l.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Inadimplência */}
        <div
          style={{
            fontWeight: 700,
            color: NAVY,
            fontSize: 15,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Régua de Cobrança</span>
          <button
            style={{
              background: TEAL,
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: NAVY,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Plus size={12} /> Enviar Lembrete
          </button>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          {invoices.map((inv, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 18px',
                borderBottom:
                  i < invoices.length - 1 ? '1px solid #f4f6f9' : 'none',
              }}
            >
              <Avatar
                name={inv.name}
                size={34}
                bg={
                  inv.status === 'Paga'
                    ? '#DCFCE7'
                    : inv.status === 'Hoje'
                    ? '#FEF3C7'
                    : '#FEE2E2'
                }
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: NAVY,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {inv.name}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  {inv.turma} · {inv.value}
                </div>
              </div>
              <Badge
                color={
                  inv.status === 'Paga'
                    ? 'green'
                    : inv.status === 'Hoje'
                    ? 'amber'
                    : 'red'
                }
              >
                {inv.status === 'Vencida' ? `${inv.days}d atraso` : inv.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PARENT VIEW ──────────────────────────────────────────────────────────

const emotionalData = [
  { label: 'Resiliência', value: 78, color: '#8b5cf6' },
  { label: 'Participação', value: 91, color: TEAL },
  { label: 'Socialização', value: 85, color: '#3b82f6' },
  { label: 'Foco', value: 62, color: '#f59e0b' },
  { label: 'Responsab.', value: 88, color: '#16a34a' },
];

const entries = [
  {
    type: 'entrada',
    time: '07:15',
    date: 'Hoje',
    icon: LogIn,
    color: '#16a34a',
  },
  {
    type: 'saída',
    time: '17:32',
    date: '22/05',
    icon: LogOut,
    color: '#6b7280',
  },
  {
    type: 'entrada',
    time: '07:09',
    date: '21/05',
    icon: LogIn,
    color: '#16a34a',
  },
];

const messages = [
  {
    from: 'Prof. Mariana Costa',
    subject: 'Trabalho de Ciências – Prazo',
    time: '14:20',
    unread: true,
  },
  {
    from: 'Secretaria',
    subject: 'Confirmação: Reunião de Pais',
    time: '10:05',
    unread: false,
  },
];

function ParentView() {
  const [pixPaid, setPixPaid] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPix, setShowPix] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: NAVY,
          padding: '16px 20px 24px',
          borderRadius: '0 0 24px 24px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              Olá de volta,
            </div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>
              Família Oliveira
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: 8,
                position: 'relative',
              }}
            >
              <Bell size={18} color="#fff" />
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 7,
                  height: 7,
                  background: TEAL,
                  borderRadius: '50%',
                  border: '2px solid ' + NAVY,
                }}
              />
            </div>
            <Avatar name="Família Oliveira" size={36} bg={TEAL} />
          </div>
        </div>
        {/* Aluno Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: TEAL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: NAVY,
            }}
          >
            SO
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
              Sofia Oliveira
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              7º Ano A · Turno Manhã
            </div>
          </div>
          <Badge color="teal">Ativa</Badge>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Financeiro One-Click */}
        <div
          style={{
            background: pixPaid
              ? '#F0FDF4'
              : `linear-gradient(135deg, ${NAVY} 0%, #0a4080 100%)`,
            borderRadius: 20,
            padding: '20px',
            marginBottom: 16,
            boxShadow: '0 4px 24px rgba(3,37,76,0.18)',
          }}
        >
          {!pixPaid ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  MENSALIDADE · MAIO 2025
                </span>
                <Badge color="amber">Vence em 7d</Badge>
              </div>
              <div
                style={{
                  color: '#fff',
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: -1,
                  marginBottom: 4,
                }}
              >
                R$ 1.350,00
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 12,
                  marginBottom: 20,
                }}
              >
                Pagamento via PIX · Desconto de 5% à vista
              </div>
              {!showPix ? (
                <button
                  onClick={() => setShowPix(true)}
                  style={{
                    background: TEAL,
                    color: NAVY,
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px 24px',
                    width: '100%',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Zap size={18} /> Pagar com PIX
                </button>
              ) : (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: 16,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: 12,
                      width: 100,
                      height: 100,
                      margin: '0 auto 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <QrCode size={72} color={NAVY} />
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 11,
                      marginBottom: 12,
                    }}
                  >
                    Chave PIX válida por 30 minutos
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setPixPaid(true)}
                      style={{
                        flex: 1,
                        background: TEAL,
                        color: NAVY,
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px',
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Simular Pagamento
                    </button>
                    <button
                      onClick={() => setShowPix(false)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#DCFCE7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <CheckCircle size={28} color="#16a34a" />
              </div>
              <div
                style={{
                  color: '#15803d',
                  fontSize: 20,
                  fontWeight: 800,
                  marginBottom: 4,
                }}
              >
                Pagamento Confirmado!
              </div>
              <div style={{ color: '#4b7a59', fontSize: 13 }}>
                R$ 1.350,00 · Maio 2025
              </div>
              <button
                onClick={() => {
                  setPixPaid(false);
                  setShowPix(false);
                }}
                style={{
                  marginTop: 14,
                  background: '#DCFCE7',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 20px',
                  fontSize: 12,
                  color: '#15803d',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Ver comprovante
              </button>
            </div>
          )}
        </div>

        {/* Radar Socioemocional */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '16px 20px',
            marginBottom: 16,
            boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>
                Radar Socioemocional
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                Avaliação · Maio 2025
              </div>
            </div>
            <Badge color="teal">
              <Activity size={11} /> Atualizado
            </Badge>
          </div>
          {emotionalData.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}
                >
                  {e.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: e.color }}>
                  {e.value}%
                </span>
              </div>
              <div
                style={{
                  background: '#f4f6f9',
                  borderRadius: 99,
                  height: 7,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${e.value}%`,
                    height: '100%',
                    background: e.color,
                    borderRadius: 99,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Catraca Digital */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '16px 20px',
            marginBottom: 16,
            boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: NAVY,
              fontSize: 14,
              marginBottom: 14,
            }}
          >
            Segurança & Portaria
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div
              style={{
                flex: 1,
                background: '#F0FDF4',
                borderRadius: 12,
                padding: '12px 14px',
                borderLeft: '4px solid #16a34a',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <LogIn size={14} color="#16a34a" />
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: '#15803d' }}
                >
                  ENTRADA
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#15803d' }}>
                07:15
              </div>
              <div style={{ fontSize: 11, color: '#4b7a59' }}>
                Hoje, Catraca 2
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: '#F8FAFC',
                borderRadius: 12,
                padding: '12px 14px',
                borderLeft: '4px solid #9ca3af',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <LogOut size={14} color="#6b7280" />
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}
                >
                  SAÍDA
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#6b7280' }}>
                —
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Aguardando</div>
            </div>
          </div>
          {!showQR ? (
            <button
              onClick={() => setShowQR(true)}
              style={{
                background: NAVY,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '13px 24px',
                width: '100%',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <QrCode size={16} /> Autorizar Saída Antecipada
            </button>
          ) : (
            <div
              style={{
                background: TEAL_LIGHT,
                borderRadius: 12,
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 10,
                  width: 80,
                  height: 80,
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={60} color={NAVY} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0a7a6a' }}>
                QR Code Temporário Gerado
              </div>
              <div style={{ fontSize: 11, color: '#4b9a8a', marginBottom: 10 }}>
                Válido por 15 min · Responsável: Marcos Oliveira
              </div>
              <button
                onClick={() => setShowQR(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #0a7a6a',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontSize: 12,
                  color: '#0a7a6a',
                  cursor: 'pointer',
                }}
              >
                Cancelar autorização
              </button>
            </div>
          )}
        </div>

        {/* Mensagens */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '16px 20px',
            marginBottom: 24,
            boxShadow: '0 2px 12px rgba(3,37,76,0.07)',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: NAVY,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Comunicados Recentes
          </div>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '10px 0',
                borderBottom:
                  i < messages.length - 1 ? '1px solid #f4f6f9' : 'none',
              }}
            >
              {m.unread && (
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: TEAL,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              {!m.unread && <div style={{ width: 7, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>
                  {m.from}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {m.subject}
                </div>
              </div>
              <div
                style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}
              >
                {m.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT VIEW ──────────────────────────────────────────────────────────

const badges = [
  {
    title: 'Assiduidade Perfeita',
    icon: '🏅',
    desc: '30 dias sem falta',
    color: '#FEF3C7',
    border: '#f59e0b',
    earned: true,
  },
  {
    title: 'Aluno Destaque',
    icon: '⭐',
    desc: 'Top 5% da turma',
    color: '#EDE9FE',
    border: '#8b5cf6',
    earned: true,
  },
  {
    title: 'Líder de Turma',
    icon: '🎖️',
    desc: 'Votado pelos colegas',
    color: TEAL_LIGHT,
    border: '#0a7a6a',
    earned: true,
  },
  {
    title: 'Maratonista',
    icon: '📚',
    desc: '10 livros lidos',
    color: '#FEE2E2',
    border: '#dc2626',
    earned: false,
  },
  {
    title: 'Cientista',
    icon: '🔬',
    desc: 'Projeto aprovado',
    color: '#DCFCE7',
    border: '#16a34a',
    earned: false,
  },
  {
    title: 'Artista',
    icon: '🎨',
    desc: 'Exposição escolar',
    color: '#EFF6FF',
    border: '#3b82f6',
    earned: false,
  },
];

const agenda = [
  {
    time: '08:00',
    subject: 'Matemática',
    teacher: 'Prof. Ricardo Alves',
    room: 'Sala 12',
    type: 'Aula',
    color: '#3b82f6',
  },
  {
    time: '09:45',
    subject: 'Redação',
    teacher: 'Profa. Carla Santos',
    room: 'Lab Escrita',
    type: 'Prova',
    color: '#dc2626',
  },
  {
    time: '11:30',
    subject: 'Biologia',
    teacher: 'Prof. Eduardo Lima',
    room: 'Lab Ciências',
    type: 'Aula',
    color: '#16a34a',
  },
  {
    time: '14:00',
    subject: 'Inglês',
    teacher: 'Profa. Amanda Clark',
    room: 'Sala 8',
    type: 'Aula',
    color: '#8b5cf6',
  },
];

const tasks = [
  {
    subject: 'Matemática',
    task: 'Lista 14 – Funções Quadráticas',
    due: 'Hoje',
    urgent: true,
  },
  {
    subject: 'História',
    task: 'Resumo: Revolução Industrial',
    due: 'Amanhã',
    urgent: false,
  },
  {
    subject: 'Física',
    task: 'Relatório Lab – Eletricidade',
    due: '26/05',
    urgent: false,
  },
];

function StudentView() {
  const [activeTab, setActiveTab] = useState('agenda');
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f4d8a 100%)`,
          padding: '16px 20px 28px',
          borderRadius: '0 0 28px 28px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                color: TEAL,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Student Hub
            </div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>
              Olá, Sofia! 👋
            </div>
          </div>
          <Avatar name="Sofia Oliveira" size={38} bg={TEAL} />
        </div>

        {/* XP Bar */}
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '10px 14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              NÍVEL 7 · EXPLORADORA
            </span>
            <span style={{ color: TEAL, fontSize: 11, fontWeight: 700 }}>
              1.240 / 1.500 XP
            </span>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 99,
              height: 8,
            }}
          >
            <div
              style={{
                width: '82%',
                height: '100%',
                background: TEAL,
                borderRadius: 99,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: -1,
                  top: -2,
                  width: 12,
                  height: 12,
                  background: TEAL,
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  boxShadow: '0 0 6px ' + TEAL,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Carteirinha Digital */}
        <div
          style={{ perspective: 1000, marginBottom: 20 }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            style={{
              position: 'relative',
              height: 180,
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'none',
            }}
          >
            {/* Front */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: `linear-gradient(135deg, ${NAVY} 0%, #0a4080 100%)`,
                borderRadius: 20,
                padding: '20px 22px',
                boxShadow: '0 8px 32px rgba(3,37,76,0.25)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: -20,
                  top: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(0,245,212,0.06)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 20,
                  bottom: -30,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(0,245,212,0.08)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      color: TEAL,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      marginBottom: 3,
                    }}
                  >
                    Dilon Edu · Carteirinha Digital
                  </div>
                  <div style={{ color: '#fff', fontSize: 17, fontWeight: 800 }}>
                    Sofia Oliveira
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    7º Ano A · Matrícula: 2025-1247
                  </div>
                </div>
                <GraduationCap size={28} color={TEAL} />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 9,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    VÁLIDO ATÉ
                  </div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
                    12/2025
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 9,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    UNIDADE
                  </div>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                    Laranjeiras
                  </div>
                </div>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QrCode size={36} color={NAVY} />
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'rgba(255,255,255,0.25)',
                  fontSize: 10,
                }}
              >
                toque para virar
              </div>
            </div>
            {/* Back */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: '#fff',
                borderRadius: 20,
                padding: '20px 22px',
                boxShadow: '0 8px 32px rgba(3,37,76,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <QrCode size={100} color={NAVY} />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: NAVY,
                  marginTop: 12,
                }}
              >
                QR Code de Acesso
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                Sofia Oliveira · Mat. 2025-1247
              </div>
              <div style={{ marginTop: 10 }}>
                <Badge color="teal">
                  <Wifi size={10} /> Sincronizado
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { k: 'agenda', label: 'Agenda' },
            { k: 'badges', label: 'Conquistas' },
            { k: 'tasks', label: 'Tarefas' },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setActiveTab(t.k)}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === t.k ? NAVY : '#fff',
                color: activeTab === t.k ? '#fff' : '#6b7280',
                fontWeight: 700,
                fontSize: 12,
                boxShadow:
                  activeTab === t.k
                    ? '0 4px 12px rgba(3,37,76,0.25)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Agenda Tab */}
        {activeTab === 'agenda' && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>
                Hoje · 23 de Maio
              </span>
              <Badge color="navy">Sexta-feira</Badge>
            </div>
            {agenda.map((a, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 12, marginBottom: 10 }}
              >
                <div
                  style={{
                    width: 40,
                    paddingTop: 14,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}
                  >
                    {a.time}
                  </div>
                </div>
                <div
                  style={{
                    width: 3,
                    background: '#f4f6f9',
                    borderRadius: 99,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: -3,
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: a.color,
                      border: '2px solid #fff',
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: 14,
                    padding: '12px 14px',
                    boxShadow: '0 2px 8px rgba(3,37,76,0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{ fontWeight: 700, fontSize: 13, color: NAVY }}
                    >
                      {a.subject}
                    </span>
                    <span
                      style={{
                        background: a.type === 'Prova' ? '#FEE2E2' : '#EFF6FF',
                        color: a.type === 'Prova' ? '#dc2626' : '#3b82f6',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 99,
                      }}
                    >
                      {a.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {a.teacher} · {a.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <span style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>
                Suas Conquistas
              </span>
              <Badge color="teal">3 / 6 desbloqueadas</Badge>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              {badges.map((b, i) => (
                <div
                  key={i}
                  style={{
                    background: b.earned ? b.color : '#f4f6f9',
                    borderRadius: 16,
                    padding: '16px 14px',
                    textAlign: 'center',
                    border: `2px solid ${b.earned ? b.border : '#e5e7eb'}`,
                    opacity: b.earned ? 1 : 0.5,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {!b.earned && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 8,
                        fontSize: 14,
                      }}
                    >
                      🔒
                    </div>
                  )}
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: NAVY,
                      lineHeight: 1.2,
                      marginBottom: 4,
                    }}
                  >
                    {b.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontWeight: 700,
                color: NAVY,
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              Tarefas Pendentes
            </div>
            {tasks.map((t, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '14px 16px',
                  marginBottom: 10,
                  boxShadow: '0 2px 8px rgba(3,37,76,0.06)',
                  borderLeft: `4px solid ${t.urgent ? '#dc2626' : '#e5e7eb'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#9ca3af',
                        marginBottom: 3,
                        textTransform: 'uppercase',
                      }}
                    >
                      {t.subject}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>
                      {t.task}
                    </div>
                  </div>
                  <Badge color={t.urgent ? 'red' : 'navy'}>{t.due}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────

const TABS = [
  { key: 'admin', label: 'Gestão', icon: LayoutDashboard },
  { key: 'parent', label: 'Pais', icon: Users },
  { key: 'student', label: 'Aluno', icon: GraduationCap },
];

export default function DilonEdu() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        maxWidth: 430,
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* CORREÇÃO DO ACABAMENTO E ALINHAMENTO */}
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {activeTab === 'admin' && <AdminView />}
        {activeTab === 'parent' && <ParentView />}
        {activeTab === 'student' && <StudentView />}
      </div>

      {/* Bottom Nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: '#fff',
          borderTop: '1px solid #f0f4f8',
          padding: '10px 12px 16px',
          display: 'flex',
          gap: 4,
          boxShadow: '0 -4px 24px rgba(3,37,76,0.10)',
          zIndex: 50,
        }}
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px',
              borderRadius: 12,
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                padding: '6px 18px',
                borderRadius: 12,
                background: activeTab === key ? TEAL_LIGHT : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <Icon
                size={20}
                color={activeTab === key ? '#0a7a6a' : '#9ca3af'}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: activeTab === key ? '#0a7a6a' : '#9ca3af',
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
