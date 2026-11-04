# RD Busca SENAI

Nova interface de busca para os [Recursos Didáticos do SENAI](https://recursosdidaticos.senai.br/), com navegação por **Curso → Unidade Curricular → Tipo de material**.

Ao clicar num recurso, o usuário é levado para `https://recursosdidaticos.senai.br/recurso-didatico/{id}`, onde o download é feito no RD tradicional.

## Status

**MVP em HTML** para refinamento e validação. Depois de validado, o projeto será empacotado como **SCORM**.

## Estrutura

```
index.html          página principal
css/styles.css      estilos (tokens do Design System SENAI)
js/app.js           busca, filtros e renderização
data/recursos.js    base de recursos (window.RD_RECURSOS)
```

## Como rodar

Abra o `index.html` direto no navegador. Não precisa de build nem de servidor.

## Base de recursos

Edite o arquivo `data/recursos.js`. Cada item tem esta forma:

```js
{ id: 19013, titulo: "Plano de ensino", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "plano-ensino" }
```

Os tipos aceitos estão em `TIPOS`, no arquivo `js/app.js`: `plano-ensino`, `plano-aula`, `situacao-aprendizagem`, `livro`, `scorm`, `video` e `fontes`.

> Os dados atuais são de exemplo e precisam ser substituídos pela lista oficial.

## Design System

As cores e a tipografia seguem o [Design System SENAI](https://zeroheight.com/5ff6f5b91/p/71f235-instalacao-da-biblioteca) (`design-system-senai-angular/styles`):

- primária: laranja `#f5631a`
- secundária: azul `#1670fa`
- fontes: Neo Sans Pro nos títulos e Open Sans no texto
- modo escuro pela classe `.dark`
