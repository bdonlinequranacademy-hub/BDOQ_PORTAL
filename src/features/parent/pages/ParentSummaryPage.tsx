import { useState } from "react";

import { Sparkles, MessageSquare } from "lucide-react";

import {

  useParentChildren,

  useSelectedChildId,

  useGenerateParentSummary,

} from "@/features/parent/hooks/useParent";

import { ChildSelector } from "@/features/parent/components/ChildSelector";

import { PageContainer } from "@/components/layout/PageContainer";

import { Button } from "@/components/ui/Button";

import { AIReportPanel } from "@/components/ai/AIReportPanel";



export function ParentSummaryPage() {

  const { data: children = [] } = useParentChildren();

  const childId = useSelectedChildId() ?? "";

  const generate = useGenerateParentSummary();

  const [summary, setSummary] = useState<string | null>(null);



  const childName = children.find((c) => c._id === childId)?.name;



  async function handleGenerate() {

    if (!childId) return;

    const res = await generate.mutateAsync(childId);

    setSummary(res.data?.summary ?? null);
  }



  return (

    <PageContainer className="flex max-w-3xl flex-col gap-6">

      <div className="flex items-center gap-3">

        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100">

          <MessageSquare className="size-6 text-emerald-700" />

        </div>

        <div>

          <h1 className="text-2xl font-bold text-[#03214F]">Weekly Summary</h1>

          <p className="text-sm text-zinc-500">AI-generated update for this week</p>

        </div>

      </div>



      <ChildSelector />



      {!childId ? (

        <p className="text-sm text-zinc-400">Select a child to generate a summary.</p>

      ) : (

        <>

          <Button

            onClick={handleGenerate}

            disabled={generate.isPending}

            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 text-white"

          >

            <Sparkles className="size-4" />

            {generate.isPending

              ? "Generating…"

              : `Generate summary${childName ? ` for ${childName}` : ""}`}

          </Button>



          {summary && (

            <AIReportPanel

              title="This week"

              subtitle={childName ? `For ${childName}` : undefined}

              content={summary}
              onRegenerate={handleGenerate}

              isRegenerating={generate.isPending}

            />

          )}

        </>

      )}

    </PageContainer>

  );

}


