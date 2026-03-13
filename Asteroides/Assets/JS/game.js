// Referencias principais da interface do jogo.
const telaJogo = document.getElementById("telaJogo");
const ctxTela = telaJogo.getContext("2d");
const infoPontuacao = document.getElementById("infoPontuacao");
const infoVidas = document.getElementById("infoVidas");
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

// Quantidade total de estrelas usadas no fundo animado.
const NUM_ESTRELAS = 450;
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
const TEMPO_TRANSICAO_FASE = 1.4;
// Pontos necessarios para ganhar uma vida extra.
const PONTOS_PARA_VIDA_EXTRA = 1000;
// Chance base de um asteroide derrotado soltar power-up.
const CHANCE_POWERUP = 0.17;
// Tempo padrao dos power-ups temporarios em segundos.
const DURACAO_POWERUP = 9;

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
        tempoVida: 2.8,
        cadenciaFrames: 40,
        tiros: 1,
        spread: 0,
        dano: 3,
        perfurante: false,
        guiado: true,
        limiteSimultaneo: 2,
        cores: ["rgb(255, 150, 133)", "rgba(255, 88, 72, 0.96)", "rgba(255, 204, 164, 0.72)"]
    }
};

// Configuracao visual, logica e raridade dos power-ups coletaveis.
// Quanto maior o peso, mais comum e o item no sorteio.
const TIPOS_POWERUP = {
    tiroVelocidade: { nome: "Tiro Rapido", cor: "#ffd166", pesoRaridade: 34, raridade: "Comum" },
    cadencia: { nome: "Cadencia", cor: "#b2ff59", pesoRaridade: 28, raridade: "Incomum" },
    velocidadeNave: { nome: "Turbo", cor: "#ff9f43", pesoRaridade: 20, raridade: "Raro" },
    escudo: { nome: "Escudo", cor: "#6be7ff", pesoRaridade: 12, raridade: "Epico" },
    vida: { nome: "Vida", cor: "#ff6b9a", pesoRaridade: 6, raridade: "Lendario" }
};

// Estado geral da partida.
let pontuacao = 0;
let vidas = 3;
let ticks = CADENCIA_TIRO;
let jogoAcabou = false;
let jogoPausado = false;
let timerID;
let timeoutMensagemTemporaria;
let estrelas = [];
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
let efeitosAtivos = { escudo: 0, tiroVelocidade: 0, cadencia: 0, velocidadeNave: 0 };
let hudSecundarioTemporizadores = { asteroides: 0, velocidade: 0, arma: 0, efeitos: 0 };

// Estado das teclas usadas no controle.
const comandos = { teclaA: false, teclaD: false, teclaW: false, teclaS: false, teclaSpace: false };

telaJogo.width = window.innerWidth;
telaJogo.height = window.innerHeight;

// Classe da nave do jogador.
class Nave {
    // Define estado inicial da nave.
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidade = { x: 0, y: 0 };
        this.angulo = -Math.PI / 2;
        this.raio = TAMANHO_NAVE / 2;
        this.estaAcelerando = false;
        this.compriChama = 0;
    }

    // Rotaciona a nave para a esquerda.
    rotacionarEsq() {
        this.angulo -= ANGULO_ROTACAO;
    }

    // Rotaciona a nave para a direita.
    rotacionarDir() {
        this.angulo += ANGULO_ROTACAO;
    }

    // Acelera a nave na direcao atual.
    acelerarAtual() {
        const aceleracao = VELOCIDADE_NAVE * obterMultiplicadorVelocidadeNave();
        this.velocidade.x += aceleracao * Math.cos(this.angulo);
        this.velocidade.y += aceleracao * Math.sin(this.angulo);
        this.estaAcelerando = true;
        this.velocidade.x *= 0.99;
        this.velocidade.y *= 0.99;
    }

    // Aplica freio no sentido contrario.
    desacelerarAtual() {
        const freio = VELOCIDADE_NAVE * obterMultiplicadorVelocidadeNave();
        this.velocidade.x -= freio * Math.cos(this.angulo);
        this.velocidade.y -= freio * Math.sin(this.angulo);
        this.velocidade.x *= 0.9;
        this.velocidade.y *= 0.9;
    }

    // Dispara usando a arma atualmente selecionada.
    atirar() {
        const arma = ARMAS[armaSelecionada];
        if (!arma) return;
        if (projetis.length >= MAX_PROJETEIS) return;

        // Cadencia base da arma combinada com o buff temporario de tiro.
        const cadenciaAtual = Math.max(4, Math.floor(arma.cadenciaFrames * obterMultiplicadorCadencia()));
        if (ticks < cadenciaAtual) return;

        if (arma.guiado) {
            const misseisAtivos = projetis.filter((projetil) => projetil.guiado).length;
            if (misseisAtivos >= arma.limiteSimultaneo) return;
        }

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

    // Volta a nave para o centro da tela.
    reiniciarPosicao() {
        this.x = telaJogo.width / 2;
        this.y = telaJogo.height / 2;
        this.velocidade.x = 0;
        this.velocidade.y = 0;
        this.angulo = -Math.PI / 2;
        this.estaAcelerando = false;
        this.compriChama = 0;
    }

    // Atualiza movimento e rotacao da nave.
    atualizar() {
        this.velocidade.x *= FRICCAO;
        this.velocidade.y *= FRICCAO;
        this.x += this.velocidade.x;
        this.y += this.velocidade.y;

        if (this.estaAcelerando) {
            this.compriChama = Math.min(this.compriChama + 3, TAMANHO_NAVE * 2);
        } else {
            this.compriChama = Math.max(this.compriChama - 1, 0);
        }

        this.x = ajustarCoordenada(this.x, telaJogo.width);
        this.y = ajustarCoordenada(this.y, telaJogo.height);
        this.estaAcelerando = false;
    }
    // Renderiza a nave com chama e escudo quando ativo.
    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);

        if (this.compriChama > 0) {
            const traseiraNave = -this.raio;
            const variacao = 0.9 + Math.random() * 0.3;
            const tamanhoChama = this.compriChama * variacao;

            const gradInterno = ctxTela.createRadialGradient(traseiraNave, 0, tamanhoChama * 0.05, traseiraNave, 0, tamanhoChama * 0.4);
            gradInterno.addColorStop(0, "rgba(255, 150, 0, 0.8)");
            gradInterno.addColorStop(1, "rgba(255, 0, 0, 0.3)");

            const gradExterno = ctxTela.createRadialGradient(traseiraNave, 0, tamanhoChama * 0.1, traseiraNave, 0, tamanhoChama * 0.4);
            gradExterno.addColorStop(0, "rgba(255, 255, 255, 0.8)");
            gradExterno.addColorStop(1, "rgba(255, 208, 0, 0.79)");

            [[TAMANHO_NAVE / 4, 0.9, gradInterno], [TAMANHO_NAVE / 6, 0.5, gradExterno]].forEach(([altura, multiplicador, estilo]) => {
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
        ctxTela.moveTo(TAMANHO_NAVE / 2, 0);
        ctxTela.lineTo(-TAMANHO_NAVE / 2, -TAMANHO_NAVE / 3);
        ctxTela.lineTo(-TAMANHO_NAVE / 2, TAMANHO_NAVE / 3);
        ctxTela.closePath();
        ctxTela.fillStyle = "rgba(0, 0, 0, 0)";
        ctxTela.strokeStyle = "#ff1e00";
        ctxTela.lineWidth = 1.5;
        ctxTela.stroke();
        ctxTela.fill();
        ctxTela.restore();

        // O escudo temporario desenha um anel pulsante ao redor da nave.
        if (efeitosAtivos.escudo > 0) {
            const pulso = 0.35 + (Math.sin(tempoJogo * 8) + 1) * 0.12;
            ctxTela.beginPath();
            ctxTela.arc(this.x, this.y, this.raio + 8 + pulso * 4, 0, Math.PI * 2);
            ctxTela.strokeStyle = `rgba(107, 231, 255, ${0.55 + pulso * 0.4})`;
            ctxTela.lineWidth = 3;
            ctxTela.stroke();
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

    // O missil teleguiado procura o asteroide mais proximo.
    adquirirAlvo() {
        if (!this.guiado || asteroides.length === 0) return;

        let menorDistancia = Infinity;
        let alvoMaisProximo = null;

        asteroides.forEach((asteroide) => {
            const distancia = Math.hypot(asteroide.x - this.x, asteroide.y - this.y);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                alvoMaisProximo = asteroide;
            }
        });

        this.alvo = alvoMaisProximo;
    }

    // Atualiza deslocamento e corrige rota quando o tiro e guiado.
    atualizar(deltaTempo) {
        if (this.guiado) {
            if (!this.alvo || !asteroides.includes(this.alvo)) {
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
            ctxTela.strokeStyle = "rgba(255, 196, 135, 0.7)";
            ctxTela.lineWidth = 2;
            ctxTela.stroke();
        }

        ctxTela.restore();
    }
}

// Classe dos power-ups coletaveis que ficam boiando na tela.
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
        ctxTela.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctxTela.lineWidth = 2;
        ctxTela.stroke();
        ctxTela.restore();
    }
}

// Classe dos asteroides inimigos com suporte a subtipos.
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
    atualizar() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.angulo += this.velocRotacao;
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

// Aplica o efeito do power-up coletado pela nave.
function aplicarPowerUp(tipo) {
    ativarHudSecundario("efeitos", 4.5);
    switch (tipo) {
        case "escudo":
            efeitosAtivos.escudo = 8;
            mostrarMensagemTemporaria("Escudo ativado!<br><small>Voce esta protegido por alguns segundos</small>");
            break;
        case "tiroVelocidade":
            efeitosAtivos.tiroVelocidade = DURACAO_POWERUP;
            mostrarMensagemTemporaria("Tiros acelerados!<br><small>Projetis estao mais velozes</small>");
            break;
        case "vida":
            vidas++;
            mostrarMensagemTemporaria("Vida coletada!<br><small>Voce ganhou +1 vida</small>");
            break;
        case "cadencia":
            efeitosAtivos.cadencia = DURACAO_POWERUP;
            mostrarMensagemTemporaria("Cadencia aumentada!<br><small>Voce atira mais rapido</small>");
            break;
        case "velocidadeNave":
            efeitosAtivos.velocidadeNave = DURACAO_POWERUP;
            mostrarMensagemTemporaria("Turbo ativado!<br><small>A nave esta mais agil</small>");
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
    while (pontuacao >= proximaVidaExtra) {
        vidas++;
        proximaVidaExtra += PONTOS_PARA_VIDA_EXTRA;
        mostrarMensagemTemporaria(`Vida extra conquistada!<br><small>${vidas} vidas disponiveis</small>`);
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

    const offsetX = espaconave ? (espaconave.x - telaJogo.width / 2) : 0;
    const offsetY = espaconave ? (espaconave.y - telaJogo.height / 2) : 0;

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
function renderizarEntidades() {
    powerUps.forEach((powerUp) => powerUp.renderizar());
    projetis.forEach((projetil) => projetil.renderizar());
    asteroides.forEach((asteroide) => asteroide.renderizar());
    if (espaconave) {
        espaconave.renderizar();
    }
}

// Calcula o limite maximo de asteroides por fase.
function calcularMaxAsteroidesPorFase(fase) {
    return Math.min(15 + (fase - 1) * 5, 50);
}

// Define quantos asteroides a fase precisa gerar no total.
function calcularTotalAsteroidesDaFase(fase) {
    const maxFase = calcularMaxAsteroidesPorFase(fase);
    return Math.min(maxFase + 4 + Math.floor(fase * 1.5), 70);
}

// Quantidade inicial que ja nasce em tela no inicio da fase.
function calcularSpawnInicialDaFase() {
    const quantidade = 3 + Math.floor(Math.random() * 3);
    return Math.min(quantidade, totalAsteroidesFase, calcularMaxAsteroidesPorFase(faseAtual));
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
    const mostrarAsteroides = hudSecundarioTemporizadores.asteroides > 0 || faseEmTransicao;
    const mostrarArma = hudSecundarioTemporizadores.arma > 0;
    const mostrarEfeitos = hudSecundarioTemporizadores.efeitos > 0 || Object.values(efeitosAtivos).some((valor) => valor > 0);

    if (hudVelocidadeSecundario) hudVelocidadeSecundario.classList.toggle("ativa", mostrarVelocidade);
    if (hudAsteroidesSecundario) hudAsteroidesSecundario.classList.toggle("ativa", mostrarAsteroides);
    if (hudArmaSecundario) hudArmaSecundario.classList.toggle("ativa", mostrarArma);
    if (hudEfeitosSecundario) hudEfeitosSecundario.classList.toggle("ativa", mostrarEfeitos);
}

// Atualiza no HUD o nome da arma selecionada.
function atualizarInfoArma() {
    infoArma.textContent = ARMAS[armaSelecionada].nome;
}

// Atualiza no HUD a lista de efeitos temporarios ativos.
function atualizarInfoEfeitos() {
    const ativos = [];
    if (efeitosAtivos.escudo > 0) ativos.push(`Escudo ${efeitosAtivos.escudo.toFixed(1)}s`);
    if (efeitosAtivos.tiroVelocidade > 0) ativos.push(`Tiro ${efeitosAtivos.tiroVelocidade.toFixed(1)}s`);
    if (efeitosAtivos.cadencia > 0) ativos.push(`Cadencia ${efeitosAtivos.cadencia.toFixed(1)}s`);
    if (efeitosAtivos.velocidadeNave > 0) ativos.push(`Turbo ${efeitosAtivos.velocidadeNave.toFixed(1)}s`);
    infoEfeitos.textContent = ativos.length > 0 ? ativos.join(" | ") : "Nenhum";
}

// Troca a arma ativa pelas teclas 1, 2, 3, 4 e R.
function selecionarArmaPorTecla(codigoTecla) {
    const arma = Object.entries(ARMAS).find(([, config]) => config.tecla === codigoTecla);
    if (!arma) return false;
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
function mostrarMensagemTemporaria(texto, duracaoMs = 900) {
    clearTimeout(timeoutMensagemTemporaria);
    exibirMensagem(texto);

    timeoutMensagemTemporaria = setTimeout(() => {
        if (!jogoAcabou && !faseEmTransicao && !jogoPausado) {
            areaMensagem.style.display = "none";
            areaMensagem.innerHTML = "";
        }
    }, duracaoMs);
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
    totalAsteroidesFase = calcularTotalAsteroidesDaFase(faseAtual);
    asteroidesDestruidosFase = 0;
    asteroidesGeradosFase = 0;
    proximoSpawnAsteroide = 0;
    asteroides = [];
    projetis = [];
    powerUps = [];
    faseEmTransicao = true;
    tempoRestanteTransicaoFase = TEMPO_TRANSICAO_FASE;
    espaconave.reiniciarPosicao();
    resetarComandos();

    const spawnInicial = calcularSpawnInicialDaFase();
    registrarAsteroideGerado(spawnInicial);
    proximoSpawnAsteroide = tempoJogo + calcularIntervaloSpawn();

    exibirMensagem(`Fase ${faseAtual}<br><small>${totalAsteroidesFase} asteroides nesta fase</small><br><small>${obterNovidadeDaFase(faseAtual)}</small>`);
}

// Continua gerando asteroides ate completar o total da fase.
function atualizarSpawnerAsteroides() {
    if (faseEmTransicao || jogoAcabou || jogoPausado) return;
    if (tempoJogo < proximoSpawnAsteroide) return;
    if (asteroidesGeradosFase >= totalAsteroidesFase) return;

    const maxAsteroidesFase = calcularMaxAsteroidesPorFase(faseAtual);
    if (asteroides.length >= maxAsteroidesFase) return;

    const quantidade = Math.min(1 + Math.floor(faseAtual / 5), maxAsteroidesFase - asteroides.length, totalAsteroidesFase - asteroidesGeradosFase);
    registrarAsteroideGerado(quantidade);
    proximoSpawnAsteroide = tempoJogo + calcularIntervaloSpawn();
}

// Subtipo fragmentado pode se dividir em asteroides rapidos menores.
function gerarFragmentosAsteroide(asteroideOriginal) {
    if (asteroideOriginal.subtipo !== "fragmentado") return [];
    if (asteroideOriginal.tamanho < 42) return [];

    const fragmentos = [];
    const quantidade = 2;
    const maxAsteroidesFase = calcularMaxAsteroidesPorFase(faseAtual);
    const vagasDisponiveis = Math.max(0, maxAsteroidesFase - asteroides.length);
    const totalPermitido = Math.min(quantidade, vagasDisponiveis);

    for (let i = 0; i < totalPermitido; i++) {
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

    if (!projetil.perfurante) {
        projetis.splice(indiceProjetil, 1);
    }

    if (asteroide.vida > 0) {
        return;
    }

    const posicaoAsteroide = { x: asteroide.x, y: asteroide.y };
    asteroides.splice(indiceAsteroide, 1);
    pontuacao += asteroide.configuracao.pontos;
    asteroidesDestruidosFase++;
    ativarHudSecundario("asteroides", 3.5);
    verificarVidaExtra();
    criarPowerUp(posicaoAsteroide.x, posicaoAsteroide.y);

    const fragmentos = gerarFragmentosAsteroide(asteroide);
    if (fragmentos.length > 0) {
        asteroides.push(...fragmentos);
    }
}

// Verifica colisao entre projetis, asteroides, power-ups e a nave.
function verificarColisoes() {
    for (let i = projetis.length - 1; i >= 0; i--) {
        const projetil = projetis[i];
        for (let j = asteroides.length - 1; j >= 0; j--) {
            const asteroide = asteroides[j];
            if (asteroide.colideComCirculo(projetil.x, projetil.y, projetil.raio)) {
                aplicarDanoNoAsteroide(asteroide, j, projetil, i);
                break;
            }
        }
    }

    for (let j = asteroides.length - 1; j >= 0; j--) {
        const asteroide = asteroides[j];
        if (asteroide.colideComCirculo(espaconave.x, espaconave.y, espaconave.raio * 0.8)) {
            asteroides.splice(j, 1);

            if (efeitosAtivos.escudo > 0) {
                efeitosAtivos.escudo = 0;
                mostrarMensagemTemporaria("Escudo consumido!<br><small>Voce bloqueou um impacto</small>");
                return;
            }

            perderVida();
            break;
        }
    }
}

// Avanca de fase quando tudo ja foi gerado e a tela esta limpa.
function verificarProgressoFase() {
    if (faseEmTransicao || jogoAcabou) return;

    const concluiuFase = asteroidesGeradosFase >= totalAsteroidesFase && asteroides.length === 0;
    if (concluiuFase) {
        prepararFase(faseAtual + 1);
    }
}

// Atualiza pontuacao, vidas, fase, velocidade, contador e arma no HUD.
function atualizarInfoJogo() {
    infoPontuacao.textContent = pontuacao;
    infoVidas.textContent = vidas;
    infoVelocidade.textContent = Math.round(Math.sqrt(espaconave.velocidade.x ** 2 + espaconave.velocidade.y ** 2) * 5000);
    infoFase.textContent = faseAtual;
    infoAsteroides.textContent = `${asteroides.length}/${calcularMaxAsteroidesPorFase(faseAtual)}`;
    atualizarInfoArma();
    atualizarInfoEfeitos();
    atualizarVisibilidadeHudSecundario();
}

// Remove uma vida e chama game over quando necessario.
function perderVida() {
    if (jogoAcabou) return;

    vidas = Math.max(vidas - 1, 0);
    atualizarInfoJogo();

    if (vidas <= 0) {
        executarGameOver();
    } else {
        espaconave.reiniciarPosicao();
        resetarComandos();
    }
}

// Mostra mensagens centrais na tela.
function exibirMensagem(texto) {
    areaMensagem.innerHTML = texto;
    areaMensagem.style.display = "block";
}

// Encerra a partida e mostra a opcao de reinicio.
function executarGameOver() {
    jogoAcabou = true;
    jogoPausado = false;
    faseEmTransicao = false;
    tempoRestanteTransicaoFase = 0;
    projetis = [];
    asteroides = [];
    powerUps = [];
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
    clearTimeout(timerID);
    clearTimeout(timeoutMensagemTemporaria);
    pontuacao = 0;
    vidas = 3;
    ticks = CADENCIA_TIRO;
    tempoJogo = 0;
    jogoAcabou = false;
    jogoPausado = false;
    faseEmTransicao = false;
    tempoRestanteTransicaoFase = 0;
    projetis = [];
    asteroides = [];
    powerUps = [];
    armaSelecionada = "pulso";
    proximaVidaExtra = PONTOS_PARA_VIDA_EXTRA;
    efeitosAtivos = { escudo: 0, tiroVelocidade: 0, cadencia: 0, velocidadeNave: 0 };
    hudSecundarioTemporizadores = { asteroides: 0, velocidade: 0, arma: 0, efeitos: 0 };

    resetarComandos();
    areaMensagem.style.display = "none";
    areaMensagem.innerHTML = "";

    criarEstrelas();
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

    if (comandos.teclaA) espaconave.rotacionarEsq();
    if (comandos.teclaD) espaconave.rotacionarDir();
    if (comandos.teclaW) espaconave.acelerarAtual();
    if (comandos.teclaS) espaconave.desacelerarAtual();
    if (comandos.teclaSpace && !faseEmTransicao) espaconave.atirar();

    atualizarSpawnerAsteroides();
    atualizarPowerUpsAtivos(deltaTempo);
    atualizarPowerUps(deltaTempo);
    atualizarProjetis(deltaTempo);
    asteroides.forEach((asteroide) => asteroide.atualizar());

    if (!faseEmTransicao) {
        espaconave.atualizar();
        verificarColisoes();
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
document.addEventListener("keydown", (tecla) => {
    if (tecla.code === "Escape") {
        alternarPause();
        return;
    }

    if (jogoAcabou && tecla.code === "Enter") {
        reiniciarJogo();
        return;
    }

    if (jogoPausado) return;

    if (selecionarArmaPorTecla(tecla.code)) {
        return;
    }

    switch (tecla.code) {
        case "KeyA":
            comandos.teclaA = true;
            break;
        case "KeyD":
            comandos.teclaD = true;
            break;
        case "KeyW":
            comandos.teclaW = true;
            break;
        case "KeyS":
            comandos.teclaS = true;
            break;
        case "Space":
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

// Atualiza o canvas quando a janela muda de tamanho.
window.addEventListener("resize", () => {
    telaJogo.width = window.innerWidth;
    telaJogo.height = window.innerHeight;
    criarEstrelas();
    if (espaconave) {
        espaconave.reiniciarPosicao();
    }
});

// Ponto oficial de entrada do jogo.
function iniciarJogo() {
    reiniciarJogo();  
}

iniciarJogo();