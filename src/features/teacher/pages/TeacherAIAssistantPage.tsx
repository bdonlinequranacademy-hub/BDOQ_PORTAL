import { useNavigate } from "react-router-dom";

import {

  Brain,

  AlertTriangle,

  FileText,

  MessageSquare,

  ChevronRight,

  TrendingUp,

  Calendar,

  ClipboardList,

  Sparkles,

} from "lucide-react";

import {

  useAtRiskStudents,

  useTeacherClassLogStats,

} from "@/features/teacher/hooks/useTeacher";

import { PageContainer } from "@/components/layout/PageContainer";

import { Card } from "@/components/ui/Card";

import { LocaleToggle } from "@/components/ui/LocaleToggle";



interface Tool {

  icon: React.ReactNode;

  iconBg: string;

  title: string;

  desc: string;

  to: string;

}



export function TeacherAIAssistantPage() {

  const navigate = useNavigate();

  const { data: atRisk = [] } = useAtRiskStudents();

  const { data: logStats } = useTeacherClassLogStats();

  const highCount = atRisk.filter((s) => s.riskLevel === "high").length;



  const tools: Tool[] = [

    {

      icon: <AlertTriangle className="size-5 text-[#C4922B]" />,

      iconBg: "bg-[#FDF3E0]",

      title: "At-Risk Students",

      desc: `${atRisk.length} student${atRisk.length !== 1 ? "s" : ""} flagged${highCount > 0 ? ` · ${highCount} high risk` : ""}`,

      to: "/teacher/ai/at-risk",

    },

    {

      icon: <FileText className="size-5 text-[#2b7fff]" />,

      iconBg: "bg-[#EEF2F8]",

      title: "Progress Reports",

      desc: "Generate detailed AI analysis for any student",

      to: "/teacher/ai/progress-report",

    },

    {

      icon: <MessageSquare className="size-5 text-emerald-600" />,

      iconBg: "bg-emerald-50",

      title: "Parent Summaries",

      desc: "Weekly AI update using class logs & progress",

      to: "/teacher/ai/parent-summary",

    },

    {

      icon: <Calendar className="size-5 text-teal-600" />,

      iconBg: "bg-teal-50",

      title: "Log Session + AI Draft",

      desc: "Today's schedule — AI helps write session logs",

      to: "/teacher/schedule/today",

    },

    {

      icon: <ClipboardList className="size-5 text-[#03214F]" />,

      iconBg: "bg-[#F8FAFF]",

      title: "Class Logs",

      desc: logStats

        ? `${logStats.pending} pending · ${logStats.approved} approved`

        : "Track submitted session reports",

      to: "/teacher/class-logs",

    },

    {

      icon: <TrendingUp className="size-5 text-purple-600" />,

      iconBg: "bg-purple-50",

      title: "Monthly Progress",

      desc: "Structured month-end snapshots for AI reports",

      to: "/teacher/monthly-progress",

    },

    {

      icon: <Sparkles className="size-5 text-[#C4922B]" />,

      iconBg: "bg-[#FDF3E0]",

      title: "Update Progress",

      desc: "Record surah memorization & tajweed scores",

      to: "/teacher/progress",

    },

  ];



  return (

    <PageContainer className="flex flex-col gap-6">

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <h1 className="font-display text-2xl font-bold text-portal-heading">AI Assistant</h1>

          <p className="text-sm text-portal-muted">Powered by Al Bayaan AI</p>

        </div>

        <LocaleToggle />

      </div>



      <div className="flex items-center gap-4 rounded-3xl bg-[#FDF3E0] p-5">

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#C4922B]/20">

          <Brain className="size-6 text-[#C4922B]" />

        </div>

        <div>

          <h2 className="font-display text-xl font-bold text-portal-heading">AI Teacher Tools</h2>

          <p className="text-sm text-portal-muted">

            Reports and summaries use your EN / বাং preference when you generate them.

          </p>

        </div>

      </div>



      {highCount > 0 && (

        <button

          onClick={() => navigate("/teacher/ai/at-risk")}

          className="flex items-center gap-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-left"

        >

          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100">

            <AlertTriangle className="size-5 text-red-500" />

          </div>

          <div className="flex flex-1 flex-col">

            <span className="text-sm font-bold text-red-600">

              {highCount} student{highCount > 1 ? "s" : ""} at high risk

            </span>

            <span className="text-xs text-red-400">Tap to review AI guidance</span>

          </div>

          <ChevronRight className="size-5 text-red-300" />

        </button>

      )}



      <div className="flex flex-col gap-3">

        <span className="text-base font-bold text-portal-heading">AI Tools</span>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {tools.map((t) => (

            <Card

              key={t.title}

              className="cursor-pointer rounded-2xl border-0 p-4 shadow-sm transition hover:shadow-md"

              onClick={() => navigate(t.to)}

            >

              <div className="flex items-center gap-4">

                <div

                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${t.iconBg}`}

                >

                  {t.icon}

                </div>

                <div className="flex flex-1 flex-col gap-0.5">

                  <span className="text-sm font-bold text-portal-heading">{t.title}</span>

                  <span className="text-xs text-portal-muted">{t.desc}</span>

                </div>

                <ChevronRight className="size-5 text-zinc-300" />

              </div>

            </Card>

          ))}

        </div>

      </div>

    </PageContainer>

  );

}

