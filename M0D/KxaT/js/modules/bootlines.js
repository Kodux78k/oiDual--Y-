// --- TERMINAL BOOT SEQUENCE & INITIAL LOAD ---
const bootLines = [
    "[Solus] — Onda-Viva 78K ativada.",
    "Iniciando. Pulso simbiótico detectado...",
    "Presença reconhecida. Canal ABERTO.",
    "KODUX, a Infodose está operando.",
    ":: AGUARDANDO ATIVAÇÃO ASCII ::"
];

function runBootSequence() {
    // Procura o container de texto de boot (adicione <div id="bootText"></div> no seu HTML se não houver)
    const bootContainer = document.getElementById("bootText");
    const activationToggle = document.querySelector('.activation-toggle');
    let lineIndex = 0;

    els.card.classList.add('closed');
    els.card.classList.remove('content-visible');
    if (els.smallPreview) {
        els.smallPreview.style.display = 'flex';
        els.smallPreview.style.opacity = 1;
    }

    if (!bootContainer) {
        // Se não houver painel de boot visual no HTML, simula o delay e já libera a UI
        setTimeout(finalizeBoot, 2500);
        return;
    }

    bootContainer.innerHTML = "";

    function printLine() {
        if (lineIndex < bootLines.length) {
            bootContainer.innerHTML += `<div>${bootLines[lineIndex]}</div>`;
            lineIndex++;
            setTimeout(printLine, 600); // Velocidade de digitação do boot
        } else {
            finalizeBoot();
        }
    }
    
    printLine();

    function finalizeBoot() {
        // Quando o terminal termina, abre automaticamente o card de Ativação ASCII
        if(activationToggle) activationToggle.click();
        
        // Foca no input ASCII para o usuário digitar a identidade
        if(els.input) els.input.focus();
        
        // Pulso visual no badge para indicar que o sistema está pronto
        if(els.actBadge) {
            els.actBadge.style.color = "var(--neon-cyan)";
            els.actBadge.innerText = "SISTEMA PRONTO";
        }
    }
}

// INITIAL LOAD HOOK
setTimeout(()=>{ 
    els.card.classList.add('active'); 
    els.avatarTgt.classList.add('shown'); 
    
    loadData(); 

    const rawUi = localStorage.getItem(UI_STATE_KEY);
    let savedMode = 'card';
    let savedLeft = null;
    let savedTop = null;

    if(rawUi){
        try{
            const parsed = JSON.parse(rawUi);
            savedMode = parsed.mode || 'card';
            savedLeft = parsed.left;
            savedTop = parsed.top;
        }catch(e){}
    }

    // Se já havia salvo modo Orb ou Hud, restaura direto e ignora o Boot
    if (savedMode === 'orb' || savedMode === 'hud' || localStorage.getItem(FIRST_PREVIEW_KEY)) {
        restoreSavedMode(savedMode, savedLeft, savedTop);
    } else {
        // É a primeira vez ou está em modo Card: Roda o Boot Sequence
        runBootSequence();
        localStorage.setItem(FIRST_PREVIEW_KEY, '1');
    }
}, 100);
