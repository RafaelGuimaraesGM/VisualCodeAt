// Declaração de elementos
const telaJogo = document.getElementById("telaJogo");
const ctxTela = telaJogo.getContext("2d");

// Variáveis do jogo
const NUM_ESTRELAS = 3000;
const TAMANHO_NAVE = 30;
const ANGULO_ROTACAO = 0.1;
var estrelas = [];
var espaconave;
var comandos = {
    teclaA: false,
    teclaD: false,
    teclaW: false,
    teclaS: false
};

telaJogo.width = window.innerWidth;
telaJogo.height = window.innerHeight;

// classes
class Nave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidade = {x: 0, y: 0};
        this.angulo = -Math.PI / 2; // Ângulo inicial para apontar para cima
        this.raio = TAMANHO_NAVE / 2;
    }

    rotacionarEsq() {
        this.angulo += ANGULO_ROTACAO * -1;
    }

    rotacionarDir() {
        this.angulo += ANGULO_ROTACAO * 1;
    }

    renderizar() {
        ctxTela.save();
        ctxTela.translate(this.x, this.y);
        ctxTela.rotate(this.angulo);
        ctxTela.beginPath();
        ctxTela.moveTo(TAMANHO_NAVE / 2, 0);  
        ctxTela.lineTo(-TAMANHO_NAVE / 2, -TAMANHO_NAVE / 3);
        ctxTela.lineTo(-TAMANHO_NAVE / 2, TAMANHO_NAVE / 3);
        ctxTela.closePath();
        ctxTela.fillStyle = "#ff5454";
        ctxTela.strokeStyle = "#941100";
        ctxTela.lineWidth = 1.5;
        ctxTela.stroke();
        ctxTela.fill();
        ctxTela.restore();
    }
}

// Event listeners
document.addEventListener("keydown", (tecla) => {
    switch (tecla.code) {
        case "KeyA": comandos.teclaA = true; break;
        case "KeyD": comandos.teclaD = true; break;
    }
});

document.addEventListener("keyup", (tecla) => {
    switch (tecla.code) {
        case "KeyA": comandos.teclaA = false; break;
        case "KeyD": comandos.teclaD = false; break;
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

function executarLoop () {
    if (comandos.teclaA) espaconave.rotacionarEsq();
    if (comandos.teclaD) espaconave.rotacionarDir();
    renderEstrelas();
    espaconave.renderizar();
}

(function iniciarJogo() {
    espaconave = new Nave(telaJogo.width / 2, telaJogo.height / 2);
    criarEstrelas();
    executarLoop();
})();