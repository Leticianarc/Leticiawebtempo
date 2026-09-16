// A chave da API vem de config.js, que não é versionado.
// Copie config.example.js para config.js e coloque a sua chave lá.
const chave = CONFIG.apiKey

function colocarNaTela(dados) {
  document.querySelector('.cidade').innerHTML = 'Tempo em ' + dados.name
  document.querySelector('.temp').innerHTML = Math.floor(dados.main.temp) + '°C'
  document.querySelector('.icone').src =
    'https://openweathermap.org/img/wn/' + dados.weather[0].icon + '.png'
  document.querySelector('.umidade').innerHTML = 'Umidade: ' + dados.main.humidity + '%'
}

async function buscarCidade(cidade) {
  let dados = await fetch(
    'https://api.openweathermap.org/data/2.5/weather?q=' +
      cidade +
      '&appid=' +
      chave +
      '&units=metric',
  ).then((resposta) => resposta.json())

  // AWAIT = Espere
  // FETCH = Ferramenta do JavaScript para acessar servidores
  // THEN = Então
  // JSON = JavaScript Object Notation (o formato que o JavaScript entende)

  colocarNaTela(dados)
}

function cliqueiNoBotao() {
  let cidade = document.querySelector('.input-cidade').value

  buscarCidade(cidade)
}

// VARIÁVEL: pedacinho de memória onde guardamos o que quisermos.
// FUNÇÃO: um trecho de código que só executa quando eu chamo.
// LÓGICA DE PROGRAMAÇÃO: entender passo a passo como as coisas devem funcionar.
