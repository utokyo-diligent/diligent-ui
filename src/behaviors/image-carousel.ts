const rotationDelay = 5000;
const swipeThreshold = 48;
const mounted = new WeakMap<HTMLElement, () => void>();

export function setupImageCarousel(carousel: HTMLElement) {
  const existing = mounted.get(carousel);
  if (existing) return existing;

  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  const viewport = carousel.querySelector<HTMLElement>('[data-viewport]');
  const controls = carousel.querySelector<HTMLElement>('[data-controls]');
  const status = carousel.querySelector<HTMLElement>('[data-status]');
  const toggle = carousel.querySelector<HTMLButtonElement>('[data-toggle]');
  if (!viewport || !controls || !status || !toggle || slides.length < 2) return;

  const controller = new AbortController();
  const listeners = { signal: controller.signal };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const playLabel = toggle.dataset.playLabel ?? 'Play slides';
  const pauseLabel = toggle.dataset.pauseLabel ?? 'Pause slides';

  let current = 0;
  let pending: { index: number; automatic: boolean } | undefined;
  let timer: number | undefined;
  let playing = carousel.dataset.autoplay === 'true' && !reducedMotion.matches;
  let hovered = carousel.matches(':hover') && window.matchMedia('(hover: hover)').matches;
  let swipeStart: { id: number; x: number; y: number } | undefined;

  const canRotate = () => playing && !hovered && !document.hidden;
  const nextIndex = (offset: number) => {
    const base = pending && !pending.automatic ? pending.index : current;
    return base + offset;
  };

  const renderSlide = (index: number) => {
    slides.forEach((slide, position) => {
      slide.dataset.active = String(position === index);
      slide.setAttribute('aria-hidden', String(position !== index));
    });
    dots.forEach((dot, position) => dot.setAttribute('aria-pressed', String(position === index)));
    status.textContent = `${index + 1} / ${slides.length}`;
  };

  const updatePlayback = () => {
    const rotating = canRotate();
    if (!rotating && pending?.automatic) pending = undefined;

    window.clearTimeout(timer);
    toggle.setAttribute('aria-label', playing ? pauseLabel : playLabel);
    toggle.dataset.playing = String(playing);
    status.setAttribute('aria-live', rotating ? 'off' : 'polite');

    if (rotating && !pending) {
      timer = window.setTimeout(() => void show(current + 1, true), rotationDelay);
    }
  };

  async function show(index: number, automatic = false) {
    const selection = { index: (index + slides.length) % slides.length, automatic };
    pending = selection;
    window.clearTimeout(timer);

    // Keep the current slide visible until the new image is ready to paint.
    const image = slides[selection.index].querySelector('img');
    if (image) await image.decode().catch(() => {});
    if (pending !== selection) return;

    pending = undefined;
    current = selection.index;
    renderSlide(current);
    updatePlayback();
  }

  function pause() {
    playing = false;
    updatePlayback();
  }

  toggle.addEventListener('click', () => {
    playing = !playing;
    updatePlayback();
  }, listeners);
  document.addEventListener('visibilitychange', updatePlayback, listeners);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) pause();
  }, listeners);
  carousel.addEventListener('focusin', event => {
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) pause();
  }, listeners);
  carousel.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    updatePlayback();
  }, listeners);
  carousel.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    updatePlayback();
  }, listeners);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => void show(index), listeners);
  });
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const target = nextIndex(event.key === 'ArrowRight' ? 1 : -1);
    pause();
    void show(target);
  }, listeners);

  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
  }, listeners);
  viewport.addEventListener('pointerup', event => {
    if (event.pointerId !== swipeStart?.id) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = undefined;
    if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy)) {
      void show(nextIndex(dx < 0 ? 1 : -1));
    }
  }, listeners);
  viewport.addEventListener('lostpointercapture', event => {
    if (event.pointerId === swipeStart?.id) swipeStart = undefined;
  }, listeners);

  const dispose = () => {
    if (controller.signal.aborted) return;
    controller.abort();
    window.clearTimeout(timer);
    pending = undefined;
    controls.hidden = true;
    renderSlide(0);
    slides.forEach((slide, index) => { slide.hidden = index !== 0; });
    mounted.delete(carousel);
  };

  mounted.set(carousel, dispose);
  slides.forEach(slide => { slide.hidden = false; });
  updatePlayback();
  controls.hidden = false;
  return dispose;
}
