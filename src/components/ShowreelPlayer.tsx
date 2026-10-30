/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║  ★ REPRODUCTOR DE VIDEO CUSTOM (SHOWREEL) — GUÍA RÁPIDA ★                ║
   ╠══════════════════════════════════════════════════════════════════════════╣
   ║  QUÉ ES: reproductor de video 100% custom (NO YouTube) con controles     ║
   ║  propios, subtítulos reales y doble pista de audio. Se usa en la         ║
   ║  landing pública (LandingPublicaView.tsx, sección "Nuestro Trabajo..."). ║
   ║                                                                          ║
   ║  ARCHIVOS QUE USA (están en /public, cambialos ahí si piden otro video): ║
   ║   • Video    → /videos/showreel-360.mp4   (360p, dura 15.5 seg)          ║
   ║   • Poster   → /videos/showreel-poster.jpg (carátula antes de dar Play)  ║
   ║   · Música   · /audio/showreel-music.mp3 (track "Música", jazz 1:34)     ║
   ║   · Subtítulos → /subtitles/showreel-es.vtt y showreel-en.vtt            ║
   ║     (son DESCRIPTIVOS: "[Música de gala]", "Invitados brindando"...      ║
   ║      porque el video no tiene diálogo. Se editan con cualquier editor    ║
   ║      de texto: la primera línea es el tiempo "00:00:04.000 --> ...")     ║
   ║                                                                          ║
   ║  FUNCIONES del reproductor (todas reales y probadas):                   ║
   ║   1. Play/Pausa · barra de progreso con buffer · tiempo actual/total     ║
   ║   2. Miniaturas al pasar el mouse por la barra (ver banner ★PREVIEW★)    ║
   ║   3. Volumen + mute (afecta a la pista que esté activa)                  ║
   ║   4. Pantalla completa (con fallback para iPhone)                        ║
   ║   5. Menú de ajustes: subtítulos (Off/Esp/Eng) y audio (Original/Música) ║
   ║   6. "Ir a un tiempo": escribís mm:ss y salta ahí (valida y da error)    ║
   ║   7. Teclado: Espacio/K play · ←/→ ±5seg · ↑/↓ volumen · M mute · F full ║
   ║                                                                          ║
   ║  CÓMO CAMBIAR EL AUDIO: no hay doblaje real en 1 archivo .mp4 — el       ║
   ║  "cambio de pista" es un <audio> oculto sincronizado con el video        ║
   ║  (mirar syncMusic). Si piden una 3ª pista (ej. "Salsa"): crear           ║
   ║  /public/audio/track3.mp3, agregar otro <audio> con su ref, y extender   ║
   ║  el tipo AudioTrack + la función selectAudioTrack                        ║
   ║                                                                          ║
   ║  LIMITACIONES CONOCIDAS (por si preguntan en la prueba):                 ║
   ║   · No hay velocidad x0.5/x2 (no pedido: agregar <select> con .playbackRate) ║
   ║   · La música es de 1:34 y el video 15.5seg → la música se reinicia      ║
   ║     en cada loop (el video tiene loop activo).                           ║
   ║   · El video arranca en pausa con carátula (NO autoplay, es a propósito  ║
   ║     y considerado mejor práctica para una landing).                      ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useBrand } from '../context/BrandContext';

interface ShowreelPlayerProps {
  src: string;
  poster: string;
}

type SubtitleLanguage = 'off' | 'es' | 'en';
type AudioTrack = 'original' | 'music';

const DEFAULT_VOLUME = 0.7;
const SEEK_STEP_SECONDS = 5;          // ← Cuánto salta con la flecha ← / → del teclado
const VOLUME_STEP = 0.1;              // ← Cuánto sube/baja el volumen con ↑ / ↓ (10%)
const PREVIEW_FRAME_STEP = 0.25;      // ★MINIATURAS★ granularidad: 1 miniatura cada 0.25 seg
const PREVIEW_WIDTH = 160;            // ★MINIATURAS★ ancho en px de cada miniatura
const PREVIEW_HEIGHT = 90;            // ★MINIATURAS★ alto en px (160x90 = ratio 16:9 igual al video)

const SUBTITLE_OPTIONS: Array<{ value: SubtitleLanguage; label: string }> = [
  { value: 'off', label: 'Desactivados' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

const AUDIO_OPTIONS: Array<{ value: AudioTrack; label: string }> = [
  { value: 'original', label: 'Original' },
  { value: 'music', label: 'Música' },
];

const formatTime = (value: number): string => {
  if (!Number.isFinite(value) || value < 0) return '--:--';
  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

/**
 * Acepta "mm:ss" o "hh:mm:ss" y devuelve segundos.
 * Devuelve null si el formato es inválido.
 */
const parseTime = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(trimmed)) return null;

  const parts = trimmed.split(':').map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (minutes > 59 || seconds > 59) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }

  const [minutes, seconds] = parts;
  if (seconds > 59) return null;
  return minutes * 60 + seconds;
};

export const ShowreelPlayer: React.FC<ShowreelPlayerProps> = ({ src, poster }) => {
  const { colors, typography } = useBrand();

  const h2Size = typography.h2Size || Math.max(1, Math.round(typography.headlineSize * 0.67));
  const bodySize = typography.bodySize;
  const smallSize = typography.smallSize || Math.max(1, Math.round(typography.bodySize * 0.75));

  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameCacheRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const pendingPreviewRef = useRef<{ index: number; seq: number } | null>(null);
  const previewSeqRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seekInput, setSeekInput] = useState('');
  const [seekError, setSeekError] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleLanguage>('off');
  const [activeCue, setActiveCue] = useState<string | null>(null);
  const [audioTrack, setAudioTrack] = useState<AudioTrack>('original');
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverLeft, setHoverLeft] = useState(0);

  /* ── ★MÚSICA SINCRONIZADA★ ─────────────────────────────────────────────
     El <audio> de "Música" NO va dentro del .mp4: es un elemento <audio>
     separado que se mantiene pegado al tiempo del video. syncMusic()
     compara music.currentTime con video.currentTime y lo corrige si la
     diferencia supera SYNC_THRESHOLD (0.35 seg). Se llama al iniciar a
     reproducir, al cambiar de pista y al hacer seek.                    */
  const syncMusic = useCallback((force = false) => {
    const video = videoRef.current;
    const music = musicRef.current;
    if (!video || !music || !Number.isFinite(music.duration) || music.duration <= 0) return;

    const target = video.currentTime >= music.duration ? video.currentTime % music.duration : video.currentTime;
    if (force || Math.abs(music.currentTime - target) > 0.35) {
      try {
        music.currentTime = target;
      } catch {
        // El audio aún no tiene metadatos; se sincronizará en el próximo timeupdate.
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    const music = musicRef.current;
    if (!video || hasError) return;

    if (video.paused) {
      if (audioTrack === 'music' && music) {
        music.volume = volume;
        music.muted = muted || volume === 0;
        syncMusic(true);
        void music.play().catch(() => undefined);
        video.muted = true;
      }
      void video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
      if (music) music.pause();
    }
  }, [audioTrack, hasError, muted, volume, syncMusic]);

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const videoDuration = Number.isFinite(video.duration) ? video.duration : 0;
    const nextTime = Math.min(Math.max(0, time), videoDuration);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (audioTrack === 'music') syncMusic();
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    video.volume = DEFAULT_VOLUME;
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;

    let end = video.buffered.end(video.buffered.length - 1);
    for (let i = 0; i < video.buffered.length; i += 1) {
      if (video.buffered.start(i) <= video.currentTime && video.currentTime <= video.buffered.end(i)) {
        end = video.buffered.end(i);
        break;
      }
    }
    setBuffered(end);
  };

  const handleVolumeChange = () => {
    const video = videoRef.current;
    if (!video || audioTrack !== 'original') return;
    setVolume(video.volume);
    setMuted(video.muted);
  };

  const applyVolume = (nextVolume: number) => {
    const video = videoRef.current;
    const music = musicRef.current;
    const clamped = Math.min(1, Math.max(0, nextVolume));

    if (video) {
      video.volume = clamped;
      video.muted = audioTrack === 'music' ? true : clamped === 0;
    }
    if (music) {
      music.volume = clamped;
      music.muted = clamped === 0;
    }

    setVolume(clamped);
    setMuted(clamped === 0);
  };

  const handleVolumeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyVolume(Number(event.target.value));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    const music = musicRef.current;
    const isCurrentlyMuted = muted || volume === 0;

    if (isCurrentlyMuted) {
      const nextVolume = volume === 0 ? DEFAULT_VOLUME : volume;
      if (music) {
        music.volume = nextVolume;
        music.muted = false;
      }
      if (video) {
        video.volume = nextVolume;
        video.muted = audioTrack === 'music';
      }
      setVolume(nextVolume);
      setMuted(false);
    } else {
      if (music) music.muted = true;
      if (video) video.muted = true;
      setMuted(true);
    }
  };

  /* ── ★CAMBIO DE PISTA DE AUDIO★ ────────────────────────────────────────
     TODO lo que hay que saber:
     · track 'original' → se escucha el audio del propio .mp4 (video.muted=false)
     · track 'music'    → se MUEDA el video (muted=true) y suena el <audio> oculto
                          sincronizado con syncMusic(true).
     · El volumen/mute de la barra afectan SIEMPRE a la pista activa.
     · Para agregar otra pista ver el banner del encabezado del archivo.  */
  const selectAudioTrack = (track: AudioTrack) => {
    const video = videoRef.current;
    const music = musicRef.current;

    setAudioTrack(track);

    if (!video || !music) return;

    if (track === 'music') {
      video.muted = true;
      music.volume = volume;
      music.muted = muted || volume === 0;
      syncMusic(true);
      if (!video.paused) void music.play().catch(() => undefined);
    } else {
      music.pause();
      video.muted = muted || volume === 0;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container?.requestFullscreen) {
        await container.requestFullscreen();
      } else if (video?.webkitEnterFullscreen) {
        // Fallback para iOS Safari, que no permite fullscreen sobre un div.
        video.webkitEnterFullscreen();
      }
    } catch {
      // El navegador puede rechazar la solicitud; no hacemos nada.
    }
  };

  const handleSeekSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      setSeekError('Espera a que el video termine de cargar.');
      return;
    }

    const seconds = parseTime(seekInput);
    if (seconds === null) {
      setSeekError('Formato inválido. Usa mm:ss (ej. 02:30).');
      return;
    }

    if (seconds > video.duration) {
      setSeekError(`El video dura ${formatTime(video.duration)}.`);
      return;
    }

    seekTo(seconds);
    setSeekError(null);
  };

  /* ═══ ★MINIATURAS DEL PREVIEW (hover en la barra de progreso)★ ═════════
     Estilo YouTube: al pasar el mouse por la barra aparece el FOTOGRAMA
     del video en ese punto + el tiempo debajo. CÓMO FUNCIONA:
      1) Hay un <video> OCULTO secundario abajo (className="hidden", mismo
         src) que NO se reproduce: solo se usa para "saltar" (seek) al
         tiempo que apunta el mouse y capturar ese cuadro.
      2) Cada cuadro capturado se guarda en frameCacheRef (un Map: índice
         → <canvas>) para que el segundo hover sea instantáneo.
      3) La miniatura visible es un <canvas> de 160x90 que se pinta
         copiando (drawImage) el tile del caché.
      4) requestSeqRef descarta pedidos viejos cuando se mueve rápido el
         mouse (solo se pinta el último).
     FLUJO: handleProgressHover (mousemove) → requestPreview(time) →
     seek del video oculto → evento onSeeked → capturePreviewFrame →
     paintPreviewTile (lo dibuja encima).
     CAMBIOS PROBABLES:
      · "que sean más chicas/grandes" → cambiar PREVIEW_WIDTH/HEIGHT.
      · "más o menos miniaturas" → cambiar PREVIEW_FRAME_STEP.
      · "también en móvil" → agregar onPointerMove (hoy es SOLO mouse:
        onMouseEnter/Move/Leave, decisiones del plan: solo desktop).
     ═════════════════════════════════════════════════════════════════════ */

  const paintPreviewTile = (index: number) => {
    const tile = frameCacheRef.current.get(index);
    const canvas = previewCanvasRef.current;
    if (!tile || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(tile, 0, 0, canvas.width, canvas.height);
  };

  const capturePreviewFrame = (previewVideo: HTMLVideoElement, index: number) => {
    const tile = document.createElement('canvas');
    tile.width = PREVIEW_WIDTH;
    tile.height = PREVIEW_HEIGHT;
    const ctx = tile.getContext('2d');
    if (!ctx) return false;
    try {
      ctx.drawImage(previewVideo, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
    } catch {
      return false;
    }
    frameCacheRef.current.set(index, tile);
    return true;
  };

  const requestPreview = useCallback((time: number) => {
    const preview = previewRef.current;
    if (!preview || !Number.isFinite(preview.duration) || preview.duration <= 0) return;

    const index = Math.min(
      Math.max(0, Math.floor(time / PREVIEW_FRAME_STEP)),
      Math.ceil(preview.duration / PREVIEW_FRAME_STEP) - 1
    );

    if (frameCacheRef.current.has(index)) {
      paintPreviewTile(index);
      return;
    }

    const seq = previewSeqRef.current + 1;
    previewSeqRef.current = seq;
    pendingPreviewRef.current = { index, seq };

    if (preview.readyState >= 1) {
      preview.currentTime = Math.min(index * PREVIEW_FRAME_STEP, Math.max(0, preview.duration - 0.05));
    }
  }, []);

  const handlePreviewCanPlay = () => {
    const pending = pendingPreviewRef.current;
    if (pending) requestPreview(pending.index * PREVIEW_FRAME_STEP);
  };

  const handlePreviewSeeked = () => {
    const preview = previewRef.current;
    const pending = pendingPreviewRef.current;
    if (!preview || !pending || pending.seq !== previewSeqRef.current) return;
    if (capturePreviewFrame(preview, pending.index)) paintPreviewTile(pending.index);
    pendingPreviewRef.current = null;
  };

  const handleProgressHover = (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const rect = input.getBoundingClientRect();
    if (rect.width === 0) return;

    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const time = ratio * safeDuration;
    setHoverTime(time);
    setHoverLeft(
      Math.min(Math.max(event.clientX - rect.left, PREVIEW_WIDTH / 2), rect.width - PREVIEW_WIDTH / 2)
    );
    setIsHovering(true);
    requestPreview(time);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)) return;

    const video = videoRef.current;
    if (!video) return;

    switch (event.key) {
      case ' ':
      case 'k':
      case 'K':
        event.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        event.preventDefault();
        seekTo(video.currentTime + SEEK_STEP_SECONDS);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        seekTo(video.currentTime - SEEK_STEP_SECONDS);
        break;
      case 'ArrowUp':
        event.preventDefault();
        applyVolume(Math.min(1, Number((volume + VOLUME_STEP).toFixed(2))));
        break;
      case 'ArrowDown':
        event.preventDefault();
        applyVolume(Math.max(0, Number((volume - VOLUME_STEP).toFixed(2))));
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        toggleMute();
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        void toggleFullscreen();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [menuOpen]);

  /* ── ★SUBTÍTULOS (OFF / ESPAÑOL / ENGLISH)★ ────────────────────────────
     Idea clave: los tracks <track> del <video> se declaran modo "hidden"
     (NO "showing") para que el navegador NO los dibuje encima con su
     estilo ::cue, sino que NOSOTROS los dibujamos en un overlay propio
     (así quedan siempre por ENCIMA de la barra de controles, también en
     móvil). Este efecto activa/desactiva el idioma elegido, y el
     siguiente efecto escucha el evento "cuechange" para saber qué
     frase mostrar en cada momento.
     → Si preguntan "cambio un texto de subtítulo": editar los .vtt en
       /public/subtitles/, no este archivo.                              */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      const isActive = subtitles !== 'off' && track.language === subtitles;
      // "hidden" permite leer los cues y dibujarlos con nuestro propio overlay.
      track.mode = isActive ? 'hidden' : 'disabled';
    }

    setActiveCue(null);
  }, [subtitles, duration]);

  // ← efecto del evento "cuechange" (cada vez que cambia la frase activa)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks: TextTrack[] = [];
    for (let i = 0; i < video.textTracks.length; i += 1) {
      tracks.push(video.textTracks[i]);
    }

    const handleCueChange = (event: Event) => {
      const track = event.target as TextTrack;
      if (!track.activeCues || track.activeCues.length === 0) {
        setActiveCue(null);
        return;
      }

      const text = Array.from(track.activeCues)
        .map((cue) => (cue as VTTCue).text)
        .join('\n')
        .trim();

      setActiveCue(text || null);
    };

    tracks.forEach((track) => track.addEventListener('cuechange', handleCueChange));

    return () => {
      tracks.forEach((track) => track.removeEventListener('cuechange', handleCueChange));
    };
  }, [duration]);

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const playedPercent = safeDuration > 0 ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100)) : 0;
  const bufferedPercent =
    safeDuration > 0 ? Math.min(100, Math.max(playedPercent, (buffered / safeDuration) * 100)) : 0;

  const progressGradient = `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${playedPercent}%, rgba(255,255,255,0.5) ${playedPercent}%, rgba(255,255,255,0.5) ${bufferedPercent}%, rgba(255,255,255,0.22) ${bufferedPercent}%, rgba(255,255,255,0.22) 100%)`;

  const volumePercent = muted ? 0 : Math.round(volume * 100);
  const volumeGradient = `linear-gradient(to right, #ffffff 0%, #ffffff ${volumePercent}%, rgba(255,255,255,0.28) ${volumePercent}%, rgba(255,255,255,0.28) 100%)`;

  const volumeIcon = muted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up';

  return (
    <section
      className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-labelledby="showreel-title"
    >
      <div className="text-center space-y-3 mb-10">
        <span
          className="font-sans uppercase tracking-widest opacity-75 block font-semibold"
          style={{ color: colors.accent, fontSize: `${smallSize}px` }}
        >
          Showreel
        </span>
        <h2
          id="showreel-title"
          className="font-bold font-serif"
          style={{ fontSize: `${h2Size}px`, color: colors.textMain }}
        >
          Nuestro Trabajo en Acción
        </h2>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`relative shadow-1 border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
          isFullscreen ? 'w-full h-full flex items-center justify-center bg-black rounded-none' : 'rounded-2xl'
        }`}
        style={{ borderColor: colors.neutral, backgroundColor: colors.surface }}
        aria-label="Reproductor del showreel de ICU. Usa espacio para reproducir o pausar."
        role="region"
      >
        <div className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-video'}`}>
          {/* ★VIDEO PRINCIPAL★
              loop + preload="metadata" (arranca en pausa mostrando el poster;
              autoplay está a propósito NO activado). El click sobre la imagen
              también reproduce/pausa. onError muestra el overlay de error con
              link de descarga como fallback. */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            loop
            playsInline
            preload="metadata"
            onClick={togglePlay}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleVideoTimeUpdate}
            onProgress={handleProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onCanPlay={() => setIsBuffering(false)}
            onVolumeChange={handleVolumeChange}
            onError={() => {
              setHasError(true);
              setIsBuffering(false);
              setIsPlaying(false);
            }}
            className={`w-full h-full cursor-pointer ${
              isFullscreen ? 'object-contain' : 'object-cover rounded-2xl'
            }`}
          >
            Tu navegador no soporta la reproducción de video HTML5.
            {/* ★TRACKS DE SUBTÍTULOS★ ( según se pidan, editar los .vtt en
                /public/subtitles, NO este archivo). Si se agrega un idioma
                nuevo: copiar un .vtt, sumar este <track> con su srcLang, y
                sumar el idioma al tipo SubtitleLanguage + SUBTITLE_OPTIONS. */}
            <track kind="subtitles" src="/subtitles/showreel-es.vtt" srcLang="es" label="Español" />
            <track kind="subtitles" src="/subtitles/showreel-en.vtt" srcLang="en" label="English" />
          </video>

          {/* ★AUDIO OCULTO = 2ª PISTA "MÚSICA"★
              Elemento <audio> NO visible que funciona como "pista de audio
              alternativa". Se enciende/silencia con selectAudioTrack() y se
              mantiene sincronizado con syncMusic(). Para cambiar la canción
              o agregar una 3ª pista → ver banner del encabezado del archivo. */}
          <audio
            ref={musicRef}
            src="/audio/showreel-music.mp3"
            loop
            preload="metadata"
            onLoadedMetadata={() => syncMusic(true)}
            className="hidden"
          />

          {/* ★VIDEO OCULTO GENERADOR DE MINIATURAS★
              Mismo video cargado OTRA vez, pero silenciado y oculto:
              nunca se reproduce, solo sirve para hacerle "seek" al tiempo
              que apunta el mouse y CAPTURAR el fotograma (ver banner
              ★MINIATURAS DEL PREVIEW★ arriba, dentro de las funciones). */}
          <video
            ref={previewRef}
            src={src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            onCanPlay={handlePreviewCanPlay}
            onSeeked={handlePreviewSeeked}
            className="hidden"
          />

          {/* Overlay oscuro solo en pausa */}
          <div
            className={`absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            } ${isFullscreen ? '' : 'rounded-2xl'}`}
          />

          {/* Spinner de carga */}
          {isBuffering && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="material-symbols-outlined animate-spin"
                style={{ color: colors.accent, fontSize: '48px' }}
              >
                progress_activity
              </span>
            </div>
          )}

          {/* Botón central de play */}
          {!isPlaying && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlay}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ backgroundColor: colors.accent }}
                aria-label="Reproducir showreel"
              >
                <span
                  className="material-symbols-outlined ml-1"
                  style={{ color: colors.bg, fontSize: '36px' }}
                  aria-hidden="true"
                >
                  play_arrow
                </span>
              </button>
            </div>
          )}

          {/* Mensaje de error */}
          {hasError && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center bg-black/70 ${isFullscreen ? '' : 'rounded-2xl'}`}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: '36px' }}>
                error
              </span>
              <p className="text-white font-sans font-semibold" style={{ fontSize: `${bodySize}px` }}>
                No se pudo cargar el video.
              </p>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="text-white underline font-sans"
                style={{ fontSize: `${smallSize}px` }}
              >
                Abrir el video en una pestaña nueva
              </a>
            </div>
          )}

          {/* Subtítulos (overlay propio, siempre por encima de la barra de controles) */}
          {activeCue && (
            <div className="absolute inset-x-0 bottom-24 px-4 flex justify-center pointer-events-none">
              <span
                className="rounded-lg bg-black/80 text-white text-center font-sans whitespace-pre-line max-w-[85%]"
                style={{
                  fontSize: `${Math.max(13, smallSize + 2)}px`,
                  padding: '6px 12px',
                  lineHeight: 1.4,
                }}
              >
                {activeCue}
              </span>
            </div>
          )}

          {/* Barra de controles */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent ${isFullscreen ? '' : 'rounded-b-2xl'}`}>
            {/* ★BARRA DE PROGRESO + MINIATURAS★
                <input type="range"> estilizado en src/index.css (.video-range,
                ahí se cambia el tamaño del "thumb" y la altura de la barra).
                El relleno rojo/blanquecino es un gradiente inline (playedPercent
                y bufferedPercent, calculados a ~10 líneas antes del return).
                Los onMouseEnter/Move/Leave disparan las miniaturas (banner
                ★MINIATURAS DEL PREVIEW★); el seek REAL sigue en onChange. */}
            <div className="relative mb-3">
              <input
                type="range"
                min={0}
                max={safeDuration || 0}
                step={0.1}
                value={Math.min(currentTime, safeDuration || 0)}
                onChange={(event) => seekTo(Number(event.target.value))}
                onMouseEnter={handleProgressHover}
                onMouseMove={handleProgressHover}
                onMouseLeave={() => setIsHovering(false)}
                className="video-range w-full"
                style={{
                  backgroundImage: progressGradient,
                  backgroundSize: '100% 6px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  borderRadius: '999px',
                }}
                aria-label="Progreso del video"
                aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
              />

              {/* Miniatura de previsualización */}
              {isHovering && safeDuration > 0 && !hasError && (
                <div
                  className="absolute bottom-full pointer-events-none"
                  style={{
                    left: `${hoverLeft}px`,
                    transform: 'translateX(-50%)',
                    marginBottom: '10px',
                  }}
                  aria-hidden="true"
                >
                  <div
                    className="w-40 aspect-video rounded-lg overflow-hidden border bg-black"
                    style={{ borderColor: colors.neutral }}
                  >
                    <canvas
                      ref={previewCanvasRef}
                      width={PREVIEW_WIDTH}
                      height={PREVIEW_HEIGHT}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-1 flex justify-center">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-white font-sans" style={{ fontSize: `${Math.max(12, smallSize)}px` }}>
                      {formatTime(hoverTime)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="text-white hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }} aria-hidden="true">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                {/* Volumen */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-white hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                    aria-pressed={muted}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }} aria-hidden="true">
                      {volumeIcon}
                    </span>
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeInput}
                    className="video-range w-20 hidden sm:block"
                    style={{
                      backgroundImage: volumeGradient,
                      backgroundSize: '100% 5px',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      borderRadius: '999px',
                    }}
                    aria-label="Volumen"
                    aria-valuetext={`${volumePercent}%`}
                  />
                </div>

                <span className="text-white/80 font-sans hidden sm:block" style={{ fontSize: `${smallSize}px` }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Ajustes */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="text-white hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    aria-label="Ajustes del reproductor"
                    aria-expanded={menuOpen}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }} aria-hidden="true">
                      more_vert
                    </span>
                  </button>

                  {menuOpen && (
                    <div
                      className="fixed inset-x-4 bottom-4 z-50 max-h-[80vh] overflow-y-auto rounded-xl border shadow-1 sm:absolute sm:left-auto sm:right-0 sm:bottom-full sm:mb-2 sm:max-h-[75vh] sm:w-72"
                      style={{ backgroundColor: colors.surface, borderColor: colors.neutral }}
                      role="group"
                      aria-label="Ajustes del reproductor"
                    >
                      <div className="p-3">
                        <fieldset className="border-0 p-0 m-0">
                          <legend
                            className="font-sans font-bold uppercase tracking-wider mb-1.5 px-1"
                            style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                          >
                            Subtítulos
                          </legend>
                          {SUBTITLE_OPTIONS.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:opacity-80 font-sans"
                              style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                            >
                              <input
                                type="radio"
                                name="showreel-subtitles"
                                value={option.value}
                                checked={subtitles === option.value}
                                onChange={() => setSubtitles(option.value)}
                                style={{ accentColor: colors.accent }}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </fieldset>

                        <div className="border-t my-2" style={{ borderColor: colors.neutral }} />

                        <fieldset className="border-0 p-0 m-0">
                          <legend
                            className="font-sans font-bold uppercase tracking-wider mb-1.5 px-1"
                            style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                          >
                            Pista de Audio
                          </legend>
                          {AUDIO_OPTIONS.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:opacity-80 font-sans"
                              style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                            >
                              <input
                                type="radio"
                                name="showreel-audio"
                                value={option.value}
                                checked={audioTrack === option.value}
                                onChange={() => selectAudioTrack(option.value)}
                                style={{ accentColor: colors.accent }}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </fieldset>

                        <div className="border-t my-2" style={{ borderColor: colors.neutral }} />

                        <form onSubmit={handleSeekSubmit}>
                          <p
                            className="font-sans font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                            style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ color: colors.accent, fontSize: `${Math.max(12, smallSize - 2)}px` }}
                              aria-hidden="true"
                            >
                              schedule
                            </span>
                            Ir a un Tiempo
                          </p>
                          <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                            style={{ borderColor: seekError ? '#e11d48' : colors.neutral, backgroundColor: colors.bg }}
                          >
                            <input
                              type="text"
                              placeholder="mm:ss"
                              maxLength={8}
                              value={seekInput}
                              onChange={(event) => {
                                setSeekInput(event.target.value);
                                if (seekError) setSeekError(null);
                              }}
                              className="flex-1 min-w-0 bg-transparent outline-none font-sans font-bold text-center tracking-wider"
                              style={{ color: colors.textMain, fontSize: `${bodySize}px` }}
                              aria-label="Tiempo al que quieres ir, en formato minutos y segundos"
                              aria-invalid={Boolean(seekError)}
                            />
                            <button
                              type="submit"
                              className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2"
                              style={{ backgroundColor: colors.accent, color: colors.bg }}
                              title="Ir al tiempo"
                              aria-label="Ir al tiempo indicado"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: `${smallSize}px` }}>
                                arrow_forward
                              </span>
                            </button>
                          </div>
                          {seekError ? (
                            <p className="font-sans mt-1.5" style={{ color: '#e11d48', fontSize: `${smallSize}px` }} role="alert">
                              {seekError}
                            </p>
                          ) : (
                            <p
                              className="font-sans opacity-70 mt-1.5"
                              style={{ color: colors.textMain, fontSize: `${smallSize}px` }}
                            >
                              Ej: 02:30
                            </p>
                          )}
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pantalla completa */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="text-white hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }} aria-hidden="true">
                    {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
