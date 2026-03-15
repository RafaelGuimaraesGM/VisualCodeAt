// Referencias principais da interface do jogo.
const telaJogo = document.getElementById("telaJogo");
const jogoWrapper = document.getElementById("jogoWrapper");
const ctxTela = telaJogo.getContext("2d");
const infoPontuacao = document.getElementById("infoPontuacao");
const infoVidas = document.getElementById("infoVidas");
const infoHp = document.getElementById("infoHp");
const infoHpPreenchimento = document.getElementById("infoHpPreenchimento");
const infoVelocidade = document.getElementById("infoVelocidade");
const infoFase = document.getElementById("infoFase");
const infoAsteroides = document.getElementById("infoAsteroides");
const infoArma = document.getElementById("infoArma");
const infoEfeitos = document.getElementById("infoEfeitos");
const hudAsteroidesSecundario = document.getElementById("hudAsteroidesSecundario");
const hudVelocidadeSecundario = document.getElementById("hudVelocidadeSecundario");
const hudArmaSecundario = document.getElementById("hudArmaSecundario");
const hudEfeitosSecundario = document.getElementById("hudEfeitosSecundario");
const areaMensagem = document.getElementById("mensagem");
const painelEvento = document.getElementById("painelEvento");
const botaoInformacoesJogo = document.getElementById("btnInformacoesJogo");
const painelInformacoesJogo = document.getElementById("painelInformacoesJogo");

// Quantidade total de estrelas usadas no fundo animado.
const NUM_ESTRELAS = 450;
const CANVAS_LARGURA = 1600;
const CANVAS_ALTURA = 900;
// Tamanho visual da nave do jogador.
const TAMANHO_NAVE = 40;
// Velocidade angular usada quando a nave gira.
const ANGULO_ROTACAO = 0.1;
// Forca base de aceleracao da nave.
const VELOCIDADE_NAVE = 0.1;
// Friccao aplicada continuamente na nave.
const FRICCAO = 0.99;
// Velocidade base do projetil comum.
const VELOCIDADE_PROJETIL = 10;
// Tempo minimo entre tiros em frames para armas simples.
const CADENCIA_TIRO = 12;
// Intervalo do loop principal em milissegundos.
const FPS = 1000 / 60;
// Quantidade maxima de projeteis simultaneos.
const MAX_PROJETEIS = 18;
// Distancia minima entre nave e spawn de novo asteroide.
const DISTANCIA_SEGURA_SPAWN = 180;
// Tempo da mensagem de transicao de fase em segundos.
const TEMPO_TRANSICAO_FASE = 4;
// Pontos necessarios para ganhar uma vida extra.
const PONTOS_PARA_VIDA_EXTRA = 1000;
// Chance base de um asteroide derrotado soltar power-up.
const CHANCE_POWERUP = 0.17;
// Tempo padrao dos power-ups temporarios em segundos.
const DURACAO_POWERUP = 9;
const DURACAO_INFO_EVENTO = 5000;
const DURACAO_INFO_POWERUP = 3500;
const DURACAO_ESCUDO_RENASCIMENTO = 2.5;
const DURACAO_ANIMACAO_DESTRUICAO = 0.65;
const MULTIPLICADOR_CAMERA_LENTA_FASE = 0.22;
const DURACAO_PARTICULA_ASTEROIDE = 0.75;
const DURACAO_MINI_EXPLOSAO_MISSIL = 0.35;
const DURACAO_EXPLOSAO_BOSS = 1.2;
const HP_MAX_NAVE = 10;
const MAX_MISSEIS_NAVE = 20;
const RECARGA_POWERUP_MISSIL = 6;
const ORDEM_DESBLOQUEIO_ARMAS = ['pulso', 'rajada', 'plasma', 'perfurante'];

// Configuracao das armas selecionaveis.
const ARMAS = {
    pulso: {
        nome: "Pulso",
        tecla: "Digit1",
        velocidade: VELOCIDADE_PROJETIL,
        raio: 3.5,
        tempoVida: 1,
        cadenciaFrames: 12,
        tiros: 1,
        spread: 0,
        dano: 1,
        perfurante: false,
        guiado: false,
        limiteSimultaneo: Infinity,
        cores: ["rgb(67, 3, 187)", "rgba(3, 164, 228, 0.9)", "rgba(118, 0, 141, 0.8)"]
    },
    rajada: {
        nome: "Rajada",
        tecla: "Digit2",
        velocidade: 9,
        raio: 3,
        tempoVida: 0.8,
        cadenciaFrames: 18,
        tiros: 3,
        spread: 0.14,
        dano: 1,
        perfurante: false,
        guiado: false,
        limiteSimultaneo: Infinity,
        cores: ["rgb(28, 229, 255)", "rgba(22, 168, 255, 0.95)", "rgba(117, 230, 255, 0.75)"]
    },
    plasma: {
        nome: "Plasma",
        tecla: "Digit3",
        velocidade: 7,
        raio: 5.5,
        tempoVida: 1.3,
        cadenciaFrames: 22,
        tiros: 1,
        spread: 0,
        dano: 2,
        perfurante: false,
        guiado: false,
        limiteSimultaneo: Infinity,
        cores: ["rgb(255, 110, 219)", "rgba(255, 51, 180, 0.95)", "rgba(255, 173, 234, 0.75)"]
    },
    perfurante: {
        nome: "Perfurante",
        tecla: "Digit4",
        velocidade: 15,
        raio: 2.8,
        tempoVida: 1.4,
        cadenciaFrames: 26,
        tiros: 1,
        spread: 0,
        dano: 2,
        perfurante: true,
        guiado: false,
        limiteSimultaneo: Infinity,
        cores: ["rgb(255, 242, 151)", "rgba(255, 187, 0, 0.95)", "rgba(255, 247, 211, 0.65)"]
    },
    missil: {
        nome: "Missil",
        tecla: "KeyR",
        velocidade: 5,
        raio: 6,
        tempoVida: 4.6,
        cadenciaFrames: 40,
        tiros: 1,
        spread: 0,
        dano: 3,
        perfurante: false,
        guiado: true,
        limiteSimultaneo: 2,
        cores: ["rgb(255, 150, 133)", "rgba(255, 88, 72, 0.96)", "rgba(255, 204, 164, 0.72)"]
    },
    laser: {
        nome: "Laser",
        tecla: "Digit5",
        velocidade: 20,
        raio: 4.5,
        tempoVida: 1.2,
        cadenciaFrames: 52,
        tiros: 1,
        spread: 0,
        dano: 5,
        perfurante: true,
        guiado: false,
        limiteSimultaneo: Infinity,
        cores: ["rgb(180, 255, 255)", "rgba(64, 255, 250, 0.98)", "rgba(160, 255, 245, 0.35)"]
    }
};

// Configuracao visual, logica e raridade dos power-ups coletaveis.
// Quanto maior o peso, mais comum e o item no sorteio.
const TIPOS_POWERUP = {
    tiroVelocidade: { nome: "Tiro Rapido", cor: "#ffd166", pesoRaridade: 34, raridade: "Comum" },
    cadencia: { nome: "Cadencia", cor: "#b2ff59", pesoRaridade: 28, raridade: "Incomum" },
    velocidadeNave: { nome: "Turbo", cor: "#ff9f43", pesoRaridade: 20, raridade: "Raro" },
    reparo: { nome: "Reparo", cor: "#46d47d", pesoRaridade: 24, raridade: "Incomum" },
    escudo: { nome: "Escudo", cor: "#6be7ff", pesoRaridade: 12, raridade: "Epico" },
    vida: { nome: "Vida", cor: "#ff6b9a", pesoRaridade: 6, raridade: "Lendario" },
    recargaMissil: { nome: "Recarga Missil", cor: "#5ff0ff", pesoRaridade: 18, raridade: "Raro" }
};

const CLASSES_NAVES_INIMIGAS = [
    {
        nome: 'Interceptora',
        faixaMin: 10,
        faixaMax: 13,
        cor: 'rgba(255, 216, 128, 0.92)',
        corBorda: 'rgba(255, 241, 196, 0.98)',
        tamanho: 26,
        vidaBase: 3,
        velocidade: 2.2,
        cadencia: 1.45,
        tiros: 1,
        dano: 1,
        estiloProjetil: 'lanca',
        pontos: 120,
        perfil: 'interceptora'
    },
    {
        nome: 'Artilheira',
        faixaMin: 14,
        faixaMax: 17,
        cor: 'rgba(255, 143, 125, 0.92)',
        corBorda: 'rgba(255, 215, 208, 0.98)',
        tamanho: 32,
        vidaBase: 4,
        velocidade: 1.65,
        cadencia: 1.1,
        tiros: 2,
        dano: 1,
        estiloProjetil: 'plasma',
        pontos: 165,
        perfil: 'artilheira'
    },
    {
        nome: 'Fantasma',
        faixaMin: 18,
        faixaMax: 21,
        cor: 'rgba(127, 242, 219, 0.7)',
        corBorda: 'rgba(220, 255, 246, 0.94)',
        tamanho: 28,
        vidaBase: 5,
        velocidade: 2.05,
        cadencia: 0.95,
        tiros: 2,
        dano: 1,
        estiloProjetil: 'orbita',
        pontos: 210,
        perfil: 'fantasma'
    },
    {
        nome: 'Aniquiladora',
        faixaMin: 22,
        faixaMax: 999,
        cor: 'rgba(157, 174, 255, 0.92)',
        corBorda: 'rgba(238, 241, 255, 0.98)',
        tamanho: 36,
        vidaBase: 6,
        velocidade: 1.5,
        cadencia: 0.82,
        tiros: 3,
        dano: 2,
        estiloProjetil: 'pulso',
        pontos: 260,
        perfil: 'aniquiladora'
    }
];

// Estado geral da partida.
let pontuacao = 0;
let vidas = 3;
let hpNave = HP_MAX_NAVE;
let ticks = CADENCIA_TIRO;
let jogoAcabou = false;
let jogoPausado = false;
let timerID;
let timeoutMensagemTemporaria;
let timeoutPainelEvento;
let painelInformacoesAberto = false;
let estrelas = [];
let planetasFundo = [];
let galaxiasFundo = [];
let nebulosasFundo = [];
let deslocamentoParallaxNave = { x: 0, y: 0 };
let projetis = [];
let asteroides = [];
let powerUps = [];
let espaconave;
let tempoJogo = 0;
let faseAtual = 1;
let totalAsteroidesFase = 0;
let asteroidesDestruidosFase = 0;
let asteroidesGeradosFase = 0;
let proximoSpawnAsteroide = 0;
let faseEmTransicao = false;
let tempoRestanteTransicaoFase = 0;
let armaSelecionada = "pulso";
let proximaVidaExtra = PONTOS_PARA_VIDA_EXTRA;
let efeitosAtivos = { escudo: 0, escudoReinicio: 0, tiroVelocidade: 0, cadencia: 0, velocidadeNave: 0 };
let hudSecundarioTemporizadores = { asteroides: 0, velocidade: 0, arma: 0, efeitos: 0 };
let animacaoDestruicaoNave = null;
let gameOverPendente = false;
let animacaoExplosaoBoss = null;
let animacoesExplosaoNavesInimigas = [];
let particulasAsteroide = [];
let miniExplosoesMissil = [];
let projeteisBoss = [];
let navesInimigas = [];
let totalNavesInimigasFase = 0;
let navesInimigasRestantesFase = 0;
let tempoFase = 0;
let spawnNaveInimigaApos = 6;
let bossAtual = null;
let bossSpawnadoNaFase = false;
let bossDerrotadoNaFase = false;
let municaoMissil = MAX_MISSEIS_NAVE;
let ticksMissilSecundario = ARMAS.missil.cadenciaFrames;

// Estado das teclas usadas no controle.
const comandos = { teclaA: false, teclaD: false, teclaW: false, teclaS: false, teclaSpace: false };

function configurarAreaJogo() {
    telaJogo.width = CANVAS_LARGURA;
    telaJogo.height = CANVAS_ALTURA;

    if (!jogoWrapper) return;

    const margemHorizontal = 32;
    const margemVertical = 40;
    const escala = Math.min(
        (window.innerWidth - margemHorizontal) / CANVAS_LARGURA,
        (window.innerHeight - margemVertical) / CANVAS_ALTURA,
        1
    );

    jogoWrapper.style.width = `${Math.max(320, Math.round(CANVAS_LARGURA * escala))}px`;
    jogoWrapper.style.height = `${Math.max(180, Math.round(CANVAS_ALTURA * escala))}px`;
}

configurarAreaJogo();

// Classe da nave do jogador.
class Nave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidade = { x: 0, y: 0 };
        this.angulo = -Math.PI / 2;
        this.raio = TAMANHO_NAVE / 2;
        this.estaAcelerando = false;
        this.compriChama = 0;
        this.asasMissil = [-this.raio * 1.02, this.raio * 1.02];
    }

    rotacionarEsq() { this.angulo -= ANGULO_ROTACAO; }
    rotacionarDir() { this.angulo += ANGULO_ROTACAO; }

    acelerarAtual() {
        const aceleracao = VELOCIDADE_NAVE * obterMultiplicadorVelocidadeNave();
        this.velocidade.x += aceleracao * Math.cos(this.angulo);
        this.velocidade.y += aceleracao * Math.sin(this.angulo);
        this.estaAcelerando = true;
        this.velocidade.x *= 0.99;
        this.velocidade.y *= 0.99;
    }

    desacelerarAtual() {
        const freio = VELOCIDADE_NAVE * obterMultiplicadorVelocidadeNave();
        this.velocidade.x -= freio * Math.cos(this.angulo);
        this.velocidade.y -= freio * Math.sin(this.angulo);
        this.velocidade.x *= 0.9;
        this.velocidade.y *= 0.9;
    }

    atirar() {
        const arma = ARMAS[armaSelecionada];
        if (!arma) return;
        if (projetis.length >= MAX_PROJETEIS) return;

        const cadenciaAtual = Math.max(4, Math.floor(arma.cadenciaFrames * obterMultiplicadorCadencia()));

        if (ticks < cadenciaAtual) return;

        const quantidade = Math.min(arma.tiros, MAX_PROJETEIS - projetis.length);
        for (let i = 0; i < quantidade; i++) {
            const deslocamento = quantidade === 1 ? 0 : i - (quantidade - 1) / 2;
            const anguloTiro = this.angulo + deslocamento * arma.spread;
            const velocidade = (arma.velocidade * obterMultiplicadorVelocidadeTiro()) + (Math.random() * 0.35 - 0.175);

            projetis.push(new Projetil(
                this.x + Math.cos(anguloTiro) * this.raio,
                this.y + Math.sin(anguloTiro) * this.raio,
                velocidade * Math.cos(anguloTiro),
                velocidade * Math.sin(anguloTiro),
                armaSelecionada
            ));
        }

        ticks = 0;
    }

    atirarMissilSecundario() {
        const arma = ARMAS.missil;
        if (municaoMissil <= 0) {
            mostrarMensagemTemporaria('Sem misseis!<br><small>Pegue um power-up de recarga</small>', 1800);
            return;
        }
        if (ticksMissilSecundario < arma.cadenciaFrames) return;
        const misseisAtivos = projetis.filter((projetil) => projetil.tipoArma === 'missil').length;
        if (misseisAtivos >= arma.limiteSimultaneo) return;

        const indiceLado = municaoMissil % 2 === 0 ? 0 : 1;
        const deslocamentoLateral = this.asasMissil[indiceLado];
        const frenteX = Math.cos(this.angulo);
        const frenteY = Math.sin(this.angulo);
        const lateralX = Math.cos(this.angulo + Math.PI / 2);
        const lateralY = Math.sin(this.angulo + Math.PI / 2);
        const origemX = this.x + frenteX * (this.raio * 0.28) + lateralX * deslocamentoLateral;
        const origemY = this.y + frenteY * (this.raio * 0.28) + lateralY * deslocamentoLateral;

        projetis.push(new Projetil(origemX, origemY, arma.velocidade * frenteX, arma.velocidade * frenteY, 'missil'));
        municaoMissil = Math.max(0, municaoMissil - 1);
        ticksMissilSecundario = 0;
        atualizarInfoJogo();
    }

    reiniciarPosicao() {
        this.x = telaJogo.width / 2;
        this.y = telaJogo.height / 2;
        this.velocidade.x = 0;
        this.velocidade.y = 0;
        this.angulo = -Math.PI / 2;
        this.estaAcelerando = false;
        this.compriChama = 0;
    }
    
    atualizar() {
        this.velocidade.x *= FRICCAO;
        this.velocidade.y *= FRICCAO;
        this.x += this.velocidade.x;
        this.y += this.velocidade.y;
        deslocamentoParallaxNave.x += this.velocidade.x;
        deslocamentoParallaxNave.y += this.velocidade.y;

        if (this.estaAcelerando) {
            this.compriChama = Math.min(this.compriChama + 3, TAMANHO_NAVE * 2);
        } else {
            this.compriChama = Math.max(this.compriChama - 1, 0);
        }

        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
        this.estaAcelerando = false;
    }

    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);

        if (this.compriChama > 0) {
            const traseiraNave = -this.raio;
            const variacao = 0.9 + Math.random() * 0.3;
            const tamanhoChama = this.compriChama * variacao;

            const gradInterno = ctxTela.createRadialGradient(traseiraNave, 0, tamanhoChama * 0.05, traseiraNave, 0, tamanhoChama * 0.4);
            gradInterno.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
            gradInterno.addColorStop(1, 'rgba(255, 0, 0, 0.3)');
            const gradExterno = ctxTela.createRadialGradient(traseiraNave, 0, tamanhoChama * 0.1, traseiraNave, 0, tamanhoChama * 0.4);
            gradExterno.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradExterno.addColorStop(1, 'rgba(255, 208, 0, 0.79)');
            [[TAMANHO_NAVE / 5.2, 0.62, gradInterno], [TAMANHO_NAVE / 7.4, 0.38, gradExterno]].forEach(([altura, multiplicador, estilo]) => {
                ctxTela.beginPath();
                ctxTela.moveTo(traseiraNave, altura);
                ctxTela.lineTo(traseiraNave - tamanhoChama * multiplicador, 0);
                ctxTela.lineTo(traseiraNave, -altura);
                ctxTela.closePath();
                ctxTela.fillStyle = estilo;
                ctxTela.fill();
            });
        }

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.3, -this.raio * 0.46);
        ctxTela.lineTo(-this.raio * 0.14, -this.raio * 0.72);
        ctxTela.lineTo(-this.raio * 0.86, -this.raio * 0.24);
        ctxTela.lineTo(-this.raio * 0.18, -this.raio * 0.02);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(38, 0, 0, 0.95)';
        ctxTela.strokeStyle = '#ff1e00';
        ctxTela.lineWidth = 1.3;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.3, this.raio * 0.46);
        ctxTela.lineTo(-this.raio * 0.14, this.raio * 0.72);
        ctxTela.lineTo(-this.raio * 0.86, this.raio * 0.24);
        ctxTela.lineTo(-this.raio * 0.18, this.raio * 0.02);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(38, 0, 0, 0.95)';
        ctxTela.strokeStyle = '#ff1e00';
        ctxTela.lineWidth = 1.3;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 1.12, 0);
        ctxTela.lineTo(this.raio * 0.12, -this.raio * 0.34);
        ctxTela.lineTo(this.raio * 0.12, this.raio * 0.34);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(38, 0, 0, 0.95)';
        ctxTela.strokeStyle = '#ff1e00';
        ctxTela.lineWidth = 1.5;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.16, -this.raio * 0.18);
        ctxTela.lineTo(-this.raio * 0.04, -this.raio * 0.28);
        ctxTela.lineTo(-this.raio * 0.7, -this.raio * 0.82);
        ctxTela.lineTo(-this.raio * 0.34, -this.raio * 0.08);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(38, 0, 0, 0.95)';
        ctxTela.strokeStyle = '#ff1e00';
        ctxTela.lineWidth = 1.18;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.16, this.raio * 0.18);
        ctxTela.lineTo(-this.raio * 0.04, this.raio * 0.28);
        ctxTela.lineTo(-this.raio * 0.7, this.raio * 0.82);
        ctxTela.lineTo(-this.raio * 0.34, this.raio * 0.08);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(38, 0, 0, 0.95)';
        ctxTela.strokeStyle = '#ff1e00';
        ctxTela.lineWidth = 1.18;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(-this.raio * 0.8, -this.raio * 0.46);
        ctxTela.lineTo(-this.raio * 0.18, -this.raio * 0.02);
        ctxTela.moveTo(-this.raio * 0.8, this.raio * 0.46);
        ctxTela.lineTo(-this.raio * 0.18, this.raio * 0.02);
        ctxTela.strokeStyle = 'rgba(255, 120, 80, 0.82)';
        ctxTela.lineWidth = 1.14;
        ctxTela.stroke();

        const pulsoMiolo = (Math.sin(tempoJogo * 6) + 1) / 2;
        const brilhoMiolo = 0.82 + pulsoMiolo * 0.4;

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.34, 0);
        ctxTela.lineTo(this.raio * 0.04, -this.raio * 0.14);
        ctxTela.lineTo(-this.raio * 0.22, 0);
        ctxTela.lineTo(this.raio * 0.04, this.raio * 0.14);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(110, 16, 16, ' + (0.84 + 0.22 * pulsoMiolo) + ')';
        ctxTela.strokeStyle = 'rgba(255, 106, 72, ' + (0.88 + 0.28 * pulsoMiolo) + ')';
        ctxTela.lineWidth = 1.02;
        ctxTela.stroke();
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.18, 0);
        ctxTela.lineTo(this.raio * 0.01, -this.raio * 0.08);
        ctxTela.lineTo(-this.raio * 0.1, 0);
        ctxTela.lineTo(this.raio * 0.01, this.raio * 0.08);
        ctxTela.closePath();
        ctxTela.fillStyle = 'rgba(255, 146, 104, ' + (0.8 + 0.3 * pulsoMiolo) + ')';
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.moveTo(-this.raio * 0.04, -this.raio * 0.12);
        ctxTela.lineTo(-this.raio * 0.28, -this.raio * 0.02);
        ctxTela.lineTo(-this.raio * 0.04, this.raio * 0.12);
        ctxTela.closePath();
        ctxTela.strokeStyle = 'rgba(255, 98, 68, ' + (0.66 + 0.3 * pulsoMiolo) + ')';
        ctxTela.lineWidth = 0.95;
        ctxTela.stroke();

        ctxTela.beginPath();
        ctxTela.moveTo(this.raio * 0.08, -this.raio * 0.2);
        ctxTela.lineTo(-this.raio * 0.02, -this.raio * 0.08);
        ctxTela.moveTo(this.raio * 0.08, this.raio * 0.2);
        ctxTela.lineTo(-this.raio * 0.02, this.raio * 0.08);
        ctxTela.strokeStyle = 'rgba(255, 164, 120, ' + (0.56 + 0.3 * pulsoMiolo) + ')';
        ctxTela.lineWidth = 0.85;
        ctxTela.stroke();

        ctxTela.beginPath();
        ctxTela.moveTo(-this.raio * 0.22, -this.raio * 0.22);
        ctxTela.lineTo(-this.raio * 0.44, -this.raio * 0.08);
        ctxTela.moveTo(-this.raio * 0.22, this.raio * 0.22);
        ctxTela.lineTo(-this.raio * 0.44, this.raio * 0.08);
        ctxTela.strokeStyle = 'rgba(255, 108, 74, ' + (0.5 + 0.28 * pulsoMiolo) + ')';
        ctxTela.lineWidth = 0.8;
        ctxTela.stroke();
        ctxTela.restore();
        const possuiEscudoPadrao = efeitosAtivos.escudo > 0;
        const possuiEscudoReinicio = efeitosAtivos.escudoReinicio > 0;
        if (possuiEscudoPadrao || possuiEscudoReinicio) {
            const pulso = 0.35 + (Math.sin(tempoJogo * 8) + 1) * 0.12;
            const corEscudo = possuiEscudoReinicio ? '110, 255, 145' : '107, 231, 255';
            const baseRaio = this.raio + 8 + pulso * 4;

            ctxTela.beginPath();
            ctxTela.arc(this.x, this.y, baseRaio, 0, Math.PI * 2);
            ctxTela.strokeStyle = `rgba(${corEscudo}, ${0.55 + pulso * 0.35})`;
            ctxTela.lineWidth = possuiEscudoReinicio ? 4 : 3;
            ctxTela.stroke();

            if (possuiEscudoReinicio) {

                ctxTela.beginPath();
                ctxTela.ellipse(this.x, this.y, baseRaio + 5, baseRaio - 3, tempoJogo * 2.2, 0, Math.PI * 2);
                ctxTela.strokeStyle = `rgba(180, 255, 205, ${0.24 + pulso * 0.18})`;
                ctxTela.lineWidth = 2;
                ctxTela.stroke();

                ctxTela.beginPath();
                ctxTela.ellipse(this.x, this.y, baseRaio - 2, baseRaio + 4, -tempoJogo * 1.8, 0, Math.PI * 2);
                ctxTela.strokeStyle = `rgba(110, 255, 145, ${0.18 + pulso * 0.14})`;
                ctxTela.lineWidth = 1.5;
                ctxTela.stroke();
            }
        }
    }
}

// Classe base dos projeteis da nave.
class Projetil {
    // Cada projetil herda comportamento da arma que o criou.
    constructor(x, y, velX, velY, tipoArma) {
        this.tipoArma = tipoArma;
        this.config = ARMAS[tipoArma];
        this.x = x;
        this.y = y;
        this.vel = { x: velX, y: velY };
        this.raio = this.config.raio;
        this.tempoVida = this.config.tempoVida;
        this.perfurante = this.config.perfurante;
        this.guiado = this.config.guiado;
        this.dano = this.config.dano;
        this.alvo = null;
    }

    // O missil teleguiado procura o alvo inimigo mais proximo.
    adquirirAlvo() {
        if (!this.guiado) return;

        let menorDistancia = Infinity;
        let alvoMaisProximo = null;
        const alvosPrioritarios = [...navesInimigas];
        if (bossAtual) {
            alvosPrioritarios.push(bossAtual);
        }
        const alvosSecundarios = [...asteroides];
        const listaBusca = alvosPrioritarios.length > 0 ? alvosPrioritarios : alvosSecundarios;

        listaBusca.forEach((alvo) => {
            const distancia = Math.hypot(alvo.x - this.x, alvo.y - this.y);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                alvoMaisProximo = alvo;
            }
        });

        this.alvo = alvoMaisProximo;
    }

    // Atualiza deslocamento e corrige rota quando o tiro e guiado.
    atualizar(deltaTempo) {
        if (this.guiado) {
            if (!this.alvo || (!asteroides.includes(this.alvo) && !navesInimigas.includes(this.alvo) && this.alvo !== bossAtual)) {
                this.adquirirAlvo();
            }

            if (this.alvo) {
                const anguloAlvo = Math.atan2(this.alvo.y - this.y, this.alvo.x - this.x);
                const direcaoAtual = Math.atan2(this.vel.y, this.vel.x);
                const velocidadeAtual = Math.hypot(this.vel.x, this.vel.y) || this.config.velocidade;
                const diferenca = normalizarAngulo(anguloAlvo - direcaoAtual);
                const novoAngulo = direcaoAtual + Math.max(-0.12, Math.min(0.12, diferenca));

                this.vel.x = Math.cos(novoAngulo) * velocidadeAtual;
                this.vel.y = Math.sin(novoAngulo) * velocidadeAtual;
            }
        }

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
        this.tempoVida -= deltaTempo;
    }

    // Desenha o projetil com a identidade visual da arma atual.
    renderizar() {
        ctxTela.save();

        if (this.tipoArma === 'laser') {
            const angulo = Math.atan2(this.vel.y, this.vel.x);
            ctxTela.translate(this.x, this.y);
            ctxTela.rotate(angulo);

            ctxTela.beginPath();
            ctxTela.moveTo(-18, 0);
            ctxTela.lineTo(18, 0);
            ctxTela.strokeStyle = 'rgba(80, 255, 245, 0.35)';
            ctxTela.lineWidth = 10;
            ctxTela.stroke();

            ctxTela.beginPath();
            ctxTela.moveTo(-18, 0);
            ctxTela.lineTo(20, 0);
            ctxTela.strokeStyle = 'rgba(190, 255, 255, 0.95)';
            ctxTela.lineWidth = 4;
            ctxTela.stroke();

            ctxTela.restore();
            return;
        }

        const gradiente = ctxTela.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.raio);
        gradiente.addColorStop(0, this.config.cores[0]);
        gradiente.addColorStop(0.5, this.config.cores[1]);
        gradiente.addColorStop(1, this.config.cores[2]);

        ctxTela.fillStyle = gradiente;
        ctxTela.beginPath();
        ctxTela.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctxTela.fill();

        if (this.guiado) {
            ctxTela.beginPath();
            ctxTela.moveTo(this.x, this.y);
            ctxTela.lineTo(this.x - this.vel.x * 1.6, this.y - this.vel.y * 1.6);
            ctxTela.strokeStyle = 'rgba(255, 196, 135, 0.7)';
            ctxTela.lineWidth = 2;
            ctxTela.stroke();
        }

        ctxTela.restore();
    }
}

class ProjetilBoss {
    constructor(x, y, velX, velY, raio, dano, estilo = 'pulso', opcoes = {}) {
        this.x = x;
        this.y = y;
        this.vel = { x: velX, y: velY };
        this.raio = raio;
        this.dano = dano;
        this.estilo = estilo;
        this.guiado = opcoes.guiado ?? false;
        this.velocidadeBase = Math.hypot(velX, velY) || 1;
        this.tempoVida = opcoes.tempoVida ?? (estilo === 'lanca' ? 5.2 : estilo === 'missil' ? 2.2 : 4.4);
    }

    atualizar(deltaTempo) {
        if (this.guiado && espaconave && !animacaoDestruicaoNave) {
            const anguloAtual = Math.atan2(this.vel.y, this.vel.x);
            const anguloAlvo = Math.atan2(espaconave.y - this.y, espaconave.x - this.x);
            const diferenca = normalizarAngulo(anguloAlvo - anguloAtual);
            const novoAngulo = anguloAtual + Math.max(-0.08, Math.min(0.08, diferenca));
            this.vel.x = Math.cos(novoAngulo) * this.velocidadeBase;
            this.vel.y = Math.sin(novoAngulo) * this.velocidadeBase;
        }

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.tempoVida -= deltaTempo;
    }

    renderizar() {
        ctxTela.save();
        const angulo = Math.atan2(this.vel.y, this.vel.x);
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(angulo + Math.PI / 2);

        if (this.estilo === 'plasma') {
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio * 1.1, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(255, 120, 220, 0.88)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio * 0.55, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(255, 225, 255, 0.9)';
            ctxTela.fill();
        } else if (this.estilo === 'lanca') {
            ctxTela.beginPath();
            ctxTela.moveTo(0, -this.raio * 1.65);
            ctxTela.lineTo(this.raio * 0.72, this.raio * 1.05);
            ctxTela.lineTo(-this.raio * 0.72, this.raio * 1.05);
            ctxTela.closePath();
            ctxTela.fillStyle = 'rgba(255, 190, 82, 0.95)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.moveTo(0, -this.raio * 0.9);
            ctxTela.lineTo(this.raio * 0.35, this.raio * 0.65);
            ctxTela.lineTo(-this.raio * 0.35, this.raio * 0.65);
            ctxTela.closePath();
            ctxTela.fillStyle = 'rgba(255, 244, 205, 0.92)';
            ctxTela.fill();
        } else if (this.estilo === 'orbita') {
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(110, 245, 205, 0.9)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio * 0.5, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(225, 255, 245, 0.92)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.ellipse(0, 0, this.raio * 1.55, this.raio * 0.62, 0.25, 0, Math.PI * 2);
            ctxTela.strokeStyle = 'rgba(170, 255, 232, 0.72)';
            ctxTela.lineWidth = 1.5;
            ctxTela.stroke();
        } else if (this.estilo === 'missil') {
            ctxTela.beginPath();
            ctxTela.moveTo(0, -this.raio * 1.45);
            ctxTela.lineTo(this.raio * 0.82, this.raio * 0.85);
            ctxTela.lineTo(0, this.raio * 0.42);
            ctxTela.lineTo(-this.raio * 0.82, this.raio * 0.85);
            ctxTela.closePath();
            ctxTela.fillStyle = 'rgba(255, 148, 110, 0.96)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.arc(0, -this.raio * 0.12, this.raio * 0.34, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(255, 231, 184, 0.92)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.moveTo(-this.raio * 0.24, this.raio * 0.68);
            ctxTela.lineTo(0, this.raio * 1.52);
            ctxTela.lineTo(this.raio * 0.24, this.raio * 0.68);
            ctxTela.closePath();
            ctxTela.fillStyle = this.guiado ? 'rgba(130, 255, 210, 0.82)' : 'rgba(255, 201, 122, 0.82)';
            ctxTela.fill();
        } else {
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(255, 120, 110, 0.95)';
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio * 0.55, 0, Math.PI * 2);
            ctxTela.fillStyle = 'rgba(255, 235, 180, 0.9)';
            ctxTela.fill();
        }
        ctxTela.restore();
    }
}
class BossInimigo {
    constructor(fase) {
        this.fase = fase;
        this.classe = this.obterClasseBoss();
        this.raio = (34 + Math.min(18, fase * 2.6)) * this.classe.raioEscala;
        this.vidaMax = Math.round((14 + fase * 7) * this.classe.vidaEscala);
        this.vida = this.vidaMax;
        this.velocidade = (1 + fase * 0.04) * this.classe.velocidadeEscala;
        this.intervaloTiro = Math.max(0.45, (1.6 - fase * 0.07) * this.classe.intervaloEscala);
        this.tempoTiro = 1.1;
        this.padraoDisparo = 0;
        this.faseMovimento = Math.random() * Math.PI * 2;
        this.rotacaoCanhao = 0;
        this.inclinacaoCasco = 0;
        this.velEntrada = { x: 0, y: 0 };
        this.blendMovimento = 0;
        this.tempoEntrada = 1.4 * this.classe.entradaEscala;
        this.tempoEntradaMax = this.tempoEntrada;
        this.tema = this.criarTema();
        this.estiloProjetil = this.obterEstiloProjetil();
        this.perfilCasco = this.criarPerfilCasco();
        this.baseX = telaJogo.width * (0.25 + Math.random() * 0.5);
        this.baseY = telaJogo.height * (0.2 + Math.random() * 0.35);
        this.pontoAlvo = this.sortearPontoEntrada();
        this.x = this.pontoAlvo.xInicial;
        this.y = this.pontoAlvo.yInicial;
        this.vertices = this.criarVertices();
        this.aletas = this.criarAletas();
    }

    obterClasseBoss() {
        const classes = [
            {
                id: 'interceptor',
                nome: 'Interceptor',
                projetil: 'pulso',
                raioEscala: 0.94,
                vidaEscala: 0.92,
                velocidadeEscala: 1.24,
                intervaloEscala: 0.86,
                entradaEscala: 0.94,
                propulsores: [-0.2, 0.2]
            },
            {
                id: 'artilheiro',
                nome: 'Artilheiro',
                projetil: 'plasma',
                raioEscala: 1.04,
                vidaEscala: 1.08,
                velocidadeEscala: 0.94,
                intervaloEscala: 1.02,
                entradaEscala: 1,
                propulsores: [-0.3, 0.3]
            },
            {
                id: 'couracado',
                nome: 'Couracado',
                projetil: 'lanca',
                raioEscala: 1.18,
                vidaEscala: 1.34,
                velocidadeEscala: 0.82,
                intervaloEscala: 1.14,
                entradaEscala: 1.12,
                propulsores: [-0.38, -0.13, 0.13, 0.38]
            },
            {
                id: 'espectro',
                nome: 'Espectro',
                projetil: 'orbita',
                raioEscala: 1.01,
                vidaEscala: 1.02,
                velocidadeEscala: 1.1,
                intervaloEscala: 0.9,
                entradaEscala: 0.98,
                propulsores: [-0.24, 0.24]
            }
        ];
        const classeBase = classes[(this.fase - 1) % classes.length];
        const ciclo = Math.floor((this.fase - 1) / classes.length);
        return {
            ...classeBase,
            ciclo,
            intensidade: 1 + ciclo * 0.08
        };
    }

    criarTema() {
        const temas = {
            interceptor: { casco: 'rgba(52, 91, 146, 0.92)', borda: 'rgba(178, 220, 255, 0.98)', nucleo: 'rgba(105, 240, 255, 0.92)', canhao: 'rgba(210, 245, 255, 0.95)', chama: 'rgba(82, 224, 255, 0.8)' },
            artilheiro: { casco: 'rgba(94, 66, 142, 0.92)', borda: 'rgba(228, 196, 255, 0.98)', nucleo: 'rgba(255, 150, 238, 0.92)', canhao: 'rgba(243, 225, 255, 0.95)', chama: 'rgba(255, 135, 98, 0.8)' },
            couracado: { casco: 'rgba(105, 76, 46, 0.92)', borda: 'rgba(255, 214, 164, 0.98)', nucleo: 'rgba(255, 188, 106, 0.92)', canhao: 'rgba(255, 238, 214, 0.95)', chama: 'rgba(255, 167, 72, 0.84)' },
            espectro: { casco: 'rgba(56, 112, 92, 0.92)', borda: 'rgba(186, 255, 223, 0.98)', nucleo: 'rgba(126, 255, 202, 0.92)', canhao: 'rgba(225, 255, 240, 0.95)', chama: 'rgba(110, 255, 188, 0.82)' }
        };
        return temas[this.classe.id] || temas.interceptor;
    }

    obterEstiloProjetil() {
        return this.classe.projetil;
    }

    criarPerfilCasco() {
        const perfis = {
            interceptor: { ponta: 1.34, corpo: 0.62, traseira: 0.42, asa: 1.02, aberturaAsa: 0.24, alturaTraseira: 0.98, deslocamentoCorpo: -0.1 },
            artilheiro: { ponta: 1.18, corpo: 0.88, traseira: 0.58, asa: 0.82, aberturaAsa: 0.36, alturaTraseira: 0.92, deslocamentoCorpo: -0.24 },
            couracado: { ponta: 1.06, corpo: 1.02, traseira: 0.76, asa: 0.58, aberturaAsa: 0.48, alturaTraseira: 0.8, deslocamentoCorpo: -0.34 },
            espectro: { ponta: 1.24, corpo: 0.72, traseira: 0.52, asa: 0.9, aberturaAsa: 0.52, alturaTraseira: 0.88, deslocamentoCorpo: -0.18 }
        };
        return perfis[this.classe.id] || perfis.interceptor;
    }

    sortearPontoEntrada() {
        const margem = this.raio + 90;
        const lado = Math.floor(Math.random() * 4);
        if (lado == 0) return { xInicial: -margem, yInicial: Math.random() * telaJogo.height };
        if (lado == 1) return { xInicial: telaJogo.width + margem, yInicial: Math.random() * telaJogo.height };
        if (lado == 2) return { xInicial: Math.random() * telaJogo.width, yInicial: -margem };
        return { xInicial: Math.random() * telaJogo.width, yInicial: telaJogo.height + margem };
    }

    criarVertices() {
        const perfil = this.perfilCasco;
        const pontaFrontal = this.raio * (perfil.ponta + Math.random() * 0.1);
        const corpo = this.raio * (perfil.corpo + Math.random() * 0.08);
        const traseira = this.raio * (perfil.traseira + Math.random() * 0.08);
        const asa = this.raio * (perfil.asa + Math.random() * 0.1);
        return [
            { x: 0, y: -pontaFrontal },
            { x: corpo, y: this.raio * perfil.deslocamentoCorpo },
            { x: asa, y: this.raio * perfil.aberturaAsa },
            { x: traseira * 0.42, y: this.raio * perfil.alturaTraseira },
            { x: -traseira * 0.42, y: this.raio * perfil.alturaTraseira },
            { x: -asa, y: this.raio * perfil.aberturaAsa },
            { x: -corpo, y: this.raio * perfil.deslocamentoCorpo }
        ];
    }

    criarAletas() {
        const perfil = this.perfilCasco;
        const largura = this.raio * (0.48 + Math.random() * 0.2);
        const altura = this.raio * (0.24 + Math.random() * 0.14);
        const baseY = this.raio * (perfil.aberturaAsa * 0.7);
        return [
            [
                { x: this.raio * 0.22, y: baseY * 0.5 },
                { x: this.raio + largura * 0.12, y: baseY },
                { x: this.raio * 0.52, y: baseY + altura }
            ],
            [
                { x: -this.raio * 0.22, y: baseY * 0.5 },
                { x: -(this.raio + largura * 0.12), y: baseY },
                { x: -this.raio * 0.52, y: baseY + altura }
            ]
        ];
    }

    atualizar(deltaTempo) {
        if (this.tempoEntrada > 0) {
            const xAnterior = this.x;
            const yAnterior = this.y;
            this.tempoEntrada = Math.max(0, this.tempoEntrada - deltaTempo);
            const progressoBruto = 1 - (this.tempoEntrada / this.tempoEntradaMax);
            const progressoEntrada = 1 - Math.pow(1 - progressoBruto, 4);
            this.x = this.pontoAlvo.xInicial + (this.baseX - this.pontoAlvo.xInicial) * progressoEntrada;
            this.y = this.pontoAlvo.yInicial + (this.baseY - this.pontoAlvo.yInicial) * progressoEntrada;
            this.velEntrada.x = this.x - xAnterior;
            this.velEntrada.y = this.y - yAnterior;
            this.rotacaoCanhao = Math.atan2(espaconave.y - this.y, espaconave.x - this.x);

            const inclinacaoEntrada = Math.max(-0.24, Math.min(0.24, this.velEntrada.x * 0.08));
            this.inclinacaoCasco += (inclinacaoEntrada - this.inclinacaoCasco) * 0.22;

            if (this.tempoEntrada === 0) {
                this.blendMovimento = 1.35;
            }
            return;
        }

        const xAnterior = this.x;
        this.faseMovimento += deltaTempo * (0.8 + this.fase * 0.04);
        const amplitudeXBase = this.classe.id === 'interceptor' ? 122 : this.classe.id === 'couracado' ? 76 : this.classe.id === 'espectro' ? 108 : 92;
        const amplitudeYBase = this.classe.id === 'interceptor' ? 18 : this.classe.id === 'couracado' ? 34 : this.classe.id === 'espectro' ? 28 : 24;
        const alvoX = this.baseX + Math.sin(this.faseMovimento * this.velocidade * (this.classe.id === 'interceptor' ? 0.52 : 0.35)) * Math.min(telaJogo.width * 0.18, amplitudeXBase + this.fase * 10);
        const alvoY = this.baseY + Math.cos(this.faseMovimento * (this.classe.id === 'espectro' ? 1.65 : 1.3)) * (amplitudeYBase + Math.min(16, this.fase * 1.2));

        if (this.blendMovimento > 0) {
            const amortecimentoEntrada = Math.pow(0.955, deltaTempo * 60);
            const progressoBlend = 1 - Math.min(1, this.blendMovimento / 1.35);
            const influenciaAlvo = 0.028 + progressoBlend * 0.055;
            this.x += this.velEntrada.x;
            this.y += this.velEntrada.y;
            this.velEntrada.x *= amortecimentoEntrada;
            this.velEntrada.y *= amortecimentoEntrada;
            this.x += (alvoX - this.x) * influenciaAlvo;
            this.y += (alvoY - this.y) * influenciaAlvo;
            this.blendMovimento = Math.max(0, this.blendMovimento - deltaTempo);
        } else {
            this.x += (alvoX - this.x) * 0.085;
            this.y += (alvoY - this.y) * 0.085;
        }

        this.rotacaoCanhao = Math.atan2(espaconave.y - this.y, espaconave.x - this.x);
        this.tempoTiro -= deltaTempo;

        const movimentoX = this.x - xAnterior;
        const inclinacaoBase = Math.sin(this.faseMovimento * 0.9) * 0.045;
        const inclinacaoMovimento = Math.max(-0.22, Math.min(0.22, movimentoX * 0.075));
        const inclinacaoAlvo = Math.abs(movimentoX) > 0.02 ? inclinacaoMovimento : inclinacaoBase;
        this.inclinacaoCasco += (inclinacaoAlvo - this.inclinacaoCasco) * 0.16;

        if (this.tempoTiro <= 0) {
            this.atirar();
            this.tempoTiro = this.intervaloTiro;
        }
    }

    atirar() {
        if (!espaconave || animacaoDestruicaoNave || this.tempoEntrada > 0) return;

        const anguloBase = Math.atan2(espaconave.y - this.y, espaconave.x - this.x);
        let velocidade = 4.8 + this.fase * 0.22;
        let raioProjetil = 4 + Math.min(3, Math.floor(this.fase / 3));
        let dano = this.fase >= 5 ? 2 : 1;
        let quantidade = 1 + Math.min(4, Math.floor((this.fase - 1) / 2));
        let espalhamento = quantidade === 1 ? 0 : 0.22;

        if (this.classe.id === 'interceptor') {
            velocidade += 1.4;
            quantidade = Math.max(2, Math.min(5, quantidade));
            espalhamento = 0.12;
        } else if (this.classe.id === 'artilheiro') {
            quantidade = Math.max(2, quantidade);
            espalhamento = 0.28;
            raioProjetil += 1;
        } else if (this.classe.id === 'couracado') {
            velocidade -= 0.35;
            dano += 1;
            raioProjetil += 2;
            quantidade = Math.max(1, Math.ceil(quantidade * 0.6));
            espalhamento = quantidade === 1 ? 0 : 0.16;
        } else if (this.classe.id === 'espectro') {
            velocidade += 0.6;
            quantidade += 1;
            espalhamento = 0.34;
        }

        if (this.fase >= 4 && this.padraoDisparo % 2 === 1) {
            quantidade = Math.max(3, quantidade + (this.classe.id === 'couracado' ? 0 : 1));
            espalhamento += 0.08;
        }

        if (this.fase >= 7 && this.padraoDisparo % 3 === 2) {
            quantidade += this.classe.id === 'couracado' ? 1 : 2;
            espalhamento = Math.max(0.18, espalhamento - 0.04);
        }

        for (let i = 0; i < quantidade; i++) {
            const deslocamento = quantidade === 1 ? 0 : i - (quantidade - 1) / 2;
            const angulo = anguloBase + deslocamento * espalhamento;
            projeteisBoss.push(new ProjetilBoss(
                this.x + Math.cos(angulo) * (this.raio + 8),
                this.y + Math.sin(angulo) * (this.raio + 8),
                Math.cos(angulo) * velocidade,
                Math.sin(angulo) * velocidade,
                raioProjetil,
                dano,
                this.estiloProjetil
            ));
        }

        if (this.fase >= 10) {
            const velocidadeMissil = 3.9 + Math.min(1.4, (this.fase - 10) * 0.08);
            projeteisBoss.push(new ProjetilBoss(
                this.x + Math.cos(anguloBase) * (this.raio + 10),
                this.y + Math.sin(anguloBase) * (this.raio + 10),
                Math.cos(anguloBase) * velocidadeMissil,
                Math.sin(anguloBase) * velocidadeMissil,
                Math.max(6, raioProjetil - 1),
                Math.max(2, dano),
                'missil',
                {
                    tempoVida: 1.6 + Math.min(1, (this.fase - 10) * 0.06),
                    guiado: this.fase >= 15
                }
            ));
        }

        this.padraoDisparo++;
    }

    renderizarPropulsor() {
        const intensidade = this.tempoEntrada > 0 ? 1.2 : 0.7 + (Math.sin(tempoJogo * 16 + this.fase) + 1) * 0.25;
        const alturaChama = this.raio * (0.6 + intensidade * 0.42);
        const larguraChama = this.raio * 0.2;
        const traseiraY = this.raio * (this.perfilCasco.alturaTraseira + 0.06);
        const propulsores = this.classe.propulsores.map((valor) => this.raio * valor);

        propulsores.forEach((offsetX) => {
            ctxTela.beginPath();
            ctxTela.moveTo(offsetX - larguraChama, traseiraY);
            ctxTela.lineTo(offsetX, traseiraY + alturaChama);
            ctxTela.lineTo(offsetX + larguraChama, traseiraY);
            ctxTela.closePath();
            ctxTela.fillStyle = this.tema.chama;
            ctxTela.fill();

            ctxTela.beginPath();
            ctxTela.moveTo(offsetX - larguraChama * 0.52, traseiraY + this.raio * 0.01);
            ctxTela.lineTo(offsetX, traseiraY + alturaChama * 0.62);
            ctxTela.lineTo(offsetX + larguraChama * 0.52, traseiraY + this.raio * 0.01);
            ctxTela.closePath();
            ctxTela.fillStyle = 'rgba(255, 245, 210, 0.82)';
            ctxTela.fill();
        });
    }

    renderizarDetalhesCasco() {
        const brilho = 0.24 + (Math.sin(tempoJogo * 3 + this.fase) + 1) * 0.08;

        if (this.classe.id === 'interceptor') {
            ctxTela.beginPath();
            ctxTela.moveTo(0, -this.raio * 0.78);
            ctxTela.lineTo(this.raio * 0.18, this.raio * 0.06);
            ctxTela.lineTo(0, this.raio * 0.22);
            ctxTela.lineTo(-this.raio * 0.18, this.raio * 0.06);
            ctxTela.closePath();
            ctxTela.fillStyle = `rgba(165, 228, 255, ${brilho + 0.18})`;
            ctxTela.fill();
        } else if (this.classe.id === 'artilheiro') {
            ctxTela.beginPath();
            ctxTela.ellipse(0, this.raio * 0.04, this.raio * 0.34, this.raio * 0.18, 0, 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(255, 175, 238, ${brilho + 0.26})`;
            ctxTela.fill();
            ctxTela.fillRect(-this.raio * 0.46, this.raio * 0.02, this.raio * 0.18, this.raio * 0.22);
            ctxTela.fillRect(this.raio * 0.28, this.raio * 0.02, this.raio * 0.18, this.raio * 0.22);
        } else if (this.classe.id === 'couracado') {
            ctxTela.beginPath();
            ctxTela.moveTo(-this.raio * 0.42, -this.raio * 0.08);
            ctxTela.lineTo(0, -this.raio * 0.34);
            ctxTela.lineTo(this.raio * 0.42, -this.raio * 0.08);
            ctxTela.lineTo(this.raio * 0.32, this.raio * 0.32);
            ctxTela.lineTo(-this.raio * 0.32, this.raio * 0.32);
            ctxTela.closePath();
            ctxTela.fillStyle = `rgba(255, 219, 156, ${brilho + 0.22})`;
            ctxTela.fill();
            ctxTela.beginPath();
            ctxTela.moveTo(-this.raio * 0.2, -this.raio * 0.62);
            ctxTela.lineTo(this.raio * 0.2, -this.raio * 0.62);
            ctxTela.lineTo(0, -this.raio * 0.16);
            ctxTela.closePath();
            ctxTela.fillStyle = `rgba(255, 239, 206, ${brilho + 0.16})`;
            ctxTela.fill();
        } else {
            ctxTela.beginPath();
            ctxTela.ellipse(0, this.raio * 0.05, this.raio * 0.42, this.raio * 0.14, 0.12, 0, Math.PI * 2);
            ctxTela.strokeStyle = `rgba(188, 255, 236, ${brilho + 0.24})`;
            ctxTela.lineWidth = 1.8;
            ctxTela.stroke();
            ctxTela.beginPath();
            ctxTela.arc(0, this.raio * 0.02, this.raio * 0.12, 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(164, 255, 220, ${brilho + 0.22})`;
            ctxTela.fill();
        }
    }

    renderizar() {
        const progressoEntrada = this.tempoEntrada > 0 ? 1 - (this.tempoEntrada / this.tempoEntradaMax) : 1;
        const escala = 0.78 + progressoEntrada * 0.22;
        const brilhoEntrada = this.tempoEntrada > 0 ? 0.22 + progressoEntrada * 0.28 : 0;

        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.inclinacaoCasco);
        ctxTela.scale(escala, escala);

        if (brilhoEntrada > 0) {
            ctxTela.beginPath();
            ctxTela.arc(0, 0, this.raio * (1.5 + brilhoEntrada), 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(180, 240, 255, ${brilhoEntrada * 0.35})`;
            ctxTela.fill();
        }

        this.renderizarPropulsor();

        ctxTela.beginPath();
        ctxTela.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctxTela.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctxTela.closePath();
        ctxTela.fillStyle = this.tema.casco;
        ctxTela.strokeStyle = this.tema.borda;
        ctxTela.lineWidth = 2.2;
        ctxTela.fill();
        ctxTela.stroke();
        this.renderizarDetalhesCasco();

        this.aletas.forEach((aleta) => {
            ctxTela.beginPath();
            ctxTela.moveTo(aleta[0].x, aleta[0].y);
            ctxTela.lineTo(aleta[1].x, aleta[1].y);
            ctxTela.lineTo(aleta[2].x, aleta[2].y);
            ctxTela.closePath();
            ctxTela.fillStyle = this.tema.casco;
            ctxTela.globalAlpha = 0.9;
            ctxTela.fill();
            ctxTela.globalAlpha = 1;
            ctxTela.stroke();
        });

        ctxTela.beginPath();
        ctxTela.arc(0, -this.raio * 0.08, this.raio * 0.28, 0, Math.PI * 2);
        ctxTela.fillStyle = this.tema.nucleo;
        ctxTela.fill();

        ctxTela.save();
        ctxTela.rotate(this.rotacaoCanhao - this.inclinacaoCasco + Math.PI / 2);
        ctxTela.fillStyle = this.tema.canhao;
        ctxTela.fillRect(-4.5, -this.raio * 0.95, 9, this.raio * 0.7);
        ctxTela.restore();

        const larguraBarra = this.raio * 1.8;
        const progressoVida = this.vida / this.vidaMax;
        ctxTela.fillStyle = 'rgba(12, 22, 38, 0.92)';
        ctxTela.fillRect(-larguraBarra / 2, -this.raio - 22, larguraBarra, 8);
        ctxTela.fillStyle = 'rgba(255, 99, 132, 0.95)';
        ctxTela.fillRect(-larguraBarra / 2, -this.raio - 22, larguraBarra * progressoVida, 8);
        ctxTela.restore();
    }

    colideComCirculo(x, y, raio) {
        return Math.hypot(this.x - x, this.y - y) <= this.raio + raio;
    }
}

class NaveInimiga {
    constructor(fase) {
        this.fase = fase;
        this.classe = obterClasseNaveInimiga(fase);
        const ponto = sortearPontoEntradaHostil();
        this.x = ponto.x;
        this.y = ponto.y;
        this.alvo = { x: Math.random() * telaJogo.width, y: telaJogo.height * (0.18 + Math.random() * 0.58) };
        this.raio = this.classe.tamanho;
        this.vidaMax = this.classe.vidaBase + Math.floor((fase - 10) / 3);
        this.vida = this.vidaMax;
        this.vel = { x: 0, y: 0 };
        this.angulo = 0;
        this.tempoTiro = 1.2 + Math.random() * 0.4;
        this.pontos = this.classe.pontos + (fase - 10) * 12;
    }
    atualizar(deltaTempo) {
        const dx = this.alvo.x - this.x;
        const dy = this.alvo.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        const acel = this.classe.velocidade * 0.03;
        this.vel.x += (dx / dist) * acel;
        this.vel.y += (dy / dist) * acel;
        this.vel.x *= this.classe.perfil === 'interceptora' ? 0.978 : 0.968;
        this.vel.y *= this.classe.perfil === 'interceptora' ? 0.978 : 0.968;
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.angulo = Math.atan2(this.vel.y || dy, this.vel.x || dx) + Math.PI / 2;
        if (dist < 28) {
            this.alvo = { x: Math.random() * telaJogo.width, y: telaJogo.height * (0.18 + Math.random() * 0.58) };
        }
        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
        this.tempoTiro -= deltaTempo;
        if (this.tempoTiro <= 0) {
            this.atirar();
            this.tempoTiro = Math.max(0.42, this.classe.cadencia - (this.fase - 10) * 0.015);
        }
    }
    atirar() {
        if (!espaconave || animacaoDestruicaoNave) return;
        const base = Math.atan2(espaconave.y - this.y, espaconave.x - this.x);
        const quantidade = this.classe.tiros;
        const spread = this.classe.perfil === 'interceptora' ? 0.12 : this.classe.perfil === 'fantasma' ? 0.22 : 0.18;
        const velocidade = 4.1 + (this.fase - 10) * 0.05 + (this.classe.perfil === 'interceptora' ? 0.8 : 0);
        for (let i = 0; i < quantidade; i++) {
            const deslocamento = quantidade === 1 ? 0 : i - (quantidade - 1) / 2;
            const angulo = base + deslocamento * spread;
            projeteisBoss.push(new ProjetilBoss(
                this.x + Math.cos(angulo) * (this.raio + 6),
                this.y + Math.sin(angulo) * (this.raio + 6),
                Math.cos(angulo) * velocidade,
                Math.sin(angulo) * velocidade,
                this.classe.perfil === 'aniquiladora' ? 6 : 4.5,
                this.classe.dano,
                this.classe.estiloProjetil,
                { tempoVida: this.classe.perfil === 'interceptora' ? 3.4 : 4.2 }
            ));
        }
    }
    receberDano(dano) {
        this.vida = Math.max(0, this.vida - dano);
    }
    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);
        const comprimentoChama = this.raio * (this.classe.perfil === 'interceptora' ? 0.85 : this.classe.perfil === 'aniquiladora' ? 0.68 : 0.74) * (0.85 + Math.random() * 0.35);
        const larguraChama = this.raio * (this.classe.perfil === 'artilheira' ? 0.24 : 0.18);
        ctxTela.beginPath();
        ctxTela.moveTo(-larguraChama, this.raio * 0.86);
        ctxTela.lineTo(0, this.raio * 0.86 + comprimentoChama);
        ctxTela.lineTo(larguraChama, this.raio * 0.86);
        ctxTela.closePath();
        ctxTela.fillStyle = this.classe.perfil === 'fantasma' ? 'rgba(140, 255, 225, 0.72)' : 'rgba(255, 177, 96, 0.82)';
        ctxTela.fill();
        ctxTela.beginPath();
        if (this.classe.perfil === 'interceptora') {
            ctxTela.moveTo(0, -this.raio * 1.12);
            ctxTela.lineTo(this.raio * 0.62, -this.raio * 0.1);
            ctxTela.lineTo(this.raio * 0.24, this.raio * 0.34);
            ctxTela.lineTo(this.raio * 0.86, this.raio * 0.78);
            ctxTela.lineTo(0, this.raio * 0.28);
            ctxTela.lineTo(-this.raio * 0.86, this.raio * 0.78);
            ctxTela.lineTo(-this.raio * 0.24, this.raio * 0.34);
            ctxTela.lineTo(-this.raio * 0.62, -this.raio * 0.1);
        } else if (this.classe.perfil === 'artilheira') {
            ctxTela.moveTo(0, -this.raio * 1.02);
            ctxTela.lineTo(this.raio * 0.74, -this.raio * 0.2);
            ctxTela.lineTo(this.raio * 0.94, this.raio * 0.36);
            ctxTela.lineTo(this.raio * 0.44, this.raio * 0.84);
            ctxTela.lineTo(-this.raio * 0.44, this.raio * 0.84);
            ctxTela.lineTo(-this.raio * 0.94, this.raio * 0.36);
            ctxTela.lineTo(-this.raio * 0.74, -this.raio * 0.2);
        } else if (this.classe.perfil === 'fantasma') {
            ctxTela.moveTo(0, -this.raio * 1.14);
            ctxTela.lineTo(this.raio * 0.52, -this.raio * 0.24);
            ctxTela.lineTo(this.raio * 0.98, this.raio * 0.08);
            ctxTela.lineTo(this.raio * 0.42, this.raio * 0.88);
            ctxTela.lineTo(0, this.raio * 0.48);
            ctxTela.lineTo(-this.raio * 0.42, this.raio * 0.88);
            ctxTela.lineTo(-this.raio * 0.98, this.raio * 0.08);
            ctxTela.lineTo(-this.raio * 0.52, -this.raio * 0.24);
        } else {
            ctxTela.moveTo(0, -this.raio * 0.98);
            ctxTela.lineTo(this.raio * 0.86, -this.raio * 0.22);
            ctxTela.lineTo(this.raio * 0.78, this.raio * 0.72);
            ctxTela.lineTo(this.raio * 0.22, this.raio * 0.96);
            ctxTela.lineTo(-this.raio * 0.22, this.raio * 0.96);
            ctxTela.lineTo(-this.raio * 0.78, this.raio * 0.72);
            ctxTela.lineTo(-this.raio * 0.86, -this.raio * 0.22);
        }
        ctxTela.closePath();
        ctxTela.fillStyle = this.classe.cor;
        ctxTela.globalAlpha = this.classe.perfil === 'fantasma' ? 0.48 : 0.88;
        ctxTela.fill();
        ctxTela.globalAlpha = 1;
        ctxTela.strokeStyle = this.classe.corBorda;
        ctxTela.lineWidth = 2;
        ctxTela.stroke();
        ctxTela.beginPath();
        if (this.classe.perfil === 'aniquiladora') {
            ctxTela.rect(-this.raio * 0.28, -this.raio * 0.1, this.raio * 0.56, this.raio * 0.34);
        } else {
            ctxTela.arc(0, 0, this.raio * (this.classe.perfil === 'fantasma' ? 0.14 : 0.18), 0, Math.PI * 2);
        }
        ctxTela.fillStyle = this.classe.corBorda;
        ctxTela.fill();
        ctxTela.restore();
        const larguraBarra = this.raio * 1.7;
        const progressoVida = this.vida / this.vidaMax;
        ctxTela.fillStyle = 'rgba(12, 22, 38, 0.92)';
        ctxTela.fillRect(this.x - larguraBarra / 2, this.y - this.raio - 14, larguraBarra, 5);
        ctxTela.fillStyle = this.classe.corBorda;
        ctxTela.fillRect(this.x - larguraBarra / 2, this.y - this.raio - 14, larguraBarra * progressoVida, 5);
    }
    colideComCirculo(x, y, raio) {
        return Math.hypot(this.x - x, this.y - y) <= this.raio + raio;
    }
}
class PowerUp {
    // Cada item tem um tipo, uma cor e um tempo limite de existencia.
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.config = TIPOS_POWERUP[tipo];
        this.raio = 12;
        this.tempoVida = 10;
        this.angulo = Math.random() * Math.PI * 2;
        this.vel = { x: (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 1.2 };
    }

    // Atualiza o movimento lento do item e seu tempo de vida.
    atualizar(deltaTempo) {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.angulo += 0.03;
        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
        this.tempoVida -= deltaTempo;
    }

    // Renderiza o item como um losango brilhante.
    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);

        const brilho = 0.5 + (Math.sin(tempoJogo * 7 + this.angulo) + 1) * 0.25;
        ctxTela.beginPath();
        ctxTela.moveTo(0, -this.raio);
        ctxTela.lineTo(this.raio, 0);
        ctxTela.lineTo(0, this.raio);
        ctxTela.lineTo(-this.raio, 0);
        ctxTela.closePath();
        ctxTela.fillStyle = this.config.cor;
        ctxTela.globalAlpha = Math.min(1, brilho);
        ctxTela.fill();
        ctxTela.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctxTela.lineWidth = 2;
        ctxTela.stroke();
        ctxTela.restore();
    }
}

class Asteroide {
    // Cada subtipo altera cor, vida, velocidade, rotacao e pontuacao.
    constructor(x, y, tamanho, velX, velY, subtipo = "padrao") {
        this.x = x;
        this.y = y;
        this.tamanho = tamanho;
        this.subtipo = subtipo;
        this.configuracao = obterConfiguracaoSubtipo(subtipo);
        this.velocRotacao = (Math.random() + 0.4) * 0.015 * this.configuracao.rotacao;
        this.angulo = Math.random() * Math.PI * 2;
        this.raioBase = tamanho / 2;
        this.raioColisao = this.raioBase;
        this.vida = this.configuracao.vida;
        this.vel = { x: velX * this.configuracao.velocidade, y: velY * this.configuracao.velocidade };
        this.vertices = this.criarVertices();
    }

    // Gera o formato irregular do asteroide.
    criarVertices() {
        const totalVertices = this.configuracao.vertices + Math.round(Math.random() * 3);
        const vertices = [];
        let maiorRaio = 0;

        for (let i = 0; i < totalVertices; i++) {
            const anguloVertice = (i / totalVertices) * Math.PI * 2;
            const raioVertice = this.raioBase * (
                this.configuracao.irregularidadeMin +
                Math.random() * (this.configuracao.irregularidadeMax - this.configuracao.irregularidadeMin)
            );
            maiorRaio = Math.max(maiorRaio, raioVertice);
            vertices.push({ x: Math.cos(anguloVertice) * raioVertice, y: Math.sin(anguloVertice) * raioVertice });
        }

        this.raioColisao = maiorRaio;
        return vertices;
    }

    // Atualiza movimento e rotacao do asteroide.
    atualizar(multiplicadorTempo = 1) {
        this.x += this.vel.x * multiplicadorTempo;
        this.y += this.vel.y * multiplicadorTempo;
        this.angulo += this.velocRotacao * multiplicadorTempo;
        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
    }

    // Renderiza o asteroide usando as cores do subtipo.
    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);
        ctxTela.beginPath();
        ctxTela.moveTo(this.vertices[0].x, this.vertices[0].y);

        for (let i = 1; i < this.vertices.length; i++) {
            ctxTela.lineTo(this.vertices[i].x, this.vertices[i].y);
        }

        ctxTela.closePath();
        ctxTela.fillStyle = this.configuracao.corFill;
        ctxTela.strokeStyle = this.configuracao.corStroke;
        ctxTela.lineWidth = 1.5;
        ctxTela.fill();
        ctxTela.stroke();
        ctxTela.restore();
    }

    // Testa colisao do poligono do asteroide com um circulo.
    colideComCirculo(x, y, raio) {
        const dx = x - this.x;
        const dy = y - this.y;
        if (Math.hypot(dx, dy) > this.raioColisao + raio) return false;

        const cos = Math.cos(-this.angulo);
        const sin = Math.sin(-this.angulo);
        const pontoLocal = { x: dx * cos - dy * sin, y: dx * sin + dy * cos };

        if (pontoDentroPoligono(pontoLocal, this.vertices)) return true;

        for (let i = 0; i < this.vertices.length; i++) {
            const atual = this.vertices[i];
            const proximo = this.vertices[(i + 1) % this.vertices.length];
            if (distanciaPontoSegmento(pontoLocal, atual, proximo) <= raio) {
                return true;
            }
        }

        return false;
    }
}

function criarParticulasDestruicaoAsteroide(asteroide) {
    const quantidade = Math.max(8, Math.round(asteroide.tamanho / 7));
    for (let i = 0; i < quantidade; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidade = 0.8 + Math.random() * (asteroide.tamanho / 24);
        const tempoMax = DURACAO_PARTICULA_ASTEROIDE + Math.random() * 0.25;
        particulasAsteroide.push({
            x: asteroide.x,
            y: asteroide.y,
            velX: Math.cos(angulo) * velocidade,
            velY: Math.sin(angulo) * velocidade,
            raio: Math.max(1.2, asteroide.tamanho / 26 + Math.random() * 1.4),
            tempoVida: tempoMax,
            tempoMax,
            cor: asteroide.configuracao.corStroke
        });
    }
}

function atualizarParticulasAsteroide(deltaTempo) {
    for (let i = particulasAsteroide.length - 1; i >= 0; i--) {
        const particula = particulasAsteroide[i];
        particula.x += particula.velX;
        particula.y += particula.velY;
        particula.velX *= 0.98;
        particula.velY *= 0.98;
        particula.tempoVida -= deltaTempo;

        if (particula.tempoVida <= 0) {
            particulasAsteroide.splice(i, 1);
        }
    }
}

function renderizarParticulasAsteroide() {
    particulasAsteroide.forEach((particula) => {
        const alpha = Math.max(0, particula.tempoVida / particula.tempoMax);
        ctxTela.beginPath();
        ctxTela.arc(particula.x, particula.y, particula.raio, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(220, 235, 255, ${alpha * 0.8})`;
        ctxTela.fill();
    });
}

function criarMiniExplosaoMissil(x, y, raioBase = 18) {
    miniExplosoesMissil.push({
        x,
        y,
        raioBase,
        tempoVida: DURACAO_MINI_EXPLOSAO_MISSIL,
        tempoMax: DURACAO_MINI_EXPLOSAO_MISSIL
    });
}

function atualizarMiniExplosoesMissil(deltaTempo) {
    for (let i = miniExplosoesMissil.length - 1; i >= 0; i--) {
        miniExplosoesMissil[i].tempoVida -= deltaTempo;
        if (miniExplosoesMissil[i].tempoVida <= 0) {
            miniExplosoesMissil.splice(i, 1);
        }
    }
}

function renderizarMiniExplosoesMissil() {
    miniExplosoesMissil.forEach((explosao) => {
        const progresso = 1 - (explosao.tempoVida / explosao.tempoMax);
        const raio = explosao.raioBase + progresso * 16;
        const alpha = Math.max(0, 0.9 - progresso * 0.9);

        ctxTela.beginPath();
        ctxTela.arc(explosao.x, explosao.y, raio * 0.45, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(255, 240, 190, ${alpha})`;
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.arc(explosao.x, explosao.y, raio, 0, Math.PI * 2);
        ctxTela.strokeStyle = `rgba(255, 145, 85, ${Math.max(0, alpha * 0.75)})`;
        ctxTela.lineWidth = 3;
        ctxTela.stroke();
    });
}

function criarBossDaFase() {
    bossAtual = new BossInimigo(faseAtual);
    bossSpawnadoNaFase = true;
    bossDerrotadoNaFase = false;
    projeteisBoss = [];
    resetarComandos();
    ativarHudSecundario('asteroides', 5);
    mostrarMensagemTemporaria(`Boss ${bossAtual.classe.nome} detectado!<br><small>Fase ${faseAtual}: prepare-se para o confronto</small>`, DURACAO_INFO_EVENTO);
}

function criarExplosaoBoss(boss) {
    animacaoExplosaoBoss = {
        x: boss.x,
        y: boss.y,
        tempoVida: DURACAO_EXPLOSAO_BOSS,
        tempoMax: DURACAO_EXPLOSAO_BOSS,
        estilo: boss.estiloProjetil,
        tema: boss.tema,
        fragmentos: Array.from({ length: 34 }, () => ({
            angulo: Math.random() * Math.PI * 2,
            distancia: 34 + Math.random() * 70,
            raio: 3 + Math.random() * 4
        }))
    };
}

function atualizarExplosaoBoss(deltaTempo) {
    if (!animacaoExplosaoBoss) return;
    animacaoExplosaoBoss.tempoVida -= deltaTempo;
    if (animacaoExplosaoBoss.tempoVida <= 0) {
        animacaoExplosaoBoss = null;
    }
}

function renderizarExplosaoBoss() {
    if (!animacaoExplosaoBoss) return;

    const progresso = 1 - (animacaoExplosaoBoss.tempoVida / animacaoExplosaoBoss.tempoMax);
    const raioExterno = 28 + progresso * 90;
    const alpha = Math.max(0, 1 - progresso);

    ctxTela.save();
    ctxTela.translate(animacaoExplosaoBoss.x, animacaoExplosaoBoss.y);

    const estiloExplosao = animacaoExplosaoBoss.estilo || 'pulso';
    const corInterna = estiloExplosao === 'plasma' ? `rgba(255, 150, 235, ${alpha * 0.52})` : estiloExplosao === 'lanca' ? `rgba(255, 216, 118, ${alpha * 0.52})` : estiloExplosao === 'orbita' ? `rgba(130, 255, 220, ${alpha * 0.5})` : `rgba(180, 240, 255, ${alpha * 0.55})`;
    const corExterna = estiloExplosao === 'plasma' ? `rgba(255, 90, 210, ${alpha * 0.8})` : estiloExplosao === 'lanca' ? `rgba(255, 136, 72, ${alpha * 0.84})` : estiloExplosao === 'orbita' ? `rgba(110, 255, 210, ${alpha * 0.82})` : `rgba(255, 110, 110, ${alpha * 0.85})`;

    ctxTela.beginPath();
    ctxTela.arc(0, 0, raioExterno * 0.55, 0, Math.PI * 2);
    ctxTela.fillStyle = corInterna;
    ctxTela.fill();

    ctxTela.beginPath();
    ctxTela.arc(0, 0, raioExterno, 0, Math.PI * 2);
    ctxTela.strokeStyle = corExterna;
    ctxTela.lineWidth = 5;
    ctxTela.stroke();

    if (estiloExplosao === 'orbita') {
        ctxTela.beginPath();
        ctxTela.ellipse(0, 0, raioExterno * 1.18, raioExterno * 0.52, progresso * 1.4, 0, Math.PI * 2);
        ctxTela.strokeStyle = `rgba(190, 255, 238, ${alpha * 0.55})`;
        ctxTela.lineWidth = 2;
        ctxTela.stroke();
    }

    animacaoExplosaoBoss.fragmentos.forEach((fragmento) => {
        const distancia = progresso * fragmento.distancia;
        const px = Math.cos(fragmento.angulo) * distancia;
        const py = Math.sin(fragmento.angulo) * distancia;
        ctxTela.beginPath();
        ctxTela.arc(px, py, Math.max(1.5, fragmento.raio - progresso * 2.5), 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(255, 170, 120, ${Math.max(0, alpha * 0.9)})`;
        ctxTela.fill();
    });

    ctxTela.restore();
}

function atualizarBoss(deltaTempo) {
    if (bossAtual && !faseEmTransicao) {
        bossAtual.atualizar(deltaTempo);
    }
}

function atualizarProjeteisBoss(deltaTempo) {
    for (let i = projeteisBoss.length - 1; i >= 0; i--) {
        const projetil = projeteisBoss[i];
        projetil.atualizar(deltaTempo);
        if (
            projetil.tempoVida <= 0 ||
            projetil.x < -40 ||
            projetil.x > telaJogo.width + 40 ||
            projetil.y < -40 ||
            projetil.y > telaJogo.height + 40
        ) {
            projeteisBoss.splice(i, 1);
        }
    }
}

// Aplica o efeito do power-up coletado pela nave.
function aplicarPowerUp(tipo) {
    ativarHudSecundario('efeitos', 4.5);
    switch (tipo) {
        case 'escudo':
            efeitosAtivos.escudo = 8;
            mostrarMensagemTemporaria('Escudo ativado!<br><small>Voce esta protegido por alguns segundos</small>', DURACAO_INFO_POWERUP);
            break;
        case 'tiroVelocidade':
            efeitosAtivos.tiroVelocidade = DURACAO_POWERUP;
            mostrarMensagemTemporaria('Tiro Rapido coletado!<br><small>Projetis estao mais velozes</small>', DURACAO_INFO_POWERUP);
            break;
        case 'reparo':
            hpNave = Math.min(HP_MAX_NAVE, hpNave + 5);
            mostrarMensagemTemporaria(`Reparo coletado!<br><small>HP restaurado para ${hpNave}/${HP_MAX_NAVE}</small>`, DURACAO_INFO_POWERUP);
            break;
        case 'vida':
            vidas++;
            mostrarMensagemTemporaria('Vida coletada!<br><small>Voce ganhou +1 vida</small>', DURACAO_INFO_POWERUP);
            break;
        case 'recargaMissil':
            municaoMissil = Math.min(MAX_MISSEIS_NAVE, municaoMissil + RECARGA_POWERUP_MISSIL);
            mostrarMensagemTemporaria(`Recarga de missil!<br><small>${municaoMissil}/${MAX_MISSEIS_NAVE} misseis disponiveis</small>`, DURACAO_INFO_POWERUP);
            break;
        case 'cadencia':
            efeitosAtivos.cadencia = DURACAO_POWERUP;
            mostrarMensagemTemporaria('Cadencia aumentada!<br><small>Voce atira mais rapido</small>', DURACAO_INFO_POWERUP);
            break;
        case 'velocidadeNave':
            efeitosAtivos.velocidadeNave = DURACAO_POWERUP;
            mostrarMensagemTemporaria('Turbo ativado!<br><small>A nave esta mais agil</small>', DURACAO_INFO_POWERUP);
            break;
    }

    atualizarInfoJogo();
}
// Atualiza a contagem de tempo de cada buff temporario.
function atualizarPowerUpsAtivos(deltaTempo) {
    Object.keys(efeitosAtivos).forEach((chave) => {
        if (efeitosAtivos[chave] > 0) {
            efeitosAtivos[chave] = Math.max(0, efeitosAtivos[chave] - deltaTempo);
        }
    });
}

// Atualiza os itens em tela e aplica o efeito quando a nave coleta.
function atualizarPowerUps(deltaTempo) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.atualizar(deltaTempo);

        if (powerUp.tempoVida <= 0) {
            powerUps.splice(i, 1);
            continue;
        }

        if (Math.hypot(powerUp.x - espaconave.x, powerUp.y - espaconave.y) <= powerUp.raio + espaconave.raio) {
            powerUps.splice(i, 1);
            aplicarPowerUp(powerUp.tipo);
        }
    }
}

// Garante vida extra automatica sempre que cruza novo marco de pontuacao.
function verificarVidaExtra() {
    let ganhouVida = false;
    while (pontuacao >= proximaVidaExtra) {
        vidas++;
        proximaVidaExtra += PONTOS_PARA_VIDA_EXTRA;
        ganhouVida = true;
        mostrarMensagemTemporaria(`Vida extra conquistada!<br><small>${vidas} vidas disponiveis</small>`, DURACAO_INFO_POWERUP);
    }
    if (ganhouVida) {
        atualizarInfoJogo();
    }
}

// Verifica se um ponto esta dentro do poligono do asteroide.
function pontoDentroPoligono(ponto, vertices) {
    let dentro = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x;
        const yi = vertices[i].y;
        const xj = vertices[j].x;
        const yj = vertices[j].y;
        const intersecta = ((yi > ponto.y) !== (yj > ponto.y)) && (ponto.x < (xj - xi) * (ponto.y - yi) / ((yj - yi) || 0.0001) + xi);
        if (intersecta) dentro = !dentro;
    }
    return dentro;
}

// Calcula a distancia minima entre ponto e segmento.
function distanciaPontoSegmento(ponto, inicio, fim) {
    const dx = fim.x - inicio.x;
    const dy = fim.y - inicio.y;
    const comprimento2 = dx * dx + dy * dy;
    if (comprimento2 === 0) return Math.hypot(ponto.x - inicio.x, ponto.y - inicio.y);

    let t = ((ponto.x - inicio.x) * dx + (ponto.y - inicio.y) * dy) / comprimento2;
    t = Math.max(0, Math.min(1, t));
    const projX = inicio.x + t * dx;
    const projY = inicio.y + t * dy;
    return Math.hypot(ponto.x - projX, ponto.y - projY);
}

function obterPaletaEspacialDaFase(fase) {
    const paletas = [
        { galaxia: ["255, 135, 214", "133, 205, 255"], planetas: [["94, 145, 255", "210, 236, 255"], ["255, 171, 92", "255, 228, 175"], ["176, 118, 255", "228, 213, 255"]] },
        { galaxia: ["130, 255, 214", "90, 150, 255"], planetas: [["109, 220, 170", "220, 255, 233"], ["255, 120, 160", "255, 222, 232"], ["120, 178, 255", "230, 243, 255"]] },
        { galaxia: ["255, 196, 118", "255, 118, 176"], planetas: [["255, 180, 118", "255, 233, 196"], ["95, 214, 255", "220, 245, 255"], ["220, 110, 255", "244, 220, 255"]] },
        { galaxia: ["180, 185, 255", "130, 255, 210"], planetas: [["140, 120, 255", "225, 220, 255"], ["255, 156, 129", "255, 227, 210"], ["98, 255, 210", "220, 255, 244"]] }
    ];
    return paletas[(fase - 1) % paletas.length];
}

function criarGalaxiasDaFase(fase) {
    const paleta = obterPaletaEspacialDaFase(fase);
    galaxiasFundo = [{
        x: Math.random() * telaJogo.width,
        y: Math.random() * telaJogo.height * 0.7,
        raio: 24 + Math.random() * 28,
        corA: paleta.galaxia[0],
        corB: paleta.galaxia[1],
        angulo: Math.random() * Math.PI,
        profundidade: 0.05 + Math.random() * 0.08
    }];
}
function criarNebulosasDaFase(fase) {
    const paleta = obterPaletaEspacialDaFase(fase);
    const quantidade = 1 + Math.floor(Math.random() * 2);
    nebulosasFundo = Array.from({ length: quantidade }, (_, indice) => {
        const cores = paleta.planetas[indice % paleta.planetas.length];
        return {
            x: Math.random() * telaJogo.width,
            y: Math.random() * telaJogo.height * 0.85,
            raioX: 90 + Math.random() * 110,
            raioY: 48 + Math.random() * 75,
            corA: cores[0],
            corB: paleta.galaxia[indice % paleta.galaxia.length],
            profundidade: 0.03 + Math.random() * 0.018,
            angulo: Math.random() * Math.PI,
            lobos: 3 + Math.floor(Math.random() * 3),
            ruido: 0.18 + Math.random() * 0.2
        };
    });
}


function criarPlanetasDaFase(fase) {
    const paleta = obterPaletaEspacialDaFase(fase);
    const quantidade = 1 + Math.floor(Math.random() * 5);
    planetasFundo = Array.from({ length: quantidade }, (_, indice) => {
        const cores = paleta.planetas[indice % paleta.planetas.length];
        return {
            x: Math.random() * telaJogo.width,
            y: Math.random() * telaJogo.height,
            raio: 52 + Math.random() * 70,
            corA: cores[0],
            corB: cores[1],
            profundidade: 0.012 + Math.random() * 0.022,
            aneis: Math.random() > 0.58,
            anguloAneis: Math.random() * Math.PI,
            manchas: Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => ({
                angulo: Math.random() * Math.PI * 2,
                distancia: Math.random() * 0.48,
                raio: 0.08 + Math.random() * 0.16,
                alpha: 0.08 + Math.random() * 0.16
            }))
        };
    });
}

function criarCenarioEspacialDaFase(fase = faseAtual) {
    criarEstrelas();
    criarGalaxiasDaFase(fase);
    criarNebulosasDaFase(fase);
    criarPlanetasDaFase(fase);
}

// Cria as estrelas do fundo com brilho e profundidade diferentes.
function criarEstrelas() {
    estrelas = [];
    for (let i = 0; i < NUM_ESTRELAS; i++) {
        estrelas.push({
            x: Math.random() * telaJogo.width,
            y: Math.random() * telaJogo.height,
            tamanho: Math.random() * 1.8 + 0.2,
            brilhoBase: Math.random() * 0.45 + 0.2,
            brilhoAmplitude: Math.random() * 0.4 + 0.15,
            brilhoVelocidade: Math.random() * 1.8 + 0.6,
            faseBrilho: Math.random() * Math.PI * 2,
            profundidade: Math.random() * 0.9 + 0.1,
            cor: Math.random() > 0.92 ? "180, 220, 255" : "255, 255, 255"
        });
    }
}

// Renderiza o fundo com parallax e variacao de brilho.
function renderEstrelas() {
    ctxTela.save();
    ctxTela.fillStyle = "#050816";
    ctxTela.fillRect(0, 0, telaJogo.width, telaJogo.height);

    const offsetX = deslocamentoParallaxNave.x;
    const offsetY = deslocamentoParallaxNave.y;


    galaxiasFundo.forEach((galaxia) => {
        let x = galaxia.x - offsetX * galaxia.profundidade;
        let y = galaxia.y - offsetY * galaxia.profundidade;
        x = ((x % telaJogo.width) + telaJogo.width) % telaJogo.width;
        y = ((y % telaJogo.height) + telaJogo.height) % telaJogo.height;

        ctxTela.save();
        ctxTela.translate(x, y);
        ctxTela.rotate(galaxia.angulo + tempoJogo * 0.03);
        const gradiente = ctxTela.createRadialGradient(0, 0, galaxia.raio * 0.12, 0, 0, galaxia.raio);
        gradiente.addColorStop(0, `rgba(${galaxia.corA}, 0.38)`);
        gradiente.addColorStop(0.55, `rgba(${galaxia.corB}, 0.18)`);
        gradiente.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctxTela.fillStyle = gradiente;
        ctxTela.beginPath();
        ctxTela.ellipse(0, 0, galaxia.raio * 1.35, galaxia.raio * 0.58, 0, 0, Math.PI * 2);
        ctxTela.fill();
        ctxTela.restore();
    });

    nebulosasFundo.forEach((nebulosa) => {
        let x = nebulosa.x - offsetX * nebulosa.profundidade;
        let y = nebulosa.y - offsetY * nebulosa.profundidade;
        x = ((x % telaJogo.width) + telaJogo.width) % telaJogo.width;
        y = ((y % telaJogo.height) + telaJogo.height) % telaJogo.height;

        ctxTela.save();
        ctxTela.translate(x, y);
        ctxTela.rotate(nebulosa.angulo + tempoJogo * 0.01);

        for (let i = 0; i < nebulosa.lobos; i++) {
            const anguloLobo = (Math.PI * 2 / nebulosa.lobos) * i;
            const offsetLoboX = Math.cos(anguloLobo) * nebulosa.raioX * 0.18;
            const offsetLoboY = Math.sin(anguloLobo) * nebulosa.raioY * 0.22;
            const deformacao = 1 + Math.sin(tempoJogo * 0.12 + i + nebulosa.angulo) * nebulosa.ruido;
            const gradienteNebulosa = ctxTela.createRadialGradient(
                offsetLoboX * 0.35,
                offsetLoboY * 0.35,
                nebulosa.raioY * 0.08,
                offsetLoboX,
                offsetLoboY,
                nebulosa.raioX * deformacao
            );
            gradienteNebulosa.addColorStop(0, `rgba(${nebulosa.corA}, 0.16)`);
            gradienteNebulosa.addColorStop(0.45, `rgba(${nebulosa.corB}, 0.1)`);
            gradienteNebulosa.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctxTela.fillStyle = gradienteNebulosa;
            ctxTela.beginPath();
            ctxTela.ellipse(offsetLoboX, offsetLoboY, nebulosa.raioX * 0.52 * deformacao, nebulosa.raioY * 0.52 * deformacao, anguloLobo * 0.35, 0, Math.PI * 2);
            ctxTela.fill();
        }

        ctxTela.restore();
    });
    planetasFundo.forEach((planeta) => {
        let x = planeta.x - offsetX * planeta.profundidade;
        let y = planeta.y - offsetY * planeta.profundidade;
        x = ((x % telaJogo.width) + telaJogo.width) % telaJogo.width;
        y = ((y % telaJogo.height) + telaJogo.height) % telaJogo.height;

        const gradientePlaneta = ctxTela.createRadialGradient(
            x - planeta.raio * 0.28,
            y - planeta.raio * 0.32,
            planeta.raio * 0.12,
            x,
            y,
            planeta.raio
        );
        gradientePlaneta.addColorStop(0, `rgba(${planeta.corB}, 0.96)`);
        gradientePlaneta.addColorStop(0.7, `rgba(${planeta.corA}, 0.93)`);
        gradientePlaneta.addColorStop(1, 'rgba(8, 12, 28, 0.85)');

        ctxTela.beginPath();
        ctxTela.arc(x, y, planeta.raio, 0, Math.PI * 2);
        ctxTela.fillStyle = gradientePlaneta;
        ctxTela.fill();

        planeta.manchas.forEach((mancha) => {
            const mx = x + Math.cos(mancha.angulo + tempoJogo * 0.03) * planeta.raio * mancha.distancia;
            const my = y + Math.sin(mancha.angulo + tempoJogo * 0.03) * planeta.raio * mancha.distancia * 0.7;
            ctxTela.beginPath();
            ctxTela.arc(mx, my, planeta.raio * mancha.raio, 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(255, 255, 255, ${mancha.alpha})`;
            ctxTela.fill();
        });

        if (planeta.aneis) {
            ctxTela.save();
            ctxTela.translate(x, y);
            ctxTela.rotate(planeta.anguloAneis);
            ctxTela.beginPath();
            ctxTela.ellipse(0, 0, planeta.raio * 1.45, planeta.raio * 0.36, 0, 0, Math.PI * 2);
            ctxTela.strokeStyle = `rgba(${planeta.corB}, 0.42)`;
            ctxTela.lineWidth = planeta.raio * 0.08;
            ctxTela.stroke();
            ctxTela.restore();
        }
    });

    estrelas.forEach((estrela) => {
        let x = estrela.x - offsetX * estrela.profundidade * 0.06;
        let y = estrela.y - offsetY * estrela.profundidade * 0.06;

        x = ((x % telaJogo.width) + telaJogo.width) % telaJogo.width;
        y = ((y % telaJogo.height) + telaJogo.height) % telaJogo.height;

        const brilho = estrela.brilhoBase + ((Math.sin(tempoJogo * estrela.brilhoVelocidade + estrela.faseBrilho) + 1) / 2) * estrela.brilhoAmplitude;
        const rastro = 1 + estrela.profundidade * 2;

        ctxTela.beginPath();
        ctxTela.arc(x, y, estrela.tamanho, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(${estrela.cor}, ${Math.min(1, brilho)})`;
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.ellipse(x, y, rastro, estrela.tamanho * 0.6, 0, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(${estrela.cor}, ${Math.min(0.35, brilho * 0.35)})`;
        ctxTela.fill();
    });

    ctxTela.restore();
}

// Renderiza a camada jogavel acima do fundo.
function renderizarAnimacaoDestruicaoNave() {
    if (!animacaoDestruicaoNave) return;

    const progresso = 1 - (animacaoDestruicaoNave.tempoRestante / DURACAO_ANIMACAO_DESTRUICAO);
    const raioExplosao = 16 + progresso * 54;
    const intensidadeFlash = Math.max(0, 1 - progresso * 2.4);

    ctxTela.save();
    ctxTela.translate(animacaoDestruicaoNave.x, animacaoDestruicaoNave.y);

    if (intensidadeFlash > 0) {
        ctxTela.beginPath();
        ctxTela.arc(0, 0, 20 + intensidadeFlash * 42, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(255, 248, 210, ${0.72 * intensidadeFlash})`;
        ctxTela.fill();
    }

    animacaoDestruicaoNave.fragmentos.forEach((fragmento) => {
        const distancia = progresso * fragmento.distancia;
        const x = Math.cos(fragmento.angulo) * distancia;
        const y = Math.sin(fragmento.angulo) * distancia;
        const tamanho = Math.max(2, 9 - progresso * 5);

        ctxTela.beginPath();
        ctxTela.arc(x, y, tamanho, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(255, 120, 80, ${Math.max(0, 0.95 - progresso * 0.8)})`;
        ctxTela.fill();
    });

    ctxTela.beginPath();
    ctxTela.arc(0, 0, raioExplosao, 0, Math.PI * 2);
    ctxTela.strokeStyle = `rgba(255, 220, 120, ${Math.max(0, 0.95 - progresso * 0.85)})`;
    ctxTela.lineWidth = 4;
    ctxTela.stroke();

    ctxTela.beginPath();
    ctxTela.arc(0, 0, Math.max(8, raioExplosao * 0.5), 0, Math.PI * 2);
    ctxTela.fillStyle = `rgba(255, 255, 190, ${Math.max(0, 0.58 - progresso * 0.48)})`;
    ctxTela.fill();
    ctxTela.restore();
}

function renderizarEntidades() {
    powerUps.forEach((powerUp) => powerUp.renderizar());
    projetis.forEach((projetil) => projetil.renderizar());
    projeteisBoss.forEach((projetil) => projetil.renderizar());
    asteroides.forEach((asteroide) => asteroide.renderizar());
    navesInimigas.forEach((nave) => nave.renderizar());
    renderizarParticulasAsteroide();
    renderizarMiniExplosoesMissil();
    renderizarExplosoesNavesInimigas();
    if (bossAtual) {
        bossAtual.renderizar();
    }
    renderizarExplosaoBoss();
    renderizarAnimacaoDestruicaoNave();
    if (espaconave && !animacaoDestruicaoNave) {
        espaconave.renderizar();
    }
}
function calcularMaxAsteroidesPorFase(fase) {
    const faseLimitada = Math.min(Math.max(fase, 1), 20);
    return 15 + Math.floor(((faseLimitada - 1) * 25) / 19);
}

// Define quantos asteroides a fase precisa gerar no total.
function calcularTotalAsteroidesDaFase(fase) {
    return calcularMaxAsteroidesPorFase(fase);
}

function calcularTotalNavesInimigasFase(fase) {
    if (fase < 10) return 0;
    return Math.min(20, 5 + (fase - 10));
}

function calcularMaxNavesInimigasEmTela(fase) {
    if (fase < 10) return 0;
    return 5;
}

function sortearQuantidadeSpawnNaves(maximoPossivel) {
    let quantidade = 1;
    for (let i = 1; i < maximoPossivel; i++) {
        if (Math.random() < 0.38) {
            quantidade++;
        }
    }
    return quantidade;
}

// Quantidade inicial que ja nasce em tela no inicio da fase.
function calcularSpawnInicialDaFase() {
    const quantidade = 3 + Math.floor(Math.random() * 3);
    return Math.min(quantidade, totalAsteroidesFase);
}

// Intervalo do spawn em segundos, mas baseado em um valor em ms por fase.
function calcularIntervaloSpawn() {
    const intervaloSpawnMs = Math.min(2200, 650 + (faseAtual - 1) * 140);
    return intervaloSpawnMs / 1000;
}

// Diz ao jogador o que foi liberado na fase atual.
function obterNovidadeDaFase(fase) {
    if (fase === 1) return "Liberado: asteroide padrao";
    if (fase === 2) return "Liberado: asteroide rapido (azul)";
    if (fase === 3) return "Liberado: asteroide pesado (laranja)";
    if (fase === 4) return "Liberado: asteroide fragmentado (verde)";
    if (fase === 10) return "Naves inimigas entraram na batalha";
    return "Mais asteroides e spawn mais intenso";
}
// Retorna a configuracao completa de cada subtipo de asteroide.
function obterConfiguracaoSubtipo(subtipo) {
    const configuracoes = {
        padrao: {
            velocidade: 1,
            rotacao: 1,
            vertices: 8,
            irregularidadeMin: 0.72,
            irregularidadeMax: 1.25,
            corFill: "rgba(100, 100, 100, 0.8)",
            corStroke: "rgba(180, 180, 180, 0.95)",
            pontos: 10,
            vida: 1
        },
        rapido: {
            velocidade: 1.45,
            rotacao: 1.6,
            vertices: 7,
            irregularidadeMin: 0.6,
            irregularidadeMax: 1.05,
            corFill: "rgba(85, 85, 115, 0.8)",
            corStroke: "rgba(170, 200, 255, 0.95)",
            pontos: 15,
            vida: 2
        },
        pesado: {
            velocidade: 0.72,
            rotacao: 0.65,
            vertices: 10,
            irregularidadeMin: 0.82,
            irregularidadeMax: 1.35,
            corFill: "rgba(120, 92, 70, 0.85)",
            corStroke: "rgba(232, 188, 135, 0.95)",
            pontos: 20,
            vida: 4
        },
        fragmentado: {
            velocidade: 1.2,
            rotacao: 1.2,
            vertices: 12,
            irregularidadeMin: 0.55,
            irregularidadeMax: 1.15,
            corFill: "rgba(88, 112, 84, 0.82)",
            corStroke: "rgba(178, 231, 170, 0.95)",
            pontos: 18,
            vida: 3
        }
    };

    return configuracoes[subtipo] || configuracoes.padrao;
}

// Faz qualquer entidade reaparecer do outro lado da tela.
function obterClasseNaveInimiga(fase) {
    return CLASSES_NAVES_INIMIGAS.find((classe) => fase >= classe.faixaMin && fase <= classe.faixaMax) || CLASSES_NAVES_INIMIGAS[CLASSES_NAVES_INIMIGAS.length - 1];
}
function sortearPontoEntradaHostil() {
    const margem = 80;
    const lado = Math.floor(Math.random() * 4);
    if (lado === 0) return { x: -margem, y: Math.random() * telaJogo.height };
    if (lado === 1) return { x: telaJogo.width + margem, y: Math.random() * telaJogo.height };
    if (lado === 2) return { x: Math.random() * telaJogo.width, y: -margem };
    return { x: Math.random() * telaJogo.width, y: telaJogo.height + margem };
}
function criarExplosaoNaveInimiga(nave) {
    const configuracoes = {
        interceptora: {
            estilo: 'pulso',
            interna: '255, 230, 166',
            externa: '255, 143, 76',
            duracao: 0.62,
            raio: 28,
            fragmentos: 14,
            multiplicadorDistancia: 1.45
        },
        artilheira: {
            estilo: 'plasma',
            interna: '255, 178, 240',
            externa: '255, 88, 196',
            duracao: 0.86,
            raio: 34,
            fragmentos: 18,
            multiplicadorDistancia: 1.75
        },
        fantasma: {
            estilo: 'orbita',
            interna: '174, 255, 236',
            externa: '88, 255, 212',
            duracao: 0.98,
            raio: 32,
            fragmentos: 16,
            multiplicadorDistancia: 1.6
        },
        aniquiladora: {
            estilo: 'lanca',
            interna: '255, 224, 176',
            externa: '255, 166, 92',
            duracao: 1.08,
            raio: 40,
            fragmentos: 22,
            multiplicadorDistancia: 2
        }
    };
    const config = configuracoes[nave.classe.perfil] || configuracoes.interceptora;
    animacoesExplosaoNavesInimigas.push({
        x: nave.x,
        y: nave.y,
        tempoVida: config.duracao,
        tempoMax: config.duracao,
        estilo: config.estilo,
        cores: { interna: config.interna, externa: config.externa },
        raioBase: config.raio,
        fragmentos: Array.from({ length: config.fragmentos + Math.round(nave.raio / 4) }, () => ({
            angulo: Math.random() * Math.PI * 2,
            distancia: 16 + Math.random() * (nave.raio * config.multiplicadorDistancia),
            raio: 1.4 + Math.random() * (nave.classe.perfil === 'aniquiladora' ? 3.4 : 2.4)
        }))
    });
}

function atualizarExplosoesNavesInimigas(deltaTempo) {
    for (let i = animacoesExplosaoNavesInimigas.length - 1; i >= 0; i--) {
        animacoesExplosaoNavesInimigas[i].tempoVida -= deltaTempo;
        if (animacoesExplosaoNavesInimigas[i].tempoVida <= 0) {
            animacoesExplosaoNavesInimigas.splice(i, 1);
        }
    }
}

function renderizarExplosoesNavesInimigas() {
    animacoesExplosaoNavesInimigas.forEach((explosao) => {
        const progresso = 1 - (explosao.tempoVida / explosao.tempoMax);
        const alpha = Math.max(0, 1 - progresso);
        const raio = explosao.raioBase + progresso * (explosao.estilo === 'lanca' ? 40 : explosao.estilo === 'plasma' ? 34 : 28);

        ctxTela.save();
        ctxTela.translate(explosao.x, explosao.y);

        ctxTela.beginPath();
        ctxTela.arc(0, 0, raio * 0.52, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(${explosao.cores.interna}, ${alpha * 0.46})`;
        ctxTela.fill();

        ctxTela.beginPath();
        ctxTela.arc(0, 0, raio, 0, Math.PI * 2);
        ctxTela.strokeStyle = `rgba(${explosao.cores.externa}, ${alpha * 0.82})`;
        ctxTela.lineWidth = explosao.estilo === 'lanca' ? 4 : 3;
        ctxTela.stroke();

        if (explosao.estilo === 'orbita') {
            ctxTela.beginPath();
            ctxTela.ellipse(0, 0, raio * 1.26, raio * 0.5, progresso * 1.8, 0, Math.PI * 2);
            ctxTela.strokeStyle = `rgba(220, 255, 245, ${alpha * 0.5})`;
            ctxTela.lineWidth = 1.5;
            ctxTela.stroke();
        }

        if (explosao.estilo === 'plasma') {
            ctxTela.beginPath();
            ctxTela.arc(0, 0, raio * 0.32, 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(255, 230, 250, ${alpha * 0.72})`;
            ctxTela.fill();
        }

        explosao.fragmentos.forEach((fragmento) => {
            const distancia = progresso * fragmento.distancia;
            const px = Math.cos(fragmento.angulo) * distancia;
            const py = Math.sin(fragmento.angulo) * distancia;
            ctxTela.beginPath();
            ctxTela.arc(px, py, Math.max(0.8, fragmento.raio - progresso * 2), 0, Math.PI * 2);
            ctxTela.fillStyle = `rgba(${explosao.cores.externa}, ${alpha * 0.92})`;
            ctxTela.fill();
        });

        ctxTela.restore();
    });
}

function destruirNaveInimiga(indice, porColisao = false) {
    const nave = navesInimigas[indice];
    if (!nave) return;

    pontuacao += nave.pontos;
    criarExplosaoNaveInimiga(nave);
    navesInimigas.splice(indice, 1);
    verificarVidaExtra();
    atualizarInfoJogo();

    if (navesInimigasRestantesFase > 0 && navesInimigas.length === 0) {
        spawnNaveInimigaApos = tempoFase + 3.5;
    }

    ativarHudSecundario('asteroides', porColisao ? 2.8 : 3.6);
}

function criarNaveInimigaDaFase() {
    if (navesInimigasRestantesFase <= 0) return null;
    const nave = new NaveInimiga(faseAtual);
    navesInimigas.push(nave);
    navesInimigasRestantesFase--;
    return nave;
}

function atualizarNavesInimigas(deltaTempo) {
    navesInimigas.forEach((nave) => nave.atualizar(deltaTempo));
    if (faseAtual < 10 || faseEmTransicao || bossAtual) return;
    if (tempoFase < spawnNaveInimigaApos) return;
    if (navesInimigasRestantesFase <= 0) return;
    if (navesInimigas.length > 0) return;

    const espacosDisponiveis = calcularMaxNavesInimigasEmTela(faseAtual) - navesInimigas.length;
    if (espacosDisponiveis <= 0) return;

    const quantidadeSpawn = sortearQuantidadeSpawnNaves(Math.min(espacosDisponiveis, navesInimigasRestantesFase));
    let primeiraNave = null;

    for (let i = 0; i < quantidadeSpawn; i++) {
        const nave = criarNaveInimigaDaFase();
        if (!primeiraNave) primeiraNave = nave;
    }

    if (primeiraNave) {
        ativarHudSecundario('asteroides', 4);
        const mensagem = quantidadeSpawn > 1
            ? `Esquadra inimiga detectada!<br><small>${quantidadeSpawn} naves hostis entraram na batalha</small>`
            : `Nave ${primeiraNave.classe.nome} detectada!<br><small>Elimine a ameaca inimiga</small>`;
        mostrarMensagemTemporaria(mensagem, DURACAO_INFO_EVENTO);
    }

    spawnNaveInimigaApos = tempoFase + 3.5;
}

function ajustarCoordenada(valor, limite) {
    if (valor < 0) return limite;
    if (valor > limite) return 0;
    return valor;
}

// Mantem o angulo no intervalo -PI ate PI.
function normalizarAngulo(angulo) {
    while (angulo > Math.PI) angulo -= Math.PI * 2;
    while (angulo < -Math.PI) angulo += Math.PI * 2;
    return angulo;
}

// Limpa todas as teclas pressionadas.
function resetarComandos() {
    comandos.teclaA = false;
    comandos.teclaD = false;
    comandos.teclaW = false;
    comandos.teclaS = false;
    comandos.teclaSpace = false;
}

// Retorna buff ativo de velocidade da nave.
function obterMultiplicadorVelocidadeNave() {
    return efeitosAtivos.velocidadeNave > 0 ? 1.75 : 1;
}

// Retorna buff ativo da velocidade dos projeteis.
function obterMultiplicadorVelocidadeTiro() {
    return efeitosAtivos.tiroVelocidade > 0 ? 1.45 : 1;
}

// Retorna multiplicador de cadencia; menor valor significa atirar mais rapido.
function obterMultiplicadorCadencia() {
    return efeitosAtivos.cadencia > 0 ? 0.6 : 1;
}

// Mostra uma linha secundaria do HUD por alguns segundos.
function ativarHudSecundario(chave, duracao = 2.4) {
    if (hudSecundarioTemporizadores[chave] !== undefined) {
        hudSecundarioTemporizadores[chave] = Math.max(hudSecundarioTemporizadores[chave], duracao);
    }
}

// Atualiza a visibilidade das linhas secundarias do HUD.
function atualizarVisibilidadeHudSecundario(deltaTempo = 0) {
    Object.keys(hudSecundarioTemporizadores).forEach((chave) => {
        hudSecundarioTemporizadores[chave] = Math.max(0, hudSecundarioTemporizadores[chave] - deltaTempo);
    });

    const velocidadeAtual = espaconave ? Math.hypot(espaconave.velocidade.x, espaconave.velocidade.y) : 0;
    const mostrarVelocidade = hudSecundarioTemporizadores.velocidade > 0 || velocidadeAtual > 0.08 || comandos.teclaW || comandos.teclaS;
    const mostrarAsteroides = hudSecundarioTemporizadores.asteroides > 0 || faseEmTransicao || bossAtual || navesInimigas.length > 0;
    const mostrarArma = true;
    const mostrarEfeitos = hudSecundarioTemporizadores.efeitos > 0 || Object.values(efeitosAtivos).some((valor) => valor > 0);

    if (hudVelocidadeSecundario) hudVelocidadeSecundario.classList.toggle("ativa", mostrarVelocidade);
    if (hudAsteroidesSecundario) hudAsteroidesSecundario.classList.toggle("ativa", mostrarAsteroides);
    if (hudArmaSecundario) hudArmaSecundario.classList.toggle("ativa", mostrarArma);
    if (hudEfeitosSecundario) hudEfeitosSecundario.classList.toggle("ativa", mostrarEfeitos);
}

// Atualiza no HUD o nome da arma selecionada.
function atualizarInfoArma() {
    if (!armaEstaDesbloqueada(armaSelecionada)) {
        armaSelecionada = obterArmasDesbloqueadas().includes('pulso') ? 'pulso' : obterArmasDesbloqueadas()[0];
    }
    infoArma.textContent = ARMAS[armaSelecionada].nome + ' | M ' + municaoMissil + '/' + MAX_MISSEIS_NAVE;
}

// Atualiza no HUD a lista de efeitos temporarios ativos.
function atualizarInfoEfeitos() {
    const ativos = [];
    if (efeitosAtivos.escudo > 0) ativos.push(`Escudo ${efeitosAtivos.escudo.toFixed(1)}s`);
    if (efeitosAtivos.escudoReinicio > 0) ativos.push(`Respawn ${efeitosAtivos.escudoReinicio.toFixed(1)}s`);
    if (efeitosAtivos.tiroVelocidade > 0) ativos.push(`Tiro ${efeitosAtivos.tiroVelocidade.toFixed(1)}s`);
    if (efeitosAtivos.cadencia > 0) ativos.push(`Cadencia ${efeitosAtivos.cadencia.toFixed(1)}s`);
    if (efeitosAtivos.velocidadeNave > 0) ativos.push(`Turbo ${efeitosAtivos.velocidadeNave.toFixed(1)}s`);
    infoEfeitos.textContent = ativos.length > 0 ? ativos.join(" | ") : "Nenhum";
}

function obterArmasDesbloqueadas(fase = faseAtual) {
    const quantidadeBase = Math.min(5, 1 + Math.floor((fase - 1) / 2));
    const armas = ORDEM_DESBLOQUEIO_ARMAS.slice(0, quantidadeBase);
    if (fase >= 10 && !armas.includes('laser')) {
        armas.push('laser');
    }
    return armas;
}

function armaEstaDesbloqueada(chaveArma, fase = faseAtual) {
    return obterArmasDesbloqueadas(fase).includes(chaveArma);
}

function obterArmaDesbloqueadaNaFase(fase = faseAtual) {
    if (fase === 10) return 'laser';
    if (fase <= 1 || fase % 2 === 0) return null;
    return ORDEM_DESBLOQUEIO_ARMAS[Math.floor((fase - 1) / 2)] || null;
}

function obterMensagemArmaDesbloqueada(chaveArma) {
    if (!chaveArma || !ARMAS[chaveArma]) return '';
    const config = ARMAS[chaveArma];
    return `Arma desbloqueada<br><small>${config.tecla.replace('Digit', '').replace('Key', '')} - ${config.nome}</small>`;
}

function selecionarArmaPorTecla(codigoTecla) {
    const arma = Object.entries(ARMAS).find(([, config]) => config.tecla === codigoTecla);
    if (!arma) return false;
    if (!armaEstaDesbloqueada(arma[0])) return true;
    armaSelecionada = arma[0];
    atualizarInfoArma();
    ativarHudSecundario("arma", 3.2);
    return true;
}

// Calcula a chance atual de drop, subindo levemente com a fase sem inundar a tela.
function obterChancePowerUpAtual() {
    return Math.min(0.27, CHANCE_POWERUP + (faseAtual - 1) * 0.01);
}

// Decide se um asteroide derrotado vai ou nao soltar um item.
// Depois do drop, o tipo sorteado respeita a raridade de cada power-up.
function sortearPowerUp() {
    if (Math.random() > obterChancePowerUpAtual()) return null;

    const entradas = Object.entries(TIPOS_POWERUP);
    const pesoTotal = entradas.reduce((total, [, config]) => total + config.pesoRaridade, 0);
    let rolagem = Math.random() * pesoTotal;

    for (const [tipo, config] of entradas) {
        rolagem -= config.pesoRaridade;
        if (rolagem <= 0) {
            return tipo;
        }
    }

    return entradas[entradas.length - 1][0];
}

// Cria um power-up na posicao do asteroide destruido.
function criarPowerUp(x, y) {
    const tipo = sortearPowerUp();
    if (!tipo) return;
    powerUps.push(new PowerUp(x, y, tipo));
}

// Mostra uma mensagem temporaria no centro da tela.
function ocultarPainelEvento() {
    clearTimeout(timeoutPainelEvento);
    painelEvento.style.display = "none";
    painelEvento.innerHTML = "";
}

function mostrarPainelEvento(texto, duracaoMs = DURACAO_INFO_EVENTO) {
    if (!painelEvento || jogoAcabou) return;

    clearTimeout(timeoutPainelEvento);
    painelEvento.innerHTML = texto;
    painelEvento.style.display = "block";

    timeoutPainelEvento = setTimeout(() => {
        if (!painelInformacoesAberto && !jogoAcabou) {
            ocultarPainelEvento();
        }
    }, duracaoMs);
}

function obterMensagemPainelAsteroides() {
    return "Asteroides<br><small>Cinza: 1 tiro | Azul: 2 tiros | Verde: 3 tiros | Laranja: 4 tiros</small>";
}

function obterMensagemPainelArmas() {
    const armas = obterArmasDesbloqueadas().map((chave) => {
        const arma = ARMAS[chave];
        return `${arma.tecla.replace('Digit', '').replace('Key', '')} ${arma.nome}`;
    });
    return `Armas liberadas<br><small>${armas.join(' | ')}</small>`;
}

function alternarPainelInformacoesJogo(forcarAberto = null) {
    if (!painelInformacoesJogo) return;

    painelInformacoesAberto = typeof forcarAberto === "boolean" ? forcarAberto : !painelInformacoesAberto;
    painelInformacoesJogo.style.display = painelInformacoesAberto ? "block" : "none";
    if (botaoInformacoesJogo) {
        botaoInformacoesJogo.classList.toggle("ativo", painelInformacoesAberto);
    }

    if (painelInformacoesAberto) {
        ocultarPainelEvento();
    }
}

function mostrarMensagemTemporaria(texto, duracaoMs = DURACAO_INFO_POWERUP) {
    mostrarPainelEvento(texto, duracaoMs);
}

// Retorna a lista de subtipos ja desbloqueados pela fase.
function obterSubtiposDisponiveis() {
    const subtipos = ["padrao"];
    if (faseAtual >= 2) subtipos.push("rapido");
    if (faseAtual >= 3) subtipos.push("pesado");
    if (faseAtual >= 4) subtipos.push("fragmentado");
    return subtipos;
}

// Sorteia o subtipo respeitando a progressao de dificuldade.
function sortearSubtipoAsteroide() {
    const subtipos = obterSubtiposDisponiveis();
    const rolagem = Math.random();

    if (faseAtual >= 4 && rolagem > 0.82) return "fragmentado";
    if (faseAtual >= 3 && rolagem > 0.62) return "pesado";
    if (faseAtual >= 2 && rolagem > 0.35) return "rapido";
    return subtipos[0];
}

// Cria um asteroide fora da tela mirando aproximadamente na nave.
function criarAsteroideAleatorio(subtipo = sortearSubtipoAsteroide()) {
    let x;
    let y;
    let tentativas = 0;

    do {
        const lado = Math.floor(Math.random() * 4);
        if (lado === 0) {
            x = Math.random() * telaJogo.width;
            y = -40;
        } else if (lado === 1) {
            x = telaJogo.width + 40;
            y = Math.random() * telaJogo.height;
        } else if (lado === 2) {
            x = Math.random() * telaJogo.width;
            y = telaJogo.height + 40;
        } else {
            x = -40;
            y = Math.random() * telaJogo.height;
        }
        tentativas++;
    } while (espaconave && Math.hypot(x - espaconave.x, y - espaconave.y) < DISTANCIA_SEGURA_SPAWN && tentativas < 12);

    const velocidadeBase = 0.85 + faseAtual * 0.08;
    const tamanhoMin = Math.max(30, 64 - faseAtual * 1.5);
    const tamanhoMax = Math.min(145, 84 + faseAtual * 4);
    const tamanho = Math.random() * (tamanhoMax - tamanhoMin) + tamanhoMin;
    const alvoX = espaconave ? espaconave.x : telaJogo.width / 2;
    const alvoY = espaconave ? espaconave.y : telaJogo.height / 2;
    const angulo = Math.atan2(alvoY - y, alvoX - x) + (Math.random() - 0.5) * 1.2;
    const velocidade = velocidadeBase + Math.random() * (0.9 + faseAtual * 0.04);

    return new Asteroide(x, y, tamanho, Math.cos(angulo) * velocidade, Math.sin(angulo) * velocidade, subtipo);
}

// Registra e cria uma quantidade de asteroides para a fase atual.
function registrarAsteroideGerado(quantidade) {
    for (let i = 0; i < quantidade; i++) {
        asteroides.push(criarAsteroideAleatorio());
        asteroidesGeradosFase++;
    }
}

// Reseta os dados da fase, cria o spawn inicial e mostra a transicao.
function prepararFase(fase) {
    faseAtual = fase;
    tempoFase = 0;
    totalAsteroidesFase = calcularTotalAsteroidesDaFase(faseAtual);
    totalNavesInimigasFase = calcularTotalNavesInimigasFase(faseAtual);
    navesInimigasRestantesFase = totalNavesInimigasFase;
    spawnNaveInimigaApos = 6;
    asteroidesDestruidosFase = 0;
    asteroidesGeradosFase = 0;
    proximoSpawnAsteroide = 0;
    asteroides = [];
    projetis = [];
    projeteisBoss = [];
    powerUps = [];
    particulasAsteroide = [];
    miniExplosoesMissil = [];
    animacoesExplosaoNavesInimigas = [];

    bossAtual = null;
    animacaoExplosaoBoss = null;
    bossSpawnadoNaFase = false;
    bossDerrotadoNaFase = false;
    faseEmTransicao = true;
    tempoRestanteTransicaoFase = TEMPO_TRANSICAO_FASE;
    espaconave.reiniciarPosicao();
    resetarComandos();

    const spawnInicial = calcularSpawnInicialDaFase();
    registrarAsteroideGerado(spawnInicial);
    proximoSpawnAsteroide = tempoJogo + calcularIntervaloSpawn();

    criarCenarioEspacialDaFase(faseAtual);
    exibirMensagem(`Fase ${faseAtual}<br><small>${totalAsteroidesFase} asteroides nesta fase</small><br><small>${obterNovidadeDaFase(faseAtual)}</small>`);

    const armaDesbloqueada = obterArmaDesbloqueadaNaFase(faseAtual);
    if (armaDesbloqueada && !armaEstaDesbloqueada(armaDesbloqueada, faseAtual - 1)) {
        mostrarPainelEvento(obterMensagemArmaDesbloqueada(armaDesbloqueada), DURACAO_INFO_EVENTO);
    } else if (faseAtual === 1) {
        mostrarPainelEvento(obterMensagemPainelAsteroides(), DURACAO_INFO_EVENTO);
    }
}

// Continua gerando asteroides ate completar o total da fase.
function atualizarSpawnerAsteroides() {
    if (faseEmTransicao || jogoAcabou || jogoPausado) return;
    if (tempoJogo < proximoSpawnAsteroide) return;
    if (asteroidesGeradosFase >= totalAsteroidesFase) return;

    const quantidade = Math.min(1 + Math.floor(faseAtual / 5), totalAsteroidesFase - asteroidesGeradosFase);
    registrarAsteroideGerado(quantidade);
    proximoSpawnAsteroide = tempoJogo + calcularIntervaloSpawn();
}

// Subtipo fragmentado pode se dividir em asteroides rapidos menores.
function gerarFragmentosAsteroide(asteroideOriginal) {
    if (asteroideOriginal.subtipo !== "fragmentado") return [];
    if (asteroideOriginal.tamanho < 42) return [];

    const fragmentos = [];
    const quantidade = 2;

    for (let i = 0; i < quantidade; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidade = 1.4 + Math.random() * 0.9;
        fragmentos.push(new Asteroide(asteroideOriginal.x, asteroideOriginal.y, asteroideOriginal.tamanho * 0.55, Math.cos(angulo) * velocidade, Math.sin(angulo) * velocidade, "rapido"));
    }

    return fragmentos;
}

// Aplica dano do projetil no asteroide.
// Armas perfurantes atravessam, as outras desaparecem ao colidir.
function aplicarDanoNoAsteroide(asteroide, indiceAsteroide, projetil, indiceProjetil) {
    asteroide.vida -= projetil.dano;

    if (projetil.guiado) {
        criarMiniExplosaoMissil(projetil.x, projetil.y, 14 + asteroide.tamanho * 0.12);
    }

    if (!projetil.perfurante) {
        projetis.splice(indiceProjetil, 1);
    }

    if (asteroide.vida > 0) {
        return;
    }

    const posicaoAsteroide = { x: asteroide.x, y: asteroide.y };
    criarParticulasDestruicaoAsteroide(asteroide);
    asteroides.splice(indiceAsteroide, 1);
    pontuacao += asteroide.configuracao.pontos;
    asteroidesDestruidosFase++;
    ativarHudSecundario('asteroides', 3.5);
    verificarVidaExtra();
    criarPowerUp(posicaoAsteroide.x, posicaoAsteroide.y);

    const fragmentos = gerarFragmentosAsteroide(asteroide);
    if (fragmentos.length > 0) {
        asteroides.push(...fragmentos);
    }
}

function aplicarDanoNoBoss(projetil, indiceProjetil) {
    if (!bossAtual) return;

    bossAtual.vida -= projetil.dano;
    if (projetil.guiado || projetil.tipoArma === 'laser') {
        criarMiniExplosaoMissil(projetil.x, projetil.y, projetil.tipoArma === 'laser' ? 28 : 22);
    }

    if (!projetil.perfurante) {
        projetis.splice(indiceProjetil, 1);
    }

    if (bossAtual.vida > 0) {
        return;
    }

    pontuacao += 180 + faseAtual * 45;
    verificarVidaExtra();
    criarExplosaoBoss(bossAtual);
    bossAtual = null;
    bossDerrotadoNaFase = true;
    projeteisBoss = [];
    mostrarMensagemTemporaria(`Boss derrotado!<br><small>Prepare-se para a fase ${faseAtual + 1}</small>`, DURACAO_INFO_EVENTO);
}

function consumirEscudoSeAtivo() {
    if (efeitosAtivos.escudoReinicio > 0) {
        return true;
    }

    if (efeitosAtivos.escudo > 0) {
        efeitosAtivos.escudo = 0;
        mostrarMensagemTemporaria('Escudo consumido!<br><small>Voce bloqueou um impacto</small>', DURACAO_INFO_POWERUP);
        return true;
    }

    return false;
}

function aplicarDanoDeTiroNaNave(dano = 1) {
    if (consumirEscudoSeAtivo()) {
        atualizarInfoJogo();
        return;
    }

    hpNave = Math.max(0, hpNave - dano);
    ativarHudSecundario('efeitos', 2.5);
    atualizarInfoJogo();

    if (hpNave <= 0) {
        perderVida();
    }
}

function aplicarColisaoFatalNaNave() {
    if (consumirEscudoSeAtivo()) {
        atualizarInfoJogo();
        return;
    }

    hpNave = 0;
    atualizarInfoJogo();
    perderVida();
}

// Verifica colisao entre projetis, asteroides, power-ups e a nave.
function concluirRenascimentoNave() {
    if (!espaconave) return;

    if (gameOverPendente) {
        animacaoDestruicaoNave = null;
        executarGameOver();
        return;
    }

    espaconave.reiniciarPosicao();
    hpNave = HP_MAX_NAVE;
    efeitosAtivos.escudoReinicio = DURACAO_ESCUDO_RENASCIMENTO;
    hudSecundarioTemporizadores.efeitos = Math.max(hudSecundarioTemporizadores.efeitos, DURACAO_ESCUDO_RENASCIMENTO);
    animacaoDestruicaoNave = null;
    resetarComandos();
    atualizarInfoJogo();
}

function atualizarAnimacaoDestruicaoNave(deltaTempo) {
    if (!animacaoDestruicaoNave) return;

    animacaoDestruicaoNave.tempoRestante = Math.max(0, animacaoDestruicaoNave.tempoRestante - deltaTempo);
    if (animacaoDestruicaoNave.tempoRestante === 0) {
        concluirRenascimentoNave();
    }
}

function iniciarAnimacaoDestruicaoNave() {
    if (!espaconave) return;

    animacaoDestruicaoNave = {
        x: espaconave.x,
        y: espaconave.y,
        tempoRestante: DURACAO_ANIMACAO_DESTRUICAO,
        fragmentos: Array.from({ length: 20 }, () => ({
            angulo: Math.random() * Math.PI * 2,
            distancia: 22 + Math.random() * 38
        }))
    };
}

function verificarColisoes() {
    if (animacaoDestruicaoNave) return;

    for (let i = projetis.length - 1; i >= 0; i--) {
        const projetil = projetis[i];
        let acertou = false;

        for (let j = projeteisBoss.length - 1; j >= 0; j--) {
            const projetilBossAtual = projeteisBoss[j];
            if (projetilBossAtual.estilo !== 'missil') continue;
            if (Math.hypot(projetil.x - projetilBossAtual.x, projetil.y - projetilBossAtual.y) <= projetil.raio + projetilBossAtual.raio) {
                projeteisBoss.splice(j, 1);
                criarMiniExplosaoMissil(projetilBossAtual.x, projetilBossAtual.y, 18);
                if (!projetil.perfurante) {
                    projetis.splice(i, 1);
                }
                acertou = true;
                break;
            }
        }

        if (acertou) {
            continue;
        }

        for (let j = asteroides.length - 1; j >= 0; j--) {
            const asteroide = asteroides[j];
            if (asteroide.colideComCirculo(projetil.x, projetil.y, projetil.raio)) {
                aplicarDanoNoAsteroide(asteroide, j, projetil, i);
                acertou = true;
                break;
            }
        }

        if (!acertou) {
            for (let j = navesInimigas.length - 1; j >= 0; j--) {
                const nave = navesInimigas[j];
                if (nave.colideComCirculo(projetil.x, projetil.y, projetil.raio)) {
                    nave.receberDano(projetil.dano);
                    if (projetil.guiado || projetil.tipoArma === 'laser') criarMiniExplosaoMissil(projetil.x, projetil.y, projetil.tipoArma === 'laser' ? 22 : 16);
                    if (!projetil.perfurante) projetis.splice(i, 1);
                    if (nave.vida <= 0) destruirNaveInimiga(j);
                    acertou = true;
                    break;
                }
            }
        }

        if (!acertou && bossAtual && bossAtual.colideComCirculo(projetil.x, projetil.y, projetil.raio)) {
            aplicarDanoNoBoss(projetil, i);
        }
    }

    for (let j = asteroides.length - 1; j >= 0; j--) {
        const asteroide = asteroides[j];
        if (asteroide.colideComCirculo(espaconave.x, espaconave.y, espaconave.raio * 0.8)) {
            asteroides.splice(j, 1);
            criarParticulasDestruicaoAsteroide(asteroide);
            aplicarColisaoFatalNaNave();
            break;
        }
    }

    for (let j = navesInimigas.length - 1; j >= 0; j--) {
        const nave = navesInimigas[j];
        if (nave.colideComCirculo(espaconave.x, espaconave.y, espaconave.raio * 0.82)) {
            destruirNaveInimiga(j, true);
            aplicarColisaoFatalNaNave();
            return;
        }
    }

    if (bossAtual && bossAtual.colideComCirculo(espaconave.x, espaconave.y, espaconave.raio * 0.9)) {
        aplicarColisaoFatalNaNave();
    }

    for (let i = projeteisBoss.length - 1; i >= 0; i--) {
        const projetil = projeteisBoss[i];
        if (Math.hypot(projetil.x - espaconave.x, projetil.y - espaconave.y) <= projetil.raio + espaconave.raio * 0.7) {
            projeteisBoss.splice(i, 1);
            if (projetil.estilo === 'missil') {
                criarMiniExplosaoMissil(projetil.x, projetil.y, 18);
            }
            aplicarDanoDeTiroNaNave(projetil.dano);
            break;
        }
    }
}


function verificarProgressoFase() {
    if (faseEmTransicao || jogoAcabou) return;

    const limpouAsteroides = asteroidesGeradosFase >= totalAsteroidesFase && asteroides.length === 0;
    const limpouNavesInimigas = navesInimigas.length === 0 && navesInimigasRestantesFase <= 0;

    if (limpouAsteroides && limpouNavesInimigas && !bossSpawnadoNaFase) {
        criarBossDaFase();
        return;
    }

    if (bossSpawnadoNaFase && bossDerrotadoNaFase && !bossAtual && !animacaoExplosaoBoss && projeteisBoss.length === 0) {
        prepararFase(faseAtual + 1);
    }
}

// Atualiza pontuacao, vidas, fase, velocidade, contador e arma no HUD.
function atualizarInfoJogo() {
    infoPontuacao.textContent = pontuacao;

    if (infoVidas) infoVidas.textContent = vidas;
    if (infoHp) infoHp.textContent = `${hpNave}/${HP_MAX_NAVE}`;
    if (infoHpPreenchimento) {
        const percentualHp = (hpNave / HP_MAX_NAVE) * 100;
        infoHpPreenchimento.style.width = `${percentualHp}%`;
        infoHpPreenchimento.style.background = percentualHp <= 30 ? 'linear-gradient(90deg, #ff4d6d 0%, #ff7b54 100%)' : percentualHp <= 60 ? 'linear-gradient(90deg, #ffb347 0%, #ffd166 100%)' : 'linear-gradient(90deg, #46d47d 0%, #7fffd4 100%)';
    }
    infoVelocidade.textContent = Math.round(Math.sqrt(espaconave.velocidade.x ** 2 + espaconave.velocidade.y ** 2) * 5000);
    infoFase.textContent = faseAtual;
    if (bossAtual) {
        infoAsteroides.textContent = `Boss ${bossAtual.vida}/${bossAtual.vidaMax}`;
    } else if (faseAtual >= 10) {
        const derrotadas = totalNavesInimigasFase - navesInimigasRestantesFase - navesInimigas.length;
        infoAsteroides.textContent = `${asteroides.length}/${totalAsteroidesFase} | Naves ${Math.max(0, derrotadas)}/${totalNavesInimigasFase}`;
    } else {
        infoAsteroides.textContent = `${asteroides.length}/${totalAsteroidesFase}`;
    }
    atualizarInfoArma();
    atualizarInfoEfeitos();
    atualizarVisibilidadeHudSecundario();
}

// Remove uma vida e chama game over quando necessario.
function perderVida() {
    if (jogoAcabou || animacaoDestruicaoNave) return;

    vidas = Math.max(vidas - 1, 0);
    atualizarInfoJogo();

    if (vidas <= 0) {
        gameOverPendente = true;
    }

    iniciarAnimacaoDestruicaoNave();
}


// Mostra mensagens centrais na tela.
function exibirMensagem(texto) {
    areaMensagem.innerHTML = texto;
    areaMensagem.style.display = "block";
}

// Encerra a partida e mostra a opcao de reinicio.
function executarGameOver() {
    gameOverPendente = false;
    jogoAcabou = true;
    jogoPausado = false;
    faseEmTransicao = false;
    tempoRestanteTransicaoFase = 0;
    projetis = [];
    projeteisBoss = [];
    navesInimigas = [];
    asteroides = [];
    powerUps = [];
    particulasAsteroide = [];
    miniExplosoesMissil = [];
    animacoesExplosaoNavesInimigas = [];

    bossAtual = null;
    animacaoExplosaoBoss = null;
    espaconave.velocidade.x = 0;
    espaconave.velocidade.y = 0;
    resetarComandos();
    clearTimeout(timeoutMensagemTemporaria);
    areaMensagem.innerHTML = `Game Over! Pontuacao: ${pontuacao}.<br><button id="btnReiniciar">Jogar novamente</button><br><small>Ou pressione Enter</small>`;
    areaMensagem.style.display = "block";

    const botaoReiniciar = document.getElementById("btnReiniciar");
    if (botaoReiniciar) {
        botaoReiniciar.addEventListener("click", reiniciarJogo, { once: true });
    }

    clearTimeout(timerID);
}

// Reinicia todos os estados principais da partida.
function reiniciarJogo() {
    gameOverPendente = false;
    clearTimeout(timerID);
    clearTimeout(timeoutMensagemTemporaria);
    pontuacao = 0;
    vidas = 3;
    hpNave = HP_MAX_NAVE;
    ticks = CADENCIA_TIRO;
    tempoJogo = 0;
    jogoAcabou = false;
    jogoPausado = false;
    faseEmTransicao = false;
    tempoRestanteTransicaoFase = 0;
    projetis = [];
    projeteisBoss = [];
    navesInimigas = [];
    asteroides = [];
    powerUps = [];
    particulasAsteroide = [];
    miniExplosoesMissil = [];
    animacoesExplosaoNavesInimigas = [];
    municaoMissil = MAX_MISSEIS_NAVE;
    ticksMissilSecundario = ARMAS.missil.cadenciaFrames;
    bossAtual = null;
    animacaoExplosaoBoss = null;
    bossSpawnadoNaFase = false;
    bossDerrotadoNaFase = false;
    armaSelecionada = 'pulso';
    proximaVidaExtra = PONTOS_PARA_VIDA_EXTRA;
    efeitosAtivos = { escudo: 0, escudoReinicio: 0, tiroVelocidade: 0, cadencia: 0, velocidadeNave: 0 };
    hudSecundarioTemporizadores = { asteroides: 0, velocidade: 0, arma: 0, efeitos: 0 };
    animacaoDestruicaoNave = null;

    resetarComandos();
    areaMensagem.style.display = "none";
    areaMensagem.innerHTML = "";

    criarCenarioEspacialDaFase(1);
    deslocamentoParallaxNave = { x: 0, y: 0 };
    espaconave = new Nave(telaJogo.width / 2, telaJogo.height / 2);
    prepararFase(1);
    atualizarInfoJogo();
    executarLoop();
}

// Atualiza projeteis ativos e remove os que expiraram.
function atualizarProjetis(deltaTempo) {
    for (let i = projetis.length - 1; i >= 0; i--) {
        const projetil = projetis[i];
        projetil.atualizar(deltaTempo);
        if (projetil.tempoVida <= 0) {
            projetis.splice(i, 1);
        }
    }
}

// Mostra ou esconde o estado de pause pelo ESC.
function alternarPause() {
    if (jogoAcabou) return;

    jogoPausado = !jogoPausado;
    if (jogoPausado) {
        exibirMensagem("Jogo pausado<br><small>Pressione Esc para continuar</small>");
    } else if (!faseEmTransicao) {
        areaMensagem.style.display = "none";
        areaMensagem.innerHTML = "";
    }
}

// Loop principal: entrada, spawn, fisica, colisao e renderizacao.
function executarLoop() {
    const deltaTempo = FPS / 1000;

    if (jogoAcabou) {
        renderEstrelas();
        atualizarInfoJogo();
        return;
    }

    if (jogoPausado) {
        renderEstrelas();
        renderizarEntidades();
        atualizarInfoJogo();
        timerID = setTimeout(executarLoop, FPS);
        return;
    }

    tempoJogo += deltaTempo;
    tempoFase += deltaTempo;
    ticks++;
    atualizarVisibilidadeHudSecundario(deltaTempo);

    if (faseEmTransicao) {
        tempoRestanteTransicaoFase = Math.max(0, tempoRestanteTransicaoFase - deltaTempo);
        if (tempoRestanteTransicaoFase === 0) {
            faseEmTransicao = false;
            areaMensagem.style.display = "none";
            areaMensagem.innerHTML = "";
        }
    }

    if (!animacaoDestruicaoNave) {
        if (comandos.teclaA) espaconave.rotacionarEsq();
        if (comandos.teclaD) espaconave.rotacionarDir();
        if (comandos.teclaW) espaconave.acelerarAtual();
        if (comandos.teclaS) espaconave.desacelerarAtual();
        if (comandos.teclaSpace && !faseEmTransicao) espaconave.atirar();
    }

    atualizarSpawnerAsteroides();
    atualizarPowerUpsAtivos(deltaTempo);
    atualizarAnimacaoDestruicaoNave(deltaTempo);
    atualizarPowerUps(deltaTempo);
    atualizarProjetis(deltaTempo);
    ticksMissilSecundario++;
    atualizarProjeteisBoss(deltaTempo);
    atualizarParticulasAsteroide(deltaTempo);
    atualizarMiniExplosoesMissil(deltaTempo);
    atualizarExplosoesNavesInimigas(deltaTempo);
    atualizarExplosaoBoss(deltaTempo);
    atualizarBoss(deltaTempo);
    atualizarNavesInimigas(deltaTempo);
    const multiplicadorAsteroides = faseEmTransicao ? MULTIPLICADOR_CAMERA_LENTA_FASE : 1;
    asteroides.forEach((asteroide) => asteroide.atualizar(multiplicadorAsteroides));

    if (!faseEmTransicao) {
        if (!animacaoDestruicaoNave) {
            espaconave.atualizar();
            verificarColisoes();
        }
        verificarProgressoFase();
    }

    if (jogoAcabou) {
        renderEstrelas();
        atualizarInfoJogo();
        return;
    }

    renderEstrelas();
    renderizarEntidades();
    atualizarInfoJogo();
    timerID = setTimeout(executarLoop, FPS);
}

// Evento de tecla pressionada.
document.addEventListener('keydown', (tecla) => {
    if (tecla.code === 'KeyF' && painelInformacoesAberto) {
        alternarPainelInformacoesJogo(false);
        return;
    }

    if (tecla.code === 'Escape') {
        alternarPause();
        return;
    }

    if (jogoAcabou && tecla.code === 'Enter') {
        reiniciarJogo();
        return;
    }

    if (jogoPausado || painelInformacoesAberto) return;

    if (tecla.code === ARMAS.missil.tecla) {
        espaconave.atirarMissilSecundario();
        return;
    }

    if (selecionarArmaPorTecla(tecla.code)) {
        return;
    }

    switch (tecla.code) {
        case 'KeyA':
            comandos.teclaA = true;
            break;
        case 'KeyD':
            comandos.teclaD = true;
            break;
        case 'KeyW':
            comandos.teclaW = true;
            break;
        case 'KeyS':
            comandos.teclaS = true;
            break;
        case 'Space':
            comandos.teclaSpace = true;
            break;
    }
});

// Evento de tecla solta.
document.addEventListener("keyup", (tecla) => {
    switch (tecla.code) {
        case "KeyA":
            comandos.teclaA = false;
            break;
        case "KeyD":
            comandos.teclaD = false;
            break;
        case "KeyW":
            comandos.teclaW = false;
            break;
        case "KeyS":
            comandos.teclaS = false;
            break;
        case "Space":
            comandos.teclaSpace = false;
            break;
    }
});

// Atualiza apenas a exibicao do jogo quando a janela muda de tamanho.
window.addEventListener("resize", () => {
    configurarAreaJogo();
});

// Ponto oficial de entrada do jogo.
function iniciarJogo() {
    reiniciarJogo();
}

if (botaoInformacoesJogo) {
    botaoInformacoesJogo.addEventListener("click", () => alternarPainelInformacoesJogo());
}

iniciarJogo();