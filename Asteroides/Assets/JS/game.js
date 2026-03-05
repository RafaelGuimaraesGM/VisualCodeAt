// Declaração de elementos
const telaJogo = document.getElementById("telaJogo");
const ctxTela = telaJogo.getContext("2d");

// Variáveis do jogo
const NUM_ESTRELAS = 3000;
const TAMANHO_NAVE = 40;
const ANGULO_ROTACAO = 0.1;
const VELOCIDADE_NAVE = 0.1;
const FRICCAO = 0.99;
const VELOCIDADE_PROJETIL = 10;

var estrelas = [];
var projetis = [];
var asteroides = [];

var espaconave;
var multiplicadorVelocidade = 1;
var comandos = {
    teclaA: false,
    teclaD: false,
    teclaW: false,
    teclaS: false,
    teclaSpace: false
};

telaJogo.width = window.innerWidth;
telaJogo.height = window.innerHeight;

// classes
class Nave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidade = { x: 0, y: 0 };
        this.angulo = -Math.PI / 2; // Ângulo inicial para apontar para cima
        this.raio = TAMANHO_NAVE / 2;
        this.estaAcelerando = false;
        this.compriChama = 0;
    }

    rotacionarEsq() {
        this.angulo += ANGULO_ROTACAO * -1;
    }

    rotacionarDir() {
        this.angulo += ANGULO_ROTACAO * 1;
    }

    acelerarAtual() {
        let acelerarAtual = VELOCIDADE_NAVE * multiplicadorVelocidade;

        this.velocidade.x += acelerarAtual * Math.cos(this.angulo);
        this.velocidade.y += acelerarAtual * Math.sin(this.angulo);
        this.estaAcelerando = true;

        this.velocidade.x *= 0.99;
        this.velocidade.y *= 0.99;
    }

    desacelerarAtual() {
        let freioAtual = VELOCIDADE_NAVE * multiplicadorVelocidade;

        this.velocidade.x -= freioAtual * Math.cos(this.angulo);
        this.velocidade.y -= freioAtual * Math.sin(this.angulo);

        this.velocidade.x *= 0.90;
        this.velocidade.y *= 0.90;
    }

    atirar() {
        projetis.push(new Projetil(
            this.x, this.y,
            VELOCIDADE_PROJETIL * Math.cos(this.angulo),
            VELOCIDADE_PROJETIL * Math.sin(this.angulo)
        ));
    }

    atualizar() {
        this.velocidade.x *= FRICCAO;
        this.velocidade.y *= FRICCAO;

        this.x += this.velocidade.x;
        this.y += this.velocidade.y;

        // se estiver acelerando, aumenta o comprimento da chama
        if (this.estaAcelerando) {
            this.compriChama = Math.min(this.compriChama + 3, TAMANHO_NAVE * 2);
        } else {
            this.compriChama = Math.max(this.compriChama - 1, 0);
        }

        // volta dimensional
        if (this.x < 0) this.x = telaJogo.width;
        if (this.x > telaJogo.width) this.x = 0;
        if (this.y < 0) this.y = telaJogo.height;
        if (this.y > telaJogo.height) this.y = 0;

        this.estaAcelerando = false;
    }

    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);

        // renderizar chama do propulsor
        if (this.compriChama > 0) {
            let traseiraNave = -this.raio;
            let variacao = 0.9 + Math.random() * 0.3;
            let tamanhoChama = this.compriChama * variacao;

            function criarGradienteChama(raioInterno, raioExterno, cores) {
                let gradiente = ctxTela.createRadialGradient(traseiraNave, 0, raioInterno, traseiraNave, 0, raioExterno);
                cores.forEach(([parada, cor]) => {
                    gradiente.addColorStop(parada, cor);
                });
                return gradiente;
            }

            function renderchama(altura, multiplicador, estilo) {
                ctxTela.beginPath();
                ctxTela.moveTo(traseiraNave, altura);
                ctxTela.lineTo(traseiraNave - tamanhoChama * multiplicador, 0);
                ctxTela.lineTo(traseiraNave, -altura);
                ctxTela.closePath();
                ctxTela.fillStyle = estilo;
                ctxTela.fill();
            }

            let gradInterno = criarGradienteChama(tamanhoChama * 0.05, tamanhoChama * 0.4, [
                [0, "rgba(255, 150, 0, 0.8)"],
                [1, "rgba(255, 0, 0, 0.3)"],
            ]);

            let gradExterno = criarGradienteChama(tamanhoChama * 0.1, tamanhoChama * 0.4, [
                [0, "rgba(255, 255, 255, 0.8)"],
                [1, "rgba(255, 208, 0, 0.79)"],
            ]);


            renderchama(TAMANHO_NAVE / 4, 0.9, gradInterno);
            renderchama(TAMANHO_NAVE / 6, 0.5, gradExterno);
        }

        // corpo da nave
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

class Projetil {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.vel = { x: velX, y: velY };
        this.raio = 3.5;
        this.tempoVida = 1000; // tempo de vida do projétil em ms
    }

    atualizar() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        this.tempoVida -= 16; // considerando 60 FPS, cada frame dura aproximadamente 16ms
    }

    renderizar() {
        ctxTela.save();

        let gradiente = ctxTela.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.raio);
        gradiente.addColorStop(0, "rgb(67, 3, 187)");
        gradiente.addColorStop(0.5, "rgba(3, 164, 228, 0.9)");
        gradiente.addColorStop(1, "rgba(118, 0, 141, 0.8)");

        ctxTela.fillStyle = gradiente;
        ctxTela.beginPath();
        ctxTela.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctxTela.fill();
        ctxTela.restore();
    }
}

class Asteroide {
    constructor(x, y, tamanho, velX, velY) {
        this.x = x;
        this.y = y;
        this.tamanho = tamanho;
        this.velocRotacao = (Math.random() + 0.5) * 0.02;
        this.angulo = Math.random() * Math.PI * 2;
        this.raio = tamanho / 2;
        this.vel = { x: velX, y: velY };
        this.vertices = this.criarVertices();
    }

    criarVertices() {
        let totalVertices = Math.round(Math.random() * 8) + 6;
        let vertices = [];
        for (let i = 0; i <= totalVertices; i++) {
            let anguloVertice = (i / totalVertices) * Math.PI * 2;
            let raioVertice = this.raio + Math.random() * 0.8 + 0.7;
            vertices.push({
                x: Math.cos(anguloVertice) * raioVertice,
                y: Math.sin(anguloVertice) * raioVertice
            });
        }
        return vertices;
    }


    atualizar() {

    }

    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);
        ctxTela.beginPath();
        ctxTela.moveTo(this.raio, 0);
    }
}

// Event listeners
document.addEventListener("keydown", (tecla) => {
    switch (tecla.code) {
        case "KeyA": comandos.teclaA = true; break;
        case "KeyD": comandos.teclaD = true; break;
        case "KeyW": comandos.teclaW = true; break;
        case "KeyS": comandos.teclaS = true; break;
        case "Space": comandos.teclaSpace = true; break;
    }
});

document.addEventListener("keyup", (tecla) => {
    switch (tecla.code) {
        case "KeyA": comandos.teclaA = false; break;
        case "KeyD": comandos.teclaD = false; break;
        case "KeyW": comandos.teclaW = false; break;
        case "KeyS": comandos.teclaS = false; break;
        case "Space": comandos.teclaSpace = false; break;
    }
});

// funções principais
function criarEstrelas() {
    for (let i = 0; i <= NUM_ESTRELAS; i++) {
        estrelas.push({
            x: Math.random() * telaJogo.width,
            y: Math.random() * telaJogo.height,
            tamanho: Math.random() * 1.5 + 0.3,
            trasparencia: Math.random() * 0.9 + 0.3
        });
    }
}

function renderEstrelas() {
    ctxTela.save();
    ctxTela.fillStyle = "#0a0930";
    ctxTela.fillRect(0, 0, telaJogo.width, telaJogo.height);

    estrelas.forEach(estrela => {
        ctxTela.beginPath();
        ctxTela.arc(estrela.x, estrela.y, estrela.tamanho, 0, Math.PI * 2);
        ctxTela.fillStyle = `rgba(255, 255, 255, ${estrela.trasparencia})`;
        ctxTela.fill();
    });

    ctxTela.restore();
}

function executarLoop() {
    if (comandos.teclaA) espaconave.rotacionarEsq();
    if (comandos.teclaD) espaconave.rotacionarDir();
    if (comandos.teclaW) espaconave.acelerarAtual();
    if (comandos.teclaS) espaconave.desacelerarAtual();
    if (comandos.teclaSpace) espaconave.atirar();

    renderEstrelas();

    // Atualizar e renderizar projéteis
    projetis.forEach(projetil => {
        projetil.atualizar();
        projetil.renderizar();

        if (projetil.tempoVida <= 0) {
            let index = projetis.indexOf(projetil);
            if (index > -1) {
                projetis.splice(index, 2);
            }
        }
    });

    espaconave.atualizar();
    espaconave.renderizar();
    setTimeout(executarLoop, 1000 / 60);
}

(function iniciarJogo() {
    espaconave = new Nave(telaJogo.width / 2, telaJogo.height / 2);
    criarEstrelas();
    executarLoop();
})();