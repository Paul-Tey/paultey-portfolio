export const projects = [
  {
    title: "PaulTey.com Portfolio Website",
    category: "Web / Deployment",
    status: "Live portfolio",
    role: "Frontend and deployment owner",
    summary:
      "A live React portfolio for presenting engineering work, technical learning, and a protected contact workflow.",
    problem:
      "Visitors needed a clear way to understand the work across hardware and software, while the site still had to support reliable deployment and a contact route that does not expose private email details.",
    architecture:
      "React and Vite build a static single-page app that deploys through Cloudflare Pages, with a serverless contact endpoint using Turnstile validation and Resend email delivery.",
    constraints: [
      "Keep the main site static and fast while isolating contact-form secrets and provider calls in a server-side function.",
      "Preserve keyboard access, reduced-motion support and readable layouts from desktop through 360-pixel mobile screens.",
      "Run repeatable pull-request checks without exposing production Turnstile or Resend secrets."
    ],
    challenges:
      "Keeping deployment, security rules, and contact-form behaviour understandable while investigating production-only 403 and 502 responses.",
    designDecisions: [
      "Kept project content separate from card presentation so every case study follows a consistent structure.",
      "Used a static frontend with a serverless function only for the contact path, avoiding a larger application server.",
      "Kept Turnstile and Resend secrets in the server-side environment; the browser receives only the public widget key."
    ],
    implementationDetails: [
      "Data-driven React components render filters, expandable project details and hash-free section navigation.",
      "A Cloudflare Pages Function validates JSON, verifies the Turnstile hostname and action, and sends accepted messages through Resend within one bounded deadline.",
      "GitHub Actions uses a clean npm install to run ESLint, Vitest and the production Vite build for pull requests to main.",
      "A top-level static 404 page gives Cloudflare Pages a dedicated not-found response without introducing client-side routing."
    ],
    validation: [
      "Vitest and Testing Library cover navigation, filtering, project expansion, accessible contact states and server-side failure paths.",
      "A local Playwright smoke suite checks the production build, mobile navigation, static assets and the real custom 404 response without sending contact messages.",
      "Browser checks exercised navigation, project details, contact states and responsive layouts at desktop, tablet and mobile widths.",
      "Mocked Turnstile and Resend responses test server-side validation without contacting live services.",
      "Earlier local mobile and desktop Lighthouse audits recorded 100 in every category; a July 2026 desktop rerun recorded 97 Performance and 100 for Accessibility, Best Practices and SEO. These are laboratory results rather than real-user measurements."
    ],
    outcome:
      "Delivered the live portfolio and a protected contact path that keeps private mail credentials outside browser code.",
    futureImprovements:
      "Add verified case-study media and keep automated checks and production troubleshooting notes aligned with future changes.",
    techStack: [
      "React",
      "Vite",
      "Cloudflare Pages",
      "Pages Functions",
      "Turnstile",
      "Resend",
      "GitHub Actions",
      "Vitest",
      "Testing Library",
      "Playwright"
    ],
    keyFeatures: [
      "Single-page portfolio with smooth section navigation",
      "Project cards with expandable technical details",
      "Protected contact flow using Turnstile and Resend",
      "Responsive, keyboard-accessible interface with reduced-motion support",
      "Automated validation and a custom Cloudflare Pages 404 response"
    ],
    learningPoints: [
      "Practised keeping portfolio content structured as reusable data",
      "Connected frontend deployment decisions to production behaviour",
      "Improved awareness of how WAF rules, serverless functions, and secrets interact"
    ],
    technicalNotes: [
      "Use Git feature branches and pull requests before reviewed changes land on main.",
      "Cloudflare Pages deploys from main, while environment variables and secrets stay out of committed code.",
      "The WAF setup blocks POST requests except the intended POST /api/contact route.",
      "403 debugging focused on request filtering; 502 debugging focused on function runtime and upstream email behaviour."
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "STM32 + ESP01 Telegram Alert System",
    category: "Embedded IoT",
    status: "Prototype completed",
    role: "Embedded systems developer",
    summary:
      "A lightweight alert pipeline where an STM32 board sends UART triggers to an ESP01 Wi-Fi module, which then posts notifications through Telegram.",
    problem:
      "The system needed a simple way to send real-time alerts without hosting a full web dashboard or keeping a heavier network stack on the microcontroller.",
    architecture:
      "STM32 firmware watches for trigger conditions, sends compact UART messages to the ESP01, and the ESP01 handles Wi-Fi access plus the Telegram Bot API request.",
    challenges:
      "Keeping serial messages reliable while debugging across firmware behaviour, Wi-Fi setup, and API responses.",
    futureImprovements:
      "Add a clearer command format, retry handling, message acknowledgements, and a small configuration flow for Wi-Fi and chat settings.",
    techStack: ["STM32", "ESP01", "Mbed Studio", "UART", "Telegram Bot API"],
    keyFeatures: [
      "Used UART communication between STM32 and ESP01",
      "Sent real-time alerts to Telegram",
      "Avoided hosting a full web server by using lightweight trigger-based messaging"
    ],
    learningPoints: [
      "Designed a small serial protocol between hardware and Wi-Fi modules",
      "Handled embedded-to-cloud integration with limited device resources",
      "Practised debugging across firmware, networking, and API layers"
    ],
    technicalNotes: [
      "The STM32 sends UART triggers instead of handling Wi-Fi directly.",
      "The ESP01 owns Wi-Fi connection setup and Telegram notification delivery.",
      "This keeps the alert path lightweight for embedded-to-cloud messaging.",
      "Future work should add retry and acknowledgement behaviour so failed deliveries are visible."
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "Jetson Nano Camera Benchmarking System",
    category: "Edge AI / Computer Vision",
    status: "Technical investigation",
    role: "Performance benchmarking developer",
    summary:
      "A benchmarking setup for testing camera processing, video output, storage usage, and encoding performance on Jetson Nano.",
    problem:
      "Camera pipelines can behave differently depending on capture method, encoder, and output format, so the project compared practical options on embedded GPU hardware.",
    architecture:
      "Python scripts run capture and output tests using OpenCV and GStreamer, then compare practical metrics such as runtime, CPU load, and output file size.",
    constraints: [
      "Run camera and encoding experiments on the Jetson Nano's embedded CPU and GPU resources.",
      "Keep capture conditions and encoder settings consistent enough for useful comparisons."
    ],
    challenges:
      "Understanding how capture backends, encoder choices, and hardware acceleration affected the same camera workload.",
    designDecisions: [
      "Used OpenCV for rapid camera experiments and GStreamer when more direct pipeline and encoder control was needed.",
      "Compared CPU use, output size, runtime, and recording stability together instead of treating one metric as the answer.",
      "Included hardware H.264 encoding as a practical option for reducing CPU pressure on the Jetson Nano."
    ],
    implementationDetails: [
      "Used OpenCV for straightforward capture experiments and GStreamer for explicit pipeline and encoder control.",
      "Recorded runtime, CPU load and output file size as practical comparison points.",
      "Investigated hardware-assisted H.264 output without treating one metric as a complete performance result."
    ],
    validation: [
      "Ran camera capture and output tests through both OpenCV and GStreamer paths.",
      "Compared observed runtime, CPU load, and output file size across the investigated approaches."
    ],
    outcome:
      "Documented the practical trade-offs between simpler capture code and more configurable, hardware-assisted video pipelines on the Jetson Nano.",
    futureImprovements:
      "Automate repeatable benchmark runs, export clearer result tables, and test more camera resolutions and frame rates.",
    techStack: ["Python", "OpenCV", "GStreamer", "Jetson Nano", "H.264"],
    keyFeatures: [
      "Compared different video output methods",
      "Focused on CPU usage, file size, and runtime performance",
      "Explored hardware H.264 encoding using GStreamer"
    ],
    learningPoints: [
      "Measured performance trade-offs instead of relying on assumptions",
      "Worked with OpenCV and GStreamer camera pipelines",
      "Learned how hardware encoding affects embedded video workloads"
    ],
    technicalNotes: [
      "Encoder settings still affect output size and runtime behaviour when hardware H.264 encoding is used.",
      "Repeatable benchmarks should lock resolution, frame rate, encoder settings, duration, and capture conditions."
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "Automated Farming System",
    category: "IoT / Automation",
    status: "Course prototype",
    role: "Embedded and automation developer",
    summary:
      "An automation prototype for monitoring growing conditions and triggering basic control actions around a small farming setup.",
    problem:
      "Manual checks make it easy to miss environmental changes, so the system explored how sensing and simple automation could support more consistent care.",
    architecture:
      "A microcontroller reads environmental inputs, applies threshold-based decisions, and drives output devices for basic automation actions.",
    challenges:
      "Balancing sensor readings, actuator timing, wiring reliability, and readable control logic in a small hardware prototype.",
    futureImprovements:
      "Improve calibration, add data logging, make thresholds configurable, and add clearer fault handling for disconnected sensors or actuators.",
    techStack: ["Microcontroller", "Sensors", "Actuators", "Embedded C", "IoT"],
    keyFeatures: [
      "Read environmental inputs for farming-related conditions",
      "Triggered automated actions from threshold-based logic",
      "Organised the prototype around practical hardware testing"
    ],
    learningPoints: [
      "Practised connecting sensor data to actuator behaviour",
      "Learned why calibration and repeatable tests matter in automation systems",
      "Improved debugging across wiring, firmware, and physical environment changes"
    ],
    technicalNotes: [
      "Threshold logic is useful for a prototype, but sensor calibration determines whether the action is meaningful.",
      "Actuator behaviour should include timing limits so outputs do not stay active longer than intended.",
      "A future version should log readings and actions to make tuning decisions easier to justify."
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "Generic Serial Product Test Framework",
    category: "Automation / Test Engineering",
    status: "Framework prototype",
    role: "Python automation developer",
    summary:
      "A Python-based serial testing framework for detecting devices, running product-specific test cases, and logging results into CSV files.",
    problem:
      "Manual serial testing is repetitive and difficult to trace, so the framework standardises device detection, test execution, and result recording.",
    architecture:
      "A Python CLI detects serial devices, loads product-specific test routines, executes them in a consistent order, and writes structured results to CSV.",
    constraints: [
      "Keep common serial connection and reporting logic reusable while allowing each product to define its own checks.",
      "Make pass or fail state understandable after a device is disconnected.",
      "Treat connection failures and malformed responses explicitly before longer unattended runs are considered."
    ],
    challenges:
      "Designing shared serial tooling that stays reusable while still allowing each product to define its own checks.",
    designDecisions: [
      "Placed port discovery, connection setup, result formatting, and CSV output in the shared framework.",
      "Kept product-specific checks separate from common serial utilities so new test routines do not duplicate connection code.",
      "Used explicit pass or fail output because results may be reviewed after a device is disconnected."
    ],
    implementationDetails: [
      "The command-line workflow discovers valid serial devices before loading product-specific test functions.",
      "Shared utilities own connection setup, execution flow, result formatting and CSV output.",
      "Product-specific routines stay separate so additional checks do not duplicate common serial code.",
      "Result files provide a traceable record alongside the immediate pass or fail presentation."
    ],
    validation: [
      "Exercised automatic detection of valid serial devices.",
      "Ran product-specific test functions through the shared command-line workflow.",
      "Confirmed that structured results were written to CSV for later review."
    ],
    outcome:
      "Produced a reusable framework prototype that standardises serial test execution and leaves a traceable result file without claiming batch-device support.",
    futureImprovements:
      "Add richer reports, configurable test plans, better error recovery, and support for running batches of devices.",
    techStack: ["Python", "Serial Communication", "CSV Logging", "CLI"],
    keyFeatures: [
      "Detected valid serial devices automatically",
      "Ran product-specific test functions",
      "Logged test results for traceability"
    ],
    learningPoints: [
      "Built a reusable command-line workflow for hardware test routines",
      "Separated product-specific tests from shared serial tooling",
      "Improved reliability by writing structured test output to CSV"
    ],
    technicalNotes: [
      "Connection failures and malformed device responses need explicit recovery paths before the framework is used for longer unattended runs.",
      "Batch execution remains future work rather than a completed feature."
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "C2000 ePWM Learning Lab",
    category: "Embedded Systems",
    status: "Learning notes",
    role: "Embedded systems learner",
    summary:
      "A focused learning lab for understanding how C2000 ePWM timer settings translate into PWM waveform behaviour.",
    problem:
      "The register names are easy to memorise but harder to connect to actual waveform timing without worked examples and measurements.",
    architecture:
      "Small firmware experiments adjust time-base and compare settings, then relate the configured values to expected PWM frequency and duty cycle.",
    challenges:
      "Building an accurate mental model of time-base counting, period registers, compare events, and count modes.",
    futureImprovements:
      "Add measured waveform captures and worked calculations for multiple clock, period, compare, and count-mode configurations.",
    techStack: ["TI C2000", "ePWM", "Embedded C", "Oscilloscope"],
    keyFeatures: [
      "Focused on ePWM timer and compare configuration",
      "Connected register values to waveform timing",
      "Compared count modes through practical examples"
    ],
    learningPoints: [
      "Learned how TBCLK and TBPRD define PWM timing",
      "Used CMPA to reason about duty cycle and compare events",
      "Compared up-count, down-count, and up-down count behaviour"
    ],
    technicalNotes: [
      "TBCLK is the time-base clock that drives the ePWM counter.",
      "TBPRD sets the period reference used by the time-base counter.",
      "CMPA controls the compare point used to shape duty cycle behaviour.",
      "Up-count, down-count, and up-down count modes change how period and compare events map to waveform timing."
    ],
    links: {
      github: null,
      demo: null
    }
  }
];
