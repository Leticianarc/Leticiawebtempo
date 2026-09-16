<div align="center">

# 🌤️ Previsão do Tempo

**Aplicação web que consulta o clima de qualquer cidade do mundo em tempo real**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeather](https://img.shields.io/badge/OpenWeather-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white)

</div>

---

## 📋 Sobre o projeto

Aplicação web feita com **HTML, CSS e JavaScript puro**, sem frameworks e sem dependências.
O usuário digita o nome de uma cidade e a página busca, em tempo real, os dados meteorológicos
na API do **OpenWeatherMap**, exibindo as condições atuais e a previsão para os próximos dias.

O objetivo foi entender, na prática, o caminho completo de uma requisição: **o que sai do
navegador, o que o servidor devolve e como transformar essa resposta em algo visível na tela.**

<!-- Grave um GIF da página buscando uma cidade, salve como docs/preview.gif
     e descomente a linha abaixo para o README ficar ainda melhor:
![Demonstração](docs/preview.gif)
-->

---

## ✨ Funcionalidades

- 🔍 **Busca por cidade**, pelo botão ou apertando **Enter**
- 🌡️ **Condições atuais**: temperatura, sensação térmica, umidade e velocidade do vento
- 📅 **Previsão dos próximos 4 dias**, com mínima, máxima e ícone da condição
- 🇧🇷 **Descrições em português**, vindas da própria API
- ⏳ **Indicador de carregamento** enquanto a resposta não chega
- ⚠️ **Mensagens de erro claras** para cidade inexistente ou falha de conexão
- 💾 **Memória da última cidade**: ao reabrir a página, ela já carrega sozinha
- 📱 **Layout responsivo**, do celular ao desktop

---

## 🛠️ Tecnologias

| Tecnologia | Papel no projeto |
| --- | --- |
| **HTML5** | Estrutura da página e marcação semântica |
| **CSS3** | Estilização, layout com Flexbox e Grid, responsividade |
| **JavaScript** | Lógica, manipulação do DOM e consumo da API |
| **Fetch API** | Requisições HTTP ao servidor do OpenWeatherMap |
| **localStorage** | Guarda a última cidade pesquisada no navegador |
| **OpenWeatherMap** | Fonte dos dados meteorológicos |

Nenhuma biblioteca externa, nenhum passo de build. Abrir o `index.html` já executa o projeto.

---

## 📦 Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Edge ou Safari)
- Uma chave gratuita da API do [OpenWeatherMap](https://openweathermap.org/api)
- Opcional: a extensão **Live Server** do VS Code, para recarregar a página automaticamente

---

## 🔑 Configuração da chave da API

A chave **não fica no código versionado**. Cada pessoa usa a sua própria:

**1.** Crie uma conta gratuita em [openweathermap.org/api](https://openweathermap.org/api)

**2.** Copie a sua chave no menu **My API Keys**

**3.** Copie o arquivo de exemplo:

```bash
cp config.example.js config.js
```

**4.** Abra o `config.js` e cole a sua chave:

```js
const CONFIG = {
  apiKey: 'sua-chave-aqui',
}
```

> ⚠️ O `config.js` está no `.gitignore`. Nunca versione a sua chave — chaves expostas em
> repositórios públicos são localizadas por robôs automatizados em poucos minutos e a sua
> cota gratuita acaba sendo consumida por terceiros.

---

## ▶️ Como executar

```bash
# Clone o repositório
git clone https://github.com/Leticianarc/Leticiawebtempo.git
cd Leticiawebtempo

# Configure a chave (passo anterior)
cp config.example.js config.js
```

Depois, abra o `index.html` no navegador — ou, no VS Code, clique em **Go Live** com a
extensão Live Server instalada.

---

## 🧩 Estrutura dos arquivos

```
Tempo/
├── index.html          # Estrutura da página: busca, estados de erro/carregamento e resultado
├── style.css           # Estilos: gradiente de fundo, cartão central, métricas e previsão
├── scripts.js          # Lógica: requisições, tratamento dos dados e escrita na tela
├── config.example.js   # Modelo de configuração da chave (versionado)
├── config.js           # Sua chave real (NÃO versionado)
└── .gitignore
```

---

## 🔄 Como funciona

O fluxo completo, da abertura da página até o dado na tela:

**1.** Ao abrir, a página lê a **última cidade pesquisada** no `localStorage` — se não houver
nenhuma, usa São Paulo como padrão

**2.** O usuário digita outra cidade e aperta **Enter** ou clica na lupa

**3.** O evento `submit` do formulário dispara a busca (é o `<form>` que faz o Enter funcionar)

**4.** A tela mostra o indicador de **carregando** e limpa qualquer erro anterior

**5.** Duas requisições partem **ao mesmo tempo** com `Promise.all`: uma para o clima atual,
outra para a previsão dos próximos dias

**6.** As respostas chegam em **JSON**; os blocos da previsão são agrupados por dia

**7.** Os dados são escritos na tela e a cidade é salva no `localStorage`

```
[ abre a página ] → localStorage → buscarCidade()
                                        ↓
[ usuário busca ] → submit ─────→ Promise.all ─→ weather  ─┐
                                        │      └→ forecast ─┤
                                        ↓                   ↓
[ tela atualizada ] ←── colocarNaTela() ←──── respostas JSON
```

Se algo falha, o `catch` exibe a mensagem e o `finally` garante que o indicador de
carregamento sempre desapareça — com sucesso ou com erro.

---

## 🌐 Entendendo a requisição

O projeto usa **dois endpoints** do OpenWeatherMap, montados da mesma forma:

```
https://api.openweathermap.org/data/2.5/weather?q=CIDADE&appid=CHAVE&units=metric&lang=pt_br
https://api.openweathermap.org/data/2.5/forecast?q=CIDADE&appid=CHAVE&units=metric&lang=pt_br
```

| Parte | O que significa |
| --- | --- |
| `/weather` | Condições **atuais** da cidade |
| `/forecast` | Previsão de **5 dias**, em blocos de 3 em 3 horas |
| `?q=CIDADE` | Parâmetro de busca — o nome da cidade digitada |
| `&appid=CHAVE` | Identifica quem está fazendo a requisição |
| `&units=metric` | Pede a temperatura em **Celsius** (sem isso, vem em Kelvin) |
| `&lang=pt_br` | Pede as descrições em **português** |

O `?` marca o início dos parâmetros e o `&` separa um parâmetro do próximo.

O nome da cidade passa por `encodeURIComponent()` antes de entrar na URL — é isso que faz
`"São Paulo"` virar `"S%C3%A3o%20Paulo"` e a busca funcionar com espaços e acentos.

### 📥 A resposta do clima atual

```json
{
  "name": "São Paulo",
  "sys": { "country": "BR" },
  "main": { "temp": 21.34, "feels_like": 21.9, "humidity": 70 },
  "wind": { "speed": 3.6 },
  "weather": [ { "description": "nublado", "icon": "04n" } ]
}
```

| Campo usado | Vira na tela |
| --- | --- |
| `dados.name` + `dados.sys.country` | Cidade e país no título |
| `dados.main.temp` | Temperatura, arredondada com `Math.round()` |
| `dados.main.feels_like` | Sensação térmica |
| `dados.main.humidity` | Percentual de umidade |
| `dados.wind.speed` | Vento — vem em m/s e é convertido para km/h (× 3,6) |
| `dados.weather[0].icon` | Código do ícone, usado para montar a URL da imagem |

> 💡 `weather` é uma **lista**, por isso o `[0]`: pegamos a primeira condição descrita.
> O código do ícone (`04n`) forma o endereço da imagem:
> `https://openweathermap.org/img/wn/04n@2x.png`

### 📅 A previsão dos próximos dias

O endpoint `/forecast` devolve **40 blocos de 3 em 3 horas**, não um por dia. Para exibir um
cartão por dia, o projeto agrupa os blocos pela data e, em cada grupo:

- guarda a **menor** e a **maior** temperatura encontradas
- escolhe o ícone do bloco mais **próximo do meio-dia**, que representa melhor a condição
  geral do que um bloco da madrugada
- descarta o dia de hoje, que já aparece no topo da tela

---

## 🧠 Conceitos aprendidos

**`fetch`** — a ferramenta do JavaScript para conversar com servidores. Envia uma requisição
a uma URL e devolve o que o servidor responder.

**`async` / `await`** — a resposta do servidor não é instantânea. `await` significa "espere
esta linha terminar antes de seguir". Sem isso, o código tentaria usar dados que ainda não
chegaram. A função só pode usar `await` se for declarada como `async`.

**`Promise.all`** — quando duas requisições não dependem uma da outra, elas partem juntas e
esperamos as duas terminarem. É mais rápido do que buscar uma, esperar, e só então buscar a outra.

**`try / catch / finally`** — `try` tenta, `catch` captura o erro e mostra uma mensagem
compreensível, e `finally` roda de qualquer jeito. É o `finally` que garante que o "carregando"
sempre suma, mesmo quando a busca falha.

**Status HTTP** — o servidor responde com um número junto dos dados. `404` significa "não
encontrei essa cidade", e é por isso que dá para mostrar uma mensagem específica em vez de
um erro genérico.

**JSON** — *JavaScript Object Notation*, o formato de texto em que os dados trafegam entre
servidor e navegador. Depois de convertido, é acessado com ponto: `dados.main.temp`.

**Manipulação do DOM** — `document.querySelector()` localiza um elemento e `.innerHTML` troca
o conteúdo dele. É assim que o dado que veio da internet aparece na página.

**`localStorage`** — pequeno armazenamento do próprio navegador. Guarda a última cidade mesmo
depois de fechar a aba. Como ele pode estar bloqueado (janela anônima, cookies desativados),
a leitura e a escrita ficam dentro de `try / catch`.

**Flexbox e Grid** — `flex` alinha a busca e centraliza o cartão; `grid` organiza as três
métricas em colunas iguais e alinha os cartões da previsão.

**Acessibilidade** — o campo tem rótulo associado, o botão tem `aria-label`, os ícones têm
texto alternativo e a mensagem de erro usa `role="alert"` para ser anunciada por leitores de tela.

---

## 🎨 Estilização

- Fundo em **gradiente**, sem depender de imagem externa — carrega sempre e instantaneamente
- Cartão central escuro com `backdrop-filter: blur()`, efeito de vidro sobre o gradiente
- Métricas em **grid de três colunas**, com rótulos em caixa alta e espaçamento entre letras
- Indicador de carregamento animado com `@keyframes`, respeitando `prefers-reduced-motion`
- Botão circular com retorno visual no `:hover` e foco visível no teclado
- Reset inicial com `* { margin: 0; padding: 0; box-sizing: border-box; }`

---

<div align="center">

Desenvolvido por **[Letícia Narciso](https://github.com/Leticianarc)** ·
[LinkedIn](https://www.linkedin.com/in/leticianarciso/)

</div>
