export interface User {
  _id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: string
}

export interface Subject {
  _id: string
  userId: string
  name: string
  color: string
  icon: string
  lectureCount: number
  createdAt: string
}

export interface Collection {
  _id: string
  userId: string
  name: string
  description: string
  lectureIds: string[]
  createdAt: string
}

export interface Note {
  _id: string
  userId: string
  lectureId: string
  content: string
  isImportant: boolean
  createdAt: string
  updatedAt: string
}

export interface Lecture {
  _id: string
  userId: string
  subjectId: string | null
  title: string
  youtubeId: string
  channelName: string
  thumbnailUrl: string
  duration: string
  progress: number
  completed: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface StudySession {
  _id: string
  userId: string
  lectureId: string | null
  subjectId: string | null
  duration: number
  date: string
  notes: string
}

export interface StudyGoal {
  _id: string
  userId: string
  title: string
  targetHours: number
  completedHours: number
  deadline: string
  completed: boolean
  createdAt: string
}

export interface StudyStreak {
  _id: string
  userId: string
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
  totalSessions: number
  totalMinutes: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface DashboardStats {
  totalLectures: number
  completedLectures: number
  totalNotes: number
  importantNotes: number
  totalSubjects: number
  currentStreak: number
  totalStudyMinutes: number
  weeklyGoalProgress: number
}
