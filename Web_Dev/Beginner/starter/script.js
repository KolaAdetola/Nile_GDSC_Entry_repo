function shinyBox() {
  const wrapper = document.getElementById('glowWrapper');
  const svg = document.getElementById('glowSvg');
  const blurRect = document.getElementById('glowRectBlur');
  const coreRect = document.getElementById('glowRectCore');
  const content = wrapper.querySelector('.glow-box');

  // Compute and apply rect size to match the visible box (content) plus padding from wrapper
  function updateRects() {
    // get bounding rect of the wrapper (which includes padding)
    const wRect = wrapper.getBoundingClientRect();
    // get bounding rect of the content inside wrapper
    const cRect = content.getBoundingClientRect();

    // We want the glow to surround the content. Use the padded wrapper extents.
    // Compute offsets relative to wrapper top-left:
    const offsetLeft = (cRect.left - wRect.left);
    const offsetTop  = (cRect.top  - wRect.top);

    // Add a small bleed so glow sits slightly outside the box
    const bleed = 8;

    // target rectangle coordinates and size (in CSS pixels)
    const x = Math.max(0, offsetLeft - bleed);
    const y = Math.max(0, offsetTop - bleed);
    const width = Math.max(4, cRect.width + bleed * 2);
    const height = Math.max(4, cRect.height + bleed * 2);

    // Set the SVG viewBox so rect coordinates map 1:1 to wrapper CSS pixels
    svg.setAttribute('viewBox', `0 0 ${wRect.width} ${wRect.height}`);

    // Update rect attributes
    blurRect.setAttribute('x', x);
    blurRect.setAttribute('y', y);
    blurRect.setAttribute('width', width);
    blurRect.setAttribute('height', height);

    coreRect.setAttribute('x', x + 0.6); // tiny inset to avoid exact overlap
    coreRect.setAttribute('y', y + 0.6);
    coreRect.setAttribute('width', Math.max(2, width - 1.2));
    coreRect.setAttribute('height', Math.max(2, height - 1.2));

    // Read computed border radius of the content and apply to rect rx/ry
    const cs = getComputedStyle(content);
    // borderRadius might be something like "18px" or "18px 18px 18px 18px"
    const borderRadiusStr = cs.borderRadius || cs.getPropertyValue('border-radius') || '';
    // parse leading number in px
    let rx = parseFloat(borderRadiusStr) || 18;
    // make sure rx not larger than half of rect height/width
    rx = Math.min(rx, width / 2 - 1, height / 2 - 1);
    blurRect.setAttribute('rx', rx);
    blurRect.setAttribute('ry', rx);
    coreRect.setAttribute('rx', rx);
    coreRect.setAttribute('ry', rx);
  }

  // Update initially
  updateRects();

  // Recompute on window resize and when fonts/layout may change.
  window.addEventListener('resize', updateRects);
  // Also use a ResizeObserver on the wrapper so any layout change repositions the glow
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(updateRects);
    ro.observe(wrapper);
    ro.observe(content);
  } else {
    // fallback: periodic check (shouldn't be necessary in modern browsers)
    let prev = wrapper.getBoundingClientRect().toJSON();
    setInterval(function() {
      const cur = wrapper.getBoundingClientRect().toJSON();
      if (JSON.stringify(cur) !== JSON.stringify(prev)) {
        prev = cur;
        updateRects();
      }
    }, 250);
  }

  // Safety: re-run after fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateRects).catch(()=>{});
  }
}

shinyBox();

// Theme toggle: persist choice in localStorage and apply class to body
(function() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // initialize from localStorage (values: "light" or "dark")
  const stored = localStorage.getItem('site-theme');
  const prefersLight = stored ? (stored === 'light') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);

  function applyTheme(isLight) {
    document.body.classList.toggle('light-theme', !!isLight);
    toggle.checked = !!isLight;
    localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
  }

  // apply initial
  applyTheme(prefersLight);

  toggle.addEventListener('change', () => applyTheme(toggle.checked));
})();

// dim overlay under the nav when user scrolls
(function() {
  const NAV_Z_INDEX = 9999;
  const THRESHOLD = 20; // px scrolled before showing dim

  // ensure overlay exists
  let overlay = document.getElementById('navOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'navOverlay';
    document.body.appendChild(overlay);
  }

  const nav = document.querySelector('nav');

  function updateOverlayHeight() {
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    // make overlay cover from page top down past nav bottom with small padding
    const h = Math.max(64, Math.ceil(navRect.bottom + 8));
    overlay.style.height = h + 'px';
    // ensure overlay sits beneath nav
    overlay.style.zIndex = (NAV_Z_INDEX - 1).toString();
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (window.scrollY > THRESHOLD) document.body.classList.add('nav-dim');
      else document.body.classList.remove('nav-dim');
      ticking = false;
    });
  }

  // initialize
  updateOverlayHeight();
  onScroll();

  // update on scroll/resize and when layout changes
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateOverlayHeight();
    onScroll();
  }, { passive: true });

  // also respond if nav size changes
  if (typeof ResizeObserver !== 'undefined' && nav) {
    new ResizeObserver(() => updateOverlayHeight()).observe(nav);
  }
})();