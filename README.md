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
na API do **OpenWeatherMap**, exibindo temperatura, umidade e um ícone que representa a
condição atual do céu.

O objetivo foi entender, na prática, o caminho completo de uma requisição: **o que sai do
navegador, o que o servidor devolve e como transformar essa resposta em algo visível na tela.**

<!-- Grave um GIF da página buscando uma cidade, salve como docs/preview.gif
     e descomente a linha abaixo para o README ficar ainda melhor:
![Demonstração](docs/preview.gif)
-->

---

## 🛠️ Tecnologias

| Tecnologia | Papel no projeto |
| --- | --- |
| **HTML5** | Estrutura da página e marcação semântica |
| **CSS3** | Estilização, layout com Flexbox e responsividade |
| **JavaScript** | Lógica, manipulação do DOM e consumo da API |
| **Fetch API** | Requisições HTTP ao servidor do OpenWeatherMap |
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
├── index.html          # Estrutura da página: campo de busca, botão e área de resultado
├── style.css           # Estilos: fundo, caixa central, tipografia e botão
├── scripts.js          # Lógica: captura da cidade, requisição à API e escrita na tela
├── config.example.js   # Modelo de configuração da chave (versionado)
├── config.js           # Sua chave real (NÃO versionado)
└── .gitignore
```

---

## 🔄 Como funciona

O fluxo completo, do clique até o dado na tela:

**1.** O usuário digita o nome da cidade no campo de busca

**2.** Ao clicar na lupa, o `onclick` dispara a função `cliqueiNoBotao()`

**3.** Essa função lê o valor digitado com `document.querySelector('.input-cidade').value`

**4.** O valor é passado para `buscarCidade(cidade)`

**5.** A função monta a URL da API e envia a requisição com `fetch`

**6.** A resposta chega em **JSON** e é convertida com `.then((resposta) => resposta.json())`

**7.** Os dados vão para `colocarNaTela(dados)`, que escreve cada informação no seu elemento

```
[ usuário digita ] → cliqueiNoBotao() → buscarCidade() → fetch → API
                                                                   ↓
[ tela atualizada ] ← colocarNaTela(dados) ←────────────── resposta JSON
```

---

## 🌐 Entendendo a requisição

A URL enviada ao servidor é montada juntando quatro partes:

```
https://api.openweathermap.org/data/2.5/weather?q=CIDADE&appid=CHAVE&units=metric
```

| Parte | O que significa |
| --- | --- |
| `api.openweathermap.org/data/2.5/weather` | Endereço do serviço que devolve o clima atual |
| `?q=CIDADE` | Parâmetro de busca — o nome da cidade digitada |
| `&appid=CHAVE` | Identifica quem está fazendo a requisição |
| `&units=metric` | Pede a temperatura em **Celsius** (sem isso, vem em Kelvin) |

O `?` marca o início dos parâmetros e o `&` separa um parâmetro do próximo.

### 📥 A resposta

O servidor devolve um objeto JSON. O projeto usa quatro campos dele:

```json
{
  "name": "São Paulo",
  "main": {
    "temp": 21.34,
    "humidity": 70
  },
  "weather": [
    { "icon": "04n" }
  ]
}
```

| Campo usado | Vira na tela |
| --- | --- |
| `dados.name` | Nome da cidade no título |
| `dados.main.temp` | Temperatura, arredondada com `Math.floor()` |
| `dados.main.humidity` | Percentual de umidade |
| `dados.weather[0].icon` | Código do ícone, usado para montar a URL da imagem |

> 💡 `weather` é uma **lista**, por isso o `[0]`: pegamos a primeira condição descrita.
> O código do ícone (`04n`) forma o endereço da imagem:
> `https://openweathermap.org/img/wn/04n.png`

---

## 🧠 Conceitos aprendidos

**`fetch`** — a ferramenta do JavaScript para conversar com servidores. Envia uma requisição
a uma URL e devolve o que o servidor responder.

**`async` / `await`** — a resposta do servidor não é instantânea. `await` significa "espere
esta linha terminar antes de seguir". Sem isso, o código tentaria usar dados que ainda não
chegaram. A função só pode usar `await` se for declarada como `async`.

**`.then()`** — "então, quando terminar, faça isto". Aqui é usado para converter a resposta
bruta em JSON.

**JSON** — *JavaScript Object Notation*, o formato de texto em que os dados trafegam entre
servidor e navegador. Depois de convertido, é acessado com ponto: `dados.main.temp`.

**Manipulação do DOM** — `document.querySelector()` localiza um elemento pela classe e
`.innerHTML` troca o conteúdo dele. É assim que o dado que veio da internet aparece na página.

**Flexbox** — no CSS, `display: flex` com `align-items: center` e `justify-content: center`
centraliza a caixa na vertical e na horizontal, em qualquer tamanho de tela.

---

## 🎨 Estilização

- Fundo em imagem ocupando a tela inteira com `background-size: cover`
- Caixa central escura com `opacity` e `border-radius`, garantindo leitura sobre a imagem
- Botão circular com `border-radius: 50%` e retorno visual no `:hover`
- Campo de busca com largura calculada por `calc(100% - 100px)`, para o botão caber ao lado
- Reset inicial com `* { margin: 0; padding: 0; box-sizing: border-box; }`

---

## 🚀 Melhorias futuras

- [ ] Tratar cidade não encontrada — hoje, um nome inválido não exibe mensagem de erro
- [ ] Permitir buscar apertando **Enter**, além do clique na lupa
- [ ] Trocar a imagem de fundo: o serviço `source.unsplash.com` foi descontinuado
- [ ] Exibir sensação térmica, velocidade do vento e previsão dos próximos dias
- [ ] Mostrar um indicador de carregamento enquanto a resposta não chega
- [ ] Guardar a última cidade pesquisada e carregá-la ao abrir a página
- [ ] Publicar na Vercel ou Netlify com link de demonstração

---

<div align="center">

Desenvolvido por **[Letícia Narciso](https://github.com/Leticianarc)** ·
[LinkedIn](https://www.linkedin.com/in/leticianarciso/)

</div>
