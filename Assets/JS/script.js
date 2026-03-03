let btchecar = document.getElementById("bt-checar");

let valorResultado = document.getElementById("valor-resultado");

let pontuacao = 0;

btchecar.addEventListener("click", () => {
    // Pergunta 1
    pontuacao = 0;
    console.clear()
    checarResposta("pergunta1", "b")
    checarResposta("pergunta2", "b")
    checarResposta("pergunta3", "b")
    checarResposta("pergunta4", "b")
    checarResposta("pergunta5", "a")
    checarResposta("pergunta6", "c")
    checarResposta("pergunta7", "a")
    checarResposta("pergunta8", "a")
    checarResposta("pergunta9", "c")
    checarResposta("pergunta10", "b")
    checarResposta("pergunta11", "c")
    checarResposta("pergunta12", "b")
    checarResposta("pergunta13", "b")
    checarResposta("pergunta14", "c")
    checarResposta("pergunta15", "b")

    valorResultado.innerHTML = "Você pontuou: " + pontuacao + "/15 !";

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Question', 'Answer'],
            ['Acertos', (pontuacao)],
            ['Erros', (15 - pontuacao)]
        ]);

        var options = {
            title: 'Gráfico de perguntas respondidas',
            is3D: true,
            backgroundColor: '#f8f9fa',
            slices: {0: {color: '#00b30f'}, 3: {color: 'red'}}
        }
        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
        chart.draw(data, options);
    }

});

function checarResposta(pergunta, correta) {
    // Pergunta 1
    let resposta = document.querySelector('input[name="' + pergunta + '"]:checked').value;

    // Resposta certa é B ...
    if (resposta == correta) {
        pontuacao++;
        console.log("Acertou a " + pergunta + " Resposta certa = " + resposta);
        document.querySelector('input[name="' + pergunta + '"]:checked').parentElement.style.backgroundColor = "rgb(245, 255, 245)";
    } else {
        document.querySelector('input[name="' + pergunta + '"]:checked').parentElement.style.backgroundColor = "rgb(255, 245, 245)";
    }
}


