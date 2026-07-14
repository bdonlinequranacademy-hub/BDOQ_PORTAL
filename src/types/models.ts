export type Role = "student" | "teacher" | "admin" | "super_admin" | "parent";
export type AttendanceStatus = "present" | "absent" | "late";
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
  avatarUrl?: string;
  gender?: "male" | "female";
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
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
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
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  submission: StudentHomeworkSubmission | null;
  createdAt?: string;
}

export interface StudentHomeworkSubmission {
  submittedAt: string;
  content: string;
  status?: HomeworkSubmissionStatus;
  reviewFeedback?: string;
  grade?: Grade;
  feedback?: string;
  curriculumProgram?: string;
  curriculumUnit?: string;
  curriculumTopic?: string;
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
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
  whatsapp?: string;
  curriculumAssignments?: CurriculumAssignment[];
  createdAt?: string;
  avatarUrl?: string;
  meetingLink?: string;
  bankName?: string;
  bankAccount?: string;
  bKashNumber?: string;
  emailVerified?: boolean;
  authProvider?: string;
}

export interface AdminUserProfileClassSchedule {
  day: string;
  time: string;
  duration?: number;
  repeatWeekly?: boolean;
}

export interface AdminTeacherPublicProfile {
  slug: string;
  title: string;
  bio: string;
  about: string;
  qualifications: string[];
  skills: string[];
  experience: string;
  languages: string[];
  showOnWebsite: boolean;
  featured: boolean;
}

export interface AdminTeacherProfileDetail {
  kind: "teacher";
  user: AdminUser;
  publicProfile: AdminTeacherPublicProfile | null;
  stats: {
    activeClasses: number;
    totalClasses: number;
    totalStudents: number;
    experienceLabel: string;
    yearsOnPlatform: number;
    homeworkAssigned: number;
    classLogsApproved: number;
    classLogsPending: number;
    earningsMonthBdt: number;
    earningsPendingBdt: number;
    verifiedSessionsThisMonth: number;
  };
  classes: Array<{
    _id: string;
    title: string;
    description: string;
    schedule: AdminUserProfileClassSchedule | null;
    meetingLink: string;
    sessionRateBdt: number;
    isActive: boolean;
    studentCount: number;
    createdAt?: string;
  }>;
  scheduleSlots: Array<{
    day: string;
    time: string;
    duration: number;
    classTitle: string;
    classId?: string;
  }>;
  students: Array<{
    _id: string;
    name: string;
    email: string;
    studentId?: string;
    country?: string;
    whatsapp?: string;
    isActive: boolean;
    classTitles: string[];
  }>;
  recentClassLogs: Array<{
    _id: string;
    sessionDate: string;
    durationMinutes: number;
    courseType: string;
    lessonReport: string;
    status: string;
    earningsBdt: number;
    studentName: string;
    studentId?: string;
    classTitle: string;
    createdAt?: string;
  }>;
  recentHomework: Array<{
    _id: string;
    title: string;
    dueDate: string;
    classTitle: string;
    submissionCount: number;
    createdAt?: string;
  }>;
  studentRequests: Array<{
    _id: string;
    status: string;
    message: string;
    preferredCourseType: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  earnings: {
    month: string;
    totalBdt: number;
    verifiedSessions: number;
    pendingSessions: number;
    pendingBdt: number;
    rejectedSessions: number;
  };
}

export interface AdminStudentProfileDetail {
  kind: "student";
  user: AdminUser;
  stats: {
    activeClasses: number;
    totalClasses: number;
    attendanceRate: number | null;
    attendancePresent: number;
    attendanceAbsent: number;
    attendanceLate: number;
    attendanceTotal: number;
    pendingHomework: number;
    submittedHomework: number;
    yearsOnPlatform: number;
    certificatesCount: number;
    paymentsCount: number;
  };
  classes: Array<{
    _id: string;
    title: string;
    description: string;
    schedule: AdminUserProfileClassSchedule | null;
    meetingLink: string;
    isActive: boolean;
    teacher: {
      _id: string;
      name: string;
      email: string;
      whatsapp?: string;
      country?: string;
      gender?: string;
    } | null;
    createdAt?: string;
  }>;
  progress: Array<{
    _id: string;
    surahs: string[];
    tajweedScore: number | null;
    memorizedAyahs: number;
    curriculumProgram: string;
    curriculumUnit?: string;
    curriculumTopic?: string;
    notes: string;
    classTitle?: string;
    updatedAt?: string;
  }>;
  recentAttendance: Array<{
    _id: string;
    status: string;
    date: string;
    classTitle: string;
  }>;
  homework: Array<{
    _id: string;
    title: string;
    dueDate: string;
    classTitle: string;
    teacherName: string;
    submitted: boolean;
    grade: string | null;
    submittedAt: string | null;
  }>;
  billing: {
    monthlyFee: number;
    currency: string;
    dueDay: number;
    paidUntil: string | null;
    isActive: boolean;
  } | null;
  recentPayments: Array<{
    _id: string;
    amount: number;
    currency: string;
    status: string;
    method?: string;
    createdAt: string;
  }>;
  certificates: Array<{
    _id: string;
    certificateId: string;
    courseName: string;
    issueDate: string;
    grade: string;
  }>;
}

export interface AdminStaffProfileDetail {
  kind: "staff";
  user: AdminUser;
  stats: {
    yearsOnPlatform: number;
  };
}

export type AdminUserProfileDetail =
  | AdminTeacherProfileDetail
  | AdminStudentProfileDetail
  | AdminStaffProfileDetail;

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

export interface TeacherProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  timezone: string;
  country: string;
  whatsapp: string;
  meetingLink: string;
  bankName: string;
  bankAccount: string;
  bKashNumber: string;
  avatarUrl?: string;
  gender?: "male" | "female";
}

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  studentId?: string;
  timezone: string;
  country: string;
  whatsapp: string;
  avatarUrl?: string;
  gender?: "male" | "female";
}

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  gender?: "male" | "female";
  authProvider?: string;
  isActive?: boolean;
  createdAt?: string;
}

export type WhatsAppQueueCategory =
  | "payment_overdue"
  | "payment_due_soon"
  | "class_reminder"
  | "new_trial"
  | "new_admission"
  | "missing_whatsapp";

export interface WhatsAppQueueItem {
  id: string;
  category: WhatsAppQueueCategory;
  title: string;
  subtitle: string;
  recipientName: string;
  recipientRole: "student" | "teacher" | "parent" | "lead";
  phoneRaw: string;
  phoneDisplay: string;
  phoneValid: boolean;
  phoneError?: string;
  waUrl: string | null;
  message: string;
  userId?: string;
  createdAt?: string;
}

export type StudentRequestStatus = "pending" | "approved" | "rejected";

export type ContactMessageStatus = "new" | "replied" | "closed";

export interface ContactMessageView {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  locale?: "en" | "bn";
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export type NewsletterSubscriberStatus = "active" | "unsubscribed";

export interface NewsletterSubscriberView {
  _id: string;
  email: string;
  locale?: "en" | "bn";
  source?: string;
  status: NewsletterSubscriberStatus;
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

export type StudentAdmissionStatus = "new" | "reviewing" | "approved" | "closed";

export interface StudentAdmissionView {
  _id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  formData: Record<string, unknown>;
  locale?: "en" | "bn";
  status: StudentAdmissionStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type TeacherApplicationStatus =
  | "new"
  | "reviewing"
  | "approved"
  | "rejected"
  | "closed";

export interface TeacherApplicationFilesView {
  certificateUrl?: string;
  cvUrl?: string;
  profilePhotoUrl?: string;
  screenshotUrl?: string;
}

export interface TeacherApplicationView {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  formData: Record<string, unknown>;
  files: TeacherApplicationFilesView;
  locale?: "en" | "bn";
  status: TeacherApplicationStatus;
  adminNote?: string;
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
  memorizedAyahs?: number;
  notes?: string;
  updatedAt?: string;
  updatedBy?: PopulatedUserRef;
}

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeClasses: number;
  todaysClasses?: TodaySessionDashboardItem[];
  liveSummary?: LiveMonitorSummary;
  attendanceRate?: number;
  homeworkCompletion?: number;
  pendingActions?: {
    newTrials: number;
    newContacts: number;
    newStudentAdmissions?: number;
    newTeacherApplications?: number;
    pendingClassLogs: number;
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

export type LiveMonitorJoinStatus = "joined" | "not_joined" | "late";

export interface LiveMonitorSummary {
  sessionDate: string;
  day: string;
  liveCount: number;
  upcomingCount: number;
  completedCount: number;
  teacherLateCount: number;
  studentNoShowCount: number;
  teacherNoShowCount: number;
  totalToday: number;
}

export interface LiveMonitorSession {
  _id: string;
  classId: string;
  classTitle: string;
  courseType: string;
  durationMinutes: number;
  durationLabel: string;
  day: string;
  meetingLink?: string;
  sessionPhase: SessionPhase;
  startsAt: string;
  endsAt: string;
  startTimeLabel: string;
  minutesUntilStart: number;
  minutesSinceStart: number;
  student: { _id: string; name: string; studentId?: string };
  teacher: { _id: string; name: string };
  joins: {
    teacherJoinedAt?: string;
    studentJoinedAt?: string;
    teacherStatus: LiveMonitorJoinStatus;
    studentStatus: LiveMonitorJoinStatus;
  };
  alerts: {
    teacherLate: boolean;
    studentNoShow: boolean;
    teacherNoShow: boolean;
  };
}

export interface LiveMonitorPayload {
  summary: LiveMonitorSummary;
  sessions: LiveMonitorSession[];
  updatedAt: string;
}

export interface TodaySessionDashboardItem {
  _id: string;
  classId: string;
  classTitle: string;
  teacherName: string;
  studentName: string;
  startTimeLabel: string;
  sessionPhase: SessionPhase;
  startsAt: string;
  meetingLink?: string;
  teacherJoined: boolean;
  studentJoined: boolean;
  alerts?: {
    teacherLate: boolean;
    studentNoShow: boolean;
    teacherNoShow: boolean;
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
    invoiceNumber?: string;
    createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    country?: string;
  };
}

export interface PaymentInvoiceCourseLine {
  title: string;
  teacherName: string;
  schedule?: string;
}

export interface PaymentInvoiceView {
  invoiceNumber: string;
  paymentId: string;
  issuedAt: string;
  student: {
    name: string;
    email: string;
    studentId?: string;
    country: string;
  };
  academy: {
    name: string;
    shortName: string;
    tagline: string;
    website: string;
    email: string;
    contactBD: string;
    contactEG: string;
    address: string;
  };
  description: string;
  monthsCovered: number;
  amount: number;
  currency: string;
  transactionFee?: number;
  netAmount?: number;
  method: string;
  reference: string;
  paymentDate: string;
  paidUntilAfter?: string;
  note?: string;
  courses: PaymentInvoiceCourseLine[];
}

export interface CertificateAcademyView {
  name: string;
  shortName: string;
  tagline: string;
  website: string;
  email: string;
  contactBD: string;
  contactEG: string;
  address: string;
  founderName: string;
  founderTitle: string;
  sinceYear: string;
}

export interface CertificateView {
  id: string;
  certificateId: string;
  studentName: string;
  studentNameBn: string;
  courseName: string;
  courseNameBn: string;
  studentPortalId: string;
  issueDate: string;
  courseDuration: string;
  grade: string;
  showExcellentBadge: boolean;
  performanceTextEn: string;
  performanceTextBn: string;
  verifyUrl: string;
  academy: CertificateAcademyView;
  createdAt: string;
}

export interface CertificateVerifyView extends CertificateView {
  valid: boolean;
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

export type ResourceType = "ebook" | "audio" | "video";
export type ResourceStatus = "draft" | "published";
export type ResourceSection =
  | "default"
  | "featured"
  | "verses"
  | "recitation"
  | "gallery"
  | "playlist";
export type EbookCategory = "tajweed" | "islamic-history" | "religious";
export type EbookLanguage = "en" | "bn" | "both";

export interface AudioVerseEntry {
  arabic: string;
  translation: string;
}

export interface AdminResource {
  id: string;
  type: ResourceType;
  section: ResourceSection;
  title: string;
  slug: string;
  description?: string;
  status: ResourceStatus;
  featured: boolean;
  sortOrder: number;
  category?: EbookCategory;
  coverGradient?: string;
  coverUrl?: string;
  coverPublicId?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  fileSize?: string;
  pageCount?: number;
  language?: EbookLanguage;
  author?: string;
  audioUrl?: string;
  audioPublicId?: string;
  duration?: string;
  paraInfo?: string;
  surahName?: string;
  progress?: number;
  verses?: AudioVerseEntry[];
  youtubeId?: string;
  startSeconds?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TestimonialMediaType = "text" | "audio" | "video";

export type GalleryAlbumType = "gallery-01" | "gallery-02" | "gallery-03";
export type GalleryMediaType = "photo" | "video" | "audio";

export interface AdminGalleryItem {
  id: string;
  externalId: string;
  title: string;
  description?: string;
  album: GalleryAlbumType;
  mediaType: GalleryMediaType;
  mediaUrl?: string;
  mediaPublicId?: string;
  youtubeId?: string;
  coverGradient: string;
  heightClass: string;
  sortOrder: number;
  showOnWebsite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPricingPackage {
  id: string;
  slug: string;
  name: string;
  priceBdt: number;
  priceUsd: number;
  period: string;
  features: string[];
  popular: boolean;
  sortOrder: number;
  showOnWebsite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminTestimonial {
  id: string;
  externalId: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  image?: string;
  mediaType: TestimonialMediaType;
  mediaUrl?: string;
  youtubeId?: string;
  sortOrder: number;
  showOnWebsite: boolean;
  createdAt?: string;
  updatedAt?: string;
}
