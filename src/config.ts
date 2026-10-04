// Personalize the entire experience from this one file.
export const proposalConfig = {
  creatorName: "RICK",
  // Put her name inside the quotes. Leave empty for the natural wording.
  recipientName: "",
  proposalQuestion: "Will you be mine?",
  welcome: {
    greeting: "Hey...",
    greetingForRecipient: "Hey, {recipient},",
    heading: "I made something for you.",
    supportingText:
      "Not a quote I found online. Just something I've genuinely wanted to say.",
  },
  introduction: {
    eyebrow: "Before anything else",
    heading: "A normal text felt too small for this.",
    supportingText:
      "So I made something small, private, and just dramatic enough to keep you curious.",
  },
  messages: [
    {
      label: "Why this exists",
      text: "I almost sent this like a normal message. Then I realized some things deserve better timing, a little drama, and their own app.",
      buttonText: "Okay",
    },
    {
      label: "The small thing",
      text: "You make ordinary check-ins feel important. Somehow, seeing your name come up can rearrange my whole mood.",
      buttonText: "Tell me more",
    },
    {
      label: "What I like",
      text: "It's the way you notice details, remember little things, and make people feel comfortable being completely themselves.",
      buttonText: "Keep going",
    },
    {
      label: "A tiny confession",
      text: "Sometimes I see something and think, “Wait... you need to know about this first.” It's become a habit I don't plan to break.",
      buttonText: "And?",
    },
    {
      label: "The honest part",
      text: "Somewhere between our random conversations and comfortable silences, you stopped being just someone I talk to.",
      buttonText: "Go on",
    },
    {
      label: "No more pretending",
      text: "I tried to play it cool. But honestly, I keep hoping you mean the same kind of special to me that you already are.",
      buttonText: "Wait...",
    },
    {
      label: "End of suspense",
      text: "So yes, this app was a little dramatic. But the next screen is completely serious.",
      buttonText: "I'm ready",
    },
  ],
  proposal: {
    eyebrow: "Okay... enough suspense.",
    lead: "There's something I've really wanted to ask you.",
    choiceNote: "No clever tricks. Choose only what feels true.",
  },
  noConfirmation: {
    eyebrow: "One tiny check",
    title: "Are you sure? 🥺",
    body: "My dramatic little heart needs one more chance — but it will respect whatever you choose.",
    yesLabel: "Yes ❤️",
    maybeLabel: "Maybe 😶",
    noLabel: "No 💔",
  },
  accepted: {
    eyebrow: "Best answer ever",
    title: "YEEEEES! ❤️🥹",
    subtitle: "That yes is going to stay with me for a long time.",
    subtitleForRecipient:
      "That yes is going to stay with me for a long time, {recipient}.",
    signature: "With a very happy heart,",
    actionLabel: "Replay our little story",
  },
  maybe: {
    eyebrow: "No rush",
    title: "Maybe is an honest answer.",
    actionLabel: "Back to the question",
    restartLabel: "Start over",
  },
  declined: {
    eyebrow: "Always with respect",
    title: "Thank you for being honest.",
    signature: "Take care,",
    restartLabel: "Start over",
  },
  finalMessage:
    "I've been smiling since I started making this for you. Thank you for giving me the chance to turn ordinary days into memories that feel like ours.",
  maybeMessage:
    "Take all the time you need. There's no timer, no pressure, and nothing you owe me in return.",
  noMessage:
    "That's okay. I meant every kind word, and I'm glad I found the courage to be honest with you.",
  music: {
    // Add a local file to public/audio, then set this to "./audio/your-song.mp3".
    source: "",
    title: "Our song",
  },
  theme: {
    accent: "#7b2f45",
    accentDark: "#5d2033",
    ink: "#2f2528",
    muted: "#74666a",
    surface: "#fffaf5",
    blush: "#ead7d8",
    gold: "#b68a55",
  },
} as const;

export type ProposalConfig = typeof proposalConfig;