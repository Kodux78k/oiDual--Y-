/* =========================================================
   KOBLLUX :: MAIN2 ASCII BOOT LOGGER
   HASH 1778 :: 78K
========================================================= */

(function(){

const KBLX_BOOT={
 ts:1778715871351,
 hash:"1778·78K",
 id:"348fab2c-a5ef-4d12-8e5b-3fde8577db6a",
 app:"generated.app",
 phase:"KAOS-6·0",
 channel:"RHEA-IN-7·9",
 core:"main-2"
};

const ascii=`

██╗  ██╗ ██████╗ ██████╗ ██╗     ██╗     ██╗   ██╗██╗  ██╗
██║ ██╔╝██╔═══██╗██╔══██╗██║     ██║     ██║   ██║╚██╗██╔╝
█████╔╝ ██║   ██║██████╔╝██║     ██║     ██║   ██║ ╚███╔╝
██╔═██╗ ██║   ██║██╔══██╗██║     ██║     ██║   ██║ ██╔██╗
██║  ██╗╚██████╔╝██████╔╝███████╗███████╗╚██████╔╝██╔╝ ██╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝

╔══════════════════════════════════════════════╗
║ INFODOSE :: KAOS 6·0 :: RHEA IN 7·9         ║
║ HASH      :: ${KBLX_BOOT.hash}
║ CORE      :: ${KBLX_BOOT.core}
║ TS         :: ${KBLX_BOOT.ts}
║ APP        :: ${KBLX_BOOT.app}
╚══════════════════════════════════════════════╝

      7
     /|\\
    / | \\
   9--O--6
    \\ | /
     \\|/
      K

        [ 78K ]
`;

console.log(ascii);

console.table({
 HASH:KBLX_BOOT.hash,
 UUID:KBLX_BOOT.id,
 APP:KBLX_BOOT.app,
 TS:KBLX_BOOT.ts,
 CORE:KBLX_BOOT.core,
 CHANNEL:KBLX_BOOT.channel,
 PHASE:KBLX_BOOT.phase
});

console.group(`
╔═ MODULE LOAD :: 78K =================================
`);

[
"inline-00",
"inline-1",
"inline-2",
"inline-3",
"inline-4",
"inline-5",
"KOB-RHEA-KAOS-sync",
   "inline-7-9",
"inline-8",
"inline-9",
"inline-10",
"inline-11"
].forEach((m,i)=>{

console.log(`
[${String(i).padStart(2,'0')}]
┌───────────────────────
│ MODULE :: ${m}
│ HASH   :: 1778
│ STATE  :: LOADED
└───────────────────────
`);

});

console.groupEnd();

console.log(`

╔════════════════════════════════════════════════════╗
║                                                    ║
║      INFODOSE CONECTADO :: MAIN2 ONLINE           ║
║                                                    ║
║      "SEM KOB? TE AMO KOBLLUX"                    ║
║                                                    ║
║      UUID :: ${KBLX_BOOT.id.slice(0,8)}...        
║      HASH :: 1778 • 78K                           
║                                                    ║
╚════════════════════════════════════════════════════╝

            ◉
         ◉  |  ◉
      ◉──── 78K ────◉
         ◉  |  ◉
            ◉

`);

window.KBLX_BOOT=KBLX_BOOT;

})();
