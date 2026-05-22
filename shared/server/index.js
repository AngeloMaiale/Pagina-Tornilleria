import express from "express";
import cors from "cors";
import initSqlJs from "sql.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "tornilleria.db");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

async function initDB() {
  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      img TEXT,
      stock INTEGER DEFAULT 0,
      material TEXT,
      cabeza TEXT,
      longitud INTEGER DEFAULT 0,
      diametro INTEGER DEFAULT 0,
      variantes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  return db;
}

let db;

const demo = [
  { categoria: "automotriz", nombre: "Tornillo cabeza hexagonal M8x50 zincado", precio: 1.10, img: "https://cdn.pixabay.com/photo/2016/04/10/08/25/screw-1292501_1280.jpg", stock: 123, material: "zincado", cabeza: "hexagonal", longitud: 50, diametro: 8, variantes: JSON.stringify([{ id: "M8x50", desc: "M8x50" }, { id: "M8x60", desc: "M8x60" }]) },
  { categoria: "industrial", nombre: "Tornillo cabeza phillips 3/8x2\" inoxidable", precio: 1.49, img: "https://cdn.pixabay.com/photo/2014/09/27/13/43/screw-463063_1280.jpg", stock: 93, material: "inoxidable", cabeza: "phillips", longitud: 50, diametro: 10, variantes: JSON.stringify([{ id: "3/8x2", desc: "3/8x2\"" }]) },
  { categoria: "construccion", nombre: "Tornillo cabeza hexagonal M6x40 negro", precio: 0.95, img: "https://cdn.pixabay.com/photo/2019/03/12/20/07/screw-4051195_1280.jpg", stock: 85, material: "negro", cabeza: "hexagonal", longitud: 40, diametro: 6, variantes: JSON.stringify([{ id: "M6x40", desc: "M6x40" }]) },
  { categoria: "construccion", nombre: "Arandela acero inoxidable 8mm", precio: 0.37, img: "https://cdn.pixabay.com/photo/2015/10/30/20/13/tools-1013129_1280.jpg", stock: 140, material: "inoxidable", cabeza: "", longitud: 0, diametro: 8, variantes: JSON.stringify([{ id: "8mm", desc: "8mm" }]) },
  { categoria: "industrial", nombre: "Tornillo cabeza phillips M10x70 zincado", precio: 1.25, img: "https://cdn.pixabay.com/photo/2016/07/28/09/16/safety-pin-1542770_1280.jpg", stock: 77, material: "zincado", cabeza: "phillips", longitud: 70, diametro: 10, variantes: JSON.stringify([{ id: "M10x70", desc: "M10x70" }]) }
];

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

app.get("/api/productos", (req, res) => {
  const { busqueda, material, cabeza, long1, long2, diam1, diam2, ordenar, categoria } = req.query;

  let sql = "SELECT * FROM productos WHERE 1=1";
  const params = [];

  if (busqueda) { sql += " AND (nombre LIKE ? OR categoria LIKE ?)"; params.push(`%${busqueda}%`, `%${busqueda}%`); }
  if (material) { sql += " AND material = ?"; params.push(material); }
  if (cabeza) { sql += " AND cabeza = ?"; params.push(cabeza); }
  if (categoria) { sql += " AND categoria = ?"; params.push(categoria); }
  if (long1) { sql += " AND longitud >= ?"; params.push(+long1); }
  if (long2) { sql += " AND longitud <= ?"; params.push(+long2); }
  if (diam1) { sql += " AND diametro >= ?"; params.push(+diam1); }
  if (diam2) { sql += " AND diametro <= ?"; params.push(+diam2); }

  if (ordenar === "precio") sql += " ORDER BY precio ASC";
  else if (ordenar === "precio_desc") sql += " ORDER BY precio DESC";
  else if (ordenar === "nombre") sql += " ORDER BY nombre ASC";

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();

  const productos = rows.map(p => ({ ...p, variantes: JSON.parse(p.variantes || "[]") }));
  res.json(productos);
});

app.get("/api/productos/:id", (req, res) => {
  const stmt = db.prepare("SELECT * FROM productos WHERE id = ?");
  stmt.bind([req.params.id]);

  if (!stmt.step()) return res.status(404).json({ error: "No encontrado" });

  const p = stmt.getAsObject();
  stmt.free();
  res.json({ ...p, variantes: JSON.parse(p.variantes || "[]") });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const hash = hashPassword(password);

  const stmt = db.prepare("SELECT * FROM admin WHERE username = ? AND password_hash = ?");
  stmt.bind([username, hash]);

  if (!stmt.step()) return res.status(401).json({ error: "Credenciales inválidas" });

  const admin = stmt.getAsObject();
  stmt.free();

  const token = crypto.randomBytes(32).toString('hex');
  res.json({ token, username: admin.username });
});

app.post("/api/productos", (req, res) => {
  const { token, producto } = req.body;
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const { nombre, categoria, precio, img, stock, material, cabeza, longitud, diametro, variantes } = producto;

  db.run(`INSERT INTO productos (nombre, categoria, precio, img, stock, material, cabeza, longitud, diametro, variantes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, categoria, precio || 0, img || "", stock || 0, material || "", cabeza || "", longitud || 0, diametro || 0, JSON.stringify(variantes || [])]);

  const lastId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  saveDB();

  res.json({ id: lastId, ...producto });
});

app.put("/api/productos/:id", (req, res) => {
  const { token, producto } = req.body;
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const { nombre, categoria, precio, img, stock, material, cabeza, longitud, diametro, variantes } = producto;

  db.run(`UPDATE productos SET nombre=?, categoria=?, precio=?, img=?, stock=?, material=?, cabeza=?, longitud=?, diametro=?, variantes=? WHERE id=?`,
    [nombre, categoria, precio, img, stock, material, cabeza, longitud, diametro, JSON.stringify(variantes || []), req.params.id]);

  saveDB();
  res.json({ id: +req.params.id, ...producto });
});

app.delete("/api/productos/:id", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "No autorizado" });

  db.run("DELETE FROM productos WHERE id = ?", [req.params.id]);
  saveDB();
  res.json({ ok: true });
});

async function start() {
  db = await initDB();

  const count = db.exec("SELECT COUNT(*) FROM productos")[0].values[0][0];
  if (count === 0) {
    demo.forEach(p => {
      db.run("INSERT INTO productos (categoria, nombre, precio, img, stock, material, cabeza, longitud, diametro, variantes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [p.categoria, p.nombre, p.precio, p.img, p.stock, p.material, p.cabeza, p.longitud, p.diametro, p.variantes]);
    });
  }

  const adminCount = db.exec("SELECT COUNT(*) FROM admin")[0].values[0][0];
  if (adminCount === 0) {
    const hash = hashPassword("tornillo2024");
    db.run("INSERT INTO admin (username, password_hash) VALUES (?, ?)", ["admin", hash]);
  }

  saveDB();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();