// Referencias principais da interface do jogo.
const telaJogo = document.getElementById("telaJogo");
const ctxTela = telaJogo.getContext("2d");
const infoPontuacao = document.getElementById("infoPontuacao");
const infoVidas = document.getElementById("infoVidas");
const infoVelocidade = document.getElementById("infoVelocidade");
const infoFase = document.getElementById("infoFase");
const infoAsteroides = document.getElementById("infoAsteroides");
const infoArma = document.getElementById("infoArma");
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
        cores: [
            "rgb(67, 3, 187)",
            "rgba(3, 164, 228, 0.9)",
            "rgba(118, 0, 141, 0.8)"
        ]
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
        cores: [
            "rgb(28, 229, 255)",
            "rgba(22, 168, 255, 0.95)",
            "rgba(117, 230, 255, 0.75)"
        ]
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
        cores: [
            "rgb(255, 110, 219)",
            "rgba(255, 51, 180, 0.95)",
            "rgba(255, 173, 234, 0.75)"
        ]
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
        cores: [
            "rgb(255, 242, 151)",
            "rgba(255, 187, 0, 0.95)",
            "rgba(255, 247, 211, 0.65)"
        ]
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
        cores: [
            "rgb(255, 150, 133)",
            "rgba(255, 88, 72, 0.96)",
            "rgba(255, 204, 164, 0.72)"
        ]
    }
};

// Estado geral da partida.
let pontuacao = 0;
let vidas = 3;
let ticks = CADENCIA_TIRO;
let jogoAcabou = false;
let timerID;
let estrelas = [];
let projetis = [];
let asteroides = [];
let espaconave;
let tempoJogo = 0;
let multiplicadorVelocidade = 1;
let faseAtual = 1;
let totalAsteroidesFase = 0;
let asteroidesDestruidosFase = 0;
let asteroidesGeradosFase = 0;
let proximoSpawnAsteroide = 0;
let faseEmTransicao = false;
let armaSelecionada = "pulso";
let proximaVidaExtra = PONTOS_PARA_VIDA_EXTRA;

// Estado das teclas usadas no controle.
const comandos = {
    teclaA: false,
    teclaD: false,
    teclaW: false,
    teclaS: false,
    teclaSpace: false
};

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
        const aceleracao = VELOCIDADE_NAVE * multiplicadorVelocidade;
        this.velocidade.x += aceleracao * Math.cos(this.angulo);
        this.velocidade.y += aceleracao * Math.sin(this.angulo);
        this.estaAcelerando = true;
        this.velocidade.x *= 0.99;
        this.velocidade.y *= 0.99;
    }

    // Aplica freio no sentido contrario.
    desacelerarAtual() {
        const freio = VELOCIDADE_NAVE * multiplicadorVelocidade;
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
        if (ticks < arma.cadenciaFrames) return;

        if (arma.guiado) {
            const misseisAtivos = projetis.filter((projetil) => projetil.guiado).length;
            if (misseisAtivos >= arma.limiteSimultaneo) return;
        }

        const quantidade = Math.min(arma.tiros, MAX_PROJETEIS - projetis.length);
        for (let i = 0; i < quantidade; i++) {
            const deslocamento = quantidade === 1 ? 0 : i - (quantidade - 1) / 2;
            const anguloTiro = this.angulo + deslocamento * arma.spread;
            const velocidade = arma.velocidade + (Math.random() * 0.35 - 0.175);

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

    // Atualiza movimento e rotacao do asteroide.
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

    // Renderiza o asteroide usando as cores do subtipo.
    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);

        if (this.compriChama > 0) {
            const traseiraNave = -this.raio;
            const variacao = 0.9 + Math.random() * 0.3;
            const tamanhoChama = this.compriChama * variacao;

            const gradInterno = ctxTela.createRadialGradient(
                traseiraNave,
                0,
                tamanhoChama * 0.05,
                traseiraNave,
                0,
                tamanhoChama * 0.4
            );
            gradInterno.addColorStop(0, "rgba(255, 150, 0, 0.8)");
            gradInterno.addColorStop(1, "rgba(255, 0, 0, 0.3)");

            const gradExterno = ctxTela.createRadialGradient(
                traseiraNave,
                0,
                tamanhoChama * 0.1,
                traseiraNave,
                0,
                tamanhoChama * 0.4
            );
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
        this.vel = {
            x: velX * this.configuracao.velocidade,
            y: velY * this.configuracao.velocidade
        };
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
            vertices.push({
                x: Math.cos(anguloVertice) * raioVertice,
                y: Math.sin(anguloVertice) * raioVertice
            });
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
        const pontoLocal = {
            x: dx * cos - dy * sin,
            y: dx * sin + dy * cos
        };

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
            vida: 1
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
            vida: 2
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
            vida: 1
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

// Atualiza no HUD o nome da arma selecionada.
function atualizarInfoArma() {
    infoArma.textContent = ARMAS[armaSelecionada].nome;
}

// Troca a arma ativa pelas teclas 1, 2, 3, 4 e R.
function selecionarArmaPorTecla(codigoTecla) {
    const arma = Object.entries(ARMAS).find(([, config]) => config.tecla === codigoTecla);
    if (!arma) return false;

    armaSelecionada = arma[0];
    atualizarInfoArma();
    return true;
}

function verificarVidaExtra() {
    while (pontuacao >= proximaVidaExtra) {
        vidas++;
        proximaVidaExtra += PONTOS_PARA_VIDA_EXTRA;
        exibirMensagem(`Vida extra conquistada!<br><small>${vidas} vidas disponiveis</small>`);

        setTimeout(() => {
            if (!jogoAcabou && !faseEmTransicao) {
                areaMensagem.style.display = "none";
                areaMensagem.innerHTML = "";
            }
        }, 900);
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
        const intersecta = ((yi > ponto.y) !== (yj > ponto.y))
            && (ponto.x < (xj - xi) * (ponto.y - yi) / ((yj - yi) || 0.0001) + xi);
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

// Define o limite maximo de asteroides em tela por fase.
function calcularMaxAsteroidesPorFase(fase) {
    return Math.min(15 + (fase - 1) * 5, 50);
}

// Define o total de asteroides que a fase precisa gerar.
function calcularTotalAsteroidesDaFase(fase) {
    return calcularMaxAsteroidesPorFase(fase);
}

// Calcula o tempo entre spawns e retorna em segundos.
function calcularIntervaloSpawn() {
    const intervaloMs = Math.min(2200, 650 + (faseAtual - 1) * 140);
    return intervaloMs / 1000;
}

// Define quantos asteroides entram logo no inicio da fase.
function calcularSpawnInicialDaFase() {
    return Math.min(3 + Math.floor((faseAtual - 1) / 2), 5, totalAsteroidesFase);
}

// Escolhe o subtipo disponivel de acordo com a fase atual.
function escolherSubtipoAsteroide() {
    const opcoes = [{ tipo: "padrao", peso: 100 }];
    if (faseAtual >= 2) opcoes.push({ tipo: "rapido", peso: Math.min(35, 10 + faseAtual * 3) });
    if (faseAtual >= 3) opcoes.push({ tipo: "pesado", peso: Math.min(30, 8 + faseAtual * 2) });
    if (faseAtual >= 4) opcoes.push({ tipo: "fragmentado", peso: Math.min(26, 6 + faseAtual * 2) });

    const pesoTotal = opcoes.reduce((total, opcao) => total + opcao.peso, 0);
    let sorteio = Math.random() * pesoTotal;

    for (const opcao of opcoes) {
        sorteio -= opcao.peso;
        if (sorteio <= 0) return opcao.tipo;
    }

    return "padrao";
}

// Informa na mensagem de fase qual subtipo acabou de ser liberado.
function obterNovidadeDaFase(fase) {
    if (fase === 2) return "Novo subtipo: rapido (azul)";
    if (fase === 3) return "Novo subtipo: pesado (laranja)";
    if (fase === 4) return "Novo subtipo: fragmentado (verde)";
    return "Subtipos liberados continuam ativos";
}

// Cria um asteroide fora da tela e aponta aproximadamente para a nave.
function criarAsteroideAleatorio(subtipo = escolherSubtipoAsteroide()) {
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
function registrarAsteroideGerado(quantidade, subtipo) {
    for (let i = 0; i < quantidade; i++) {
        asteroides.push(criarAsteroideAleatorio(subtipo));
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
    faseEmTransicao = true;
    espaconave.reiniciarPosicao();
    resetarComandos();

    const spawnInicial = calcularSpawnInicialDaFase();
    registrarAsteroideGerado(spawnInicial);
    proximoSpawnAsteroide = tempoJogo + calcularIntervaloSpawn();

    exibirMensagem(`Fase ${faseAtual}<br><small>${totalAsteroidesFase} asteroides nesta fase</small><br><small>${obterNovidadeDaFase(faseAtual)}</small>`);
    setTimeout(() => {
        if (!jogoAcabou) {
            faseEmTransicao = false;
            areaMensagem.style.display = "none";
            areaMensagem.innerHTML = "";
        }
    }, TEMPO_TRANSICAO_FASE * 1000);
}

// Continua gerando asteroides ate completar o total da fase.
function atualizarSpawnerAsteroides() {
    if (faseEmTransicao || jogoAcabou) return;
    if (tempoJogo < proximoSpawnAsteroide) return;
    if (asteroidesGeradosFase >= totalAsteroidesFase) return;

    const maxAsteroidesFase = calcularMaxAsteroidesPorFase(faseAtual);
    if (asteroides.length >= maxAsteroidesFase) return;

    const quantidade = Math.min(
        1 + Math.floor(faseAtual / 5),
        maxAsteroidesFase - asteroides.length,
        totalAsteroidesFase - asteroidesGeradosFase
    );

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
        fragmentos.push(new Asteroide(
            asteroideOriginal.x,
            asteroideOriginal.y,
            asteroideOriginal.tamanho * 0.55,
            Math.cos(angulo) * velocidade,
            Math.sin(angulo) * velocidade,
            "rapido"
        ));
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

    asteroides.splice(indiceAsteroide, 1);
    pontuacao += asteroide.configuracao.pontos;
    asteroidesDestruidosFase++;
    verificarVidaExtra();

    const fragmentos = gerarFragmentosAsteroide(asteroide);
    if (fragmentos.length > 0) {
        asteroides.push(...fragmentos);
    }
}

// Verifica colisao entre projetis, asteroides e a nave.
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
            perderVida();
            break;
        }
    }
}

// Avanca de fase quando tudo ja foi gerado e a tela esta limpa.
function verificarProgressoFase() {
    if (faseEmTransicao || jogoAcabou) return;

    const concluiuFase = asteroidesGeradosFase >= totalAsteroidesFase
        && asteroides.length === 0;

    if (concluiuFase) {
        prepararFase(faseAtual + 1);
    }
}

// Atualiza pontuacao, vidas, fase, velocidade, contador e arma no HUD.
function atualizarInfoJogo() {
    infoPontuacao.textContent = pontuacao;
    infoVidas.textContent = vidas;
    infoVelocidade.textContent = Math.round(
        Math.sqrt(espaconave.velocidade.x ** 2 + espaconave.velocidade.y ** 2) * 5000
    );
    infoFase.textContent = faseAtual;
    infoAsteroides.textContent = `${asteroides.length}/${calcularMaxAsteroidesPorFase(faseAtual)}`;
    atualizarInfoArma();
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
    espaconave.velocidade.x = 0;
    espaconave.velocidade.y = 0;
    resetarComandos();
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
    pontuacao = 0;
    vidas = 3;
    ticks = CADENCIA_TIRO;
    tempoJogo = 0;
    jogoAcabou = false;
    multiplicadorVelocidade = 1;
    faseEmTransicao = false;
    projetis = [];
    asteroides = [];
    armaSelecionada = "pulso";
    proximaVidaExtra = PONTOS_PARA_VIDA_EXTRA;

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

// Loop principal: entrada, spawn, fisica, colisao e renderizacao.
function executarLoop() {
    if (jogoAcabou) {
        renderEstrelas();
        atualizarInfoJogo();
        return;
    }

    const deltaTempo = FPS / 1000;
    tempoJogo += deltaTempo;
    ticks++;

    if (comandos.teclaA) espaconave.rotacionarEsq();
    if (comandos.teclaD) espaconave.rotacionarDir();
    if (comandos.teclaW) espaconave.acelerarAtual();
    if (comandos.teclaS) espaconave.desacelerarAtual();
    if (comandos.teclaSpace && !faseEmTransicao) espaconave.atirar();

    atualizarSpawnerAsteroides();
    atualizarProjetis(deltaTempo);
    asteroides.forEach((asteroide) => asteroide.atualizar());

    if (!faseEmTransicao) {
        espaconave.atualizar();
        verificarColisoes();
        verificarProgressoFase();
    }

    renderEstrelas();
    projetis.forEach((projetil) => projetil.renderizar());
    asteroides.forEach((asteroide) => asteroide.renderizar());
    espaconave.renderizar();

    atualizarInfoJogo();
    timerID = setTimeout(executarLoop, FPS);
}

// Evento de tecla pressionada.
document.addEventListener("keydown", (tecla) => {
    if (selecionarArmaPorTecla(tecla.code)) {
        return;
    }

    if (jogoAcabou && tecla.code === "Enter") {
        reiniciarJogo();
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
    criarEstrelas();
    espaconave = new Nave(telaJogo.width / 2, telaJogo.height / 2);
    reiniciarJogo();
}

iniciarJogo();