import React, { useEffect, useState } from "react";
const SLIDES = [
  {
    titulo: "Tornillos de acero inoxidable",
    desc: "¡Resistentes a la corrosión, para construcción y marina!",
    img: "https://cdn.pixabay.com/photo/2016/03/31/20/25/bolt-1292501_1280.png"
  },
  {
    titulo: "¡Kit de fijaciones automotrices!",
    desc: "Combo de grapas, tornillos y tuercas auto para talleres.",
    img: "https://cdn.pixabay.com/photo/2017/03/27/14/55/screw-2178787_1280.jpg"
  },
  {
    titulo: "Oferta: Cajillas a precio por mayor",
    desc: "Consulta nuestros descuentos escalonados por volumen.",
    img: "https://cdn.pixabay.com/photo/2012/04/13/15/17/box-32425_1280.png"
  }
];
export default function Slider() {
  const [idx,setIdx] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>setIdx(i=>(i+1)%SLIDES.length),5000);
    return ()=>clearInterval(id);
  },[]);
  const s=SLIDES[idx];
  return (
    <div className="slider">
      <div className="slider-content">
        <h2>{s.titulo}</h2>
        <p>{s.desc}</p>
      </div>
      <div className="slider-img">
        <img src={s.img} alt={s.titulo} />
      </div>
      <div className="slider-controls">
        <button onClick={()=>setIdx((idx-1+SLIDES.length)%SLIDES.length)}>&#8249;</button>
        <button onClick={()=>setIdx((idx+1)%SLIDES.length)}>&#8250;</button>
      </div>
    </div>
  );
}