const ACADEMY = "BD Online Quran Academy";

export function admissionFollowUpMessage(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Assalamu Alaikum ${first},

Thank you for your *student admission* application at ${ACADEMY}.

We are reviewing your form and will contact you shortly with next steps.

JazakAllah Khair.`;
}

export interface IAdmissionConfirmedMessageInput {
  name: string;
  status: "approved" | "rejected";
  program?: string;
  plan?: string;
  teacherName?: string;
  classDays?: string[];
  classTime?: string;
  durationMinutes?: number;
  classesPerWeek?: number;
  startDate?: string;
  platform?: string;
  meetingLink?: string;
  monthlyFee?: string;
  paymentStatus?: string;
}

export function admissionConfirmedMessage(input: IAdmissionConfirmedMessageInput): string {
  const first = input.name.split(" ")[0] || input.name;
  const intro =
    input.status === "rejected"
      ? `Your admission file at ${ACADEMY} is *rejected*. Your class details are below.`
      : `Alhamdulillah — your admission at ${ACADEMY} is *confirmed*.`;

  const lines = [
    `Assalamu Alaikum ${first},`,
    "",
    intro,
    "",
    `*Student:* ${input.name}`,
    input.program ? `*Program:* ${input.program}` : null,
    input.plan ? `*Plan:* ${input.plan}` : null,
    input.teacherName ? `*Teacher:* ${input.teacherName}` : null,
    input.classDays && input.classDays.length > 0
      ? `*Class days:* ${input.classDays.join(", ")}`
      : null,
    input.classTime ? `*Class time:* ${input.classTime}` : null,
    input.durationMinutes
      ? `*Duration:* ${input.durationMinutes} minutes`
      : null,
    input.classesPerWeek
      ? `*Classes per week:* ${input.classesPerWeek}`
      : null,
    input.startDate ? `*Start date:* ${input.startDate}` : null,
    input.platform ? `*Platform:* ${input.platform}` : null,
    input.meetingLink ? `*Join class:* ${input.meetingLink}` : null,
    input.monthlyFee ? `*Monthly fee:* ${input.monthlyFee}` : null,
    input.paymentStatus ? `*Payment:* ${input.paymentStatus}` : null,
    "",
    !input.teacherName || !input.meetingLink
      ? "If any class detail is missing, reply here and we will send it right away."
      : "Please join on time. Save this number and reply here if you have any questions.",
    "",
    "JazakAllah Khair.",
    ACADEMY,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

export function trialAdmissionPrefillMessage(input: {
  parentName: string;
  studentName?: string;
  prefillUrl: string;
}): string {
  const first = input.parentName.split(" ")[0] || input.parentName;
  const studentLine = input.studentName?.trim()
    ? `*Student:* ${input.studentName.trim()}`
    : null;

  return [
    `Assalamu Alaikum ${first},`,
    "",
    `Alhamdulillah — you completed a *free trial class* with ${ACADEMY}. We hope you liked it.`,
    "",
    studentLine,
    "To continue with us as a student, please open this link, complete the admission form and payment:",
    "",
    `*Apply here:* ${input.prefillUrl}`,
    "",
    "JazakAllah Khair.",
    ACADEMY,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function trialLeadFollowUpMessage(parentName: string): string {
  const first = parentName.split(" ")[0] || parentName;
  return `Assalamu Alaikum ${first},

Thank you for booking a *free trial class* with ${ACADEMY}.

We would love to schedule your class. What time works best for you this week?

JazakAllah Khair.`;
}

export function teacherApplicationFollowUpMessage(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Assalamu Alaikum ${first},

Thank you for applying to teach at ${ACADEMY}.

We have received your application and will review it soon.

JazakAllah Khair.`;
}

export interface ITrialInvitationMessageInput {
  parentName: string;
  studentName: string;
  teacherName: string;
  courseLabel: string;
  localSchedule: string;
  bdSchedule: string;
  platformLabel: string;
  meetingLink?: string;
}

export function trialInvitationMessage(input: ITrialInvitationMessageInput): string {
  const first = input.parentName.split(" ")[0] || input.parentName;
  const lines = [
    `Assalamu Alaikum ${first},`,
    "",
    `Your *free trial class* at ${ACADEMY} is confirmed.`,
    "",
    `*Student:* ${input.studentName}`,
    `*Course:* ${input.courseLabel}`,
    `*Teacher:* ${input.teacherName}`,
    `*Your time:* ${input.localSchedule}`,
    `*BD time:* ${input.bdSchedule}`,
    `*Platform:* ${input.platformLabel}`,
    input.meetingLink ? `*Join:* ${input.meetingLink}` : null,
    "",
    "Please join on time. Reply here if you need to reschedule.",
    "",
    "JazakAllah Khair.",
  ].filter(Boolean);

  return lines.join("\n");
}

export function studentCheckInMessage(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Assalamu Alaikum ${first},

This is your teacher from ${ACADEMY}. I hope you are well — please let me know if you have any questions about your classes.

JazakAllah Khair.`;
}
