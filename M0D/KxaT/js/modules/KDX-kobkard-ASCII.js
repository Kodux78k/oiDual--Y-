// =========================================================================
// INTERFACE DE CONEXÃO: BOOT TEXT + ATIVAÇÃO ASCII + ORB INTEGRADO (78K)
// =========================================================================

// Simulação das linhas de log do seu Boot Text original
const bootLines = [
    "[Solus] — Onda-Viva 78K ativada.",
    "Iniciando. Pulso simbiótico detectado...",
    "Sistema Reconhecido. Canal 78K: ABERTO.",
    ":: CÉREBRO AGUARDANDO SINCRONIZAÇÃO ASCII ::"
];

/**
 * Executa a renderização do Boot Text linha por linha
 * e ativa o Card ASCII imediatamente no final.
 */
function renderBootSequence() {
    const bootContainer = document.getElementById("bootText"); // Seu container de texto do boot
    let lineIndex = 0;

    if (!bootContainer) return;

    bootContainer.innerHTML = ""; // Limpa

    function printLine() {
        if (lineIndex < bootLines.length) {
            // Cria a linha com efeito de terminal
            const line = document.createElement("div");
            line.className = "boot-line visual-glitch";
            line.innerText = bootLines[lineIndex];
            bootContainer.appendChild(line);
            
            lineIndex++;
            setTimeout(printLine, 400); // Velocidade de render das linhas
        } else {
            // FIM DO BOOT TEXT -> Gatilho imediato da Ativação ASCII
            triggerAsciiActivation();
        }
    }

    printLine();
}

/**
 * Dispara a exibição visual do card de Ativação ASCII
 */
function triggerAsciiActivation() {
    const activationCard = document.getElementById("activationCard");
    const actBadge = document.getElementById("actBadge");

    if (activationCard) {
        // Remove a classe oculta original do seu Kardkobllux
        activationCard.classList.remove("activation-hidden");
        activationCard.classList.add("activation-visible"); 
    }

    if (actBadge) {
        actBadge.innerHTML = "PRONTO PARA ATIVAR";
        actBadge.style.color = "var(--neon-cyan, #00f0ff)";
    }
    
    // Alerta o painel visual
    console.log("◎ 78K :: Boot completo. Módulo ASCII acoplado ao fluxo.");
}

/**
 * Modificação segura do makeNorb para atualizar o Orb Avatar 
 * sem colidir com o input de chat comum.
 */
function makeNorbAvatar(identityName) {
    const orbCore = document.querySelector(".orb-core");
    const actName = document.getElementById("actName");
    const lblHello = document.getElementById("lblHello");
    const lblName = document.getElementById("lblName");

    if (!identityName || identityName.trim() === "") return;

    // 1. Atualiza os labels internos do módulo de identidade
    if (actName) actName.innerText = identityName.toUpperCase();
    if (lblHello) lblHello.innerText = "Sincronizado:";
    if (lblName) lblName.innerText = identityName;

    // 2. Transição visual do Orb Core baseado no arquétipo ou nome
    if (orbCore) {
        // Entra em estado de pulso de boot com as variáveis de voz do KxaT
        orbCore.style.animation = "orbSpin 3s linear infinite, orbPulse 0.3s ease-in-out infinite alternate";
        
        // Altera as cores do gradiente dinamicamente para provar a simbiose
        orbCore.style.background = `radial-gradient(circle at 30% 30%, var(--kob-voice-primary, #00f0ff), transparent 60%), 
                                    radial-gradient(circle at 70% 70%, #050811, var(--kob-voice-secondary, #7000ff))`;
        
        // Remove o pulso frenético após 2 segundos, mantendo apenas o Spin constante
        setTimeout(() => {
            orbCore.style.animation = "orbSpin var(--orb-speed, 12s) linear infinite";
        }, 2500);
    }
}

/**
 * Escuta os inputs de forma isolada para evitar a quebra do chat de envio
 */
document.addEventListener("DOMContentLoaded", () => {
    // Input exclusivo da ativação de Cérebro/ASCII (do card do Kardkobllux)
    const asciiInput = document.getElementById("inputUser"); 
    
    if (asciiInput) {
        asciiInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const identity = asciiInput.value;
                
                // Roda o render do avatar do Orb
                makeNorbAvatar(identity);
                
                // Opcional: Esconde ou altera o status do card após sucesso
                asciiInput.disabled = true;
                asciiInput.style.opacity = "0.5";
            }
        });
    }
    
    // Executa a sequência integrada
    // renderBootSequence(); 
});
