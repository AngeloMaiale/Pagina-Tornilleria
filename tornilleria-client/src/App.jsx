import React, { useEffect, useState, useCallback } from "react";
import Slider from "./components/Slider";
import Categorias from "./components/Categorias";
import CatalogosPDF from "./components/CatalogosPDF";
import Catalogo from "./components/Catalogo";
import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import Tracking from "./components/Tracking";
import ChatWidget from "./components/ChatWidget";

const API_URL = "http://localhost:3001/api";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pantalla, setPantalla] = useState("home");
  const [busqueda, setBusqueda] = useState("");
  const [productoSel, setProductoSel] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const fetchProductos = useCallback(async (filtros = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("busqueda", busqueda);
      Object.keys(filtros).forEach(k => {
        if (filtros[k]) params.append(k, filtros[k]);
      });
      const res = await fetch(`${API_URL}/productos?${params}`);
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      console.error("Error fetching productos:", e);
    }
    setLoading(false);
  }, [busqueda]);

  useEffect(() => {
    fetchProductos().then(() => setInitialLoad(false));
  }, [fetchProductos]);

  function go(p) { setPantalla(p); }

  function handleBuscar(filtros = {}) {
    setPantalla("catalogo");
    fetchProductos({ ...filtros, busqueda });
  }

  function handleAgregarCarrito(prod, cant = 1, variante = null) {
    setCarrito(cs => {
      const idx = cs.findIndex(x => x.id === prod.id && x.variante === (variante || prod.variantes?.[0]?.id));
      if (idx !== -1) {
        const copia = cs.slice();
        copia[idx] = { ...copia[idx], cant: copia[idx].cant + cant };
        return copia;
      }
      return [...cs, { id: prod.id, nombre: prod.nombre, precio: prod.precio, variante: variante || prod.variantes?.[0]?.id, cant }];
    });
    setPantalla("carrito");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="navbar">
        <div className="container">
          <h1 style={{ cursor: "pointer" }} onClick={() => go("home")}>TodoRoscas</h1>
          <div className="nav-links">
            <a className={pantalla === "home" ? "active" : ""} onClick={() => go("home")}>🏠 Inicio</a>
            <a className={pantalla === "catalogo" ? "active" : ""} onClick={() => go("catalogo")}>📦 Catálogo</a>
            <a className={pantalla === "carrito" ? "active" : ""} onClick={() => go("carrito")}>🛒 Carrito ({carrito.length})</a>
            <a className={pantalla === "tracking" ? "active" : ""} onClick={() => go("tracking")}>🚚 Tracking</a>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {pantalla === "home" && (
          <>
            <Slider />
            <div className="container">
              <form className="busqueda-global" onSubmit={e => { e.preventDefault(); handleBuscar(); }}>
                <input className="input" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍 Buscar tornillos, tuercas, arandelas..." />
                <button className="btn-primary" type="submit">Buscar</button>
              </form>
              <div className="section-title">
                <h2>Categorías</h2>
                <p>Explora nuestra amplia variedad de productos</p>
              </div>
              <Categorias onCategoria={cat => { setBusqueda(cat); handleBuscar({ categoria: cat }); }} />
              <CatalogosPDF />
            </div>
          </>
        )}

        {pantalla === "catalogo" && (
          <div className="container">
            <Catalogo
              productos={productos}
              loading={loading}
              busqueda={busqueda}
              onBuscar={handleBuscar}
              onVerDetalle={prod => { setProductoSel(prod); go('detalle'); }}
              onAgregarCarrito={handleAgregarCarrito}
            />
          </div>
        )}

        {pantalla === "detalle" && productoSel && (
          <div className="container">
            <div className="detalle-producto">
              <DetalleProducto
                producto={productoSel}
                onAgregarCarrito={handleAgregarCarrito}
                productos={productos}
                onAtras={() => go('catalogo')}
              />
            </div>
          </div>
        )}

        {pantalla === "carrito" && (
          <div className="container carrito-page">
            <Carrito productos={productos} carrito={carrito} setCarrito={setCarrito} />
          </div>
        )}

        {pantalla === "tracking" && (
          <div className="tracking-page">
            <div className="container">
              <Tracking />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>TodoRoscas</h4>
              <p>Tu tienda de confianza para tornillos, tuercas y fijaciones.</p>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <p>📞 +507 6000-1234</p>
              <p>📧 info@todoroscas.com</p>
              <p>📍 Vía España, Panamá</p>
            </div>
            <div className="footer-section">
              <h4>Horario</h4>
              <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
              <p>Sáb: 8:00 AM - 2:00 PM</p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2024 TodoRoscas. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}