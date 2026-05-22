export default function Carrito({productos, carrito, setCarrito}) {
  // Puedes agregar/quitar items, pedir/demostrar confirmación, etc.
  let total = 0;
  carrito.forEach(item=>{ total += item.precio*item.cant; });
  let impuestos = total*0.07, envio = 5;

  return (
    <div className="carrito-grid">
      <div className="carrito-lista">
        <h2>Carrito de Compras</h2>
        <table>
          <thead>
            <tr><th>Producto</th><th>Cant.</th><th>Precio u.</th><th>Total</th></tr>
          </thead>
          <tbody>
            {carrito.length===0 && <tr><td colSpan="4">Carrito vacío.</td></tr>}
            {carrito.map((item,idx)=>
              <tr key={idx}>
                <td>{item.nombre} {item.variante&&`(${item.variante})`}</td>
                <td>{item.cant}</td>
                <td>${item.precio.toFixed(2)}</td>
                <td style={{fontWeight:"bold"}}>${(item.precio*item.cant).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="carrito-resumen">
        <h3>Resumen</h3>
        <p>Subtotal: ${total.toFixed(2)}</p>
        <p>Impuestos (7%): ${impuestos.toFixed(2)}</p>
        <p>Costo de envío: ${envio.toFixed(2)}</p>
        <hr/>
        <p><b>Total: ${(total+impuestos+envio).toFixed(2)}</b></p>
        <button className="btn-primary" onClick={()=>alert("Pedido realizado. Recibirá detalles en su correo y WhatsApp.")}>Realizar Pedido</button>
      </div>
    </div>
  )
}