# Como editar o quiz do Banner 2

O conteúdo do quiz fica em `src/content/site.json`, dentro de:

`pages` → `banner2` → `quiz`

## Alterar uma pergunta

Cada item de `questions` possui:

- `id`: identificador único, sem espaços ou acentos;
- `text`: texto da pergunta;
- `options`: lista de respostas possíveis;
- `correct: true`: marca a resposta correta.

Cada pergunta deve ter pelo menos duas opções e exatamente uma resposta com `correct: true`.

## Adicionar uma pergunta

Copie uma pergunta existente, altere o `id`, o texto e as opções. A quantidade total, a barra de progresso e a mensagem de pontuação são atualizadas automaticamente.

## Alterar as mensagens finais

As mensagens ficam em `results`. O campo `minRatio` indica a porcentagem mínima de acertos para usar aquela mensagem:

- `1`: acertou tudo;
- `0.75`: acertou pelo menos 75%;
- `0.5`: acertou pelo menos metade;
- `0.01`: acertou pelo menos uma pergunta;
- `0`: não acertou nenhuma.

Também podem ser alterados o título (`heading`), a mensagem (`message`), a quantidade de estrelas (`stars`) e a comemoração (`celebration`).
