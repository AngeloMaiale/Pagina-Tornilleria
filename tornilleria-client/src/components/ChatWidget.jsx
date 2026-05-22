import React, {useState, useRef} from "react";
export default function ChatWidget() {
  const [abierto,setAbierto]=useState(false);
  const [msg,setMsg]=useState("");
  const [historial,setHistorial]=useState([
    {de:"soporte",txt:"¡Hola! ¿En qué podemos ayudarte? Puedes enviar fotos del tornillo si necesitas identificarlo."}
  ]);
  const ref = useRef();

  function enviar(e) {
    e.preventDefault();
    if(!msg.trim()) return;
    setHistorial(h=>[...h,{de:"user",txt:msg}]);
    setMsg("");
    setTimeout(()=>setHistorial(h=>[...h,{de:"soporte",txt:"Un agente responderá a la brevedad."}]),1200);
  }

  return (
  <>
    <div className="chat-boton-flotante" onClick={()=>setAbierto(true)} title="¿Necesitas ayuda o cotización?">💬</div>
    {abierto &&
      <div className="chat-widget">
        <div className="chat-header">
          <div className="chat-agent-avatar"></div>
          <div>
            <b>Soporte Técnico</b><br />
            <small>Tiempo estimado: 3 min</small>
          </div>
          <button className="chat-close" onClick={()=>setAbierto(false)}>&times;</button>
        </div>
        <div className="chat-body" ref={ref}>
          {historial.map((h,i)=>
            <div key={i} className={`chat-msg${h.de==="user"?" user":""}`}>
              <div className="chat-msg-text">{h.txt}</div>
            </div>
          )}
        </div>
        <div className="chat-faq">
          <strong>FAQ:</strong>
          <div><a href="#" onClick={e=>{e.preventDefault();setMsg("¿Tienen tornillos de acero inoxidable?")}}>¿Tienen tornillos de acero inoxidable?</a></div>
          <div><a href="#" onClick={e=>{e.preventDefault();setMsg("¿Cuánto demora la entrega?")}}>¿Cuánto demora la entrega?</a></div>
          <div><a href="#" onClick={e=>{e.preventDefault();setMsg("¿Puedo pedir factura fiscal?")}}>¿Puedo pedir factura fiscal?</a></div>
        </div>
        <form className="chat-footer" onSubmit={enviar}>
          <input type="text" value={msg} onChange={e=>setMsg(e.target.value)} />
          <button className="btn-primary" type="submit">Enviar</button>
        </form>
      </div>
    }
  </>
  );
}