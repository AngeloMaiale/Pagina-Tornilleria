import React, { useState, useEffect, useRef } from "react";

export default function Catalogo({ productos, loading, busqueda, onBuscar, onVerDetalle, onAgregarCarrito }) {
  const [material, setMaterial] = useState("");
  const [cabeza, setCabeza] = useState("");
  const [long1, setLong1] = useState("");
  const [long2, setLong2] = useState("");
  const [diam1, setDiam1] = useState("");
  const [diam2, setDiam2] = useState("");
  const [ordenar, setOrdenar] = useState("relevancia");
  const [categoria, setCategoria] = useState("");
  
  const prevProductosRef = useRef([]);
  const [displayProductos, setDisplayProductos] = useState([]);

  useEffect(() => {
    if (!loading && productos.length > 0) {
      setDisplayProductos(productos);
    } else if (!loading && productos.length === 0) {
      setDisplayProductos([]);
    }
  }, [loading, productos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onBuscar({
        material,
        cabeza,
        long1,
        long2,
        diam1,
        diam2,
        ordenar,
        categoria
      });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [material, cabeza, long1, long2, diam1, diam2, ordenar, categoria]);

  function limpiarFiltros() {
    setMaterial("");
    setCabeza("");
    setLong1("");
    setLong2("");
    setDiam1("");
    setDiam2("");
    setOrdenar("relevancia");
    setCategoria("");
  }

  return (
    <div className="catalogo-wrapper">
      <aside className="sidebar-filtros">
        <h3>🔍 Filtros</h3>
        
        <div className="filtro-group">
          <label>Categoría</label>
          <select className="input" value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option value="automotriz">🚗 Automotriz</option>
            <option value="construccion">🏗️ Construcción</option>
            <option value="industrial">🏭 Industrial</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Material</label>
          <select className="input" value={material} onChange={e => setMaterial(e.target.value)}>
            <option value="">Todos los materiales</option>
            <option value="zincado">Zincado</option>
            <option value="negro">Negro</option>
            <option value="inoxidable">Inoxidable</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Tipo de Cabeza</label>
          <select className="input" value={cabeza} onChange={e => setCabeza(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="hexagonal">Hexagonal</option>
            <option value="phillips">Phillips</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Longitud (mm)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input className="input" type="number" placeholder="Mín" value={long1} onChange={e => setLong1(e.target.value)} />
            <span>-</span>
            <input className="input" type="number" placeholder="Máx" value={long2} onChange={e => setLong2(e.target.value)} />
          </div>
        </div>

        <div className="filtro-group">
          <label>Diámetro (mm)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input className="input" type="number" placeholder="Mín" value={diam1} onChange={e => setDiam1(e.target.value)} />
            <span>-</span>
            <input className="input" type="number" placeholder="Máx" value={diam2} onChange={e => setDiam2(e.target.value)} />
          </div>
        </div>

        <div className="filtro-group">
          <label>Ordenar por</label>
          <select className="input" value={ordenar} onChange={e => setOrdenar(e.target.value)}>
            <option value="relevancia">Más relevantes</option>
            <option value="precio">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>

        <button className="btn-outline" onClick={limpiarFiltros} style={{ width: "100%" }}>
          🔄 Limpiar filtros
        </button>
      </aside>

      <section className="catalogo-main">
        <div className="catalogo-header">
          <h2>📦 Catálogo de Productos</h2>
          <span className="resultados-count">
            {loading ? 'Cargando...' : `Mostrando ${displayProductos.length} productos`}
          </span>
        </div>

        <div className="catalogo-grid-container" style={{ position: "relative", minHeight: "400px" }}>
          {loading && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              backdropFilter: "blur(2px)"
            }}>
              <div style={{
                background: "white",
                padding: "24px 48px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div className="loading-spinner" style={{ width: "24px", height: "24px" }}></div>
                <span>Cargando productos...</span>
              </div>
            </div>
          )}

          {displayProductos.length === 0 && !loading ? (
            <div className="empty-state" style={{ textAlign: "center", padding: "64px 32px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔍</div>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros filtros o términos de búsqueda</p>
              <button className="btn-primary" onClick={limpiarFiltros}>Limpiar filtros</button>
            </div>
          ) : (
            <div className="catalogo-grid">
              {displayProductos.map(p => (
                <div className="producto-card" key={p.id}>
                  <img 
                    src={p.img} 
                    alt={p.nombre} 
                    onError={e => e.target.src = "https://via.placeholder.com/200?text=Sin+imagen"} 
                  />
                  <span className="categoria-tag">{p.categoria}</span>
                  <strong>{p.nombre}</strong>
                  <div className="precio">${Number(p.precio).toFixed(2)}</div>
                  <div className={`stock ${p.stock === 0 ? 'agotado' : ''}`}>
                    {p.stock > 0 ? `${p.stock} unidades` : 'Agotado'}
                  </div>
                  <div className="buttons">
                    <button className="btn-primary" onClick={() => onVerDetalle(p)}>
                      👁️ Ver detalles
                    </button>
                    <button 
                      className="btn-outline" 
                      onClick={() => onAgregarCarrito(p, 1)}
                      disabled={p.stock === 0}
                    >
                      🛒 Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}