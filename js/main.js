document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const isExpanded = navMenu.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", isExpanded);
      menuToggle.textContent = isExpanded ? "✕" : "☰";
    });
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".faq-item");
      const isActive = parent.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(item => {
        if (item !== parent) item.classList.remove("active");
      });

      if (!isActive) {
        parent.classList.add("active");
      } else {
        parent.classList.remove("active");
      }
    });
  });

  // Contact Form & Modality Logic
  const modalitySelect = document.getElementById("form-modalidad");
  const presencialNotice = document.getElementById("presencial-notice");
  const contactForm = document.getElementById("booking-form");

  if (modalitySelect && presencialNotice) {
    modalitySelect.addEventListener("change", (e) => {
      if (e.target.value === "presencial") {
        presencialNotice.style.display = "block";
      } else {
        presencialNotice.style.display = "none";
      }
    });
  }

  if (contactForm) {
    const contactLink = document.getElementById("booking-whatsapp-link");
    const prepareContact = () => {
      const value = id => document.getElementById(id)?.value.trim() || "";
      const nombre = value("form-nombre");
      const modalidad = value("form-modalidad") || "virtual";
      const curso = value("form-curso") || "Consulta General";
      const calculadora = value("form-calculadora");
      const mensaje = value("form-mensaje");
      let text = nombre ? `Hola Gabriel, mi nombre es ${nombre}.` : "Hola Gabriel.";
      text += ` Me interesa consultar clases de Matemáticas IB (${curso}) en modalidad ${modalidad.toUpperCase()}.`;
      if (calculadora) text += ` Calculadora: ${calculadora}.`;
      if (modalidad === "presencial") text += " A domicilio en Quito.";
      if (mensaje) text += ` Mensaje: ${mensaje}`;
      if (typeof window.mathibAttribution === "function") text += window.mathibAttribution();
      const url = `https://wa.me/593998252624?text=${encodeURIComponent(text)}`;
      if (contactLink) contactLink.href = url;
      const fallback = document.getElementById("booking-fallback");
      if (fallback) fallback.href = url;
      return url;
    };
    // Prepare the href before a tap so mobile browsers handle it as a native link.
    contactForm.addEventListener("input", prepareContact);
    contactForm.addEventListener("change", prepareContact);
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      window.location.assign(prepareContact());
    });
    prepareContact();
  }


  // =========================================================================
  // Simulador Gráfico Interactivo HTML5 Canvas (Demostrador Casio / IB)
  // =========================================================================
  initIBMathSimulator();

  // =========================================================================
  // Calculadora Predictiva de Notas IB (Grade Boundary Estimator)
  // =========================================================================
  initIBGradeCalculator();

});

// =========================================================================
// Simulador Gráfico Interactivo HTML5 Canvas (Demostrador Casio / IB)
// =========================================================================
function initIBMathSimulator() {
  const canvas = document.getElementById("ib-math-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const readout = document.getElementById("canvas-readout");

  // Tab elements
  const tabBtns = document.querySelectorAll(".sim-tab");
  const normalControls = document.getElementById("controls-normal");
  const tangentControls = document.getElementById("controls-tangent");

  // Normal inputs
  const sliderMu = document.getElementById("slider-mu");
  const sliderSigma = document.getElementById("slider-sigma");
  const sliderX = document.getElementById("slider-x");
  const valMu = document.getElementById("val-mu");
  const valSigma = document.getElementById("val-sigma");
  const valX = document.getElementById("val-x");
  const casioNormalInputs = document.getElementById("casio-normal-inputs");

  // Tangent inputs
  const sliderTangentX = document.getElementById("slider-tangent-x");
  const valTangentX = document.getElementById("val-tangent-x");
  const casioTangentInputs = document.getElementById("casio-tangent-inputs");

  let activeTab = "normal";

  // Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      activeTab = btn.getAttribute("data-tab");
      if (activeTab === "normal") {
        normalControls.classList.add("active");
        tangentControls.classList.remove("active");
      } else {
        tangentControls.classList.add("active");
        normalControls.classList.remove("active");
      }
      render();
    });
  });

  // Slider events
  if (sliderMu && sliderSigma && sliderX) {
    [sliderMu, sliderSigma, sliderX].forEach(slider => {
      slider.addEventListener("input", () => {
        valMu.textContent = parseFloat(sliderMu.value).toFixed(1);
        valSigma.textContent = parseFloat(sliderSigma.value).toFixed(1);
        valX.textContent = parseFloat(sliderX.value).toFixed(1);
        render();
      });
    });
  }

  if (sliderTangentX) {
    sliderTangentX.addEventListener("input", () => {
      valTangentX.textContent = parseFloat(sliderTangentX.value).toFixed(1);
      render();
    });
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    if (ctx.resetTransform) {
      ctx.resetTransform();
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.scale(dpr, dpr);
    render();
  }

  window.addEventListener("resize", resizeCanvas);

  function normalPdf(x, mu, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  }

  function normalCdf(z) {
    if (z === 0) return 0.5;
    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.sqrt(2);
    const p = 0.3275911;
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const t = 1.0 / (1.0 + p * x);
    const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * erf);
  }

  function render() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (activeTab === "normal") {
      renderNormal(width, height);
    } else {
      renderTangent(width, height);
    }
  }

  function renderNormal(w, h) {
    const mu = parseFloat(sliderMu ? sliderMu.value : 0);
    const sigma = parseFloat(sliderSigma ? sliderSigma.value : 1);
    const xLimit = parseFloat(sliderX ? sliderX.value : 1);

    const xMin = -4.5;
    const xMax = 4.5;
    const yMax = 0.85;

    const toCanvasX = (x) => ((x - xMin) / (xMax - xMin)) * (w - 60) + 30;
    const toCanvasY = (y) => h - 35 - (y / yMax) * (h - 70);

    // Draw Grid & Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let x = -4; x <= 4; x += 1) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 15);
      ctx.lineTo(cx, h - 35);
      ctx.stroke();
    }

    // X Axis
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, h - 35);
    ctx.lineTo(w - 20, h - 35);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    for (let x = -4; x <= 4; x += 1) {
      const cx = toCanvasX(x);
      ctx.fillText(x.toString(), cx, h - 18);
    }

    // Shaded Area (Probability from -4.5 to xLimit)
    const clampedX = Math.min(Math.max(xLimit, xMin), xMax);
    const step = (xMax - xMin) / 250;

    ctx.fillStyle = "rgba(14, 165, 233, 0.35)";
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xMin), toCanvasY(0));

    for (let x = xMin; x <= clampedX; x += step) {
      ctx.lineTo(toCanvasX(x), toCanvasY(normalPdf(x, mu, sigma)));
    }
    ctx.lineTo(toCanvasX(clampedX), toCanvasY(normalPdf(clampedX, mu, sigma)));
    ctx.lineTo(toCanvasX(clampedX), toCanvasY(0));
    ctx.closePath();
    ctx.fill();

    // Normal Curve Line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += step) {
      const cy = toCanvasY(normalPdf(x, mu, sigma));
      if (x === xMin) ctx.moveTo(toCanvasX(x), cy);
      else ctx.lineTo(toCanvasX(x), cy);
    }
    ctx.stroke();

    // Limit Line at x
    const cxLimit = toCanvasX(xLimit);
    const cyLimit = toCanvasY(normalPdf(xLimit, mu, sigma));
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cxLimit, h - 35);
    ctx.lineTo(cxLimit, cyLimit);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight point
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(cxLimit, cyLimit, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Compute Probability & Z-score
    const z = (xLimit - mu) / sigma;
    const prob = normalCdf(z);

    if (readout) {
      readout.textContent = `P(X ≤ ${xLimit.toFixed(2)}) = ${prob.toFixed(4)} (${(prob * 100).toFixed(2)}%)`;
    }

    if (casioNormalInputs) {
      casioNormalInputs.textContent = `Lower: -1E99 | Upper: ${xLimit.toFixed(2)} | σ: ${sigma.toFixed(2)} | μ: ${mu.toFixed(2)} → [EXE] (Z=${z.toFixed(2)})`;
    }
  }

  function renderTangent(w, h) {
    const x0 = parseFloat(sliderTangentX ? sliderTangentX.value : 1.0);

    // Function: f(x) = 0.25 * x^3 - x
    // Derivative: f'(x) = 0.75 * x^2 - 1
    const f = (x) => 0.25 * Math.pow(x, 3) - x;
    const fPrime = (x) => 0.75 * Math.pow(x, 2) - 1;

    const xMin = -3.2;
    const xMax = 3.2;
    const yMin = -2.5;
    const yMax = 2.5;

    const toCanvasX = (x) => ((x - xMin) / (xMax - xMin)) * (w - 60) + 30;
    const toCanvasY = (y) => h - 35 - ((y - yMin) / (yMax - yMin)) * (h - 70);

    // Draw Grid & Axes
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let x = -3; x <= 3; x += 1) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 15);
      ctx.lineTo(cx, h - 35);
      ctx.stroke();
    }
    for (let y = -2; y <= 2; y += 1) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(w - 20, cy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    // X Axis (at y = 0)
    ctx.beginPath();
    ctx.moveTo(20, toCanvasY(0));
    ctx.lineTo(w - 20, toCanvasY(0));
    ctx.stroke();

    // Y Axis (at x = 0)
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 15);
    ctx.lineTo(toCanvasX(0), h - 15);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    for (let x = -3; x <= 3; x += 1) {
      if (x === 0) continue;
      ctx.fillText(x.toString(), toCanvasX(x), toCanvasY(0) + 16);
    }

    // Curve Line f(x)
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const step = (xMax - xMin) / 200;
    for (let x = xMin; x <= xMax; x += step) {
      const cy = toCanvasY(f(x));
      if (x === xMin) ctx.moveTo(toCanvasX(x), cy);
      else ctx.lineTo(toCanvasX(x), cy);
    }
    ctx.stroke();

    // Tangent Line
    const y0 = f(x0);
    const m = fPrime(x0);
    const b = y0 - m * x0;

    // Line from xMin to xMax: y = m*x + b
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xMin), toCanvasY(m * xMin + b));
    ctx.lineTo(toCanvasX(xMax), toCanvasY(m * xMax + b));
    ctx.stroke();

    // Tangent Point P(x0, y0)
    const cx0 = toCanvasX(x0);
    const cy0 = toCanvasY(y0);
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(cx0, cy0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring on point
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx0, cy0, 6, 0, Math.PI * 2);
    ctx.stroke();

    if (readout) {
      readout.textContent = `P(${x0.toFixed(2)}, ${y0.toFixed(2)}) | Pendiente m = ${m.toFixed(2)}`;
    }

    if (casioTangentInputs) {
      const sign = b >= 0 ? "+" : "-";
      casioTangentInputs.textContent = `Y1 = 0.25x³ - x | x₀ = ${x0.toFixed(2)} → Pendiente f'(x₀) = ${m.toFixed(2)} | Tangente: y = ${m.toFixed(2)}x ${sign} ${Math.abs(b).toFixed(2)}`;
    }
  }

  // Initial draw
  setTimeout(resizeCanvas, 50);
}

// =========================================================================
// Calculadora Predictiva de Calificaciones IB (Grade Boundary Estimator)
// =========================================================================
function initIBGradeCalculator() {
  const calcContainer = document.getElementById("calculadora-notas-ib");
  if (!calcContainer || !document.getElementById("input-p1")) return;

  const subjectBtns = document.querySelectorAll(".subject-btn");
  const p1Title = document.getElementById("p1-title");
  const p1Weight = document.getElementById("p1-weight");
  const p2Title = document.getElementById("p2-title");
  const p2Weight = document.getElementById("p2-weight");
  const p3Row = document.getElementById("p3-row");
  const p3Weight = document.getElementById("p3-weight");
  const maxP1 = document.getElementById("max-p1");
  const maxP2 = document.getElementById("max-p2");
  const maxP3 = document.getElementById("max-p3");

  const inputP1 = document.getElementById("input-p1");
  const numP1 = document.getElementById("num-p1");
  const pctP1 = document.getElementById("pct-p1");

  const inputP2 = document.getElementById("input-p2");
  const numP2 = document.getElementById("num-p2");
  const pctP2 = document.getElementById("pct-p2");

  const inputP3 = document.getElementById("input-p3");
  const numP3 = document.getElementById("num-p3");
  const pctP3 = document.getElementById("pct-p3");

  const inputIa = document.getElementById("input-ia");
  const numIa = document.getElementById("num-ia");
  const pctIa = document.getElementById("pct-ia");

  const finalDigit = document.getElementById("final-grade-digit");
  const finalPct = document.getElementById("final-pct-val");
  const statusTag = document.getElementById("grade-status-tag");
  const barFill = document.getElementById("boundaries-fill");
  const barMarker = document.getElementById("boundaries-marker");
  const feedbackBox = document.getElementById("grade-feedback-box");
  const whatsappCta = document.getElementById("calc-whatsapp-cta");

  const configs = {
    "aa-sl": {
      name: "Analysis & Approaches (AA) SL",
      isHL: false,
      p1: { name: "Paper 1 (Sin calculadora)", weight: 0.40, max: 80 },
      p2: { name: "Paper 2 (Con calculadora Casio)", weight: 0.40, max: 80 },
      ia: { weight: 0.20, max: 20 },
      cutoffs: [
        { grade: 7, min: 70, label: "Nivel Sobresaliente", color: "#4ade80" },
        { grade: 6, min: 58, label: "Muy Buen Nivel", color: "#22c55e" },
        { grade: 5, min: 46, label: "Buen Nivel", color: "#38bdf8" },
        { grade: 4, min: 34, label: "Nivel 4 orientativo", color: "#facc15" },
        { grade: 3, min: 23, label: "En Riesgo", color: "#fb923c" },
        { grade: 2, min: 12, label: "Insuficiente", color: "#f87171" },
        { grade: 1, min: 0, label: "Crítico", color: "#ef4444" }
      ]
    },
    "aa-hl": {
      name: "Analysis & Approaches (AA) HL",
      isHL: true,
      p1: { name: "Paper 1 (Sin calculadora)", weight: 0.30, max: 110 },
      p2: { name: "Paper 2 (Con calculadora Casio)", weight: 0.30, max: 110 },
      p3: { name: "Paper 3 (Problemas extendidos)", weight: 0.20, max: 55 },
      ia: { weight: 0.20, max: 20 },
      cutoffs: [
        { grade: 7, min: 68, label: "Nivel Sobresaliente", color: "#4ade80" },
        { grade: 6, min: 56, label: "Muy Buen Nivel", color: "#22c55e" },
        { grade: 5, min: 44, label: "Buen Nivel", color: "#38bdf8" },
        { grade: 4, min: 32, label: "Nivel 4 orientativo", color: "#facc15" },
        { grade: 3, min: 21, label: "En Riesgo", color: "#fb923c" },
        { grade: 2, min: 11, label: "Insuficiente", color: "#f87171" },
        { grade: 1, min: 0, label: "Crítico", color: "#ef4444" }
      ]
    },
    "ai-sl": {
      name: "Applications & Interpretation (AI) SL",
      isHL: false,
      p1: { name: "Paper 1 (Calculadora Casio GDC)", weight: 0.40, max: 80 },
      p2: { name: "Paper 2 (Calculadora Casio GDC)", weight: 0.40, max: 80 },
      ia: { weight: 0.20, max: 20 },
      cutoffs: [
        { grade: 7, min: 72, label: "Nivel Sobresaliente", color: "#4ade80" },
        { grade: 6, min: 60, label: "Muy Buen Nivel", color: "#22c55e" },
        { grade: 5, min: 48, label: "Buen Nivel", color: "#38bdf8" },
        { grade: 4, min: 36, label: "Nivel 4 orientativo", color: "#facc15" },
        { grade: 3, min: 25, label: "En Riesgo", color: "#fb923c" },
        { grade: 2, min: 13, label: "Insuficiente", color: "#f87171" },
        { grade: 1, min: 0, label: "Crítico", color: "#ef4444" }
      ]
    },
    "ai-hl": {
      name: "Applications & Interpretation (AI) HL",
      isHL: true,
      p1: { name: "Paper 1 (Calculadora Casio GDC)", weight: 0.30, max: 110 },
      p2: { name: "Paper 2 (Calculadora Casio GDC)", weight: 0.30, max: 110 },
      p3: { name: "Paper 3 (Problemas extendidos y modelación)", weight: 0.20, max: 55 },
      ia: { weight: 0.20, max: 20 },
      cutoffs: [
        { grade: 7, min: 70, label: "Nivel Sobresaliente", color: "#4ade80" },
        { grade: 6, min: 58, label: "Muy Buen Nivel", color: "#22c55e" },
        { grade: 5, min: 46, label: "Buen Nivel", color: "#38bdf8" },
        { grade: 4, min: 34, label: "Nivel 4 orientativo", color: "#facc15" },
        { grade: 3, min: 23, label: "En Riesgo", color: "#fb923c" },
        { grade: 2, min: 12, label: "Insuficiente", color: "#f87171" },
        { grade: 1, min: 0, label: "Crítico", color: "#ef4444" }
      ]
    }
  };

  let currentSubject = "aa-sl";

  function setupSubject(subKey) {
    currentSubject = subKey;
    const cfg = configs[subKey];

    p1Title.textContent = cfg.p1.name;
    p1Weight.textContent = `Ponderación: ${(cfg.p1.weight * 100).toFixed(0)}%`;
    maxP1.textContent = cfg.p1.max;
    inputP1.max = cfg.p1.max;
    numP1.max = cfg.p1.max;
    if (parseFloat(inputP1.value) > cfg.p1.max) {
      inputP1.value = Math.round(cfg.p1.max * 0.7);
      numP1.value = inputP1.value;
    }

    p2Title.textContent = cfg.p2.name;
    p2Weight.textContent = `Ponderación: ${(cfg.p2.weight * 100).toFixed(0)}%`;
    maxP2.textContent = cfg.p2.max;
    inputP2.max = cfg.p2.max;
    numP2.max = cfg.p2.max;
    if (parseFloat(inputP2.value) > cfg.p2.max) {
      inputP2.value = Math.round(cfg.p2.max * 0.72);
      numP2.value = inputP2.value;
    }

    if (cfg.isHL) {
      p3Row.style.display = "block";
      p3Weight.textContent = `Ponderación: 20%`;
      maxP3.textContent = 55;
      inputP3.max = 55;
      numP3.max = 55;
    } else {
      p3Row.style.display = "none";
    }

    calculate();
  }

  subjectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      subjectBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setupSubject(btn.getAttribute("data-subject"));
    });
  });

  function bindSync(slider, numberInput) {
    slider.addEventListener("input", () => {
      numberInput.value = slider.value;
      calculate();
    });
    numberInput.addEventListener("input", () => {
      let val = parseFloat(numberInput.value) || 0;
      val = Math.min(Math.max(val, 0), parseFloat(slider.max));
      slider.value = val;
      calculate();
    });
  }

  bindSync(inputP1, numP1);
  bindSync(inputP2, numP2);
  bindSync(inputP3, numP3);
  bindSync(inputIa, numIa);

  function calculate() {
    const cfg = configs[currentSubject];

    const v1 = parseFloat(inputP1.value) || 0;
    const v2 = parseFloat(inputP2.value) || 0;
    const v3 = parseFloat(inputP3.value) || 0;
    const vIa = parseFloat(inputIa.value) || 0;

    const p1Percent = (v1 / cfg.p1.max) * 100;
    const p2Percent = (v2 / cfg.p2.max) * 100;
    const iaPercent = (vIa / cfg.ia.max) * 100;

    pctP1.textContent = `(${p1Percent.toFixed(1)}%)`;
    pctP2.textContent = `(${p2Percent.toFixed(1)}%)`;
    pctIa.textContent = `(${iaPercent.toFixed(1)}%)`;

    let total = 0;
    if (cfg.isHL) {
      const p3Percent = (v3 / cfg.p3.max) * 100;
      pctP3.textContent = `(${p3Percent.toFixed(1)}%)`;
      total = (p1Percent * cfg.p1.weight) + (p2Percent * cfg.p2.weight) + (p3Percent * cfg.p3.weight) + (iaPercent * cfg.ia.weight);
    } else {
      total = (p1Percent * cfg.p1.weight) + (p2Percent * cfg.p2.weight) + (iaPercent * cfg.ia.weight);
    }

    total = Math.min(Math.max(total, 0), 100);
    finalPct.textContent = `${total.toFixed(1)}%`;

    let matched = cfg.cutoffs[cfg.cutoffs.length - 1];
    for (let i = 0; i < cfg.cutoffs.length; i++) {
      if (total >= cfg.cutoffs[i].min) {
        matched = cfg.cutoffs[i];
        break;
      }
    }

    finalDigit.textContent = matched.grade;
    finalDigit.style.color = matched.color;
    statusTag.textContent = matched.label;

    barFill.style.width = `${total}%`;
    barMarker.style.left = `${total}%`;

    let feedback = "";
    const cut7 = cfg.cutoffs[0].min;
    const cut6 = cfg.cutoffs[1].min;
    const cut5 = cfg.cutoffs[2].min;
    const cut4 = cfg.cutoffs[3].min;

    if (matched.grade === 7) {
      feedback = `<strong>¡Excelente! Te encuentras en rango de 7 (Sobresaliente).</strong> Tu promedio ponderado de ${total.toFixed(1)}% supera el umbral orientativo de esta herramienta (${cut7}%). Asegúrate de mantener la precisión en la Exploración Matemática (IA) para seguir trabajando hacia tu meta.`;
    } else if (matched.grade === 6) {
      const diff = (cut7 - total).toFixed(1);
      feedback = `<strong>Estás en Nivel 6, a solo ${diff}% de alcanzar el 7.</strong> Con clases de refuerzo enfocadas en velocidad de calculadora Casio para Paper 2 y optimizando los Criterios C y E de tu IA, este margen es totalmente alcanzable.`;
    } else if (matched.grade === 5) {
      const diff = (cut6 - total).toFixed(1);
      feedback = `<strong>Nivel 5 sólido, a ${diff}% del Nivel 6.</strong> Tu mayor margen de ganancia está en resolver preguntas tipo Paper 2 y Paper 3 bajo tiempo cronometrado y evitar errores de notación según los Mark Schemes.`;
    } else if (matched.grade === 4) {
      const diff = (cut5 - total).toFixed(1);
      feedback = `<strong>Estimación orientativa de Nivel 4, a ${diff}% de subir a Nivel 5.</strong> Requiere consolidar los temas base (álgebra y funciones) y apoyarte fuertemente en los menús de tu calculadora Casio para asegurar puntos en ejercicios básicos.`;
    } else {
      feedback = `<strong>Calificación proyectada en riesgo (${matched.grade}/7).</strong> Es urgente una nivelación conceptual y práctica guiada con past papers para subir al umbral de aprobación (${cut4}%).`;
    }

    feedbackBox.innerHTML = feedback;

    const waMsg = `Hola Gabriel, calculé mis notas en matematicasib.com: mi estimación actual es de ${matched.grade}/7 (${total.toFixed(1)}%) en ${cfg.name}. Deseo coordinar clases para trabajar hacia mi meta de puntaje.`;
    whatsappCta.href = `https://wa.me/593998252624?text=${encodeURIComponent(waMsg)}`;
  }

  setupSubject("aa-sl");
}
