import { greetingConfig } from './greeting.config.js';

// Приветствие на первом экране.
// Источники звука по порядку: своя запись → синтезатор браузера → только текст.
// Состояния: idle / loading / speaking / stopped / error.
// Каждый запуск получает свой token: колбэки от прошлого запуска игнорируются,
// поэтому повторные клики не накладывают несколько голосов.

function normalizeLang(value = '') {
  return value.toLowerCase().replace('_', '-');
}

export function createGreeting({ root, t, getLanguage, config = greetingConfig }) {
  if (!root) return null;

  const button = root.querySelector('[data-greeting-toggle]');
  const label = root.querySelector('[data-greeting-label]');
  const status = root.querySelector('[data-greeting-status]');
  const caption = root.querySelector('[data-greeting-caption]');
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;

  let state = 'idle';
  let statusKey = 'greetingIdle';
  let running = false;
  let mode = '';
  let token = 0;
  let lineIndex = -1;
  let timers = [];
  let watchdog = 0;

  let audio = null;
  let audioContext = null;
  let analyser = null;
  let samples = null;

  let currentUtterance = null;
  let voiced = false;
  let boundaryKick = 0;
  let synthTime = 0;

  function lines() {
    return config.lines[getLanguage()] || config.lines.ru;
  }

  function setText(element, value) {
    if (element.textContent !== value) element.textContent = value;
  }

  function render() {
    const action = running || state === 'loading'
      ? 'stop'
      : state === 'idle' ? 'play' : 'replay';

    root.dataset.state = state;
    root.dataset.mode = mode;
    button.dataset.action = action;
    setText(label, t(`greetingButton.${action}`));
    setText(status, t(statusKey));
    setText(caption, lineIndex >= 0 ? lines()[lineIndex] ?? '' : t('greetingCaption'));
  }

  function setState(nextState, nextStatusKey) {
    state = nextState;
    statusKey = nextStatusKey;
    render();
  }

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    window.clearTimeout(watchdog);
    watchdog = 0;
  }

  function stopMedia() {
    voiced = false;
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
    currentUtterance = null;
    if (audio && !audio.paused) audio.pause();
  }

  function reset() {
    token += 1;
    clearTimers();
    stopMedia();
    return token;
  }

  function finish() {
    clearTimers();
    running = false;
    voiced = false;
    setState('stopped', 'greetingEnded');
  }

  function stop() {
    reset();
    running = false;
    setState(state === 'idle' ? 'idle' : 'stopped', state === 'idle' ? 'greetingIdle' : 'greetingStopped');
  }

  // ——— Текстовый режим: субтитры без звука ———
  function playText(session, from, messageKey) {
    if (session !== token) return;
    clearTimers();
    stopMedia();
    mode = 'text';
    running = true;
    setState('error', messageKey);

    const showLine = (index) => {
      if (session !== token) return;
      lineIndex = index;
      render();
      const duration = Math.max(2600, lines()[index].length * 62);
      timers.push(window.setTimeout(() => {
        if (session !== token) return;
        if (index + 1 < lines().length) {
          showLine(index + 1);
        } else {
          running = false;
          render();
        }
      }, duration));
    };

    showLine(Math.max(0, Math.min(from, lines().length - 1)));
  }

  // ——— Своя запись голоса ———
  function prepareAnalyser() {
    if (analyser || !audio) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || window.location.protocol === 'file:') return;

    try {
      audioContext = new AudioContextClass();
      const source = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      samples = new Uint8Array(analyser.fftSize);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    } catch {
      analyser = null;
    }
  }

  function syncAudioCaption() {
    const allLines = lines();
    const time = audio.currentTime;
    const cues = config.cues?.[getLanguage()];
    let index = 0;

    if (Array.isArray(cues) && cues.length === allLines.length) {
      cues.forEach((cue, cueIndex) => {
        if (time >= cue) index = cueIndex;
      });
    } else if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const total = allLines.reduce((sum, line) => sum + line.length, 0);
      const progress = time / audio.duration;
      let passed = 0;
      for (let i = 0; i < allLines.length; i += 1) {
        passed += allLines[i].length / total;
        index = i;
        if (progress < passed) break;
      }
    }

    if (index !== lineIndex) {
      lineIndex = index;
      render();
    }
  }

  function playAudio(source, session) {
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
    }

    prepareAnalyser();
    audioContext?.resume?.().catch(() => {});

    return new Promise((resolve) => {
      let started = false;

      audio.onended = () => {
        if (session === token) finish();
      };

      audio.onerror = () => {
        if (session !== token) return;
        if (!started) resolve(false);
        else playText(session, lineIndex, 'greetingAudioError');
      };

      audio.ontimeupdate = () => {
        if (session === token && started) syncAudioCaption();
      };

      audio.src = source;

      let playback;
      try {
        playback = audio.play();
      } catch {
        resolve(false);
        return;
      }

      Promise.resolve(playback).then(() => {
        if (session !== token) {
          audio.pause();
          return;
        }
        started = true;
        mode = 'audio';
        lineIndex = 0;
        setState('speaking', 'greetingSpeaking');
        resolve(true);
      }).catch(() => {
        if (session === token) resolve(false);
      });
    });
  }

  // ——— Синтезатор браузера ———
  function pickVoice(voices, language) {
    const matching = voices.filter((voice) => normalizeLang(voice.lang).startsWith(language));
    if (!matching.length) return null;

    const preferred = config.tts?.preferredVoices ?? [];
    for (const pattern of preferred) {
      const found = matching.find((voice) => new RegExp(pattern, 'i').test(voice.name));
      if (found) return found;
    }

    return matching.find((voice) => voice.default) || matching.find((voice) => voice.localService) || matching[0];
  }

  function findVoice(language, session) {
    const ready = pickVoice(synth.getVoices(), language);
    if (ready) return Promise.resolve(ready);

    return new Promise((resolve) => {
      const cleanup = () => {
        window.clearTimeout(timer);
        synth.removeEventListener?.('voiceschanged', onVoicesChanged);
      };

      const onVoicesChanged = () => {
        const voice = pickVoice(synth.getVoices(), language);
        if (!voice && session === token) return;
        cleanup();
        resolve(voice);
      };

      const timer = window.setTimeout(() => {
        cleanup();
        resolve(pickVoice(synth.getVoices(), language));
      }, config.tts?.voiceTimeoutMs ?? 1500);

      synth.addEventListener?.('voiceschanged', onVoicesChanged);
    });
  }

  function speakLine(index, voice, session) {
    if (session !== token || mode !== 'tts') return;
    const text = lines()[index];
    const utterance = new SpeechSynthesisUtterance(text);
    try {
      utterance.voice = voice;
    } catch {
      // Некоторые браузеры не принимают голос — тогда хватает языка.
    }
    utterance.lang = voice.lang;
    utterance.rate = config.tts?.rate ?? 1;
    utterance.pitch = config.tts?.pitch ?? 1;

    // Сторож: если браузер так и не начал говорить — показываем текст.
    window.clearTimeout(watchdog);
    watchdog = window.setTimeout(() => {
      if (session !== token || mode !== 'tts') return;
      playText(session, index, 'greetingNoVoice');
    }, config.tts?.startTimeoutMs ?? 5000);

    utterance.onstart = () => {
      if (session !== token || mode !== 'tts') return;
      voiced = true;
      lineIndex = index;
      setState('speaking', 'greetingSpeakingTts');

      // Защита от зависшего onend в некоторых браузерах.
      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(() => {
        if (session !== token || mode !== 'tts') return;
        synth.cancel();
        if (index + 1 < lines().length) speakLine(index + 1, voice, session);
        else finish();
      }, text.length * 160 + 6000);
    };

    utterance.onboundary = () => {
      if (session === token) boundaryKick = 1;
    };

    utterance.onend = () => {
      if (session !== token || mode !== 'tts') return;
      window.clearTimeout(watchdog);
      voiced = false;
      if (index + 1 < lines().length) speakLine(index + 1, voice, session);
      else finish();
    };

    utterance.onerror = (event) => {
      if (session !== token || mode !== 'tts') return;
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      playText(session, index, 'greetingNoVoice');
    };

    // Ссылка на фразу нужна, иначе Chrome может собрать её сборщиком мусора без onend.
    currentUtterance = utterance;
    try {
      synth.speak(utterance);
    } catch {
      playText(session, index, 'greetingNoVoice');
    }
  }

  async function playTts(session) {
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') return false;

    const voice = await findVoice(getLanguage(), session);
    if (session !== token || !voice) return false;

    mode = 'tts';
    synth.cancel();
    speakLine(0, voice, session);
    return true;
  }

  async function start() {
    const session = reset();
    running = true;
    mode = '';
    lineIndex = -1;
    setState('loading', 'greetingLoading');

    const source = config.audio?.[getLanguage()];
    if (source) {
      const played = await playAudio(source, session);
      if (session !== token || played) return;
    }

    let speaking = false;
    try {
      speaking = await playTts(session);
    } catch {
      speaking = false;
    }
    if (session !== token || speaking) return;

    playText(session, 0, source ? 'greetingAudioError' : 'greetingNoVoice');
  }

  function synthetic(dt) {
    synthTime += dt;
    boundaryKick *= Math.exp(-dt * 6);
    const wave = 0.5 + 0.5 * Math.sin(synthTime * 11) * Math.sin(synthTime * 3.7 + 0.6);
    return Math.min(1, 0.22 + wave * 0.5 + boundaryKick * 0.35);
  }

  // Уровень «речи» 0..1 для анимации головы. Вызывается на каждом кадре,
  // поэтому без аллокаций: буфер samples создаётся один раз.
  function getLevel(dt = 1 / 60) {
    if (!running || state !== 'speaking') return 0;

    if (mode === 'audio') {
      if (!analyser || audio.paused) return audio && !audio.paused ? synthetic(dt) : 0;
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i += 1) {
        const value = (samples[i] - 128) / 128;
        sum += value * value;
      }
      return Math.min(1, Math.sqrt(sum / samples.length) * 4.5);
    }

    if (mode === 'tts' && voiced) return synthetic(dt);
    return 0;
  }

  button.addEventListener('click', () => {
    if (button.dataset.action === 'stop') stop();
    else start();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && (running || state === 'loading')) stop();
  });

  window.addEventListener('pagehide', () => {
    if (running || state === 'loading') stop();
  });

  button.hidden = false;
  render();

  return {
    getLevel,
    stop,
    // При смене языка останавливаем фразу и обновляем подписи.
    refresh() {
      if (running || state === 'loading') stop();
      // Не показываем перевод фразы, которая на этом языке не звучала.
      lineIndex = -1;
      render();
    },
    get state() {
      return state;
    },
    get mode() {
      return mode;
    }
  };
}
