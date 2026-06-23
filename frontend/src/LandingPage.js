import { useState } from 'react';

export default function LandingPage({ onEnter, isLoggedIn, onBack }) {
  const [plate, setPlate] = useState('');

  return (
    <div className="lp">

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo">🚗 AutoTrack BR</span>
          <div className="lp-nav-actions">
            {isLoggedIn ? (
              <button onClick={onBack} className="lp-btn-solid">← Voltar ao app</button>
            ) : (
              <>
                <button onClick={() => onEnter('login')} className="lp-btn-ghost">Entrar</button>
                <button onClick={() => onEnter('register')} className="lp-btn-solid">Criar conta</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-text">
          <div className="lp-badge">🇧🇷 Feito para o Brasil</div>
          <h1>Confia em dados concretos,<br />não em promessas.</h1>
          <p className="lp-hero-sub">
            O AutoTrack BR registra acidentes, roubos, leilões e manutenções de qualquer veículo.
            Consulte o histórico antes de comprar — evite surpresas.
          </p>
          <form className="lp-search" onSubmit={e => { e.preventDefault(); onEnter('login', plate); }}>
            <input
              value={plate}
              onChange={e => setPlate(e.target.value.toUpperCase().slice(0, 7))}
              placeholder="Digite a placa  Ex: ABC1D23"
              maxLength={7}
            />
            <button type="submit">Consultar</button>
          </form>
          <div className="lp-hero-checks">
            <span>✓ Cadastro gratuito</span>
            <span>✓ Dados do DETRAN</span>
            <span>✓ 100% digital</span>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-mock">
            <div className="lp-mock-header">
              <span className="lp-mock-plate">ABC·1D23</span>
              <span className="lp-mock-year">2020 · Flex</span>
            </div>
            <div className="lp-mock-row warn">
              <span>🚨</span><span>1 acidente registrado</span>
            </div>
            <div className="lp-mock-row ok">
              <span>✅</span><span>Não consta como roubado</span>
            </div>
            <div className="lp-mock-row ok">
              <span>✅</span><span>Nunca foi a leilão</span>
            </div>
            <div className="lp-mock-row ok">
              <span>🔧</span><span>5 manutenções registradas</span>
            </div>
            <div className="lp-mock-row neutral">
              <span>📋</span><span>3 transferências de proprietário</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefícios ── */}
      <section className="lp-section lp-section-light">
        <div className="lp-container">
          <h2 className="lp-section-title">O primeiro passo de quem não arrisca</h2>
          <p className="lp-section-sub">Consulte o histórico antes de fechar negócio e negocie com segurança</p>
          <div className="lp-benefits">
            {[
              { icon: '🛡️', title: 'Evite erros que saem caro', desc: 'Descubra rapidamente danos, acidentes e manipulações de quilometragem antes de comprar.' },
              { icon: '🔍', title: 'Encontre o veículo certo', desc: 'Confirme primeiro os dados online e visite apenas os veículos que realmente valem a pena.' },
              { icon: '💰', title: 'Negocie com informação', desc: 'Conheça a história do veículo e use os fatos para negociar um preço justo.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="lp-benefit-card">
                <div className="lp-benefit-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section lp-section-white">
        <div className="lp-container">
          <h2 className="lp-section-title">Contamos o que mais ninguém te conta</h2>
          <p className="lp-section-sub">O AutoTrack BR registra múltiplos tipos de eventos para te dar uma visão completa do veículo</p>
          <div className="lp-features-grid">
            {[
              { icon: '🚨', title: 'Detecta acidentes e sinistros', desc: 'Saiba se o veículo passou por colisões ou foi declarado perda total.', color: '#fef2f2', border: '#fecaca' },
              { icon: '🔓', title: 'Identifica roubos e furtos', desc: 'Verifique se o veículo consta como roubado ou furtado nas bases do DETRAN.', color: '#fef2f2', border: '#fecaca' },
              { icon: '🔨', title: 'Histórico de leilão', desc: 'Descubra se o veículo já foi a leilão e qual foi o motivo da arrematação.', color: '#fefce8', border: '#fde68a' },
              { icon: '🔧', title: 'Registro de manutenções', desc: 'Acompanhe o histórico completo de revisões e serviços realizados.', color: '#f0fdf4', border: '#bbf7d0' },
              { icon: '📋', title: 'Histórico de transferências', desc: 'Saiba quantos donos o veículo já teve e quando as transferências ocorreram.', color: '#eff6ff', border: '#bfdbfe' },
              { icon: '📄', title: 'Multas e infrações', desc: 'Consulte infrações e autos de infração associados ao veículo.', color: '#fff7ed', border: '#fed7aa' },
            ].map(({ icon, title, desc, color, border }) => (
              <div key={title} className="lp-feature-card" style={{ background: color, borderColor: border }}>
                <span className="lp-feature-icon">{icon}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="lp-section lp-section-dark">
        <div className="lp-container">
          <h2 className="lp-section-title" style={{ color: 'white' }}>Como funciona</h2>
          <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>Simples, rápido e direto ao ponto</p>
          <div className="lp-steps">
            {[
              { n: '1', title: 'Crie sua conta', desc: 'Cadastro gratuito em menos de 1 minuto.' },
              { n: '2', title: 'Cadastre o veículo', desc: 'Informe placa, marca, modelo e demais dados.' },
              { n: '3', title: 'Registre eventos', desc: 'Adicione manutenções, acidentes, transferências e fotos.' },
              { n: '4', title: 'Consulte quando quiser', desc: 'Busque qualquer veículo pela placa a qualquer momento.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="lp-step">
                <div className="lp-step-n">{n}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-container lp-cta-inner">
          <div>
            <h2>Comece agora mesmo</h2>
            <p>Crie sua conta grátis e registre o histórico completo dos seus veículos</p>
          </div>
          <div className="lp-cta-buttons">
            <button onClick={() => onEnter('register')} className="lp-btn-solid lp-btn-lg">Criar conta grátis</button>
            <button onClick={() => onEnter('login')} className="lp-btn-outline lp-btn-lg">Já tenho conta</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <span className="lp-logo" style={{ fontSize: 16 }}>🚗 AutoTrack BR</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Sistema de Histórico Veicular Brasileiro</span>
        </div>
      </footer>

    </div>
  );
}
