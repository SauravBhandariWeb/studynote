# StudyNote — YouTube Lecture & Note-Taking Platform

## App Flow

### 1. Landing & Authentication

- **Landing Page** — Public entry point showing the app's features. Two CTA buttons lead to **Login** or **Register**.
- **Register** — New users create an account with name, email, and password.
- **Login** — Returning users sign in with email and password. On success, an HTTP-only cookie is set and the user is redirected to the Dashboard.
- **Forgot Password** — Users enter their email to receive a reset link.
- **Reset Password** — Users set a new password using the token from the reset email.

All app pages (everything after login) are protected — unauthenticated visitors are redirected to the Login page.

### 2. Dashboard

After logging in, users land on the **Dashboard**, which gives an at-a-glance overview:

- Total lectures, notes, and study hours
- Current study streak (consecutive days studied)
- Recent study sessions
- Active study goals and progress
- Quick links to add a new lecture or start a study session

### 3. Subjects

Users organize their learning into **Subjects** (e.g. "Calculus", "Organic Chemistry"). Each subject has a name, color, and icon. Subjects are used to organize lectures and notes across the app.

### 4. Lecture Library

The **Lecture Library** is the core content hub:

- Users add YouTube lectures by pasting a YouTube URL — the app extracts the video ID and fetches the thumbnail automatically.
- Each lecture can be tagged with a Subject and custom tags.
- Lectures can be searched and filtered by subject.
- A progress bar shows how much of each lecture has been watched.
- Lectures can be organized into **Collections** (custom playlists).

### 5. Lecture Player (Core Feature)

Clicking a lecture opens the **Lecture Player** page — a split-screen layout:

- **Left side:** The embedded YouTube video plays using the YouTube IFrame API.
- **Right side:** A notes panel where users can:
  - Write notes while watching.
  - Mark notes as important.
  - Filter notes to show only important notes.
  - Edit notes.
  - Delete notes with a confirmation prompt.
- Watch progress is saved automatically as the user watches.

### 6. Notes Page

A centralized view of **all notes** across every lecture:

- Browse, search, and filter all notes in one place.
- Filter by "important only" to review starred notes.
- Search notes by content, lecture, channel, or subject.
- Notes are grouped according to their lecture's subject.
- Notes can be edited or deleted.

### 7. Collections

Users can group lectures into **Collections** (like playlists):

- Create a collection with a name and description.
- Add or remove lectures from a collection.
- Useful for organizing a study plan (e.g. "Midterm Prep", "Week 1 Lectures").

### 8. Revision

The **Revision** page helps users review their saved notes:

- Shows important notes and recent notes for quick re-reading.
- Designed for active recall before exams.
- Important revision notes can be exported as a clean PDF.

### 9. Study Sessions

Users can log **Study Sessions** to track time spent studying:

- Record a session with duration, associated lecture/subject, and optional notes.
- Sessions feed into the Dashboard's study hours and streak calculations.
- Live study timer with pause/resume support.
- Optional study targets with alarm feedback.
- Past sessions can be reviewed and deleted.

### 10. Study Goals

Users can set **Study Goals** with:

- A title (e.g. "Finish Chapter 5")
- A target number of hours
- A deadline date
- Progress tracking against the target

### 11. Profile & Settings

- **Profile** — View and edit name and account details.
- **Settings** — Manage notifications, dark mode, and account preferences.

### Navigation Flow

```text
Landing → Login / Register → Dashboard
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              Lecture Library   Subjects        Study Sessions
                    │
              Lecture Player ←→ Lecture Notes
                    │
              Notes Page (all notes)
                    │
              Revision (review important notes)

              Collections (organize lectures)
              Study Goals (track targets)
              Profile / Settings