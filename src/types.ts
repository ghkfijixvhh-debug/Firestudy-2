export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  rating: number;
  enrolled: string;
  duration: string;
  studyLink: string;
  ottLink?: string;
  category: string;
  progress: number; // 0 to 100
  tags: string[];
}

export interface Note {
  id: string;
  courseId: string;
  courseTitle: string;
  content: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // references lucide icons
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface DownloadItem {
  id: string;
  courseId: string;
  title: string;
  progress: number; // 0 to 100
  size: string;
  status: "downloading" | "completed" | "paused";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "streak" | "course" | "achievement" | "info";
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  streak: number;
  hoursStudied: number;
  completedLessons: number;
  certificatesCount: number;
  xp: number;
  bookmarks: string[]; // array of course IDs
  completedCourses: string[]; // array of course IDs
}
