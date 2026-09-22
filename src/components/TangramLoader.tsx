import React, { useEffect, useRef, useState } from 'react';

export interface TangramLoaderProps {
  /** If true, renders full screen with blurred or solid background overlay */
  fullscreen?: boolean;
  /** Size in pixels for canvas width/height (default: 340) */
  size?: number;
  /** Custom text to display instead of 'Cargando' */
  label?: string;
  /** Whether to show the figure name (Conejo, Gato, Espada) */
  showFigureName?: boolean;
  /** Whether to show the bottom gradient progress bar */
  showProgressBar?: boolean;
  /** Duration in milliseconds that each static figure stays on screen (default: 1300ms) */
  displayDuration?: number;
  /** Duration in milliseconds for the disassembly/reassembly transition (default: 900ms) */
  transitionDuration?: number;
  /** Auto-close timeout in seconds or milliseconds. If provided, closes automatically after this time. */
  timeout?: number;
  /** Optional callback to close or cancel if displayed as dismissable overlay */
  onClose?: () => void;
}

interface TangramPiece {
  points: [number, number][];
  fill: string;
}

interface TangramFigure {
  name: string;
  scaleFactor?: number;
  pieces: TangramPiece[];
  byColor?: Record<string, { points: [number, number][]; cx: number; cy: number }>;
}

const RAW_FIGURES: TangramFigure[] = [
  {
    name: 'Conejo',
    pieces: [
      { points: [[0, 498], [0, 739], [240, 739]], fill: '#00C2C2' },
      { points: [[170, 328], [0, 498], [170, 668]], fill: '#FF6F61' },
      { points: [[170, 60], [60, 178], [170, 270]], fill: '#8E44AD' },
      { points: [[170, 270], [313, 178], [339, 60], [220, 151]], fill: '#FF8C00' },
      { points: [[170, 270], [290, 270], [290, 390], [170, 390]], fill: '#FFE600' },
      { points: [[170, 390], [255, 474], [170, 562]], fill: '#7CFC00' },
      { points: [[170, 562], [255, 644], [255, 474]], fill: '#2E9BFF' }
    ]
  },
  {
    name: 'Gato',
    pieces: [
      { points: [[210, 125], [125, 210], [125, 40]], fill: '#7CFC00' },
      { points: [[210, 125], [295, 210], [295, 40]], fill: '#2E9BFF' },
      { points: [[210, 125], [295, 210], [210, 295], [125, 210]], fill: '#FFE600' },
      { points: [[210, 295], [295, 210], [380, 210], [295, 295]], fill: '#FF8C00' },
      { points: [[380, 210], [380, 380], [295, 295]], fill: '#8E44AD' },
      { points: [[336, 607], [506, 367], [506, 607]], fill: '#FF6F61' },
      { points: [[380, 210], [506, 367], [380, 545]], fill: '#00C2C2' }
    ]
  },
  {
    name: 'Espada',
    scaleFactor: 0.81,
    pieces: [
      { points: [[100, 80], [340, 80], [100, 320]], fill: '#FF6F61' },
      { points: [[340, 80], [250, 170], [340, 170]], fill: '#8E44AD' },
      { points: [[190, 320], [340, 170], [340, 320]], fill: '#7CFC00' },
      { points: [[340, 320], [490, 320], [340, 170]], fill: '#00C2C2' },
      { points: [[250, 170], [100, 320], [190, 320], [340, 170]], fill: '#FF8C00' },
      { points: [[190, 320], [340, 320], [340, 470]], fill: '#2E9BFF' },
      { points: [[340, 320], [490, 320], [490, 470], [340, 470]], fill: '#FFE600' }
    ]
  }
];

const PIECE_COLORS = [
  '#00C2C2', '#FF6F61', '#8E44AD', '#FF8C00',
  '#FFE600', '#7CFC00', '#2E9BFF'
];

// Precompute normalized pieces
const FIGURES = RAW_FIGURES.map(fig => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  fig.pieces.forEach(p => {
    p.points.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
  });
  const bboxW = maxX - minX;
  const bboxH = maxY - minY;
  const fitSize = 300;
  const scale = Math.min(fitSize / bboxW, fitSize / bboxH) * (fig.scaleFactor || 1);
  const offX = -(minX + bboxW / 2);
  const offY = -(minY + bboxH / 2);

  const byColor: Record<string, { points: [number, number][]; cx: number; cy: number }> = {};
  fig.pieces.forEach(piece => {
    const np: [number, number][] = piece.points.map(([x, y]) => [
      (x + offX) * scale,
      (y + offY) * scale
    ]);
    let cx = 0, cy = 0;
    np.forEach(([x, y]) => { cx += x; cy += y; });
    cx /= np.length;
    cy /= np.length;

    byColor[piece.fill] = { points: np, cx, cy };
  });

  return {
    ...fig,
    byColor
  };
});

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function scatterCurve(t: number) {
  return Math.sin(Math.PI * t);
}

const PIECE_PARAMS = PIECE_COLORS.map((_, i) => ({
  rotDir: (i % 2 === 0) ? 1 : -1,
  rotAmount: Math.PI * (0.4 + (i * 0.18)),
  scatterScale: 90 + (i * 12),
  delay: i * 0.025
}));

export const TangramLoader: React.FC<TangramLoaderProps> = ({
  fullscreen = false,
  size = 320,
  label = 'Cargando',
  showFigureName = true,
  showProgressBar = true,
  displayDuration = 1400,
  transitionDuration = 1000,
  timeout,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFigName, setCurrentFigName] = useState<string>(FIGURES[0].name);
  const [nameOpacity, setNameOpacity] = useState<number>(1);
  const [progressWidth, setProgressWidth] = useState<number>(0);

  // Auto-close timeout effect if provided
  useEffect(() => {
    if (!timeout || timeout <= 0 || !onClose) return;
    const ms = timeout < 100 ? timeout * 1000 : timeout; // support seconds or ms
    const timer = setTimeout(() => {
      onClose();
    }, ms);
    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let currentIndex = 0;
    let phase: 'display' | 'transition' = 'display';
    let phaseStart = performance.now();
    let started = false;

    const DISPLAY_DURATION = displayDuration;
    const TRANSITION_DURATION = transitionDuration;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;

    const drawPoly = (points: [number, number][], fill: string) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
    };

    const drawStaticFigure = (fig: typeof FIGURES[0]) => {
      ctx.save();
      ctx.translate(CX, CY);
      PIECE_COLORS.forEach(color => {
        const p = fig.byColor?.[color];
        if (p) drawPoly(p.points, color);
      });
      ctx.restore();
    };

    const drawDisassembleReassemble = (
      fromFig: typeof FIGURES[0],
      toFig: typeof FIGURES[0],
      rawT: number
    ) => {
      ctx.save();
      ctx.translate(CX, CY);

      PIECE_COLORS.forEach((color, i) => {
        const from = fromFig.byColor?.[color];
        const to = toFig.byColor?.[color];
        if (!from || !to) return;

        const params = PIECE_PARAMS[i];
        const staggeredT = Math.max(0, Math.min(1, (rawT - params.delay) / (1 - params.delay)));
        const et = easeInOutCubic(staggeredT);
        const st = scatterCurve(staggeredT);

        const avgCx = from.cx * (1 - et) + to.cx * et;
        const avgCy = from.cy * (1 - et) + to.cy * et;
        const dist = Math.sqrt(avgCx * avgCx + avgCy * avgCy) || 1;
        const dirX = avgCx / dist;
        const dirY = avgCy / dist;
        const sx = dirX * st * params.scatterScale;
        const sy = dirY * st * params.scatterScale;

        const interp: [number, number][] = from.points.map((fp, j) => [
          fp[0] * (1 - et) + to.points[j][0] * et + sx,
          fp[1] * (1 - et) + to.points[j][1] * et + sy
        ]);

        let pcx = 0, pcy = 0;
        interp.forEach(([x, y]) => { pcx += x; pcy += y; });
        pcx /= interp.length;
        pcy /= interp.length;

        const rotation = st * params.rotAmount * params.rotDir;

        ctx.save();
        ctx.translate(pcx, pcy);
        ctx.rotate(rotation);
        ctx.translate(-pcx, -pcy);
        drawPoly(interp, color);
        ctx.restore();
      });

      ctx.restore();
    };

    const loop = () => {
      const now = performance.now();
      if (!started) {
        started = true;
        phaseStart = now;
      }

      const elapsed = now - phaseStart;
      ctx.clearRect(0, 0, W, H);

      const totalPhases = FIGURES.length * 2;

      if (phase === 'display') {
        const progress = Math.min(elapsed / DISPLAY_DURATION, 1);
        drawStaticFigure(FIGURES[currentIndex]);

        const cp = currentIndex * 2;
        setProgressWidth(((cp + progress) / totalPhases) * 100);
        setCurrentFigName(FIGURES[currentIndex].name);
        setNameOpacity(1);

        if (elapsed >= DISPLAY_DURATION) {
          phase = 'transition';
          phaseStart = now;
        }
      } else {
        const t = Math.min(elapsed / TRANSITION_DURATION, 1);
        const nextIndex = (currentIndex + 1) % FIGURES.length;

        drawDisassembleReassemble(FIGURES[currentIndex], FIGURES[nextIndex], t);

        const cp = currentIndex * 2 + 1;
        setProgressWidth(((cp + t) / totalPhases) * 100);

        const op = t < 0.4 ? 1 - t / 0.4 : (t > 0.6 ? (t - 0.6) / 0.4 : 0);
        setNameOpacity(op);
        if (t > 0.5) {
          setCurrentFigName(FIGURES[nextIndex].name);
        }

        if (t >= 1) {
          currentIndex = nextIndex;
          phase = 'display';
          phaseStart = now;
          if (currentIndex === 0) {
            setProgressWidth(0);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [displayDuration, transitionDuration]);

  const content = (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div className="relative flex flex-col items-center">
        {/* Canvas for Tangram */}
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          style={{ width: `${size}px`, height: `${size}px` }}
          className="block drop-shadow-sm max-w-full"
        />

        {/* Figure Name and Steps indicator */}
        {showFigureName && (
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <div
              className="text-[13px] font-semibold tracking-[3px] uppercase text-[#555] h-6 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: nameOpacity }}
            >
              {currentFigName}
            </div>

            {/* Step circles for the 3 Tangrams: Conejo (1), Gato (2), Espada (3) */}
            <div className="flex items-center gap-2">
              {FIGURES.map((fig, idx) => {
                const isActive = fig.name === currentFigName;
                return (
                  <div
                    key={fig.name}
                    title={`Tangram ${idx + 1}: ${fig.name}`}
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-6 h-2 bg-[#5d172d] shadow-sm'
                        : 'w-2 h-2 bg-[#d1c7bd]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Loading Label with pulsing dots */}
        <div className="mt-3.5 text-xs uppercase tracking-[4px] font-light text-[#777] flex items-center gap-1.5">
          <span>{label}</span>
          <span className="flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-pulse" style={{ animationDuration: '1.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-pulse [animation-delay:200ms]" style={{ animationDuration: '1.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-pulse [animation-delay:400ms]" style={{ animationDuration: '1.2s' }} />
          </span>
        </div>

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="mt-4 w-32 h-[3px] bg-[#f0ede6] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-75 ease-linear"
              style={{
                width: `${progressWidth}%`,
                background: 'linear-gradient(90deg, #00C2C2, #8E44AD, #FF6F61)'
              }}
            />
          </div>
        )}

        {/* Optional dismiss button */}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="mt-6 text-xs text-[#888] hover:text-[#222] transition-colors underline decoration-dotted"
          >
            Cerrar vista
          </button>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all duration-300 animate-fadeIn">
        {content}
      </div>
    );
  }

  return content;
};
