// A chave da API vem de config.js, que não é versionado.
// Copie config.example.js para config.js e coloque a sua chave lá.
const chave = CONFIG.apiKey

const URL_BASE = 'https://api.openweathermap.org/data/2.5'
const CIDADE_PADRAO = 'São Paulo'
const ITEM_SALVO = 'ultimaCidade'

// Elementos da página, buscados uma vez só e reaproveitados.
const form = document.querySelector('#form-busca')
const campoCidade = document.querySelector('#input-cidade')
const caixaErro = document.querySelector('#mensagem-erro')
const caixaCarregando = document.querySelector('#carregando')
const caixaResultado = document.querySelector('#resultado')
const listaPrevisao = document.querySelector('#lista-previsao')

/* ─── Comunicação com a API ──────────────────────────────────────────── */

// Faz a requisição e transforma erro de rede/cidade inválida em mensagem clara.
async function buscarJson(url) {
  const resposta = await fetch(url)

  if (resposta.status === 404) {
    throw new Error('Cidade não encontrada. Confira o nome e tente de novo.')
  }
  if (!resposta.ok) {
    throw new Error('Não foi possível buscar a previsão agora. Tente novamente em instantes.')
  }

  return resposta.json()
}

// Monta a URL de um dos endpoints do OpenWeatherMap.
// encodeURIComponent protege nomes com espaço e acento ("São Paulo" → "S%C3%A3o%20Paulo").
function montarUrl(endpoint, cidade) {
  return (
    URL_BASE +
    '/' +
    endpoint +
    '?q=' +
    encodeURIComponent(cidade) +
    '&appid=' +
    chave +
    '&units=metric' +
    '&lang=pt_br'
  )
}

async function buscarCidade(cidade) {
  mostrarCarregando(true)
  esconderErro()

  try {
    // As duas requisições são independentes, então partem juntas
    // em vez de uma esperar a outra terminar.
    const [atual, previsao] = await Promise.all([
      buscarJson(montarUrl('weather', cidade)),
      buscarJson(montarUrl('forecast', cidade)),
    ])

    colocarNaTela(atual, previsao)
    salvarCidade(atual.name)
  } catch (erro) {
    mostrarErro(erro.message)
  } finally {
    // Roda com sucesso ou com erro: o "buscando..." sempre some.
    mostrarCarregando(false)
  }
}

/* ─── Escrita na tela ────────────────────────────────────────────────── */

function colocarNaTela(dados, previsao) {
  document.querySelector('.cidade').innerHTML = dados.name + ', ' + dados.sys.country
  document.querySelector('.temp').innerHTML = Math.round(dados.main.temp) + '°C'
  document.querySelector('.descricao').innerHTML = dados.weather[0].description

  const icone = document.querySelector('.icone')
  icone.src = 'https://openweathermap.org/img/wn/' + dados.weather[0].icon + '@2x.png'
  icone.alt = dados.weather[0].description

  document.querySelector('.sensacao').innerHTML = Math.round(dados.main.feels_like) + '°C'
  document.querySelector('.umidade').innerHTML = dados.main.humidity + '%'
  document.querySelector('.vento').innerHTML = Math.round(dados.wind.speed * 3.6) + ' km/h'

  montarPrevisao(previsao.list)

  caixaResultado.hidden = false
}

function montarPrevisao(lista) {
  listaPrevisao.innerHTML = ''

  for (const dia of agruparPorDia(lista)) {
    const item = document.createElement('li')
    item.className = 'dia'
    item.innerHTML =
      '<span class="dia-nome">' + nomeDoDia(dia.data) + '</span>' +
      '<img class="dia-icone" src="https://openweathermap.org/img/wn/' + dia.icone + '.png" alt="">' +
      '<span class="dia-temps">' +
        '<b>' + Math.round(dia.max) + '°</b>' +
        '<span class="dia-min">' + Math.round(dia.min) + '°</span>' +
      '</span>'
    listaPrevisao.appendChild(item)
  }
}

/* ─── Tratamento dos dados da previsão ───────────────────────────────── */

// A API devolve blocos de 3 em 3 horas. Para mostrar "um card por dia",
// agrupamos os blocos pela data e guardamos a menor e a maior temperatura.
function agruparPorDia(lista) {
  const hoje = new Date().toISOString().slice(0, 10)
  const dias = new Map()

  for (const bloco of lista) {
    const data = bloco.dt_txt.slice(0, 10)
    const hora = Number(bloco.dt_txt.slice(11, 13))

    if (data === hoje) continue // hoje já aparece no topo da tela

    if (!dias.has(data)) {
      dias.set(data, {
        data: data,
        min: bloco.main.temp_min,
        max: bloco.main.temp_max,
        icone: bloco.weather[0].icon,
        hora: hora,
      })
      continue
    }

    const dia = dias.get(data)
    dia.min = Math.min(dia.min, bloco.main.temp_min)
    dia.max = Math.max(dia.max, bloco.main.temp_max)

    // O ícone do dia é o do horário mais próximo do meio-dia,
    // que representa melhor a condição geral do que um bloco da madrugada.
    if (Math.abs(hora - 12) < Math.abs(dia.hora - 12)) {
      dia.icone = bloco.weather[0].icon
      dia.hora = hora
    }
  }

  return Array.from(dias.values()).slice(0, 4)
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
