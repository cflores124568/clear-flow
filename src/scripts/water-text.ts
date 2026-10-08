// One small text-only WebGL surface. The real HTML heading remains the fallback.
const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * .5 + .5;
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uMask;
uniform vec2 uSize;
uniform float uTime;
uniform vec3 uAqua;
uniform vec3 uBlue;
uniform vec3 uPaper;

vec2 seed(vec2 cell) {
  return fract(sin(vec2(dot(cell, vec2(127.1, 311.7)), dot(cell, vec2(269.5, 183.3)))) * 43758.5453);
}

// Refracted, drifting cell boundaries produce the bright paths of shallow water.
float caustics(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float near = 8.;
  float next = 8.;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 random = seed(cell + offset);
      vec2 point = .5 + .34 * sin(random * 6.283 + uTime * vec2(.17, -.13));
      float distance = length(offset + point - local);
      if (distance < near) { next = near; near = distance; }
      else { next = min(next, distance); }
    }
  }
  return 1. - smoothstep(.015, .12, next - near);
}

void main() {
  float alpha = texture2D(uMask, vec2(vUv.x, 1. - vUv.y)).a;
  if (alpha < .005) { gl_FragColor = vec4(0.); return; }
  vec2 p = vUv * vec2(uSize.x / uSize.y, 1.) * 3.2;
  p += .26 * vec2(sin(p.y * 2.2 + p.x * .6 + uTime * .14), cos(p.x * 1.3 - p.y * .8 - uTime * .12));
  float swell = sin(p.x * 1.2 + p.y * 2. + uTime * .18) * .5 + .5;
  float light = caustics(p + vec2(uTime * .035, uTime * -.025));
  vec3 base = mix(uAqua, uPaper, .34 + swell * .16);
  base = mix(base, uBlue, (1. - swell) * .09);
  vec3 color = mix(base, uPaper, light * .78);
  // Premultiplied alpha keeps the lettering edges clean over the photograph.
  gl_FragColor = vec4(color * alpha, alpha);
}`;

type Surface = {
  program: WebGLProgram;
  vertices: WebGLBuffer;
  mask: WebGLTexture;
  time: WebGLUniformLocation | null;
  size: WebGLUniformLocation | null;
};

export function initWaterText(host: HTMLElement) {
  const copy = host.querySelector<HTMLElement>('[data-water-copy]');
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  if (!copy || !canvas || host.dataset.waterState || !('ResizeObserver' in window) || !('IntersectionObserver' in window)) return;
  host.dataset.waterState = 'fallback';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contrast = window.matchMedia('(forced-colors: active)');
  let gl: WebGLRenderingContext | null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  } catch { return; }
  if (!gl) return;
  const context = gl;
  const maskCanvas = document.createElement('canvas');
  const maskContext = maskCanvas.getContext('2d');
  if (!maskContext) return;
  let surface: Surface | undefined;
  let visible = false;
  let suspended = false;
  let disposed = false;
  let frame = 0;
  let lastFrame = 0;
  let time = 7.5;
  const maxTexture = context.getParameter(context.MAX_TEXTURE_SIZE) as number;

  const color = (name: string): number[] => {
    const hex = getComputedStyle(host).getPropertyValue(name).trim().replace('#', '');
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
    const mask = context.createTexture();
    if (!vertices || !mask) {
      context.deleteProgram(program);
      if (vertices) context.deleteBuffer(vertices);
      if (mask) context.deleteTexture(mask);
      return false;
    }
    context.useProgram(program);
    context.bindBuffer(context.ARRAY_BUFFER, vertices);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), context.STATIC_DRAW);
    const position = context.getAttribLocation(program, 'aPosition');
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
    context.activeTexture(context.TEXTURE0);
    context.bindTexture(context.TEXTURE_2D, mask);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
    context.uniform1i(context.getUniformLocation(program, 'uMask'), 0);
    for (const [uniform, token] of [['uAqua', '--brand-aqua'], ['uBlue', '--brand-blue'], ['uPaper', '--panel']]) {
      context.uniform3fv(context.getUniformLocation(program, uniform), color(token));
    }
    surface = { program, vertices, mask, time: context.getUniformLocation(program, 'uTime'), size: context.getUniformLocation(program, 'uSize') };
    return true;
  };
  const draw = () => {
    if (!surface || context.isContextLost() || disposed) return;
    context.uniform1f(surface.time, time);
    context.drawArrays(context.TRIANGLES, 0, 6);
  };
  const resize = () => {
    if (!surface || context.isContextLost() || disposed) return;
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    // A small back buffer and 30 fps are sufficient for this narrow text surface.
    const dpr = Math.min(1.5, maxTexture / rect.width, maxTexture / rect.height);
    canvas.width = maskCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = maskCanvas.height = Math.max(1, Math.round(rect.height * dpr));
    const style = getComputedStyle(copy);
    maskContext.setTransform(canvas.width / rect.width, 0, 0, canvas.height / rect.height, 0, 0);
    maskContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    maskContext.fillStyle = '#fff';
    const text = copy.textContent ?? '';
    const metrics = maskContext.measureText(text);
    const fontSize = parseFloat(style.fontSize);
    const ascent = metrics.fontBoundingBoxAscent || fontSize * .95;
    const descent = metrics.fontBoundingBoxDescent || fontSize * .25;
    const baseline = (rect.height - ascent - descent) / 2 + ascent;
    if (typeof maskContext.letterSpacing === 'string' && typeof maskContext.wordSpacing === 'string') {
      maskContext.letterSpacing = style.letterSpacing;
      maskContext.wordSpacing = style.wordSpacing;
      maskContext.fillText(text, 0, baseline);
    } else {
      const letter = parseFloat(style.letterSpacing) || 0;
      const word = parseFloat(style.wordSpacing) || 0;
      Array.from(text).forEach((character, index) => {
        const prefix = text.slice(0, index);
        const x = maskContext.measureText(prefix).width + letter * index + word * (prefix.match(/ /g)?.length ?? 0);
        maskContext.fillText(character, x, baseline);
      });
    }
    context.viewport(0, 0, canvas.width, canvas.height);
    context.bindTexture(context.TEXTURE_2D, surface.mask);
    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, maskCanvas);
    context.uniform2f(surface.size, canvas.width, canvas.height);
    draw();
    host.classList.add('is-ready');
  };
  const tick = (now: number) => {
    if (now - lastFrame >= 1000 / 30 - 1) {
      time += lastFrame ? Math.min((now - lastFrame) / 1000, .1) : 0;
      lastFrame = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
    if (!surface || context.isContextLost() || disposed) { host.dataset.waterState = 'fallback'; return; }
    const animate = visible && !document.hidden && !suspended && !motion.matches && !contrast.matches;
    host.dataset.waterState = animate ? 'running' : motion.matches ? 'static' : 'paused';
    if (animate) frame = requestAnimationFrame(tick);
    else draw();
  };
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    host.classList.remove('is-ready');
    surface = undefined;
    host.dataset.waterState = 'fallback';
  });
  canvas.addEventListener('webglcontextrestored', () => { if (!disposed && setup()) { resize(); update(); } });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  const resizer = new ResizeObserver(resize);
  document.fonts.ready.then(() => {
    if (disposed || !setup()) return;
    resize();
    observer.observe(host);
    resizer.observe(host);
    update();
  }).catch(() => { host.classList.remove('is-ready'); });
  motion.addEventListener('change', update);
  contrast.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', event => {
    suspended = true;
    update();
    if (event.persisted) return;
    disposed = true;
    observer.disconnect();
    resizer.disconnect();
    if (surface) {
      context.deleteTexture(surface.mask);
      context.deleteBuffer(surface.vertices);
      context.deleteProgram(surface.program);
    }
    motion.removeEventListener('change', update);
    contrast.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
  });
  window.addEventListener('pageshow', () => { suspended = false; update(); });
}
