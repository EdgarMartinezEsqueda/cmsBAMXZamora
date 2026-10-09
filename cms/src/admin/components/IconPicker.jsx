import { useId, useMemo, useState } from 'react';
import { findIcon, searchIcons } from './iconCatalog';

// Campo "Icono" del panel (campo personalizado global::icon): la editora ve los iconos y elige
// uno; se guarda su clave (p. ej. "truck"). Vacío = el sitio usa el icono automático de siempre.
// Estilos propios en línea: no depende de @strapi/design-system (pnpm instala dos copias y un
// import directo podría quedar fuera del tema del panel).
const COLORS = { primary: '#4945ff', border: '#dcdce4', text: '#32324d', muted: '#666687', soft: '#f0f0ff', danger: '#d02b20' };

const button = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 4,
  fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${COLORS.border}`, background: '#fff', color: COLORS.text,
};

export default function IconPicker({ name, label, hint, required, disabled, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const id = useId();
  const current = findIcon(value);
  const results = useMemo(() => searchIcons(query), [query]);
  const choose = (key) => {
    onChange(name, key);
    setOpen(false);
    setQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={`${id}-actual`} style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
        {label || 'Icono'}{required ? ' *' : ''}
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div id={`${id}-actual`} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', minWidth: 190,
          border: `1px solid ${COLORS.border}`, borderRadius: 4, background: '#fff', color: COLORS.text, fontSize: 14,
        }}>
          {current ? <current.Icon size={22} color={COLORS.primary} aria-hidden="true" /> : <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 4, border: `1px dashed ${COLORS.border}` }} />}
          <span>{current ? current.label : 'Automático'}</span>
        </div>
        <button type="button" disabled={disabled} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={`${id}-panel`}
          style={{ ...button, background: COLORS.primary, borderColor: COLORS.primary, color: '#fff' }}>
          {open ? 'Cerrar' : current ? 'Cambiar icono' : 'Elegir icono'}
        </button>
        {current && !disabled && (
          <button type="button" onClick={() => choose(null)} style={{ ...button, color: COLORS.danger }}>Quitar</button>
        )}
      </div>

      {open && (
        <div id={`${id}-panel`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 12, background: '#fff' }}>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar: camión, salud, escuela…"
            aria-label="Buscar icono"
            style={{ width: '100%', padding: '8px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, marginBottom: 12, color: COLORS.text }}
          />
          {results.length === 0 ? (
            <p style={{ color: COLORS.muted, fontSize: 13, margin: '8px 0' }}>Sin resultados. Prueba con otra palabra.</p>
          ) : (
            <div role="listbox" aria-label="Iconos" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {results.map(({ key, Icon, label: iconLabel }) => {
                const selected = key === value;
                return (
                  <button key={key} type="button" role="option" aria-selected={selected} title={iconLabel} onClick={() => choose(key)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 4px', borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${selected ? COLORS.primary : COLORS.border}`, background: selected ? COLORS.soft : '#fff', color: COLORS.text,
                    }}>
                    <Icon size={24} color={selected ? COLORS.primary : COLORS.text} aria-hidden="true" />
                    <span style={{ fontSize: 11, lineHeight: 1.2, textAlign: 'center' }}>{iconLabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {(error || hint) && <p style={{ fontSize: 12, margin: 0, color: error ? COLORS.danger : COLORS.muted }}>{error || hint}</p>}
    </div>
  );
}
