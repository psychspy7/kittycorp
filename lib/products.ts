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
