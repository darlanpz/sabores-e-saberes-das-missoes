# Style Guide — Sabores e Saberes

> Tudo que estiver aqui é a fonte da verdade para implementação.
> Se o código divergir deste documento, o código está errado (ou este documento precisa ser atualizado).

| | |
|---|---|
| **Versão** | 0.2 |
| **Última atualização** | 01/08/26 |
| **Responsável** | Darlan Paz |
| **Arquivo Figma** | https://www.figma.com/design/D1bDcirbClEohXxg7nlUZu/Site-Sabores-e-Saberes?node-id=0-1&p=f&t=ASv9EWjLbHjbjdcY-0 |

**Telas no Figma**

| Tela | Desktop (1280) | Mobile (402) |
|---|---|---|
| Home | `1:64` | `1:65` |
| Banner 1 | `1:73` | `1:74` |
| Banner 2 | `1:75` | `1:76` |
| Banner 3 | `1:77` | `1:78` |
| Banner 4 | `1:79` | `1:80` |
| Banner 5 | `1:81` | `1:82` |
| Modal Revista/Quadrinho | `6:1694` | `6:1902` |

**Componentes no Figma:** `Logo` `1:87` · `menu-item` `1:143` · `Menu-button` `1:298` · `Audiodescription` `1:1355`

---

## 1. Identidade

**Regras de escrita**

- Idioma: pt-BR
- Capitalização de títulos: sentence case
- Uso de emoji: nunca, apenas se solicitado
- Números, datas e moeda: `R$ 1.234,56`, `01/08/2026`

---

## 3. Cores

### 3.1 Paleta principal

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#19120D` | Fundo, Cards, Icones |
| `--color-secondary` | `#4A3427` | Cards primários, sections |
| `--color-accent` | `#E8C37D` | Elementos de destaque, Botões, Títulos |
| `--color-text` | `#F7EBD8` | Corpo de texto, Elementos de menor destaque |

### 3.2 Derivados e overlays

Não existem tokens próprios no Figma para estes casos — são sempre uma das cores acima com opacidade.

| Token | Valor | Uso |
|---|---|---|
| `--color-text-muted` | `--color-text` @ `70%` | Autor/legenda dos cards |
| `--color-overlay` | `rgba(0, 0, 0, 0.4)` | Fundo do modal |
| `--color-overlay-soft` | `rgba(0, 0, 0, 0.2)` | Véu sobre o pôster do vídeo |
| `--color-scrim` | `--color-primary` @ `40%` | Fundo do play central do vídeo |
| `--color-scrim-strong` | `--color-primary` @ `90%` | Base do degradê da barra de controles |
| `--color-border-subtle` | `rgba(247, 235, 216, 0.2)` | Contorno dos botões-pílula do modal |
| `--color-track` | `--color-primary` @ `50%` | Trecho já reproduzido da trilha do player |
| `--color-icon-disabled` | opacidade `40%` no ícone | Controles de mídia inativos |
| `--pattern-opacity` | `20%` | Pattern de fundo do body |
| `--logos-opacity` | `90%` | Logos dos apoiadores no rodapé |

### 3.3 Semânticas

Três cores de estado — vermelho, verde e amarelo — desenhadas para conversar com a marca. Elas **não** são
tons genéricos de sistema: ficam no mesmo território quente e terroso do accent, variando principalmente o
matiz.

| Token | Valor | HSL | Papel |
|---|---|---|---|
| `--color-danger` | `#E06552` | `hsl(8, 70%, 60%)` | Erro — vermelho de telha/cerâmica |
| `--color-warning` | `#EA9D2A` | `hsl(36, 82%, 54%)` | Atenção — ocre/âmbar |
| `--color-success` | `#9BBF69` | `hsl(85, 40%, 58%)` | Sucesso — verde-sálvia/oliva |
| — | `#E8C37D` | `hsl(39, 70%, 70%)` | (o accent da marca, para referência) |

**Por que estas e não outras**

- **Claridade e saturação na faixa do accent** (L 54–60%, S 40–82% contra L 70%, S 70% do accent). Nenhuma
  delas "salta" da tela como um vermelho ou verde puro de sistema saltaria.
- **Matizes espaçados**: 8° · 36° · 85°. Distância suficiente para não se confundirem entre si.
- **Todas quentes** (nenhuma acima de 85°), o que mantém a leitura de terra, cerâmica e campo missioneiro.
- O verde é puxado para o **oliva** (matiz 85, saturação baixa) em vez de um verde-menta, para não brigar
  com a paleta.

⚠️ **Atenção fica visualmente próxima do accent** (36° vs 39°). É inevitável, porque o accent da marca já é
um dourado. Separam-se pela saturação e claridade — o accent é um dourado pálido e cremoso, `--color-warning`
é um ocre saturado. Por isso **atenção nunca aparece sem o ícone `alert-triangle`**.

**Como aplicar**

A cor semântica vai no **ícone e na borda**. A superfície continua `--color-secondary` e o texto continua
`--color-text` — que já tem 9,9:1 ali. Isso mantém a legibilidade independente do estado e evita quatro
combinações de texto para verificar.

| Estado | Superfície | Borda | Texto | Ícone (Feather) |
|---|---|---|---|---|
| Sucesso | `--color-secondary` | `1px --color-success` | `--color-text` | `check-circle` |
| Atenção | `--color-secondary` | `1px --color-warning` | `--color-text` | `alert-triangle` |
| Erro | `--color-secondary` | `1px --color-danger` | `--color-text` | `alert-circle` |
| Informação | `--color-secondary` | `1px --color-text` @20% | `--color-text` | `info` |

Informação usa o neutro de propósito: é o estado mais silencioso, e usar o accent aqui o deixaria confundível
com atenção.

```css
--color-danger:  #e06552;
--color-warning: #ea9d2a;
--color-success: #9bbf69;

--color-feedback-surface: var(--color-secondary);
--color-feedback-fg:      var(--color-text);
--color-info:             var(--color-text);
```

Cor continua não sendo o único indicador de estado ([3.4](#34-regras)): o ícone é obrigatório em todos os
quatro casos.

### 3.4 Regras

- Contraste mínimo: **4.5:1** para texto normal, **3:1** para texto grande e elementos de UI.
- Cor nunca é o único indicador de estado (usar ícone ou texto junto).
- Modo escuro: não

### 3.5 Contrastes verificados

| Combinação | Ratio | Situação |
|---|---|---|
| `--color-text` sobre `--color-primary` | 15.7:1 | OK |
| `--color-text` sobre `--color-secondary` | 9.9:1 | OK |
| `--color-accent` sobre `--color-primary` | 11.0:1 | OK |
| `--color-accent` sobre `--color-secondary` | 6.9:1 | OK |
| `--color-primary` sobre `--color-accent` (botão) | 11.0:1 | OK |
| `--color-text` @70% sobre `--color-primary` | 8.0:1 | OK |

**Cores semânticas**

| Cor | Sobre `--color-primary` | Sobre `--color-secondary` |
|---|---|---|
| `--color-success` `#9BBF69` | 8.9:1 — OK para texto | 5.6:1 — OK para texto |
| `--color-warning` `#EA9D2A` | 8.3:1 — OK para texto | 5.2:1 — OK para texto |
| `--color-danger` `#E06552` | 5.4:1 — OK para texto | 3.4:1 — **só ícone, borda e texto grande** |

O vermelho é o único que não alcança 4,5:1 sobre `--color-secondary`. Como o texto do bloco de feedback é
sempre `--color-text`, isso não é um problema no uso previsto — mas **não use `--color-danger` como cor de
texto corrido dentro de um painel**. Sobre o fundo da página (`--color-primary`) ele passa e pode ser texto.

Todas as demais combinações passam em AAA. Calculado sobre o fundo sólido — o pattern a 20% clareia o fundo
de forma desprezível e não altera o resultado.

---

## 4. Tipografia

### 4.1 Famílias

| Papel | Fonte | Peso disponíveis | Fallback |
|---|---|---|---|
| Títulos | Cinzel | Regular, Bold | `Georgia, 'Times New Roman', serif` |
| Corpo | Source Sans 3 | Regular, Medium, Bold | `system-ui, -apple-system, 'Segoe UI', sans-serif` |

> Cinzel é usada **apenas em Bold** em todo o layout. Source Sans 3 usa Regular para texto corrido e
> Medium para rótulos de lista/seção.

### 4.2 Escala

| Token | Fonte | Desktop | Mobile | Line-height | Peso | Uso |
|---|---|---|---|---|---|---|
| `--text-h1` | Cinzel | `36px` | `24px` | `1.1` | Bold | Título principal de cada banner |
| `--text-h2` | Cinzel | `24px` | `20px` | `1.4` | Bold | Frase de destaque / citação |
| `--text-h3` | Cinzel | `20px` | `20px` | `1.1` | Bold | Títulos do rodapé ("ACESSIBILIDADE", "Apoiadores") |
| `--text-body` | Source Sans 3 | `20px` | `16px` | `1.5` | Regular | Texto corrido |
| `--text-card-title` | Source Sans 3 | `20px` | `16px` | `1.2` | Regular | Título de item/card |
| `--text-label` | Source Sans 3 | `20px` | `16px` | `1` | Medium | Rótulo de seção e de lista |
| `--text-action` | Source Sans 3 | `20px` | `20px` | `1` | Regular | Texto de botão e item de menu (`text-transform: capitalize`) |
| `--text-meta` | Source Sans 3 | `16px` | `16px` | `1.5` | Regular | Autor, legenda (opacidade 70%) |
| `--text-small` | Source Sans 3 | `16px` | `14px` | `1.4–1.5` | Regular | Rodapé e rótulo do player |

### 4.3 Regras

- Largura máxima de linha: 60 caracteres
- Hierarquia: apenas um `h1` por página.
- Texto nunca abaixo de `16px` — a única exceção no Figma é o rodapé mobile (`14px`), tolerada por ser conteúdo secundário.
- `--text-action` **não** reduz no mobile (mantém 20px) para preservar a área de toque do botão.
- Cinzel é fonte de caixa alta por desenho: não aplicar `text-transform: uppercase` por cima.
- `--text-action` e `--text-label` usam `line-height: 1` porque são sempre uma linha; nunca aplicar a texto que quebra.

---

## 5. Espaçamento e layout

### 5.1 Escala de espaçamento

Base: `4px`. O número do token é o multiplicador (`--space-3` = 3 × 4px = 12px).

| Token | Valor | Onde aparece |
|---|---|---|
| `--space-1` | `4px` | ajustes finos |
| `--space-2` | `8px` | gap entre controles de mídia |
| `--space-3` | `12px` | gap ícone↔texto, padding de item de lista |
| `--space-4` | `16px` | padding mobile, gap dentro de bloco de texto |
| `--space-5` | `20px` | padding horizontal do `menu-item` |
| `--space-6` | `24px` | padding de card/painel, gap entre blocos |
| `--space-8` | `32px` | — |
| `--space-10` | `40px` | — |
| `--space-12` | `48px` | padding lateral desktop, gap entre seções |
| `--space-15` | `60px` | gap entre logos dos apoiadores (desktop) |

> **Mudança em relação à v0.1:** `--space-3` passou de 16px para 12px. O Figma usa 12px em toda parte
> (gap ícone↔texto, padding de item de lista) e a escala anterior não conseguia representar esse valor.
> Ver [Registro de decisões](#13-registro-de-decisões).

### 5.2 Grid e container

- Largura máxima do container: 1280px desktop
- Colunas: 12 desktop / 4 mobile
- Gutter: 24px desktop / 16px mobile
- Padding lateral: 48px desktop / 16px mobile
- **Largura útil de conteúdo:** 1184px desktop (1280 − 2×48) / 370px mobile (402 − 2×16)

**Layout de banner (desktop)** — duas colunas assimétricas com `gap: 24px`:

| Coluna | Largura | Conteúdo |
|---|---|---|
| Esquerda | `459px` | Texto, imagens ilustrativas, frase de destaque |
| Direita | `711px` | Painel de conteúdo (`--color-secondary`, radius 24) |

As duas rolam junto com a página. **Sem `sticky`**: a coluna de texto é mais alta que o painel, então
ela definiria sozinha a altura da linha do grid e ficaria sem curso para percorrer. Fazer o `sticky`
pegar exigiria limitar a altura dela e criar uma rolagem interna, o que ficou pior do que o problema.

No mobile as duas colunas empilham em uma só (370px), **com o painel de conteúdo acima do texto**, e o
sticky não se aplica.

> No Figma há pequenas imprecisões de posicionamento (o player de audiodescrição está em `left: 45px` /
> `right: 52px`, e as colunas somam 1194px em vez de 1184px). **Normalizar tudo para 48px de padding e
> 1184px de conteúdo** na implementação.

### 5.3 Breakpoints

| Nome | Min-width | Observações |
|---|---|---|
| `sm` | `512px` | |
| `md` | `768px` | Troca header mobile → desktop |
| `lg` | `1024px` | Layout de banner passa a 2 colunas |
| `xl` | `1280px` | Container atinge largura máxima |

Abordagem: mobile-first

---

## 6. Bordas, sombras e elevação

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `8px` | Botões, trilha do player |
| `--radius-md` | `12px` | Cards de item, botão play grande |
| `--radius-lg` | `24px` | Painéis/colunas, topo do player de audiodescrição |
| `--radius-full` | `999px` | Pílulas (navegação do modal), avatares |

**Sombras**

| Token | Valor | Uso |
|---|---|---|
| `--shadow-modal` | `0 0 14px rgba(0, 0, 0, 0.25)` | Páginas da revista/quadrinho no modal |
| `--shadow-dock` | `0 -8px 32px rgba(0, 0, 0, 0.45)` | Player de audiodescrição |

A hierarquia do layout vem da cor de fundo (`primary` → `secondary`), não de elevação. As sombras existem
só onde uma peça precisa flutuar sobre outra.

O `--shadow-dock` tem deslocamento **negativo**: o player fica ancorado na base da viewport, e a sombra
precisa cair sobre o conteúdo que passa por baixo dele.

⚠️ Sombra preta sobre fundo quase preto quase não aparece. O que faz o volume ler é a **borda clara no
topo** que acompanha o token: `inset 0 1px 0 rgba(247, 235, 216, 0.1)` — um vinco de luz na aresta
superior. Ao criar outra peça flutuante, repetir os dois.

---

## 7. Iconografia

- Biblioteca: **Feather Icons** — sempre. Ícones de outras bibliotecas que aparecem no Figma devem ser substituídos pelo equivalente Feather (tabela abaixo).
- Estilo: outline por padrão; **fill** apenas nos casos marcados na tabela.
- Tamanhos padrão: `24`, `48`, `72`
- Espessura do traço: `1.5`
- Cor: herda de `currentColor` — `--color-accent` sobre fundo escuro, `--color-primary` dentro de botão accent.
- Regra: ícones decorativos recebem `aria-hidden="true"`; ícones funcionais recebem rótulo acessível.

### 7.1 Ícones em uso

| Onde | Ícone Feather | Preenchimento | Observação |
|---|---|---|---|
| Botão play (player, quiz) | `play` | **fill** | |
| Botão parar | `stop-circle` | outline | |
| Repetir | `repeat` | outline | |
| Marcador da trilha do player | `circle` | **fill** | |
| Navegação de páginas do modal | `fast-forward` | **fill** | Espelhado horizontalmente para "anterior" |
| Botão "Ler dissertação" / "Ler trabalho" | `file-text` | outline | |
| Menu hambúrguer (mobile) | `menu` | outline | 3 traços de 24px, gap 10px |
| Menu aberto (mobile) | `x` | outline | |
| Pesquisas científicas | `search` | outline | Substitui `ri:search-ai-3-line` |
| Vídeos | `video` | outline | Substitui `ri:video-ai-line` |
| Entrevistas | `message-circle` | outline | Substitui `ri:chat-1-line` |
| Receitas | `file-text` | outline | Substitui `ri:file-paper-line` |
| Materiais educativos | `book-open` | outline | Substitui `ri:book-read-line` |
| Selo de audiodescrição | — | — | `fa:audio-description` (Font Awesome). **Não tem equivalente no Feather** — exportar como SVG do Figma e versionar como asset próprio. |

### 7.2 Como aplicar fill

Feather é uma biblioteca outline: os ícones vêm com `fill="none" stroke="currentColor"`. Para as variantes fill,
sobrescrever ambos:

```css
.icon--fill {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.5;
}
```

---

## 8. Imagens e mídia

### 8.1 Regras gerais

- Todas as imagens estão marcadas como exportáveis no Figma — exportar de lá, nunca recriar.
- Proporções permitidas: cover sempre (`object-fit: cover`)
- Formato: **WebP** para imagens, **MP4 (H.264)** para vídeo
- Assets ficam em `public/img/` (fotos, logos, pattern) e `public/icons/` (SVGs próprios)
- Exportar do Figma a **2× a altura de exibição** e converter para WebP antes de versionar
- `alt` obrigatório em toda imagem de conteúdo; decorativas usam `alt=""`. Escrever o `alt` descrevendo a cena, não o arquivo.
- Lazy loading padrão, exceto na primeira dobra

### 8.2 Transparência — sem blend

**Não usar `mix-blend-mode` em imagem de conteúdo.**

O Figma usa `screen` porque as artes lá têm fundo preto: a mesclagem é o truque que faz esse fundo
desaparecer. **As artes entregues para o site têm transparência de verdade** (canal alfa), então elas já
se integram ao fundo sozinhas — e o blend, além de desnecessário, clareia levemente as cores ao mesclá-las
com o fundo.

O requisito muda de lugar: em vez de uma regra de CSS, é **um requisito de exportação**.

- Exportar **em PNG com fundo transparente**, nunca com fundo preto chapado
- Converter para **WebP mantendo o canal alfa** (`alphaQuality: 100`, para o esmaecimento das bordas não
  ganhar degraus)
- As bordas que precisam se dissolver no fundo já devem vir esmaecidas no arquivo

**Exceção declarada, quando a arte ainda não veio tratada**

Algumas artes chegam com halo claro em volta em vez de transparência. Para essas, o blend volta — mas
**por imagem, escrito no JSON**, nunca como regra geral:

```json
{ "type": "image", "src": "…", "alt": "…", "blend": "screen" }
```

É o caso da fogueira do Banner 2. Preferir sempre pedir a arte com transparência; a exceção existe para
não travar a página enquanto isso não acontece.

**Cantos arredondados**

`"rounded": true` aplica `--radius-md` (12px) à imagem. É para as artes que ocupam **uma caixa própria**;
as que se dissolvem no fundo não levam radius, porque não têm borda visível para arredondar.

O `mix-blend-mode: multiply` do vinco central do [Flipbook](#flipbook) continua — ali a mesclagem é o
efeito em si, não um contorno de fundo.

### 8.3 Pattern de fundo (body)

O fundo de todas as páginas é o pattern losangular sobre `--color-primary`, a 20% de opacidade.

```css
/* A cor de fundo vai no HTML, não no body — ver o aviso abaixo. */
html {
  background-color: var(--color-primary);
}

body {
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.2;
  background-image: url("/img/pattern-missoes.webp");
  background-repeat: repeat;
  background-size: 1270px 1072px;
  background-position: top left;
}
```

⚠️ **A cor de fundo tem que ficar no `html`, nunca no `body`.** O pattern é um pseudo-elemento com
`z-index: -1`, e a ordem de pintura do CSS coloca as camadas negativas **antes** do fundo do body — um
fundo opaco ali cobriria o pattern por inteiro, em todas as páginas. Com a cor no `html`, a sequência
fica: fundo do html → pattern → conteúdo.

Isso é fácil de reintroduzir sem perceber, então `npm run check` reprova se o `body` voltar a declarar
`background-color`.

- Tile original: `1269.76 × 1072.29px` — arredondar para `1270 × 1072`.
- Servir o arquivo **exatamente em 1270 × 1072** (não em 2×): é uma textura de baixo contraste a 20% de
  opacidade, e a versão 2× triplica o peso sem ganho visível.
- Opacidade: `20%`. Aplicar no pseudo-elemento, nunca no `background-image` do body (não é possível).
- O pattern é decorativo: `pointer-events: none` e fora do fluxo de leitura.
- Mesmo tile e mesma escala em desktop e mobile — **não** reescalar por breakpoint.

### 8.4 Hero

Faixa de topo na **largura total da tela**, com **altura fixa de 320px**.

| Propriedade | Valor |
|---|---|
| Largura | `100%` |
| Altura | `320px` |
| Arte | entregue em `1720 × 480` |
| Ajuste | `object-fit: cover`, `object-position: center` (padrão) |
| Esmaecimento | `mask-image: linear-gradient(to bottom, #000 78%, transparent)` |

**Enquadramento por página.** A faixa sempre recorta a arte, e o campo `position` do hero decide de onde
sai a sobra. Aproximar de `top` (`"50% 0%"`) mostra mais do alto da imagem e, com isso, **empurra o
assunto para baixo** — é o que afasta as figuras do header no Banner 2.

A arte chega **já tratada**: entorno transparente e bordas esmaecendo, o que faz o hero se dissolver
sozinho no fundo da página. Por isso **o conteúdo não sobrepõe o hero** — vem logo abaixo, sem margem
negativa.

⚠️ A arte é mais alta que a faixa (`480` contra `320`), então sempre há recorte vertical. Centralizar
tira a sobra igualmente de cima e de baixo, mantendo as ruínas enquadradas. Na largura de projeto
(`1280px`) o corte é de apenas 37px; **acima de ~1720px ele cresce** e começa a comer o topo das torres.
Se isso incomodar, os caminhos são aumentar a altura da faixa ou entregar uma arte mais larga.

**Vinheta**

Como a arte já vem com ela, a versão em CSS é um modificador opcional (`.hero--vinheta`), para heros que
ainda não venham tratados — usar as duas escurece as bordas em dobro.

```css
.hero--vinheta::after {
  background: radial-gradient(
    ellipse 57% 127.5% at 50% -13.75%,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 48%,
    rgba(0, 0, 0, 1) 100%
  );
}
```

### 8.5 Moldura decorativa (Cruz de Lorena)

Algumas imagens ilustrativas dos banners são recortadas por uma máscara com o traçado da Cruz de Lorena
(o "losango riscado" que aparece em volta da chaleira e do mate).

- Exportar a máscara como SVG do Figma e aplicar via `mask-image`.
- A máscara é **maior que a caixa** da imagem: no Figma a imagem ocupa `124.28%` da largura da coluna,
  deslocada `-12.1%` à esquerda. Manter esse transbordo — é intencional.
- Combina com o `mix-blend-mode: screen` da seção 8.2.

### 8.6 Logos dos apoiadores

Especificadas no componente [`Footer`](#footer). Em resumo: altura fixa de `48px`, largura própria de
cada logo, `object-fit: contain`, opacidade de `90%` no conjunto, e `alt` com o nome da instituição.

---

## 9. Movimento

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | `100ms` | Hover, foco |
| `--duration-base` | `300ms` | Transições de componente |
| `--duration-slow` | `600ms` | Entradas de página |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Padrão |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entradas, abertura de modal |

**Regras**

- Respeitar `prefers-reduced-motion: reduce` — desativar ou reduzir animações.
- Nada de animação em loop infinito fora de indicadores de carregamento.
- O traço decorativo do `menu-item` no hover entra com `--duration-fast`.
- O modal entra com `--duration-base` + `--ease-out`; o overlay faz fade junto.

### 9.1 Revelação do conteúdo

Cada bloco **sobe 16px e aparece** quando entra em cena, em `--duration-slow` com `--ease-out`.

| Propriedade | Valor |
|---|---|
| Deslocamento | `16px` de baixo para cima |
| Duração | `--duration-slow` (600ms) |
| Escalonamento | `60ms` entre irmãos, com teto de `240ms` |
| Gatilho | `IntersectionObserver`, a 5% de visibilidade |
| Repetição | nenhuma — revela uma vez e para de observar |

O atraso é contado **por container**: cada coluna começa do zero, em vez de o painel herdar a espera
acumulada da coluna ao lado. O teto de `240ms` evita que o fim de uma lista longa fique esperando.

**O estado inicial é aplicado por JS**, não pelo CSS de partida. Se a revelação não chegar a rodar, o
conteúdo aparece sem animação em vez de ficar invisível — uma animação que falha nunca pode esconder
conteúdo.

Com `prefers-reduced-motion: reduce`, tudo aparece de imediato, sem deslocamento nem espera.

---

## 10. Componentes

> Para cada componente, documentar: variantes, tamanhos, estados e regras de uso.

### `Header`

**Descrição:** Barra no topo, sem fundo próprio — o pattern do body aparece através dela.

| Propriedade | Desktop | Mobile |
|---|---|---|
| Padding | `24px 48px` | `16px` |
| Layout | logo à esquerda, nav **encostada à direita** | logo à esquerda, botão de menu à direita |
| Botão de menu | **não existe** | 48 × 48px |
| Logo | `162 × 69px` | `99 × 42px` |

**Navegação no mobile**

Os itens vivem **dentro do botão de menu**, num painel que abre abaixo da barra.

| Propriedade | Valor |
|---|---|
| Posição | `absolute`, colada sob o header, recuada `16px` das laterais |
| Fundo | `--color-secondary` |
| Radius | `--radius-lg` |
| Sombra | `--shadow-modal` |
| Itens | empilhados, alinhados à esquerda |
| Entrada | desliza `8px` de cima e aparece, em `--duration-base` |
| Saída | o inverso, em `--duration-fast` — sair é mais rápido que entrar |

Fecha ao escolher um item, com `Esc` (devolvendo o foco ao botão) e ao clicar fora.

O painel alterna por **`visibility`, não por `display`**: `display` não é animável, e `visibility`
tira os links do alcance do teclado e do leitor de tela do mesmo jeito. O atraso na `visibility` durante
a saída (`0s linear var(--duration-fast)`) é o que segura o painel em cena até a animação terminar.

O estado mora no **header** (`data-menu="aberto"`), não no botão: o painel é irmão anterior do botão no
DOM e, por isso, não é alcançável por seletor a partir dele. O `aria-expanded` do botão continua sendo a
fonte da verdade para tecnologia assistiva — os dois são atualizados juntos.

⚠️ Este painel **não existe no Figma**; o desenho segue as convenções do sistema. Vale conferir antes de
tratar como definitivo.

⚠️ Esconder o botão no desktop precisa de especificidade acima de `.menu-button`, que é importado depois
e definiria `display: flex` por último na cascata. Vale a regra geral: **quem manda na visibilidade é o
layout que hospeda o componente, não o componente** — ver a mesma armadilha em [Tooltip](#tooltip).

**Acessibilidade:** `<header>` + `<nav aria-label="Principal">`.

---

### `Logo`

SVG único (`1:87`), cor accent. Proporção `162:69` (≈ 2.35:1). Nunca redesenhar em texto — usar o SVG exportado.
No `<h1>` da home, envolver com texto acessível oculto ("Sabores e Saberes das Missões").

---

### `menu-item`

**Variantes / estados:** `Default` · `Hover` · `Active`

| Propriedade | Valor |
|---|---|
| Padding | `16px 20px` |
| Tipografia | `--text-action` (Source Sans 3 Regular 20/1, capitalize) |
| Cor — Default | `--color-accent` |
| Cor — Hover | `--color-accent` + traço decorativo |
| Cor — Active | `--color-text` + traço decorativo |

O traço é o SVG "Detalhes linha" (pincelada dourada), ancorado na base do item, largura total, `bottom: -0.5px`.
Não substituir por `border-bottom`.

**Acessibilidade:** item ativo marcado com `aria-current="page"`. Foco visível obrigatório (o traço sozinho não basta —
ele também é o estado hover).

---

### `Menu-button` (mobile)

**Estados:** `Default` (hambúrguer) · `Active` (X)

| Propriedade | Valor |
|---|---|
| Área | `48 × 48px` |
| Ícone | 24px, traço `1.5`, cor `--color-text` |
| Default | 3 traços, espaçamento `10px` |
| Active | 2 traços cruzados a ±135° |

**Acessibilidade:** `<button aria-expanded>` + `aria-controls` apontando para o menu.

---

### `Botão primário`

Único botão do sistema. Aparece como "Ler dissertação", "Ler trabalho", "Ler quadrinho", "Responder o quiz".

| Propriedade | Valor |
|---|---|
| Fundo | `--color-accent` |
| Texto | `--color-primary`, `--text-action` (20/1, capitalize) |
| Padding | `12px 16px` |
| Radius | `--radius-sm` (8px) |
| Gap ícone↔texto | `--space-3` (12px) |
| Ícone | 24px, outline (exceto `play`, que é fill) |
| Largura | **abraça o conteúdo** — nunca 100% |

⚠️ O botão vive dentro de containers flex em coluna, onde o `align-items: stretch` padrão o esticaria
para a largura inteira. O card usa `align-items: flex-start` e devolve `width: 100%` só ao bloco de
texto. Ao criar um container novo que receba o botão, repetir isso.

**Estados** — não existem no Figma; derivados da paleta, sem introduzir tom novo:

| Estado | Fundo |
|---|---|
| Default | `--color-accent` |
| Hover | `--color-accent-hover` = `accent 85%` + `text` |
| Active | `--color-accent-active` = `accent 88%` + `primary` |
| Disabled | `--color-accent` com `opacity: 0.4` e `cursor: not-allowed` |
| Focus | anel de foco global (ver [11](#11-acessibilidade)) |

**Acessibilidade:** altura resultante = 48px (12 + 24 + 12), atende a área mínima de toque.

---

### `Botão-pílula` (navegação do modal)

| Propriedade | Valor |
|---|---|
| Contorno externo | `1px solid rgba(247,235,216,0.2)`, radius `48px`, padding `12px` |
| Miolo | `--color-accent`, radius `48px`, `48px` de largura |
| Padding do miolo | `12px 16px 12px 20px` (assimétrico, empurra o ícone para o lado da ação) |
| Ícone | `fast-forward` fill, 24px |

Ancorado nas bordas externas da revista, verticalmente a `520px` do topo do bloco.

---

### `Card de item`

O card de conteúdo dentro do painel do banner.

| Propriedade | Desktop | Mobile |
|---|---|---|
| Fundo | `--color-primary` | igual |
| Padding | `24px` | `16px` |
| Radius | `--radius-md` (12px) | igual |
| Gap interno | `24px` | `16px` |
| Título | `--text-card-title` (20/1.2) | `16/1.2` |
| Autor | `--text-meta` (16/1.5), opacidade 70% | igual |
| Gap título↔autor | `12px` | igual |

**Variante com miniatura**

| | Desktop | Mobile |
|---|---|---|
| Posição da miniatura | à esquerda do texto | **acima** do texto e do botão |
| Direção do card | linha | coluna |
| Gap | `24px` | `16px` |

No mobile a miniatura sobe: na largura estreita não sobra espaço para ela ao lado sem espremer o botão,
que não quebra linha. O card já é uma coluna por padrão — o desktop é que o vira em linha.

Fundo `--color-secondary`, radius `--radius-md`. O tamanho vem de cada card, via `thumb: { width, height }`:

| Uso | Medida |
|---|---|
| Card do quadrinho | `120 × 180` |
| Card do quiz | `120 × 120` |
| Padrão, sem medida declarada | `72 × 72` |

Enquanto não houver imagem, o bloco em `--color-secondary` é o espaço reservado.

---

### `Painel de conteúdo` (Column)

| Propriedade | Desktop | Mobile |
|---|---|---|
| Fundo | `--color-secondary` | igual |
| Padding | `24px` | `24px 16px 16px` |
| Radius | `--radius-lg` (24px) | igual |
| Gap entre cards | `24px` | `16px` |
| Largura | `711px` | `370px` |

Começa sempre com um `Cabeçalho de seção`.

**`panel__box`** — caixa interna para conteúdo que não é uma lista de cards, como a linha do tempo do
Banner 4. Mesma superfície (`--color-primary`) e mesmo raio dos cards, padding `24px` / `16px`.

---

### `Cabeçalho de seção`

Ícone 24px + rótulo `--text-label` (Source Sans 3 Medium 20/1), gap `12px`, cor `--color-text`.
Ex.: "Pesquisas e publicações científicas", "Vídeo imersivo".

---

### `Lista de tipos de conteúdo`

Item = ícone 24px + rótulo `--text-label`, gap `12px`, padding `12px`, empilhados sem gap adicional.
Usada na home do Banner 1 para explicar os QR Codes.

---

### `Text-section`

Bloco de título + parágrafo. Gap `16px`.

| Elemento | Tipografia |
|---|---|
| Título | `--text-h1` — **36px** no desktop, 24px no mobile, em accent |
| Parágrafo | `--text-body`, em `--color-text` |
| Variante de destaque | `--text-h2` sozinho, sem parágrafo |

Título e parágrafo são **os dois opcionais**: um título sozinho vira destaque, e um parágrafo sozinho
continua o bloco anterior — é o que o Banner 3 usa entre duas imagens. Sem título não sobra heading
vazio no HTML.

O título precisa declarar `--text-h1` explicitamente: o `h2` da base é menor por padrão, e serve de
sub-nível — não é o tamanho dos títulos de seção.

---

### `Audiodescription` (player)

Fixo na base da viewport, ocupando a largura do conteúdo.

**Variantes:** `Size = Default | Small`
Use `Small` no mobile, `Default` no desktop. O componente troca sozinho no breakpoint `md`; a classe
`.player--small` trava a variante Small em qualquer largura (usada na biblioteca para exibir as duas).

O player fica **ancorado na base da viewport**. Por isso o `border-radius` é **só nos cantos de cima** —
os de baixo nunca aparecem.

| Largura | Desktop | Mobile |
|---|---|---|
| Ocupação | largura do conteúdo, com recuo lateral | **de borda a borda**, sem recuo |

| Propriedade | Default (desktop) | Small (mobile) |
|---|---|---|
| Fundo | `--color-secondary` | igual |
| Radius | `24px 24px 0 0` | igual |
| Sombra | `--shadow-dock` + vinco de luz no topo (ver [6](#6-bordas-sombras-e-elevação)) | igual |
| Padding | `24px` | `16px` |
| Botão play | `72 × 72px`, radius 12, fundo accent | `48 × 48px`, radius 12, fundo accent |
| Rótulo | `16/1.4` | `14/1.4` |
| Controles secundários | `48 × 48px` | igual |

**Layout**

| | Default (desktop) | Small (mobile) |
|---|---|---|
| Direção | uma linha | empilhado |
| Ordem | `play` · `rótulo + trilha` · `parar` `repetir` | `rótulo` / `trilha` / `parar` `play` `repetir` |
| Posição do play | à esquerda, isolado | **no centro da linha de controles** |
| Vãos | 24px entre blocos, 8px entre parar e repetir | 24px entre blocos, 12px rótulo↔trilha, 24px entre controles |

O play muda de lugar entre as duas variantes, mas **o markup é um só**: a ordem do DOM é a do mobile
(rótulo, trilha, controles com o play no meio) e, no desktop, `display: contents` na linha de controles
promove os três botões a filhos diretos do player, onde `order: -1` manda o play para a esquerda.
Não duplicar markup por breakpoint.

**Trilha**

| Propriedade | Valor |
|---|---|
| Altura | `12px` |
| Radius | `--radius-sm` (8px) |
| Trecho já reproduzido | `--color-track` — `--color-primary` @ **50%** |
| Trecho restante | `--color-primary` sólido |
| Marcador | círculo de 24px em `--color-accent` |
| Área de toque | 24px de altura, mesmo com a trilha visual de 12px |

Implementar como `<input type="range">` estilizado — o range nativo entrega arrasto, teclado
(setas, Home/End) e a semântica de slider sem reimplementação. O corte entre percorrido e restante é um
`linear-gradient` com a posição vinda de uma custom property que o JS atualiza a cada `timeupdate`.

No Figma o marcador é o ícone `circle` em fill; **em código use um círculo em CSS** — é visualmente
idêntico e sobrevive ao arrasto do thumb nativo, que não aceita SVG.

**Comportamento**

A UI reage aos eventos do `<audio>` (`play`, `pause`, `ended`, `timeupdate`), **nunca ao clique
diretamente**. Assim ela continua correta quando o navegador pausa por conta própria — perda de foco,
política de autoplay, outro áudio assumindo a saída.

| Controle | Estado | Regra |
|---|---|---|
| Play/Pause | alterna `play` ↔ `pause` | O ícone segue o estado real do `<audio>` |
| Parar | habilitado **só enquanto toca** | Pausa e volta para 0:00 |
| Repetir | habilitado **enquanto toca ou depois de terminar** | Volta para 0:00 e toca |

Repetir permanece habilitado no fim de propósito: se desabilitasse junto com Parar, o áudio terminado
viraria um beco sem saída — não haveria como reproduzir de novo sem usar o Play.

Desabilitado usa a mesma opacidade de `40%` do Figma, mais `cursor: not-allowed`.

⚠️ **Não aplicar `overflow: hidden` no player**, apesar do `overflow-clip` no Figma: ele corta os tooltips
dos controles, que sobem para fora da caixa. Nenhum filho transborda os cantos arredondados, então o clip
não faz falta.

**Tempo decorrido:** `m:ss / m:ss` alinhado à direita do rótulo, em `--color-text-muted` com
`font-variant-numeric: tabular-nums` para os dígitos não dançarem.

**Acessibilidade**

- Botões com `aria-label` descritivo; o rótulo do play alterna entre "Reproduzir" e "Pausar".
- A trilha recebe `aria-valuetext` por extenso a cada atualização ("1 minuto e 12 segundos de 42 segundos"),
  porque `aria-valuenow` em porcentagem não diz nada de útil num áudio.
- Todos os três controles têm [tooltip](#tooltip) no hover e no foco.

---

### `Tooltip`

Rótulo curto para controles que só têm ícone.

| Propriedade | Valor |
|---|---|
| Fundo | `--color-primary` |
| Texto | `--color-text`, `--text-meta` (16px), line-height 1 |
| Padding | `var(--space-2) var(--space-3)` |
| Radius | `--radius-sm` |
| Posição | acima do controle, `--space-2` de distância, com setinha de 4px |
| Transição | `opacity var(--duration-fast)` |

Aparece no `:hover` **e no `:focus-visible`** — um tooltip que só responde ao mouse não existe para quem
navega por teclado.

O nome acessível continua vindo do `aria-label` do botão; o balão é um pseudo-elemento (`::after` com
`content: attr(data-tooltip)`), então não é anunciado duas vezes.

Uso: `data-tooltip="Parar"` — o componente já garante o contexto de posicionamento.

⚠️ A regra base é `:where([data-tooltip]) { position: relative }`. O `:where()` **é obrigatório**: ele
zera a especificidade, deixando isso como um padrão que qualquer componente sobrescreve. Sem ele a regra
empata com seletores de classe e, por vir depois na cascata, vence — foi assim que o botão de fechar do
modal perdeu o `position: absolute` e voltou a ocupar espaço no fluxo.

---

### `Modal Revista/Quadrinho`

| Propriedade | Valor |
|---|---|
| Overlay | `--color-overlay`, ocupa a viewport |
| Conteúdo | centralizado, gap `48px` entre o leitor e o card de chamada |
| Leitor | [`Flipbook`](#flipbook) — `max-width: 840px`, ocupa a altura disponível |
| Fechar | botão só de ícone (`x`), circular 48px, `position: absolute` em `top: 24px` / `right: 24px`, com tooltip |

O modal **não tem mais nada além do leitor**. O convite ao quiz é a última página do próprio quadrinho
(ver [Flipbook](#flipbook)) — não existe bloco ou dock separado.

O overlay é `--color-overlay` com `backdrop-filter: blur(var(--overlay-blur))`. Desfoque em CSS é medido
em pixels, não em porcentagem: `--overlay-blur` está em `40px`.

**A revista ocupa a altura total da tela**, com margem de `24px` em cima e embaixo, mantendo a proporção:

```
altura da revista = 100dvh − 48 (margens) − 86 (barra de navegação + gap)
largura           = altura × proporção
```

O flipbook desconta a própria barra; a `--reserva` que ele recebe de fora é só a margem.

**Acessibilidade:** `role="dialog"` + `aria-modal="true"`. Enquanto aberto, o foco fica **preso dentro**
(Tab circula do último de volta ao primeiro) e a página atrás não rola. Fecha com `Esc`, com o botão de
fechar ou clicando no overlay — e em todos os casos **o foco volta para quem abriu**. Sem isso, quem
navega por teclado é jogado de volta ao começo do documento.

---

### `Flipbook`

Leitor de páginas com virada por arrasto. **As páginas são geradas a partir de uma lista de imagens** —
não existe markup por página. Trocar o conteúdo do quadrinho é trocar o array.

**API**

| Parâmetro | Tipo | O que faz |
|---|---|---|
| `pages` | `[{ src, alt? }]` | As páginas. **A quantidade é o tamanho da lista** — não há limite nem número fixo. |
| `pages[].src` | `string` | Imagem da página |
| `pages[].alt` | `string` | Texto alternativo. Sem ele, cai para `"Página N"` |
| `cta.text` | `string` | Texto da página de encerramento |
| `cta.action.label` | `string` | Rótulo do botão |
| `cta.action.href` | `string` | Destino do quiz |
| `label` | `string` | Nome do leitor para leitores de tela |

```js
flipbook({
  pages: [
    { src: "/img/quadrinho/pagina-01.webp", alt: "Chegada dos jesuítas" },
    { src: "/img/quadrinho/pagina-02.webp", alt: "O primeiro plantio" },
  ],
  cta: {
    text: "Chegou ao fim. Que tal testar o que aprendeu?",
    action: { label: "Fazer o quiz", href: "/quiz" },
  },
})
```

`modal()` aceita e repassa os mesmos `pages`, `cta` e `label`.

O `cta` faz **merge raso** com o padrão: dá para trocar só o texto e manter o botão, ou só o `href` e
manter o rótulo, sem redeclarar o objeto inteiro. O padrão é
`"Já leu a história, responda o desafio!"` com o botão `"Responder o quiz"`.

**A última página é sempre um CTA**, acrescentado automaticamente pelo componente — o convite ao quiz não
depende de alguém lembrar de incluí-lo. Fundo `--color-primary`: destaca-se das páginas de papel de
propósito, por ser o encerramento, e é o que dá contraste suficiente ao botão accent.

Com número **ímpar** de páginas de imagem, o CTA fecha o último spread. Se ainda assim sobrar uma folha,
ela fica vazia e transparente.

| Propriedade | Desktop | Mobile |
|---|---|---|
| Páginas à vista | 2 (spread), **exceto capa e contracapa** | **1** |
| Proporção | `840 / 594` | `420 / 594` |
| Vinco central | faixa de `97px`, `mix-blend-mode: multiply` a `30%` | não existe |
| Sombra | `--shadow-modal` | igual |
| Navegação | barra abaixo da revista | igual |

**Barra de navegação**

Fica **abaixo da revista**: `Botão-pílula` anterior à esquerda, contador de páginas ao centro, próxima
à direita. Grid de `1fr auto 1fr`, o que mantém o contador no centro exato mesmo quando um dos botões
some nos extremos.

Os botões ficam **alinhados com as bordas da revista**. Isso sai de graça porque a largura calculada
vive no `.flipbook`, não no spread: a barra herda a mesma medida. Com uma página só à vista, a barra
encolhe para `50%` junto com a centralização do papel.

**Paginação de livro**

A capa aparece **sozinha, à direita da lombada** — o livro começa fechado. Só a partir da segunda vista
existem duas páginas lado a lado, e a última também pode ficar sozinha, à esquerda, como contracapa.

```
vista 0 → [    | 1 ]      livro fechado
vista 1 → [ 2  | 3 ]
vista 2 → [ 4  | 5 ]
vista 3 → [ 6  | 7 ]
vista 4 → [ 8  |   ]      contracapa (o CTA)
```

O lugar sem página fica **transparente**, não em branco. Como o spread usa `filter: drop-shadow`, que
segue o canal alfa, a sombra abraça só o papel que existe — e o livro fechado lê como uma folha única,
sem meia-página vazia ao lado. O vinco central some nessas vistas: capa e contracapa não têm lombada
à mostra.

**Centralização com uma página só (desktop)**

A caixa do spread **não muda de tamanho** quando há uma página só — o que muda é a posição. Deslocar
`25%` põe o papel no centro da tela:

| `data-spread` | Deslocamento | Situação |
|---|---|---|
| `capa` | `translate: -25%` | página só à direita |
| `duplo` | nenhum | livro aberto |
| `contracapa` | `translate: 25%` | página só à esquerda |

Manter a caixa do tamanho do spread é o que preserva a matemática da folha, que gira em torno do meio
dela. O estado é aplicado **no início** da virada, não no fim: assim o livro desliza para o centro
enquanto a página vira, em vez de saltar quando ela assenta.

**Como a virada funciona**

A folha que vira (`leaf`) gira em torno da lombada, que fica na **borda esquerda dela**: em `0°` cobre a
metade direita, em `180°` cobre a esquerda. A mesma folha serve para os dois sentidos — muda só o ângulo
de partida. Ela tem frente e verso (`backface-visibility: hidden`), e por baixo já entra a página que
será revelada, de modo que nada "pula" no início nem no fim do movimento.

| Interação | Efeito |
|---|---|
| Arrastar da direita para a esquerda | Avança |
| Arrastar da esquerda para a direita | Volta |
| Soltar antes de 35% do percurso | Desfaz e a página volta ao lugar |
| Setas ←/→ | Vira uma página |
| Botões-pílula | Viram uma página |

No mobile a folha ocupa a largura toda e vira para fora da tela — uma página por vez.

**Detalhes que importam**

- `touch-action: pan-y` no spread: o arrasto horizontal é do componente, o vertical continua rolando a
  página. Sem isso o leitor sequestra o scroll no celular.
- **O leitor nunca empurra o CTA do quiz para fora da tela.** A largura do spread sai de
  `min(100%, (100dvh − reserva) × proporção)`, onde `--reserva` cobre o card do quiz, o contador, os
  respiros e o padding do modal — `280px` no desktop, `360px` no mobile. Se a altura do card mudar,
  esse número muda junto.
- `draggable="false"` e `pointer-events: none` nas imagens: o arrasto nativo de imagem brigaria com o
  do componente.
- A conclusão da virada roda **uma vez só**. `transitionend` e a rede de segurança por tempo podem
  disparar os dois; sem trava, a vista avança em dobro e o leitor pula de 1-2 direto para 5-6.
- Uma sombra acompanha a dobra, mais forte no meio do movimento (`sin` do ângulo).
- Ao trocar de breakpoint, o leitor mantém a página que estava à vista em vez de voltar ao começo.
- Os botões de navegação somem nos extremos, em vez de ficarem inertes.

**Acessibilidade**

- O spread é focável (`tabindex="0"`) com `role="group"` e `aria-roledescription="leitor de páginas"`.
- O contador de páginas fica em `aria-live="polite"` — quem não vê a virada é avisado dela.
- O vinco central é decorativo (`aria-hidden`).

---

### `Player de vídeo`

Card com `Cabeçalho de seção` ("Vídeo imersivo") + frame do vídeo.
Fundo `--color-secondary`, radius `--radius-lg`, padding `24px` desktop / `16px` mobile.

**Frame — 16:9 obrigatório**

| Propriedade | Valor |
|---|---|
| Proporção | `aspect-ratio: 16 / 9` — **sempre**, independente do arquivo |
| Radius | `--radius-md` (12px) |
| Fundo | `--color-primary` |
| Ajuste do vídeo | `object-fit: cover` |

O frame manda na proporção e o vídeo se ajusta. Nunca deixar o arquivo ditar a altura do card: um vídeo
4:3 ou vertical no meio da página quebraria o ritmo da coluna.

**Controles próprios**

O `<video>` **não recebe o atributo `controls`** — a barra nativa ignora o design system e muda de
navegador para navegador. A barra é montada com as peças documentadas aqui.

| Estado | O que aparece |
|---|---|
| Pôster (antes de começar) | Play central circular, 48px mobile / 72px desktop, contorno accent sobre véu `--color-overlay-soft` |
| Tocando | Barra inferior: play/pause · tempo · trilha · mudo · tela cheia |
| Tocando e parado há 2,5s | A barra some sozinha e o cursor some com ela |
| Hover, foco ou toque no frame | A barra volta na hora |

A barra tem degradê de `--color-scrim-strong` até `--color-scrim-none`, de baixo para cima, para os
ícones não sumirem em cena clara. Entra com `--duration-base` e `--ease-out`, deslizando `8px`.

A barra **nunca some** enquanto o ponteiro está sobre ela ou algo dentro dela tem foco — some por
inatividade, não por tempo puro.

**Trilha:** a mesma do player de audiodescrição (ver [`Audiodescription`](#audiodescription-player)), na
variante `--slim`: trilha de `6px` e marcador de `16px`, porque sobre o vídeo ela precisa ser discreta.

**Acessibilidade**

- `playsinline` obrigatório — sem ele o iOS abre o vídeo em tela cheia e os controles próprios somem.
- Legendas via `<track kind="captions">`; janela de Libras quando houver (ver texto do rodapé).
- Todos os controles com `aria-label` e [tooltip](#tooltip); play e mudo alternam o rótulo com o estado.
- A trilha recebe `aria-valuetext` por extenso, igual à do áudio.
- O vídeo começa mudo (`muted`) para não surpreender quem chega na página; o botão de som é o primeiro
  passo consciente.

---

### `Timeline` (Banner 4)

Lista vertical dentro do painel. **O ano troca de lado entre os breakpoints.**

**API**

| Campo | Tipo | O que faz |
|---|---|---|
| `year` | `string` | Ano ou período. Aceita rótulo livre (`"Século XVIII"`, `"Muito antes de 1626"`) |
| `title` | `string` | Título do marco |
| `image` | `{ src, alt? }` ou `null` | **Com `null`, o bloco fica na cor accent** |
| `subtitle` | `string` | Opcional |
| `description` | `string` | Opcional |

**O campo `image` fica declarado em todo marco, mesmo vazio.** JSON não aceita comentário, e é a chave
presente com `null` que mostra onde entra a arte de cada marco. Trocar o espaço reservado pela imagem é
substituir o `null`:

```json
{ "year": "1750", "title": "Portugueses", "image": null, "description": "…" }
{ "year": "1750", "title": "Portugueses", "image": { "src": "/img/banner4/1750.webp", "alt": "…" }, "description": "…" }
```

```js
timeline([
  {
    year: "1626 – 1634",
    title: "Jesuítas espanhóis",
    image: { src: "/img/timeline/reducoes.webp", alt: "Ruínas de São Miguel" },
    subtitle: "Fundação das Reduções",
    description: "Organização agrícola e pecuária das Missões.",
  },
  { year: "1750", title: "Portugueses", description: "Novos temperos." },
])
```

Também aceita um objeto indexado pelo ano (`{ "1750": { title, … } }`), mas **a lista é a forma
canônica**: chaves que parecem número são reordenadas pelo próprio JavaScript, o que embaralharia uma
timeline que mistura `"1750"` com `"Século XIX"`.

Campo ausente simplesmente não é renderizado — nada de parágrafo vazio no HTML.

**Layout**

| | Desktop | Mobile |
|---|---|---|
| Colunas | `ano` · `divisor` · `conteúdo` | `divisor` · `conteúdo` |
| Ano | coluna própria, `max-width: 180px`, alinhado à direita, centrado na vertical | primeira linha do conteúdo, alinhado à esquerda |
| Ano — tipografia | Cinzel Bold **32px** / 1.1, accent | Cinzel Bold **20px** / 1.1, accent |
| Gap entre colunas | `--space-6` (24px) | igual |
| Gap entre linhas do conteúdo | `--space-3` (12px) | igual |

**Conteúdo** (na ordem): imagem · título · subtítulo · descrição — no mobile, precedidos pelo ano.

| Elemento | Spec |
|---|---|
| Imagem | altura fixa `180px`, largura total, radius `--radius-md`, **fundo `--color-accent`** |
| Título | Source Sans 3 Regular `20px` / `1.2`, `--color-text` |
| Subtítulo | Source Sans 3 Regular `16px` / `1.5`, **`--color-accent`** |
| Descrição | Source Sans 3 Regular `16px` / `1.5`, `--color-text` |

O bloco accent de 180px é **espaço reservado para imagem**: aparece quando `image` não é informada, e a
`<img>` ocupa exatamente a mesma caixa quando é (`object-fit: cover`).

Sem `alt`, o texto alternativo cai para `"{ano} — {título}"`.

**Divisor**

Linha ondulada desenhada à mão, exportada do Figma como SVG (`timeline-divider.svg`), largura `3px`,
esticada na vertical com `background-size: 100% 100%`. O arquivo tem `preserveAspectRatio="none"` — é o
que faz a linha percorrer o item inteiro qualquer que seja a altura.

A cor está **fixa no arquivo** (`#F7EBD8`), então o divisor não acompanha `currentColor`. Para mudar a
cor, reexportar do Figma.

**A linha ocupa a altura total do item + 48px.** O respiro entre itens é o `gap` da lista, e o divisor
estica para dentro dele com `margin-bottom: -48px` — a margem negativa faz o elemento crescer além da
área do grid, atravessando o vão até o item seguinte. A linha fica contínua de ponta a ponta.

O respiro **não** pode morar no padding do último texto: com `description` e `subtitle` opcionais, um
item sem esses campos perderia o espaçamento.

**Markup único**

A ordem do DOM é a do mobile (período dentro do conteúdo). No desktop, `display: contents` no bloco de
conteúdo promove os quatro filhos a itens do grid do `<li>`, e cada um é posicionado por
`grid-column`. Não duplicar markup por breakpoint — mesma técnica do [player](#audiodescription-player).

**Acessibilidade:** `<ol>` — é uma sequência cronológica. O divisor é decorativo (`aria-hidden`).

---

### `Abertura` (home)

Apresentação do projeto: texto à esquerda e imagem compondo à direita.

| Propriedade | Desktop | Mobile |
|---|---|---|
| Layout | grid `1fr auto` — a imagem ocupa só o que precisa | empilhado, imagem abaixo do texto |
| Alinhamento | à esquerda | igual |
| Gap entre colunas | `--space-12` | — |
| Título | `--text-h1` em Cinzel, accent | igual |
| Lead | `--text-body` em accent, medida de `46ch` | igual |
| Texto | `--text-body` em `--color-text`, medida de `56ch` | igual |
| Imagem | até `440px` de largura | até `320px`, centralizada |

As medidas em `ch` no lead e no texto existem para a linha não passar do confortável quando a coluna
cresce em telas largas.

---

### `Grade de banners` (home)

Cards de acesso aos cinco banners: imagem do hero, título, uma frase sobre o assunto e etiquetas com o
que existe dentro (vídeo, quadrinho, quiz, entrevista…).

| Propriedade | Valor |
|---|---|
| Colunas | 1 no mobile, **2** a partir de `md` |
| Gap | `--space-6` |
| Card | fundo `--color-secondary`, radius `--radius-lg`, sem padding na mídia |
| Imagem | proporção `1720 / 480` — a mesma da arte, sem recorte |
| Etiquetas | pílula com contorno `--color-border-subtle`, ícone Feather em accent |
| Hover | fundo levemente clareado e deslocamento de `-2px` |

**Com número ímpar de cards, o último se centraliza** em vez de encostar à esquerda:

```css
.banner-grid__item:last-child:nth-child(odd) {
  grid-column: 1 / -1;      /* atravessa as duas colunas… */
  justify-self: center;     /* …mas mantém a largura de uma */
  width: calc(50% - var(--space-6) / 2);
}
```

O card inteiro é o link — não um botão dentro dele. Alvo maior e uma parada de tabulação por banner,
em vez de duas.

---

### `Footer`

Dois blocos: acessibilidade e apoiadores. **Todo o conteúdo entra por parâmetro** — os dois títulos, o
texto de acessibilidade e a lista de logos.

**API**

| Campo | Tipo | O que faz |
|---|---|---|
| `accessibility.title` | `string` | Título do primeiro bloco |
| `accessibility.text` | `string` | Texto de acessibilidade |
| `supporters.title` | `string` | Título do bloco de logos |
| `supporters.logos` | `[{ src, alt, width?, href? }]` | As logos |
| `supporters.logos[].alt` | `string` | **Obrigatório** — é o nome da instituição |
| `supporters.logos[].width` | `number` | Largura em px; a altura é sempre 48 |
| `supporters.logos[].href` | `string` | Opcional, transforma a logo em link |

```js
footer({
  accessibility: {
    title: "ACESSIBILIDADE",
    text: "Esta exposição conta com audiodescrição…",
  },
  supporters: {
    title: "Apoiadores",
    logos: [
      { src: "/img/logos/logo-06.webp", alt: "Instituto Federal Farroupilha", width: 176 },
    ],
  },
})
```

Com `logos: []` o bloco de apoiadores **desaparece inteiro**, título incluído.

**Layout**

| Propriedade | Desktop | Mobile |
|---|---|---|
| Fundo | `--color-primary` (sólido, cobre o pattern) | igual |
| Margem superior | `48px` — respiro entre o fim do conteúdo e o rodapé | igual |
| Padding lateral | `48px` | `16px` |
| Gap entre blocos | `24px` | igual |
| Gap título↔texto | `12px` | igual |
| Gap título↔logos | `24px` | igual |
| Títulos | `--text-h3` (Cinzel Bold 20/1.1, accent) | igual |
| Texto | `16/1.5` | `14/1.5` |
| Gap entre logos | `60px` | `24px` entre linhas, `60px` entre colunas |

**Logos**

Arquivos em `public/img/logos/`, **em WebP** — exportados do Figma a 2× da altura de exibição (96px) e
convertidos. Os PNGs originais somavam 700KB; em WebP são 48KB.

| Propriedade | Valor |
|---|---|
| Altura | `48px`, fixa |
| Largura | do próprio logo, via `width` |
| Ajuste | `object-fit: contain` — nunca distorce, mesmo se a proporção mudar |
| Opacidade do conjunto | `90%` |
| Carregamento | `loading="lazy"` — estão no fim da página |

O `alt` é o nome da instituição, não "logo": quem usa leitor de tela precisa saber **quem** apoia, não que
ali existe uma imagem.

O padding inferior reserva espaço para o player fixo de audiodescrição
(`calc(var(--player-height) + var(--space-6))`). **Se a altura do player mudar, esse valor acompanha
sozinho.**

---

### Componentes documentados

- [x] Header (desktop/mobile)
- [x] Logo
- [x] menu-item
- [x] Menu-button
- [x] Botão primário
- [x] Botão-pílula
- [x] Card de item
- [x] Painel de conteúdo
- [x] Cabeçalho de seção
- [x] Lista de tipos de conteúdo
- [x] Text-section
- [x] Audiodescription (player)
- [x] Modal Revista/Quadrinho
- [x] Player de vídeo
- [x] Timeline
- [x] Footer
- [ ] Menu mobile aberto (não existe no Figma)
- [ ] Quiz (só o gatilho existe no Figma)
- [ ] Estado vazio / erro
- [ ] Estado de carregamento (skeleton)

---

## 11. Acessibilidade

Nível alvo: **WCAG 2.1 AA**

- [x] Contraste verificado em todas as combinações de cor — ver [3.5](#35-contrastes-verificados)
- [ ] Todos os controles alcançáveis por teclado, em ordem lógica
- [x] Indicador de foco visível e consistente

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color); /* 2px, --color-text */
  outline-offset: var(--focus-ring-offset);                       /* 2px */
  border-radius: var(--radius-sm);
}
```

O anel usa `--color-text` (contraste 15,7:1 sobre o fundo) e é **deliberadamente diferente** da pincelada
do `menu-item`, que já significa hover. `:focus-visible` evita que o anel apareça em clique de mouse.

- [x] Área de toque mínima de 44×44px — botões resultam em 48px, controles de mídia são 48×48px
- [ ] Formulários com `label` associado e mensagens de erro descritivas
- [ ] Estrutura semântica de headings sem pular níveis
- [x] `prefers-reduced-motion` respeitado — reset global em `base.css`
- [ ] Testado com leitor de tela: NVDA (Windows) + VoiceOver (iOS)

**Compromissos específicos deste projeto** (declarados no rodapé — precisam ser cumpridos):

- Audiodescrição de todos os banners
- Resumos acessíveis dos conteúdos dos QR Codes
- Legendas e janela de Libras nos vídeos
- Apostila com descrição dos textos em Braille

---

## 11.5 Conteúdo em JSON

Todo o conteúdo do site vive em **`src/content/site.json`**. O HTML das páginas é gerado a partir dele —
não existe texto, imagem ou ordem de bloco escrita à mão em nenhum arquivo de página.

**Estrutura**

```
site
  nome
  nav[]        { label, href, slug }
  footer       { accessibility, supporters }   ← mesma API do componente Footer
pages
  <slug>
    title        usado no <title> da aba
    description
    hero         { src, alt }
    audio        { src, label }                ← player de audiodescrição
    blocks[]     { type, column, … }
```

**Blocos**

Cada bloco declara um `type` e a `column` em que vive — e `column` decide **só o desktop**:

| `column` | Desktop |
|---|---|
| `aside` (padrão) | coluna de texto, à esquerda |
| `main` | coluna de painéis, à direita |
| `full` | atravessa as duas, acima delas |

**A ordem no JSON é a ordem do mobile**, onde tudo vira uma coluna só. Um painel que deve abrir a página
no celular vem antes no arquivo, mesmo aparecendo à direita no desktop. É assim que o Banner 2 intercala
texto e painéis no mobile sem duplicar markup: `display: contents` nas colunas promove os blocos a filhos
diretos da grade, e cada um carrega a própria ordem.

**Coluna que acompanha a rolagem**

`"sticky": "main"` (ou `"aside"`) na página faz aquela coluna colar a 48px do topo.

⚠️ Só tem efeito na coluna **mais baixa** das duas. Num grid, a altura da linha é a do item mais alto, e
um elemento grudento precisa ser menor que o bloco que o contém para ter curso.

| Página | Coluna que cola | Por quê |
|---|---|---|
| Banner 1 | nenhuma | A coluna de texto é a mais alta — não haveria curso |
| Banners 2, 3 e 5 | `main` | O painel é curto perto da coluna de texto |
| Banner 4 | `aside` | A linha do tempo torna o painel a coluna mais alta |

| `type` | Campos | Componente |
|---|---|---|
| `text` | `title?`, `body?` | `Text-section` — os dois são opcionais |
| `quote` | `text`, `body?` | `Text-section` de destaque |
| `list` | `items[] { icon, label }` | `Lista de tipos de conteúdo` |
| `image` | `src`, `alt`, `blend?`, `rounded?` | Imagem ilustrativa |
| `panel` | `header { icon, label }`, `items[]` | `Painel de conteúdo` + `Card de item` |
| `video` | `src`, `poster`, `label`, `icon?`, `captions?` | `Player de vídeo` |
| `timeline` | `header?`, `items[]` | `Timeline` — com `header`, vem dentro de um painel |
| `intro` | `title`, `lead?`, `text?`, `image?` | Abertura da home |
| `banners` | `items[] { slug, title, description, tags[] }` | Grade de acesso aos banners |

No bloco `banners`, **a imagem e o destino saem do próprio `pages`, pelo `slug`**. Não há caminho de
imagem repetido no JSON, e o card nunca fica apontando para um hero que mudou de nome.

`icon` é sempre um nome do **Feather** ([7](#7-iconografia)).

**Ações de card**

| Campo | O que faz |
|---|---|
| `action.href` | Navega. Renderiza um `<a>` |
| `action.opens` | Abre um diálogo pelo id. Renderiza um `<button>` com `aria-haspopup="dialog"` |

Abrir um diálogo é ação, não navegação — por isso `opens` vira `<button>` mesmo que haja `href`.

**Leitor de quadrinho na página**

`"comic": { label, pages[], cta }` na página monta o [Flipbook](#flipbook) num diálogo de id
`modal-quadrinho`, que qualquer botão pode abrir com `"opens": "modal-quadrinho"`. É como o Banner 2
liga o botão "Ler quadrinho" ao leitor.

Um `type` desconhecido **falha alto**, com a lista de tipos válidos na mensagem: erro de conteúdo é para
aparecer na hora, não para virar um buraco silencioso na página.

**Adicionar uma página**

1. Uma entrada em `pages` no JSON
2. Um `<slug>/index.html`, com `data-page="<slug>"` no `<body>`
3. Uma linha em `vite.config.js`

**A casca HTML tem duas regras**

O `<body>` contém **só** `<div id="app"></div>`. Qualquer elemento solto ali aparece sem estilo enquanto
o CSS não chega — foi o que acontecia com o link "Pular para o conteúdo", que piscava na troca de página.
Ele agora é montado pelo renderizador, junto com o resto.

E o `<head>` traz um `<style>` mínimo pintando o fundo:

```html
<style>
  html { background: #19120d; color-scheme: dark; }
</style>
```

Sem isso a troca de página pisca em branco antes de o CSS carregar. **É o único lugar do projeto com cor
escrita à mão**: um token em `tokens.css` não teria como ser resolvido a tempo. O `color-scheme: dark`
faz o navegador escurecer também a barra de rolagem e os controles nativos.

As duas regras são verificadas pelo `npm run check`.

São páginas de verdade, com URL própria (`/banner1/`): cada uma tem seu HTML, é indexável e funciona
quando alguém chega direto nela, sem depender de reescrita no servidor.

**Trocar de página não recarrega**

Como todo o conteúdo já vem no bundle, navegar entre banners é só remontar o `#app` — **nenhuma
requisição**. O roteador intercepta cliques em links internos, atualiza a URL com `history.pushState` e
remonta. Onde houver suporte, a troca passa por `document.startViewTransition`.

**Posição de rolagem**

| Origem da navegação | Onde a página abre |
|---|---|
| Clique num link | no topo — é o que se espera ao seguir um link |
| Voltar ou Avançar | **onde estava**, na posição de antes |

O navegador tentaria restaurar sozinho, mas erra: quando ele age, o `#app` ainda está vazio e o
documento não tem altura. Por isso o roteador assume o controle com `history.scrollRestoration = "manual"`
e restaura depois de montar.

As posições ficam num `Map` em memória, indexado por uma chave que viaja no estado do histórico. Guardar
em `replaceState` a cada rolagem seria a alternativa, mas os navegadores limitam a frequência dessas
chamadas — e aqui não é preciso sobreviver a um recarregamento.

⚠️ Isso **depende de as imagens reservarem espaço** (ver abaixo). Sem altura reservada, o documento
ainda está curto na hora de restaurar e a rolagem para antes do ponto certo.

**Toda `<img>` sai com `width` e `height`**

As medidas reais de cada arquivo ficam em `src/content/imagens.js`, **gerado** por `npm run dimensoes` —
que lê o cabeçalho de cada PNG, WebP e SVG de `public/img` e `public/icons`, sem dependência externa.

```
npm run dimensoes   # depois de acrescentar ou trocar qualquer imagem
```

Roda sozinho dentro do `npm run check`, que também reprova se alguma `<img>` sair sem as medidas. Além
da restauração de rolagem, isso elimina o pulo de layout enquanto as imagens carregam.

Só entram as rotas declaradas no JSON. Um link para fora desse conjunto — a biblioteca de componentes,
por exemplo — segue como navegação normal do navegador.

⚠️ Os inicializadores rodam **de novo a cada troca**. Os que só ouvem elementos de dentro do `#app` não
precisam de cuidado: os ouvintes morrem junto com os elementos. Já quem registra ouvinte em `document`
— menu e diálogos — precisa fazer isso **uma vez só**, senão eles se acumulam a cada página. Os dois
módulos usam uma trava de módulo e descobrem o alvo pelo DOM, em vez de guardar referência.

**Verificação**

`npm run check` valida o JSON: todo tipo de bloco existe, todo bloco renderiza, todo arquivo referenciado
(`.webp`, `.svg`, `.mp4`, `.wav`) está de fato em `public/`, e cada página tem seu HTML de entrada.

---

## 12. Convenções de código

- **Nomenclatura de classes:** BEM (`.card`, `.card__title`, `.card--com-thumb`)
- **Nomenclatura de arquivos:** kebab-case
- **Ordem de propriedades CSS:** posicionamento → box model → tipografia → visual → animação
- **Tokens:** definidos em `src/styles/tokens.css` como custom properties em `:root` e consumidos apenas via variável — **nunca** valores hardcoded
- **Unidades:** `rem` para tipografia e espaçamento, `px` para bordas e radius
- **Estrutura de pastas:**

```
index.html            # home (/)
styleguide/index.html # biblioteca de componentes
banner1/index.html    # uma casca por página do site
src/
  main.js             # monta a biblioteca de componentes
  page.js             # entrada das páginas de conteúdo
  content/site.json   # todo o conteúdo do site
  render/
    page.js           # monta uma página a partir do conteúdo
    blocks.js         # tipo de bloco → componente
  components/         # um módulo por família de componentes
  styles/
    tokens.css        # cores, tipografia, espaçamento, radius, motion
    base.css          # reset, body, pattern de fundo, anel de foco
    styleguide.css    # só o cromo da biblioteca de componentes
    components/       # um arquivo por componente
public/
  img/                # WebP exportados do Figma (fotos, logos, pattern)
  icons/              # SVGs próprios (logo, detalhes-linha, audio-description)
  audio/  video/      # mídia de exemplo
scripts/              # verificações executadas por `npm run check`
```

**Comandos**

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o Vite em `localhost:5173` com a biblioteca de componentes |
| `npm run build` | gera `dist/` |
| `npm run check` | build + verifica ícones, montagem da página, acessibilidade básica e cores fora da paleta |

`npm run check` falha se qualquer cor que não seja da paleta (ou preto/branco puro) aparecer no CSS final —
é o que impede valor hardcoded de entrar sem passar por um token.

- Ícones Feather entram como SVG inline ou sprite, sempre com `stroke-width: 1.5` e `currentColor`.
- Assets exportados do Figma passam pelo pipeline de otimização (WebP) antes de entrar no repositório.

---

## 13. Registro de decisões

| Data | Decisão | Motivo |
|---|---|---|
| 01/08/26 | `--space-3` mudou de 16px para 12px; escala renumerada para múltiplos de 4 (`--space-N` = N × 4px) | O Figma usa 12px e 48px de forma pervasiva e a escala anterior não os representava |
| 01/08/26 | Feather como biblioteca única; ícones `ri:*` do Figma mapeados para equivalentes Feather | Consistência de traço e peso visual |
| 01/08/26 | `fa:audio-description` mantido como asset próprio | Não existe equivalente no Feather |
| 01/08/26 | Padronizar padding lateral em 48px e conteúdo em 1184px | O Figma tem variações de 45/52px que são imprecisão, não intenção |
| 01/08/26 | ~~Filtro screen obrigatório em toda imagem~~ — **revertida** no mesmo dia | As artes entregues têm alfa de verdade; o blend virou desnecessário e ainda clareava as cores |
| 01/08/26 | ~~Cores semânticas compostas apenas das 4 cores da paleta~~ — **revertida** no mesmo dia | Sem matiz próprio, sucesso e informação ficavam idênticos e o sinal de erro dependia de inversão |
| 01/08/26 | Três cores semânticas próprias (`#E06552`, `#EA9D2A`, `#9BBF69`), na mesma faixa de saturação e claridade do accent | Estado precisa de matiz para ser lido de imediato; mantê-las quentes e terrosas preserva a identidade |
| 01/08/26 | Semântica aplicada em ícone e borda; superfície e texto permanecem `secondary`/`text` | Uma única combinação de texto para verificar, e legibilidade igual em todos os estados |
| 01/08/26 | Informação usa o neutro `--color-text`, não o accent | Com atenção em ocre (36°), o accent (39°) ficaria confundível |
| 01/08/26 | Trecho já reproduzido da trilha passou de 40% para **50%** de opacidade | Pedido de ajuste visual; 40% lia baixo demais contra o restante sólido |
| 01/08/26 | Trilha implementada como `<input type="range">`, marcador em CSS e não como ícone SVG | Arrasto, teclado e semântica de slider nativos; o thumb nativo não aceita SVG |
| 01/08/26 | Player **sem** `overflow: hidden`, contrariando o `overflow-clip` do Figma | O clip cortava os tooltips dos controles e não protegia nada |
| 01/08/26 | Trilha extraída para `media-range`, compartilhada por áudio e vídeo | Eram 60 linhas de estilo de `input[type=range]` prestes a serem duplicadas |
| 01/08/26 | Vídeo sem `controls` nativo; barra própria que aparece no play e some por inatividade | A barra nativa ignora o design system e muda de navegador para navegador |
| 01/08/26 | Frame de vídeo travado em 16:9 com `object-fit: cover` | O arquivo não pode ditar a altura do card e quebrar o ritmo da coluna |
| 01/08/26 | Timeline com período trocando de coluna no breakpoint, via `display: contents` | Espelha os dois nodes do Figma sem duplicar markup |
| 01/08/26 | Respiro entre itens da timeline no `gap` da lista; divisor estica 48px com margem negativa | O padding do último texto sumiria em itens sem descrição ou subtítulo |
| 01/08/26 | Timeline recebe `year`, `title`, `image`, `subtitle` e `description` por item | Conteúdo passa a ser dado, não markup; imagem opcional cai no bloco accent |
| 01/08/26 | Rodapé recebe textos e logos por parâmetro; logos como imagem em `public/img/logos/` | Antes eram nomes em texto no meio do componente, impossíveis de trocar sem editá-lo |
| 01/08/26 | Padding inferior do rodapé derivado de `--player-height` | O valor fixo de 144/190px desalinharia sozinho se o player mudasse de altura |
| 01/08/26 | Conteúdo de todas as páginas em `src/content/site.json`, HTML gerado a partir dele | Trocar texto ou imagem deixa de exigir mexer em código |
| 01/08/26 | Multi-page (uma entrada por página) em vez de roteador no cliente | URLs reais e indexáveis, sem depender de reescrita no servidor |
| 01/08/26 | Ordem do JSON = ordem do mobile; `column` vale só no desktop | O Banner 2 intercala texto e painéis no celular, o que dois blocos fixos não expressam |
| 01/08/26 | `sticky` vira opção por página, não regra do layout | Depende de qual coluna é a mais baixa, e isso muda de banner para banner |
| 01/08/26 | Play do vídeo passa a usar a pílula do quadrinho | É o que o Figma mostra, e reaproveita um componente que já existia |
| 01/08/26 | Fundo pintado inline no `<head>` e link de salto movido para o renderizador | A troca de página piscava em branco com um link solto, antes de o CSS chegar |
| 01/08/26 | Navegação entre banners sem recarregar, remontando o `#app` | O conteúdo já está no bundle; recarregar só repetia o trabalho e piscava a tela |
| 01/08/26 | Home assume a raiz; biblioteca de componentes vai para `/styleguide/` | "Início" na navegação aponta para `/`, e quem chega ao site espera a exposição, não a biblioteca |
| 01/08/26 | Cards da home leem imagem e destino do próprio `pages`, pelo slug | Repetir o caminho do hero no JSON criaria duas fontes para o mesmo dado |
| 01/08/26 | Cor de fundo movida do `body` para o `html` | O fundo inline no `<head>` fez o body pintar o próprio fundo por cima do pattern, apagando-o em todas as páginas |
| 01/08/26 | Voltar e Avançar restauram a posição de rolagem | Voltar de um banner jogava para o topo da home, perdendo o lugar da leitura |
| 01/08/26 | Medidas das imagens geradas de `public/`, e obrigatórias em toda `<img>` | Sem espaço reservado, a restauração de rolagem erra o alvo e a página pula durante o carregamento |
| 01/08/26 | Favicon com o "S" extraído do próprio SVG do logo | Usar uma fonte parecida daria uma letra diferente da marca |
| 01/08/26 | Máscara da imagem do Banner 1 reproduzida como gradiente CSS | O SVG do Figma é só um fade vertical, cujas coordenadas só fazem sentido no frame dele |
| 01/08/26 | Buracos das ruínas apagados no próprio arquivo do hero, em vez de retângulos em CSS | Os "Tapa buraco" do Figma são posições absolutas que só valem naquela escala |
| 01/08/26 | Navegação mobile dentro do botão de menu, com estado no header | O painel é irmão anterior do botão no DOM e não seria alcançável por seletor a partir dele |
| 01/08/26 | Botão do card não estica: `align-items: flex-start` no card, `width: 100%` no texto | O `stretch` padrão do flex fazia o botão ocupar a largura toda |
| 01/08/26 | Leitor de quadrinho com virada por arrasto, páginas geradas de um array de imagens | Trocar o conteúdo passa a ser trocar a lista, sem mexer em markup |
| 01/08/26 | Última página do quadrinho é sempre um CTA, acrescentado pelo componente | O convite ao quiz não pode depender de alguém lembrar de incluí-lo |
| 01/08/26 | Paginação de livro: capa sozinha à direita, spreads a partir da segunda vista | O leitor abria já com duas páginas, o que não lê como um livro |
| 01/08/26 | Regra base do tooltip com `:where()` | Sem isso ela empata em especificidade e rouba o posicionamento de quem a usa |
| 01/08/26 | Modal do quadrinho sem bloco separado para o quiz | O convite virou a última página do próprio quadrinho; um segundo CTA seria repetição |
| 01/08/26 | Gap ícone↔texto do botão normalizado de 10px para `--space-3` (12px) | 10px está fora da escala e a diferença é imperceptível |
| 01/08/26 | Estados do botão derivados por `color-mix()` do accent com text/primary | Mantém a regra de não introduzir tom novo |
| 01/08/26 | Anel de foco = 2px `--color-text` com offset 2px, via `:focus-visible` | Precisa ser distinto da pincelada do menu, que significa hover |
| 01/08/26 | Pattern servido em 1× (1270 × 1072) WebP | 2× triplica o peso sem ganho visível numa textura a 20% de opacidade |

---

## 14. Pendências

- [ ] **Estado de loading do botão** — os demais estados foram resolvidos na implementação (ver [10.2](#botão-primário))
- [ ] **Menu mobile aberto** — implementado seguindo as convenções do sistema, mas **sem desenho no Figma**; validar
- [ ] **Ícones dos cabeçalhos de seção dos Banners 2–5** — confirmar no Figma quais são e mapear para Feather
- [ ] **Tela do Quiz** — só existe o botão de gatilho
- [ ] **Estados vazio, de erro e de carregamento** — não existem no Figma
