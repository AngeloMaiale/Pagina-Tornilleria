export default function DetalleProducto({producto, onAgregarCarrito, productos, onAtras}) {
  if(!producto) return null;
  let [cant, setCant] = React.useState(1);
  let [variante, setVar] = React.useState(producto.variantes?.[0]?.id || "");
  let descuento = cant>=50 ? "Descuento del 15% aplicado" : "";

  let relacionados = productos.filter(x=>x.id!==producto.id && (x.diametro===producto.diametro || x.material===producto.material)).slice(0,3);

  return (
    <div className="detalle-flex">
      <div className="detalle-galeria">
        <img src={producto.img} alt={producto.nombre} style={{borderRadius:8}} />
        <div className="detalle-miniaturas">
          <img src={producto.img} className="seleccionada" width={52} height={52} onClick={()=>{}} />
        </div>
      </div>
      <div className="detalle-info">
        <h2>{producto.nombre}</h2>
        <div>Material: {producto.material} {producto.cabeza && ", cabeza "+producto.cabeza}</div>
        <div className="detalle-variante">
          <label>Seleccionar medida:
            <select value={variante} onChange={e=>setVar(e.target.value)}>
              {producto.variantes?.map((v,i)=>(<option key={i} value={v.id}>{v.desc}</option>))}
            </select>
          </label>
        </div>
        <div className="detalle-cantidad">
          <label>Cantidad: <input type="number" min="1" value={cant} onChange={e=>setCant(+e.target.value)} /></label>
        </div>
        <div className="detalle-descuento">{descuento}</div>
        <button className="btn-primary" onClick={()=>onAgregarCarrito(producto,cant,variante)}>Agregar al carrito</button>
        <button className="btn-outline" onClick={()=>alert('Disponibilidad: Sucursal Vía España, 23 uds.')}>Consultar disponibilidad en sucursal</button>
        <h4 style={{marginTop:"2em"}}>Tabla de Equivalencias:</h4>
        <table className="detalle-tabla">
          <tbody>
            <tr><th>mm</th><th>Pulgadas</th></tr>
            <tr><td>8</td><td>5/16"</td></tr>
            <tr><td>10</td><td>3/8"</td></tr>
          </tbody>
        </table>
        <div className="detalle-relacionados">
          <h4>Productos Relacionados</h4>
          {relacionados.map(r=>(
            <span key={r.id} style={{marginRight:16}}><a href="#" onClick={e=>{e.preventDefault(); onAtras();}}>{r.nombre}</a></span>
          ))}
        </div>
      </div>
    </div>
  )
}