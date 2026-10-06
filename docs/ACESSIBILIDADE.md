# Acessibilidade do site

Auditoria de 6 out 2026, nas 15 páginas (PT e EN + 404), com o site em modo claro e escuro, no computador (1280 px) e no celular (390 px). Referência: WCAG 2.2, nível AA.

## Como foi testado

- **axe-core 4.14** (regras WCAG 2.0, 2.1 e 2.2 A/AA e boas práticas) em cada página e também com os menus abertos: configurações, menu do e-mail, tamanhos de wallpaper e a oferta de Black Friday ligada.
- **Árvore de acessibilidade** (o que o VoiceOver, o NVDA e o TalkBack leem): títulos, regiões, nomes de links e botões, imagens e listas.
- **Teclado:** Tab por todas as páginas principais, conferindo a ordem e o anel de foco.
- **Zoom e telas estreitas:** página com 320 px de largura (equivale a 400% de zoom) e espaçamento de texto aumentado (WCAG 1.4.12).
- **Alto contraste do Windows** (forced colors), **reduzir movimento** e **contraste de cores**.
- **Não testado com pessoas nem com leitores de tela de verdade.** A árvore de acessibilidade mostra o que eles leem, mas vale uma rodada com o VoiceOver no iPhone e no Mac antes de considerar fechado (roteiro no fim).

## O que já estava bom

- Um `h1` por página e títulos em ordem; regiões (`header`, `nav`, `main`, `footer`) com nome.
- Link "Pular para o conteúdo", idioma da página (`lang`) certo, e o aviso de idioma muda o `lang` para o idioma da mensagem.
- Todos os elementos interativos alcançáveis pelo teclado, na ordem visual, com anel de foco visível. `Esc` fecha os menus.
- Menu de configurações: botão com `aria-expanded`, tema como grupo de rádio (setas trocam a opção), idioma com `aria-current`.
- Filtros de wallpaper e temas são rádios de verdade, dentro de `fieldset` com `legend`.
- FAQ e menus de tamanho/e-mail usam `details`/`summary`, que já anunciam "expandido/recolhido".
- Botões de copiar avisam "Copiado" para leitores de tela (`aria-live`).
- Imagens: foto da Paçoca com descrição; telas do app e carteirinha em PDF com descrição; prévias decorativas escondidas dos leitores de tela.
- Contraste de cores dentro do AA em claro e escuro (o aviso do axe na página do PetHealthTracker é falso: é o texto ainda transparente antes de aparecer ao rolar; com as seções visíveis ou com "reduzir movimento" não há erro).
- "Reduzir movimento" desliga as animações e a troca de tema suave.
- Áreas de toque com 44 px ou mais (os links menores estão dentro de frases, que é permitido).

## Problemas encontrados e corrigidos

| # | Problema | Quem é afetado | Critério WCAG | Correção |
|---|---|---|---|---|
| 1 | O nome lido pelo leitor de tela não incluía o texto visível em 40 controles: downloads de wallpaper ("Mobile", "Desktop" e os 4 tamanhos de cada um), downloads do iTerm2 e "Escrever e-mail" | Quem usa controle por voz ("toque em Mobile" não funcionava) e leitores de tela | 2.5.3 Rótulo no nome (A) | Tiramos o `aria-label` e acrescentamos texto só para leitores de tela depois do visível. Ex.: "Mobile, PNG 1320 × 2868, Halloween" |
| 2 | Listas sem marcador perdem o anúncio de "lista" no Safari | VoiceOver no iPhone e no Mac | 1.3.1 Informação e relações (A) | `role="list"` nas 13 listas do site e nas da Política |
| 3 | Área de rolagem dos wallpapers (carrossel no celular, caixa no computador) tinha rótulo que não era lido | Leitores de tela | 4.1.2 Nome, função, valor (A) | `role="region"` junto com o rótulo |
| 4 | Título "BLACK FRIDAY" era lido como "BLACKFRIDAY" | Leitores de tela | 1.3.1 (A) | Espaço entre as duas palavras |
| 5 | Em telas de 320 px (ou zoom de 400%) o título "PetHealthTracker" passava da tela e criava rolagem lateral | Baixa visão com zoom, celulares pequenos | 1.4.10 Reflow (AA) | Fonte menor abaixo de 360 px e quebra permitida |
| 6 | Com espaçamento de texto aumentado, o filtro de wallpapers passava da tela | Dislexia, baixa visão | 1.4.12 Espaçamento de texto (AA) | O filtro quebra linha se precisar |
| 7 | No alto contraste do Windows não dava para ver a opção escolhida nos filtros e no tema, e os botões cheios ficavam sem contorno | Baixa visão com alto contraste | 1.4.11 Contraste não textual (AA) | Borda do sistema (`Highlight`/`ButtonText`) no modo de alto contraste |
| 8 | Grupos de links do rodapé ("Projetos", "Ajuda") eram só texto | Leitores de tela (navegação por regiões) | Boa prática | Viraram `nav` com nome |

Nenhuma mudança visual no modo normal: as 60 capturas (claro/escuro, 1280/390, PT/EN) ficaram iguais.

## Pendências

- **Toski DS (levar ao repositório):** `CheckList` sem `role="list"` (afeta listas da página do PetHealthTracker no VoiceOver) e botões cheios sem borda transparente (o site corrige no alto contraste, mas o lugar certo é o `buttonClasses()`).
- **Teste com VoiceOver de verdade** (roteiro abaixo).
- **Preços na página do PetHealthTracker:** "Mensal Em breve cobrança mensal" é lido sem pausa. Funciona, mas dá para melhorar com pontuação só para leitores de tela quando os preços forem definidos.

## Roteiro rápido com VoiceOver

iPhone: Ajustes › Acessibilidade › VoiceOver (ou triplo clique no botão lateral). Mac: Cmd + F5.

1. Home: deslize pela página e confira se cada título, link e a foto da Paçoca são lidos com sentido. Use o rotor em "Títulos" para pular entre seções.
2. Menu "PT" no topo: abra, troque o tema e o idioma, feche.
3. Wallpapers: no celular, entre no carrossel, passe pelos cards e baixe um; abra os tamanhos do Desktop.
4. Temas: copie um comando e confira se ouve "Copiado".
5. Suporte: abra "Escrever e-mail", escolha o Gmail; abra uma pergunta do FAQ.
6. Privacidade: confira se as listas são anunciadas como listas.
