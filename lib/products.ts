export const productPages = {
  "agriyaan": {
    name: "KITTY AgriYaan",
    label: "AGRICULTURAL ROBOTICS & AUTONOMY",
    status: "IN ACTIVE DEVELOPMENT",
    category: "Robotics",
    media: "Field simulation & kinematics test rigs",
    description: "Autonomous agricultural rover platform engineered to navigate harsh terrain, reduce soil compaction, and perform real-time crop inspection.",
    intro: "AgriYaan bridges low-power edge computer vision with autonomous ground mobility to support precision farming across diverse Indian topographies.",
    principles: [
      ["Terrain-adaptive kinematics", "Engineered to traverse unpaved soil, mud, and dense crop canopies without excessive soil compaction."],
      ["Multi-spectral crop telemetry", "Edge inference monitors crop health, hydration, and pest stress directly in the field."],
      ["Autonomous field operations", "Designed for independent waypoint navigation and repeatable field inspection rounds."]
    ]
  },
  "urjayaan": {
    name: "KITTY UrjaYaan",
    label: "CLEAN ENERGY & SOLAR OPTIMIZATION",
    status: "IN ACTIVE DEVELOPMENT",
    category: "Engineering",
    media: "Photovoltaic telemetry & microgrid models",
    description: "Predictive telemetry software and machine learning models to monitor solar photovoltaic degradation and balance clean energy microgrids.",
    intro: "UrjaYaan develops intelligent algorithmic models to forecast solar inverter degradation and optimize decentralized clean energy storage.",
    principles: [
      ["Predictive panel diagnostics", "Thermal and electrical telemetry modeling to detect cell degradation before catastrophic failure."],
      ["Battery lifecycle optimization", "Intelligent charge and discharge cycling tailored to extreme temperature ranges."],
      ["Microgrid load balancing", "Dynamic software balancing for decentralized rural and industrial clean energy systems."]
    ]
  },
  "buddy": {
    name: "KITTY Buddy",
    label: "TACTILE HUMAN-MACHINE COLLABORATION",
    status: "CONCEPT EXPLORATION",
    category: "Robotics",
    media: "Desktop companion concept prototypes",
    description: "An exploratory physical companion robot exploring non-intrusive tactile human-machine collaboration without screen fatigue or surveillance.",
    intro: "KITTY Buddy investigates how physical devices can give tangible presence to intelligent assistants while respecting user privacy.",
    principles: [
      ["Physical presence over screens", "Tactile micro-gestures and physical articulation instead of constant notifications and screens."],
      ["Privacy by design", "Designed without ambient video surveillance or uninvited auditory tracking."],
      ["Natural desktop interaction", "Explores intuitive, non-demanding collaboration for everyday work environments."]
    ]
  },
  "kitty-ai": {
    name: "KITTY AI",
    label: "EMBEDDED INTELLIGENCE & NEURAL CONTROLLERS",
    status: "IN ACTIVE DEVELOPMENT",
    category: "AI",
    media: "Vision-actuator neural network benchmarks",
    description: "Proprietary software stack bridging multi-sensor spatial computer vision directly with real-time robotic actuator controllers.",
    intro: "KITTY AI provides physical machines with offline edge inference, context-aware navigation, and memory you can understand.",
    principles: [
      ["Vision-to-action neural stack", "Closed-loop control connecting camera frames directly to motor actuator signals."],
      ["Edge-native inference", "Runs locally on low-power hardware without constant cloud connectivity."],
      ["Context & memory control", "User-manageable context with explicit controls over what data is retained."]
    ]
  },
  "digital-solutions-studio": {
    name: "Digital Solutions Studio",
    label: "COMMERCIAL SOFTWARE & AUTOMATION",
    status: "ACTIVE OPERATIONS",
    category: "Engineering",
    media: "Live production web applications & client demos",
    description: "Commercial digital studio delivering bespoke web applications, business automation, and custom digital software globally.",
    intro: "Our commercial digital engineering arm builds production web and mobile software for businesses, independently funding our robotics research.",
    principles: [
      ["Fixed-scope transparent delivery", "Clear milestones, direct engineer communication, and guaranteed handover."],
      ["Custom web & mobile engineering", "High-performance full-stack web applications and scoped Android software."],
      ["Direct research funding", "All commercial revenues directly finance our physical robotics and clean energy laboratory."]
    ]
  },
  "research": {
    name: "KITTY Research",
    label: "LABORATORY & EXPLORATION",
    status: "ONGOING",
    category: "Research",
    media: "Kinematics simulations & research whitepapers",
    description: "Independent exploration into physical-world intelligence, precision agriculture, and decentralized energy software.",
    intro: "Inside the KITTY CORP laboratory, we conduct applied research on autonomous robotics and intelligent physical systems.",
    principles: [
      ["Physical-world focus", "Prioritizing software that acts in the physical world over purely digital media."],
      ["Open scientific sharing", "Publishing ongoing build logs, kinematics simulations, and research whitepapers."],
      ["Independence", "Funded through commercial digital engineering rather than speculative dilutive capital."]
    ]
  }
} as const;
