(() => {
  const data = window.INCIDENCE_STATS;
  if (!data) { document.querySelector('main').innerHTML = '<p>No se han podido cargar las estadísticas.</p>'; return; }
  const total = data.total;
  const cats = data.categories;
  const fmt = n => new Intl.NumberFormat('es-ES').format(n);
  const pct = n => total ? (n / total * 100).toLocaleString('es-ES',{maximumFractionDigits:1})+'%' : '0%';
  const sum = obj => Object.values(obj).reduce((a,b)=>a+b,0);
  const top = obj => Object.entries(obj).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('total').textContent=fmt(total);
  document.getElementById('equipment-count').textContent=Object.keys(cats.equipment).length;
  document.getElementById('type-count').textContent=Object.keys(cats.type).length;
  const resolved = Object.entries(cats.status).filter(([k])=>k.toLowerCase().includes('resolt')).reduce((a,[,v])=>a+v,0);
  document.getElementById('resolved').textContent=fmt(resolved);
  document.getElementById('resolved-pct').textContent=pct(resolved)+' del total';
  const palette=['#2f6b9a','#e09b52','#4c9b88','#8b79b8','#d16f73','#6c9aa8','#b0a05b','#6680b5','#a77b65'];
  function draw(id,obj,horizontal=false){
    const canvas=document.getElementById(id), ctx=canvas.getContext('2d');
    const entries=Object.entries(obj).sort((a,b)=>b[1]-a[1]);
    const dpr=window.devicePixelRatio||1, w=canvas.clientWidth, h=canvas.clientHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.scale(dpr,dpr);
    const max=Math.max(...entries.map(x=>x[1]),1);
    const left=horizontal?118:8, right=12, topPad=10;
    const rowH=(h- topPad-8)/entries.length;
    entries.forEach(([label,value],i)=>{
      const y=topPad+i*rowH, color=palette[i%palette.length];
      ctx.fillStyle='#eaf0f5';
      if(horizontal){
        ctx.font='12px system-ui';ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillStyle='#536477';ctx.fillText(label,left-10,y+rowH*.35);
        const barW=Math.max(2,(w-left-right)*(value/max));
        ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(left,y+rowH*.12,barW,Math.min(18,rowH*.48),5);ctx.fill();
        ctx.fillStyle='#263b52';ctx.textAlign='left';ctx.fillText(fmt(value)+' · '+pct(value),Math.min(left+barW+7,w-95),y+rowH*.35);
      } else {
        const barW=(w-left-right)*(value/max);
        ctx.fillStyle='#536477';ctx.font='11px system-ui';ctx.textAlign='left';ctx.textBaseline='middle';
        const labelText=label.length>25?label.slice(0,23)+'…':label;
        ctx.fillText(labelText,left,y+rowH*.32);
        ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(left,y+rowH*.52,barW,Math.max(7,rowH*.25),4);ctx.fill();
        ctx.fillStyle='#263b52';ctx.textAlign='right';ctx.fillText(fmt(value)+' ('+pct(value)+')',w-right,y+rowH*.32);
      }
    });
    const legend=document.getElementById(id+'-legend');
    legend.innerHTML=entries.map(([label,value],i)=>'<span class="legend-item"><i class="dot" style="background:'+palette[i%palette.length]+'"></i>'+label+': <b>'+fmt(value)+'</b></span>').join('');
  }
  draw('equipment',cats.equipment);
  draw('type',cats.type);
  draw('priority',cats.priority);
  draw('status',cats.status);
  draw('location',cats.location,true);
  const conclusions=[
    'El equipamiento con más incidencias es '+top(cats.equipment)[0]+' ('+fmt(top(cats.equipment)[1])+'; '+pct(top(cats.equipment)[1])+').',
    'El tipo de incidencia más frecuente es '+top(cats.type)[0]+' ('+fmt(top(cats.type)[1])+'; '+pct(top(cats.type)[1])+').',
    'La prioridad más habitual es '+top(cats.priority)[0]+' ('+fmt(top(cats.priority)[1])+'; '+pct(top(cats.priority)[1])+').',
    'El estado más frecuente es '+top(cats.status)[0]+' ('+fmt(top(cats.status)[1])+'; '+pct(top(cats.status)[1])+').',
    'La ubicación con más registros es '+top(cats.location)[0]+' ('+fmt(top(cats.location)[1])+'; '+pct(top(cats.location)[1])+').'
  ];
  document.getElementById('conclusions').innerHTML=conclusions.map(x=>'<li>'+x+'</li>').join('');
  window.addEventListener('resize',()=>{draw('equipment',cats.equipment);draw('type',cats.type);draw('priority',cats.priority);draw('status',cats.status);draw('location',cats.location,true);});
})();
