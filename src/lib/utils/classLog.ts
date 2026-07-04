import type { ClassLogStatus } from "@/types/models";

export function printClassLogReport(log: {
  classTitle: string;
  courseType: string;
  sessionDate: string;
  durationLabel: string;
  lessonReport: string;
  topicsCovered: string[];
  curriculumLabels?: { program?: string; unit?: string; topic?: string };
  student: { name: string; studentId?: string; country?: string };
  teacher: { name: string };
  times: {
    academy: { time: string };
    teacher: { time: string };
    student: { time: string };
  };
  status: ClassLogStatus;
}) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Class Log — ${log.student.name}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; color: #03214F; max-width: 720px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; }
    .cell { background: #F8FAFF; padding: 0.75rem; border-radius: 0.5rem; text-align: center; }
    .label { font-size: 0.65rem; text-transform: uppercase; color: #94a3b8; }
    .report { white-space: pre-wrap; line-height: 1.6; margin-top: 1rem; }
    .topics { margin-top: 1rem; }
    .tag { display: inline-block; background: #03214F; color: white; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; margin: 0.2rem; }
  </style>
</head>
<body>
  <h1>BDOQ Academy — Class Log</h1>
  <p class="meta">${log.sessionDate} · ${log.courseType} · ${log.durationLabel} · ${log.status}</p>
  <p><strong>Student:</strong> ${log.student.name}${log.student.studentId ? ` (${log.student.studentId})` : ""}</p>
  <p><strong>Teacher:</strong> ${log.teacher.name}</p>
  <p><strong>Class:</strong> ${log.classTitle}</p>
  ${
    log.curriculumLabels?.program
      ? `<p><strong>Curriculum:</strong> ${[log.curriculumLabels.program, log.curriculumLabels.unit, log.curriculumLabels.topic].filter(Boolean).join(" › ")}</p>`
      : ""
  }
  <div class="grid">
    <div class="cell"><div class="label">Student</div>${log.times.student.time}</div>
    <div class="cell"><div class="label">Teacher</div>${log.times.teacher.time}</div>
    <div class="cell"><div class="label">BD</div>${log.times.academy.time}</div>
  </div>
  <h2>Lesson Report</h2>
  <div class="report">${log.lessonReport.replace(/</g, "&lt;")}</div>
  ${
    log.topicsCovered.length
      ? `<div class="topics"><strong>Topics:</strong> ${log.topicsCovered.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`
      : ""
  }
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
