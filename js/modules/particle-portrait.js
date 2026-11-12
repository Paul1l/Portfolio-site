/**
 * Портрет из частиц — голова, собранная из светлых точек (WebGL, без зависимостей).
 *
 * Откуда берутся частицы. Портрет assets/head/portrait.webp уже нарисован светлыми
 * точками на чёрном фоне. Модуль читает его пиксели в масштабе показа, отбрасывает
 * тёмный фон и делает частицами самые светлые пиксели (контуры глаз, бровей, носа,
 * губ, силуэт) плюс часть тусклых — с вероятностью, пропорциональной яркости
 * (лёгкая текстура кожи).
 *
 * Объём. У картинки нет геометрии, поэтому форма головы придумана по контуру:
 * ширина — по силуэту (HEAD_PROFILE), глубина лица — эллипс с рельефом (нос,
 * глазницы, губы, подбородок), тыльная сторона (бока, затылок, макушка) достроена
 * отдельными точками. Каждая частица знает нормаль поверхности.
 *
 * Поворот. Голова поворачивается к курсору мыши или пера: yaw (вбок) — вокруг
 * вертикальной оси через центр головы, pitch (кивок) — вокруг шеи. Сторона,
 * ушедшая от зрителя, гаснет по нормали, тыльная проявляется — силуэт меняется,
 * как у объёмной головы. На тач-экранах голова лишь слегка покачивается.
 *
 * Вся анимация (сборка из облака, «дыхание», рот, взгляд, поворот) считается
 * в вершинном шейдере: на каждом кадре JS меняет несколько uniform-значений
 * и не создаёт новых объектов.
 *
 * При prefers-reduced-motion, без WebGL или на слабом устройстве модуль ничего
 * не делает — остаётся статичный портрет.
 */

// --- Бюджет частиц ---------------------------------------------------------

/** Частиц на desktop: столько пикселей портрета становятся точками. */
const DESKTOP_PARTICLE_COUNT = 15000;
/** Частиц на телефоне и планшете. */
const MOBILE_PARTICLE_COUNT = 12000;
/** Доля бюджета лица на самые светлые точки; остальное — тусклая текстура кожи. */
const BRIGHT_PARTICLE_SHARE = 0.78;
/** Доля бюджета на тыльную сторону головы (бока, затылок) — видна только при повороте. */
const BACK_PARTICLE_SHARE = 0.18;
/** Экран уже этого (CSS px) считается мобильным. */
const NARROW_SCREEN_WIDTH = 768;
/** Значения по умолчанию, если браузер не сообщает ядра и память. */
const DEFAULT_CPU_CORES = 4;
const DEFAULT_DEVICE_MEMORY_GB = 4;
/** Столько ядер и меньше — анимацию не запускаем. */
const WEAK_DEVICE_MAX_CORES = 2;
/** Столько ГБ памяти и меньше — анимацию не запускаем. */
const WEAK_DEVICE_MAX_MEMORY_GB = 1;
/** При памяти до этого объёма (ГБ) бюджет частиц уменьшается. */
const LOW_MEMORY_GB = 2;
const LOW_MEMORY_PARTICLE_FACTOR = 0.75;
/** Предел devicePixelRatio холста: на телефоне — полное разрешение экрана. */
const MOBILE_MAX_PIXEL_RATIO = 3;
const DESKTOP_MAX_PIXEL_RATIO = 2;

// --- Выборка частиц из портрета --------------------------------------------

/** Пиксели темнее этой яркости (0..1) — фон, а не лицо. */
const BACKGROUND_LUMINANCE = 0.06;
/** Если светлых пикселей меньше — портрет не загрузился или не тот. */
const MIN_LIGHT_PIXELS = 1000;
/** Зерно генератора случайных чисел: раскладка частиц одинакова при каждом показе. */
const SAMPLING_SEED = 20261105;
/** Наименьший масштаб, в котором читается портрет. */
const MIN_SAMPLING_SCALE = 0.25;
/** Случайный сдвиг точки внутри пикселя (px): при уменьшенном портрете — больше. */
const DOWNSCALED_SAMPLING_JITTER = 0.8;
const FULL_SCALE_SAMPLING_JITTER = 0.4;
/** Масштаб ниже этого считается уменьшенным. */
const DOWNSCALED_SAMPLING_SCALE = 0.95;
/** Случайный разброс глубины точек лица, чтобы оно не выглядело плоской маской. */
const FACE_DEPTH_JITTER = 0.015;
/** Тыльная сторона строится от этой высоты (координаты головы) до макушки. */
const BACK_SIDE_MIN_Y = -0.42;
const BACK_SIDE_MAX_Y = 0.95;
/** Сколько попыток на одну точку тыльной стороны, прежде чем сдаться. */
const BACK_SIDE_ATTEMPTS_PER_PARTICLE = 20;
/** Наибольшая сумма полуширины и глубины сечения: нормирует плотность точек затылка. */
const BACK_SIDE_MAX_SECTION_SIZE = 1.4;

// --- Сборка из облака ------------------------------------------------------

/** За сколько секунд лицо собирается из облака. */
const ASSEMBLY_DURATION_SECONDS = 2.2;
/** Облако: точки отлетают от своего места в PUSH раз и ещё на SPREAD в случайную сторону. */
const SCATTER_PUSH_MIN = 1.35;
const SCATTER_PUSH_RANGE = 0.6;
const SCATTER_SPREAD_MIN = 0.35;
const SCATTER_SPREAD_RANGE = 0.75;
/** Разброс облака по глубине. */
const SCATTER_DEPTH_RANGE = 1.2;

// --- Поворот к курсору и взгляд --------------------------------------------

/** Наибольший поворот вбок, рад (≈29°). */
const MAX_YAW = 0.5;
/** Наибольший кивок, рад (≈15°). */
const MAX_PITCH = 0.26;
/** Высота оси кивка (шея) в координатах головы — ниже центра. */
const PITCH_PIVOT_Y = -0.45;
/** На каком расстоянии от головы (px) поворот почти достигает максимума. */
const LOOK_DISTANCE = 420;
/** Насколько зрачки дополнительно сдвигаются к курсору (в долях полувысоты). */
const GAZE_SHIFT = 0.016;
/** Скорость, с которой голова догоняет нужный поворот (1/с). */
const HEAD_FOLLOW_RATE = 3.2;
/** Покачивание головы на тач-экранах: частота (рад/с) и амплитуда (рад). */
const TOUCH_SWAY_FREQUENCY = 0.33;
const TOUCH_SWAY_AMPLITUDE = 0.02;
/** Скорость, с которой рот догоняет уровень речи (1/с). */
const SPEECH_FOLLOW_RATE = 14;

// --- Холст и кадры ---------------------------------------------------------

/** Холст шире портрета (доли ширины и высоты с каждой стороны), чтобы поворот и облако не обрезались. */
const CANVAS_BLEED_X = 0.28;
const CANVAS_BLEED_Y = 0.1;
/** Высота портрета (CSS px), для которой подобран базовый размер частицы. */
const REFERENCE_PORTRAIT_HEIGHT = 542;
/** Размер частицы (CSS px) при эталонной высоте портрета. */
const REFERENCE_POINT_SIZE = 1.55;
/** Частица не тоньше 1,25 CSS-пикселя и 1,6 физического. */
const MIN_POINT_SIZE_CSS = 1.25;
const MIN_POINT_SIZE_DEVICE = 1.6;
/** Начальный размер частицы до первого расчёта холста. */
const INITIAL_POINT_SIZE = 2;
/** Длина первого кадра и предел длины кадра (с): после паузы анимация не прыгает. */
const FIRST_FRAME_SECONDS = 1 / 60;
const MAX_FRAME_SECONDS = 0.05;

// --- Адаптация качества ----------------------------------------------------

/** Сколько секунд после сборки ждать, прежде чем мерить частоту кадров. */
const QUALITY_CHECK_DELAY_SECONDS = 0.5;
/** По скольким кадрам усреднять время кадра. */
const QUALITY_SAMPLE_FRAMES = 90;
/** Кадр дольше этого (меньше 40 к/с) — устройство не справляется. */
const SLOW_FRAME_SECONDS = 1 / 40;
/** Во сколько раз уменьшать число частиц за один шаг. */
const QUALITY_REDUCTION_FACTOR = 0.75;
/** Ниже этой доли частиц качество не снижаем. */
const MIN_DRAW_SHARE = 0.4;

// --- Классы и медиазапросы -------------------------------------------------

const CANVAS_CLASS = 'portrait__canvas';
const LIVE_CLASS = 'portrait--live';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_POINTER_QUERY = '(pointer: fine)';
const COARSE_POINTER_QUERY = '(pointer: coarse)';

const WEBGL_CONTEXT_OPTIONS = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  powerPreference: 'low-power'
};

// --- Ориентиры портрета ----------------------------------------------------
// Координаты u, v — доли ширины и высоты кадра assets/head/portrait.webp
// (u слева направо, v сверху вниз). Если заменить портрет, поправьте их.

/**
 * Рот: centerU — центр рта, lipLineV — линия смыкания губ,
 * halfWidth — половина ширины рта, chinBottomV — низ подбородка.
 */
const MOUTH = {
  centerU: 0.502,
  lipLineV: 0.729,
  halfWidth: 0.14,
  chinBottomV: 0.97
};

/** Ориентиры лица — для рельефа и взгляда. */
const FACE_LANDMARKS = {
  eyes: [{ u: 0.322, v: 0.476 }, { u: 0.63, v: 0.474 }],
  irisRadiusU: 0.022,
  irisRadiusV: 0.016,
  noseTip: { u: 0.5, v: 0.595 },
  browLineV: 0.432,
  chinV: 0.89
};

/**
 * Рельеф лица: гауссовы выпуклости (height > 0) и впадины (height < 0) поверх
 * эллипса головы. Порядок важен — он совпадает с порядком сложения глубины.
 */
const FACE_RELIEF = [
  // кончик носа
  { height: 0.14, centerU: FACE_LANDMARKS.noseTip.u, centerV: FACE_LANDMARKS.noseTip.v, radiusU: 0.05, radiusV: 0.035 },
  // спинка носа
  {
    height: 0.07,
    centerU: FACE_LANDMARKS.noseTip.u,
    centerV: (FACE_LANDMARKS.browLineV + FACE_LANDMARKS.noseTip.v) / 2,
    radiusU: 0.035,
    radiusV: 0.07
  },
  // надбровье
  { height: 0.03, centerU: 0.5, centerV: FACE_LANDMARKS.browLineV, radiusU: 0.26, radiusV: 0.022 },
  // глазницы
  ...FACE_LANDMARKS.eyes.map((eye) => ({ height: -0.05, centerU: eye.u, centerV: eye.v, radiusU: 0.075, radiusV: 0.032 })),
  // губы
  { height: 0.035, centerU: MOUTH.centerU, centerV: MOUTH.lipLineV, radiusU: 0.12, radiusV: 0.04 },
  // подбородок
  { height: 0.03, centerU: 0.5, centerV: FACE_LANDMARKS.chinV, radiusU: 0.13, radiusV: 0.05 }
];

/**
 * Профиль головы по силуэту портрета: [высота, полуширина без ушей] в координатах
 * головы (y от −1 внизу до 1 вверху — высота кадра), сверху вниз.
 */
const HEAD_PROFILE = [
  [0.95, 0.02], [0.89, 0.21], [0.78, 0.38], [0.67, 0.48], [0.56, 0.545],
  [0.45, 0.567], [0.34, 0.58], [0.2, 0.575], [0.06, 0.565], [-0.1, 0.555],
  [-0.25, 0.545], [-0.34, 0.53], [-0.44, 0.49], [-0.55, 0.47], [-0.66, 0.4],
  [-0.77, 0.26], [-0.88, 0.17], [-0.95, 0.02]
];

/** Глубина лицевой половины головы (координаты головы). */
const FRONT_DEPTH = 0.68;
/** Глубина затылка — он круглее и выступает назад сильнее лица. */
const BACK_DEPTH = 0.8;
/** Выше этой высоты голова скругляется к макушке, ниже CHIN_UNDERSIDE_Y — под подбородок. */
const CROWN_START_Y = 0.5;
const CHIN_UNDERSIDE_Y = -0.8;
/** Наименьшая доля глубины у макушки и под подбородком (без нуля — без вырождения). */
const MIN_DEPTH_SHARE = 0.02;
/** Наибольший наклон нормали вверх у макушки и вниз под подбородком. */
const MAX_VERTICAL_NORMAL_TILT = 0.9;
/** Насколько лицо выпуклее к центру: показатель степени в профиле поперёк лица. */
const FACE_ROUNDNESS = 0.4;
/** Наклон нормали вперёд у края силуэта: контур виден в покое и быстро гаснет при повороте. */
const EDGE_FORWARD_TILT = 0.32;
/** Наклон нормали ушей вперёд (уши смотрят вбок). */
const EAR_FORWARD_TILT = 0.3;

// --- Шейдеры ---------------------------------------------------------------

const VERTEX_SHADER = `
// Сборка: частица стартует с задержкой до ASSEMBLY_DELAY_SPREAD и летит ASSEMBLY_FLIGHT
// (обе — доли общего времени сборки).
const float ASSEMBLY_DELAY_SPREAD = 0.4;
const float ASSEMBLY_FLIGHT = 0.6;
const float TWO_PI = 6.2831853;
// Амплитуда спокойного «дыхания» точек.
const float BREATHING_AMPLITUDE = 0.0032;
// Речь: насколько опускается челюсть, выдвигаются губы и пульсирует голова.
const float JAW_DROP = 0.042;
const float LIP_PUSH = 0.012;
const float SPEECH_PULSE_AMPLITUDE = 0.006;
const float SPEECH_PULSE_FREQUENCY = 8.0;
const float GAZE_SHIFT = ${GAZE_SHIFT.toFixed(4)};
const float PITCH_PIVOT_Y = ${PITCH_PIVOT_Y.toFixed(3)};
// Видимость по нормали: лицо гаснет чуть позже, чем отвернётся (FRONT_FADE_OFFSET),
// и за NORMAL_FADE_RANGE по z-компоненте нормали.
const float FRONT_FADE_OFFSET = 0.05;
const float NORMAL_FADE_RANGE = 0.3;
// Расстояние от камеры до центра головы — сила перспективы.
const float CAMERA_DISTANCE = 5.0;

attribute vec3 aTargetPosition;  // место частицы в собранной голове
attribute vec3 aScatterPosition; // место частицы в стартовом облаке
// x — случайная фаза и задержка сборки, y — случайная частота мерцания и размер,
// z — яркость, w — вес рта (> 0 — нижняя губа и челюсть, < 0 — верхняя губа)
attribute vec4 aParticleTraits;
attribute float aPupilWeight;    // 1 в центре зрачка, 0 вне глаз
attribute vec4 aSurfaceNormal;   // xyz — нормаль поверхности, w: 0 — лицо (портрет), 1 — тыльная сторона

uniform float uElapsedSeconds;
uniform float uAssemblyProgress; // 0 — облако, 1 — сборка закончена
uniform float uSpeechLevel;      // 0..1
uniform float uPointSize;        // в физических пикселях
uniform vec2 uHeadRotation;      // x — yaw (вбок), y — pitch (кивок), радианы
uniform vec2 uGazeDirection;     // x — вправо, y — вверх, −1..1
uniform vec2 uViewScale;         // координаты головы → clip space

varying float vOpacity;

void main() {
  float assemblyDelay = aParticleTraits.x * ASSEMBLY_DELAY_SPREAD;
  float assembled = clamp((uAssemblyProgress - assemblyDelay) / ASSEMBLY_FLIGHT, 0.0, 1.0);
  assembled = 1.0 - pow(1.0 - assembled, 3.0); // плавное торможение в конце

  vec3 position = mix(aScatterPosition, aTargetPosition, assembled);
  float phase = aParticleTraits.x * TWO_PI;

  // Спокойное «дыхание» точек в ожидании (несоизмеримые частоты — без видимого повтора).
  position += vec3(
    sin(uElapsedSeconds * 0.55 + phase),
    cos(uElapsedSeconds * 0.47 + phase * 1.3),
    sin(uElapsedSeconds * 0.39 + phase * 0.7)
  ) * BREATHING_AMPLITUDE * assembled;

  // Речь: нижняя губа и челюсть опускаются, верхняя губа чуть поднимается.
  position.y -= aParticleTraits.w * uSpeechLevel * JAW_DROP;
  position.z += abs(aParticleTraits.w) * uSpeechLevel * LIP_PUSH;
  // Мягкая пульсация всей головы во время речи.
  position.xy *= 1.0 + uSpeechLevel * SPEECH_PULSE_AMPLITUDE * sin(uElapsedSeconds * SPEECH_PULSE_FREQUENCY + phase);

  // Взгляд: зрачки чуть смещаются в сторону курсора.
  position.xy += aPupilWeight * uGazeDirection * GAZE_SHIFT;

  // Поворот головы: вбок — вокруг вертикальной оси через центр головы,
  // кивок — вокруг шеи. Нормаль поворачивается вместе с точкой.
  float cosYaw = cos(uHeadRotation.x);
  float sinYaw = sin(uHeadRotation.x);
  float cosPitch = cos(uHeadRotation.y);
  float sinPitch = sin(uHeadRotation.y);
  vec3 normal = aSurfaceNormal.xyz;
  position = vec3(cosYaw * position.x + sinYaw * position.z, position.y, -sinYaw * position.x + cosYaw * position.z);
  normal = vec3(cosYaw * normal.x + sinYaw * normal.z, normal.y, -sinYaw * normal.x + cosYaw * normal.z);
  position.y -= PITCH_PIVOT_Y;
  position = vec3(position.x, cosPitch * position.y - sinPitch * position.z, sinPitch * position.y + cosPitch * position.z);
  position.y += PITCH_PIVOT_Y;
  normal = vec3(normal.x, cosPitch * normal.y - sinPitch * normal.z, sinPitch * normal.y + cosPitch * normal.z);

  // Видимость по нормали: лицо гаснет, только когда отворачивается от зрителя,
  // тыльная сторона появляется, только когда поворачивается к нему.
  float frontVisibility = clamp((normal.z + FRONT_FADE_OFFSET) / NORMAL_FADE_RANGE, 0.0, 1.0);
  float backVisibility = clamp(normal.z / NORMAL_FADE_RANGE, 0.0, 1.0);
  float visibility = mix(frontVisibility, backVisibility, aSurfaceNormal.w);

  // Перспектива нормирована на исходную глубину точки лица: в покое лицо
  // совпадает с портретом 1:1, при повороте ближняя сторона чуть крупнее.
  float restDepth = mix(aTargetPosition.z, 0.0, aSurfaceNormal.w);
  float perspective = (CAMERA_DISTANCE - restDepth) / (CAMERA_DISTANCE - position.z);
  gl_Position = vec4(position.xy * perspective * uViewScale, 0.0, 1.0);

  // Мерцание 0.72..1.0, речь делает рот ярче, размер зависит от яркости точки.
  float twinkle = 0.86 + 0.14 * sin(uElapsedSeconds * (0.9 + aParticleTraits.y * 1.4) + phase * 3.0);
  float speechBrightness = 1.0 + uSpeechLevel * (0.15 + 0.45 * abs(aParticleTraits.w));
  vOpacity = aParticleTraits.z * twinkle * mix(0.3, 1.0, assembled) * speechBrightness * visibility;
  gl_PointSize = uPointSize * (0.55 + aParticleTraits.z * 0.6) * (0.88 + aParticleTraits.y * 0.24);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

// Круглая точка: радиус 0.5 (в квадрате — 0.25), мягкий край от 0.14.
const float RADIUS_SQUARED = 0.25;
const float SOFT_EDGE_START = 0.14;
// Цвет #F2F2F2.
const float PARTICLE_GRAY = 0.949;

varying float vOpacity;

void main() {
  vec2 offsetFromCenter = gl_PointCoord - 0.5;
  float distanceSquared = dot(offsetFromCenter, offsetFromCenter);
  if (distanceSquared > RADIUS_SQUARED) discard;
  float alpha = clamp(vOpacity, 0.0, 1.0) * smoothstep(RADIUS_SQUARED, SOFT_EDGE_START, distanceSquared);
  // premultiplied alpha
  gl_FragColor = vec4(vec3(PARTICLE_GRAY) * alpha, alpha);
}
`;

/** Атрибуты шейдера: имя, поле ParticleData и число компонент. */
const PARTICLE_ATTRIBUTES = [
  { name: 'aTargetPosition', field: 'targetPositions', size: 3 },
  { name: 'aScatterPosition', field: 'scatterPositions', size: 3 },
  { name: 'aParticleTraits', field: 'traits', size: 4 },
  { name: 'aPupilWeight', field: 'pupilWeights', size: 1 },
  { name: 'aSurfaceNormal', field: 'normals', size: 4 }
];

/**
 * @typedef {object} ParticleBudget
 * @property {number} particleCount — сколько частиц выбрать из портрета
 * @property {number} maxPixelRatio — предел devicePixelRatio холста
 */

/**
 * @typedef {object} ParticleData
 * @property {Float32Array} targetPositions — xyz места в собранной голове
 * @property {Float32Array} scatterPositions — xyz места в стартовом облаке
 * @property {Float32Array} traits — фаза, мерцание, яркость, вес рта (по 4 на частицу)
 * @property {Float32Array} pupilWeights — вес зрачка (по 1 на частицу)
 * @property {Float32Array} normals — xyz нормали и признак тыльной стороны (по 4 на частицу)
 * @property {number} count — сколько частиц заполнено
 */

/**
 * @typedef {object} CanvasLayout
 * @property {number} offsetX — сдвиг холста влево от портрета, CSS px
 * @property {number} offsetY — сдвиг холста вверх от портрета, CSS px
 * @property {number} cssWidth
 * @property {number} cssHeight
 * @property {number} pixelWidth — ширина буфера холста, физические px
 * @property {number} pixelHeight — высота буфера холста, физические px
 * @property {number} viewScaleX — координаты головы → clip space по x
 * @property {number} viewScaleY — координаты головы → clip space по y
 * @property {number} pointSize — размер частицы, физические px
 */

/**
 * @typedef {object} ParticlePortrait
 * @property {() => void} destroy — остановить анимацию, убрать холст и все подписки
 * @property {number} particleCount — сколько частиц сейчас рисуется (только чтение)
 */

// --- Математические помощники ----------------------------------------------

/**
 * Генератор псевдослучайных чисел mulberry32: одно и то же зерно — одна и та же последовательность.
 * @param {number} seed — зерно
 * @returns {() => number} функция, возвращающая число в [0, 1)
 */
function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Эллиптическая гауссова «шапка» на портрете: 1 в центре, спадает к краю.
 * @param {number} u — точка, доля ширины кадра
 * @param {number} v — точка, доля высоты кадра
 * @param {number} centerU — центр по ширине
 * @param {number} centerV — центр по высоте
 * @param {number} radiusU — радиус по ширине
 * @param {number} radiusV — радиус по высоте
 * @returns {number} вес 0..1
 */
function gaussian(u, v, centerU, centerV, radiusU, radiusV) {
  const offsetU = (u - centerU) / radiusU;
  const offsetV = (v - centerV) / radiusV;
  return Math.exp(-(offsetU * offsetU + offsetV * offsetV));
}

/**
 * Приводит вектор к единичной длине.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {[number, number, number]} единичный вектор (нулевой вектор не меняется)
 */
function normalizeVector(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

/**
 * Перемешивает массив на месте (Фишер — Йетс).
 * @template T
 * @param {T[]} list — массив для перемешивания
 * @param {() => number} random — источник случайных чисел [0, 1)
 * @returns {T[]} тот же массив
 */
function shuffleInPlace(list, random) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swapped = list[i];
    list[i] = list[j];
    list[j] = swapped;
  }
  return list;
}

// --- Форма головы ----------------------------------------------------------

/**
 * Полуширина головы на заданной высоте — линейная интерполяция HEAD_PROFILE.
 * @param {number} headY — высота в координатах головы (−1..1)
 * @returns {number} полуширина без ушей
 */
function getHeadHalfWidth(headY) {
  const [topY, topHalfWidth] = HEAD_PROFILE[0];
  if (headY >= topY) return topHalfWidth;
  for (let i = 1; i < HEAD_PROFILE.length; i += 1) {
    const [lowerY, lowerHalfWidth] = HEAD_PROFILE[i];
    if (headY >= lowerY) {
      const [upperY, upperHalfWidth] = HEAD_PROFILE[i - 1];
      return lowerHalfWidth + ((headY - lowerY) / (upperY - lowerY)) * (upperHalfWidth - lowerHalfWidth);
    }
  }
  return HEAD_PROFILE[HEAD_PROFILE.length - 1][1];
}

/**
 * Глубина лицевой половины: лицо почти вертикально от лба до подбородка,
 * к макушке и под подбородком поверхность уходит назад.
 * @param {number} headY — высота в координатах головы
 * @returns {number} глубина
 */
function getFrontDepth(headY) {
  if (headY > CROWN_START_Y) {
    return FRONT_DEPTH * Math.sqrt(Math.max(MIN_DEPTH_SHARE, 1 - ((headY - CROWN_START_Y) / 0.47) ** 2));
  }
  if (headY < CHIN_UNDERSIDE_Y) {
    return FRONT_DEPTH * Math.sqrt(Math.max(MIN_DEPTH_SHARE, 1 - ((headY - CHIN_UNDERSIDE_Y) / 0.17) ** 2));
  }
  return FRONT_DEPTH;
}

/**
 * Глубина затылочной половины: эллипс с центром чуть выше середины кадра.
 * @param {number} headY — высота в координатах головы
 * @returns {number} глубина
 */
function getBackDepth(headY) {
  return BACK_DEPTH * Math.sqrt(Math.max(MIN_DEPTH_SHARE, 1 - ((headY - 0.15) / 0.85) ** 2));
}

/**
 * Наклон нормали вверх у макушки и вниз под подбородком.
 * @param {number} headY — высота в координатах головы
 * @returns {number} вертикальная составляющая нормали до нормировки
 */
function getVerticalNormalTilt(headY) {
  if (headY > CROWN_START_Y) return ((headY - CROWN_START_Y) / 0.45) * MAX_VERTICAL_NORMAL_TILT;
  if (headY < CHIN_UNDERSIDE_Y) return -((CHIN_UNDERSIDE_Y - headY) / 0.15) * MAX_VERTICAL_NORMAL_TILT;
  return 0;
}

/**
 * Глубина и нормаль точки лица: профиль головы плюс рельеф (нос, глазницы, губы).
 * @param {number} headX — координата по ширине в координатах головы
 * @param {number} headY — высота в координатах головы
 * @param {number} u — та же точка, доля ширины кадра
 * @param {number} v — та же точка, доля высоты кадра
 * @returns {{ depth: number, normal: [number, number, number] }}
 */
function computeFacePoint(headX, headY, u, v) {
  const halfWidth = getHeadHalfWidth(headY);
  const headDepth = getFrontDepth(headY);
  const acrossFactor = Math.max(0, 1 - (headX / halfWidth) ** 2);

  // Уши и всё за краем силуэта лежат в средней плоскости головы и смотрят вбок.
  if (acrossFactor <= 0) {
    return { depth: 0, normal: normalizeVector(Math.sign(headX), 0, EAR_FORWARD_TILT) };
  }

  let depth = headDepth * acrossFactor ** FACE_ROUNDNESS;
  for (const bump of FACE_RELIEF) {
    depth += bump.height * gaussian(u, v, bump.centerU, bump.centerV, bump.radiusU, bump.radiusV);
  }

  // У края силуэта нормаль смотрит вбок; небольшой наклон вперёд оставляет
  // контур видимым в покое и даёт ему быстро погаснуть, когда сторона уходит назад.
  const surfaceDepth = headDepth * Math.sqrt(acrossFactor);
  const normalX = headX / (halfWidth * halfWidth);
  const normalY = getVerticalNormalTilt(headY);
  const normalZ = Math.max(surfaceDepth / (headDepth * headDepth), EDGE_FORWARD_TILT * Math.hypot(normalX, normalY));
  return { depth, normal: normalizeVector(normalX, normalY, normalZ) };
}

/**
 * Вес «рта» для анимации речи: нижняя губа и челюсть опускаются (вес > 0),
 * верхняя губа слегка поднимается (вес < 0).
 * @param {number} u — доля ширины кадра
 * @param {number} v — доля высоты кадра
 * @returns {number} вес примерно −0.32..1
 */
function getMouthWeight(u, v) {
  const { centerU, lipLineV, halfWidth, chinBottomV } = MOUTH;
  // Губы — две гауссовы полосы над и под линией смыкания.
  const lowerLip = gaussian(u, v, centerU, lipLineV + 0.022, halfWidth * 1.05, 0.024);
  const upperLip = gaussian(u, v, centerU, lipLineV - 0.022, halfWidth, 0.018);
  // Челюсть: от линии губ плавно нарастает и гаснет к низу подбородка.
  const jawFadeIn = Math.min(Math.max((v - (lipLineV + 0.01)) / 0.05, 0), 1);
  const jawFadeOut = Math.min(Math.max((chinBottomV - v) / 0.12, 0), 1);
  const jaw = 0.5 * Math.exp(-(((u - centerU) / (halfWidth * 1.9)) ** 2)) * jawFadeIn * jawFadeOut;
  return Math.max(lowerLip, jaw) - 0.32 * upperLip;
}

/**
 * Вес «зрачка»: 1 в центре радужки, быстро спадает к краю, вне глаз — 0.
 * @param {number} u — доля ширины кадра
 * @param {number} v — доля высоты кадра
 * @returns {number} вес 0..1
 */
function getPupilWeight(u, v) {
  const { eyes, irisRadiusU, irisRadiusV } = FACE_LANDMARKS;
  let weight = 0;
  for (const eye of eyes) weight = Math.max(weight, gaussian(u, v, eye.u, eye.v, irisRadiusU, irisRadiusV));
  return weight > 0.05 ? weight : 0;
}

// --- Бюджет и выборка частиц -----------------------------------------------

/**
 * Сколько частиц может позволить себе устройство.
 * @returns {ParticleBudget | null} null — устройство слабое или включена экономия трафика
 */
function detectParticleBudget() {
  const hasCoarsePointer = window.matchMedia(COARSE_POINTER_QUERY).matches;
  const isNarrowScreen = window.innerWidth < NARROW_SCREEN_WIDTH;
  const cpuCores = navigator.hardwareConcurrency || DEFAULT_CPU_CORES;
  const memoryGb = navigator.deviceMemory || DEFAULT_DEVICE_MEMORY_GB;
  const saveData = navigator.connection?.saveData === true;

  if (saveData || cpuCores <= WEAK_DEVICE_MAX_CORES || memoryGb <= WEAK_DEVICE_MAX_MEMORY_GB) return null;

  // На телефоне голова меньше, поэтому точек нужно больше на единицу площади
  // и холст в полном разрешении экрана — иначе глаза и губы растворяются.
  // iPhone в Safari сообщает 4 ядра, поэтому по ядрам бюджет не режем:
  // на слабом устройстве его уменьшит adaptQuality по реальной частоте кадров.
  const isMobile = hasCoarsePointer || isNarrowScreen;
  let particleCount = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
  if (memoryGb <= LOW_MEMORY_GB) particleCount = Math.round(particleCount * LOW_MEMORY_PARTICLE_FACTOR);

  return {
    particleCount,
    maxPixelRatio: isMobile ? MOBILE_MAX_PIXEL_RATIO : DESKTOP_MAX_PIXEL_RATIO
  };
}

/**
 * Читает портрет в заданном масштабе и собирает светлые пиксели (не фон).
 * @param {HTMLImageElement} image — загруженный портрет
 * @param {number} scale — масштаб чтения относительно натурального размера
 * @returns {{ width: number, height: number, pixelIndices: number[], luminances: number[] }}
 *   размер прочитанного кадра, номера светлых пикселей и их яркость 0..1
 */
function readLightPixels(image, scale) {
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = typeof OffscreenCanvas === 'function'
    ? new OffscreenCanvas(width, height)
    : Object.assign(document.createElement('canvas'), { width, height });
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);
  const { data: rgba } = context.getImageData(0, 0, width, height);

  // Портрет — это попиксельный «дизеринг»: светлые пиксели и есть точки лица.
  // Тёмный фон отбрасываем порогом, остальные пиксели становятся кандидатами.
  const pixelIndices = [];
  const luminances = [];
  for (let offset = 0, pixelIndex = 0; offset < rgba.length; offset += 4, pixelIndex += 1) {
    // Относительная яркость по Rec. 709.
    const luminance = (rgba[offset] * 0.2126 + rgba[offset + 1] * 0.7152 + rgba[offset + 2] * 0.0722) / 255;
    if (luminance > BACKGROUND_LUMINANCE) {
      pixelIndices.push(pixelIndex);
      luminances.push(luminance);
    }
  }

  return { width, height, pixelIndices, luminances };
}

/**
 * Выбирает пиксели для лица. Основная часть бюджета — самые светлые пиксели:
 * контуры глаз, бровей, носа, губ, ушей и силуэт. Остаток — тусклые точки кожи,
 * выбранные пропорционально яркости: они дают лёгкую «сетку» на лице, как на
 * портрете, и между точками остаётся видимый чёрный фон.
 * @param {number[]} luminances — яркость светлых пикселей
 * @param {number} faceBudget — сколько частиц отдано лицу
 * @param {() => number} random — источник случайных чисел
 * @returns {{ selectedIndices: number[], brightThreshold: number }}
 *   перемешанные номера выбранных пикселей (в массиве luminances) и порог «светлых»
 */
function selectFacePixels(luminances, faceBudget, random) {
  const brightCount = Math.round(faceBudget * BRIGHT_PARTICLE_SHARE);
  const sortedLuminances = Float32Array.from(luminances).sort();
  const brightThreshold = sortedLuminances[Math.max(0, sortedLuminances.length - brightCount)];

  const selectedIndices = [];
  const dimIndices = [];
  let dimLuminanceSum = 0;
  for (let i = 0; i < luminances.length; i += 1) {
    if (luminances[i] >= brightThreshold) {
      selectedIndices.push(i);
    } else {
      dimIndices.push(i);
      dimLuminanceSum += luminances[i];
    }
  }

  const dimCount = Math.max(0, faceBudget - selectedIndices.length);
  if (dimCount > 0 && dimLuminanceSum > 0) {
    const selectionRate = dimCount / dimLuminanceSum;
    for (let i = 0; i < dimIndices.length; i += 1) {
      if (random() < luminances[dimIndices[i]] * selectionRate) selectedIndices.push(dimIndices[i]);
    }
  }

  shuffleInPlace(selectedIndices, random);
  return { selectedIndices, brightThreshold };
}

/**
 * Яркость частицы лица: светлые точки — 0.5..1, тусклые — 0.28..0.5.
 * @param {number} luminance — яркость пикселя 0..1
 * @param {number} brightThreshold — порог «светлых» пикселей
 * @returns {number} яркость частицы
 */
function computeFaceParticleBrightness(luminance, brightThreshold) {
  // Яркость, при которой точка считается полностью белой.
  const fullBrightLuminance = 0.85;
  if (luminance >= brightThreshold) {
    const brightness = Math.min(1, Math.max(0, (luminance - brightThreshold) / (fullBrightLuminance - brightThreshold)));
    return 0.5 + 0.5 * brightness ** 0.6;
  }
  return 0.28 + 0.22 * (luminance / brightThreshold);
}

/**
 * Записывает стартовое место частицы в облаке: точка отлетает от своего места наружу.
 * @param {Float32Array} scatterPositions — куда писать
 * @param {number} offset — индекс x-компоненты частицы
 * @param {number} headX — место в собранной голове по x
 * @param {number} headY — место в собранной голове по y
 * @param {() => number} random — источник случайных чисел
 * @returns {void}
 */
function writeScatterPosition(scatterPositions, offset, headX, headY, random) {
  const angle = random() * Math.PI * 2;
  const spread = SCATTER_SPREAD_MIN + random() * SCATTER_SPREAD_RANGE;
  const push = SCATTER_PUSH_MIN + random() * SCATTER_PUSH_RANGE;
  scatterPositions[offset] = headX * push + Math.cos(angle) * spread;
  scatterPositions[offset + 1] = headY * push + Math.sin(angle) * spread;
  scatterPositions[offset + 2] = (random() - 0.5) * SCATTER_DEPTH_RANGE;
}

/**
 * Превращает портрет в частицы: лицо из светлых пикселей и достроенную тыльную сторону.
 * Портрет читается в масштабе показа: на телефоне соседние точки сливаются в более
 * светлые участки, и контуры глаз и губ не теряются при малом бюджете.
 * @param {HTMLImageElement} image — загруженный портрет
 * @param {number} particleCount — бюджет частиц
 * @param {number} [scale=1] — масштаб чтения относительно натурального размера
 * @returns {ParticleData}
 * @throws {Error} если на портрете слишком мало светлых пикселей
 */
function sampleParticles(image, particleCount, scale = 1) {
  const { width, height, pixelIndices, luminances } = readLightPixels(image, scale);
  if (pixelIndices.length < MIN_LIGHT_PIXELS) throw new Error('Portrait has too few light pixels');

  const faceBudget = Math.round(particleCount * (1 - BACK_PARTICLE_SHARE));
  const backBudget = particleCount - faceBudget;
  const random = createSeededRandom(SAMPLING_SEED);
  const { selectedIndices, brightThreshold } = selectFacePixels(luminances, faceBudget, random);

  const faceCount = Math.min(selectedIndices.length, faceBudget);
  const totalCount = faceCount + backBudget;
  const particles = {
    targetPositions: new Float32Array(totalCount * 3),
    scatterPositions: new Float32Array(totalCount * 3),
    traits: new Float32Array(totalCount * 4),
    pupilWeights: new Float32Array(totalCount),
    normals: new Float32Array(totalCount * 4),
    count: 0
  };

  // Лицо и тыльная сторона перемешаны в общем порядке: первые N частиц —
  // равномерная выборка (так работает снижение качества на слабых устройствах).
  const slotOrder = shuffleInPlace(Array.from({ length: totalCount }, (_, i) => i), random);

  placeFaceParticles({
    particles,
    slotOrder,
    faceCount,
    selectedIndices,
    pixelIndices,
    luminances,
    brightThreshold,
    frameWidth: width,
    frameHeight: height,
    jitter: scale < DOWNSCALED_SAMPLING_SCALE ? DOWNSCALED_SAMPLING_JITTER : FULL_SCALE_SAMPLING_JITTER,
    random
  });
  const backCount = placeBackParticles({ particles, slotOrder, firstSlot: faceCount, backBudget, random });

  particles.count = faceCount + backCount;
  return particles;
}

/**
 * Раскладывает частицы лица по выбранным пикселям портрета.
 * @param {object} options
 * @param {ParticleData} options.particles — куда писать
 * @param {number[]} options.slotOrder — перемешанные номера мест в буферах
 * @param {number} options.faceCount — сколько частиц лица разложить
 * @param {number[]} options.selectedIndices — выбранные пиксели (номера в luminances)
 * @param {number[]} options.pixelIndices — номер пикселя в кадре для каждого светлого пикселя
 * @param {number[]} options.luminances — яркость светлых пикселей
 * @param {number} options.brightThreshold — порог «светлых» пикселей
 * @param {number} options.frameWidth — ширина прочитанного кадра, px
 * @param {number} options.frameHeight — высота прочитанного кадра, px
 * @param {number} options.jitter — случайный сдвиг точки внутри пикселя, px
 * @param {() => number} options.random — источник случайных чисел
 * @returns {void}
 */
function placeFaceParticles({
  particles, slotOrder, faceCount, selectedIndices, pixelIndices, luminances,
  brightThreshold, frameWidth, frameHeight, jitter, random
}) {
  const { targetPositions, scatterPositions, traits, pupilWeights, normals } = particles;
  const halfHeight = frameHeight / 2;

  for (let index = 0; index < faceCount; index += 1) {
    const slot = slotOrder[index];
    const pixelIndex = pixelIndices[selectedIndices[index]];
    const luminance = luminances[selectedIndices[index]];
    const sampleX = (pixelIndex % frameWidth) + 0.5 + (random() - 0.5) * jitter;
    const sampleY = Math.floor(pixelIndex / frameWidth) + 0.5 + (random() - 0.5) * jitter;
    const u = sampleX / frameWidth;
    const v = sampleY / frameHeight;

    // Координаты головы: центр кадра — 0, высота кадра — от −1 до 1.
    const headX = (sampleX - frameWidth / 2) / halfHeight;
    const headY = -(sampleY - halfHeight) / halfHeight;

    const facePoint = computeFacePoint(headX, headY, u, v);
    const headZ = facePoint.depth + (random() - 0.5) * FACE_DEPTH_JITTER;
    // traits и normals — по 4 числа на частицу, позиции — по 3.
    const vec4Offset = slot * 4;
    normals[vec4Offset] = facePoint.normal[0];
    normals[vec4Offset + 1] = facePoint.normal[1];
    normals[vec4Offset + 2] = facePoint.normal[2];
    normals[vec4Offset + 3] = 0;

    const positionOffset = slot * 3;
    targetPositions[positionOffset] = headX;
    targetPositions[positionOffset + 1] = headY;
    targetPositions[positionOffset + 2] = headZ;
    writeScatterPosition(scatterPositions, positionOffset, headX, headY, random);

    traits[vec4Offset] = random();
    traits[vec4Offset + 1] = random();
    traits[vec4Offset + 2] = computeFaceParticleBrightness(luminance, brightThreshold);
    traits[vec4Offset + 3] = getMouthWeight(u, v);
    pupilWeights[slot] = getPupilWeight(u, v);
  }
}

/**
 * Достраивает тыльную сторону: бока, затылок и макушку — полуэллипсы по профилю
 * головы. В покое они скрыты (смотрят от зрителя) и появляются при повороте.
 * @param {object} options
 * @param {ParticleData} options.particles — куда писать
 * @param {number[]} options.slotOrder — перемешанные номера мест в буферах
 * @param {number} options.firstSlot — с какого номера в slotOrder начинать
 * @param {number} options.backBudget — сколько частиц разложить
 * @param {() => number} options.random — источник случайных чисел
 * @returns {number} сколько частиц удалось разложить
 */
function placeBackParticles({ particles, slotOrder, firstSlot, backBudget, random }) {
  const { targetPositions, scatterPositions, traits, pupilWeights, normals } = particles;
  const maxAttempts = backBudget * BACK_SIDE_ATTEMPTS_PER_PARTICLE;
  let placedCount = 0;
  let attempts = 0;

  while (placedCount < backBudget && attempts < maxAttempts) {
    attempts += 1;
    const headY = BACK_SIDE_MIN_Y + random() * (BACK_SIDE_MAX_Y - BACK_SIDE_MIN_Y);
    const halfWidth = getHeadHalfWidth(headY);
    const depth = getBackDepth(headY);
    // Больше точек там, где сечение головы шире.
    if (random() > (halfWidth + depth) / BACK_SIDE_MAX_SECTION_SIZE) continue;

    const angle = Math.PI + random() * Math.PI; // задняя половина: z ≤ 0
    const headX = halfWidth * Math.cos(angle);
    const headZ = depth * Math.sin(angle);
    const normal = normalizeVector(Math.cos(angle) / halfWidth, getVerticalNormalTilt(headY), Math.sin(angle) / depth);

    const slot = slotOrder[firstSlot + placedCount];
    const positionOffset = slot * 3;
    targetPositions[positionOffset] = headX;
    targetPositions[positionOffset + 1] = headY;
    targetPositions[positionOffset + 2] = headZ;
    writeScatterPosition(scatterPositions, positionOffset, headX, headY, random);

    const vec4Offset = slot * 4;
    traits[vec4Offset] = random();
    traits[vec4Offset + 1] = random();
    traits[vec4Offset + 2] = 0.38 + random() * 0.32; // яркость тыльной стороны: 0.38..0.7
    traits[vec4Offset + 3] = 0; // рот на затылке не двигается
    pupilWeights[slot] = 0;
    normals[vec4Offset] = normal[0];
    normals[vec4Offset + 1] = normal[1];
    normals[vec4Offset + 2] = normal[2];
    normals[vec4Offset + 3] = 1;
    placedCount += 1;
  }

  return placedCount;
}

// --- WebGL -----------------------------------------------------------------

/**
 * Компилирует шейдер.
 * @param {WebGLRenderingContext} gl
 * @param {number} type — gl.VERTEX_SHADER или gl.FRAGMENT_SHADER
 * @param {string} source — исходный код GLSL
 * @returns {WebGLShader}
 * @throws {Error} если компиляция не удалась (кроме потери контекста)
 */
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

/**
 * Собирает программу из вершинного и фрагментного шейдеров и делает её текущей.
 * @param {WebGLRenderingContext} gl
 * @returns {WebGLProgram}
 * @throws {Error} если сборка не удалась (кроме потери контекста)
 */
function createShaderProgram(gl) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }

  gl.useProgram(program);
  return program;
}

/**
 * Загружает данные частиц в буферы и привязывает их к атрибутам шейдера.
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {ParticleData} particles
 * @returns {WebGLBuffer[]} созданные буферы (их нужно удалить при уничтожении)
 */
function uploadParticleAttributes(gl, program, particles) {
  return PARTICLE_ATTRIBUTES.map(({ name, field, size }) => {
    const buffer = gl.createBuffer();
    const location = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles[field], gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    return buffer;
  });
}

/**
 * Находит uniform-переменные шейдера.
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {Record<string, WebGLUniformLocation | null>}
 */
function getUniformLocations(gl, program) {
  return {
    elapsedSeconds: gl.getUniformLocation(program, 'uElapsedSeconds'),
    assemblyProgress: gl.getUniformLocation(program, 'uAssemblyProgress'),
    speechLevel: gl.getUniformLocation(program, 'uSpeechLevel'),
    pointSize: gl.getUniformLocation(program, 'uPointSize'),
    headRotation: gl.getUniformLocation(program, 'uHeadRotation'),
    viewScale: gl.getUniformLocation(program, 'uViewScale'),
    gazeDirection: gl.getUniformLocation(program, 'uGazeDirection')
  };
}

/**
 * Настраивает смешивание: точки складываются поверх прозрачного фона (premultiplied alpha).
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function configureBlending(gl) {
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
}

// --- Раскладка холста и взгляд ---------------------------------------------

/**
 * Считает размер и положение холста относительно портрета. Холст шире портрета,
 * чтобы повороты и облако не обрезались по краям.
 * @param {number} portraitWidth — ширина портрета, CSS px
 * @param {number} portraitHeight — высота портрета, CSS px
 * @param {number} pixelRatio — используемый devicePixelRatio
 * @returns {CanvasLayout}
 */
function computeCanvasLayout(portraitWidth, portraitHeight, pixelRatio) {
  const offsetX = Math.round(portraitWidth * CANVAS_BLEED_X);
  const offsetY = Math.round(portraitHeight * CANVAS_BLEED_Y);
  const cssWidth = portraitWidth + offsetX * 2;
  const cssHeight = portraitHeight + offsetY * 2;

  // Единица координат головы — половина высоты портрета.
  const pixelsPerHeadUnit = portraitHeight / 2;
  // Частица ≈ пиксель портрета в текущем масштабе, но не тоньше 1,25 CSS-пикселя.
  const pointSize = Math.max(
    MIN_POINT_SIZE_DEVICE,
    Math.max(MIN_POINT_SIZE_CSS, (portraitHeight / REFERENCE_PORTRAIT_HEIGHT) * REFERENCE_POINT_SIZE) * pixelRatio
  );

  return {
    offsetX,
    offsetY,
    cssWidth,
    cssHeight,
    pixelWidth: Math.max(1, Math.round(cssWidth * pixelRatio)),
    pixelHeight: Math.max(1, Math.round(cssHeight * pixelRatio)),
    viewScaleX: pixelsPerHeadUnit / (cssWidth / 2),
    viewScaleY: pixelsPerHeadUnit / (cssHeight / 2),
    pointSize
  };
}

/**
 * Поворот головы к курсору: направление от уровня глаз к курсору, tanh даёт мягкое
 * насыщение — из любого угла экрана лицо повёрнуто к курсору, но не дальше MAX_YAW / MAX_PITCH.
 * @param {number} pointerX — clientX курсора
 * @param {number} pointerY — clientY курсора
 * @param {DOMRect} portraitRect — прямоугольник портрета на экране
 * @returns {{ yaw: number, pitch: number }} нужный поворот, радианы
 */
function computeLookRotation(pointerX, pointerY, portraitRect) {
  const eyeLevelX = portraitRect.left + portraitRect.width / 2;
  const eyeLevelY = portraitRect.top + portraitRect.height * FACE_LANDMARKS.eyes[0].v;
  return {
    yaw: Math.tanh((pointerX - eyeLevelX) / LOOK_DISTANCE) * MAX_YAW,
    pitch: Math.tanh((pointerY - eyeLevelY) / LOOK_DISTANCE) * MAX_PITCH
  };
}

/**
 * Ждёт загрузки картинки, если она ещё не загружена.
 * @param {HTMLImageElement} image
 * @returns {Promise<void>} отклоняется при ошибке загрузки
 */
async function waitForImage(image) {
  if (image.complete && image.naturalWidth) return;
  await new Promise((resolve, reject) => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', reject, { once: true });
  });
}

// --- Портрет ---------------------------------------------------------------

/**
 * Запускает голову из частиц поверх статичного портрета. Пока анимация идёт,
 * у portraitElement есть класс portrait--live; холст получает класс portrait__canvas.
 * @param {object} options
 * @param {HTMLElement} options.portraitElement — <figure class="portrait">
 * @param {HTMLImageElement} options.posterElement — <img class="portrait__poster"> внутри него
 * @param {(deltaSeconds: number) => number} [options.getSpeechLevel] — уровень речи 0..1
 *   на этом кадре; двигает рот
 * @returns {ParticlePortrait | null} null — анимация не нужна или невозможна
 *   (reduced motion, нет WebGL, слабое устройство); остаётся статичный портрет
 */
export function createParticlePortrait({ portraitElement, posterElement, getSpeechLevel = () => 0 }) {
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  if (reducedMotionQuery.matches || !portraitElement || !posterElement) return null;

  const budget = detectParticleBudget();
  if (!budget) return null;

  const canvas = document.createElement('canvas');
  canvas.className = CANVAS_CLASS;
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl', WEBGL_CONTEXT_OPTIONS);
  if (!gl) return null;

  // Поворот к курсору — только для мыши и пера; на тач-экранах — покачивание.
  const followsPointer = window.matchMedia(FINE_POINTER_QUERY).matches;

  // Частицы и ресурсы WebGL.
  let particles = null;
  let shaderProgram = null;
  let attributeBuffers = [];
  let uniformLocations = null;
  let drawCount = 0;
  let minDrawCount = 0;

  // Цикл кадров и жизненный цикл.
  let animationFrameId = 0;
  let lastFrameTimestamp = 0;
  let elapsedSeconds = 0;
  let isInViewport = true;
  let isDestroyed = false;
  let isContextLost = false;
  let isLive = false;

  // Проекция на холст.
  let viewScaleX = 1;
  let viewScaleY = 1;
  let pointSize = INITIAL_POINT_SIZE;

  // Курсор, поворот и речь.
  let pointerX = 0;
  let pointerY = 0;
  let portraitRect = null;
  let targetYaw = 0;
  let targetPitch = 0;
  let currentYaw = 0;
  let currentPitch = 0;
  let speechLevel = 0;

  // Замер частоты кадров для adaptQuality.
  let measuredFrames = 0;
  let measuredSeconds = 0;

  // --- Настройка WebGL ---

  /**
   * Создаёт программу, буферы частиц и настраивает смешивание (и после восстановления контекста).
   * @returns {void}
   */
  function setupWebGl() {
    shaderProgram = createShaderProgram(gl);
    attributeBuffers = uploadParticleAttributes(gl, shaderProgram, particles);
    uniformLocations = getUniformLocations(gl, shaderProgram);
    configureBlending(gl);
  }

  /**
   * Удаляет программу и буферы, если контекст ещё жив.
   * @returns {void}
   */
  function releaseWebGl() {
    if (gl.isContextLost()) return;
    attributeBuffers.forEach((buffer) => gl.deleteBuffer(buffer));
    if (shaderProgram) gl.deleteProgram(shaderProgram);
    attributeBuffers = [];
    shaderProgram = null;
  }

  // --- Размер холста ---

  /**
   * Подгоняет холст под текущий размер портрета и плотность пикселей экрана.
   * @returns {void}
   */
  function resizeCanvas() {
    const portraitWidth = portraitElement.clientWidth;
    const portraitHeight = portraitElement.clientHeight;
    if (!portraitWidth || !portraitHeight) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, budget.maxPixelRatio);
    const layout = computeCanvasLayout(portraitWidth, portraitHeight, pixelRatio);

    canvas.style.left = `${-layout.offsetX}px`;
    canvas.style.top = `${-layout.offsetY}px`;
    canvas.style.width = `${layout.cssWidth}px`;
    canvas.style.height = `${layout.cssHeight}px`;
    canvas.width = layout.pixelWidth;
    canvas.height = layout.pixelHeight;

    viewScaleX = layout.viewScaleX;
    viewScaleY = layout.viewScaleY;
    pointSize = layout.pointSize;

    invalidatePortraitRect();
    if (!isContextLost) gl.viewport(0, 0, layout.pixelWidth, layout.pixelHeight);
  }

  // --- Слежение за курсором ---

  /**
   * Сбрасывает запомненное положение портрета (после прокрутки или ресайза).
   * @returns {void}
   */
  function invalidatePortraitRect() {
    portraitRect = null;
  }

  /**
   * Пересчитывает нужный поворот головы по последнему положению курсора.
   * @returns {void}
   */
  function updateTargetRotation() {
    if (!portraitRect) portraitRect = portraitElement.getBoundingClientRect();
    const rotation = computeLookRotation(pointerX, pointerY, portraitRect);
    targetYaw = rotation.yaw;
    targetPitch = rotation.pitch;
  }

  /**
   * Запоминает положение мыши или пера (касания пальцем игнорируются).
   * @param {PointerEvent} event
   * @returns {void}
   */
  function handlePointerMove(event) {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    updateTargetRotation();
  }

  /**
   * Возвращает голову в исходное положение.
   * @returns {void}
   */
  function resetTargetRotation() {
    targetYaw = 0;
    targetPitch = 0;
  }

  /**
   * Курсор ушёл за пределы окна — голова смотрит прямо.
   * @param {MouseEvent} event
   * @returns {void}
   */
  function handleMouseOut(event) {
    if (!event.relatedTarget) resetTargetRotation();
  }

  // --- Цикл кадров ---

  /**
   * Плавно ведёт поворот к нужному; на тач-экранах добавляет лёгкое покачивание.
   * @param {number} deltaSeconds — длина кадра, с
   * @returns {void}
   */
  function updateRotation(deltaSeconds) {
    const followFactor = 1 - Math.exp(-deltaSeconds * HEAD_FOLLOW_RATE);
    const swayYaw = followsPointer ? 0 : Math.sin(elapsedSeconds * TOUCH_SWAY_FREQUENCY) * TOUCH_SWAY_AMPLITUDE;
    currentYaw += (targetYaw + swayYaw - currentYaw) * followFactor;
    currentPitch += (targetPitch - currentPitch) * followFactor;
  }

  /**
   * Плавно ведёт уровень речи к значению от getSpeechLevel.
   * @param {number} deltaSeconds — длина кадра, с
   * @returns {void}
   */
  function updateSpeechLevel(deltaSeconds) {
    const nextSpeechLevel = Math.max(0, Math.min(1, getSpeechLevel(deltaSeconds) || 0));
    speechLevel += (nextSpeechLevel - speechLevel) * (1 - Math.exp(-deltaSeconds * SPEECH_FOLLOW_RATE));
  }

  /**
   * Передаёт состояние в шейдер и рисует частицы.
   * @returns {void}
   */
  function drawParticles() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniformLocations.elapsedSeconds, elapsedSeconds);
    gl.uniform1f(uniformLocations.assemblyProgress, Math.min(elapsedSeconds / ASSEMBLY_DURATION_SECONDS, 1));
    gl.uniform1f(uniformLocations.speechLevel, speechLevel);
    gl.uniform1f(uniformLocations.pointSize, pointSize);
    gl.uniform2f(uniformLocations.headRotation, currentYaw, currentPitch);
    // Взгляд следует за поворотом: x — вправо, y — вверх (в координатах головы).
    gl.uniform2f(uniformLocations.gazeDirection, currentYaw / MAX_YAW, -currentPitch / MAX_PITCH);
    gl.uniform2f(uniformLocations.viewScale, viewScaleX, viewScaleY);
    gl.drawArrays(gl.POINTS, 0, drawCount);
  }

  /**
   * Если после сборки кадры стабильно медленнее 40 к/с — рисует меньше частиц.
   * Частицы перемешаны случайно, поэтому первые N — равномерная выборка.
   * @param {number} deltaSeconds — длина кадра, с
   * @returns {void}
   */
  function adaptQuality(deltaSeconds) {
    if (elapsedSeconds < ASSEMBLY_DURATION_SECONDS + QUALITY_CHECK_DELAY_SECONDS || drawCount <= minDrawCount) return;
    measuredFrames += 1;
    measuredSeconds += deltaSeconds;
    if (measuredFrames < QUALITY_SAMPLE_FRAMES) return;

    const averageFrameSeconds = measuredSeconds / measuredFrames;
    measuredFrames = 0;
    measuredSeconds = 0;

    if (averageFrameSeconds > SLOW_FRAME_SECONDS) {
      drawCount = Math.max(minDrawCount, Math.round(drawCount * QUALITY_REDUCTION_FACTOR));
    }
  }

  /**
   * Ставит или снимает класс portrait--live (статичный постер ↔ холст).
   * @param {boolean} live
   * @returns {void}
   */
  function setLive(live) {
    isLive = live;
    portraitElement.classList.toggle(LIVE_CLASS, live);
  }

  /**
   * Один кадр анимации.
   * @param {DOMHighResTimeStamp} timestamp — время кадра от requestAnimationFrame
   * @returns {void}
   */
  function renderFrame(timestamp) {
    animationFrameId = 0;
    if (!canAnimate()) return;

    const deltaSeconds = lastFrameTimestamp
      ? Math.min((timestamp - lastFrameTimestamp) / 1000, MAX_FRAME_SECONDS)
      : FIRST_FRAME_SECONDS;
    lastFrameTimestamp = timestamp;

    elapsedSeconds += deltaSeconds;
    updateRotation(deltaSeconds);
    updateSpeechLevel(deltaSeconds);
    drawParticles();
    adaptQuality(deltaSeconds);

    if (!isLive) setLive(true);

    animationFrameId = window.requestAnimationFrame(renderFrame);
  }

  // --- Жизненный цикл ---

  /**
   * Можно ли сейчас рисовать: модуль жив, контекст есть, портрет на экране, вкладка видна.
   * @returns {boolean}
   */
  function canAnimate() {
    return !isDestroyed && !isContextLost && isInViewport && !document.hidden && particles !== null;
  }

  /**
   * Запускает цикл кадров, если он ещё не идёт и рисовать можно.
   * @returns {void}
   */
  function startAnimation() {
    if (animationFrameId || !canAnimate()) return;
    lastFrameTimestamp = 0;
    animationFrameId = window.requestAnimationFrame(renderFrame);
  }

  /**
   * Останавливает цикл кадров.
   * @returns {void}
   */
  function stopAnimation() {
    if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  /**
   * Пауза, пока вкладка в фоне.
   * @returns {void}
   */
  function handleVisibilityChange() {
    if (document.hidden) stopAnimation();
    else startAnimation();
  }

  /**
   * Пауза, пока портрет вне экрана.
   * @param {IntersectionObserverEntry[]} entries
   * @returns {void}
   */
  function handleIntersection(entries) {
    isInViewport = entries[entries.length - 1].isIntersecting;
    if (isInViewport) startAnimation();
    else stopAnimation();
  }

  /**
   * Контекст WebGL потерян: останавливаемся и показываем статичный портрет.
   * @param {WebGLContextEvent} event
   * @returns {void}
   */
  function handleContextLost(event) {
    event.preventDefault(); // без этого браузер не восстановит контекст
    isContextLost = true;
    stopAnimation();
    setLive(false);
  }

  /**
   * Контекст восстановлен: заново создаём ресурсы WebGL и продолжаем.
   * @returns {void}
   */
  function handleContextRestored() {
    isContextLost = false;
    try {
      setupWebGl();
      resizeCanvas();
      // После восстановления не собираем лицо заново — сразу спокойное состояние.
      elapsedSeconds = Math.max(elapsedSeconds, ASSEMBLY_DURATION_SECONDS);
      startAnimation();
    } catch {
      destroy();
    }
  }

  /**
   * Пользователь включил «уменьшить движение» — анимацию убираем.
   * @param {MediaQueryListEvent} event
   * @returns {void}
   */
  function handleReducedMotionChange(event) {
    if (event.matches) destroy();
  }

  const resizeObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => resizeCanvas())
    : null;

  const intersectionObserver = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(handleIntersection, { threshold: 0 })
    : null;

  /**
   * Подписывается на события окна, документа и холста.
   * @returns {void}
   */
  function addEventListeners() {
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', invalidatePortraitRect, { passive: true });
    window.addEventListener('resize', invalidatePortraitRect, { passive: true });
    reducedMotionQuery.addEventListener?.('change', handleReducedMotionChange);

    if (followsPointer) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('mouseout', handleMouseOut);
      window.addEventListener('blur', resetTargetRotation);
    }

    resizeObserver?.observe(portraitElement);
    intersectionObserver?.observe(portraitElement);
  }

  /**
   * Отписывается от всех событий и наблюдателей.
   * @returns {void}
   */
  function removeEventListeners() {
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    window.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('mouseout', handleMouseOut);
    window.removeEventListener('blur', resetTargetRotation);
    window.removeEventListener('scroll', invalidatePortraitRect);
    window.removeEventListener('resize', invalidatePortraitRect);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    canvas.removeEventListener('webglcontextlost', handleContextLost);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    reducedMotionQuery.removeEventListener?.('change', handleReducedMotionChange);
  }

  /**
   * Останавливает анимацию, освобождает WebGL, убирает холст и возвращает статичный портрет.
   * Повторный вызов ничего не делает.
   * @returns {void}
   */
  function destroy() {
    if (isDestroyed) return;
    isDestroyed = true;
    stopAnimation();
    removeEventListeners();
    releaseWebGl();
    portraitElement.classList.remove(LIVE_CLASS);
    canvas.remove();
    particles = null;
  }

  /**
   * Ждёт портрет, строит частицы и запускает анимацию. Любая ошибка — остаётся
   * статичный портрет, сайт работает как обычно.
   * @returns {Promise<void>}
   */
  async function initialize() {
    try {
      await waitForImage(posterElement);
      if (isDestroyed) return;

      // Читаем портрет в масштабе показа (1× и 2× файлы дают одинаковый результат).
      const samplingScale = Math.min(1, Math.max(MIN_SAMPLING_SCALE, portraitElement.clientHeight / posterElement.naturalHeight));
      particles = sampleParticles(posterElement, budget.particleCount, samplingScale);
      drawCount = particles.count;
      minDrawCount = Math.round(particles.count * MIN_DRAW_SHARE);

      setupWebGl();
      portraitElement.append(canvas);
      resizeCanvas();
      addEventListeners();
      startAnimation();
    } catch {
      destroy();
    }
  }

  initialize();

  return {
    destroy,
    get particleCount() {
      return drawCount;
    }
  };
}
