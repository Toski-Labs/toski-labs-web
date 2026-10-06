/**
 * Microinterações do site (proposta aprovada no canvas, página "Animações").
 * Tudo aqui é melhoria: sem JavaScript o site funciona igual, só sem movimento.
 * Com "reduzir movimento" ligado, o DS zera as durações e a revelação ao rolar nem é ligada.
 */

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Botões de copiar: <button class="toski-copy" data-copy="…" data-copied="Copiado">
   com um <svg class="toski-check"> e um <span data-text>. O status para leitor de tela
   vai para o [data-copy-status] mais próximo, se houver. */
for (const button of document.querySelectorAll<HTMLButtonElement>('.toski-copy')) {
  const text = button.querySelector<HTMLElement>('[data-text]') ?? button;
  const original = text.textContent ?? '';
  let timer: number | undefined;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy!);
    } catch {
      return;
    }
    text.textContent = button.dataset.copied!;
    button.dataset.state = 'copied';
    let status: HTMLElement | null = null;
    for (let el = button.parentElement; el && !status; el = el.parentElement) status = el.querySelector('[data-copy-status]');
    if (status) status.textContent = `${button.dataset.copied}: ${button.dataset.copy}`;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      text.textContent = original;
      delete button.dataset.state;
    }, 1600);
  });
}

/* Filtros segmentados (.toski-seg): o fundo da opção escolhida desliza até ela.
   Sem JavaScript, cada opção pinta o próprio fundo (classes has-checked / aria-checked). */
for (const group of document.querySelectorAll<HTMLElement>('.toski-seg')) {
  const thumb = document.createElement('span');
  thumb.className = 'toski-seg-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  group.prepend(thumb);
  group.dataset.slide = '';

  const current = () =>
    group.querySelector<HTMLElement>('label:has(input:checked)') ?? group.querySelector<HTMLElement>('[aria-checked="true"]');

  const place = (animate: boolean) => {
    const el = current();
    if (!el || !el.offsetWidth) return;
    thumb.style.transition = animate ? '' : 'none';
    thumb.style.width = `${el.offsetWidth}px`;
    thumb.style.height = `${el.offsetHeight}px`;
    thumb.style.top = `${el.offsetTop}px`;
    thumb.style.transform = `translateX(${el.offsetLeft}px)`;
    thumb.style.borderRadius = getComputedStyle(el).borderRadius;
    if (!animate) void thumb.offsetWidth;
  };

  place(false);
  // Muda de tamanho (fonte carregando, painel que estava escondido abrindo): reposiciona sem animar.
  new ResizeObserver(() => place(false)).observe(group);
  group.addEventListener('change', () => place(true));
  new MutationObserver(() => place(true)).observe(group, { subtree: true, attributeFilter: ['aria-checked'] });
}

/* Seções grandes aparecendo ao rolar: [data-reveal] anima os filhos um depois do outro;
   [data-reveal="self"] anima o próprio bloco. Só o que começa fora da tela, uma vez por visita. */
if (!reduceMotion() && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  for (const block of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (block.getBoundingClientRect().top < window.innerHeight) continue;
    const items = block.dataset.reveal === 'self' ? [block] : [...block.children];
    items.forEach((item, i) => (item as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(i, 5) * 80}ms`));
    block.classList.add('toski-reveal');
    observer.observe(block);
  }
}

export {};
