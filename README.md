<div align="center">

# 🌤️ Previsão do Tempo

**Aplicação web que consulta o clima de qualquer cidade do mundo em tempo real**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/Open--Meteo-1E88E5?style=for-the-badge&logoColor=white)

</div>

---

> 🔁 **Primeira versão deste projeto** — JavaScript puro, sem framework, sem build e sem
> dependências. A **segunda versão**, reconstruída em React e TypeScript, está em
> **[previsao-tempo-react](https://github.com/Leticianarc/previsao-tempo-react)**: componentes
> no lugar da manipulação direta do DOM, tipagem estrita, camada de API isolada e
> cancelamento de requisições concorrentes.

---

## 📋 Sobre o projeto

Aplicação web feita com **HTML, CSS e JavaScript puro**, sem frameworks e sem dependências.
O usuário digita o nome de uma cidade e a página busca, em tempo real, os dados meteorológicos
na **Open-Meteo**, exibindo as condições atuais e a previsão para os próximos dias.

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
- 🌗 **Ícones de dia e noite**, escolhidos conforme o horário local da cidade
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
| **JavaScript** | Lógica, manipulação do DOM e consumo das APIs |
| **Fetch API** | Requisições HTTP aos servidores da Open-Meteo |
| **localStorage** | Guarda a última cidade pesquisada no navegador |
| **Open-Meteo Geocoding** | Converte o nome da cidade em latitude e longitude |
| **Open-Meteo Forecast** | Fornece o clima atual e a previsão dos próximos dias |

Nenhuma biblioteca externa, nenhum passo de build e **nenhuma chave de API**.
Abrir o `index.html` já executa o projeto.

---

## 📦 Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Edge ou Safari)
- Opcional: a extensão **Live Server** do VS Code, para recarregar a página automaticamente

---

## ▶️ Como executar

```bash
git clone https://github.com/Leticianarc/previsao-tempo-js.git
cd previsao-tempo-js
```

Depois, abra o `index.html` no navegador — ou, no VS Code, clique em **Go Live** com a
extensão Live Server instalada.

> 💡 A Open-Meteo é gratuita e não exige cadastro nem chave de acesso. Quem clonar este
> repositório consegue rodar o projeto imediatamente, sem nenhuma configuração.

---

## 🧩 Estrutura dos arquivos

```
Tempo/
├── index.html      # Estrutura da página: busca, estados de erro/carregamento e resultado
├── style.css       # Estilos: gradiente de fundo, cartão central, métricas e previsão
├── scripts.js      # Lógica: requisições, tradução dos códigos e escrita na tela
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

**5.** A **geocodificação** converte o nome digitado em latitude e longitude

**6.** Com as coordenadas em mãos, a segunda requisição busca **clima atual + previsão**

**7.** Os códigos de condição são traduzidos para texto e ícone, os dados são escritos na
tela e a cidade é salva no `localStorage`

```
[ abre a página ] → localStorage ─┐
                                  ↓
[ usuário busca ] → submit → geocodificação → lat/lon → previsão
                                                            ↓
[ tela atualizada ] ←── colocarNaTela() ←──── resposta JSON
```

As duas requisições são **sequenciais, e não paralelas**: sem as coordenadas devolvidas pela
primeira, não há como montar a segunda.

Se algo falha, o `catch` exibe a mensagem e o `finally` garante que o indicador de
carregamento sempre desapareça — com sucesso ou com erro.

---

## 🌐 Entendendo as requisições

### 📍 Passo 1 — Geocodificação

```
https://geocoding-api.open-meteo.com/v1/search?name=CIDADE&count=1&language=pt&format=json
```

| Parâmetro | O que significa |
| --- | --- |
| `name=CIDADE` | Nome digitado pelo usuário |
| `count=1` | Queremos apenas o resultado mais relevante |
| `language=pt` | Devolve os nomes em português |

O nome da cidade passa por `encodeURIComponent()` antes de entrar na URL — é isso que faz
`"São Paulo"` virar `"S%C3%A3o%20Paulo"` e a busca funcionar com espaços e acentos.

```json
{
  "results": [
    { "name": "São Paulo", "admin1": "São Paulo", "country": "Brasil",
      "latitude": -23.5475, "longitude": -46.63611 }
  ]
}
```

> 💡 Quando a cidade não existe, a resposta simplesmente **não traz** o campo `results` —
> é assim que o código identifica o caso e mostra "Cidade não encontrada".

### 🌦️ Passo 2 — Previsão

```
https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON
  &current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &timezone=auto&forecast_days=5
```

| Parâmetro | O que significa |
| --- | --- |
| `current=...` | Lista dos dados do momento que queremos receber |
| `daily=...` | Dados agregados por dia: condição, máxima e mínima |
| `timezone=auto` | Usa o fuso horário da própria cidade consultada |
| `forecast_days=5` | Hoje + os quatro dias seguintes |

```json
{
  "current": {
    "temperature_2m": 21.3, "apparent_temperature": 21.9,
    "relative_humidity_2m": 70, "wind_speed_10m": 12.6,
    "weather_code": 3, "is_day": 1
  },
  "daily": {
    "time": ["2026-09-16", "2026-09-17"],
    "weather_code": [3, 61],
    "temperature_2m_max": [24.1, 22.8],
    "temperature_2m_min": [15.2, 14.9]
  }
}
```

> 💡 Os dados diários vêm como **listas paralelas**: o dia `time[1]` tem a condição
> `weather_code[1]`, a máxima `temperature_2m_max[1]` e assim por diante. O índice `0` é
> hoje, que já aparece no topo da tela — por isso a lista de próximos dias começa em `1`.

### 🔢 Os códigos de condição (WMO)

A Open-Meteo não envia texto nem imagem: ela devolve um **código numérico** no padrão da
Organização Meteorológica Mundial. Traduzir esse código é responsabilidade da aplicação.

| Código | Condição | Ícone |
| --- | --- | --- |
| `0` | Céu limpo | `01` |
| `1`, `2`, `3` | De predominantemente limpo a nublado | `02`, `03`, `04` |
| `45`, `48` | Névoa | `50` |
| `51`–`57` | Garoa | `09` |
| `61`–`67` | Chuva | `10` |
| `71`–`77` | Neve | `13` |
| `80`–`86` | Pancadas | `09`, `13` |
| `95`–`99` | Tempestade | `11` |

O objeto `CONDICOES` no `scripts.js` faz esse mapeamento, ligando cada código a uma descrição
em português e ao ícone correspondente. O campo `is_day` decide entre a versão de dia (`d`) e
a de noite (`n`) da imagem.

---

## 🧠 Conceitos aprendidos

**`fetch`** — a ferramenta do JavaScript para conversar com servidores. Envia uma requisição
a uma URL e devolve o que o servidor responder.

**`async` / `await`** — a resposta do servidor não é instantânea. `await` significa "espere
esta linha terminar antes de seguir". Sem isso, o código tentaria usar dados que ainda não
chegaram. A função só pode usar `await` se for declarada como `async`.

**Requisições encadeadas** — nem toda sequência de chamadas pode ser paralela. Aqui a segunda
requisição **depende** do resultado da primeira: só dá para pedir a previsão depois de saber
as coordenadas. Entender essa diferença é o que evita tanto o erro de paralelizar o que não
pode, quanto a lentidão de serializar o que poderia correr junto.

**`try / catch / finally`** — `try` tenta, `catch` captura o erro e mostra uma mensagem
compreensível, e `finally` roda de qualquer jeito. É o `finally` que garante que o "carregando"
sempre suma, mesmo quando a busca falha.

**Tradução de dados crus** — a API devolve `3`, não "Nublado". Transformar código em
informação legível é trabalho da aplicação, e uma tabela de mapeamento resolve isso de forma
organizada, sem uma cadeia de `if` para cada caso.

**Listas paralelas** — os dados diários chegam em arrays separados que se relacionam pelo
índice. Saber ler essa estrutura é comum ao consumir APIs de dados científicos.

**JSON** — *JavaScript Object Notation*, o formato de texto em que os dados trafegam entre
servidor e navegador. Depois de convertido, é acessado com ponto: `dados.current.temperature_2m`.

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
