# Sabores e Saberes das Missões

Site da exposição sobre os patrimônios alimentares da região das Missões.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

| Rota | O que é |
|---|---|
| `/` | **Home** — abertura da exposição e grade de acesso aos banners |
| `/styleguide/` | **Biblioteca de componentes** — cada peça é o componente real, não uma reprodução |
| `/banner1/` | Primeira página do site, gerada a partir do JSON de conteúdo |
| `/banner2/` | Segunda página — vídeo em largura total e coluna direita que cola na rolagem |
| `/banner3/` | Terceira página — vídeo dentro da coluna direita |
| `/banner4/` | Quarta página — linha do tempo em painel, coluna esquerda que cola na rolagem |
| `/banner5/` | Quinta página — trabalhos dos alunos e encerramento da exposição |

## Onde mexer no conteúdo

Todo o texto, imagem e ordem de blocos do site vive em **`src/content/site.json`**. Não há conteúdo
escrito à mão em arquivo de página — o HTML é gerado a partir desse JSON.

Para adicionar uma página: uma entrada em `pages`, um `<slug>/index.html` de 12 linhas com
`data-page="<slug>"`, e uma linha em `vite.config.js`.

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera `dist/` |
| `npm run preview` | serve o build |
| `npm run dimensoes` | remede as imagens — rodar após acrescentar ou trocar alguma |
| `npm run check` | dimensões + build + verificações automáticas |

## O que `npm run check` verifica

- Todos os ícones referenciados existem no Feather
- Nenhum componente lança ao renderizar, e nada de `undefined` vaza para o HTML
- Todo botão só de ícone tem `aria-label`; todo ícone decorativo tem `aria-hidden`
- A página monta com as 9 seções e o sumário
- O pattern e o hero são servidos em WebP, o filtro `screen` está aplicado
- O anel de foco e o `prefers-reduced-motion` existem no CSS final
- O player tem `<audio>` real, trilha em `input[type=range]`, tooltips e controles desabilitados por padrão
- Todo tipo de bloco do JSON existe no renderizador e renderiza sem lançar
- **Todo arquivo referenciado no JSON existe em `public/`** — link quebrado reprova o build
- Cada página declarada no JSON tem seu HTML de entrada apontando para o slug certo
- **Nenhuma cor fora da paleta** aparece no CSS — as 4 da marca, as 3 semânticas e preto/branco puros são
  as únicas permitidas, e é isso que impede hardcode de entrar sem token

## Estrutura

```
.spec/style-guide.md   # fonte da verdade: tokens, componentes, regras
src/
  main.js              # monta a biblioteca de componentes
  components/          # navigation, button, content, media, footer, icon
  styles/
    tokens.css         # todos os design tokens
    base.css           # reset, pattern de fundo, anel de foco
    styleguide.css     # cromo da página de demonstração
    components/        # um arquivo por componente
public/
  img/                 # WebP exportados do Figma
  icons/               # logo, detalhes-linha, audio-description
scripts/               # verificações do npm run check
```

## Regras que não se negociam

Estão todas em [`.spec/style-guide.md`](.spec/style-guide.md), mas as três que mais quebram na prática:

1. **Nada de `mix-blend-mode` em imagem de conteúdo.** As artes precisam ser exportadas com
   transparência de verdade (PNG com alfa → WebP com `alphaQuality: 100`). Arte com fundo preto chapado
   se resolve pedindo a versão transparente, não com blend.
2. **Ícones vêm sempre do Feather.** As variantes fill sobrescrevem `fill` e `stroke` — Feather é outline
   por natureza. O selo de audiodescrição é a única exceção (asset próprio).
3. **Nenhum valor hardcoded.** Cores, espaçamento, tipografia e raios saem de `tokens.css`.
   O `npm run check` reprova cor fora da paleta.
