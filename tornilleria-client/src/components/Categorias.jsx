export default function Categorias({onCategoria}) {
  return (
    <section>
      <h2>Categorías Destacadas</h2>
      <div className="categorias-grid">
        <div className="categoria-card" onClick={()=>onCategoria("automotriz")}>
          <div className="categoria-img"><img src="https://cdn-icons-png.flaticon.com/512/8996/8996511.png" width="38" /></div>
          <strong>Automotriz</strong>
          <span>Tornillos y tuercas para vehículos</span>
        </div>
        <div className="categoria-card" onClick={()=>onCategoria("construccion")}>
          <div className="categoria-img"><img src="https://cdn-icons-png.flaticon.com/512/809/809957.png" width="38" /></div>
          <strong>Construcción</strong>
          <span>Fijaciones para obra civil</span>
        </div>
        <div className="categoria-card" onClick={()=>onCategoria("industrial")}>
          <div className="categoria-img"><img src="https://cdn-icons-png.flaticon.com/512/2965/2965274.png" width="38" /></div>
          <strong>Industrial</strong>
          <span>Soluciones para la industria</span>
        </div>
      </div>
    </section>
  )
}