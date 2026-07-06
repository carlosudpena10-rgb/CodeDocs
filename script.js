/* CURSOR */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
});

/* LOGOS CAYENDO */
const canvas = document.getElementById('canvas-logos');
const ctx = canvas.getContext('2d');
const logos = ['🐍','⚡','☕','⚙️','🔵','🦀','🐹','🐘','💎','🍎','🎯','🗄️','🖥️','💜','📦'];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : -60;
    this.size = Math.random() * 14 + 16;
    this.speed = Math.random() * 0.7 + 0.2;
    this.opacity = Math.random() * 0.18 + 0.05;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.012;
    this.emoji = logos[Math.floor(Math.random() * logos.length)];
  }
  update() {
    this.y += this.speed;
    this.x += this.drift;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height + 60) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.font = this.size + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 20; i++) particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();
initParticles();
animate();

/* SCROLL REVEAL */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* NAVBAR + BACK TO TOP */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow = window.scrollY > 10 ? '0 1px 24px rgba(0,0,0,0.09)' : 'none';
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

/* MENÚ MÓVIL */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* STATS */
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (el.dataset.target === '90' ? '%' : '+');
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* GENERADOR */
let currentGenTab = 'paste';
let uploadedCode = '';
let results = { readme: '', documented: '', guide: '' };

function switchGenTab(tab) {
  currentGenTab = tab;
  document.querySelectorAll('.gen-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'paste') || (i === 1 && tab === 'upload'));
  });
  document.getElementById('gen-paste').classList.toggle('active', tab === 'paste');
  document.getElementById('gen-upload').classList.toggle('active', tab === 'upload');
}

function updateCount() {
  const code = document.getElementById('code-input').value;
  document.getElementById('char-count').textContent = code.length + ' chars';
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.add('dragover');
}

function handleDragLeave() {
  document.getElementById('drop-zone').classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.remove('dragover');
  if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
}

function handleFileSelect(e) {
  if (e.target.files[0]) readFile(e.target.files[0]);
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedCode = e.target.result;
    document.getElementById('file-name').textContent = file.name + ' — ' + uploadedCode.length + ' caracteres';
    document.getElementById('file-loaded').classList.add('visible');
    autoDetectLang(file.name);
  };
  reader.readAsText(file);
}

function autoDetectLang(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = { py:'python', js:'javascript', ts:'typescript', java:'java', cpp:'c++', cs:'c#', go:'go', rs:'rust', php:'php', rb:'ruby', swift:'swift', kt:'kotlin', sql:'sql', sh:'bash' };
  const sel = document.getElementById('lang-select-upload');
  if (map[ext]) sel.value = map[ext];
}

/* SIMULACIÓN */
function generarSimulacion(codigo, lang) {
  const langLabel = (lang === 'auto') ? 'Python' : lang;

  const readme = `# Proyecto: Calculadora de Precios

## Descripción
Este proyecto contiene funciones en ${langLabel} para calcular descuentos, aplicar impuestos y obtener el precio final de un producto de forma automática.

## Requisitos
- ${langLabel} 3.8 o superior
- No requiere librerías externas

## Instalación
1. Descarga el archivo del proyecto
2. Abre el archivo en tu editor favorito
3. Ejecuta el script desde la terminal

## Uso
resultado = precio_final(1000, 10, True)
print(resultado)

## Funciones disponibles
- calcular_descuento(precio, porcentaje)
- aplicar_impuesto(precio, tasa)
- precio_final(precio_base, descuento, con_impuesto)
- mostrar_resumen(producto, precio, descuento)

## Autor
Proyecto académico — Universidad Tecmilenio 2026`;

  const documented = `"""
Calculadora de Precios con Descuento e Impuesto
Generado por CodeDocs con Claude AI
"""

def calcular_descuento(precio, porcentaje):
    """
    Calcula el precio después de aplicar un descuento.
    Args:
        precio (float): Precio original del producto.
        porcentaje (float): Porcentaje de descuento (0-100).
    Returns:
        float: Precio con descuento aplicado.
    """
    if porcentaje < 0 or porcentaje > 100:
        raise ValueError("El porcentaje debe estar entre 0 y 100")
    descuento = precio * (porcentaje / 100)
    return precio - descuento

def aplicar_impuesto(precio, tasa_impuesto=0.16):
    """
    Aplica el IVA al precio dado.
    Args:
        precio (float): Precio base sin impuesto.
        tasa_impuesto (float): Tasa de impuesto. Default 0.16 (16%).
    Returns:
        float: Precio con impuesto incluido.
    """
    return precio * (1 + tasa_impuesto)

def precio_final(precio_base, descuento_pct, con_impuesto=True):
    """
    Calcula el precio final aplicando descuento e impuesto.
    Args:
        precio_base (float): Precio original.
        descuento_pct (float): Porcentaje de descuento.
        con_impuesto (bool): Incluir IVA. Default True.
    Returns:
        float: Precio final redondeado.
    """
    precio = calcular_descuento(precio_base, descuento_pct)
    if con_impuesto:
        precio = aplicar_impuesto(precio)
    return round(precio, 2)

def mostrar_resumen(producto, precio_base, descuento_pct):
    """
    Muestra resumen del precio en consola.
    """
    final = precio_final(precio_base, descuento_pct)
    print(f"Producto: {producto}")
    print(f"Precio original: ${precio_base}")
    print(f"Descuento: {descuento_pct}%")
    print(f"Precio final con IVA: ${final}")

mostrar_resumen("Laptop", 15000, 10)`;

  const guide = `# Guía de Usuario — Calculadora de Precios

## ¿Qué hace este programa?
Calcula el precio final de cualquier producto después de aplicar un descuento y el IVA automáticamente.

## ¿Cómo se usa?

Paso 1 — Abre la terminal y ejecuta:
  python codigo.py

Paso 2 — El programa muestra el resultado:
  Producto: Laptop
  Precio original: $15000
  Descuento: 10%
  Precio final con IVA: $15660.0

## ¿Puedo cambiar los valores?
Sí. Al final del archivo cambia esta línea:
  mostrar_resumen("Laptop", 15000, 10)

- "Laptop" = nombre del producto
- 15000 = precio original
- 10 = porcentaje de descuento

## ¿Necesito saber programar?
No. Solo ejecuta el archivo y el programa hace todo.

Documentación generada por CodeDocs con Claude AI
Universidad Tecmilenio 2026`;

  return { readme, documented, guide };
}

/* GENERAR */
function generateDocs() {
  const code = currentGenTab === 'paste'
    ? document.getElementById('code-input').value.trim()
    : uploadedCode.trim();

  if (!code) {
    alert('Por favor ingresa o sube código primero.');
    return;
  }

  const lang = currentGenTab === 'paste'
    ? document.getElementById('lang-select').value
    : document.getElementById('lang-select-upload').value;

  const btn = document.getElementById('gen-btn');
  const progressWrap = document.getElementById('progress-wrap');
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');

  btn.disabled = true;
  document.getElementById('btn-text').textContent = '⏳ Generando...';
  document.getElementById('results').classList.remove('visible');
  progressWrap.classList.add('visible');

  progressBar.style.width = '20%';
  progressLabel.textContent = '📖 Leyendo el código...';

  setTimeout(function() {
    progressBar.style.width = '45%';
    progressLabel.textContent = '🧠 Construyendo el prompt...';
  }, 700);

  setTimeout(function() {
    progressBar.style.width = '70%';
    progressLabel.textContent = '✨ Consultando Claude AI...';
  }, 1400);

  setTimeout(function() {
    progressBar.style.width = '90%';
    progressLabel.textContent = '📝 Procesando respuesta...';
  }, 2100);

  setTimeout(function() {
    progressBar.style.width = '100%';
    progressLabel.textContent = '✅ ¡Documentación generada!';

    const sim = generarSimulacion(code, lang);
    results.readme = sim.readme;
    results.documented = sim.documented;
    results.guide = sim.guide;

    document.getElementById('out-readme').textContent = results.readme;
    document.getElementById('out-documented').textContent = results.documented;
    document.getElementById('out-guide').textContent = results.guide;

    setTimeout(function() {
      progressWrap.classList.remove('visible');
      progressBar.style.width = '0%';
      document.getElementById('results').classList.add('visible');
      showResult('readme');
      btn.disabled = false;
      document.getElementById('btn-text').textContent = '✨ Generar documentación con IA';
    }, 800);

  }, 2800);
}

/* MOSTRAR RESULTADO */
function showResult(type) {
  ['readme', 'documented', 'guide'].forEach(function(t) {
    document.getElementById('panel-' + t).style.display = t === type ? 'block' : 'none';
  });
  document.querySelectorAll('.rtab').forEach(function(btn, i) {
    btn.classList.toggle('active', ['readme', 'documented', 'guide'][i] === type);
  });
}

/* COPIAR */
function copyResult(type) {
  if (results[type]) {
    navigator.clipboard.writeText(results[type]).then(function() {
      event.target.textContent = '✅ Copiado';
      setTimeout(function() {
        event.target.textContent = '📋 Copiar';
      }, 2000);
    });
  }
}