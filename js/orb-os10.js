/**
 * FUSION OS // KERNEL v2.2 (UX Polish)
 * - Input Centralizado
 * - Orb Estabilizado (No wobble, no aggressive scaling)
 */

const FusionOS = (() => {
    // --- 1. CONFIG & PRIVATE STATE ---
    const CONFIG = {
        key: 'fusion_os_state',
        rootId: 'fusion-os-root',
        fusionLayerId: 'navRoot',
        voice: true
    };

    let _state = {
        active: false,
        installed: []
    };

    // --- 2. SUBSYSTEMS ---
    const Utils = {
        speak: (msg) => {
            if (!CONFIG.voice) return;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(msg);
            u.lang = 'pt-BR'; u.rate = 1.2;
            window.speechSynthesis.speak(u);
        },
        save: () => localStorage.setItem(CONFIG.key, JSON.stringify({ installed: _state.installed })),
        load: () => {
            const data = JSON.parse(localStorage.getItem(CONFIG.key));
            if (data && data.installed) _state.installed = data.installed;
        },
        injectDeps: () => {
            if (!document.querySelector('script[src*="tailwindcss"]')) {
                const s = document.createElement('script');
                s.src = 'https://cdn.tailwindcss.com';
                document.head.appendChild(s);
            }
            if (!window.lucide) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/lucide@latest';
                s.onload = () => window.lucide.createIcons();
                document.head.appendChild(s);
            }
        }
    };

    // --- 3. UI GENERATOR (Styles & HTML) ---
    const UI = {
        styles: `
            #fusion-os-root { font-family: 'Inter', sans-serif; color: white; }
            .monolith-wrapper { perspective: 2000px; z-index: 9998; pointer-events: none; }
            .monolith { 
                background: rgba(8, 8, 12, 0.95); backdrop-filter: blur(50px);
                border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;
                transform: translateY(60px) scale(0.95); opacity: 0;
                transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); pointer-events: none;
                box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8);
            }
            .os-active .monolith { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
            
            .runtime-layer { position: absolute; inset: 0; background: black; transform: translateY(100%); transition: 0.6s cubic-bezier(0.8, 0, 0.2, 1); z-index: 1000; }
            .runtime-layer.visible { transform: translateY(0); }
            
            .app-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); transition: 0.2s; }
            .app-card:hover { border-color: rgba(0, 242, 255, 0.3); background: rgba(255,255,255,0.04); transform: translateY(-2px); }

            /* ===== ORB STYLE REFINED ===== */
            :root {
                --orb-cyan: #00f2ff;
                --orb-purple: #bd00ff;
            }

            .orb-trigger {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                width: 70px; height: 70px; 
                cursor: pointer; pointer-events: auto; z-index: 10000;
                display: flex; justify-content: center; align-items: center; 
                transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                background: transparent; border: none; outline: none;
            }
            .orb-trigger:hover { transform: translateX(-50%) scale(1.05); }

            .orb-core { 
                width: 10px; height: 10px; background: #fff; border-radius: 50%; 
                box-shadow: 0 0 15px rgba(255,255,255,0.8); z-index: 2; transition: 0.4s; 
            }
            
            .orb-ring { 
                position: absolute; width: 50px; height: 50px; border-radius: 50%; 
                border: 2px solid transparent; 
                border-top-color: var(--orb-cyan); 
                border-bottom-color: var(--orb-purple); 
                animation: orb-spin 4s linear infinite; 
                opacity: 0.8; transition: 0.4s;
            }

            /* ESTADO ATIVO (SUAVE) */
            .os-active .orb-core {
                background: var(--orb-cyan);
                box-shadow: 0 0 25px var(--orb-cyan); /* Glow mais intenso */
                transform: scale(1.1); /* Cresce só um pouquinho */
            }

            .os-active .orb-ring {
                border-top-color: #fff; /* Muda para branco para indicar "ON" */
                border-bottom-color: var(--orb-cyan);
                opacity: 1;
                /* Mantém o mesmo tamanho e velocidade para não ficar estranho */
            }

            @keyframes orb-spin { to { transform: rotate(360deg); } }
        `,
        build: () => {
            const container = document.createElement('div');
            container.id = CONFIG.rootId;
            container.innerHTML = `
                <style>${UI.styles}</style>
                <div class="monolith-wrapper fixed inset-0 flex items-center justify-center p-4">
                    <div id="monolith-ui" class="monolith w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden relative">
                        
                        <div class="h-20 border-b border-white/5 grid grid-cols-3 items-center px-8 bg-black/20">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f2ff]"></div>
                                <span class="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Fusion Kernel</span>
                            </div>

                            <div class="flex justify-center w-full">
                                <div class="relative group w-64">
                                    <input id="os-terminal" type="text" placeholder="INSIRA CÓDIGO" 
                                        class="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-center text-xs font-mono text-cyan-400 placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all tracking-widest uppercase shadow-inner"
                                        autocomplete="off"
                                    />
                                    <div class="absolute inset-0 rounded-full border border-cyan-500/0 group-hover:border-cyan-500/20 pointer-events-none transition-all"></div>
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <span id="os-status-text" class="text-[9px] text-white/20 tracking-widest uppercase">Standby</span>
                            </div>
                        </div>

                        <div id="os-app-grid" class="flex-1 p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start"></div>

                        <div id="os-runtime" class="runtime-layer flex flex-col">
                            <div class="h-12 bg-zinc-950 border-b border-white/10 flex justify-between items-center px-6">
                                <span class="text-[10px] font-bold text-cyan-400 tracking-tighter">PROCESS_RUNNING</span>
                                <button onclick="FusionOS.closeRuntime()" class="text-white/40 hover:text-white transition-colors text-xs px-3 py-1 rounded hover:bg-white/10">FECHAR</button>
                            </div>
                            <iframe id="os-frame" class="flex-1 bg-white border-none"></iframe>
                        </div>
                    </div>
                </div>

                <button id="orb-trigger" class="orb-trigger" onclick="FusionOS.toggle()" aria-label="Toggle Fusion OS">
                    <div class="orb-ring"></div>
                    <div class="orb-core"></div>
                </button>

                <div id="fusion-exit-ctrl" class="fixed top-6 right-6 z-[10001] hidden">
                    <button onclick="FusionOS.exitFusion()" class="bg-black/50 hover:bg-red-500/90 text-white border border-white/10 px-6 py-2 rounded-full text-[10px] font-bold transition-all backdrop-blur-md shadow-lg tracking-wider">
                        ENCERRAR FUSÃO
                    </button>
                </div>
            `;
            document.body.appendChild(container);
        }
    };

    // --- 4. ENGINE CORE ---
    return {
        boot: () => {
            console.log("%c FUSION OS v2.2 // READY ", "background:#000; color:#00f2ff; font-weight:bold;");
            Utils.injectDeps();
            UI.build();
            Utils.load();
            
            // Terminal Logic
            const term = document.getElementById('os-terminal');
            term.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const cmd = term.value.toUpperCase().trim();
                    if(cmd) FusionOS.handleCommand(cmd);
                    term.value = '';
                    term.blur(); // Remove foco após comando
                }
            });

            FusionOS.render();
        },

        register: ({ name, code, url = null, html = null }) => {
            if (!code || (!url && !html)) return;
            if (_state.installed.find(m => m.code === code)) return;

            _state.installed.unshift({ id: Date.now(), name, code, url, html });
            Utils.save();
            FusionOS.render();
            Utils.speak(`Protocolo ${name} instalado.`);
        },

        toggle: () => {
            _state.active = !_state.active;
            const root = document.getElementById(CONFIG.rootId);
            const status = document.getElementById('os-status-text');
            const term = document.getElementById('os-terminal');
            
            root.classList.toggle('os-active', _state.active);
            status.innerText = _state.active ? 'System Online' : 'Standby';
            
            if (_state.active) {
                Utils.speak("Bem vindo.");
                setTimeout(() => term.focus(), 100); // Foca no input ao abrir
            }
        },

        render: () => {
            const grid = document.getElementById('os-app-grid');
            if (!grid) return;
            
            if (_state.installed.length === 0) {
                grid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center text-white/20 h-32 text-xs tracking-widest">SISTEMA VAZIO<br>AGUARDANDO CÓDIGO...</div>`;
                return;
            }

            grid.innerHTML = _state.installed.map(m => `
                <div class="app-card p-5 rounded-2xl flex flex-col gap-4 relative group">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="text-[9px] text-cyan-400 font-mono mb-1 tracking-wider opacity-60">${m.code}</span>
                            <h3 class="font-bold text-sm text-white/90 leading-tight">${m.name}</h3>
                        </div>
                        <i data-lucide="box" class="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors"></i>
                    </div>
                    <div class="mt-auto grid grid-cols-2 gap-2">
                        <button onclick="FusionOS.launch('${m.code}', 'sandbox')" class="bg-white/5 hover:bg-white/10 text-[9px] font-bold py-2 rounded border border-white/5 hover:border-white/20 transition-all text-white/60 hover:text-white">JANELA</button>
                        <button onclick="FusionOS.launch('${m.code}', 'fusion')" class="bg-cyan-500/10 hover:bg-cyan-400 hover:text-black text-cyan-400 text-[9px] font-bold py-2 rounded border border-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(0,242,255,0.05)] hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]">FUSÃO TOTAL</button>
                    </div>
                </div>
            `).join('');
            if (window.lucide) window.lucide.createIcons();
        },

        launch: async (code, mode) => {
            const module = _state.installed.find(m => m.code === code);
            if (!module) return;

            if (mode === 'sandbox') {
                const rt = document.getElementById('os-runtime');
                const frame = document.getElementById('os-frame');
                rt.classList.add('visible');
                if (module.url) frame.src = module.url;
                else frame.srcdoc = module.html;
                Utils.speak(`Abrindo ${module.name}.`);
            } 
            else if (mode === 'fusion') {
                FusionOS.performFusion(module);
            }
        },

        performFusion: async (module) => {
            const layer = document.getElementById(CONFIG.fusionLayerId);
            if (!layer) return alert("Erro: NavRoot não encontrado.");

            if (_state.active) FusionOS.toggle(); // Fecha o painel suavemente
            
            document.getElementById('fusion-exit-ctrl').classList.remove('hidden');
            Utils.speak("Fusão iniciada.");

            let content = "";
            if (module.url) {
                try {
                    const resp = await fetch(module.url);
                    if (!resp.ok) throw new Error("Network");
                    content = await resp.text();
                    this.injectIntoDOM(layer, content);
                } catch (e) {
                    const ifr = document.createElement('iframe');
                    ifr.src = module.url;
                    ifr.style.cssText = "width:100vw; height:100vh; border:none; position:fixed; inset:0; z-index:9999;";
                    layer.appendChild(ifr);
                }
            } else {
                this.injectIntoDOM(layer, module.html);
            }
        },

        injectIntoDOM: (target, html) => {
            target.innerHTML = html;
            target.querySelectorAll('script').forEach(old => {
                const s = document.createElement('script');
                [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
                s.textContent = old.textContent;
                old.replaceWith(s);
            });
        },

        exitFusion: () => {
            document.getElementById(CONFIG.fusionLayerId).innerHTML = '';
            document.getElementById('fusion-exit-ctrl').classList.add('hidden');
            Utils.speak("Retornando.");
            FusionOS.toggle();
        },

        closeRuntime: () => {
            document.getElementById('os-runtime').classList.remove('visible');
            setTimeout(() => document.getElementById('os-frame').src = '', 500);
        },

        handleCommand: (cmd) => {
            const BUILTINS = {
                'OIDUAL': { name: 'OiDual Module', url: 'https://kodux78k.github.io/oiDual-dip-0/' },
                'VIVI': { name: 'Vivivi System', url: 'https://kodux78k.github.io/oiDual-Vivivi-1/' },
                'DELTA': { name: 'Delta Hub', url: 'https://kodux78k.github.io/DualInfodose-VirgemHuB/index.html' },
                'RESET': 'RESET'
            };

            if (cmd === 'RESET') {
                localStorage.removeItem(CONFIG.key);
                location.reload();
                return;
            }

            if (BUILTINS[cmd]) {
                FusionOS.register({ ...BUILTINS[cmd], code: cmd });
                Utils.speak("Código aceito.");
            } else {
                // Feedback visual de erro no input
                const term = document.getElementById('os-terminal');
                term.style.borderColor = 'red';
                term.style.color = 'red';
                setTimeout(() => {
                    term.style.borderColor = '';
                    term.style.color = '';
                }, 500);
            }
        }
    };
})();

FusionOS.boot();
