# RD Busca SENAI

Uma nova forma de buscar os [Recursos Didáticos do SENAI](https://recursosdidaticos.senai.br/) (RD): a pessoa escolhe o **curso**, depois a **unidade curricular** e chega aos **materiais**, com o departamento que publicou e a data de atualização à vista.

> O RD tem o material. O difícil é achar o material certo.

A busca não substitui o RD. Ao clicar num recurso, a pessoa vai para `https://recursosdidaticos.senai.br/recurso-didatico/{id}` e faz o download lá, como sempre.

---

## A dor que o projeto resolve

O acervo do RD é grande, e isso é ótimo: são **quase 30 mil recursos públicos**, **605 cursos** e **29 departamentos** publicando. O problema está na hora de encontrar o que se precisa:

| Situação no RD | O que acontece |
| --- | --- |
| A busca não guia pelo curso e pela UC | A pessoa precisa saber o nome exato do material ou percorrer listas enormes |
| Existem várias versões do mesmo curso | Ela baixa o material de uma versão antiga |
| Muitos materiais têm nomes parecidos | Ela baixa o arquivo errado |
| Um DR republica o material de outro com pequenas mudanças | Ela baixa a cópia em vez do original de quem desenvolveu |

Os números vêm do próprio relatório do RD: **746 nomes de material aparecem publicados por mais de um DR**, e um só curso (Técnico em Automação Industrial) tem material de **19 DRs diferentes**.

Ter várias versões não é o problema. O problema é a busca não ajudar a diferenciar. O resultado é retrabalho, curso ofertado com material desatualizado, cópias de segunda mão circulando e o esforço de quem desenvolveu se perdendo.

### Como a nova busca responde a isso

| Dor | Resposta |
| --- | --- |
| Não sei por onde começar | Caminho guiado: **Curso → Unidade curricular → Materiais** |
| Não sei o nome exato | Sugestões enquanto digita, siglas (SA, PE, CLP, NR…), plural, acento e erro de digitação tolerados |
| Versão antiga ou cópia de outro DR | Cada card mostra **o DR que publicou** e **a data de atualização**, e dá para filtrar por departamento |
| Busca que não acha nada | O resultado vazio explica o motivo e sugere o próximo passo, já com a quantidade de resultados |
| Preciso mandar para alguém | Os filtros ficam na URL, então o link já vai com a busca pronta |

---

## Por que tão simples

O projeto é, de propósito, **um HTML, um CSS, um JS e um arquivo de dados**. Sem framework, sem build, sem servidor, sem banco.

- **Abre com dois cliques.** Basta abrir o `index.html` no navegador. Isso facilita demonstrar, testar e validar com a coordenação e com os DRs.
- **Cabe num pacote SCORM.** O próximo passo é empacotar a busca como SCORM e publicá-la dentro do próprio RD. Um SCORM é só uma pasta de arquivos estáticos, e esse projeto já é exatamente isso.
- **Não depende da TI para ir ao ar.** A hospedagem oficial exige validar e preparar um ambiente, o que leva semanas. Arquivos estáticos rodam em qualquer lugar, inclusive no RD.
- **Quase não tem manutenção.** Não há dependências para atualizar nem vulnerabilidades de pacote para corrigir. Atualizar a base é rodar um script.
- **É rápido.** Os ~30 mil recursos são carregados uma vez e toda a busca acontece no navegador, sem ir à rede a cada tecla.

## Por que esta stack

| Peça | Escolha | Motivo |
| --- | --- | --- |
| Interface | HTML + CSS + **JavaScript puro** | Roda em qualquer navegador e dentro do SCORM, sem etapa de build e sem dependências |
| Dados | `data/recursos.js` (JSON atribuído a `window.RD_DATA`) | Carrega com uma tag `<script>`, então funciona até abrindo o arquivo direto do disco (`file://`), onde um `fetch()` de JSON seria bloqueado |
| Geração da base | **Python 3 + `openpyxl`** | Lê o `.xlsx` exportado do RD sem precisar do Excel e roda em qualquer máquina |
| Visual | Tokens do **Design System SENAI** | Mantém a identidade dos produtos SENAI (laranja `#f5631a`, azul `#1670fa`, Open Sans) |

---

## Como os dados saem da planilha do RD e chegam à busca

```
RD ──► Relatório de publicação de recursos (.xlsx)
         │
         ▼
   scripts/build_data.py   (Python + openpyxl)
         │  filtra, limpa, normaliza e compacta
         ▼
   data/recursos.js        window.RD_DATA = { ... }
         │  <script src="data/recursos.js">
         ▼
   js/app.js               monta índices e faz a busca no navegador
```

### 1. Exportar do RD

No RD, exporte o **Relatório de publicação de recursos** em `.xlsx`. O script lê a primeira aba e localiza as colunas **pelo nome do cabeçalho**, então a ordem das colunas pode mudar sem quebrar nada. As colunas usadas são:

`ID do Recurso`, `Recurso`, `Categoria`, `Tipo de Recurso`, `Área Tecnológica`, `Curso`, `Unidade Curricular`, `Departamentos`, `Visibilidade`, `Permite o download`, `Autoria`, `Data de Criação` e `Última Atualização`.

### 2. Gerar a base

```bash
pip install openpyxl
python scripts/build_data.py caminho/relatorio.xlsx data/recursos.js
```

Para cada linha da planilha, o `build_data.py`:

1. **Filtra:** mantém só os recursos com `Visibilidade = Público` (a interface é aberta) e descarta IDs repetidos e linhas sem título.
2. **Separa campos com vários valores:** Curso, UC, Área e Tipo vêm separados por `;` na planilha e viram listas. Valores vazios ou `-` são ignorados.
3. **Arruma a caixa dos nomes:** textos todos em maiúsculas viram caixa normal ("TÉCNICO EM MECÂNICA" vira "Técnico em Mecânica"), mantendo siglas como CLP, NR e CNC e deixando preposições em minúsculas. Cursos e UCs que só diferem na caixa são unificados.
4. **Converte o resto:** `Permite o download = Sim` vira `1`, e a data do recurso é a mais recente entre criação e atualização, no formato `AAAAMMDD`.
5. **Compacta:** cada texto repetido (curso, UC, tipo, área, departamento, autoria) é guardado **uma única vez** num dicionário, e as linhas guardam só o índice. Isso deixa o arquivo bem menor, o que importa para o pacote SCORM.

No fim ele mostra quantas linhas leu, quantos recursos gravou e o tamanho de cada dicionário.

### 3. O formato de `data/recursos.js`

```js
window.RD_DATA = {
  "geradoEm": "04/11/2026",
  "campos": ["id","titulo","cat","tipos","areas","cursos","ucs","dep","download","autor","data"],
  "dic": {
    "dep":   ["Pará", "Minas Gerais", ...],
    "cat":   ["recurso-midia", "atividade-pedagogica", ...],
    "tipo":  ["SCORM", "Vídeos", ...],
    "area":  [...], "curso": [...], "uc": [...], "autor": [...]
  },
  "rows": [
    // id,  título,               cat, tipos, áreas, cursos, ucs,   dep, download, autor, data
    [12345, "Lógica de programação", 0, [0,1],  [3],   [10],   [42,43], 6,   1,        17,    20251020],
    ...
  ]
};
```

Os números de `cat`, `tipos`, `areas`, `cursos`, `ucs`, `dep` e `autor` são posições nos arrays de `dic`. `-1` significa "não informado".

> Não edite esse arquivo à mão. Para atualizar, exporte a planilha de novo e rode o script.

### 4. Como o `js/app.js` usa os dados

Quando a página abre, o `app.js` lê `window.RD_DATA` e, uma única vez:

- **reconstrói cada recurso** a partir dos índices, trocando números por nomes;
- cria uma UC especial, **"Materiais gerais do curso (sem UC)"**, para os recursos que não têm unidade curricular;
- gera **textos normalizados** (minúsculas, sem acento) do título e dos campos, usados na busca e no cálculo de relevância;
- **conta** quantos recursos existem por curso, UC, tipo, categoria, área e departamento, para as sugestões e os filtros;
- monta um **vocabulário** com as palavras dos títulos, usado para corrigir erros de digitação.

Depois disso, buscar, filtrar, ordenar e paginar acontece tudo em memória, sem nenhuma chamada de rede.

---

## Funcionalidades

### Busca
- **Sugestões enquanto digita:** cursos, UCs, tipos, categorias, áreas e os melhores materiais. Dá para navegar com ↑ ↓ e Enter, e o atalho `/` leva para a busca. Escolher um curso ou tipo transforma a palavra em filtro e o resto continua como busca. Exemplo: "mecatrônica scorm" vira o curso *Técnico em Mecatrônica* mais a busca "scorm".
- **Sinônimos e siglas:** SA, PE, PA, PC, LD, TI, IA, RA, NR, CLP, CAD, "apostila", "prova", "slides", "jogo" e outros. A lista fica em `SINONIMOS`, no `js/app.js`.
- **Plural, gênero e acentos são ignorados:** "simuladores" encontra "simulador" e "eletrica" encontra "elétrico".
- **Correção de digitação:** "eletrotecinca" vira "eletrotécnica". A página avisa a correção e oferece "Buscar exatamente".
- **Relevância:** palavras no título valem mais do que palavras no curso ou na UC. A frase exata no título vale mais ainda.
- **Resultado vazio que ajuda:** sugere o que afrouxar (tirar um filtro, tirar uma palavra, buscar em todo o acervo), já com a quantidade de resultados de cada opção.

### Caminho guiado: Curso → Unidade curricular → Materiais
1. "Qual é o seu curso?", com autocompletar e os cursos mais procurados.
2. A visão do curso mostra o total de materiais, as categorias e blocos clicáveis com as UCs mais fortes primeiro, além de "Materiais gerais do curso" para os recursos sem UC.
3. Com a UC escolhida, os materiais aparecem agrupados por categoria.

### Filtros e resultados
- Filtros laterais combináveis com contagem: Curso, UC, Categoria, Tipo, Área, Departamento e "Somente com download liberado".
- Ordenação: relevância, agrupado por UC, agrupado por categoria, mais recentes ou A–Z. Paginação de 48 em 48.
- Card com a cor e o ícone da categoria, categoria · tipo, área tecnológica, título, UC e curso, departamento (clicável, vira filtro) e data. O ID não aparece no card, mas a busca por ID continua funcionando.
- Os filtros ficam salvos na URL (`#curso=...&uc=...`), então dá para compartilhar uma busca.
- Funciona no celular.

---

## Como rodar

Abra o `index.html` no navegador. Não precisa de build, instalação nem servidor.

## Estrutura

```
index.html               página principal
css/styles.css           estilos (tokens do Design System SENAI)
js/app.js                busca, filtros e renderização
data/recursos.js         base de recursos (gerada, não editar à mão)
scripts/build_data.py    gera data/recursos.js a partir da planilha do RD
img/                     logos do SENAI e do RD
apresentacao/            slides, roteiro de fala e prints do projeto
```

## Design System

As cores e a tipografia seguem o [Design System SENAI](https://zeroheight.com/5ff6f5b91/p/71f235-instalacao-da-biblioteca) (`design-system-senai-angular/styles`):

- primária: laranja `#f5631a`
- secundária: azul `#1670fa`
- fontes: Neo Sans Pro nos títulos e Open Sans no texto
- apenas tema claro

## Status e próximos passos

- [x] MVP em HTML, usando a base real do RD
- [x] Apresentação para a coordenação (`apresentacao/`)
- [ ] Testes com alguns DRs
- [ ] Empacotar como **SCORM** e publicar no próprio RD, gerando um link compartilhável para os DRs
