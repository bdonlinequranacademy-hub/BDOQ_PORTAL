const ACADEMY = "BD Online Quran Academy";

export function admissionFollowUpMessage(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Assalamu Alaikum ${first},

Thank you for your *student admission* application at ${ACADEMY}.

We are reviewing your form and will contact you shortly with next steps.

JazakAllah Khair.`;
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
