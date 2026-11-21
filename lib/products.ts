export const productPages = {
  "kitty-ai": {
    name: "KITTY AI", label: "EMBEDDED INTELLIGENCE", status: "IN ACTIVE DEVELOPMENT", category: "ROBOTICS", media: "Perception and control demonstrations",
    description: "A vision-and-control software stack connecting spatial perception, edge inference and robotic actuator control.",
    intro: "KITTY AI is being developed as the intelligence layer for physical systems, connecting perception, context and control. It is an active development effort, not a released consumer companion app.",
    principles: [
      ["Spatial perception", "Developing perception components that interpret sensor inputs and surroundings for embodied systems."],
      ["Edge intelligence", "Exploring on-device inference and context-aware decision support for physical environments."],
      ["Control interfaces", "Connecting software decisions with real-time robotic actuator control. These capabilities remain under development."],
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
