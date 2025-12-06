# Frontend Structure - Enhanced LMS

## Updated Folder Structure

```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   └── CourseLayout.tsx
│   │
│   ├── navigation/
│   │   ├── GlobalNav.tsx
│   │   ├── CourseNav.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseHeader.tsx
│   │   ├── CourseProgress.tsx
│   │   ├── ModuleList.tsx
│   │   ├── ModuleItem.tsx
│   │   ├── LessonList.tsx
│   │   ├── LessonItem.tsx
│   │   └── CourseSyllabus.tsx
│   │
│   ├── lesson/
│   │   ├── LessonPlayer.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── ArticleViewer.tsx
│   │   ├── PDFViewer.tsx
│   │   ├── LessonNavigation.tsx
│   │   └── LessonResources.tsx
│   │
│   ├── assignment/
│   │   ├── AssignmentList.tsx
│   │   ├── AssignmentCard.tsx
│   │   ├── AssignmentDetail.tsx
│   │   ├── SubmissionForm.tsx
│   │   └── GradeDisplay.tsx
│   │
│   ├── quiz/
│   │   ├── QuizList.tsx
│   │   ├── QuizCard.tsx
│   │   ├── QuizPlayer.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── QuizResults.tsx
│   │   └── QuizTimer.tsx
│   │
│   ├── discussion/
│   │   ├── DiscussionList.tsx
│   │   ├── DiscussionThread.tsx
│   │   ├── DiscussionPost.tsx
│   │   ├── ReplyForm.tsx
│   │   └── DiscussionFilters.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardStats.tsx
│   │   ├── ContinueLearning.tsx
│   │   ├── UpcomingAssignments.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── AnnouncementsWidget.tsx
│   │   └── ProgressChart.tsx
│   │
│   ├── grade/
│   │   ├── GradeBook.tsx
│   │   ├── GradeTable.tsx
│   │   ├── GradeChart.tsx
│   │   └── GradeSummary.tsx
│   │
│   ├── announcement/
│   │   ├── AnnouncementList.tsx
│   │   ├── AnnouncementCard.tsx
│   │   └── AnnouncementDetail.tsx
│   │
│   ├── calendar/
│   │   ├── Calendar.tsx
│   │   ├── EventList.tsx
│   │   ├── EventCard.tsx
│   │   └── EventModal.tsx
│   │
│   ├── notification/
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationList.tsx
│   │   └── NotificationItem.tsx
│   │
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileEdit.tsx
│   │   ├── AvatarUpload.tsx
│   │   └── BadgeDisplay.tsx
│   │
│   ├── accessibility/
│   │   ├── AccessibilityPanel.tsx
│   │   ├── TextToSpeech.tsx
│   │   ├── FontSizeControl.tsx
│   │   ├── ContrastToggle.tsx
│   │   └── KeyboardShortcuts.tsx
│   │
│   └── admin/
│       ├── UserManagement.tsx
│       ├── CourseManagement.tsx
│       ├── Analytics.tsx
│       └── Settings.tsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   └── StudentDashboard.tsx
│   │
│   ├── courses/
│   │   ├── CoursesPage.tsx
│   │   ├── CourseDetailPage.tsx
│   │   ├── CourseHomePage.tsx
│   │   ├── ModulePage.tsx
│   │   └── LessonPage.tsx
│   │
│   ├── assignments/
│   │   ├── AssignmentsPage.tsx
│   │   ├── AssignmentDetailPage.tsx
│   │   └── SubmissionPage.tsx
│   │
│   ├── quizzes/
│   │   ├── QuizzesPage.tsx
│   │   ├── QuizDetailPage.tsx
│   │   ├── QuizAttemptPage.tsx
│   │   └── QuizResultsPage.tsx
│   │
│   ├── discussions/
│   │   ├── DiscussionsPage.tsx
│   │   └── DiscussionDetailPage.tsx
│   │
│   ├── grades/
│   │   └── GradesPage.tsx
│   │
│   ├── calendar/
│   │   └── CalendarPage.tsx
│   │
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── UsersPage.tsx
│   │   └── AnalyticsPage.tsx
│   │
│   └── static/
│       ├── HomePage.tsx
│       ├── AboutPage.tsx
│       └── HelpPage.tsx
│
├── store/
│   ├── authStore.ts
│   ├── courseStore.ts
│   ├── lessonStore.ts
│   ├── assignmentStore.ts
│   ├── quizStore.ts
│   ├── discussionStore.ts
│   ├── gradeStore.ts
│   ├── notificationStore.ts
│   ├── calendarStore.ts
│   ├── accessibilityStore.ts
│   └── uiStore.ts
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── courseService.ts
│   ├── lessonService.ts
│   ├── assignmentService.ts
│   ├── quizService.ts
│   ├── discussionService.ts
│   ├── gradeService.ts
│   ├── notificationService.ts
│   ├── calendarService.ts
│   ├── uploadService.ts
│   └── analyticsService.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCourse.ts
│   ├── useLesson.ts
│   ├── useProgress.ts
│   ├── useNotifications.ts
│   ├── useTextToSpeech.ts
│   ├── useKeyboardNav.ts
│   ├── useDebounce.ts
│   └── useInfiniteScroll.ts
│
├── context/
│   ├── AuthContext.tsx
│   ├── CourseContext.tsx
│   ├── AccessibilityContext.tsx
│   └── ThemeContext.tsx
│
├── types/
│   ├── index.ts
│   ├── course.types.ts
│   ├── lesson.types.ts
│   ├── assignment.types.ts
│   ├── quiz.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   ├── dateUtils.ts
│   └── accessibility.ts
│
├── styles/
│   ├── theme.ts
│   ├── global.css
│   ├── variables.css
│   └── accessibility.css
│
├── routes/
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   └── RoleBasedRoute.tsx
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## Key Component Examples

### 1. Dashboard Component Structure
```typescript
// DashboardPage.tsx
- DashboardStats (enrolled courses, completed, in progress)
- ContinueLearning (recent courses with progress)
- UpcomingAssignments (due soon)
- AnnouncementsWidget (latest announcements)
- CalendarWidget (upcoming events)
- RecentActivity (activity feed)
```

### 2. Course Navigation Structure
```typescript
// CourseLayout.tsx
- CourseHeader (title, instructor, progress)
- CourseNav (sidebar with sections)
  - Home
  - Smart Search
  - Announcements
  - Assignments
  - Discussions
  - Pages
  - Syllabus
  - Quizzes
  - Modules
  - Collaborations
  - Grades
  - Badges
```

### 3. Module/Lesson Hierarchy
```typescript
// ModuleList.tsx
  - ModuleItem (expandable)
    - LessonList
      - LessonItem (with icon, duration, completion status)
```

## State Management (Zustand)

### Course Store
```typescript
interface CourseStore {
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: Course[];
  fetchCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  getCourseProgress: (courseId: string) => Promise<number>;
}
```

### Lesson Store
```typescript
interface LessonStore {
  currentLesson: Lesson | null;
  lessonProgress: Map<string, LessonProgress>;
  markLessonComplete: (lessonId: string) => Promise<void>;
  updateProgress: (lessonId: string, progress: number) => Promise<void>;
}
```

### Assignment Store
```typescript
interface AssignmentStore {
  assignments: Assignment[];
  submissions: Submission[];
  submitAssignment: (assignmentId: string, data: FormData) => Promise<void>;
  getUpcomingAssignments: () => Assignment[];
}
```

## Routing Structure

```typescript
// AppRoutes.tsx
/                           → HomePage
/login                      → LoginPage
/signup                     → SignupPage
/dashboard                  → DashboardPage (protected)
/courses                    → CoursesPage (protected)
/courses/:id                → CourseDetailPage (protected)
/courses/:id/home           → CourseHomePage (protected)
/courses/:id/modules        → ModulesPage (protected)
/courses/:id/lessons/:lessonId → LessonPage (protected)
/courses/:id/assignments    → AssignmentsPage (protected)
/courses/:id/quizzes        → QuizzesPage (protected)
/courses/:id/discussions    → DiscussionsPage (protected)
/courses/:id/grades         → GradesPage (protected)
/calendar                   → CalendarPage (protected)
/profile                    → ProfilePage (protected)
/admin                      → AdminDashboard (admin only)
```

## Accessibility Features Integration

Every component should include:
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- High contrast mode support
- Text-to-speech integration
- Adjustable font sizes
- Skip navigation links
