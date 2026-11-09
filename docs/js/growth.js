/* First-party interaction hooks. No analytics provider, cookies or personal form data are stored. */
document.addEventListener('DOMContentLoaded', () => {
  const parameters = new URLSearchParams(location.search);
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
  let campaign = {};
  try {
    const stored = JSON.parse(sessionStorage.getItem('mathib-campaign') || '{}');
    for (const key of campaignKeys) {
      const value = parameters.get(key) || stored[key];
      if (typeof value === 'string' && /^[a-zA-Z0-9 _.-]{1,60}$/.test(value)) campaign[key] = value;
    }
    if (Object.keys(campaign).length) sessionStorage.setItem('mathib-campaign', JSON.stringify(campaign));
  } catch { /* Storage can be disabled; contact must remain available. */ }

  const record = (placement, details = {}) => {
    const event = { event: 'contact_intent', placement, page_path: location.pathname, ...campaign, ...details };
    // Optional measurement must never prevent a visitor from contacting the tutor.
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(event);
      window.dispatchEvent(new CustomEvent('matematicasib:contact', { detail: event }));
    } catch { /* Continue to WhatsApp even if an external tracker fails. */ }
  };
  const suffix = () => Object.keys(campaign).length
    ? ` Referencia de campaña: ${Object.entries(campaign).map(([key, value]) => `${key}=${value}`).join(', ')}.` : '';

  window.mathibAttribution = suffix;

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    let url;
    try { url = new URL(anchor.href); } catch { return; }
    if (!['wa.me', 'api.whatsapp.com'].includes(url.hostname)) return;
    if (['quick-whatsapp-link', 'booking-whatsapp-link'].includes(anchor.id)) return;
    record(anchor.closest('header') ? 'navigation' : anchor.closest('footer') ? 'footer' : anchor.classList.contains('floating-whatsapp') ? 'floating' : anchor.id === 'calc-whatsapp-cta' ? 'grade_calculator' : 'content_link');
  });

  const form = document.getElementById('quick-enquiry');
  for (const name of ['course', 'goal']) {
    const select = document.getElementById(`quick-${name}`);
    const description = document.getElementById(`quick-${name}-description`);
    const sync = () => { if (select && description) description.textContent = select.selectedOptions[0].textContent.trim(); };
    select?.addEventListener('change', sync);
    if (select?.selectedIndex > 0 || name === 'goal') sync();
  }
  const mode = document.getElementById('quick-mode');
  const coverage = document.getElementById('quick-coverage');
  mode?.addEventListener('change', () => { if (coverage) coverage.hidden = mode.value !== 'presencial'; });
  if (form) {
    const nativeLink = document.getElementById('quick-whatsapp-link');
    const prepareQuick = () => {
      const selected = id => document.getElementById(id).selectedOptions[0].textContent.trim();
      const text = `Hola Gabriel, quiero consultar disponibilidad para una clase de Matemáticas IB. Curso: ${selected('quick-course')}. Modalidad: ${mode.value === 'presencial' ? 'presencial a domicilio en Quito' : 'virtual'}. Objetivo: ${selected('quick-goal')}. He visto la tarifa de $20 USD por 60 minutos. ¿Qué horarios tienes disponibles?` + suffix();
      const url = 'https://wa.me/593998252624?text=' + encodeURIComponent(text);
      if (nativeLink) nativeLink.href = url;
      const fallback = document.getElementById('quick-fallback');
      if (fallback) fallback.href = url;
      return url;
    };
    const recordQuick = () => record('quick_enquiry', { course: document.getElementById('quick-course').value, modality: mode.value, goal: document.getElementById('quick-goal').value });
    form.addEventListener('input', prepareQuick);
    form.addEventListener('change', prepareQuick);
    nativeLink?.addEventListener('click', recordQuick);
    form.addEventListener('submit', event => {
      event.preventDefault();
      recordQuick();
      window.location.assign(prepareQuick());
    });
    prepareQuick();
  }

  const booking = document.getElementById('booking-form');
  if (booking) {
    const course = document.getElementById('form-curso');
    const modality = document.getElementById('form-modalidad');
    const requestedCourse = parameters.get('curso');
    const requestedModality = parameters.get('modalidad');
    if (requestedCourse && Array.from(course.options).some(o => o.value === requestedCourse)) course.value = requestedCourse;
    if (['virtual', 'presencial'].includes(requestedModality)) {
      modality.value = requestedModality;
      modality.dispatchEvent(new Event('change'));
    }
    const recordBooking = () => record('booking_form', { course: course.value, modality: modality.value });
    booking.addEventListener('submit', recordBooking);
    document.getElementById('booking-whatsapp-link')?.addEventListener('click', recordBooking);
    booking.dispatchEvent(new Event('change'));
  }
});
