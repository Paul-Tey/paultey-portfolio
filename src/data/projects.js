export const projects = [
  {
    title: "STM32 + ESP01 Telegram Alert System",
    description:
      "An embedded IoT alert system where an STM32 board sends UART triggers to an ESP01 Wi-Fi module, which then sends Telegram notifications.",
    techStack: ["STM32", "ESP01", "Mbed Studio", "UART", "Telegram Bot API"],
    highlights: [
      "Used UART communication between STM32 and ESP01",
      "Sent real-time alerts to Telegram",
      "Avoided hosting a full web server by using lightweight trigger-based messaging"
    ]
  },
  {
    title: "Flutter + Firebase Booking App",
    description:
      "A mobile booking application with authentication, provider detail pages, booking storage, and Firestore integration.",
    techStack: ["Flutter", "Dart", "Firebase Auth", "Firestore"],
    highlights: [
      "Built user authentication flow",
      "Stored booking records in Firestore",
      "Designed reusable screens for provider details and reservations"
    ]
  },
  {
    title: "Jetson Nano Camera Benchmarking",
    description:
      "A benchmarking setup for testing camera processing, video output, storage usage, and encoding performance on Jetson Nano.",
    techStack: ["Python", "OpenCV", "GStreamer", "Jetson Nano"],
    highlights: [
      "Compared different video output methods",
      "Focused on CPU usage, file size, and runtime performance",
      "Explored hardware H.264 encoding using GStreamer"
    ]
  },
  {
    title: "Generic Serial Product Test Framework",
    description:
      "A Python-based serial testing framework for detecting devices, running test cases, and logging results into CSV files.",
    techStack: ["Python", "Serial Communication", "CSV Logging", "CLI"],
    highlights: [
      "Detected valid serial devices automatically",
      "Ran product-specific test functions",
      "Logged test results for traceability"
    ]
  }
];