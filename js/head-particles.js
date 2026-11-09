// Голова из частиц (WebGL, без зависимостей).
//
// Лицо — точки одобренного портрета (яркость пикселей → частицы). Чтобы голова
// поворачивалась как объём, у неё есть художественная 3D-форма: профиль по
// силуэту портрета, рельеф лица (нос, глазницы, губы, подбородок) и тыльная
// сторона из точек (бока, затылок, макушка). Каждая точка знает свою нормаль:
// при повороте дальняя сторона гаснет, ближняя выходит вперёд — силуэт меняется.
// Это не 3D-реконструкция: геометрии у картинки нет, форма придумана по контуру.
//
// Вся анимация считается в вершинном шейдере: на каждом кадре JS меняет
// только несколько uniform-значений и не создаёт новых объектов.

const ASSEMBLE_SECONDS = 2.2;
// Бюджет частиц на desktop: столько самых светлых пикселей портрета становятся точками.
const PORTRAIT_POINTS = 15000;
const MOBILE_POINTS = 12000;
// Доля бюджета на самые светлые точки; остальное — тусклая текстура кожи.
const BRIGHT_SHARE = 0.78;
// Доля бюджета на тыльную сторону головы (бока, затылок) — видна только при повороте.
const BACK_SHARE = 0.18;
// Голова поворачивается к курсору, как портрет, который «смотрит на тебя».
const MAX_YAW = 0.5; // ≈29°
const MAX_PITCH = 0.26; // ≈15°
// Кивок — вокруг шеи (ниже центра головы), поворот вбок — вокруг вертикальной оси головы.
const PITCH_PIVOT_Y = -0.45;
// На каком расстоянии от головы (px) поворот почти достигает максимума.
const LOOK_DISTANCE = 420;
// Насколько зрачки дополнительно сдвигаются в сторону курсора (в долях полувысоты).
const GAZE_SHIFT = 0.016;

const VERTEX_SHADER = `
attribute vec3 aTarget;
attribute vec3 aScatter;
attribute vec4 aSeed;
attribute float aEye;
attribute vec4 aNormal; // xyz — нормаль поверхности, w: 0 — лицо (портрет), 1 — тыльная сторона

uniform float uTime;
uniform float uAssemble;
uniform float uLevel;
uniform float uPointSize;
uniform vec2 uRotation;
uniform vec2 uGaze;
uniform vec2 uViewScale;

varying float vAlpha;

void main() {
  float delay = aSeed.x * 0.4;
  float t = clamp((uAssemble - delay) / 0.6, 0.0, 1.0);
  t = 1.0 - pow(1.0 - t, 3.0);

  vec3 p = mix(aScatter, aTarget, t);
  float phase = aSeed.x * 6.2831853;

  // Спокойное «дыхание» точек в ожидании.
  p += vec3(
    sin(uTime * 0.55 + phase),
    cos(uTime * 0.47 + phase * 1.3),
    sin(uTime * 0.39 + phase * 0.7)
  ) * 0.0032 * t;

  // Речь: нижняя губа и челюсть опускаются, верхняя губа чуть поднимается.
  p.y -= aSeed.w * uLevel * 0.042;
  p.z += abs(aSeed.w) * uLevel * 0.012;
  // Мягкая пульсация всей головы во время речи.
  p.xy *= 1.0 + uLevel * 0.006 * sin(uTime * 8.0 + phase);

  // Взгляд: зрачки чуть смещаются в сторону курсора.
  p.xy += aEye * uGaze * ${GAZE_SHIFT.toFixed(4)};

  // Поворот головы: вбок — вокруг вертикальной оси через центр головы,
  // кивок — вокруг шеи. Нормаль поворачивается вместе с точкой.
  float cy = cos(uRotation.x);
  float sy = sin(uRotation.x);
  float cx = cos(uRotation.y);
  float sx = sin(uRotation.y);
  vec3 n = aNormal.xyz;
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  n = vec3(cy * n.x + sy * n.z, n.y, -sy * n.x + cy * n.z);
  p.y -= ${PITCH_PIVOT_Y.toFixed(3)};
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p.y += ${PITCH_PIVOT_Y.toFixed(3)};
  n = vec3(n.x, cx * n.y - sx * n.z, sx * n.y + cx * n.z);

  // Видимость по нормали: лицо гаснет, только когда отворачивается от зрителя,
  // тыльная сторона появляется, только когда поворачивается к нему.
  float visibleFront = clamp((n.z + 0.05) / 0.3, 0.0, 1.0);
  float visibleBack = clamp(n.z / 0.3, 0.0, 1.0);
  float visible = mix(visibleFront, visibleBack, aNormal.w);

  // Перспектива нормирована на исходную глубину точки лица: в покое лицо
  // совпадает с портретом 1:1, при повороте ближняя сторона чуть крупнее.
  float zRest = mix(aTarget.z, 0.0, aNormal.w);
  float perspective = (5.0 - zRest) / (5.0 - p.z);
  gl_Position = vec4(p.xy * perspective * uViewScale, 0.0, 1.0);

  float twinkle = 0.86 + 0.14 * sin(uTime * (0.9 + aSeed.y * 1.4) + phase * 3.0);
  float speech = 1.0 + uLevel * (0.15 + 0.45 * abs(aSeed.w));
  vAlpha = aSeed.z * twinkle * mix(0.3, 1.0, t) * speech * visible;
  gl_PointSize = uPointSize * (0.55 + aSeed.z * 0.6) * (0.88 + aSeed.y * 0.24);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float a = clamp(vAlpha, 0.0, 1.0) * smoothstep(0.25, 0.14, d);
  // #F2F2F2, premultiplied alpha
  gl_FragColor = vec4(vec3(0.949) * a, a);
}
`;

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(u, v, cu, cv, ru, rv) {
  const du = (u - cu) / ru;
  const dv = (v - cv) / rv;
  return Math.exp(-(du * du + dv * dv));
}

// Положение рта на портрете (доли ширины и высоты assets/head/portrait.webp).
// Если заменить портрет, поправьте эти числа: lineV — линия смыкания губ,
// centerU — центр рта, halfWidth — половина ширины рта, chinV — низ подбородка.
const MOUTH = {
  centerU: 0.502,
  lineV: 0.729,
  halfWidth: 0.14,
  chinV: 0.97
};

// Вес «рта» для анимации речи: нижняя губа и челюсть опускаются (вес > 0),
// верхняя губа слегка поднимается (вес < 0).
function mouthWeight(u, v) {
  const { centerU, lineV, halfWidth, chinV } = MOUTH;
  const lowerLip = gaussian(u, v, centerU, lineV + 0.022, halfWidth * 1.05, 0.024);
  const upperLip = gaussian(u, v, centerU, lineV - 0.022, halfWidth, 0.018);
  const jawFadeIn = Math.min(Math.max((v - (lineV + 0.01)) / 0.05, 0), 1);
  const jawFadeOut = Math.min(Math.max((chinV - v) / 0.12, 0), 1);
  const jaw = 0.5 * Math.exp(-(((u - centerU) / (halfWidth * 1.9)) ** 2)) * jawFadeIn * jawFadeOut;
  return Math.max(lowerLip, jaw) - 0.32 * upperLip;
}

// Ориентиры лица на портрете (доли ширины и высоты кадра) — для рельефа и взгляда.
// Если заменить портрет, поправьте их вместе с MOUTH.
const FACE = {
  eyes: [{ u: 0.322, v: 0.476 }, { u: 0.63, v: 0.474 }],
  irisU: 0.022,
  irisV: 0.016,
  noseTip: { u: 0.5, v: 0.595 },
  browV: 0.432,
  chinV: 0.89
};

// Профиль головы по силуэту портрета: [y, полуширина без ушей] в координатах
// головы (y от −1 до 1 — высота кадра). Снят с assets/head/portrait.webp.
const HEAD_PROFILE = [
  [0.95, 0.02], [0.89, 0.21], [0.78, 0.38], [0.67, 0.48], [0.56, 0.545],
  [0.45, 0.567], [0.34, 0.58], [0.2, 0.575], [0.06, 0.565], [-0.1, 0.555],
  [-0.25, 0.545], [-0.34, 0.53], [-0.44, 0.49], [-0.55, 0.47], [-0.66, 0.4],
  [-0.77, 0.26], [-0.88, 0.17], [-0.95, 0.02]
];

function headWidth(y) {
  if (y >= HEAD_PROFILE[0][0]) return HEAD_PROFILE[0][1];
  for (let i = 1; i < HEAD_PROFILE.length; i += 1) {
    const [y1, w1] = HEAD_PROFILE[i];
    if (y >= y1) {
      const [y0, w0] = HEAD_PROFILE[i - 1];
      return w1 + ((y - y1) / (y0 - y1)) * (w0 - w1);
    }
  }
  return HEAD_PROFILE[HEAD_PROFILE.length - 1][1];
}

// Глубина лицевой половины: лицо почти вертикально от лба до подбородка,
// к макушке и под подбородком поверхность уходит назад.
function frontDepth(y) {
  const base = 0.68;
  if (y > 0.5) return base * Math.sqrt(Math.max(0.02, 1 - ((y - 0.5) / 0.47) ** 2));
  if (y < -0.8) return base * Math.sqrt(Math.max(0.02, 1 - ((y + 0.8) / 0.17) ** 2));
  return base;
}

// Глубина затылочной половины: затылок круглее и выступает назад сильнее лица.
function backDepth(y) {
  return 0.8 * Math.sqrt(Math.max(0.02, 1 - ((y - 0.15) / 0.85) ** 2));
}

// Наклон нормали вверх у макушки и вниз под подбородком.
function verticalTilt(y) {
  if (y > 0.5) return ((y - 0.5) / 0.45) * 0.9;
  if (y < -0.8) return -((-0.8 - y) / 0.15) * 0.9;
  return 0;
}

function normalize3(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

// Точка лица из портрета: глубина по профилю головы + рельеф лица.
function frontPoint(x, y, u, v) {
  const w = headWidth(y);
  const d = frontDepth(y);
  const across = Math.max(0, 1 - (x / w) ** 2);

  // Уши и всё за краем силуэта лежат в средней плоскости головы и смотрят вбок.
  if (across <= 0) {
    return { z: 0, normal: normalize3(Math.sign(x), 0, 0.3) };
  }

  let z = d * across ** 0.4;
  const { eyes, noseTip, browV, chinV } = FACE;
  z += 0.14 * gaussian(u, v, noseTip.u, noseTip.v, 0.05, 0.035); // кончик носа
  z += 0.07 * gaussian(u, v, noseTip.u, (browV + noseTip.v) / 2, 0.035, 0.07); // спинка носа
  z += 0.03 * gaussian(u, v, 0.5, browV, 0.26, 0.022); // надбровье
  for (const eye of eyes) z -= 0.05 * gaussian(u, v, eye.u, eye.v, 0.075, 0.032); // глазницы
  z += 0.035 * gaussian(u, v, MOUTH.centerU, MOUTH.lineV, 0.12, 0.04); // губы
  z += 0.03 * gaussian(u, v, 0.5, chinV, 0.13, 0.05); // подбородок

  // У края силуэта нормаль смотрит вбок; небольшой наклон вперёд оставляет
  // контур видимым в покое и даёт ему быстро погаснуть, когда сторона уходит назад.
  const surface = d * Math.sqrt(across);
  const nx = x / (w * w);
  const ny = verticalTilt(y);
  return { z, normal: normalize3(nx, ny, Math.max(surface / (d * d), 0.32 * Math.hypot(nx, ny))) };
}

// Вес «зрачка»: 1 в центре радужки, быстро спадает к краю.
function eyeWeight(u, v) {
  let weight = 0;
  for (const eye of FACE.eyes) weight = Math.max(weight, gaussian(u, v, eye.u, eye.v, FACE.irisU, FACE.irisV));
  return weight > 0.05 ? weight : 0;
}

function detectBudget() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const saveData = navigator.connection?.saveData === true;

  if (saveData || cores <= 2 || memory <= 1) return null;

  // На телефоне голова меньше, поэтому точек нужно больше на единицу площади
  // и холст в полном разрешении экрана — иначе глаза и губы растворяются.
  // iPhone в Safari сообщает 4 ядра, поэтому по ядрам бюджет не режем:
  // на слабом устройстве его уменьшит adaptQuality по реальной частоте кадров.
  const small = coarse || narrow;
  let count = small ? MOBILE_POINTS : PORTRAIT_POINTS;
  if (memory <= 2) count = Math.round(count * 0.75);

  return {
    count,
    maxDpr: small ? 3 : 2
  };
}

function shuffle(list, random) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const value = list[i];
    list[i] = list[j];
    list[j] = value;
  }
  return list;
}

function sampleParticles(image, count, scale = 1) {
  // Портрет читаем в масштабе показа: на телефоне соседние точки сливаются
  // в более светлые участки, и контуры глаз и губ не теряются при малом бюджете.
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : Object.assign(document.createElement('canvas'), { width, height });
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  const jitter = scale < 0.95 ? 0.8 : 0.4;

  // Портрет — это попиксельный «дизеринг»: светлые пиксели и есть точки лица.
  // Тёмный фон отбрасываем порогом, остальные пиксели становятся кандидатами.
  const pixels = [];
  const values = [];
  for (let index = 0, pixel = 0; index < data.length; index += 4, pixel += 1) {
    const luminance = (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255;
    if (luminance > 0.06) {
      pixels.push(pixel);
      values.push(luminance);
    }
  }

  if (pixels.length < 1000) throw new Error('Portrait has too few light pixels');

  // Основная часть бюджета — самые светлые пиксели: контуры глаз, бровей,
  // носа, губ, ушей и силуэт. Остаток — тусклые точки кожи, выбранные
  // пропорционально яркости: они дают лёгкую «сетку» на лице, как на портрете,
  // и при этом между точками остаётся видимый чёрный фон.
  const frontBudget = Math.round(count * (1 - BACK_SHARE));
  const backCount = count - frontBudget;
  const brightCount = Math.round(frontBudget * BRIGHT_SHARE);
  const sorted = Float32Array.from(values).sort();
  const threshold = sorted[Math.max(0, sorted.length - brightCount)];

  const random = mulberry32(20261105);
  const picks = [];
  const dim = [];
  let dimSum = 0;
  for (let i = 0; i < pixels.length; i += 1) {
    if (values[i] >= threshold) {
      picks.push(i);
    } else {
      dim.push(i);
      dimSum += values[i];
    }
  }

  const dimCount = Math.max(0, frontBudget - picks.length);
  if (dimCount > 0 && dimSum > 0) {
    const rate = dimCount / dimSum;
    for (let i = 0; i < dim.length; i += 1) {
      if (random() < values[dim[i]] * rate) picks.push(dim[i]);
    }
  }

  shuffle(picks, random);

  const frontCount = Math.min(picks.length, frontBudget);
  const total = frontCount + backCount;
  const target = new Float32Array(total * 3);
  const scatter = new Float32Array(total * 3);
  const seed = new Float32Array(total * 4);
  const eye = new Float32Array(total);
  const normal = new Float32Array(total * 4);
  const halfHeight = height / 2;
  const aspect = width / height;

  // Лицо и тыльная сторона перемешаны в общем порядке: первые N частиц —
  // равномерная выборка (так работает снижение качества на слабых устройствах).
  const order = shuffle(Array.from({ length: total }, (_, i) => i), random);

  for (let index = 0; index < frontCount; index += 1) {
    const placed = order[index];
    const pixel = pixels[picks[index]];
    const luminance = values[picks[index]];
    const px = (pixel % width) + 0.5 + (random() - 0.5) * jitter;
    const py = Math.floor(pixel / width) + 0.5 + (random() - 0.5) * jitter;
    const u = px / width;
    const v = py / height;

    const x = (px - width / 2) / halfHeight;
    const y = -(py - halfHeight) / halfHeight;

    const front = frontPoint(x, y, u, v);
    const z = front.z + (random() - 0.5) * 0.015;
    const i4n = placed * 4;
    normal[i4n] = front.normal[0];
    normal[i4n + 1] = front.normal[1];
    normal[i4n + 2] = front.normal[2];
    normal[i4n + 3] = 0;

    const i3 = placed * 3;
    target[i3] = x;
    target[i3 + 1] = y;
    target[i3 + 2] = z;

    // Стартовое облако: точки разлетаются от своего места наружу.
    const angle = random() * Math.PI * 2;
    const spread = 0.35 + random() * 0.75;
    const push = 1.35 + random() * 0.6;
    scatter[i3] = x * push + Math.cos(angle) * spread;
    scatter[i3 + 1] = y * push + Math.sin(angle) * spread;
    scatter[i3 + 2] = (random() - 0.5) * 1.2;

    const i4 = placed * 4;
    seed[i4] = random();
    seed[i4 + 1] = random();
    seed[i4 + 2] = luminance >= threshold
      ? 0.5 + 0.5 * Math.min(1, Math.max(0, (luminance - threshold) / (0.85 - threshold))) ** 0.6
      : 0.28 + 0.22 * (luminance / threshold);
    seed[i4 + 3] = mouthWeight(u, v);
    eye[placed] = eyeWeight(u, v);
  }

  // Тыльная сторона: бока, затылок и макушка — полуэллипсы по профилю головы.
  // В покое они скрыты (смотрят от зрителя) и появляются при повороте.
  let backPlaced = 0;
  let guard = 0;
  while (backPlaced < backCount && guard < backCount * 20) {
    guard += 1;
    const y = -0.42 + random() * (0.95 + 0.42);
    const w = headWidth(y);
    const d = backDepth(y);
    // Больше точек там, где сечение головы шире.
    if (random() > (w + d) / 1.4) continue;

    const theta = Math.PI + random() * Math.PI; // задняя половина: z ≤ 0
    const x = w * Math.cos(theta);
    const z = d * Math.sin(theta);
    const n = normalize3(Math.cos(theta) / w, verticalTilt(y), Math.sin(theta) / d);

    const placed = order[frontCount + backPlaced];
    const i3 = placed * 3;
    target[i3] = x;
    target[i3 + 1] = y;
    target[i3 + 2] = z;

    const angle = random() * Math.PI * 2;
    const spread = 0.35 + random() * 0.75;
    const push = 1.35 + random() * 0.6;
    scatter[i3] = x * push + Math.cos(angle) * spread;
    scatter[i3 + 1] = y * push + Math.sin(angle) * spread;
    scatter[i3 + 2] = (random() - 0.5) * 1.2;

    const i4 = placed * 4;
    seed[i4] = random();
    seed[i4 + 1] = random();
    seed[i4 + 2] = 0.38 + random() * 0.32;
    seed[i4 + 3] = 0;
    eye[placed] = 0;
    normal[i4] = n[0];
    normal[i4 + 1] = n[1];
    normal[i4 + 2] = n[2];
    normal[i4 + 3] = 1;
    backPlaced += 1;
  }

  return { target, scatter, seed, eye, normal, count: frontCount + backPlaced, aspect };
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

export function createParticleHead({ figure, poster, getLevel = () => 0 }) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !figure || !poster) return null;

  const budget = detectBudget();
  if (!budget) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'head__canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power'
  });

  if (!gl) return null;

  const finePointer = window.matchMedia('(pointer: fine)').matches;

  let particles = null;
  let program = null;
  let buffers = [];
  let uniforms = null;
  let drawCount = 0;
  let minDrawCount = 0;

  let rafId = 0;
  let lastFrame = 0;
  let time = 0;
  let inView = true;
  let destroyed = false;
  let contextLost = false;
  let isLive = false;

  let canvasWidth = 1;
  let canvasHeight = 1;
  let viewScaleX = 1;
  let viewScaleY = 1;
  let pointSize = 2;

  let pointerX = 0;
  let pointerY = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let yaw = 0;
  let pitch = 0;
  let level = 0;

  let figureRect = null;
  let frameSamples = 0;
  let frameTimeSum = 0;

  function setupGl() {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
      throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
    }

    gl.useProgram(program);

    const attributes = [
      ['aTarget', particles.target, 3],
      ['aScatter', particles.scatter, 3],
      ['aSeed', particles.seed, 4],
      ['aEye', particles.eye, 1],
      ['aNormal', particles.normal, 4]
    ];

    buffers = attributes.map(([name, data, size]) => {
      const buffer = gl.createBuffer();
      const location = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
      return buffer;
    });

    uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      assemble: gl.getUniformLocation(program, 'uAssemble'),
      level: gl.getUniformLocation(program, 'uLevel'),
      pointSize: gl.getUniformLocation(program, 'uPointSize'),
      rotation: gl.getUniformLocation(program, 'uRotation'),
      viewScale: gl.getUniformLocation(program, 'uViewScale'),
      gaze: gl.getUniformLocation(program, 'uGaze')
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }

  function releaseGl() {
    if (gl.isContextLost()) return;
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    if (program) gl.deleteProgram(program);
    buffers = [];
    program = null;
  }

  function resize() {
    const width = figure.clientWidth;
    const height = figure.clientHeight;
    if (!width || !height) return;

    // Холст шире портрета, чтобы повороты и облако не обрезались по краям.
    const bleedX = Math.round(width * 0.28);
    const bleedY = Math.round(height * 0.1);
    const cssWidth = width + bleedX * 2;
    const cssHeight = height + bleedY * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, budget.maxDpr);

    canvas.style.left = `${-bleedX}px`;
    canvas.style.top = `${-bleedY}px`;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    canvasWidth = Math.max(1, Math.round(cssWidth * dpr));
    canvasHeight = Math.max(1, Math.round(cssHeight * dpr));
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const pxPerUnit = height / 2;
    viewScaleX = pxPerUnit / (cssWidth / 2);
    viewScaleY = pxPerUnit / (cssHeight / 2);
    // Частица ≈ пиксель портрета в текущем масштабе, но не тоньше 1,25 CSS-пикселя.
    pointSize = Math.max(1.6, Math.max(1.25, (height / 542) * 1.55) * dpr);

    figureRect = null;
    if (!contextLost) gl.viewport(0, 0, canvasWidth, canvasHeight);
  }

  // Голова «смотрит» на курсор: направление считаем от уровня глаз к курсору,
  // tanh даёт мягкое насыщение — из любого угла экрана лицо повёрнуто к курсору,
  // но не дальше MAX_YAW / MAX_PITCH.
  function updatePointerTarget() {
    if (!figureRect) figureRect = figure.getBoundingClientRect();
    const eyeX = figureRect.left + figureRect.width / 2;
    const eyeY = figureRect.top + figureRect.height * FACE.eyes[0].v;
    targetYaw = Math.tanh((pointerX - eyeX) / LOOK_DISTANCE) * MAX_YAW;
    targetPitch = Math.tanh((pointerY - eyeY) / LOOK_DISTANCE) * MAX_PITCH;
  }

  function onPointerMove(event) {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    updatePointerTarget();
  }

  function resetPointer() {
    targetYaw = 0;
    targetPitch = 0;
  }

  function onMouseOut(event) {
    if (!event.relatedTarget) resetPointer();
  }

  function onScroll() {
    figureRect = null;
  }

  function draw(dt) {
    time += dt;
    const assemble = Math.min(time / ASSEMBLE_SECONDS, 1);

    // Плавное следование за курсором и возврат в исходное положение.
    const follow = 1 - Math.exp(-dt * 3.2);
    const idleYaw = finePointer ? 0 : Math.sin(time * 0.33) * 0.02;
    yaw += (targetYaw + idleYaw - yaw) * follow;
    pitch += (targetPitch - pitch) * follow;

    const nextLevel = Math.max(0, Math.min(1, getLevel(dt) || 0));
    level += (nextLevel - level) * (1 - Math.exp(-dt * 14));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.time, time);
    gl.uniform1f(uniforms.assemble, assemble);
    gl.uniform1f(uniforms.level, level);
    gl.uniform1f(uniforms.pointSize, pointSize);
    gl.uniform2f(uniforms.rotation, yaw, pitch);
    // Взгляд следует за поворотом: x — вправо, y — вверх (в координатах головы).
    gl.uniform2f(uniforms.gaze, yaw / MAX_YAW, -pitch / MAX_PITCH);
    gl.uniform2f(uniforms.viewScale, viewScaleX, viewScaleY);
    gl.drawArrays(gl.POINTS, 0, drawCount);
  }

  function adaptQuality(dt) {
    if (time < ASSEMBLE_SECONDS + 0.5 || drawCount <= minDrawCount) return;
    frameSamples += 1;
    frameTimeSum += dt;
    if (frameSamples < 90) return;

    const average = frameTimeSum / frameSamples;
    frameSamples = 0;
    frameTimeSum = 0;

    // Частицы перемешаны случайно, поэтому первые N — равномерная выборка.
    if (average > 1 / 40) {
      drawCount = Math.max(minDrawCount, Math.round(drawCount * 0.75));
    }
  }

  function frame(now) {
    rafId = 0;
    if (!shouldRun()) return;

    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 1 / 60;
    lastFrame = now;

    draw(dt);
    adaptQuality(dt);

    if (!isLive) {
      isLive = true;
      figure.classList.add('is-live');
    }

    rafId = window.requestAnimationFrame(frame);
  }

  function shouldRun() {
    return !destroyed && !contextLost && inView && !document.hidden && particles !== null;
  }

  function start() {
    if (rafId || !shouldRun()) return;
    lastFrame = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else start();
  }

  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    stop();
    isLive = false;
    figure.classList.remove('is-live');
  }

  function onContextRestored() {
    contextLost = false;
    try {
      setupGl();
      resize();
      // После восстановления не собираем лицо заново — сразу спокойное состояние.
      time = Math.max(time, ASSEMBLE_SECONDS);
      start();
    } catch {
      destroy();
    }
  }

  function onReducedMotionChange(event) {
    if (event.matches) destroy();
  }

  const resizeObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => resize())
    : null;

  const intersectionObserver = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      if (inView) start();
      else stop();
    }, { threshold: 0 })
    : null;

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stop();
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('mouseout', onMouseOut);
    window.removeEventListener('blur', resetPointer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);
    reducedMotion.removeEventListener?.('change', onReducedMotionChange);
    releaseGl();
    figure.classList.remove('is-live');
    canvas.remove();
    particles = null;
  }

  async function init() {
    try {
      if (!poster.complete || !poster.naturalWidth) {
        await new Promise((resolve, reject) => {
          poster.addEventListener('load', resolve, { once: true });
          poster.addEventListener('error', reject, { once: true });
        });
      }
      if (destroyed) return;

      // Читаем портрет в масштабе показа (1× и 2× файлы дают одинаковый результат).
      const displayScale = Math.min(1, Math.max(0.25, figure.clientHeight / poster.naturalHeight));
      particles = sampleParticles(poster, budget.count, displayScale);
      drawCount = particles.count;
      minDrawCount = Math.round(particles.count * 0.4);

      setupGl();
      figure.append(canvas);
      resize();

      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      reducedMotion.addEventListener?.('change', onReducedMotionChange);

      if (finePointer) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('mouseout', onMouseOut);
        window.addEventListener('blur', resetPointer);
      }

      resizeObserver?.observe(figure);
      intersectionObserver?.observe(figure);
      start();
    } catch {
      // Любая ошибка — остаётся статичный портрет, сайт работает как обычно.
      destroy();
    }
  }

  init();

  return {
    destroy,
    get particleCount() {
      return drawCount;
    }
  };
}
