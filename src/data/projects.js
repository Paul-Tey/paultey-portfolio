export const projects = [
  {
    title: "STM32 + ESP01 Telegram Alert System",
    category: "Embedded IoT",
    status: "Prototype completed",
    role: "Embedded systems developer",
    summary:
      "A lightweight alert pipeline where an STM32 board sends UART triggers to an ESP01 Wi-Fi module, which then posts notifications through Telegram.",
    problem:
      "The system needed a simple way to send real-time alerts without hosting a full web dashboard or keeping a heavier network stack on the microcontroller.",
    techStack: ["STM32", "ESP01", "Mbed Studio", "UART", "Telegram Bot API"],
    keyFeatures: [
      "Used UART communication between STM32 and ESP01",
      "Sent real-time alerts to Telegram",
      "Avoided hosting a full web server by using lightweight trigger-based messaging"
    ],
    learningPoints: [
      "Designed a small serial protocol between hardware and Wi-Fi modules",
      "Handled embedded-to-cloud integration with limited device resources",
      "Practiced debugging across firmware, networking, and API layers"
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "Flutter + Firebase Booking App",
    category: "Mobile Application",
    status: "Course project",
    role: "Full-stack mobile developer",
    summary:
      "A mobile booking application with authentication, provider detail pages, booking storage, and Firestore-backed data persistence.",
    problem:
      "Users needed a clear flow for browsing service providers, signing in, creating bookings, and storing reservation records reliably.",
    techStack: ["Flutter", "Dart", "Firebase Auth", "Firestore"],
    keyFeatures: [
      "Built user authentication flow",
      "Stored booking records in Firestore",
      "Designed reusable screens for provider details and reservations"
    ],
    learningPoints: [
      "Structured reusable Flutter screens and navigation flows",
      "Connected mobile UI state to Firebase Auth and Firestore",
      "Modeled user booking data for retrieval and traceability"
    ],
    links: {
      github: null,
      demo: null
    }
  },
  {
    title: "Jetson Nano Camera Benchmarking",
    category: "Edge AI / Computer Vision",
    status: "Technical investigation",
    role: "Performance benchmarking developer",
    summary:
      "A benchmarking setup for testing camera processing, video output, storage usage, and encoding performance on Jetson Nano.",
    problem:
      "Camera pipelines can behave differently depending on capture method, encoder, and output format, so the project compared practical options on embedded GPU hardware.",
    techStack: ["Python", "OpenCV", "GStreamer", "Jetson Nano"],
    keyFeatures: [
      "Compared different video output methods",
      "Focused on CPU usage, file size, and runtime performance",
      "Explored hardware H.264 encoding using GStreamer"
    ],
    learningPoints: [
      "Measured performance tradeoffs instead of relying on assumptions",
      "Worked with OpenCV and GStreamer camera pipelines",
      "Learned how hardware encoding affects embedded video workloads"
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
      "Manual serial testing is repetitive and difficult to trace, so the framework standardizes device detection, test execution, and result recording.",
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
    links: {
      github: null,
      demo: null
    }
  }
];
