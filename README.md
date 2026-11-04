# RD Busca SENAI

Nova interface de busca para os [Recursos Didáticos do SENAI](https://recursosdidaticos.senai.br/), com navegação por **Curso → Unidade Curricular → Tipo de material**.

Ao clicar num recurso, o usuário é levado para `https://recursosdidaticos.senai.br/recurso-didatico/{id}`, onde o download é feito no RD tradicional.

## Status

**MVP em HTML** para refinamento e validação. Depois de validado, o projeto será empacotado como **SCORM**.

## Estrutura

```
index.html             página principal
css/styles.css         estilos (tokens do Design System SENAI)
js/app.js              busca, filtros e renderização
data/recursos.js       base de recursos (gerada, não editar à mão)
scripts/build_data.py  gera data/recursos.js a partir da planilha do RD
```

## Como rodar

Abra o `index.html` direto no navegador. Não precisa de build nem de servidor.

## Atualizar a base de recursos

1. No RD, exporte o **Relatório de publicação de recursos** (.xlsx).
2. Rode o comando abaixo (precisa de Python 3 com `openpyxl`):

```
python scripts/build_data.py caminho/relatorio.xlsx data/recursos.js
```

O script:

- mantém só os recursos com **Visibilidade = Público**, porque a interface é aberta;
- separa os campos com vários valores (`;`) em Curso, UC, Área e Tipo;
- deixa em caixa normal os nomes que vêm todos em maiúsculas ("TÉCNICO EM MECÂNICA" vira "Técnico em Mecânica");
- grava textos repetidos uma vez só, em dicionários, para o arquivo ficar menor.

Colunas usadas: `ID do Recurso`, `Recurso`, `Categoria`, `Tipo de Recurso`, `Área Tecnológica`, `Curso`, `Unidade Curricular`, `Departamentos`, `Visibilidade`, `Permite o download`, `Autoria`, `Data de Criação` e `Última Atualização`.

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
- Card com a aba do ícone na cor da categoria, categoria · tipo, área tecnológica, título, UC e curso, departamento (clicável, vira filtro) e data. O ID não aparece no card, mas a busca por ID continua funcionando.
- Os filtros ficam salvos na URL (`#curso=...&uc=...`), então dá para compartilhar uma busca.

## Design System

As cores e a tipografia seguem o [Design System SENAI](https://zeroheight.com/5ff6f5b91/p/71f235-instalacao-da-biblioteca) (`design-system-senai-angular/styles`):

- primária: laranja `#f5631a`
- secundária: azul `#1670fa`
- fontes: Neo Sans Pro nos títulos e Open Sans no texto
- apenas tema claro
- logos em `img/` (`senai-logo.png` e `rd-logo.png`)
