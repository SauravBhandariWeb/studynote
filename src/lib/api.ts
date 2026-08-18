import axios from "axios"

import type {
  AuthResponse,
  Collection,
  DashboardStats,
  Lecture,
  Note,
  StudyGoal,
  StudySession,
  StudyStreak,
  Subject,
  User,
} from "@/types"

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ---------- Auth ---------- */

export const authApi = {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const { data } =
      await api.post<AuthResponse>(
        "/auth/register",
        {
          name,
          email,
          password,
        },
      )

    return data
  },

  async login(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const { data } =
      await api.post<AuthResponse>(
        "/auth/login",
        {
          email,
          password,
        },
      )

    return data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },

  async forgotPassword(
    email: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.post<{
        message: string
      }>(
        "/auth/forgot-password",
        { email },
      )

    return data
  },

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.post<{
        message: string
      }>(
        "/auth/reset-password",
        {
          token,
          password,
        },
      )

    return data
  },

  async getProfile(): Promise<User> {
    const { data } =
      await api.get<User>("/auth/me")

    return data
  },

  async updateProfile(
    updates: { name?: string },
  ): Promise<User> {
    const { data } =
      await api.patch<User>(
        "/auth/me",
        updates,
      )

    return data
  },

  getStoredUser(): User | null {
    const raw =
      localStorage.getItem(
        "studynote_user",
      )

    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },

  clearStoredUser(): void {
    localStorage.removeItem(
      "studynote_user",
    )
  },
}

/* ---------- Subjects ---------- */

export const subjectApi = {
  async list(): Promise<Subject[]> {
    const { data } =
      await api.get<Subject[]>(
        "/subjects",
      )

    return data
  },

  async create(payload: {
    name: string
    color: string
    icon: string
  }): Promise<Subject> {
    const { data } =
      await api.post<Subject>(
        "/subjects",
        payload,
      )

    return data
  },

  async update(
    id: string,
    payload: Partial<Subject>,
  ): Promise<Subject> {
    const { data } =
      await api.patch<Subject>(
        `/subjects/${id}`,
        payload,
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/subjects/${id}`,
      )

    return data
  },
}

/* ---------- Collections ---------- */

export const collectionApi = {
  async list(): Promise<Collection[]> {
    const { data } =
      await api.get<Collection[]>(
        "/collections",
      )

    return data
  },

  async create(payload: {
    name: string
    description?: string
  }): Promise<Collection> {
    const { data } =
      await api.post<Collection>(
        "/collections",
        payload,
      )

    return data
  },

  async update(
    id: string,
    payload: Partial<Collection>,
  ): Promise<Collection> {
    const { data } =
      await api.patch<Collection>(
        `/collections/${id}`,
        payload,
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/collections/${id}`,
      )

    return data
  },

  async addLecture(
    id: string,
    lectureId: string,
  ): Promise<Collection> {
    const { data } =
      await api.post<Collection>(
        `/collections/${id}/lectures`,
        {
          lectureId,
        },
      )

    return data
  },

  async removeLecture(
    id: string,
    lectureId: string,
  ): Promise<Collection> {
    const { data } =
      await api.delete<Collection>(
        `/collections/${id}/lectures/${lectureId}`,
      )

    return data
  },
}

/* ---------- Lectures ---------- */

export const lectureApi = {
  async list(params?: {
    subjectId?: string
    search?: string
  }): Promise<Lecture[]> {
    const { data } =
      await api.get<Lecture[]>(
        "/lectures",
        {
          params,
        },
      )

    return data
  },

  async getById(
    id: string,
  ): Promise<Lecture> {
    const { data } =
      await api.get<Lecture>(
        `/lectures/${id}`,
      )

    return data
  },

  async create(payload: {
    title: string
    youtubeId: string
    channelName?: string
    subjectId?: string | null
    thumbnailUrl?: string
    duration?: string
    tags?: string[]
  }): Promise<Lecture> {
    try {
      const { data } =
        await api.post<Lecture>(
          "/lectures",
          payload,
        )

      return data
    } catch (error) {
      /*
       * A 409 means the backend rejected this
       * lecture because it conflicts with
       * something that already exists.
       */
      if (
        axios.isAxiosError(
          error,
        ) &&
        error.response?.status === 409
      ) {
        throw new Error(
          "This YouTube lecture is already in your library.",
        )
      }

      throw error
    }
  },

  async update(
    id: string,
    payload: Partial<Lecture>,
  ): Promise<Lecture> {
    const { data } =
      await api.patch<Lecture>(
        `/lectures/${id}`,
        payload,
      )

    return data
  },

  async updateProgress(
    id: string,
    progress: number,
    completed?: boolean,
  ): Promise<Lecture> {
    const { data } =
      await api.patch<Lecture>(
        `/lectures/${id}/progress`,
        {
          progress,
          completed,
        },
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/lectures/${id}`,
      )

    return data
  },
}

/* ---------- Notes ---------- */

export const noteApi = {
  async listByLecture(
    lectureId: string,
  ): Promise<Note[]> {
    const { data } =
      await api.get<Note[]>(
        `/lectures/${lectureId}/notes`,
      )

    return data
  },

  async listAll(
    params?: {
      important?: boolean
    },
  ): Promise<Note[]> {
    const { data } =
      await api.get<Note[]>(
        "/notes",
        {
          params,
        },
      )

    return data
  },

  async create(payload: {
    lectureId: string
    timestamp: number
    timestampLabel: string
    content: string
    isImportant?: boolean
  }): Promise<Note> {
    const { data } =
      await api.post<Note>(
        "/notes",
        payload,
      )

    return data
  },

  async update(
    id: string,
    payload: Partial<Note>,
  ): Promise<Note> {
    const { data } =
      await api.patch<Note>(
        `/notes/${id}`,
        payload,
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/notes/${id}`,
      )

    return data
  },
}

/* ---------- Study Sessions ---------- */

export const sessionApi = {
  async list(): Promise<StudySession[]> {
    const { data } =
      await api.get<StudySession[]>(
        "/sessions",
      )

    return data
  },

  async create(payload: {
    lectureId?: string | null
    subjectId?: string | null
    duration: number
    notes?: string
  }): Promise<StudySession> {
    const { data } =
      await api.post<StudySession>(
        "/sessions",
        payload,
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/sessions/${id}`,
      )

    return data
  },
}

/* ---------- Study Goals ---------- */

export const goalApi = {
  async list(): Promise<StudyGoal[]> {
    const { data } =
      await api.get<StudyGoal[]>(
        "/goals",
      )

    return data
  },

  async create(payload: {
    title: string
    targetHours: number
    deadline: string
  }): Promise<StudyGoal> {
    const { data } =
      await api.post<StudyGoal>(
        "/goals",
        payload,
      )

    return data
  },

  async update(
    id: string,
    payload: Partial<StudyGoal>,
  ): Promise<StudyGoal> {
    const { data } =
      await api.patch<StudyGoal>(
        `/goals/${id}`,
        payload,
      )

    return data
  },

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const { data } =
      await api.delete<{
        message: string
      }>(
        `/goals/${id}`,
      )

    return data
  },
}

/* ---------- Streak ---------- */

export const streakApi = {
  async get(): Promise<StudyStreak> {
    const { data } =
      await api.get<StudyStreak>(
        "/sessions/streak",
      )

    return data
  },
}

/* ---------- Dashboard ---------- */

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const { data } =
      await api.get<DashboardStats>(
        "/dashboard/stats",
      )

    return data
  },
}

/* ---------- YouTube Utilities ---------- */

export function extractYouTubeId(
  url: string,
): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match =
      url.match(pattern)

    if (match) {
      return match[1]
    }
  }

  if (
    /^[a-zA-Z0-9_-]{11}$/.test(
      url,
    )
  ) {
    return url
  }

  return ""
}

export function getYouTubeThumbnail(
  youtubeId: string,
): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
}