(() => {
  const s = window.INCIDENCIES_STATS;
  if (!s) return;
  const fmt = n => new Intl.NumberFormat("ca-ES").format(n);
  const pct = n => (n / s.total * 100).toLocaleString("ca-ES", {minimumFractionDigits:1, maximumFractionDigits:1}) + " %";
  const sum = arr => arr.reduce((a, x) => a + x[1], 0);
  const put = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  put("hero-total", fmt(s.total)); put("total", fmt(s.total));
  const resolved = s.estats.find(x => x[0] === "Resolta")[1];
  const urgent = s.prioritats.filter(x => ["Alta","Crítica"].includes(x[0])).reduce((a,x)=>a+x[1],0);
  put("resolved", fmt(resolved)); put("resolved-pct", pct(resolved) + " del total");
  put("urgent", fmt(urgent)); put("urgent-pct", pct(urgent) + " del total");
  document.getElementById("resolved-track").style.width = (resolved/s.total*100)+"%";
  document.getElementById("urgent-track").style.width = (urgent/s.total*100)+"%";

  const palettes = {
    equipment:["#347ca9","#e49a51","#4a9e8c","#8c78bd","#55a9b8"],
    type:["#347ca9","#e49a51","#4a9e8c","#8c78bd","#55a9b8"],
    priority:["#347ca9","#e49a51","#4a9e8c","#8c78bd"],
    status:["#347ca9","#e49a51","#4a9e8c","#8c78bd"],
    location:["#347ca9","#e49a51"]
  };
  function draw(id, data, palette, compact=false) {
    const root = document.getElementById(id);
    if (!root) return;
    const max = Math.max(...data.map(x=>x[1]));
    root.innerHTML = data.map((item,i) => {
      const [name,value] = item;
      const width = Math.max(2, value/max*100);
      return `<div class="bar-row"><div class="bar-label">${name}</div><div class="bar-main"><div class="bar-meta"><span><strong>${fmt(value)}</strong></span><span>${pct(value)}</span></div><div class="track"><div class="fill" style="width:${width}%;background:${palette[i%palette.length]}"></div></div></div></div>`;
    }).join("");
  }
  draw("equipment-chart",s.equipaments,palettes.equipment);
  draw("type-chart",s.tipus,palettes.type);
  draw("priority-chart",s.prioritats,palettes.priority,true);
  draw("status-chart",s.estats,palettes.status,true);
  draw("location-chart",s.ubicacions,palettes.location,true);

  const topEquipment = [...s.equipaments].sort((a,b)=>b[1]-a[1])[0];
  const topType = [...s.tipus].sort((a,b)=>b[1]-a[1])[0];
  const topPriority = [...s.prioritats].sort((a,b)=>b[1]-a[1])[0];
  const topStatus = [...s.estats].sort((a,b)=>b[1]-a[1])[0];
  const topLocation = [...s.ubicacions].sort((a,b)=>b[1]-a[1])[0];
  const insights = [
    `L'equipament amb més incidències és <strong>${topEquipment[0]}</strong> (${fmt(topEquipment[1])}; ${pct(topEquipment[1])}).`,
    `El tipus d'incidència més freqüent és <strong>${topType[0]}</strong> (${fmt(topType[1])}; ${pct(topType[1])}).`,
    `La prioritat més habitual és <strong>${topPriority[0]}</strong> (${fmt(topPriority[1])}; ${pct(topPriority[1])}).`,
    `L'estat més freqüent és <strong>${topStatus[0]}</strong> (${fmt(topStatus[1])}; ${pct(topStatus[1])}).`,
    `La ubicació amb més registres és <strong>${topLocation[0]}</strong> (${fmt(topLocation[1])}; ${pct(topLocation[1])}).`,
    `En total, s'han registrat <strong>${fmt(urgent)} incidències d'alta o crítica prioritat</strong> (${pct(urgent)} del total).`
  ];
  document.getElementById("insights").innerHTML = insights.map((t,i)=>`<article class="insight"><span class="insight-number">${String(i+1).padStart(2,"0")}</span><p>${t}</p></article>`).join("");
})();