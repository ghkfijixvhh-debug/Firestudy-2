import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Search,
  BookOpen,
  Clock,
  Star,
  Award,
  Zap,
  DownloadCloud,
  FileText,
  Settings,
  User,
  LogOut,
  Bell,
  Compass,
  HelpCircle,
  ArrowLeft,
  RefreshCw,
  Share2,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Send,
  Volume2,
  Mic,
  Play,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  Trash2,
  Printer,
  Check,
  Menu,
  X,
  Plus,
  BookMarked,
  Info,
  PhoneCall,
  Lock,
  Pause,
  ArrowUpRight,
  Heart
} from "lucide-react";
import { Course, Note, Badge, QuizQuestion, ChatMessage, DownloadItem, NotificationItem, UserProfile } from "./types";
import { INITIAL_COURSES, INITIAL_BADGES, MOTIVATIONAL_QUOTES, QUIZ_QUESTIONS } from "./data";

export default function App() {
  // --- Persistent Storage State ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("firestudy_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default below
      }
    }
    return {
      name: "Aman Sharma",
      email: "aman@firestudy.edu",
      isLoggedIn: false, // default false to show login screen first
      streak: 4,
      hoursStudied: 16.8,
      completedLessons: 24,
      certificatesCount: 1,
      xp: 450,
      bookmarks: ["pw"],
      completedCourses: []
    };
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("firestudy_courses");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COURSES;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem("firestudy_badges");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BADGES;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("firestudy_notes");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "note_1",
        courseId: "pw",
        courseTitle: "Physics Wallah (PW)",
        content: "Exothermic combustion releases heat energy because bond formation in products releases more energy than bond breaking in reactants! 🔥",
        timestamp: "2026-07-16 14:32"
      }
    ];
  });

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem("firestudy_downloads");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "dl_1", courseId: "book_verse", title: "NCERT Class 10 Physics Book PDF", progress: 100, size: "14.2 MB", status: "completed" },
      { id: "dl_2", courseId: "pw", title: "PW Combustion & Thermal Dynamics Lecture Video", progress: 45, size: "310.5 MB", status: "downloading" }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("firestudy_notifications");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "notif_1",
        title: "🔥 Streak Restored!",
        message: "Your learning flame is strong. Keep studying today to increase your 4-day streak!",
        timestamp: "2 hours ago",
        read: false,
        type: "streak"
      },
      {
        id: "notif_2",
        title: "✨ Welcome Badge Unlocked",
        message: "You've successfully joined the FireStudy elite learning ecosystem! Master modules to unlock more.",
        timestamp: "1 day ago",
        read: true,
        type: "achievement"
      }
    ];
  });

  const [aiChatMessages, setAiChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("firestudy_chats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {}
    }
    return [
      {
        id: "chat_welcome",
        role: "assistant",
        content: "Greetings, scholar! 🔥 I am your **FireStudy AI Coach**. My passion is to guide you and keep your intellectual fire burning bright. Ask me to solve physics equations, explain board prep topics, or suggest NCERT learning schedules!",
        timestamp: new Date()
      }
    ];
  });

  // --- Theme State ---
  const [isLightTheme, setIsLightTheme] = useState(() => {
    return localStorage.getItem("firestudy_theme") === "light";
  });

  // --- UI Control States ---
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: "success" | "achievement" | "info" } | null>(null);

  // WebView / Player overlay state
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState<Course | null>(null);
  const [playerIframeLoading, setPlayerIframeLoading] = useState(true);
  const [playerMode, setPlayerMode] = useState<"study" | "ott">("study");
  const [playerNotesInput, setPlayerNotesInput] = useState("");

  // Quiz state
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // AI Chat input
  const [currentAiInput, setCurrentAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Voice Search / Audio state
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceVolumeLevel, setVoiceVolumeLevel] = useState<number[]>(Array(15).fill(0));
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Random Daily Quote selection
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Leaders list
  const leaderboardData = [
    { rank: 1, name: "Kabir Roy", xp: 1450, badge: "Inferno Master", avatar: "🔥" },
    { rank: 2, name: "Sneha Patil", xp: 1200, badge: "Blaze Scholar", avatar: "⚡" },
    { rank: 3, name: "Aman Sharma (You)", xp: profile.xp, badge: "Flame Seeker", avatar: "🧠" },
    { rank: 4, name: "Rahul Verma", xp: 420, badge: "Spark Starter", avatar: "✨" },
    { rank: 5, name: "Diya Roy", xp: 390, badge: "Curious Spark", avatar: "📖" }
  ];

  // Contact Form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // --- Effects ---

  // Handle Splash duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("firestudy_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("firestudy_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("firestudy_badges", JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem("firestudy_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("firestudy_downloads", JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem("firestudy_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("firestudy_chats", JSON.stringify(aiChatMessages));
  }, [aiChatMessages]);

  useEffect(() => {
    localStorage.setItem("firestudy_theme", isLightTheme ? "light" : "dark");
    const rootClass = document.body.classList;
    if (isLightTheme) {
      rootClass.add("light-theme");
    } else {
      rootClass.remove("light-theme");
    }
  }, [isLightTheme]);

  // Download simulation progress increment
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => {
        let modified = false;
        const next = prev.map(dl => {
          if (dl.status === "downloading" && dl.progress < 100) {
            modified = true;
            const newProgress = dl.progress + Math.floor(Math.random() * 8) + 2;
            const finalProgress = newProgress >= 100 ? 100 : newProgress;
            return {
              ...dl,
              progress: finalProgress,
              status: finalProgress === 100 ? "completed" : "downloading"
            };
          }
          return dl;
        });
        if (modified) return next as DownloadItem[];
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update Daily Quote once on mount
  useEffect(() => {
    const index = Math.floor((Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length);
    setDailyQuote(MOTIVATIONAL_QUOTES[index]);
  }, []);

  // --- Helper trigger toast ---
  const triggerToast = (title: string, desc: string, type: "success" | "achievement" | "info" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // --- Trigger badge unlocking ---
  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const badgeIndex = prev.findIndex(b => b.id === badgeId);
      if (badgeIndex !== -1 && !prev[badgeIndex].unlocked) {
        const nextBadges = [...prev];
        nextBadges[badgeIndex] = {
          ...nextBadges[badgeIndex],
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString()
        };
        // Award XP too
        setProfile(p => ({ ...p, xp: p.xp + 100 }));
        triggerToast("🏆 Badge Unlocked!", nextBadges[badgeIndex].title + " - XP +100 earned!", "achievement");
        
        // Add notification
        setNotifications(n => [
          {
            id: "notif_" + Date.now(),
            title: `🏆 New Badge: ${nextBadges[badgeIndex].title}`,
            message: `Congratulations! You have unlocked the '${nextBadges[badgeIndex].title}' achievement. Check your profile.`,
            timestamp: "Just now",
            read: false,
            type: "achievement"
          },
          ...n
        ]);
        return nextBadges;
      }
      return prev;
    });
  };

  // --- Authentication Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError("Email is required");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    setProfile(p => ({
      ...p,
      email: authEmail,
      name: authName || authEmail.split("@")[0].toUpperCase(),
      isLoggedIn: true
    }));
    triggerToast("🔥 Welcome back!", "Igniting your FireStudy courses dashboard.");
    setAuthError("");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName) {
      setAuthError("All fields are required");
      return;
    }
    setProfile(p => ({
      ...p,
      email: authEmail,
      name: authName,
      isLoggedIn: true
    }));
    triggerToast("✨ Account Created!", "Let's fuel your learning flame. Initial badge 'First Spark' achieved!", "achievement");
    setAuthError("");
  };

  const handleGuestLogin = () => {
    setProfile(p => ({
      ...p,
      isLoggedIn: true,
      name: "Guest Scholar",
      email: "guest@firestudy.edu"
    }));
    triggerToast("🔥 Welcome Guest!", "Exploring FireStudy in Scholar Guest Mode.");
  };

  const handleLogout = () => {
    setProfile(p => ({ ...p, isLoggedIn: false }));
    triggerToast("✨ Logged Out Safely", "Your learning history is saved locally. Come back soon!");
  };

  // --- Simulated / Real Voice Search Handler ---
  const toggleVoiceSearch = () => {
    if (isVoiceSearchActive) {
      // Turn off
      setIsVoiceSearchActive(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      return;
    }

    setIsVoiceSearchActive(true);
    setVoiceTranscript("Listening...");

    // Set up visual wave animation
    audioIntervalRef.current = setInterval(() => {
      setVoiceVolumeLevel(Array(15).fill(0).map(() => Math.floor(Math.random() * 24) + 6));
    }, 120);

    // Try real SpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "en-IN";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setVoiceTranscript(text);
        setSearchQuery(text);
        triggerToast("🎙️ Voice Captured", `Search query set to: "${text}"`);
        setIsVoiceSearchActive(false);
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      };

      rec.onerror = () => {
        simulateVoiceFallback();
      };

      rec.onend = () => {
        setIsVoiceSearchActive(false);
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      };

      try {
        rec.start();
      } catch (e) {
        simulateVoiceFallback();
      }
    } else {
      simulateVoiceFallback();
    }
  };

  const simulateVoiceFallback = () => {
    const mockPhrases = [
      "Physics Wallah lecture",
      "NCERT study guides",
      "Mission Jeet Chemistry class",
      "BookVerse solutions",
      "CBSE Class 12 board preparations"
    ];
    const phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    
    setTimeout(() => {
      setVoiceTranscript(phrase);
      setSearchQuery(phrase);
      triggerToast("🎙️ Speech Recognized", `Found: "${phrase}"`);
      setIsVoiceSearchActive(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }, 2200);
  };

  // --- Course Enrollment Actions ---
  const toggleEnrollment = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const isCurrentlyEnrolled = profile.completedCourses.includes(courseId) || course.progress > 0;
    
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, progress: c.progress > 0 ? 0 : 5 };
      }
      return c;
    }));

    if (course.progress === 0) {
      // Started studying
      setProfile(p => ({
        ...p,
        completedLessons: p.completedLessons + 1
      }));
      triggerToast("📖 Course Begun!", `You have enrolled in ${course.title}. Click 'Study' to load content.`);
      unlockBadge("badge_welcome");
    } else {
      // Unenrolled
      triggerToast("🎒 Course Left", `Removed ${course.title} from active courses list.`, "info");
    }
  };

  // --- Player overlay actions (Web View proxy) ---
  const openCoursePlayer = (course: Course) => {
    setSelectedCourseForPlayer(course);
    setPlayerIframeLoading(true);
    setPlayerMode("study");
    // Find if notes already exist for this course
    const existing = notes.find(n => n.courseId === course.id);
    setPlayerNotesInput(existing ? existing.content : "");
    
    // Simulate studied metrics increment
    setProfile(p => ({
      ...p,
      hoursStudied: Number((p.hoursStudied + 0.3).toFixed(1)),
      xp: p.xp + 15
    }));
  };

  const savePlayerNote = () => {
    if (!selectedCourseForPlayer) return;
    
    setNotes(prev => {
      const idx = prev.findIndex(n => n.courseId === selectedCourseForPlayer.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          content: playerNotesInput,
          timestamp: new Date().toLocaleString()
        };
        return copy;
      } else {
        return [
          {
            id: "note_" + Date.now(),
            courseId: selectedCourseForPlayer.id,
            courseTitle: selectedCourseForPlayer.title,
            content: playerNotesInput,
            timestamp: new Date().toLocaleString()
          },
          ...prev
        ];
      }
    });

    triggerToast("📝 Note Saved", `Your notes for ${selectedCourseForPlayer.title} are updated successfully.`);
    unlockBadge("badge_note");
  };

  const toggleBookmark = (courseId: string) => {
    setProfile(p => {
      const exists = p.bookmarks.includes(courseId);
      const nextBookmarks = exists 
        ? p.bookmarks.filter(id => id !== courseId)
        : [...p.bookmarks, courseId];
      
      triggerToast(
        exists ? "Bookmark Removed" : "📚 Bookmarked!", 
        exists ? "Course removed from list." : "Easy access to this syllabus from your dashboard.",
        "info"
      );
      return { ...p, bookmarks: nextBookmarks };
    });
  };

  // --- Offline Download Simulators ---
  const downloadCourseOffline = (course: Course) => {
    // Check if already in downloads
    const exists = downloads.find(dl => dl.courseId === course.id);
    if (exists) {
      triggerToast("📥 Saved already", `${course.title} is already cached or in queue.`, "info");
      return;
    }

    const newDownload: DownloadItem = {
      id: "dl_" + Date.now(),
      courseId: course.id,
      title: course.title + " Full Syllabus Offline Packs",
      progress: 0,
      size: "145.8 MB",
      status: "downloading"
    };

    setDownloads(prev => [newDownload, ...prev]);
    triggerToast("⚡ Download Triggered", "Syllabus, index files and PDFs are starting to download offline.", "success");
    unlockBadge("badge_download");
  };

  // --- AI Chat Tutor Handlers ---
  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAiInput.trim() || aiLoading) return;

    const userText = currentAiInput;
    const userMessage: ChatMessage = {
      id: "chat_" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date()
    };

    setAiChatMessages(prev => [...prev, userMessage]);
    setCurrentAiInput("");
    setAiLoading(true);

    try {
      // Package messages for server-side API requirements
      const recentChatContext = [...aiChatMessages, userMessage].slice(-6); // pass last 6 messages
      const bodyMessages = recentChatContext.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: bodyMessages })
      });

      if (!res.ok) {
        throw new Error("Tutor connection had a minor thermal hiccup.");
      }

      const data = await res.json();
      
      setAiChatMessages(prev => [...prev, {
        id: "chat_reply_" + Date.now(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date()
      }]);
    } catch (e: any) {
      setAiChatMessages(prev => [...prev, {
        id: "chat_reply_err_" + Date.now(),
        role: "assistant",
        content: `⚠️ **Coach Alert**: ${e.message || "I encountered a minor network glitch. Let's study again in a second!"} (Tip: If you're running locally, make sure your backend is up and process.env.GEMINI_API_KEY is configured!)`,
        timestamp: new Date()
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  // --- Quiz Submission Actions ---
  const submitQuizAnswer = () => {
    if (selectedQuizOption === null || quizSubmitted) return;
    
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === QUIZ_QUESTIONS[currentQuizQuestion].correctAnswer;
    
    if (isCorrect) {
      setQuizScore(s => s + 1);
      setProfile(p => ({ ...p, xp: p.xp + 50 }));
      triggerToast("⚡ Correct Answer!", "+50 XP rewarded for sharp intuition.");
    } else {
      triggerToast("❌ Incorrect", "Review the combustion study details below.");
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizQuestion(c => c + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      // If perfect score, unlock Inferno Master Badge
      const finalScore = quizScore + (selectedQuizOption === QUIZ_QUESTIONS[currentQuizQuestion].correctAnswer ? 1 : 0);
      if (finalScore === QUIZ_QUESTIONS.length) {
        unlockBadge("badge_quiz_perfect");
      }
      setProfile(p => ({
        ...p,
        completedLessons: p.completedLessons + 4,
        certificatesCount: p.certificatesCount + (finalScore >= 3 ? 1 : 0)
      }));
    }
  };

  const resetQuiz = () => {
    setCurrentQuizQuestion(0);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // --- Contact submission ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSubmitted(true);
    triggerToast("📨 Message Sent", "Your query has been dispatched to the FireStudy faculty. We will spark a response in 12 hours.");
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName("");
      setContactEmail("");
      setContactMsg("");
    }, 4000);
  };

  // --- Helper to render specific tab body ---
  const renderTabContent = () => {
    // Shared category filter for Home course cards
    const filteredCourses = courses.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Daily Quote Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 border border-orange-500/10 shadow-2xl bg-surface">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-transparent" />
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none radial-glow-back" />
              
              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-[#FF4D00] rounded-full text-xs font-semibold tracking-wider uppercase border border-orange-500/20">
                  🔥 Daily Fire Ignition
                </span>
                <h1 className="text-2xl md:text-4xl font-serif italic font-extrabold tracking-tight text-white-toggle">
                  "{dailyQuote.text}"
                </h1>
                <p className="text-orange-400 text-sm font-medium">— {dailyQuote.author}</p>
                
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-orange-500" /> Real-time Course WebViews</span>
                  <span className="text-orange-500">•</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-orange-500" /> Gemini-Powered Study Coach</span>
                </div>
              </div>
            </div>

            {/* Course Search and Quick tags */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses (e.g. Physics Wallah, NCERT books, NEET board prep...)"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#141414] border border-orange-500/10 focus:border-orange-500/50 focus:outline-none text-white text-sm transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={toggleVoiceSearch}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isVoiceSearchActive ? 'bg-orange-500 text-white animate-pulse' : 'text-gray-400 hover:text-orange-500'}`}
                    title="Voice search syllabi"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Popular Sparks:</span>
                {["Physics", "NCERT Books", "Boards Prep", "JEE", "Revision PDFs"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 rounded-full bg-orange-500/5 border border-orange-500/10 text-gray-300 hover:text-orange-500 hover:border-orange-500/40 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Wave Overlay if Active */}
            <AnimatePresence>
              {isVoiceSearchActive && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl border border-orange-500/20 bg-orange-950/10 flex flex-col items-center gap-3"
                >
                  <p className="text-xs text-orange-400 tracking-wider uppercase font-semibold">Voice Speech Recognition Engine Active</p>
                  <div className="flex items-center gap-1.5 h-12">
                    {voiceVolumeLevel.map((lvl, idx) => (
                      <motion.div
                        key={idx}
                        className="w-1 bg-[#FF4D00] rounded-full"
                        animate={{ height: lvl }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-white italic">"{voiceTranscript}"</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories Toggles */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-500" /> Course Tracks
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {["All", "Competitive Exams", "Class 9-12", "Free Material", "Books & PDFs"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-[#FF4D00] to-[#FF9800] text-white border-transparent shadow-lg shadow-orange-500/20"
                        : "bg-surface text-gray-400 border-orange-500/10 hover:border-orange-500/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Learning / Enrolled courses panel (Only show if at least one enrolled) */}
            {courses.some(c => c.progress > 0) && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                  <Play className="w-5 h-5 text-orange-500 fill-orange-500" /> Continue Learning
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.filter(c => c.progress > 0).map(course => (
                    <div key={course.id} className="p-4 rounded-2xl bg-surface border border-orange-500/10 flex flex-col justify-between gap-3 shadow-lg hover:border-orange-500/30 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] text-orange-500 uppercase tracking-widest font-bold font-mono">{course.category}</span>
                          <h3 className="text-sm font-bold text-white-toggle">{course.title}</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold font-mono">
                          {course.progress}% Completed
                        </span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-[#141414] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#FF4D00] to-[#FF9800] h-full" style={{ width: `${course.progress}%` }} />
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => toggleEnrollment(course.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/5 text-red-400 text-xs font-semibold cursor-pointer"
                        >
                          Leave Track
                        </button>
                        <button
                          onClick={() => openCoursePlayer(course)}
                          className="px-4 py-1.5 rounded-lg bg-[#FF4D00] hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-white" /> Continue Study
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Course Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-white-toggle">
                {selectedCategory === "All" ? "Featured Study Syllabi" : `${selectedCategory} Tracks`} ({filteredCourses.length})
              </h2>

              {filteredCourses.length === 0 ? (
                <div className="py-12 text-center text-gray-500 bg-surface rounded-3xl border border-orange-500/5">
                  <AlertCircle className="w-10 h-10 mx-auto text-orange-500 mb-2 opacity-60" />
                  <p className="font-medium text-white-toggle">No tracks match your selection.</p>
                  <p className="text-xs">Try looking for general concepts or reset filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course) => {
                    const isEnrolled = course.progress > 0;
                    return (
                      <motion.div
                        layoutId={`course_card_${course.id}`}
                        key={course.id}
                        className="group overflow-hidden rounded-3xl bg-surface border border-orange-500/10 hover:border-orange-500/30 shadow-xl transition-all flex flex-col justify-between"
                      >
                        {/* Course Thumbnail */}
                        <div className="h-44 relative flex items-center justify-center p-6" style={{ background: course.thumbnail }}>
                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-all" />
                          <div className="relative z-10 text-center space-y-1.5">
                            <span className="px-2.5 py-1 bg-black/60 rounded-full text-[10px] tracking-wider uppercase text-orange-400 border border-orange-500/30">
                              {course.category}
                            </span>
                            <h3 className="text-xl font-bold text-white drop-shadow-md text-center">{course.title}</h3>
                          </div>
                          <button 
                            onClick={() => toggleBookmark(course.id)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 text-orange-500 transition-colors"
                            title="Bookmark track"
                          >
                            <Bookmark className={`w-4 h-4 ${profile.bookmarks.includes(course.id) ? 'fill-[#FF4D00] text-[#FF4D00]' : ''}`} />
                          </button>
                        </div>

                        {/* Card Meta */}
                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-xs text-gray-toggle leading-relaxed line-clamp-3">
                              {course.description}
                            </p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {course.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded bg-orange-500/5 text-orange-400 text-[9px] font-semibold border border-orange-500/5">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-dark-toggle pt-4 flex flex-wrap justify-between items-center text-xs text-gray-400 gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                              <span className="font-bold text-white-toggle">{course.rating}</span>
                              <span className="text-[10px]">({course.enrolled} joined)</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-[10px] text-orange-400">
                              <Clock className="w-3.5 h-3.5" /> {course.duration}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => toggleEnrollment(course.id)}
                              className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isEnrolled
                                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                  : "bg-[#FF4D00]/10 text-[#FF4D00] hover:bg-[#FF4D00]/20 border border-transparent"
                              }`}
                            >
                              {isEnrolled ? "✓ Registered" : "Join Track"}
                            </button>
                            <button
                              onClick={() => openCoursePlayer(course)}
                              className="py-3 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#FF9800] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/10 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-white text-transparent" /> Study Now
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-surface border border-orange-500/10 flex items-center gap-3 shadow-lg">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <Flame className="w-6 h-6 fill-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Daily Streak</p>
                  <p className="text-xl font-extrabold text-white-toggle">{profile.streak} Days</p>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-surface border border-orange-500/10 flex items-center gap-3 shadow-lg">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Hours Studied</p>
                  <p className="text-xl font-extrabold text-white-toggle">{profile.hoursStudied}h</p>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-surface border border-orange-500/10 flex items-center gap-3 shadow-lg">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Passed Units</p>
                  <p className="text-xl font-extrabold text-white-toggle">{profile.completedLessons}</p>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-surface border border-orange-500/10 flex items-center gap-3 shadow-lg">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Experience XP</p>
                  <p className="text-xl font-extrabold text-white-toggle">{profile.xp} XP</p>
                </div>
              </div>
            </div>

            {/* Weekly Progress & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Custom SVG Weekly progress Chart */}
              <div className="lg:col-span-2 p-5 md:p-6 rounded-3xl bg-surface border border-orange-500/10 space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-white-toggle flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" /> Weekly Learning Flame (Mins)
                </h3>
                
                {/* Simulated Chart */}
                <div className="h-44 flex items-end justify-between pt-4 pb-2 border-b border-dark-toggle">
                  {[
                    { day: "Mon", val: 45, color: "#9E0000" },
                    { day: "Tue", val: 80, color: "#FF4D00" },
                    { day: "Wed", val: 60, color: "#FF9800" },
                    { day: "Thu", val: 110, color: "#FF5722" },
                    { day: "Fri", val: 30, color: "#E65100" },
                    { day: "Sat", val: 0, color: "#1A1A1A" },
                    { day: "Sun", val: 0, color: "#1A1A1A" }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="text-[9px] font-mono font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        {bar.val}m
                      </div>
                      <div className="w-6 sm:w-8 bg-dark-accent rounded-t-lg overflow-hidden h-32 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(bar.val / 120) * 100}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="w-full rounded-t-lg"
                          style={{ backgroundColor: bar.color }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 text-center italic">Hover over blocks to check tracked study minutes.</p>
              </div>

              {/* Leaderboard Panel */}
              <div className="p-6 rounded-3xl bg-surface border border-orange-500/10 space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-white-toggle flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" /> FireStudy Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboardData.map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-2.5 rounded-xl border ${user.name.includes("You") ? "border-orange-500/30 bg-orange-500/5" : "border-transparent bg-black/20"}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-orange-400 w-4">#{user.rank}</span>
                        <span className="text-base">{user.avatar}</span>
                        <div>
                          <p className="text-xs font-bold text-white-toggle">{user.name}</p>
                          <p className="text-[9px] text-orange-400">{user.badge}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-orange-400">{user.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Certificates & Graduate Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" /> Mastery Certificates ({profile.certificatesCount})
              </h3>

              {profile.certificatesCount === 0 ? (
                <div className="p-6 rounded-3xl bg-surface border border-orange-500/5 text-center text-gray-500">
                  <ShieldAlert className="w-8 h-8 text-orange-500/40 mx-auto mb-2" />
                  <p className="text-xs font-medium">No certificates earned yet.</p>
                  <p className="text-[10px]">Pass any FireStudy Quiz with at least 75% to generate a luxury printable certificate!</p>
                </div>
              ) : (
                <div className="max-w-xl mx-auto p-6 border-4 border-double border-orange-500/40 rounded-3xl bg-gradient-to-br from-[#101010] to-[#1F0D05] space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-2 right-2 border border-orange-500/20 text-orange-400 text-[8px] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded">
                    OFFICIAL
                  </div>
                  
                  <div className="text-center space-y-2">
                    <Flame className="w-8 h-8 fill-orange-500 text-orange-500 mx-auto glow-text-orange" />
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-orange-500">FireStudy Certification of Excellence</h4>
                    <div className="h-px bg-orange-500/20 w-1/3 mx-auto" />
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-[11px] text-gray-400 font-mono italic">This credentials package confirms that</p>
                    <p className="text-xl font-bold text-white tracking-wide">{profile.name}</p>
                    <p className="text-[11px] text-gray-300 leading-relaxed max-w-sm mx-auto">
                      has successfully mastered high school curriculum units and competitive exam structures through diligent study on the **FireStudy Learning Platform**.
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-[9px] font-mono text-gray-500 pt-4 border-t border-orange-500/10">
                    <div className="text-left">
                      <p>VERIFIED CERTIFICATE ID</p>
                      <p className="text-orange-400 font-bold">FS-7R7F-W9YP</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-gray-400">🔥 FireStudy Faculty</p>
                      <button 
                        onClick={() => {
                          window.print();
                        }}
                        className="px-2 py-1 rounded bg-[#FF4D00] text-white font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" /> Print PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-4 h-[75vh] flex flex-col justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500" /> AI Study Assistant Chat
              </h2>
              <p className="text-xs text-gray-400">Ask the FireStudy Coach anything. Get answers powered by Gemini 3.5 Flash.</p>
            </div>

            {/* Chat Messages display area */}
            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#121212] border border-orange-500/10 space-y-4">
              {aiChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-orange-500" : "bg-orange-950/40 border border-orange-500/30 text-orange-400"}`}>
                    {msg.role === "user" ? <User className="w-4.5 h-4.5" /> : <Flame className="w-4.5 h-4.5 fill-orange-500" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#FF4D00] to-[#FF9800] text-white rounded-tr-none"
                      : "bg-[#1A1A1A] text-gray-300 rounded-tl-none border border-orange-500/5"
                  }`}>
                    <p className="font-sans whitespace-pre-wrap">{msg.content}</p>
                    <span className="block text-[8px] opacity-40 text-right font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {aiLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 flex items-center justify-center animate-pulse">
                    <Flame className="w-4.5 h-4.5 fill-orange-500" />
                  </div>
                  <div className="p-4 rounded-2xl text-xs bg-[#1A1A1A] border border-orange-500/5 text-gray-400 rounded-tl-none flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="font-mono text-[10px]">Tutor thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions buttons */}
            <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none text-[11px]">
              {[
                "Explain Newton's third law with examples",
                "How to solve JEE math fast?",
                "Outline a 5-day Class 10 study plan",
                "Explain chemical exothermic reaction"
              ].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAiInput(sug)}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-orange-500/5 hover:border-orange-500/30 text-orange-400 whitespace-nowrap cursor-pointer transition-colors"
                >
                  💡 {sug}
                </button>
              ))}
            </div>

            {/* Chat Form */}
            <form onSubmit={handleAiChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={currentAiInput}
                onChange={(e) => setCurrentAiInput(e.target.value)}
                placeholder="Ask Physics Wallah query or textbook formula..."
                className="flex-1 bg-[#121212] border border-orange-500/10 focus:border-orange-500/50 focus:outline-none rounded-2xl px-4 py-3.5 text-xs text-white"
                disabled={aiLoading}
              />
              <button
                type="submit"
                disabled={!currentAiInput.trim() || aiLoading}
                className="px-5 rounded-2xl bg-[#FF4D00] hover:bg-orange-500 text-white flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        );

      case "quiz":
        const currentQ = QUIZ_QUESTIONS[currentQuizQuestion];
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-white-toggle flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-orange-500" /> FireStudy Concept Arena
              </h2>
              <p className="text-xs text-gray-400">Test your retention, acquire XP and unlock 'Inferno Scholar' badges!</p>
            </div>

            {!quizFinished ? (
              <div className="p-6 rounded-3xl bg-surface border border-orange-500/10 space-y-6 shadow-2xl">
                {/* Score and count header */}
                <div className="flex justify-between items-center text-xs text-gray-400 border-b border-dark-toggle pb-4">
                  <span className="font-mono">Question {currentQuizQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="font-mono text-orange-400">Current Score: {quizScore}/{QUIZ_QUESTIONS.length}</span>
                </div>

                {/* Visual Progress bar */}
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="bg-[#FF4D00] h-full transition-all duration-300" style={{ width: `${((currentQuizQuestion) / QUIZ_QUESTIONS.length) * 100}%` }} />
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[9px] uppercase tracking-wider font-bold">
                    {currentQ.subject} Topic
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white-toggle">
                    {currentQ.question}
                  </h3>
                </div>

                {/* Options list */}
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => {
                    let optionStyle = "border-orange-500/10 hover:border-orange-500/40 bg-[#121212]";
                    if (selectedQuizOption === idx) {
                      optionStyle = "border-orange-500 bg-orange-500/10 text-white";
                    }

                    if (quizSubmitted) {
                      if (idx === currentQ.correctAnswer) {
                        optionStyle = "border-green-500 bg-green-500/10 text-green-400 font-bold";
                      } else if (selectedQuizOption === idx) {
                        optionStyle = "border-red-500 bg-red-500/10 text-red-400";
                      } else {
                        optionStyle = "border-orange-500/5 opacity-50 bg-[#121212]";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full p-4 rounded-2xl text-xs text-left border cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && idx === currentQ.correctAnswer && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanatory notes when submitted */}
                {quizSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs text-gray-300 space-y-1"
                  >
                    <p className="font-bold text-orange-400">🔥 Faculty Insight:</p>
                    <p>{currentQ.explanation}</p>
                  </motion.div>
                )}

                {/* Bottom Action buttons */}
                <div className="flex justify-end pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuizAnswer}
                      disabled={selectedQuizOption === null}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#FF9800] hover:brightness-110 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Verify Concept
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="px-6 py-3 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {currentQuizQuestion === QUIZ_QUESTIONS.length - 1 ? "Complete Arena" : "Next Question"} <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Quiz Finished Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-surface border border-orange-500/10 text-center space-y-6"
              >
                <Award className="w-16 h-16 text-orange-500 mx-auto fill-orange-500 glow-text-orange" />
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white-toggle">Arena Study Cleared!</h3>
                  <p className="text-xs text-gray-400">You scored {quizScore} out of {QUIZ_QUESTIONS.length}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-orange-500/5 max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Performance Rating:</span>
                    <span className="text-orange-400 font-bold">
                      {quizScore === 4 ? "Perfect Inferno 🔥" : quizScore >= 3 ? "Bright Flame ⚡" : "Spark Starter ✨"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Rewards Earned:</span>
                    <span className="text-orange-400 font-bold">+{quizScore * 50} XP</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={resetQuiz}
                    className="px-5 py-3 rounded-xl border border-orange-500/20 hover:bg-orange-500/5 text-orange-400 text-xs font-bold cursor-pointer"
                  >
                    Retake Challenge
                  </button>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="px-5 py-3 rounded-xl bg-[#FF4D00] hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Check Certificate
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        );

      case "badges":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" /> Achievement Badges
              </h2>
              <p className="text-xs text-gray-400">Perform tasks to ignite milestones and collect elite badges.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col items-center text-center gap-3 ${
                    b.unlocked
                      ? "bg-surface border-orange-500/30 shadow-orange-500/5 shadow-2xl glow-border"
                      : "bg-[#141414] border-dashed border-gray-800 opacity-60"
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${b.unlocked ? "bg-orange-500/10 text-orange-500" : "bg-gray-800/20 text-gray-500"}`}>
                    <Flame className={`w-8 h-8 ${b.unlocked ? 'fill-orange-500 animate-pulse' : ''}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white-toggle">{b.title}</h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{b.description}</p>
                  </div>
                  {b.unlocked ? (
                    <span className="text-[10px] text-orange-400 font-mono font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded">
                      Unlocked: {b.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-mono">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "downloads":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-orange-500" /> Offline Download Manager
              </h2>
              <p className="text-xs text-gray-400">Save complete course materials, video lectures and books locally for offline studying.</p>
            </div>

            <div className="space-y-4">
              {downloads.map((dl) => (
                <div key={dl.id} className="p-4 rounded-2xl bg-surface border border-orange-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white-toggle line-clamp-1">{dl.title}</h4>
                      <p className="text-[10px] text-gray-400">{dl.size} • {dl.status.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Progress bar */}
                    <div className="flex-1 sm:w-32 bg-black/40 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF4D00] h-full" style={{ width: `${dl.progress}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-400 w-8 text-right">{dl.progress}%</span>

                    <button 
                      onClick={() => {
                        setDownloads(prev => prev.filter(d => d.id !== dl.id));
                        triggerToast("Offline Storage Cleared", "Lecture package removed from device storage.", "info");
                      }}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-3">
              <h2 className="text-xl font-serif italic font-extrabold text-white-toggle flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#FF4D00] fill-[#FF4D00]" /> Ignite Your Learning Journey.
              </h2>
              <p className="text-xs text-gray-toggle leading-relaxed">
                FireStudy is India's premium conceptual online learning workspace, combining visual luxury with top-tier content integrations. We integrate seamlessly with resources like **Physics Wallah**, **Next Toppers**, **Mission Jeet**, and **BookVerse** to provide structured board preps (Class 9-12), competitive exam guidelines, and free academic resources.
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-orange-500/5 space-y-2">
                <h3 className="text-xs font-bold text-orange-500 uppercase font-mono">1. Premium WebView Player</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Open active curriculum websites directly in an integrated player frame with bookmarks, active sharing, and persistent real-time lesson notes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-orange-500/5 space-y-2">
                <h3 className="text-xs font-bold text-orange-500 uppercase font-mono">2. Intelligent AI Tutor</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Consult the Gemini AI Study Coach inside the console to resolve difficult board exam problems, format physics equations, and organize custom syllabus maps.
                </p>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="p-6 rounded-3xl bg-surface border border-orange-500/10 space-y-4">
              <h3 className="text-base font-bold text-white-toggle flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-orange-500" /> Have Query? Reach FireStudy Faculty
              </h3>
              
              {contactSubmitted ? (
                <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center text-xs text-green-400">
                  ⚡ Fire dispatch complete. Faculty support will spark back shortly!
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Name"
                      className="p-3 rounded-xl bg-[#121212] border border-orange-500/10 focus:border-orange-500/50 focus:outline-none text-xs text-white"
                    />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Your Student Email"
                      className="p-3 rounded-xl bg-[#121212] border border-orange-500/10 focus:border-orange-500/50 focus:outline-none text-xs text-white"
                    />
                  </div>
                  <textarea
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Describe your board syllabus, classes query, or subscription issue..."
                    rows={4}
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 focus:border-orange-500/50 focus:outline-none text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FF4D00] hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Send Spark Dispatch
                  </button>
                </form>
              )}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-lg font-bold tracking-tight text-white-toggle flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" /> System Settings
            </h2>

            <div className="p-6 rounded-3xl bg-surface border border-orange-500/10 space-y-6 shadow-xl">
              {/* Profile Config */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest font-mono">Academic Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400">Display Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400">Student Email</label>
                    <input
                      type="text"
                      value={profile.email}
                      onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="border-t border-dark-toggle pt-6 space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest font-mono">Display Mode</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white-toggle">Light Theme Toggle</p>
                    <p className="text-[10px] text-gray-400">Toggle between premium Obsidian and Solar styles.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsLightTheme(l => !l);
                      triggerToast("Display Updated", "Switched display theme successfully.", "info");
                    }}
                    className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${isLightTheme ? 'bg-orange-500' : 'bg-gray-800'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isLightTheme ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Reset Database */}
              <div className="border-t border-dark-toggle pt-6 space-y-3">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest font-mono">DANGER ZONE</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white-toggle">Wipe Student Logs</p>
                    <p className="text-[10px] text-gray-400">Resets studied hours, certificates, quizzes and custom notes.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Do you want to reset your local student progress?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    Wipe Storage
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Splendid FireStudy Splash Screen Animation */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#070707] flex flex-col items-center justify-center p-6"
          >
            <div className="text-center space-y-6 max-w-sm">
              {/* Spinning / Pulsing Fire Emblem */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0, rotate: -45 }}
                animate={{ scale: [1, 1.12, 1], opacity: 1, rotate: 0 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#FF4D00] to-[#FF9800] p-0.5 shadow-2xl shadow-orange-500/20"
              >
                <div className="w-full h-full rounded-3xl bg-[#0d0d0d] flex items-center justify-center">
                  <Flame className="w-14 h-14 text-[#FF4D00] fill-[#FF4D00] drop-shadow-[0_0_15px_rgba(255,77,0,0.6)]" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-extrabold tracking-wider text-white"
                >
                  FIRE<span className="text-[#FF4D00]">STUDY</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-orange-400 font-medium font-mono uppercase tracking-widest"
                >
                  "Ignite Your Learning Journey."
                </motion.p>
              </div>

              {/* Loader progress */}
              <div className="w-40 mx-auto h-1 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#FF4D00] to-[#FF9800]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Authentication Screen Overlay (If not logged in) */}
      {!showSplash && !profile.isLoggedIn && (
        <div className="fixed inset-0 z-40 bg-[#0d0d0d] flex items-center justify-center p-4 overflow-y-auto">
          {/* Flame backdrop lights */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 radial-glow-back opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 radial-glow-back opacity-30" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface border border-orange-500/15 shadow-2xl relative z-10 space-y-6"
          >
            {/* Form brand info */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
                <Flame className="w-7 h-7 fill-[#FF4D00] text-transparent" />
              </div>
              <h2 className="text-2xl font-black text-white">FIRE<span className="text-[#FF4D00]">STUDY</span></h2>
              <p className="text-xs text-orange-400 font-medium font-mono tracking-wider uppercase">Ignite Your Learning Journey</p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-xs text-red-500 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {authError}
              </div>
            )}

            {/* Toggle Modes */}
            <div className="flex bg-[#141414] p-1 rounded-xl">
              <button
                onClick={() => { setAuthMode("login"); setAuthError(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${authMode === "login" ? "bg-orange-500 text-white shadow" : "text-gray-400"}`}
              >
                Login
              </button>
              <button
                onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${authMode === "signup" ? "bg-orange-500 text-white shadow" : "text-gray-400"}`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Fields */}
            {authMode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-medium">STUDENT EMAIL</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="aman@firestudy.edu"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-gray-400 font-medium">PASSWORD</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                      className="text-[9px] text-orange-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#FF9800] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
                >
                  Unlock Dashboard
                </button>
              </form>
            )}

            {authMode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-medium">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Aman Sharma"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-medium">STUDENT EMAIL</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="aman@firestudy.edu"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-medium">CHOOSE PASSWORD</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-orange-500/10 text-xs text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#FF9800] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-orange-500/10 transition-all cursor-pointer"
                >
                  Create Student ID
                </button>
              </form>
            )}

            {authMode === "forgot" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">Enter your student email and we will fire a link to configure a password reset.</p>
                <div className="space-y-1">
                  <input
                    type="email"
                    placeholder="aman@firestudy.edu"
                    className="w-full p-3 rounded-xl bg-[#121212] border border-[#FF4D00]/20 text-xs text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAuthMode("login")}
                    className="flex-1 py-3.5 rounded-xl border border-gray-800 text-gray-400 text-xs font-bold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      triggerToast("✉️ Link Fired!", "Check your inbox for the resets parameters.");
                      setAuthMode("login");
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Fire reset link
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-mono">OR</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* Google Sign-In button UI */}
            <button
              onClick={() => {
                setProfile(p => ({
                  ...p,
                  isLoggedIn: true,
                  name: "Aman Sharma (Google)",
                  email: "aman.google@gmail.com"
                }));
                triggerToast("🔥 Signed via Google", "Google ecosystem linked safely.");
              }}
              className="w-full py-3 rounded-xl border border-gray-800 hover:bg-orange-500/5 transition-all text-xs text-white flex items-center justify-center gap-2 font-semibold cursor-pointer"
            >
              {/* Simple G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.41 3.65 1.51 7.5l3.86 3C6.27 7.72 8.91 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.5z" />
                <path fill="#FBBC05" d="M5.37 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.51 6.9C.55 8.93 0 11.2 0 13.6c0 2.4.55 4.67 1.51 6.7l3.86-3.1z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.27 1.09-3.09 0-5.73-2.68-6.63-5.46l-3.86 3C3.41 20.35 7.35 23 12 23z" />
              </svg>
              Sign in with Google
            </button>

            {/* Guest Mode Option */}
            <button
              onClick={handleGuestLogin}
              className="w-full py-2.5 rounded-xl bg-orange-950/20 text-orange-400 hover:bg-orange-950/40 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Skip as Guest <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}

      {/* 3. Main Portal Application (Header, Sidebar, Workspace) */}
      {!showSplash && profile.isLoggedIn && (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          
          {/* DESKTOP SIDEBAR NAVIGATION */}
          <aside className="hidden md:flex flex-col justify-between w-64 border-r border-orange-500/10 bg-[#0A0A0A] p-5 shrink-0">
            <div className="space-y-8">
              {/* Brand Header */}
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D00] to-[#FF9800] p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#0d0d0d] rounded-xl flex items-center justify-center">
                    <Flame className="w-5.5 h-5.5 text-[#FF4D00] fill-[#FF4D00]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-black text-white leading-none tracking-wide">FIRE<span className="text-[#FF4D00]">STUDY</span></h2>
                  <span className="text-[9px] text-gray-500 font-medium">STABLE V2.4.0</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {[
                  { id: "home", label: "Syllabus Hub", icon: Compass },
                  { id: "dashboard", label: "Dashboard", icon: User },
                  { id: "ai", label: "AI Study Coach", icon: Sparkles },
                  { id: "quiz", label: "Concept Quiz", icon: Zap },
                  { id: "badges", label: "Badges & XP", icon: Award },
                  { id: "downloads", label: "Offline Cache", icon: DownloadCloud },
                  { id: "about", label: "About Platform", icon: Info },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-[#FF4D00]/10 to-transparent border-l-2 border-[#FF4D00] text-white"
                          : "text-gray-400 hover:text-white hover:bg-orange-500/5"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${activeTab === item.id ? "text-orange-500" : ""}`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer User detail */}
            <div className="border-t border-dark-toggle pt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
                  {profile.name.charAt(0)}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                  <p className="text-[9px] text-orange-400 font-mono">{profile.xp} XP • Lv.2</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg text-gray-500 hover:text-red-400" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* MOBILE NAVIGATION HEADER */}
          <header className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-orange-500/10">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
              <Flame className="w-6 h-6 text-[#FF4D00] fill-[#FF4D00]" />
              <h1 className="text-base font-black text-white">FIRE<span className="text-[#FF4D00]">STUDY</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveTab("dashboard");
                  triggerToast("🔔 Notifications Checked", "No new unread bulletins today.", "info");
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-white"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl text-gray-400 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </header>

          {/* MOBILE DRAWER NAVIGATION OVERLAY */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="fixed inset-y-0 left-0 z-30 w-64 bg-[#0A0A0A] p-5 shadow-2xl flex flex-col justify-between border-r border-orange-500/10 md:hidden"
              >
                <div className="space-y-8 pt-16">
                  <nav className="space-y-2">
                    {[
                      { id: "home", label: "Syllabus Hub", icon: Compass },
                      { id: "dashboard", label: "Dashboard", icon: User },
                      { id: "ai", label: "AI Study Coach", icon: Sparkles },
                      { id: "quiz", label: "Concept Quiz", icon: Zap },
                      { id: "badges", label: "Badges & XP", icon: Award },
                      { id: "downloads", label: "Offline Cache", icon: DownloadCloud },
                      { id: "about", label: "About Platform", icon: Info },
                      { id: "settings", label: "Settings", icon: Settings }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                            activeTab === item.id
                              ? "bg-[#FF4D00]/10 text-white border-l-2 border-[#FF4D00]"
                              : "text-gray-400"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5 text-orange-500" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="border-t border-dark-toggle pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-white-toggle">{profile.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 text-xs font-semibold">Logout</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN PAGE AREA */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {/* Top Info Header with Bell Bulletins */}
            <div className="hidden md:flex justify-between items-center pb-6 mb-6 border-b border-orange-500/10">
              <div>
                <p className="text-xs text-orange-500 uppercase font-mono font-bold tracking-widest">
                  🔥 Status: Ignite Study Mode Active
                </p>
                <h1 className="text-xl font-bold tracking-tight text-white-toggle">
                  Welcome Back, {profile.name}!
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Learning streak quick label */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4D00]/10 border border-[#FF4D00]/20 rounded-xl text-[#FF4D00] text-xs font-bold">
                  <Flame className="w-4 h-4 fill-[#FF4D00]" />
                  <span>{profile.streak}-Day Streak</span>
                </div>

                {/* Notifications bulletin button */}
                <button 
                  onClick={() => {
                    setActiveTab("dashboard");
                    triggerToast("🔔 Dashboard Alerts Loaded", "Check your recent activities feed below.");
                  }}
                  className="p-2.5 rounded-xl bg-surface border border-orange-500/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dynamic tab contents router */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}

      {/* 4. IMMERSIVE COMPREHENSIVE WEBVIEW PLAYER (IFRAME OVERLAY) */}
      <AnimatePresence>
        {selectedCourseForPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between"
          >
            {/* Action control header */}
            <header className="p-4 bg-[#0a0a0a] border-b border-orange-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCourseForPlayer(null)}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-orange-500/10 text-orange-500 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {selectedCourseForPlayer.title} <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded uppercase tracking-wider font-mono">Live Study Frame</span>
                  </h3>
                  <p className="text-[10px] text-gray-500">Studying at: {playerMode === "ott" ? selectedCourseForPlayer.ottLink : selectedCourseForPlayer.studyLink}</p>
                </div>
              </div>

              {/* Action buttons list */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {selectedCourseForPlayer.ottLink && (
                  <div className="bg-[#141414] p-0.5 rounded-xl border border-orange-500/15 flex">
                    <button
                      onClick={() => { setPlayerMode("study"); setPlayerIframeLoading(true); }}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${playerMode === "study" ? "bg-orange-500 text-white" : "text-gray-400"}`}
                    >
                      Study Web
                    </button>
                    <button
                      onClick={() => { setPlayerMode("ott"); setPlayerIframeLoading(true); }}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${playerMode === "ott" ? "bg-orange-500 text-white" : "text-gray-400"}`}
                    >
                      OTT Mode
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setPlayerIframeLoading(true)}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-orange-500/10 text-orange-500"
                  title="Refresh webview"
                >
                  <RefreshCw className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={() => downloadCourseOffline(selectedCourseForPlayer)}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-orange-500/10 text-orange-500"
                  title="Cache materials offline"
                >
                  <DownloadCloud className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(playerMode === "ott" ? selectedCourseForPlayer.ottLink || "" : selectedCourseForPlayer.studyLink);
                    triggerToast("🔗 Link Copied", "Shareable class link copied to clipboard.");
                  }}
                  className="p-2 rounded-xl bg-[#141414] hover:bg-orange-500/10 text-orange-500"
                  title="Share link"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>

                <a
                  href={playerMode === "ott" ? selectedCourseForPlayer.ottLink : selectedCourseForPlayer.studyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#141414] hover:bg-orange-500/10 text-orange-500 flex items-center justify-center"
                  title="Open in default browser"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                </a>
              </div>
            </header>

            {/* Split Screen Web Content + Study Notes Panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-black">
              {/* iframe Container */}
              <div className="flex-1 h-full relative bg-[#070707]">
                {playerIframeLoading && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    {/* Pulsing ring */}
                    <div className="w-12 h-12 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Connecting FireStudy Tunnel</p>
                      <p className="text-[10px] text-gray-500">Embedding platform: {selectedCourseForPlayer.title}</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={playerMode === "ott" ? selectedCourseForPlayer.ottLink : selectedCourseForPlayer.studyLink}
                  title="FireStudy embedded WebView frame"
                  className="w-full h-full border-0 bg-white"
                  onLoad={() => setPlayerIframeLoading(false)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>

              {/* Study Notes Sidebar inside Player */}
              <div className="w-full lg:w-80 h-48 lg:h-full border-t lg:border-t-0 lg:border-l border-orange-500/10 bg-[#0A0A0A] p-4 flex flex-col justify-between gap-3 text-left">
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-orange-500" /> Persistent Lecture Notes
                    </h4>
                    <p className="text-[9px] text-gray-500">Draft equations, formulas, or summaries here. Saved in local memory.</p>
                  </div>

                  <textarea
                    value={playerNotesInput}
                    onChange={(e) => setPlayerNotesInput(e.target.value)}
                    placeholder="Write NCERT definitions, combustion equations or Class 9-12 board answers..."
                    className="flex-1 w-full p-2.5 rounded-xl bg-[#121212] border border-orange-500/10 focus:outline-none focus:border-orange-500/50 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPlayerNotesInput("")}
                    className="p-2.5 rounded-xl border border-gray-800 text-gray-400 text-xs font-semibold hover:bg-red-500/10 cursor-pointer"
                    title="Clear content"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={savePlayerNote}
                    className="flex-1 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Course Notes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. APP-WIDE FLOATING TOAST SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel shadow-2xl border-orange-500/30 flex items-center gap-3.5 max-w-sm pointer-events-auto"
          >
            <div className={`p-2.5 rounded-xl ${toastMessage.type === "achievement" ? "bg-orange-500 text-white animate-bounce" : "bg-orange-500/10 text-[#FF4D00]"}`}>
              {toastMessage.type === "achievement" ? <Award className="w-5.5 h-5.5" /> : <Flame className="w-5.5 h-5.5 fill-current" />}
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-bold text-white-toggle">{toastMessage.title}</h4>
              <p className="text-[10px] text-gray-toggle leading-relaxed">{toastMessage.desc}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-500 hover:text-white shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Footer Credit */}
      <footer className="text-center py-4 bg-black/40 text-[10px] text-gray-600 border-t border-orange-500/5">
        <p>© 2026 FireStudy Ecosystem. "Ignite Your Learning Journey." Made with ❤️ for Scholars.</p>
      </footer>

    </div>
  );
}
