import { useState, useEffect } from 'react';
import api from '../api';

const TIPOS = [
  { value: 1, label: 'Carro' },
  { value: 2, label: 'Moto' },
  { value: 3, label: 'Caminhão' },
];

export default function FipeSearch({ onConfirm }) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo]     = useState(1);
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca]   = useState('');
  const [modelos, setModelos] = useState([]);
  const [modelo, setModelo] = useState('');
  const [anos, setAnos]     = useState([]);
  const [ano, setAno]       = useState('');
  const [preco, setPreco]   = useState(null);
  const [loading, setLoading] = useState('');
  const [erro, setErro]     = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading('marcas'); setErro('');
    setMarca(''); setModelos([]); setModelo(''); setAnos([]); setAno(''); setPreco(null);
    api.get(`/fipe/marcas?tipo=${tipo}`)
      .then(r => setMarcas(r.data))
      .catch(() => setErro('Não foi possível conectar à FIPE. Tente novamente.'))
      .finally(() => setLoading(''));
  }, [tipo, open]);

  const handleMarca = async (val) => {
    setMarca(val); setModelos([]); setModelo(''); setAnos([]); setAno(''); setPreco(null);
    if (!val) return;
    setLoading('modelos');
    try {
      const r = await api.get(`/fipe/modelos?tipo=${tipo}&marca=${val}`);
      setModelos(r.data.Modelos || []);
    } catch { setErro('Erro ao carregar modelos.'); }
    finally { setLoading(''); }
  };

  const handleModelo = async (val) => {
    setModelo(val); setAnos([]); setAno(''); setPreco(null);
    if (!val) return;
    setLoading('anos');
    try {
      const r = await api.get(`/fipe/anos?tipo=${tipo}&marca=${marca}&modelo=${val}`);
      setAnos(r.data);
    } catch { setErro('Erro ao carregar anos.'); }
    finally { setLoading(''); }
  };

  const handleAno = async (val) => {
    setAno(val); setPreco(null);
    if (!val) return;
    setLoading('preco');
    try {
      const r = await api.get(`/fipe/preco?tipo=${tipo}&marca=${marca}&modelo=${modelo}&ano=${encodeURIComponent(val)}`);
      setPreco(r.data);
    } catch { setErro('Erro ao consultar preço.'); }
    finally { setLoading(''); }
  };

  const handleConfirm = () => {
    if (!preco) return;
    onConfirm({
      fipeCode:      preco.CodigoFipe,
      fipePrice:     preco.Valor,
      fipeReference: preco.MesReferencia,
      brand:    preco.Marca,
      model:    preco.Modelo,
      fuelType: preco.Combustivel,
      year:     String(preco.AnoModelo),
    });
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="btn-fipe-toggle" onClick={() => setOpen(true)}>
        🏷️ Consultar preço na FIPE
      </button>
    );
  }

  return (
    <div className="fipe-panel">
      <div className="fipe-panel-header">
        <span>🏷️ Tabela FIPE</span>
        <button type="button" className="fipe-close" onClick={() => setOpen(false)}>✕</button>
      </div>

      {erro && <p className="fipe-error">{erro}</p>}

      <div className="fipe-selects">
        <div className="fipe-group">
          <label className="form-label">Tipo</label>
          <select className="form-select" value={tipo} onChange={e => setTipo(Number(e.target.value))}>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="fipe-group">
          <label className="form-label">Marca</label>
          <select className="form-select" value={marca} onChange={e => handleMarca(e.target.value)}
            disabled={loading === 'marcas'}>
            <option value="">{loading === 'marcas' ? 'Carregando...' : 'Selecione'}</option>
            {marcas.map(m => <option key={m.Value} value={m.Value}>{m.Label}</option>)}
          </select>
        </div>

        <div className="fipe-group">
          <label className="form-label">Modelo</label>
          <select className="form-select" value={modelo} onChange={e => handleModelo(e.target.value)}
            disabled={!marca || loading === 'modelos'}>
            <option value="">{loading === 'modelos' ? 'Carregando...' : !marca ? '—' : 'Selecione'}</option>
            {modelos.map(m => <option key={m.Value} value={m.Value}>{m.Label}</option>)}
          </select>
        </div>

        <div className="fipe-group">
          <label className="form-label">Ano</label>
          <select className="form-select" value={ano} onChange={e => handleAno(e.target.value)}
            disabled={!modelo || loading === 'anos'}>
            <option value="">{loading === 'anos' ? 'Carregando...' : !modelo ? '—' : 'Selecione'}</option>
            {anos.map(a => <option key={a.Value} value={a.Value}>{a.Label}</option>)}
          </select>
        </div>
      </div>

      {loading === 'preco' && (
        <div className="fipe-loading">
          <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
          Consultando preço...
        </div>
      )}

      {preco && (
        <div className="fipe-result">
          <div className="fipe-result-price">{preco.Valor}</div>
          <div className="fipe-result-meta">
            <span>{preco.Marca} · {preco.Modelo}</span>
            <span>{preco.AnoModelo} · {preco.Combustivel}</span>
            <span>Código FIPE: <strong>{preco.CodigoFipe}</strong></span>
            <span className="fipe-ref">Referência: {preco.MesReferencia}</span>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleConfirm}>
            ✅ Aplicar ao cadastro
          </button>
        </div>
      )}
    </div>
  );
}
