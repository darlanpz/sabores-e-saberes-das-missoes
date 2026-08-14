# Como editar as receitas do Banner 4

As receitas ficam em `src/content/site.json`, dentro de:

`pages` → `banner4` → `blocks` → bloco com `type: "recipes"` → `items`

## Campos de cada receita

- `id`: identificador único, sem espaços ou acentos;
- `title`: nome exibido no catálogo e no modal;
- `images`: imagens da receita;
- `ingredients`: um ou mais grupos de ingredientes;
- `preparation`: um ou mais grupos de etapas;
- `note`: observação opcional.

Cada ingrediente possui `amount` (quantidade), `unit` (unidade) e `item` (descrição). Cada grupo de preparo possui um título opcional e uma lista `steps`.

## Adicionar ou trocar imagens

Coloque o arquivo em `public/img/receitas` e informe no JSON um caminho iniciado por `/img/receitas/`.

Depois de acrescentar uma imagem, execute `npm run dimensoes` para registrar sua largura e altura. Isso evita que o catálogo se movimente enquanto as imagens carregam.

O catálogo usa a primeira imagem de `images` como capa. Quando houver mais imagens, todas aparecem no modal da receita.
