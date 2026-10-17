// The hero photograph rendered as a water surface. Pointer movement and a slow
// rhythm of ambient drops send refracting ripples across it. The <img> beneath
// stays the fallback whenever WebGL, motion or the photo is unavailable.
const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const DROPS = 16;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uImage;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec2 uSize;
uniform float uTime;
uniform vec3 uAqua;
uniform vec4 uDrops[${DROPS}];

void main() {
  vec2 p = vUv * uSize;
  vec2 shift = vec2(0.);
  float light = 0.;
  // Each drop is an expanding, decaying ring: x, y in CSS pixels, start time, strength.
  for (int i = 0; i < ${DROPS}; i++) {
    vec4 drop = uDrops[i];
    float age = uTime - drop.z;
    if (drop.w <= 0. || age < 0. || age > 3.4) continue;
    vec2 delta = p - drop.xy;
    float distance = length(delta) + .001;
    float radius = age * 230.;
    float x = distance - radius;
    float envelope = exp(-x * x / 3200.);
    float fade = drop.w * smoothstep(0., .1, age) * (1. - smoothstep(2.2, 3.4, age)) / (1. + radius / 320.);
    float wave = x * .135;
    vec2 direction = delta / distance;
    shift += direction * cos(wave) * envelope * fade * 8.;
    light += dot(direction, vec2(-.55, -.84)) * sin(wave) * envelope * fade;
  }
  // Overlapping wakes add up; cap them so the photograph never melts.
  float amount = length(shift);
  if (amount > 9.) shift *= 9. / amount;
  light = clamp(light, -1., 1.);
  // A faint, constant swell keeps the surface alive between drops.
  shift += vec2(sin(p.y * .011 + uTime * .7) + sin((p.x + p.y) * .007 - uTime * .45), cos(p.x * .009 - uTime * .55)) * .7;
  vec2 uv = (vUv - shift / uSize) * uScale + uOffset;
  vec3 color = texture2D(uImage, clamp(uv, .001, .999)).rgb;
  color += uAqua * max(light, 0.) * .32 + max(light, 0.) * .1;
  color *= 1. - max(-light, 0.) * .12;
  gl_FragColor = vec4(color, 1.);
}`;

type Surface = {
  program: WebGLProgram;
  vertices: WebGLBuffer;
  image: WebGLTexture;
  time: WebGLUniformLocation | null;
  size: WebGLUniformLocation | null;
  scale: WebGLUniformLocation | null;
  offset: WebGLUniformLocation | null;
  drops: WebGLUniformLocation | null;
};

export function initHeroWater(hero: HTMLElement) {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-hero-water]');
  const photo = hero.querySelector<HTMLImageElement>('.hero__img');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || !photo || canvas.dataset.waterState || motion.matches || !('ResizeObserver' in window) || !('IntersectionObserver' in window)) return;
  canvas.dataset.waterState = 'fallback';
  let gl: WebGLRenderingContext | null;
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  } catch { return; }
  if (!gl) return;
  const context = gl;
  const drops = new Float32Array(DROPS * 4);
  let next = 0;
  let surface: Surface | undefined;
  let loadedSrc = '';
  let visible = false;
  let suspended = false;
  let disposed = false;
  let frame = 0;
  let lastFrame = 0;
  let time = 0;
  let nextAmbient = 1.6;
  let lastPointer: [number, number, number] | undefined;

  const color = (name: string): number[] => {
    const hex = getComputedStyle(hero).getPropertyValue(name).trim().replace('#', '');
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  };
  const compile = (type: number, source: string) => {
    const shader = context.createShader(type);
    if (!shader) return null;
    context.shaderSource(shader, source);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) { context.deleteShader(shader); return null; }
    return shader;
  };
  const setup = () => {
    const vertex = compile(context.VERTEX_SHADER, vertexSource);
    const fragment = compile(context.FRAGMENT_SHADER, fragmentSource);
    const program = context.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) context.deleteShader(vertex);
      if (fragment) context.deleteShader(fragment);
      if (program) context.deleteProgram(program);
      return false;
    }
    context.attachShader(program, vertex);
    context.attachShader(program, fragment);
    context.linkProgram(program);
    context.deleteShader(vertex);
    context.deleteShader(fragment);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) { context.deleteProgram(program); return false; }
    const vertices = context.createBuffer();
    const image = context.createTexture();
    if (!vertices || !image) {
      context.deleteProgram(program);
      if (vertices) context.deleteBuffer(vertices);
      if (image) context.deleteTexture(image);
      return false;
    }
    context.useProgram(program);
    context.bindBuffer(context.ARRAY_BUFFER, vertices);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), context.STATIC_DRAW);
    const position = context.getAttribLocation(program, 'aPosition');
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, image);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
    context.uniform1i(context.getUniformLocation(program, 'uImage'), 0);
    context.uniform3fv(context.getUniformLocation(program, 'uAqua'), color('--brand-aqua'));
    surface = {
      program, vertices, image,
      time: context.getUniformLocation(program, 'uTime'),
      size: context.getUniformLocation(program, 'uSize'),
      scale: context.getUniformLocation(program, 'uScale'),
      offset: context.getUniformLocation(program, 'uOffset'),
      drops: context.getUniformLocation(program, 'uDrops'),
    };
    loadedSrc = '';
    return true;
  };
  const draw = () => {
    if (!surface || !loadedSrc || context.isContextLost() || disposed) return;
    context.uniform1f(surface.time, time);
    context.uniform4fv(surface.drops, drops);
    context.drawArrays(context.TRIANGLES, 0, 6);
  };
  const drop = (x: number, y: number, strength: number) => {
    drops.set([x, y, time, strength], next * 4);
    next = (next + 1) % DROPS;
  };
  const resize = () => {
    if (!surface || context.isContextLost() || disposed || !photo.naturalWidth) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (photo.currentSrc !== loadedSrc) {
      context.bindTexture(context.TEXTURE_2D, surface.image);
      context.texImage2D(context.TEXTURE_2D, 0, context.RGB, context.RGB, context.UNSIGNED_BYTE, photo);
      loadedSrc = photo.currentSrc;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    // Mirror the photo's object-fit: cover and object-position exactly.
    const cover = Math.max(rect.width / photo.naturalWidth, rect.height / photo.naturalHeight);
    const width = photo.naturalWidth * cover;
    const height = photo.naturalHeight * cover;
    const [px, py] = getComputedStyle(photo).objectPosition.split(' ').map(value => parseFloat(value) / 100);
    context.viewport(0, 0, canvas.width, canvas.height);
    context.uniform2f(surface.size, rect.width, rect.height);
    context.uniform2f(surface.scale, rect.width / width, rect.height / height);
    context.uniform2f(surface.offset, -(rect.width - width) * (px ?? .5) / width, -(rect.height - height) * (py ?? .5) / height);
    draw();
    canvas.classList.add('is-ready');
  };
  const tick = (now: number) => {
    time += lastFrame ? Math.min((now - lastFrame) / 1000, .1) : 0;
    lastFrame = now;
    if (time > nextAmbient) {
      // Ambient drops land on the open, photographic side, clear of the copy.
      const rect = canvas.getBoundingClientRect();
      const wide = rect.width > 767;
      drop(rect.width * (wide ? .5 + Math.random() * .45 : .1 + Math.random() * .8), rect.height * (wide ? .3 + Math.random() * .6 : .12 + Math.random() * .3), .7 + Math.random() * .3);
      nextAmbient = time + 1.8 + Math.random() * 1.6;
    }
    draw();
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    if (!surface || context.isContextLost() || disposed) { canvas.dataset.waterState = 'fallback'; return; }
    const animate = visible && !document.hidden && !suspended && !motion.matches;
    canvas.dataset.waterState = animate ? 'running' : 'paused';
    if (motion.matches) canvas.classList.remove('is-ready');
    else if (loadedSrc) canvas.classList.add('is-ready');
    if (animate) frame = requestAnimationFrame(tick);
  };
  const onPointer = (event: PointerEvent) => {
    if (!frame) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();
    if (event.type === 'pointerdown') { drop(x, y, 1.2); lastPointer = [x, y, now]; return; }
    if (lastPointer && Math.hypot(x - lastPointer[0], y - lastPointer[1]) < 64 && now - lastPointer[2] < 260) return;
    const speed = lastPointer ? Math.hypot(x - lastPointer[0], y - lastPointer[1]) / Math.max(now - lastPointer[2], 16) : 0;
    drop(x, y, Math.min(.8, .35 + speed * .25));
    lastPointer = [x, y, now];
  };

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.classList.remove('is-ready');
    surface = undefined;
    canvas.dataset.waterState = 'fallback';
  });
  canvas.addEventListener('webglcontextrestored', () => { if (!disposed && setup()) { resize(); update(); } });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  const resizer = new ResizeObserver(resize);
  const start = () => {
    if (disposed || !setup()) return;
    resize();
    if (!loadedSrc) return;
    const rect = canvas.getBoundingClientRect();
    drop(rect.width * (rect.width > 767 ? .7 : .5), rect.height * (rect.width > 767 ? .62 : .22), 1.3);
    observer.observe(hero);
    resizer.observe(canvas);
    update();
  };
  photo.addEventListener('load', resize);
  (photo.complete ? Promise.resolve() : photo.decode()).then(start).catch(() => canvas.classList.remove('is-ready'));
  hero.addEventListener('pointermove', onPointer, { passive: true });
  hero.addEventListener('pointerdown', onPointer, { passive: true });
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', event => {
    suspended = true;
    update();
    if (event.persisted) return;
    disposed = true;
    observer.disconnect();
    resizer.disconnect();
    if (surface) {
      context.deleteTexture(surface.image);
      context.deleteBuffer(surface.vertices);
      context.deleteProgram(surface.program);
    }
    motion.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
  });
  window.addEventListener('pageshow', () => { suspended = false; update(); });
}
