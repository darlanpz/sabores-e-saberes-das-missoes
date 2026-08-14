# Como editar os pratos dos alunos do Banner 5

Os pratos ficam em `src/content/site.json`, dentro de:

`pages` → `banner5` → `blocks` → bloco com `type: "studentRecipes"` → `items`.

## Campos de cada prato

- `id`: identificador único, sem espaços ou acentos.
- `title`: nome do prato.
- `student`: nome do aluno ou da aluna.
- `images`: lista de imagens com `src` e texto alternativo `alt`.
- `description`: lista de parágrafos exibidos no modal.

## Imagens

As imagens ficam em `public/img/banner5/alunos` e são referenciadas no JSON por caminhos iniciados com `/img/banner5/alunos/`.

Use arquivos WebP para manter a página leve, principalmente em celulares.
