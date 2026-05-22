import React, { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";

const API_URL = "http://localhost:3001/api";

export default function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [stats, setStats] = useState({ total: 0, categorias: {}, stockBajo: 0, sinStock: 0 });

  async function fetchProductos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
      calculateStats(data);
    } catch (e) {
      console.error("Error fetching productos:", e);
    }
    setLoading(false);
  }

  function calculateStats(data) {
    const total = data.length;
    const categorias = {};
    let stockBajo = 0;
    let sinStock = 0;
    data.forEach(p => {
      categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
      if (p.stock < 10) stockBajo++;
      if (p.stock === 0) sinStock++;
    });
    setStats({ total, categorias, stockBajo, sinStock });
  }

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setAdmin(true);
      fetchProductos();
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.token) {
        setAdminToken(data.token);
        setAdmin(true);
        setLoginForm({ username: "", password: "" });
        localStorage.setItem("adminToken", data.token);
        fetchProductos();
      } else {
        alert("Credenciales inválidas");
      }
    } catch (e) {
      alert("Error de conexión");
    }
  }

  function handleLogout() {
    setAdmin(false);
    setAdminToken("");
    localStorage.removeItem("adminToken");
  }

  function go(p) {
    if (p === "productos") fetchProductos();
  }

  if (!admin) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>TodoRoscas Admin</h2>
          <p className="subtitle">Ingrese sus credenciales para acceder al panel</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuario</label>
              <input
                className="input"
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            <button className="btn-primary" type="submit">Iniciar Sesión</button>
          </form>
          <p className="credentials">
            <strong>Usuario:</strong> admin<br />
            <strong>Contraseña:</strong> tornillo2024
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="admin-nav">
        <div className="container">
          <h1>TodoRoscas Admin</h1>
          <div className="nav-links">
            <a onClick={() => go("dashboard")} className="active">📊 Dashboard</a>
            <a onClick={() => go("productos")}>📦 Productos</a>
            <a onClick={handleLogout} className="logout-btn">🚪 Cerrar Sesión</a>
          </div>
        </div>
      </nav>

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <h1>Panel de Control</h1>
            <p>Administra tu inventario de productos</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Productos</h3>
              <div className="value">{stats.total}</div>
              <div className="label">Productos en inventario</div>
            </div>
            <div className="stat-card success">
              <h3>Con Stock</h3>
              <div className="value" style={{ color: "#10b981" }}>{stats.total - stats.sinStock}</div>
              <div className="label">Disponibles para venta</div>
            </div>
            <div className="stat-card warning">
              <h3>Stock Bajo</h3>
              <div className="value" style={{ color: "#f59e0b" }}>{stats.stockBajo}</div>
              <div className="label">Menos de 10 unidades</div>
            </div>
            <div className="stat-card danger">
              <h3>Sin Stock</h3>
              <div className="value" style={{ color: "#ef4444" }}>{stats.sinStock}</div>
              <div className="label">Agotados</div>
            </div>
          </div>

          <AdminPanel
            productos={productos}
            actualizarProductos={setProductos}
            adminToken={adminToken}
            fetchProductos={fetchProductos}
          />
        </div>
      </main>
    </div>
  );
}