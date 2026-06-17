export type Role = "student" | "teacher" | "admin" | "super_admin" | "parent";
export type AttendanceStatus = "present" | "absent" | "late";
export type RiskLevel = "high" | "medium" | "low";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type HomeworkSubmissionStatus =
  | "pending_review"
  | "approved"
  | "returned"
  | "graded";

export interface CurriculumAssignment {
  programId: string;
  unitId?: string;
  topicId?: string;
  completed?: boolean;
  completedAt?: string;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
}

export interface ScheduleEntry {
  day: string;
  time: string;
  duration?: number;
}

export interface ClassStudentSummary {
  _id: string;
  name: string;
  country?: string;
  timezone?: string;
  studentId?: string;
}

export interface Class {
  _id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName?: string;
  studentIds: string[];
  students?: ClassStudentSummary[];
  studentCount?: number;
  schedule: ScheduleEntry[];
  meetingLink?: string;
  description?: string;
  level?: string;
  createdAt?: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  role: "student";
}

export interface HomeworkSubmission {
  _id: string;
  studentId: string;
  studentName?: string;
  content: string;
  submittedAt: string;
  status?: HomeworkSubmissionStatus;
  reviewFeedback?: string;
  grade?: Grade;
  feedback?: string;
}

export interface Homework {
  _id: string;
  title: string;
  description?: string;
  classId: string;
  className?: string;
  dueDate: string;
  createdAt?: string;
  submissions?: HomeworkSubmission[];
  submissionCount?: number;
  pendingReviewCount?: number;
  totalStudents?: number;
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  isSubmitted?: boolean;
  mySubmission?: HomeworkSubmission;
}

export interface AttendanceRecord {
  _id: string;
  classId: string;
  className?: string;
  studentId: string;
  studentName?: string;
  date: string;
  status: AttendanceStatus;
}

export interface AttendanceReport {
  classId: string;
  className?: string;
  date: string;
  records: AttendanceRecord[];
  presentCount: number;
  absentCount: number;
  lateCount: number;
  total: number;
}

export interface Progress {
  _id: string;
  studentId: string;
  teacherId?: string;
  classId?: string;
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  surahsMemorized: string[];
  tajweedScore: number;
  notes?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

export interface ParentChild {
  _id: string;
  name: string;
  email: string;
  role: "student";
}

export interface StudentClass {
  _id: string;
  title: string;
  description?: string;
  teacher: PopulatedUserRef | string;
  schedule?: ClassSchedule;
  meetingLink?: string;
  isActive?: boolean;
}

export interface StudentHomeworkSubmission {
  submittedAt: string;
  content: string;
  status?: HomeworkSubmissionStatus;
  reviewFeedback?: string;
  grade?: Grade;
  feedback?: string;
}

export interface StudentHomeworkItem {
  _id: string;
  title: string;
  description?: string;
  class: { title: string; _id?: string } | string;
  teacher?: { name: string; _id?: string };
  dueDate: string;
  submitted: boolean;
  underReview?: boolean;
  canSubmit?: boolean;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  submission: StudentHomeworkSubmission | null;
  createdAt?: string;
}

export interface StudentAttendanceRecord {
  _id: string;
  class: { title: string; _id?: string };
  date: string;
  status: AttendanceStatus;
}

export interface StudentAttendanceData {
  records: StudentAttendanceRecord[];
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
}

export interface StudentProgressRecord {
  _id: string;
  class?: { title: string; _id?: string };
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  surahsCompleted: string[];
  tajweedScore: number;
  memorizedAyahs?: number;
  notes?: string;
  updatedAt?: string;
  updatedBy?: PopulatedUserRef;
}

export interface StudyPlanResult {
  studyPlan: string;
  studentName?: string;
  currentLevel?: string;
  locale?: string;
  generatedAt: string;
}

export interface AtRiskReason {
  type: "attendance" | "homework" | "progress";
  message: string;
}

export interface AtRiskStudent {
  studentId: string;
  studentName: string;
  riskLevel: RiskLevel;
  reasons: AtRiskReason[];
  aiGuidance?: string;
  attendanceRate?: number;
  homeworkCompletion?: number;
}

export interface AIProgressReport {
  report: string;
  studentName?: string;
  locale?: string;
  stats?: {
    tajweedScore: number;
    memorizedAyahs: number;
    attendancePercentage: number;
    homeworkCompletionRate: number;
    verifiedSessions?: number;
    pendingLogs?: number;
    rejectedLogs?: number;
  };
  generatedAt: string;
}

export interface AIStudyPlan {
  plan: string;
  generatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  children?: string[];
  studentId?: string;
  gender?: "male" | "female";
  timezone?: string;
  country?: string;
  curriculumAssignments?: CurriculumAssignment[];
  createdAt?: string;
}

export interface ClassSchedule {
  day: string;
  time: string;
  duration?: number;
  /** When true (default), repeats every week on `day`. When false, one session only. */
  repeatWeekly?: boolean;
}

export interface PopulatedUserRef {
  _id: string;
  name: string;
  email?: string;
  country?: string;
  studentId?: string;
  timezone?: string;
}

export interface SessionTimeLabel {
  label: string;
  time: string;
  timezone: string;
}

export type SessionPhase = "upcoming" | "live" | "completed";

export interface SessionSlotView {
  _id: string;
  classId: string;
  classTitle: string;
  courseType: string;
  durationMinutes: number;
  durationLabel: string;
  day: string;
  meetingLink?: string;
  student: {
    _id: string;
    name: string;
    studentId?: string;
    country?: string;
    timezone: string;
  };
  teacher: {
    _id: string;
    name: string;
    country?: string;
    timezone: string;
  };
  times: {
    academy: SessionTimeLabel;
    teacher: SessionTimeLabel;
    student: SessionTimeLabel;
  };
  sessionPhase?: SessionPhase;
  startsAt?: string;
  endsAt?: string;
}

export interface TodaySchedulePayload {
  day: string;
  sessions: SessionSlotView[];
}

export type ClassLogStatus = "pending" | "approved" | "rejected";

export interface ClassLogView {
  _id: string;
  sessionSlotId: string;
  classId: string;
  classTitle: string;
  courseType: string;
  sessionDate: string;
  durationMinutes: number;
  durationLabel: string;
  lessonReport: string;
  topicsCovered: string[];
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  status: ClassLogStatus;
  adminNote?: string;
  approvedAt?: string;
  earningsBdt?: number;
  createdAt: string;
  student: {
    _id: string;
    name: string;
    studentId?: string;
    country?: string;
    timezone: string;
  };
  teacher: {
    _id: string;
    name: string;
    timezone: string;
  };
  times: {
    academy: SessionTimeLabel;
    teacher: SessionTimeLabel;
    student: SessionTimeLabel;
  };
}

export interface ClassLogStats {
  pending: number;
  approved: number;
  rejected: number;
}

export interface TeacherEarningsSummary {
  month: string;
  totalBdt: number;
  verifiedSessions: number;
  pendingSessions: number;
  pendingBdt: number;
  rejectedSessions: number;
  byCourse: { courseType: string; sessions: number; totalBdt: number }[];
  sessions: {
    logId: string;
    sessionDate: string;
    studentName: string;
    studentId?: string;
    classTitle: string;
    courseType: string;
    durationMinutes: number;
    earningsBdt: number;
    status: ClassLogStatus;
  }[];
}

export interface AdminEarningsOverview {
  month: string;
  totalBdt: number;
  verifiedSessions: number;
  pendingSessions: number;
  teachers: {
    teacherId: string;
    teacherName: string;
    verifiedSessions: number;
    pendingSessions: number;
    totalBdt: number;
    pendingBdt: number;
  }[];
}

export interface MonthlyProgressSnapshot {
  _id: string;
  month: string;
  student: { _id: string; name: string; studentId?: string };
  class: { _id: string; title: string };
  teacher: { _id: string; name: string };
  surahsCompleted: string[];
  tajweedScore: number;
  memorizedAyahs: number;
  teacherSummary?: string;
  qaResponses: { question: string; answer: string }[];
  activityDates: string[];
  sessionsHeld: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyFamilyReport {
  studentName: string;
  teacherName: string;
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  sessionsHeld: number;
  topicsCovered: string[];
  sessionHighlights: string[];
  attendance: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  homework: {
    assigned: number;
    submitted: number;
    graded: number;
    missingTitles: string[];
  };
  text: string;
  generatedAt: string;
}

export interface AdminHomeworkItem {
  _id: string;
  title: string;
  description?: string;
  class: { _id: string; title: string } | string | null;
  teacher: { _id: string; name: string } | string | null;
  dueDate: string;
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  submissionCount: number;
  totalStudents?: number;
  gradedCount?: number;
  pendingGradeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassAttendanceEntry {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  date: string;
}

export type ConcernReportStatus = "new" | "reviewed" | "closed";
export type ConcernCategory = "poaching" | "safety" | "conduct" | "other";

export interface ConcernReportView {
  _id: string;
  reporter: { _id: string; name: string; role: Role };
  category: ConcernCategory;
  message: string;
  relatedTeacherId?: string;
  relatedStudentId?: string;
  status: ConcernReportStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  timezone: string;
  country: string;
  meetingLink: string;
  bankName: string;
  bankAccount: string;
  bKashNumber: string;
}

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  studentId?: string;
  timezone: string;
  country: string;
}

export type StudentRequestStatus = "pending" | "approved" | "rejected";

export type ContactMessageStatus = "new" | "replied" | "closed";

export interface ContactMessageView {
  _id: string;
  name: string;
  email: string;
  message: string;
  locale?: "en" | "bn";
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export type TrialBookingStatus = "new" | "contacted" | "scheduled" | "closed";

export interface TrialBookingView {
  _id: string;
  parentName: string;
  email?: string;
  whatsapp: string;
  country?: string;
  learnerType: "child" | "teen" | "adult";
  timeSlot?:
    | "anytime"
    | "early_morning"
    | "morning"
    | "afternoon"
    | "evening"
    | "late_evening";
  teacherPreference: "any" | "female" | "male";
  preferredDays: string[];
  timezone?: string;
  source?: string;
  courseSlug?: string;
  teacherSlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  status: TrialBookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRequestView {
  _id: string;
  message: string;
  preferredCourseType?: string;
  status: StudentRequestStatus;
  adminNote?: string;
  resolvedAt?: string;
  createdAt: string;
  teacher: { _id: string; name: string; email?: string };
}

export interface AvailabilityCheckResult {
  available: boolean;
  day: string;
  startTime: string;
  durationMinutes: number;
  timezone: string;
  displayTime: { academy: string; teacher: string };
  conflicts: {
    slotId: string;
    studentName: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }[];
}

export type SearchResultType = "student" | "teacher" | "class";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  path: string;
}

export interface AdminClass {
  _id: string;
  title: string;
  description?: string;
  teacher: PopulatedUserRef | string;
  students: PopulatedUserRef[] | string[];
  schedule?: ClassSchedule;
  meetingLink?: string;
  sessionRateBdt?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface AttendanceOverview {
  class: { title: string; _id?: string };
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface AdminProgressRecord {
  _id: string;
  student: PopulatedUserRef;
  class?: { title: string; _id?: string };
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  surahsMemorized?: string[];
  tajweedScore?: number;
  notes?: string;
  updatedAt?: string;
  updatedBy?: PopulatedUserRef;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeClasses: number;
  todaysClasses?: AdminClass[];
  attendanceRate?: number;
  homeworkCompletion?: number;
  pendingActions?: {
    newTrials: number;
    newContacts: number;
    pendingClassLogs: number;
    newConcernReports?: number;
    pendingPayments?: number;
    pendingStudentRequests?: number;
  };
  curriculumCoverage?: {
    studentsWithPrograms: number;
    totalStudents: number;
    progressMissingProgram: number;
    logsMissingProgram: number;
  };
}

export type BillingCurrency = "USD" | "GBP" | "EUR" | "BDT" | "CAD" | "AUD";
export type PaymentMethod =
  | "zelle"
  | "wise"
  | "bank_transfer"
  | "paypal"
  | "cash_app"
  | "other";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type BillingStatus = "current" | "due_soon" | "overdue" | "not_set";

export interface StudentBillingView {
  monthlyFee: number;
  currency: BillingCurrency;
  dueDayOfMonth: number;
  paidUntil: string | null;
  status: BillingStatus;
  isActive: boolean;
}

export interface PaymentRecordView {
  id: string;
  studentId: string;
  amount: number;
  currency: BillingCurrency;
  country: string;
  paymentDate: string;
  monthsCovered: number;
  method: PaymentMethod;
  reference: string;
  transactionFee?: number;
  netAmount?: number;
  note?: string;
  screenshotUrl: string;
  status: PaymentStatus;
  rejectionReason?: string;
  paidUntilAfter?: string;
  reviewedAt?: string;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    country?: string;
  };
}

export interface OverdueBillingView {
  student: {
    id: string;
    name: string;
    email: string;
    country?: string;
  };
  monthlyFee: number;
  currency: BillingCurrency;
  paidUntil: string | null;
  status: BillingStatus;
}

export type BlogPostStatus = "draft" | "published";

export type BlogCategory =
  | "Quran & Tajweed"
  | "Parent Guides"
  | "Learning Tips"
  | "Platform & AI";

export interface BlogAuthor {
  name: string;
  role?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  pubDate: string;
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  readMinutes?: number;
  featured: boolean;
  status: BlogPostStatus;
  faqs: BlogFaq[];
  createdAt?: string;
  updatedAt?: string;
}
