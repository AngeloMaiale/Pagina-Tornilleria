import React, {useState} from "react";
const ESTADOS = ['Pagado', 'Preparando', 'En camino', 'Entregado'];

export default function Tracking() {
  const [estado, setEstado] = useState(2);
  return (
    <div className="tracking-panel">
      <h2>Seguimiento del Pedido</h2>
      <div className="tracking-map">[Mapa en tiempo real aquí]</div>
      <div className="tracking-timeline">
        {ESTADOS.map((et,i)=>(
          <React.Fragment key={i}>
            <div className="timeline-step">
              <div className={"timeline-dot"+(i<=estado?" done":"")}>{i+1}</div>
              <div className="timeline-label">{et}</div>
            </div>
            {i<ESTADOS.length-1 && <hr style={{width:"26px",border:"1px solid #59d3e3"}}/>}
          </React.Fragment>
        ))}
      </div>
      <div className="tracking-repartidor">
        <b>Repartidor:</b> Carlos G. | Cel: <a href="tel:+50760001234">+507 6000-1234</a>
      </div>
      <div className="tracking-actions">
        <button className="btn-primary" onClick={()=>setEstado(3)}>Confirmar recepción</button>
        <button className="btn-outline" onClick={()=>alert("Llamando al repartidor...")}>Llamar repartidor</button>
      </div>
      {estado===3 && <div style={{marginTop:16,color:"green"}}>¡Gracias! Pedido finalizado.</div>}
    </div>
  )
}