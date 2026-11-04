export function setupImageCarousel(carousel: HTMLElement) {
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  const viewport = carousel.querySelector<HTMLElement>('[data-viewport]');
  const controls = carousel.querySelector<HTMLElement>('[data-controls]');
  const status = carousel.querySelector<HTMLElement>('[data-status]');
  const toggle = carousel.querySelector<HTMLButtonElement>('[data-toggle]');
  if (!viewport || !controls || !status || !toggle || slides.length < 2) return;
  let current = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = carousel.dataset.autoplay === 'true' && !reducedMotion.matches;
  let timer: number | undefined;
  let hovered = carousel.matches(':hover') && window.matchMedia('(hover: hover)').matches;
  const canRotate = () => playing && !hovered && !document.hidden;
  let request = 0;
  slides.forEach(slide => { slide.hidden = false; });
  const show = async (index: number, automatic = false) => {
    const target = (index + slides.length) % slides.length;
    const latest = ++request;
    const image = slides[target].querySelector('img');
    if (image) await image.decode().catch(() => {});
    if (latest !== request || (automatic && !canRotate())) return;
    current = target;
    slides.forEach((slide, i) => {
      slide.dataset.active = String(i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
    status.textContent = `${current + 1} / ${slides.length}`;
  };
  const updatePlayback = () => {
    window.clearInterval(timer);
    toggle.setAttribute('aria-label', playing ? (toggle.dataset.pauseLabel ?? 'Pause slides') : (toggle.dataset.playLabel ?? 'Play slides'));
    toggle.dataset.playing = String(playing);
    status.setAttribute('aria-live', canRotate() ? 'off' : 'polite');
    if (canRotate()) timer = window.setInterval(() => show(current + 1, true), 5000);
  };
  toggle.addEventListener('click', () => { playing = !playing; updatePlayback(); });
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { playing = false; updatePlayback(); }
  });
  carousel.addEventListener('focusin', event => {
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
      playing = false;
      updatePlayback();
    }
  });
  carousel.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    updatePlayback();
  });
  carousel.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    updatePlayback();
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); updatePlayback(); }));
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    playing = false;
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
    updatePlayback();
  });
  let start: { x: number; y: number } | undefined;
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    start = { x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = undefined;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) { show(current + (dx < 0 ? 1 : -1)); updatePlayback(); }
  });
  viewport.addEventListener('pointercancel', () => { start = undefined; });
  controls.hidden = false;
  updatePlayback();
}
