import { Course, Badge, QuizQuestion } from "./types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "pw",
    title: "Physics Wallah (PW)",
    description: "India's premium online education platform. Master competitive exams (JEE/NEET) and core science subjects with live interactive lectures.",
    thumbnail: "linear-gradient(135deg, #FF4D00 0%, #1A0F0A 100%)",
    rating: 4.9,
    enrolled: "1.2M+",
    duration: "240 hours",
    studyLink: "https://pwthor.live/study",
    ottLink: "https://pipro.deltastudy.site",
    category: "Competitive Exams",
    progress: 35,
    tags: ["JEE", "NEET", "Physics", "Chemistry", "Maths"]
  },
  {
    id: "next_toppers",
    title: "Next Toppers",
    description: "Best curated courses for CBSE & State Boards Class 9–12 and foundations for competitive milestones.",
    thumbnail: "linear-gradient(135deg, #FF5722 0%, #1F0D05 100%)",
    rating: 4.8,
    enrolled: "450K+",
    duration: "180 hours",
    studyLink: "https://eduvibe-nt.pages.dev",
    category: "Class 9-12",
    progress: 12,
    tags: ["Class 9", "Class 10", "Class 11", "Class 12", "Board Prep"]
  },
  {
    id: "mission_jeet",
    title: "Mission Jeet",
    description: "Free quality learning platform offering full video explanations, structured revision checklists, and mock study materials.",
    thumbnail: "linear-gradient(135deg, #FF9800 0%, #1F140A 100%)",
    rating: 4.7,
    enrolled: "680K+",
    duration: "110 hours",
    studyLink: "https://studypandapages.dev/missonjeet",
    category: "Free Material",
    progress: 0,
    tags: ["Free Courses", "Revision Notes", "Syllabus Tracker"]
  },
  {
    id: "book_verse",
    title: "BookVerse",
    description: "Your digital treasury. Access free NCERT text books, comprehensive solutions, premium revision PDFs, and reference materials.",
    thumbnail: "linear-gradient(135deg, #E65100 0%, #1C0A00 100%)",
    rating: 4.9,
    enrolled: "820K+",
    duration: "Unlimited",
    studyLink: "https://bookverse.digital",
    category: "Books & PDFs",
    progress: 60,
    tags: ["NCERT", "Reference Books", "PDF Notes", "Formula Sheets"]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "badge_welcome",
    title: "First Spark",
    description: "Ignited your learning journey by logging in or beginning a course.",
    iconName: "Flame",
    unlocked: true,
    unlockedAt: "Joined Today"
  },
  {
    id: "badge_note",
    title: "Curiosity Fuel",
    description: "Wrote your first study summary or concept note.",
    iconName: "FileText",
    unlocked: false
  },
  {
    id: "badge_quiz_perfect",
    title: "Inferno Scholar",
    description: "Scored 100% on a FireStudy quiz.",
    iconName: "Award",
    unlocked: false
  },
  {
    id: "badge_streak_3",
    title: "Steady Blaze",
    description: "Achieved a 3-day learning streak.",
    iconName: "Zap",
    unlocked: false
  },
  {
    id: "badge_download",
    title: "Offline Vault",
    description: "Saved a course for offline study.",
    iconName: "DownloadCloud",
    unlocked: false
  }
];

export const MOTIVATIONAL_QUOTES = [
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats"
  },
  {
    text: "Do not wait for leaders; do it alone, person to person. Be the spark that starts the flame.",
    author: "Mother Teresa"
  },
  {
    text: "The fireplace of wisdom is kept alive by the logs of daily curiosity.",
    author: "FireStudy Philosophy"
  },
  {
    text: "Success isn't overnight. It is when every day you get a little better than the day before. It all adds up.",
    author: "Dwayne Johnson"
  },
  {
    text: "Your potential is a blazing fire waiting for the spark of discipline to unleash it.",
    author: "Unknown"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    subject: "Physics",
    question: "What is the relationship between heat energy, mass, specific heat capacity, and temperature change?",
    options: [
      "Q = m * c * ΔT (Thermal balance)",
      "Q = m / (c * ΔT) (Thermal ratio)",
      "Q = m * c * v^2 (Thermal kinetic)",
      "Q = c * ΔT / m (Thermal density)"
    ],
    correctAnswer: 0,
    explanation: "Heat transferred (Q) is equal to mass (m) multiplied by specific heat capacity (c) and temperature change (ΔT)."
  },
  {
    id: "q2",
    subject: "Chemistry",
    question: "Which of the following is highly exothermic and releases substantial thermal energy (fire)?",
    options: [
      "Dissolving salt in water",
      "Combustion of hydrocarbons (e.g., Methane)",
      "Photosynthesis in green leaves",
      "Thermal decomposition of Calcium Carbonate"
    ],
    correctAnswer: 1,
    explanation: "Combustion is a high-temperature exothermic chemical reaction between a fuel and an oxidant, producing heat and light."
  },
  {
    id: "q3",
    subject: "General Study",
    question: "Which retrieval practice study method involves explaining a complex topic in extremely simple terms?",
    options: [
      "The Feynman Technique",
      "Pomodoro Sprinting",
      "Sub-Vocal Reading",
      "Linear Rote Learning"
    ],
    correctAnswer: 0,
    explanation: "The Feynman Technique uses simple language and analogies to learn concepts deeply by teaching them to others."
  },
  {
    id: "q4",
    subject: "Astronomy",
    question: "What process powers the thermonuclear furnace of our Sun, emitting constant heat and light?",
    options: [
      "Nuclear Fission",
      "Chemical Coal Combustion",
      "Nuclear Fusion of Hydrogen into Helium",
      "Geothermal Friction"
    ],
    correctAnswer: 2,
    explanation: "The Sun is powered by nuclear fusion, where hydrogen nuclei fuse to form helium under extreme heat and gravitational pressure."
  }
];
