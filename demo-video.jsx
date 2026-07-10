/* Demo silencioso 30s — Essência Planejados
   Screen-recording style: browser frame, cursor animado, câmera com zoom/pan,
   scroll pela página e interações (tabs, hover, simulador). */

const { Stage, useTime, Easing, interpolate, clamp } = window;

/* ---------- constantes de marca ---------- */
const A = '#B08D57', AD = '#997641', DARK = '#191612', ICE = '#F7F5F1';
const PF = "'Playfair Display', serif", IN = "'Inter', sans-serif";

/* ---------- geometria da página (dentro do viewport 1560x888) ---------- */
const VW = 1560, VH = 888, NAVH = 72;
const P0 = 888;            // portfólio
const G0 = P0 + 200;       // grid
const PR0 = 1988;          // processo
const SM0 = 2628;          // simulador
const F0 = 3428;           // rodapé
const PAGE_H = 3908;

const COLX = [64, 552, 1040], CARDW = 456, IMGH = 342, ROWH = 416;
const TABS = [
  { label: 'Todos', x: 924, w: 90 },
  { label: 'Cozinhas', x: 1024, w: 110 },
  { label: 'Dormitórios', x: 1144, w: 130 },
  { label: 'Salas', x: 1284, w: 84 },
  { label: 'Banheiros', x: 1378, w: 118 },
];

const WOODS = [
  'linear-gradient(135deg,#7A5B3E 0%,#A0805C 60%,#8A6A4C 100%)',
  'linear-gradient(135deg,#5C4632 0%,#8A6A4C 55%,#6B5240 100%)',
  'linear-gradient(150deg,#8A6A4C 0%,#B08D57 70%,#7A5B3E 100%)',
  'linear-gradient(135deg,#4A372A 0%,#7A5B3E 60%,#5C4632 100%)',
];
const RIPA = 'repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0 6px, rgba(255,255,255,0.03) 6px 12px, transparent 12px 30px)';

const IT = (t, c, g, r) => ({ t, c, g, r });
const SETS = {
  0: [IT('Cozinha com Ilha Central', 'Cozinhas', 0), IT('Cozinha Linear Ripada', 'Cozinhas', 1, 1), IT('Closet Aberto de Casal', 'Dormitórios', 2),
      IT('Home Theater Ripado', 'Salas', 3, 1), IT('Cozinha Gourmet Integrada', 'Cozinhas', 1), IT('Gabinete Duplo Amadeirado', 'Banheiros', 0)],
  1: [IT('Cozinha com Ilha Central', 'Cozinhas', 0), IT('Cozinha Linear Ripada', 'Cozinhas', 1, 1), IT('Cozinha Gourmet Integrada', 'Cozinhas', 2)],
  2: [IT('Closet Aberto de Casal', 'Dormitórios', 2), IT('Dormitório com Cabeceira', 'Dormitórios', 1)],
};

/* ---------- timeline ---------- */
const EC = Easing.easeInOutCubic;
const SCROLL = interpolate(
  [0, 5.0, 6.4, 12.4, 13.5, 16.0, 16.9, 24.2, 25.2],
  [0, 0, 816, 816, 1916, 1916, 2584, 2584, 3020], EC);

const CAMT = [0, 7.6, 8.6, 10.5, 11.1, 12.4, 13.2, 15.9, 16.9, 21.4, 23.9, 24.9, 30];
const CAMS = interpolate(CAMT, [1, 1, 1.35, 1.35, 1.3, 1.3, 1, 1.06, 1.4, 1.4, 1.5, 1, 1], EC);
const CAMX = interpolate(CAMT, [960, 960, 1330, 1330, 472, 472, 960, 980, 1318, 1318, 1318, 960, 960], EC);
const CAMY = interpolate(CAMT, [540, 540, 326, 326, 586, 586, 540, 560, 522, 522, 682, 540, 540], EC);

const PTS = [[1.8, 1300, 700], [3.0, 215, 615], [4.4, 465, 615], [5.2, 465, 615], [7.6, 1079, 204], [8.5, 1079, 204],
  [9.4, 1209, 204], [9.9, 1209, 204], [10.7, 292, 464], [12.3, 292, 464], [13.8, 220, 450], [15.8, 1280, 480],
  [16.8, 1138, 269], [17.4, 1138, 269], [18.0, 1138, 362], [18.5, 1138, 362], [19.2, 966, 380], [19.5, 966, 380],
  [20.6, 1069, 380], [21.1, 1138, 472], [21.5, 1138, 472], [22.5, 1250, 560], [25.2, 85, 659], [25.9, 141, 659],
  [26.5, 197, 659], [27.5, 320, 760]];
const CT = PTS.map(p => p[0]);
const CXF = interpolate(CT, PTS.map(p => p[1]), EC);
const CYF = interpolate(CT, PTS.map(p => p[2]), EC);
const CLICKS = [4.9, 8.45, 9.85, 17.35, 18.45, 21.45];

/* estados derivados do tempo */
const st = (t) => ({
  tab: t < 8.45 ? 0 : t < 9.85 ? 1 : 2,
  ctaH: t > 3.0 && t < 4.4,
  verH: t > 4.4 && t < 5.4,
  tabH: t > 7.6 && t < 8.5 ? 1 : t > 9.4 && t < 9.9 ? 2 : -1,
  cardH: t > 10.7 && t < 12.4,
  selOpen: t >= 17.35 && t < 18.45,
  optH: t >= 18.0 && t < 18.45,
  ambiente: t < 18.45 ? 'Cozinha' : 'Dormitório / Closet',
  metragem: Math.round(interpolate([19.5, 20.6], [6, 9], Easing.easeInOutQuad)(clamp(t, 19.5, 20.6))),
  drag: t > 19.5 && t < 20.6,
  calcH: t > 21.1 && t < 22.2,
  press: t > 21.45 && t < 21.62,
  result: t > 21.7,
  socH: t > 25.2 && t < 25.9 ? 0 : t >= 25.9 && t < 26.5 ? 1 : t >= 26.5 && t < 27.1 ? 2 : -1,
});

/* reveal helper */
const rv = (t, s, d = 0.7, dist = 26) => {
  const p = Easing.easeOutCubic(clamp((t - s) / d, 0, 1));
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

/* ---------- pedaços de UI ---------- */
const Eyebrow = ({ text, light, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'absolute', ...style }}>
    <div style={{ width: 44, height: 1, background: A }} />
    <span style={{ fontFamily: IN, fontSize: 12, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: A }}>{text}</span>
  </div>
);

const Btn = ({ x, y, w, label, hover, ghost, press }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: 56, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: ghost ? 'transparent' : (hover ? AD : A),
    border: ghost ? `1px solid ${hover ? A : 'rgba(247,245,241,0.35)'}` : 'none',
    color: ghost ? (hover ? A : ICE) : '#fff',
    fontFamily: IN, fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
    transform: `translateY(${hover && !ghost ? -2 : 0}px) scale(${press ? 0.97 : 1})`,
    transition: 'none',
  }}>{label}</div>
);

const NavBar = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: VW, height: NAVH, background: 'rgba(247,245,241,0.96)', borderBottom: '1px solid rgba(25,22,18,0.08)', zIndex: 5, display: 'flex', alignItems: 'center', boxSizing: 'border-box', padding: '0 64px' }}>
    <span style={{ fontFamily: PF, fontSize: 21, fontWeight: 500, color: DARK }}>Essência <span style={{ fontStyle: 'italic', color: A }}>Planejados</span></span>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 28 }}>
      {['Início', 'Portfólio', 'Processo', 'Orçamento', 'Contato'].map((l) => (
        <span key={l} style={{ fontFamily: IN, fontSize: 13.5, fontWeight: 500, color: '#5A544B', letterSpacing: '0.04em' }}>{l}</span>
      ))}
      <div style={{ background: A, color: '#fff', fontFamily: IN, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '11px 20px' }}>Solicitar Projeto</div>
    </div>
  </div>
);

const Hero = ({ t, s }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: VW, height: VH, background: DARK, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,#3A2C20 0%,#6B4E36 45%,#8A6A4C 75%,#4A372A 100%)', transform: `scale(${1.08 - 0.06 * clamp(t / 6, 0, 1)})` }}>
      <div style={{ position: 'absolute', inset: 0, background: RIPA, opacity: 0.5 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 40%, transparent 30%, rgba(15,12,9,0.55) 100%)' }} />
    </div>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,17,14,0.85) 0%, rgba(20,17,14,0.6) 48%, rgba(20,17,14,0.12) 100%)' }} />
    <Eyebrow text="Móveis planejados sob medida" style={{ left: 90, top: 272, ...rv(t, 0.4, 0.8) }} />
    <div style={{ position: 'absolute', left: 90, top: 308, width: 780, fontFamily: PF, fontWeight: 500, fontSize: 62, lineHeight: 1.12, color: ICE, ...rv(t, 0.6, 0.9) }}>
      Transforme seu espaço na sua <em style={{ fontStyle: 'italic', color: A }}>melhor versão</em>
    </div>
    <div style={{ position: 'absolute', left: 90, top: 476, width: 470, fontFamily: IN, fontSize: 16, lineHeight: 1.7, color: 'rgba(247,245,241,0.72)', ...rv(t, 0.9, 0.9) }}>
      Projetos exclusivos que unem sofisticação, funcionalidade e o acabamento preciso de uma marcenaria de alto padrão.
    </div>
    <div style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, ...rv(t, 1.15, 0.9) }}>
      <Btn x={90} y={585} w={250} label="Solicitar Projeto" hover={s.ctaH} />
      <Btn x={360} y={585} w={210} label="Ver Portfólio" ghost hover={s.verH} press={t > 4.9 && t < 5.05} />
    </div>
  </div>
);

const Card = ({ x, y, item, style, hoverZoom }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: CARDW, ...style }}>
    <div style={{ width: CARDW, height: IMGH, overflow: 'hidden', background: '#E9E2D6' }}>
      <div style={{ width: '100%', height: '100%', background: WOODS[item.g], transform: `scale(${hoverZoom ? 1.06 : 1})` }}>
        {item.r ? <div style={{ position: 'absolute', inset: 0, background: RIPA, opacity: 0.45 }} /> : null}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.1), transparent 60%)' }} />
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
      <span style={{ fontFamily: PF, fontSize: 18, color: DARK }}>{item.t}</span>
      <span style={{ fontFamily: IN, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: A }}>{item.c}</span>
    </div>
  </div>
);

const Portfolio = ({ t, s }) => {
  const phaseStart = s.tab === 0 ? 5.9 : s.tab === 1 ? 8.5 : 9.9;
  const stag = s.tab === 0 ? 0.15 : 0.08;
  const dur = s.tab === 0 ? 0.7 : 0.4;
  const items = SETS[s.tab];
  return (
    <div style={{ position: 'absolute', top: P0, left: 0, width: VW, height: 1100, background: ICE }}>
      <Eyebrow text="Portfólio" style={{ left: 64, top: 90 }} />
      <div style={{ position: 'absolute', left: 64, top: 122, fontFamily: PF, fontSize: 42, fontWeight: 500, color: DARK }}>
        Ambientes que contam <em style={{ fontStyle: 'italic' }}>histórias</em>
      </div>
      {TABS.map((tb, i) => {
        const active = i === s.tab, hov = i === s.tabH;
        return (
          <div key={tb.label} style={{
            position: 'absolute', left: tb.x - P0 * 0, top: 110, width: tb.w, height: 44, boxSizing: 'border-box',
            left: tb.x, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${active || hov ? DARK : '#D8D1C5'}`, background: active ? DARK : 'transparent',
            color: active ? ICE : '#6B6258', fontFamily: IN, fontSize: 13, fontWeight: 500,
          }}>{tb.label}</div>
        );
      })}
      {items.map((item, i) => (
        <Card key={s.tab + '-' + i} x={COLX[i % 3]} y={200 + Math.floor(i / 3) * ROWH} item={item}
          style={rv(t, phaseStart + i * stag, dur)} hoverZoom={s.cardH && s.tab === 2 && i === 0} />
      ))}
    </div>
  );
};

const PROC = [
  { n: '01', ti: 'Atendimento Consultivo', d: 'Escuta ativa para entender rotina, estilo e as necessidades de cada ambiente.', ic: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { n: '02', ti: 'Projeto 3D Realista', d: 'Visualização fiel do ambiente antes da produção, com revisões incluídas.', ic: <g><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></g> },
  { n: '03', ti: 'Fabricação Própria', d: 'MDF premium, ferragens importadas e controle rigoroso de qualidade.', ic: <g><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /></g> },
  { n: '04', ti: 'Montagem Especializada', d: 'Instalação limpa e precisa, com prazo garantido em contrato.', ic: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
];

const Processo = ({ t }) => (
  <div style={{ position: 'absolute', top: PR0, left: 0, width: VW, height: 640, background: DARK }}>
    <Eyebrow text="Como trabalhamos" style={{ left: 64, top: 80 }} />
    <div style={{ position: 'absolute', left: 64, top: 112, fontFamily: PF, fontSize: 42, fontWeight: 500, color: ICE }}>
      Do primeiro traço à <em style={{ fontStyle: 'italic', color: A }}>montagem final</em>
    </div>
    {PROC.map((p, i) => (
      <div key={p.n} style={{
        position: 'absolute', left: 64 + i * 363, top: 210, width: 343, height: 300, boxSizing: 'border-box',
        border: '1px solid rgba(247,245,241,0.14)', padding: '32px 28px', ...rv(t, 13.7 + i * 0.18, 0.7),
      }}>
        <div style={{ fontFamily: PF, fontStyle: 'italic', fontSize: 36, color: A, opacity: 0.85 }}>{p.n}</div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 16 }}>{p.ic}</svg>
        <div style={{ fontFamily: IN, fontSize: 16, fontWeight: 600, color: ICE, marginTop: 16 }}>{p.ti}</div>
        <div style={{ fontFamily: IN, fontSize: 13, lineHeight: 1.65, color: 'rgba(247,245,241,0.55)', marginTop: 10 }}>{p.d}</div>
      </div>
    ))}
  </div>
);

const OPTIONS = ['Cozinha', 'Dormitório / Closet', 'Sala / Home Theater', 'Banheiro', 'Home Office'];

const Simulador = ({ t, s }) => {
  const knobX = 48 + ((s.metragem - 2) / 18) * 620;
  return (
    <div style={{ position: 'absolute', top: SM0, left: 0, width: VW, height: 800, background: ICE }}>
      <Eyebrow text="Orçamento rápido" style={{ left: 64, top: 180 }} />
      <div style={{ position: 'absolute', left: 64, top: 214, width: 600, fontFamily: PF, fontSize: 42, fontWeight: 500, color: DARK }}>
        Simule seu <em style={{ fontStyle: 'italic' }}>investimento</em>
      </div>
      <div style={{ position: 'absolute', left: 64, top: 300, width: 560, fontFamily: IN, fontSize: 15, lineHeight: 1.8, color: '#6B6258' }}>
        Selecione o ambiente e a metragem aproximada para receber uma estimativa imediata. O valor final é definido após visita técnica e projeto detalhado — sem compromisso.
      </div>
      <div style={{ position: 'absolute', left: 780, top: 120, width: 716, height: 560, background: '#fff', border: '1px solid #E5DFD3', boxShadow: '0 24px 60px -30px rgba(25,22,18,0.18)' }}>
        <div style={{ position: 'absolute', left: 48, top: 44, fontFamily: IN, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A8177' }}>Ambiente</div>
        <div style={{ position: 'absolute', left: 48, top: 72, width: 620, height: 54, boxSizing: 'border-box', background: '#F7F5F1', border: `1px solid ${s.selOpen ? A : '#E0D9CC'}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: IN, fontSize: 15, color: DARK }}>
          {s.ambiente}
          <svg width="12" height="8" viewBox="0 0 12 8" style={{ marginLeft: 'auto', transform: s.selOpen ? 'rotate(180deg)' : 'none' }}><path d="M1 1l5 5 5-5" stroke={DARK} fill="none" strokeWidth="1.5" /></svg>
        </div>
        {s.selOpen ? (
          <div style={{ position: 'absolute', left: 48, top: 128, width: 620, background: '#fff', border: '1px solid #E0D9CC', boxShadow: '0 20px 40px -20px rgba(25,22,18,0.3)', zIndex: 4 }}>
            {OPTIONS.map((o, i) => (
              <div key={o} style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: IN, fontSize: 14.5, color: DARK, background: s.optH && i === 1 ? '#F3EEE4' : '#fff' }}>{o}</div>
            ))}
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 48, top: 168, fontFamily: IN, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A8177' }}>Metragem linear</div>
        <div style={{ position: 'absolute', right: 48, top: 154, fontFamily: PF, fontSize: 24, color: DARK }}>{s.metragem} m</div>
        <div style={{ position: 'absolute', left: 48, top: 212, width: 620, height: 4, borderRadius: 2, background: '#E5DFD3' }}>
          <div style={{ width: knobX - 48, height: 4, borderRadius: 2, background: A }} />
        </div>
        <div style={{ position: 'absolute', left: knobX - 9, top: 205, width: 18, height: 18, borderRadius: '50%', background: A, boxShadow: '0 2px 8px rgba(25,22,18,0.3)', transform: `scale(${s.drag ? 1.25 : 1})` }} />
        <div style={{ position: 'absolute', left: 48, top: 232, width: 620, display: 'flex', justifyContent: 'space-between', fontFamily: IN, fontSize: 11.5, color: '#A79E92' }}><span>2 m</span><span>20 m</span></div>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <Btn x={48} y={280} w={620} label="Calcular Estimativa" hover={s.calcH} press={s.press} />
        </div>
        {s.result ? (
          <div style={{ position: 'absolute', left: 48, top: 368, width: 620, borderTop: '1px solid #EBE5D9', ...rv(t, 21.7, 0.6, 18) }}>
            <div style={{ marginTop: 20, fontFamily: IN, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A8177' }}>Estimativa · Dormitório · 9 m lineares</div>
            <div style={{ marginTop: 8, fontFamily: PF, fontSize: 32, color: DARK }}>R$ 19.890 <span style={{ fontSize: 19, color: '#A79E92' }}>a</span> R$ 26.910</div>
            <div style={{ marginTop: 8, fontFamily: IN, fontSize: 12, lineHeight: 1.6, color: '#A79E92' }}>*Estimativa baseada em projetos médios. Solicite uma visita técnica para o valor exato.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const SOC = [
  <g><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37a4 4 0 1 1-7.9 1.13 4 4 0 0 1 7.9-1.13z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></g>,
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  <g><circle cx="12" cy="12" r="10" /><path d="M8 20l4-9" /><path d="M10.7 14c.4 1.2 1.6 2 3 2 2.4 0 4.3-2 4.3-4.5A6 6 0 1 0 6.5 14" /></g>,
];

const Footer = ({ s }) => (
  <div style={{ position: 'absolute', top: F0, left: 0, width: VW, height: 480, background: DARK }}>
    <div style={{ position: 'absolute', left: 64, top: 80, fontFamily: PF, fontSize: 23, fontWeight: 500, color: ICE }}>Essência <span style={{ fontStyle: 'italic', color: A }}>Planejados</span></div>
    <div style={{ position: 'absolute', left: 64, top: 126, width: 290, fontFamily: IN, fontSize: 13.5, lineHeight: 1.8, color: 'rgba(247,245,241,0.55)' }}>Móveis planejados que traduzem a sua essência, com sofisticação e funcionalidade em cada detalhe.</div>
    {SOC.map((p, i) => (
      <div key={i} style={{ position: 'absolute', left: 64 + i * 56, top: 230, width: 42, height: 42, boxSizing: 'border-box', border: `1px solid ${s.socH === i ? A : 'rgba(247,245,241,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={s.socH === i ? A : ICE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{p}</svg>
      </div>
    ))}
    <div style={{ position: 'absolute', left: 560, top: 84, fontFamily: IN, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: A }}>Contato</div>
    <div style={{ position: 'absolute', left: 560, top: 118, fontFamily: IN, fontSize: 14, lineHeight: 2.2, color: 'rgba(247,245,241,0.75)' }}>(11) 4002-8922<br />WhatsApp (11) 98765-4321<br />contato@essenciaplanejados.com.br</div>
    <div style={{ position: 'absolute', left: 1020, top: 84, fontFamily: IN, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: A }}>Showroom</div>
    <div style={{ position: 'absolute', left: 1020, top: 118, fontFamily: IN, fontSize: 14, lineHeight: 1.9, color: 'rgba(247,245,241,0.75)' }}>Al. Gabriel Monteiro da Silva, 1200<br />Jardins — São Paulo/SP</div>
    <div style={{ position: 'absolute', left: 64, right: 64, top: 380, borderTop: '1px solid rgba(247,245,241,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: IN, fontSize: 12, color: 'rgba(247,245,241,0.4)' }}>
      <span>© 2026 Essência Planejados. Todos os direitos reservados.</span><span>CNPJ 00.000.000/0001-00</span>
    </div>
  </div>
);

/* ---------- cursor ---------- */
const Cursor = ({ t }) => {
  const tc = clamp(t, CT[0], CT[CT.length - 1]);
  const x = CXF(tc), y = CYF(tc);
  const op = t < 1.5 ? 0 : t < 2 ? (t - 1.5) * 2 : t > 27.2 ? clamp(1 - (t - 27.2) / 0.6, 0, 1) : 1;
  const pressed = CLICKS.some((c) => t > c - 0.08 && t < c + 0.16) || (t > 19.5 && t < 20.6);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 20, transform: `translate(${x}px,${y}px)`, opacity: op, pointerEvents: 'none' }}>
      {CLICKS.map((c) => {
        if (t <= c || t >= c + 0.55) return null;
        const p = (t - c) / 0.55;
        return <div key={c} style={{ position: 'absolute', left: -8 - p * 30, top: -8 - p * 30, width: 16 + p * 60, height: 16 + p * 60, borderRadius: '50%', border: `2px solid ${A}`, opacity: 0.6 * (1 - p) }} />;
      })}
      <svg width="26" height="28" viewBox="0 0 22 24" style={{ transform: `scale(${pressed ? 0.82 : 1})`, transformOrigin: '5px 3px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
        <path d="M6 3 L6 19 L10.2 15.4 L12.8 21 L15.6 19.7 L13 14.2 L18.5 14.2 Z" fill={DARK} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ---------- cena ---------- */
const Movie = () => {
  const t = useTime();
  const s = st(t);
  const sy = SCROLL(clamp(t, 0, 25.2));
  const cs = CAMS(t), cx = CAMX(t), cy = CAMY(t);
  const cam = `translate(${960 - cs * cx}px, ${540 - cs * cy}px) scale(${cs})`;
  const endP = clamp((t - 26.8) / 0.9, 0, 1);
  const logoP = Easing.easeOutCubic(clamp((t - 27.2) / 1.2, 0, 1));
  return (
    <div data-screen-label={'t=' + Math.floor(t) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0E0C0A' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(176,141,87,0.08), transparent 65%)' }} />
      <div style={{ position: 'absolute', inset: 0, transform: cam, transformOrigin: '0 0' }}>
        {/* browser frame */}
        <div style={{ position: 'absolute', left: 180, top: 70, width: VW, height: 940, borderRadius: 12, background: '#E9E4DB', boxShadow: '0 50px 120px -40px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#E0655A' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#E0B23F' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#7FB069' }} />
            <div style={{ margin: '0 auto', width: 460, height: 30, borderRadius: 8, background: '#F7F5F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: IN, fontSize: 12.5, color: '#8A8177' }}>essenciaplanejados.com.br</div>
            <div style={{ width: 60 }} />
          </div>
          {/* viewport */}
          <div style={{ position: 'absolute', top: 52, left: 0, width: VW, height: VH, overflow: 'hidden', background: ICE }}>
            <div style={{ position: 'absolute', left: 0, top: -sy, width: VW, height: PAGE_H }}>
              <Hero t={t} s={s} />
              <Portfolio t={t} s={s} />
              <Processo t={t} />
              <Simulador t={t} s={s} />
              <Footer s={s} />
            </div>
            <NavBar />
            <Cursor t={t} />
          </div>
        </div>
      </div>
      {/* encerramento */}
      {endP > 0 ? (
        <div style={{ position: 'absolute', inset: 0, background: DARK, opacity: endP, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', opacity: logoP, transform: `scale(${0.94 + 0.06 * logoP})` }}>
            <div style={{ width: 56, height: 1, background: A, margin: '0 auto 28px' }} />
            <div style={{ fontFamily: PF, fontSize: 76, fontWeight: 500, color: ICE }}>Essência <span style={{ fontStyle: 'italic', color: A }}>Planejados</span></div>
            <div style={{ marginTop: 20, fontFamily: IN, fontSize: 17, letterSpacing: '0.06em', color: 'rgba(247,245,241,0.6)' }}>Transforme seu espaço na sua melhor versão.</div>
            <div style={{ marginTop: 44, fontFamily: IN, fontSize: 13, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: A }}>essenciaplanejados.com.br</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

window.DemoVideo = function DemoVideo() {
  return (
    <Stage width={1920} height={1080} duration={30} background="#0E0C0A" autoplay loop>
      <Movie />
    </Stage>
  );
};
