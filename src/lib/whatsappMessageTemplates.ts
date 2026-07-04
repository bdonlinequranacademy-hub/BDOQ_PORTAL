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

export function studentCheckInMessage(name: string): string {
  const first = name.split(" ")[0] || name;
  return `Assalamu Alaikum ${first},

This is your teacher from ${ACADEMY}. I hope you are well — please let me know if you have any questions about your classes.

JazakAllah Khair.`;
}
