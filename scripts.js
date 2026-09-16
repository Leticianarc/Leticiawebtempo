// API Open-Meteo: gratuita e sem chave de acesso.
// Não há nada para configurar — o projeto roda assim que é aberto.
const URL_GEOCODIFICACAO = 'https://geocoding-api.open-meteo.com/v1/search'
const URL_PREVISAO = 'https://api.open-meteo.com/v1/forecast'

const CIDADE_PADRAO = 'São Paulo'
const ITEM_SALVO = 'ultimaCidade'

// Elementos da página, buscados uma vez só e reaproveitados.
const form = document.querySelector('#form-busca')
const campoCidade = document.querySelector('#input-cidade')
const caixaErro = document.querySelector('#mensagem-erro')
const caixaCarregando = document.querySelector('#carregando')
const caixaResultado = document.querySelector('#resultado')
const listaPrevisao = document.querySelector('#lista-previsao')

/* ─── Códigos de condição do tempo ───────────────────────────────────── */

// A Open-Meteo devolve a condição como um código numérico no padrão WMO.
// Aqui cada código vira uma descrição em português e o ícone correspondente.
const CONDICOES = {
  0:  { texto: 'Céu limpo',                    icone: '01' },
  1:  { texto: 'Predominantemente limpo',      icone: '02' },
  2:  { texto: 'Parcialmente nublado',         icone: '03' },
  3:  { texto: 'Nublado',                      icone: '04' },
  45: { texto: 'Névoa',                        icone: '50' },
  48: { texto: 'Névoa com geada',              icone: '50' },
  51: { texto: 'Garoa fraca',                  icone: '09' },
  53: { texto: 'Garoa moderada',               icone: '09' },
  55: { texto: 'Garoa intensa',                icone: '09' },
  56: { texto: 'Garoa congelante',             icone: '09' },
  57: { texto: 'Garoa congelante intensa',     icone: '09' },
  61: { texto: 'Chuva fraca',                  icone: '10' },
  63: { texto: 'Chuva moderada',               icone: '10' },
  65: { texto: 'Chuva forte',                  icone: '10' },
  66: { texto: 'Chuva congelante',             icone: '10' },
  67: { texto: 'Chuva congelante forte',       icone: '10' },
  71: { texto: 'Neve fraca',                   icone: '13' },
  73: { texto: 'Neve moderada',                icone: '13' },
  75: { texto: 'Neve intensa',                 icone: '13' },
  77: { texto: 'Grãos de neve',                icone: '13' },
  80: { texto: 'Pancadas de chuva',            icone: '09' },
  81: { texto: 'Pancadas fortes',              icone: '09' },
  82: { texto: 'Pancadas muito fortes',        icone: '09' },
  85: { texto: 'Pancadas de neve',             icone: '13' },
  86: { texto: 'Pancadas de neve intensas',    icone: '13' },
  95: { texto: 'Tempestade',                   icone: '11' },
  96: { texto: 'Tempestade com granizo',       icone: '11' },
  99: { texto: 'Tempestade severa',            icone: '11' },
}

function descreverCondicao(codigo) {
  return CONDICOES[codigo] || { texto: 'Condição indisponível', icone: '01' }
}

// As imagens de ícone do OpenWeather são arquivos públicos: não precisam de
// chave. O sufixo "d" ou "n" troca a versão de dia pela de noite.
function montarUrlIcone(codigo, ehDia, tamanhoDobrado) {
  return (
    'https://openweathermap.org/img/wn/' +
    descreverCondicao(codigo).icone +
    (ehDia ? 'd' : 'n') +
    (tamanhoDobrado ? '@2x' : '') +
    '.png'
  )
}

/* ─── Comunicação com a API ──────────────────────────────────────────── */

// Faz a requisição e transforma falha de rede em mensagem clara.
async function buscarJson(url) {
  const resposta = await fetch(url)

  if (!resposta.ok) {
    throw new Error('Não foi possível buscar a previsão agora. Tente novamente em instantes.')
  }

  return resposta.json()
}

// Passo 1: descobrir as coordenadas da cidade.
// A API de previsão trabalha com latitude e longitude, não com nomes.
async function buscarCoordenadas(cidade) {
  const url =
    URL_GEOCODIFICACAO +
    '?name=' +
    encodeURIComponent(cidade) +
    '&count=1&language=pt&format=json'

  const dados = await buscarJson(url)

  // Quando nada é encontrado, a resposta simplesmente não traz "results".
  if (!dados.results || dados.results.length === 0) {
    throw new Error('Cidade não encontrada. Confira o nome e tente de novo.')
  }

  return dados.results[0]
}

// Passo 2: buscar o clima atual e a previsão para essas coordenadas.
async function buscarPrevisao(local) {
  const url =
    URL_PREVISAO +
    '?latitude=' + local.latitude +
    '&longitude=' + local.longitude +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    '&timezone=auto&forecast_days=5'

  return buscarJson(url)
}

async function buscarCidade(cidade) {
  mostrarCarregando(true)
  esconderErro()

  try {
    // As requisições são sequenciais porque a segunda depende da primeira:
    // sem as coordenadas, não há como pedir a previsão.
    const local = await buscarCoordenadas(cidade)
    const previsao = await buscarPrevisao(local)

    colocarNaTela(local, previsao)
    salvarCidade(local.name)
  } catch (erro) {
    mostrarErro(erro.message)
  } finally {
    // Roda com sucesso ou com erro: o "buscando..." sempre some.
    mostrarCarregando(false)
  }
}

/* ─── Escrita na tela ────────────────────────────────────────────────── */

function colocarNaTela(local, previsao) {
  const atual = previsao.current
  const condicao = descreverCondicao(atual.weather_code)
  const ehDia = atual.is_day === 1

  const nomeCompleto = [local.name, local.admin1, local.country]
    .filter(function (parte) { return parte })
    .join(', ')

  document.querySelector('.cidade').innerHTML = nomeCompleto
  document.querySelector('.temp').innerHTML = Math.round(atual.temperature_2m) + '°C'
  document.querySelector('.descricao').innerHTML = condicao.texto

  const icone = document.querySelector('.icone')
  icone.src = montarUrlIcone(atual.weather_code, ehDia, true)
  icone.alt = condicao.texto

  document.querySelector('.sensacao').innerHTML = Math.round(atual.apparent_temperature) + '°C'
  document.querySelector('.umidade').innerHTML = Math.round(atual.relative_humidity_2m) + '%'
  document.querySelector('.vento').innerHTML = Math.round(atual.wind_speed_10m) + ' km/h'

  montarPrevisao(previsao.daily)

  caixaResultado.hidden = false
}

function montarPrevisao(diario) {
  listaPrevisao.innerHTML = ''

  // O índice 0 é hoje, que já aparece no topo da tela: começamos do 1.
  for (let i = 1; i < diario.time.length; i++) {
    const condicao = descreverCondicao(diario.weather_code[i])

    const item = document.createElement('li')
    item.className = 'dia'
    item.innerHTML =
      '<span class="dia-nome">' + nomeDoDia(diario.time[i]) + '</span>' +
      '<img class="dia-icone" src="' + montarUrlIcone(diario.weather_code[i], true, false) +
        '" alt="' + condicao.texto + '">' +
      '<span class="dia-temps">' +
        '<b>' + Math.round(diario.temperature_2m_max[i]) + '°</b>' +
        '<span class="dia-min">' + Math.round(diario.temperature_2m_min[i]) + '°</span>' +
      '</span>'

    listaPrevisao.appendChild(item)
  }
}

function nomeDoDia(data) {
  // O meio-dia evita que o fuso horário empurre a data para o dia anterior.
  const dia = new Date(data + 'T12:00:00')
  const nome = dia.toLocaleDateString('pt-BR', { weekday: 'short' })
  return nome.replace('.', '')
}

/* ─── Estados da interface ───────────────────────────────────────────── */

function mostrarCarregando(estaCarregando) {
  caixaCarregando.hidden = !estaCarregando
}

function mostrarErro(mensagem) {
  caixaErro.innerHTML = mensagem
  caixaErro.hidden = false
}

function esconderErro() {
  caixaErro.hidden = true
}

/* ─── Última cidade pesquisada ───────────────────────────────────────── */

// O localStorage pode falhar em janela anônima ou com cookies bloqueados,
// então a leitura e a escrita ficam protegidas: no pior caso o app
// simplesmente abre na cidade padrão.
function salvarCidade(cidade) {
  try {
    localStorage.setItem(ITEM_SALVO, cidade)
  } catch (erro) {
    // Sem armazenamento disponível: seguimos normalmente.
  }
}

function lerCidadeSalva() {
  try {
    return localStorage.getItem(ITEM_SALVO)
  } catch (erro) {
    return null
  }
}

/* ─── Início ─────────────────────────────────────────────────────────── */

form.addEventListener('submit', function (evento) {
  evento.preventDefault() // impede o recarregamento padrão do formulário

  const cidade = campoCidade.value.trim()
  if (cidade === '') return

  buscarCidade(cidade)
})

// Ao abrir a página, carrega a última cidade pesquisada — ou a padrão.
const cidadeInicial = lerCidadeSalva() || CIDADE_PADRAO
campoCidade.value = cidadeInicial
buscarCidade(cidadeInicial)
