import React, { useState } from "react";

const API_URL = "http://localhost:3001/api";

export default function AdminPanel({ productos, actualizarProductos, adminToken, fetchProductos }) {
  const [editando, setEditando] = useState(null);
  const [f, setF] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function handleEdit(p) {
    setF({ ...p, variantes: (p.variantes || []).map(v => v.desc).join(", ") });
    setEditando(p.id);
  }

  function handleNew() {
    setF({});
    setEditando("nuevo");
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    const variantes = (f.variantes || "").split(",").map(x => ({ id: x.trim(), desc: x.trim() })).filter(v => v.id);
    const producto = {
      ...f,
      id: editando === "nuevo" ? undefined : f.id,
      precio: parseFloat(f.precio) || 0,
      stock: parseInt(f.stock) || 0,
      longitud: parseInt(f.longitud) || 0,
      diametro: parseInt(f.diametro) || 0,
      variantes
    };

    try {
      let res;
      if (editando === "nuevo") {
        res = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: adminToken, producto })
        });
      } else {
        res = await fetch(`${API_URL}/productos/${f.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: adminToken, producto })
        });
      }

      if (res.ok) {
        setMensaje({ tipo: "success", texto: editando === "nuevo" ? "✅ Producto creado exitosamente" : "✅ Producto actualizado exitosamente" });
        fetchProductos();
        setEditando(null);
        setF({});
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ tipo: "error", texto: "❌ Error al guardar el producto" });
      }
    } catch (e) {
      setMensaje({ tipo: "error", texto: "❌ Error de conexión" });
    }

    setLoading(false);
  }

  async function handleDel(id) {
    if (!window.confirm("¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;

    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: adminToken })
      });

      if (res.ok) {
        setMensaje({ tipo: "success", texto: "✅ Producto eliminado exitosamente" });
        fetchProductos();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ tipo: "error", texto: "❌ Error al eliminar el producto" });
      }
    } catch (e) {
      setMensaje({ tipo: "error", texto: "❌ Error de conexión" });
    }

    setLoading(false);
  }

  function handleCancel() {
    setEditando(null);
    setF({});
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-header">
        <h2>📦 Gestión de Productos</h2>
        <button className="btn-primary" onClick={handleNew} disabled={loading || editando === "nuevo"}>
          ➕ Agregar Producto
        </button>
      </div>

      <div className="admin-panel-content">
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div style={{ padding: "24px" }}>
          <p style={{ color: "var(--gray)", marginBottom: "24px" }}>
            <strong>{productos.length}</strong> productos en total | 
            <span style={{ color: "var(--warning)" }}> <strong>{productos.filter(p => p.stock < 10).length}</strong> con stock bajo</span> |
            <span style={{ color: "var(--danger)" }}> <strong>{productos.filter(p => p.stock === 0).length}</strong> sin stock</span>
          </p>
        </div>

        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Material</th>
                <th>Cabeza</th>
                <th>Long.</th>
                <th>Diam.</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && productos.length === 0 ? (
                <tr>
                  <td colSpan="10" className="loading">
                    <span className="loading-spinner"></span>
                    Cargando productos...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="10" className="empty-state">
                    <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📦</div>
                    <h3>No hay productos</h3>
                    <p>Haga clic en "Agregar Producto" para comenzar</p>
                    <button className="btn-primary" onClick={handleNew}>Agregar Primer Producto</button>
                  </td>
                </tr>
              ) : (
                productos.map(prod => (
                  <tr key={prod.id}>
                    <td><strong>#{prod.id}</strong></td>
                    <td className="product-cell">
                      <strong>{prod.nombre}</strong>
                      {prod.variantes && prod.variantes.length > 0 && (
                        <div className="variantes">
                          {prod.variantes.map(v => v.desc).join(", ")}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`categoria-badge ${prod.categoria}`}>
                        {prod.categoria}
                      </span>
                    </td>
                    <td>{prod.material}</td>
                    <td>{prod.cabeza || '—'}</td>
                    <td>{prod.longitud || '—'}</td>
                    <td>{prod.diametro || '—'}</td>
                    <td className="precio-cell">${Number(prod.precio).toFixed(2)}</td>
                    <td className={`stock-cell ${prod.stock === 0 ? 'cero' : prod.stock < 10 ? 'bajo' : 'alto'}`}>
                      {prod.stock === 0 ? '❌ Sin stock' : prod.stock}
                    </td>
                    <td className="actions-cell">
                      <button className="btn-success btn-sm" onClick={() => handleEdit(prod)} disabled={loading || editando !== null}>
                        ✏️ Editar
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => handleDel(prod.id)} disabled={loading || editando !== null}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editando && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editando === "nuevo" ? "➕ Agregar Nuevo Producto" : "✏️ Editar Producto"}</h3>
              <button className="modal-close" onClick={handleCancel}>&times;</button>
            </div>
            <div className="modal-body">
              <form className="admin-form" onSubmit={handleSave}>
                <div className="form-group full-width">
                  <label>Nombre del Producto *</label>
                  <input className="input" type="text" value={f.nombre || ""} onChange={e => setF(ff => ({ ...ff, nombre: e.target.value }))} placeholder="Ej: Tornillo hexagonal M8x50 zincado" required />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <select className="input" value={f.categoria || "automotriz"} onChange={e => setF(ff => ({ ...ff, categoria: e.target.value }))}>
                    <option value="automotriz">🚗 Automotriz</option>
                    <option value="construccion">🏗️ Construcción</option>
                    <option value="industrial">🏭 Industrial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Material</label>
                  <select className="input" value={f.material || "zincado"} onChange={e => setF(ff => ({ ...ff, material: e.target.value }))}>
                    <option value="zincado">Zincado</option>
                    <option value="negro">Negro</option>
                    <option value="inoxidable">Inoxidable</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo de Cabeza</label>
                  <select className="input" value={f.cabeza || ""} onChange={e => setF(ff => ({ ...ff, cabeza: e.target.value }))}>
                    <option value="">Sin cabeza</option>
                    <option value="hexagonal">Hexagonal</option>
                    <option value="phillips">Phillips</option>
                    <option value="torx">Torx</option>
                    <option value="plana">Plana</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Longitud (mm)</label>
                  <input className="input" type="number" min={0} value={f.longitud || ""} onChange={e => setF(ff => ({ ...ff, longitud: e.target.value }))} placeholder="50" />
                </div>

                <div className="form-group">
                  <label>Diámetro (mm)</label>
                  <input className="input" type="number" min={0} value={f.diametro || ""} onChange={e => setF(ff => ({ ...ff, diametro: e.target.value }))} placeholder="8" />
                </div>

                <div className="form-group">
                  <label>Precio ($) *</label>
                  <input className="input" type="number" min={0} step="0.01" value={f.precio || ""} onChange={e => setF(ff => ({ ...ff, precio: e.target.value }))} placeholder="1.50" required />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input className="input" type="number" min={0} value={f.stock || ""} onChange={e => setF(ff => ({ ...ff, stock: e.target.value }))} placeholder="100" />
                </div>

                <div className="form-group full-width">
                  <label>URL de Imagen</label>
                  <input className="input" type="text" value={f.img || ""} onChange={e => setF(ff => ({ ...ff, img: e.target.value }))} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>

                <div className="form-group full-width">
                  <label>Variantes</label>
                  <input className="input" type="text" value={f.variantes || ""} onChange={e => setF(ff => ({ ...ff, variantes: e.target.value }))} placeholder="M8x50, M8x60, M8x70" />
                  <small>Ejemplo: M8x50, M8x60 - Cada variante separada por coma</small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? "Guardando..." : "💾 Guardar Producto"}
              </button>
              <button className="btn-outline" onClick={handleCancel} disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}