import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  AppButton,
  CelebrationHearts,
  Confetti,
  HeartIcon,
  ProgressDots,
  TopBar,
} from "./components/Ui";
import { proposalConfig as config } from "./config";

type ScreenState =
  | { id: "welcome" }
  | { id: "introduction" }
  | { id: "message"; index: number }
  | { id: "proposal" }
  | { id: "confirm-no" }
  | { id: "accepted" }
  | { id: "maybe" }
  | { id: "declined" };

const initialScreen: ScreenState = { id: "welcome" };

function getHistoryScreen(value: unknown): ScreenState | null {
  if (!value || typeof value !== "object" || !("proposalScreen" in value)) return null;

  const screen = (value as { proposalScreen?: ScreenState }).proposalScreen;
  if (!screen || typeof screen.id !== "string") return null;

  if (screen.id === "message") {
    return Number.isInteger(screen.index) &&
      screen.index >= 0 &&
      screen.index < config.messages.length
      ? screen
      : null;
  }

  const validIds: ScreenState["id"][] = [
    "welcome",
    "introduction",
    "proposal",
    "confirm-no",
    "accepted",
    "maybe",
    "declined",
  ];
  return validIds.includes(screen.id) ? screen : null;
}

function screenKey(screen: ScreenState) {
  return screen.id === "message" ? `${screen.id}-${screen.index}` : screen.id;
}

function fillRecipient(
  personalizedText: string,
  genericText: string,
  recipientName: string,
) {
  return recipientName
    ? personalizedText.replace(/{recipient}/g, recipientName)
    : genericText;
}

function App() {
  const [screen, setScreen] = useState<ScreenState>(initialScreen);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recipientName = config.recipientName.trim();
  const welcomeGreeting = fillRecipient(
    config.welcome.greetingForRecipient,
    config.welcome.greeting,
    recipientName,
  );
  const acceptedSubtitle = fillRecipient(
    config.accepted.subtitleForRecipient,
    config.accepted.subtitle,
    recipientName,
  );

  const themeStyle = useMemo(
    () =>
      ({
        "--accent": config.theme.accent,
        "--accent-dark": config.theme.accentDark,
        "--ink": config.theme.ink,
        "--muted": config.theme.muted,
        "--surface": config.theme.surface,
        "--blush": config.theme.blush,
        "--gold": config.theme.gold,
        "--background-image": "url('./images/romantic-bg.jpg')",
      }) as CSSProperties,
    [],
  );

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, proposalScreen: initialScreen },
      "",
    );

    const handlePopState = (event: PopStateEvent) => {
      const previousScreen = getHistoryScreen(event.state);
      if (previousScreen) {
        setDirection("back");
        setScreen(previousScreen);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((nextScreen: ScreenState) => {
    setDirection("forward");
    setScreen(nextScreen);
    window.history.pushState(
      { ...window.history.state, proposalScreen: nextScreen },
      "",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    if (screen.id !== "welcome") window.history.back();
  }, [screen.id]);

  const restart = useCallback(() => {
    navigate({ id: "welcome" });
  }, [navigate]);

  const acceptProposal = useCallback(() => {
    navigator.vibrate?.([35, 45, 80]);
    navigate({ id: "accepted" });
  }, [navigate]);

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch {
        setIsMusicPlaying(false);
      }
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }, []);

  const renderScreen = () => {
    switch (screen.id) {
      case "welcome":
        return (
          <main className="screen welcome-screen">
            <div className="welcome-copy">
              <p className="eyebrow">A little something from</p>
              <div className="brand-lockup" aria-label={`From ${config.creatorName}`}>
                <HeartIcon className="brand-heart" />
                <h1>{config.creatorName}</h1>
              </div>
              <div className="welcome-message">
                <h2>
                  <span>{welcomeGreeting}</span>
                  {config.welcome.heading}
                </h2>
                <p>{config.welcome.supportingText}</p>
              </div>
              <AppButton
                className="welcome-cta"
                trailingArrow
                onClick={() => navigate({ id: "introduction" })}
              >
                Start
              </AppButton>
            </div>
          </main>
        );

      case "introduction":
        return (
          <main className="screen centered-screen">
            <div className="intro-content">
              <div className="soft-heart-mark">
                <HeartIcon />
              </div>
              <p className="eyebrow">{config.introduction.eyebrow}</p>
              <h1 className="screen-title">{config.introduction.heading}</h1>
              <p className="screen-support">{config.introduction.supportingText}</p>
              <AppButton
                className="content-cta"
                trailingArrow
                onClick={() => navigate({ id: "message", index: 0 })}
              >
                Continue
              </AppButton>
            </div>
          </main>
        );

      case "message": {
        const message = config.messages[screen.index];
        const isLast = screen.index === config.messages.length - 1;
        const messageButtonText =
          "buttonText" in message && message.buttonText
            ? message.buttonText
            : isLast
              ? "I'm ready"
              : "Next";

        return (
          <main className="screen message-screen">
            <div className="message-wrap">
              <ProgressDots current={screen.index} total={config.messages.length} />
              <p className="message-count">
                {String(screen.index + 1).padStart(2, "0")} /{" "}
                {String(config.messages.length).padStart(2, "0")}
              </p>
              <section className="message-letter" aria-live="polite">
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <p className="eyebrow">{message.label}</p>
                <h1>{message.text}</h1>
                <div className="letter-signature">
                  <span />
                  <p>just being honest</p>
                </div>
                <AppButton
                  className="letter-button"
                  trailingArrow
                  onClick={() =>
                    navigate(
                      isLast
                        ? { id: "proposal" }
                        : { id: "message", index: screen.index + 1 },
                    )
                  }
                >
                  {messageButtonText}
                </AppButton>
              </section>
            </div>
          </main>
        );
      }

      case "proposal":
      case "confirm-no":
        return (
          <main className="screen proposal-screen">
            <div className="proposal-content">
              <p className="eyebrow">{config.proposal.eyebrow}</p>
              <p className="proposal-lead">{config.proposal.lead}</p>
              <HeartIcon className="proposal-heart" />
              <h1>{config.proposalQuestion}</h1>
              <div className="proposal-actions">
                <AppButton onClick={acceptProposal}>Yes ❤️</AppButton>
                <AppButton
                  variant="secondary"
                  onClick={() => navigate({ id: "confirm-no" })}
                >
                  No 💔
                </AppButton>
              </div>
              <p className="choice-note">{config.proposal.choiceNote}</p>
            </div>

            {screen.id === "confirm-no" && (
              <div className="sheet-layer" role="presentation">
                <button
                  className="sheet-scrim"
                  type="button"
                  aria-label="Close confirmation"
                  onClick={goBack}
                />
                <section
                  className="choice-sheet"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="choice-title"
                >
                  <div className="sheet-handle" />
                  <p className="eyebrow">{config.noConfirmation.eyebrow}</p>
                  <h2 id="choice-title">{config.noConfirmation.title}</h2>
                  <p>{config.noConfirmation.body}</p>
                  <div className="sheet-actions">
                    <AppButton onClick={acceptProposal}>
                      {config.noConfirmation.yesLabel}
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      onClick={() => navigate({ id: "maybe" })}
                    >
                      {config.noConfirmation.maybeLabel}
                    </AppButton>
                    <AppButton
                      variant="quiet"
                      onClick={() => navigate({ id: "declined" })}
                    >
                      {config.noConfirmation.noLabel}
                    </AppButton>
                  </div>
                </section>
              </div>
            )}
          </main>
        );

      case "accepted":
        return (
          <main className="screen response-screen accepted-screen">
            <Confetti />
            <CelebrationHearts />
            <div className="response-content celebration-content">
              <div className="celebration-mark-wrap">
                <span className="celebration-ring celebration-ring--one" />
                <span className="celebration-ring celebration-ring--two" />
                <div className="celebration-mark">
                  <HeartIcon />
                </div>
              </div>
              <p className="eyebrow">{config.accepted.eyebrow}</p>
              <h1>{config.accepted.title}</h1>
              <h2>{acceptedSubtitle}</h2>
              <p>{config.finalMessage} ❤️</p>
              <div className="signature">
                {config.accepted.signature} {config.creatorName}
              </div>
              <AppButton className="response-button" variant="secondary" onClick={restart}>
                {config.accepted.actionLabel}
              </AppButton>
            </div>
          </main>
        );

      case "maybe":
        return (
          <main className="screen response-screen">
            <div className="response-content gentle-response">
              <div className="soft-heart-mark">
                <HeartIcon />
              </div>
              <p className="eyebrow">{config.maybe.eyebrow}</p>
              <h1>{config.maybe.title}</h1>
              <p>{config.maybeMessage}</p>
              <AppButton
                className="response-button"
                onClick={() => navigate({ id: "proposal" })}
              >
                {config.maybe.actionLabel}
              </AppButton>
              <AppButton variant="quiet" onClick={restart}>
                {config.maybe.restartLabel}
              </AppButton>
            </div>
          </main>
        );

      case "declined":
        return (
          <main className="screen response-screen">
            <div className="response-content gentle-response">
              <div className="respect-mark" aria-hidden="true">
                <span />
              </div>
              <p className="eyebrow">{config.declined.eyebrow}</p>
              <h1>{config.declined.title}</h1>
              <p>{config.noMessage}</p>
              <div className="signature">
                {config.declined.signature} {config.creatorName}
              </div>
              <AppButton className="response-button" variant="secondary" onClick={restart}>
                {config.declined.restartLabel}
              </AppButton>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="app-shell" style={themeStyle}>
      <div className="background-image" aria-hidden="true" />
      <div className="background-wash" aria-hidden="true" />
      {config.music.source && (
        <audio ref={audioRef} src={config.music.source} loop preload="none" />
      )}
      <TopBar
        canGoBack={screen.id !== "welcome" && screen.id !== "accepted"}
        onBack={goBack}
        showAudio={Boolean(config.music.source)}
        isPlaying={isMusicPlaying}
        onAudioToggle={toggleMusic}
      />
      <div
        key={screenKey(screen)}
        className={`screen-transition screen-transition--${direction}`}
      >
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
