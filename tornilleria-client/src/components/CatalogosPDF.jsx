export default function CatalogosPDF() {
  return (
    <section style={{margin:"2.5em 0"}}>
      <h2>Catálogos en PDF</h2>
      <div style={{display:"flex",gap:32,maxWidth:600,margin:"auto"}}>
        <div style={{background:"#fff",padding:"1.5em",borderRadius:8,textAlign:"center",boxShadow:"0 2px 12px #0002",flex:1}}>
          <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" style={{width:54,marginBottom:8}} />
          <div><b>Catálogo General</b></div>
          <button className="btn-primary" style={{marginTop:10}}
            onClick={()=>window.open("catalogo-general.pdf","_blank")}>Ver Catálogo</button>
        </div>
        <div style={{background:"#fff",padding:"1.5em",borderRadius:8,textAlign:"center",boxShadow:"0 2px 12px #0002",flex:1}}>
          <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" style={{width:54,marginBottom:8}} />
          <div><b>Catálogo Industrial</b></div>
          <button className="btn-primary" style={{marginTop:10}}
            onClick={()=>window.open("catalogo-industrial.pdf","_blank")}>Ver Catálogo</button>
        </div>
      </div>
    </section>
  )
}