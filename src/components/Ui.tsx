import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";
import { cn } from "../utils/cn";

type IconProps = {
  className?: string;
};

export function HeartIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21.2a1 1 0 0 1-.63-.22C4.74 15.58 2 12.72 2 8.75A5.75 5.75 0 0 1 7.82 3 6.2 6.2 0 0 1 12 4.7 6.2 6.2 0 0 1 16.18 3 5.75 5.75 0 0 1 22 8.75c0 3.97-2.74 6.83-9.37 12.23a1 1 0 0 1-.63.22Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function VolumeIcon({ className, muted }: IconProps & { muted: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {muted ? (
        <path d="m17 9 4 4m0-4-4 4" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  trailingArrow?: boolean;
  children: ReactNode;
};

export function AppButton({
  variant = "primary",
  trailingArrow = false,
  className,
  children,
  onClick,
  ...props
}: AppButtonProps) {
  return (
    <button
      className={cn("app-button pressable", `app-button--${variant}`, className)}
      onClick={(event) => {
        navigator.vibrate?.(10);
        onClick?.(event);
      }}
      {...props}
    >
      <span>{children}</span>
      {trailingArrow && <ArrowRightIcon className="button-arrow" />}
    </button>
  );
}

type TopBarProps = {
  canGoBack: boolean;
  onBack: () => void;
  showAudio: boolean;
  isPlaying: boolean;
  onAudioToggle: () => void;
};

export function TopBar({
  canGoBack,
  onBack,
  showAudio,
  isPlaying,
  onAudioToggle,
}: TopBarProps) {
  if (!canGoBack && !showAudio) return null;

  return (
    <header className="top-bar">
      <div>
        {canGoBack && (
          <button
            className="icon-button pressable"
            type="button"
            aria-label="Go back"
            onClick={() => {
              navigator.vibrate?.(8);
              onBack();
            }}
          >
            <ArrowLeftIcon className="toolbar-icon" />
          </button>
        )}
      </div>
      {showAudio && (
        <button
          className="icon-button pressable"
          type="button"
          aria-label={isPlaying ? "Mute background music" : "Play background music"}
          aria-pressed={isPlaying}
          onClick={onAudioToggle}
        >
          <VolumeIcon className="toolbar-icon" muted={!isPlaying} />
        </button>
      )}
    </header>
  );
}

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="progress-dots"
      role="progressbar"
      aria-label="Message progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          className={cn(
            "progress-dot",
            index === current && "is-current",
            index < current && "is-done",
          )}
          key={index}
        />
      ))}
    </div>
  );
}

const confettiColors = ["#7b2f45", "#b68a55", "#d9aeb2", "#f6eee6"];

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => {
        const style = {
          "--x": `${(index * 37 + 7) % 100}vw`,
          "--delay": `${(index % 10) * 0.12}s`,
          "--duration": `${3.1 + (index % 5) * 0.38}s`,
          "--drift": `${((index * 19) % 90) - 45}px`,
          "--spin": `${180 + (index % 6) * 110}deg`,
          "--confetti-color": confettiColors[index % confettiColors.length],
        } as CSSProperties;

        return <i key={index} style={style} />;
      })}
    </div>
  );
}

export function CelebrationHearts() {
  return (
    <div className="celebration-hearts" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <HeartIcon key={index} className={`floating-heart floating-heart--${index + 1}`} />
      ))}
    </div>
  );
}