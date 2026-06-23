import { useState, useEffect } from 'react';
import './App.css';
import api, { BASE_URL } from './api';
import LandingPage from './LandingPage';
import { useToast, ToastContainer } from './components/Toast';
import PhotoLightbox from './components/PhotoLightbox';
import FipeSearch from './components/FipeSearch';
import KmChart from './components/KmChart';

const EVENT_LABELS = {
  ACCIDENT:    '🚨 Acidente',
  THEFT:       '🔓 Roubo/Furto',
  AUCTION:     '🔨 Leilão',
  MAINTENANCE: '🔧 Manutenção',
  TRANSFER:    '📋 Transferência',
  FINE:        '📄 Multa',
};

const STATUS_META = {
  REGULAR: ['badge-regular', 'Regular'],
  STOLEN:  ['badge-stolen',  'Roubado'],
  AUCTION: ['badge-auction', 'Leilão'],
  SALVAGE: ['badge-salvage', 'Sinistrado'],
};

function StatusBadge({ status }) {
  const [cls, label] = STATUS_META[status] || ['badge-regular', status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

function Fields({ data, setData }) {
  const upd = (f, v) => setData({
    ...data,
    [f]: f === 'plate' ? v.toUpperCase().slice(0, 7) : v,
  });

  const inp = (f, label, placeholder) => (
    <div key={f} className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        value={data[f] || ''}
        onChange={e => upd(f, e.target.value)}
        placeholder={placeholder}
        maxLength={f === 'plate' ? 7 : undefined}
      />
      {f === 'plate' && (
        <span className="form-hint">Formato: ABC1234 ou ABC1D23 (7 caracteres)</span>
      )}
    </div>
  );

  return (
    <>
      <div className="form-section-sep">Identificação</div>
      {inp('plate',    'Placa *',       'ABC1D23')}
      {inp('vin',      'Chassi (VIN)',  '9BW...')}

      <div className="form-section-sep">Dados do veículo</div>
      {inp('brand',    'Marca *',       'Volkswagen')}
      {inp('model',    'Modelo *',      'Gol')}
      {inp('year',     'Ano *',         '2020')}
      {inp('color',    'Cor',           'Prata')}
      {inp('fuelType', 'Combustível',   'Flex')}
      {inp('mileage',  'Km',            '50000')}

      <div className="form-section-sep">Status e observações</div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={data.status || 'REGULAR'}
          onChange={e => upd('status', e.target.value)}
        >
          <option value="REGULAR">Regular</option>
          <option value="STOLEN">Roubado</option>
          <option value="AUCTION">Leilão</option>
          <option value="SALVAGE">Sinistrado</option>
        </select>
      </div>
      <div className="form-group full">
        <label className="form-label">Observações</label>
        <textarea
          className="form-input"
          value={data.notes || ''}
          onChange={e => upd('notes', e.target.value)}
          placeholder="Descreva detalhes adicionais sobre o veículo..."
          rows={3}
          maxLength={2000}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <span className="form-hint">{(data.notes || '').length}/2000 caracteres</span>
      </div>

      <div className="form-section-sep">Preço de mercado (FIPE)</div>
      <div className="form-group full">
        <FipeSearch onConfirm={fipe => setData({
          ...data,
          brand:         fipe.brand    || data.brand,
          model:         fipe.model    || data.model,
          year:          fipe.year     || data.year,
          fuelType:      fipe.fuelType || data.fuelType,
          fipeCode:      fipe.fipeCode,
          fipePrice:     fipe.fipePrice,
          fipeReference: fipe.fipeReference,
        })} />
      </div>

      {data.fipePrice && (
        <div className="form-group full">
          <div className="fipe-badge-saved">
            <span className="fipe-badge-price">🏷️ {data.fipePrice}</span>
            <span className="fipe-badge-meta">
              Código {data.fipeCode} · Ref: {data.fipeReference}
            </span>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'none', color: 'var(--text-muted)', padding: '2px 6px' }}
              onClick={() => setData({ ...data, fipeCode: '', fipePrice: '', fipeReference: '' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function AuthForm({ mode, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === 'register';

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('token', data.token);
      onLogin(data);
    } catch (err) {
      if (!err.response) {
        setError('Servidor não encontrado. Verifique se o backend está rodando na porta 8080.');
      } else {
        setError(err.response.data?.message || `Erro ${err.response.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handle}>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Senha</label>
          <div className="password-wrapper">
            <input
              className="form-input"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Aguarde...' : isRegister ? '✅ Criar minha conta' : '🔑 Entrar'}
        </button>
      </form>
    </div>
  );
}

function Login({ onLogin, initialTab = 'login', onBack }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          {onBack && (
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, marginBottom: 12, padding: 0 }}>
              ← Voltar
            </button>
          )}
          <h1>🚗 AutoTrack BR</h1>
          <p>Sistema de Histórico Veicular</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
          >
            Entrar
          </button>
          <button
            className={`login-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => setTab('register')}
          >
            Criar conta
          </button>
        </div>

        <div className="login-body">
          <AuthForm key={tab} mode={tab} onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState(null);
  const [pendingPlate, setPendingPlate] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('list');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [historyForm, setHistoryForm] = useState({ eventType: 'MAINTENANCE', eventDate: '', description: '', source: '', mileage: '' });
  const [historyTypeFilter, setHistoryTypeFilter] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [form, setForm] = useState({ plate: '', vin: '', brand: '', model: '', year: '', color: '', fuelType: '', mileage: '', notes: '', status: 'REGULAR', fipeCode: '', fipePrice: '', fipeReference: '' });
  const [showLanding, setShowLanding] = useState(false);
  const [listPage, setListPage] = useState(0);
  const [listPageSize, setListPageSize] = useState(10);
  const [sortField, setSortField] = useState('plate');
  const [sortDir, setSortDir] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const { toasts, showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) { setUser({ token }); loadVehicles(); }
  }, []);

  const handleLogin = (data) => {
    setUser(data);
    loadVehicles();
    if (pendingPlate) {
      setSearch(pendingPlate);
      setTab('search');
      setAuthScreen(null);
      api.get(`/vehicles/plate/${pendingPlate}`, {
        headers: { Authorization: `Bearer ${data.token}` }
      }).then(res => {
        setResult(res.data);
        loadHistory(res.data.id);
      }).catch(() => {
        setError(`Veículo não encontrado: ${pendingPlate}`);
      }).finally(() => setPendingPlate(''));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setVehicles([]);
    setSelectedVehicle(null);
    setEditForm(null);
  };

  const loadVehicles = async () => {
    setLoadingVehicles(true);
    try { const { data } = await api.get('/vehicles'); setVehicles(data); }
    catch { setVehicles([]); }
    finally { setLoadingVehicles(false); }
  };

  const loadHistory = async (id) => {
    try { const { data } = await api.get(`/vehicles/${id}/history`); setHistory(data); }
    catch { setHistory([]); }
  };

  const handleSearch = async (e) => {
    e.preventDefault(); setError(''); setResult(null); setHistory([]);
    try {
      const { data } = await api.get(`/vehicles/plate/${search.toUpperCase()}`);
      setResult(data); loadHistory(data.id);
    } catch { setError('Veículo não encontrado: ' + search); }
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/vehicles', { ...form, year: parseInt(form.year), mileage: parseInt(form.mileage) });
      setForm({ plate: '', vin: '', brand: '', model: '', year: '', color: '', fuelType: '', mileage: '', notes: '', status: 'REGULAR', fipeCode: '', fipePrice: '', fipeReference: '' });
      loadVehicles();
      goToTab('list');
      showToast('Veículo cadastrado com sucesso!');
    } catch (err) { setError(err.response?.data?.message || 'Erro ao cadastrar'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.put(`/vehicles/${editForm.id}`, { ...editForm, year: parseInt(editForm.year), mileage: parseInt(editForm.mileage) });
      loadVehicles();
      closeEdit();
      showToast('Veículo atualizado com sucesso!');
    } catch (err) { setError(err.response?.data?.message || 'Erro ao atualizar'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este veículo?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      loadVehicles();
      showToast('Veículo excluído.');
    } catch (err) { showToast(err.response?.data?.message || 'Erro ao excluir', 'error'); }
  };

  const handleAddHistory = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = {
        ...historyForm,
        mileage: historyForm.mileage ? parseInt(historyForm.mileage) : null,
      };
      await api.post(`/vehicles/${selectedVehicle.id}/history`, payload);
      setHistoryForm({ eventType: 'MAINTENANCE', eventDate: '', description: '', source: '', mileage: '' });
      loadHistory(selectedVehicle.id);
      showToast('Evento adicionado com sucesso!');
    } catch (err) { setError(err.response?.data?.message || 'Erro ao adicionar evento'); }
  };

  const handleDeleteHistory = async (hid) => {
    if (!window.confirm('Excluir evento?')) return;
    try {
      await api.delete(`/vehicles/${selectedVehicle.id}/history/${hid}`);
      loadHistory(selectedVehicle.id);
      showToast('Evento excluído.');
    } catch (err) { showToast(err.response?.data?.message || 'Erro ao excluir evento', 'error'); }
  };

  const loadPhotos = async (id) => {
    try { const { data } = await api.get(`/vehicles/${id}/photos`); setPhotos(data); }
    catch { setPhotos([]); }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/vehicles/${selectedVehicle.id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      loadPhotos(selectedVehicle.id);
      showToast('Foto adicionada com sucesso!');
    } catch (err) { showToast(err.response?.data?.message || 'Erro ao enviar foto', 'error'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Excluir esta foto?')) return;
    try {
      await api.delete(`/vehicles/${selectedVehicle.id}/photos/${photoId}`);
      loadPhotos(selectedVehicle.id);
      showToast('Foto excluída.');
    } catch (err) { showToast(err.response?.data?.message || 'Erro ao excluir foto', 'error'); }
  };

  const openHistory = (v) => { setSelectedVehicle(v); loadHistory(v.id); loadPhotos(v.id); setTab('history'); };
  const openEdit    = (v) => {
    setEditForm({ ...v, vin: v.vin || '', color: v.color || '', fuelType: v.fuelType || '', mileage: v.mileage || '', notes: v.notes || '', fipeCode: v.fipeCode || '', fipePrice: v.fipePrice || '', fipeReference: v.fipeReference || '' });
    setTab('edit');
  };

  const closeHistory = () => { setSelectedVehicle(null); setTab('list'); };
  const closeEdit    = () => { setEditForm(null); setTab('list'); };

  const toggleSort = (field) => {
    setListPage(0);
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const goToTab = (id) => {
    if (['search', 'register', 'list'].includes(id)) {
      setSelectedVehicle(null);
      setEditForm(null);
    }
    setTab(id);
    setError('');
  };

  if (!user) {
    if (!authScreen) return (
      <LandingPage onEnter={(mode, plate) => {
        setPendingPlate(plate || '');
        setAuthScreen(mode);
      }} />
    );
    return <Login initialTab={authScreen} onLogin={handleLogin} onBack={() => setAuthScreen(null)} />;
  }

  if (showLanding) {
    return (
      <LandingPage
        isLoggedIn
        onBack={() => setShowLanding(false)}
        onEnter={(mode, plate) => {
          setShowLanding(false);
          if (plate) {
            setSearch(plate.toUpperCase());
            setTab('search');
            setResult(null);
            setHistory([]);
            api.get(`/vehicles/plate/${plate.toUpperCase()}`)
              .then(res => { setResult(res.data); loadHistory(res.data.id); })
              .catch(() => setError(`Veículo não encontrado: ${plate}`));
          }
        }}
      />
    );
  }

  const filteredVehicles = vehicles.filter(v => {
    if (statusFilter && v.status !== statusFilter) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      v.plate?.toLowerCase().includes(q) ||
      v.brand?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q)
    );
  });
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let av = a[sortField] ?? '';
    let bv = b[sortField] ?? '';
    if (typeof av === 'number' && typeof bv === 'number')
      return sortDir === 'asc' ? av - bv : bv - av;
    av = String(av).toLowerCase();
    bv = String(bv).toLowerCase();
    return sortDir === 'asc' ? av.localeCompare(bv, 'pt-BR') : bv.localeCompare(av, 'pt-BR');
  });
  const totalListPages = Math.ceil(sortedVehicles.length / listPageSize);
  const pagedVehicles = sortedVehicles.slice(listPage * listPageSize, (listPage + 1) * listPageSize);

  return (
    <>
      <ToastContainer toasts={toasts} />
      {lightboxPhoto && (
        <PhotoLightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}

      <header className="app-header">
        <h1 className="app-logo" onClick={() => setShowLanding(true)}>🚗 AutoTrack BR</h1>

        <nav className="header-nav">
          {[
            { id: 'search',   label: '🔍 Buscar' },
            { id: 'register', label: '➕ Cadastrar' },
            { id: 'list',     label: '📋 Listar' },
          ].map(t => (
            <button
              key={t.id}
              className={`header-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => goToTab(t.id)}
            >
              {t.label}
            </button>
          ))}

          {(selectedVehicle || editForm) && <span className="header-nav-sep" />}

          {selectedVehicle && (
            <button
              className={`header-tab header-tab-ctx${tab === 'history' ? ' active' : ''}`}
              onClick={() => setTab('history')}
            >
              📁 {selectedVehicle.plate}
              <span className="tab-close-x" onClick={e => { e.stopPropagation(); closeHistory(); }}>×</span>
            </button>
          )}

          {editForm && (
            <button
              className={`header-tab header-tab-ctx${tab === 'edit' ? ' active' : ''}`}
              onClick={() => setTab('edit')}
            >
              ✏️ {editForm.plate}
              <span className="tab-close-x" onClick={e => { e.stopPropagation(); closeEdit(); }}>×</span>
            </button>
          )}
        </nav>

        <div className="user-info">
          {user.email && <span>{user.email}</span>}
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="app-content">
        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Buscar ── */}
        {tab === 'search' && (
          <div>
            <div className="card">
              <h2 className="card-title">Buscar por Placa</h2>
              <form onSubmit={handleSearch} className="search-bar">
                <input
                  className="form-input"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ex: ABC1D23"
                  maxLength={7}
                />
                <button type="submit" className="btn btn-primary">Buscar</button>
              </form>
            </div>

            {result && (
              <div className="search-result-layout">
                {/* Dados do veículo */}
                <div className="vehicle-card">
                  <div className="vehicle-card-header">
                    <h3>{result.plate}</h3>
                    <StatusBadge status={result.status} />
                  </div>
                  <div className="vehicle-card-body">
                    {[
                      ['Marca',        result.brand],
                      ['Modelo',       result.model],
                      ['Ano',          result.year],
                      ['Cor',          result.color    || '—'],
                      ['Combustível',  result.fuelType || '—'],
                      ['Km',           result.mileage ? result.mileage.toLocaleString('pt-BR') : '—'],
                      ['Chassi (VIN)', result.vin      || '—'],
                    ].map(([l, v]) => (
                      <div key={l} className="vehicle-field">
                        <span className="vf-label">{l}</span>
                        <span className="vf-value">{v}</span>
                      </div>
                    ))}
                  </div>
                  {result.notes && (
                    <div style={{ padding: '0 22px 16px' }}>
                      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: 6 }}>Observações</p>
                      <p style={{ fontSize: 14, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result.notes}</p>
                    </div>
                  )}
                  {result.fipePrice && (
                  <div className="fipe-card-badge">
                    <span>🏷️ Preço FIPE</span>
                    <strong>{result.fipePrice}</strong>
                    <span className="fipe-ref">Ref: {result.fipeReference}</span>
                  </div>
                )}
                <div className="vehicle-card-actions">
                    <button onClick={() => openHistory(result)} className="btn btn-dark btn-sm">📁 Histórico completo</button>
                    <button onClick={() => openEdit(result)}    className="btn btn-primary btn-sm">✏️ Editar</button>
                  </div>
                </div>

                {/* Eventos recentes */}
                <div className="card search-events-card">
                  <h3 className="card-title">
                    Eventos recentes
                    <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>({history.length})</span>
                  </h3>
                  {history.length === 0 ? (
                    <div className="empty-state" style={{ padding: '24px 0' }}>
                      <div className="empty-icon">📋</div>
                      <p>Nenhum evento registrado.</p>
                    </div>
                  ) : (
                    <>
                      {history.slice(0, 4).map(h => (
                        <div key={h.id} className="history-event history-event-mini">
                          <div className="history-event-content">
                            <div>
                              <span className="history-event-type">{EVENT_LABELS[h.eventType]}</span>
                              <span className="history-event-date">{h.eventDate}</span>
                            </div>
                            {h.description && <p className="history-event-desc">{h.description}</p>}
                          </div>
                        </div>
                      ))}
                      {history.length > 4 && (
                        <p className="events-more-hint">+{history.length - 4} eventos anteriores</p>
                      )}
                      <button
                        onClick={() => openHistory(result)}
                        className="btn btn-dark btn-full"
                        style={{ marginTop: 12 }}
                      >
                        📁 Ver histórico completo
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Cadastrar ── */}
        {tab === 'register' && (
          <div className="card">
            <h2 className="card-title">Cadastrar Veículo</h2>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <Fields data={form} setData={setForm} />
                <div className="form-group full">
                  <button type="submit" className="btn btn-primary btn-full">✅ Cadastrar Veículo</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Editar ── */}
        {tab === 'edit' && editForm && (
          <div className="card">
            <h2 className="card-title">✏️ Editar — {editForm.plate}</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-grid">
                <Fields data={editForm} setData={setEditForm} />
                <div className="form-group full">
                  <button type="submit" className="btn btn-success btn-full">💾 Salvar Alterações</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Listar ── */}
        {tab === 'list' && (
          <div>
            {!loadingVehicles && vehicles.length > 0 && (
              <div className="stat-row">
                {[
                  { label: 'Total',       value: vehicles.length,                                          cls: '' },
                  { label: 'Regulares',   value: vehicles.filter(v => v.status === 'REGULAR').length,      cls: 'stat-green' },
                  { label: 'Roubados',    value: vehicles.filter(v => v.status === 'STOLEN').length,       cls: 'stat-red' },
                  { label: 'Atenção',     value: vehicles.filter(v => v.status === 'SALVAGE' || v.status === 'AUCTION').length, cls: 'stat-orange' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className={`stat-card ${cls}`}>
                    <p className="stat-label">{label}</p>
                    <p className="stat-value">{value}</p>
                  </div>
                ))}
              </div>
            )}

          <div className="card">
            <div className="card-title-row">
              <h2 className="card-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                Veículos Cadastrados{' '}
                <span style={{ fontWeight: 400, fontSize: 15, color: 'var(--text-muted)' }}>
                  ({sortedVehicles.length}{(filter || statusFilter) ? `/${vehicles.length}` : ''})
                </span>
              </h2>
            </div>

            <div className="status-filter-bar">
              {[
                { value: '', label: 'Todos', count: vehicles.length },
                { value: 'REGULAR', label: 'Regulares', count: vehicles.filter(v => v.status === 'REGULAR').length },
                { value: 'STOLEN',  label: 'Roubados',  count: vehicles.filter(v => v.status === 'STOLEN').length },
                { value: 'AUCTION', label: 'Leilão',    count: vehicles.filter(v => v.status === 'AUCTION').length },
                { value: 'SALVAGE', label: 'Sinistrados', count: vehicles.filter(v => v.status === 'SALVAGE').length },
              ].map(({ value, label, count }) => (
                <button
                  key={value}
                  className={`status-filter-btn${statusFilter === value ? ' active' : ''}`}
                  onClick={() => { setStatusFilter(value); setListPage(0); }}
                >
                  {label}
                  <span className="sfb-count">{count}</span>
                </button>
              ))}
            </div>

            <div className="filter-bar">
              <input
                className="form-input"
                value={filter}
                onChange={e => { setFilter(e.target.value); setListPage(0); }}
                placeholder="Filtrar por placa, marca ou modelo..."
              />
              {filter && (
                <button className="btn btn-sm btn-clear" onClick={() => { setFilter(''); setListPage(0); }}>✕</button>
              )}
            </div>

            {loadingVehicles ? (
              <div className="spinner-container">
                <div className="spinner" />
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{filter ? '🔍' : '🚗'}</div>
                <p>{filter ? `Nenhum veículo encontrado para "${filter}"` : 'Nenhum veículo cadastrado ainda.'}</p>
              </div>
            ) : (
              <>
                <table className="data-table">
                  <thead>
                    <tr>
                      {[
                        { field: 'plate',  label: 'Placa' },
                        { field: 'brand',  label: 'Marca' },
                        { field: 'model',  label: 'Modelo' },
                        { field: 'year',   label: 'Ano' },
                        { field: 'status', label: 'Status' },
                      ].map(({ field, label }) => (
                        <th key={field} className="sortable" onClick={() => toggleSort(field)}>
                          {label}
                          <span className="sort-icon">
                            {sortField === field ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⬍'}
                          </span>
                        </th>
                      ))}
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedVehicles.map(v => (
                      <tr key={v.id}>
                        <td className="plate-cell">{v.plate}</td>
                        <td>{v.brand}</td>
                        <td>{v.model}</td>
                        <td>{v.year}</td>
                        <td><StatusBadge status={v.status} /></td>
                        <td>
                          <div className="actions-cell">
                            <button onClick={() => openHistory(v)} className="btn btn-dark btn-sm">📁</button>
                            <button onClick={() => openEdit(v)}    className="btn btn-primary btn-sm">✏️</button>
                            <button onClick={() => handleDelete(v.id)} className="btn btn-danger btn-sm">🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalListPages > 1 && (
                  <div className="pagination">
                    <span className="pagination-info">
                      {listPage * listPageSize + 1}–{Math.min((listPage + 1) * listPageSize, sortedVehicles.length)} de {sortedVehicles.length}
                    </span>
                    <div className="pagination-btns">
                      <button className="pagination-btn" disabled={listPage === 0} onClick={() => setListPage(0)}>«</button>
                      <button className="pagination-btn" disabled={listPage === 0} onClick={() => setListPage(p => p - 1)}>‹</button>
                      {(() => {
                        const pages = [];
                        const addPage = (i) => pages.push(
                          <button key={i} className={`pagination-btn${listPage === i ? ' active' : ''}`} onClick={() => setListPage(i)}>{i + 1}</button>
                        );
                        if (totalListPages <= 7) {
                          for (let i = 0; i < totalListPages; i++) addPage(i);
                        } else {
                          addPage(0);
                          if (listPage > 2) pages.push(<span key="e1" className="pagination-ellipsis">…</span>);
                          for (let i = Math.max(1, listPage - 1); i <= Math.min(totalListPages - 2, listPage + 1); i++) addPage(i);
                          if (listPage < totalListPages - 3) pages.push(<span key="e2" className="pagination-ellipsis">…</span>);
                          addPage(totalListPages - 1);
                        }
                        return pages;
                      })()}
                      <button className="pagination-btn" disabled={listPage >= totalListPages - 1} onClick={() => setListPage(p => p + 1)}>›</button>
                      <button className="pagination-btn" disabled={listPage >= totalListPages - 1} onClick={() => setListPage(totalListPages - 1)}>»</button>
                    </div>
                    <select
                      className="form-select pagination-size"
                      value={listPageSize}
                      onChange={e => { setListPageSize(Number(e.target.value)); setListPage(0); }}
                    >
                      <option value={10}>10 / pág.</option>
                      <option value={25}>25 / pág.</option>
                      <option value={50}>50 / pág.</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        )}

        {/* ── Histórico ── */}
        {tab === 'history' && selectedVehicle && (
          <div>
            {/* Vehicle summary bar */}
            <div className="card vehicle-summary-bar">
              <div className="vsb-plate">{selectedVehicle.plate}</div>
              <div className="vsb-info">
                <span className="vsb-name">{selectedVehicle.brand} {selectedVehicle.model}</span>
                <span className="vsb-details">
                  {selectedVehicle.year}
                  {selectedVehicle.color    && ` · ${selectedVehicle.color}`}
                  {selectedVehicle.fuelType && ` · ${selectedVehicle.fuelType}`}
                  {selectedVehicle.mileage  && ` · ${Number(selectedVehicle.mileage).toLocaleString('pt-BR')} km`}
                </span>
              </div>
              <StatusBadge status={selectedVehicle.status} />
              {selectedVehicle.fipePrice && (
                <span className="vsb-fipe">🏷️ {selectedVehicle.fipePrice}</span>
              )}
              <button onClick={() => openEdit(selectedVehicle)} className="btn btn-primary btn-sm vsb-edit">✏️ Editar</button>
            </div>

            <div className="history-layout">
              {/* ── Main column ── */}
              <div className="history-main">

                {/* KM Chart */}
                {history.some(h => h.mileage) && (
                  <div className="card">
                    <h3 className="card-title">📊 Evolução do KM</h3>
                    <KmChart history={history} />
                  </div>
                )}

                {/* Events list */}
                <div className="card">
                  <div className="card-title-row">
                    <h3 className="card-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                      Eventos
                      <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>
                        ({historyTypeFilter ? history.filter(h => h.eventType === historyTypeFilter).length : history.length})
                      </span>
                    </h3>
                    <div className="history-type-filter">
                      {[
                        { value: '', label: 'Todos' },
                        { value: 'MAINTENANCE', label: '🔧 Revisões' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          className={`htf-btn${historyTypeFilter === value ? ' active' : ''}`}
                          onClick={() => setHistoryTypeFilter(value)}
                        >{label}</button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const displayed = historyTypeFilter
                      ? history.filter(h => h.eventType === historyTypeFilter)
                      : history;
                    return displayed.length === 0 ? (
                      <div className="empty-state" style={{ padding: '24px 0' }}>
                        <div className="empty-icon">📋</div>
                        <p>{historyTypeFilter ? 'Nenhuma revisão registrada ainda.' : 'Nenhum evento registrado ainda.'}</p>
                      </div>
                    ) : displayed.map(h => (
                      <div key={h.id} className="history-event">
                        <div className="history-event-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span className="history-event-type">{EVENT_LABELS[h.eventType]}</span>
                            <span className="history-event-date">{h.eventDate}</span>
                            {h.mileage && (
                              <span className="event-km-badge">
                                🔢 {Number(h.mileage).toLocaleString('pt-BR')} km
                              </span>
                            )}
                          </div>
                          {h.description && <p className="history-event-desc">{h.description}</p>}
                          {h.source && <p className="history-event-source">Fonte: {h.source}</p>}
                        </div>
                        <button onClick={() => handleDeleteHistory(h.id)} className="btn btn-danger btn-sm">🗑</button>
                      </div>
                    ));
                  })()}
                </div>

                {/* Photos gallery */}
                <div className="card">
                  <h3 className="card-title">📷 Fotos ({photos.length})</h3>
                  {photos.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px 0' }}>
                      <div className="empty-icon">🖼️</div>
                      <p>Nenhuma foto adicionada ainda.</p>
                    </div>
                  ) : (
                    <div className="photo-grid">
                      {photos.map(p => (
                        <div key={p.id} className="photo-item" onClick={() => setLightboxPhoto(p)}>
                          <img
                            src={`${BASE_URL}${p.url}`}
                            alt={p.originalName}
                            className="photo-thumb"
                          />
                          <div className="photo-overlay">
                            <span className="photo-expand-hint">🔍 Ver maior</span>
                            <span className="photo-name">{p.originalName}</span>
                            <button
                              onClick={e => { e.stopPropagation(); handleDeletePhoto(p.id); }}
                              className="btn btn-danger btn-sm"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedVehicle.notes && (
                  <div className="card">
                    <h3 className="card-title">📝 Observações</h3>
                    <p style={{ fontSize: 14, color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {selectedVehicle.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Sidebar ── */}
              <aside className="history-sidebar">
                <div className="card sidebar-card">
                  <h3 className="card-title">Adicionar evento</h3>
                  <form onSubmit={handleAddHistory}>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Tipo *</label>
                      <select
                        className="form-select"
                        value={historyForm.eventType}
                        onChange={e => setHistoryForm({ ...historyForm, eventType: e.target.value })}
                      >
                        {Object.entries(EVENT_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Data *</label>
                      <input
                        className="form-input"
                        type="date"
                        value={historyForm.eventDate}
                        onChange={e => setHistoryForm({ ...historyForm, eventDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Descrição</label>
                      <input
                        className="form-input"
                        value={historyForm.description}
                        onChange={e => setHistoryForm({ ...historyForm, description: e.target.value })}
                        placeholder="Ex: Colisão leve"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Fonte</label>
                      <input
                        className="form-input"
                        value={historyForm.source}
                        onChange={e => setHistoryForm({ ...historyForm, source: e.target.value })}
                        placeholder="Ex: DETRAN-SP"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label className="form-label">KM no evento</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        value={historyForm.mileage}
                        onChange={e => setHistoryForm({ ...historyForm, mileage: e.target.value })}
                        placeholder="Ex: 45000"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">✅ Adicionar</button>
                  </form>

                  <div className="sidebar-divider" />

                  <p className="form-label" style={{ marginBottom: 8 }}>📷 Fotos</p>
                  <label className={`btn btn-full sidebar-upload-btn${uploading ? ' btn-disabled' : ''}`}>
                    {uploading ? 'Enviando...' : '+ Adicionar foto'}
                    <input type="file" accept="image/*" onChange={handleUploadPhoto} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
