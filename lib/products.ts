export const productPages = {
  "kitty-ai": {
    name: "KITTY AI", label: "PERSONAL ARTIFICIAL INTELLIGENCE", status: "IN ACTIVE DEVELOPMENT", category: "AI", media: "Application screenshots & voice demos",
    description: "Personal AI built around memory, voice, privacy and user control.",
    intro: "We want an assistant that can keep context without taking control away from you. Memory that you can understand. Voice that feels natural. Privacy that is considered from the start.",
    principles: [
      ["Memory you can manage", "We’re exploring how an assistant can remember useful context, while letting you review, change and remove it."],
      ["A more natural conversation", "Continuous voice interaction is part of the direction. We want talking to an assistant to feel less like operating a form."],
      ["Your context, your choice", "We’re considering local processing and explicit user controls. These are design goals, not promises about an unreleased product."],
    ],
  },
  sentinel: {
    name: "KITTY Sentinel", label: "ROBOTICS & COMPUTER VISION", status: "PROTOTYPE V1", category: "Robotics", media: "Prototype photographs & test footage",
    description: "An experimental autonomous robotics and computer-vision platform built to understand and interact with the physical world.",
    intro: "Sentinel is our workbench for systems that see, move and respond. It’s an early prototype, with a lot of testing ahead. We’ll share what works and what needs another attempt.",
    principles: [
      ["Understanding a scene", "Computer vision is one part of the experiment: how a system notices objects, distances and changes around it."],
      ["Useful autonomy", "We’re interested in small, bounded tasks before broad claims. Predictable behavior matters more than an impressive demo."],
      ["Learning in the physical world", "Real tests have constraints that software alone doesn’t reveal. Our build log will make room for those lessons."],
    ],
  },
  "lisa-ai": {
    name: "LISA AI", label: "INTERACTIVE AI", status: "UPCOMING · EARLY EXPLORATION", category: "AI", media: "On-screen interaction demos",
    description: "An on-screen interactive anime AI. A more expressive way to spend time with personal software.",
    intro: "LISA is an exploration of character, presence and interaction on your screen. We’re figuring out how an AI companion could feel expressive while keeping the person using it in control.",
    principles: [
      ["A visible presence", "An interactive anime character is the starting point. We’ll test how visual responses can complement conversation."],
      ["Interaction with intention", "We want the experience to feel responsive without becoming distracting. How much presence is useful is part of the experiment."],
      ["An honest beginning", "There isn’t a public demo or release date yet. We’ll share the work when there’s something meaningful to try."],
    ],
  },
} as const;
