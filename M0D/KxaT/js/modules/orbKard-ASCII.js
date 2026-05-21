function updateInterface(name){
  const safe = name || 'Convidado';
  els.lblName.innerText = safe;
  if(els.input && document.activeElement !== els.input) {
      els.input.value = safe;
  }
  
  const activeKey = STATE.keys.find(k=>k.active);
  els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
  
  // Renderiza os novos avatares 3D do Orb Generator V3
  if(window.makeOrbAvatar) {
      els.smallMiniAvatar.innerHTML = window.makeMiniAvatar(safe);
      els.actMiniAvatar.innerHTML = window.makeOrbAvatar(safe, 36);
      els.avatarTgt.innerHTML = window.makeOrbAvatar(safe, 64);
  }

  els.actName.innerText = safe;
  
  const phrases = ["Foco estável.","Ritmo criativo.","Percepção sutil."];
  els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe==='Convidado'?'Aguardando...':`${safe} · ${phrases[safe.length%phrases.length]}`);
  
  const line = `+${'-'.repeat(safe.length+4)}+`;
  els.actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hashStr(safe).toString(16)}`;
}
