import type { AppOutletContext } from "@/components/layout/AppLayout";
import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import { EmptyState } from "@/components/layout/EmptyState";
import { LoadingState } from "@/components/layout/LoadingState";
import { ReportDocument } from "@/components/layout/ReportDocument";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { parseDemoViewState } from "@/data/demoData";
import { cloneReport } from "@/lib/cloneReport";
import { CARD_SURFACE_CLASS } from "@/lib/surfaces";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";

export function ReportPage() {
  const { id = "c-01" } = useParams<{ id: string }>();
  const {
    getCandidateById,
    getReportById,
    getInterviewByCandidateId,
    updateReport,
  } = useOutletContext<AppOutletContext>();
  const [searchParams] = useSearchParams();
  const demoState = parseDemoViewState(searchParams.get("state"));
  const [isLoading, setIsLoading] = useState(demoState === "loading");

  const candidate = getCandidateById(id);
  const report = getReportById(id);
  const interviewEntries = getInterviewByCandidateId(id);

  useEffect(() => {
    if (demoState !== "loading") {
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 800);

    return () => window.clearTimeout(timer);
  }, [demoState]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Отчёт</h1>
          <DocumentStateBadge state={report?.documentState ?? "draft"} />
        </div>

        <LoadingState label="Загрузка отчёта…" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Отчёт</h1>

        <EmptyState
          title="Кандидат не найден"
          description="Данные профиля недоступны. Проверьте, что кандидат был импортирован из 1С."
          action={
            <Link
              to="/candidates"
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />К списку кандидатов
            </Link>
          }
        />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Отчёт</h1>
          <DocumentStateBadge state="draft" />
        </div>

        <EmptyState
          title="Отчёт отсутствует"
          description="По этому кандидату нет сохранённого отчёта. Вернитесь в реестр кандидатов."
          action={
            <Link
              to="/candidates"
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />К списку кандидатов
            </Link>
          }
        />
      </div>
    );
  }

  const isApproved = report.documentState === "approved";

  const handleUnapprove = () => {
    updateReport({ ...cloneReport(report), documentState: "draft" });
    toast.success("Документ возвращён в черновик");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Отчёт</h1>
        <DocumentStateBadge state={report.documentState} />
      </div>

      <div className={`rounded-2xl p-5 shadow-xs ${CARD_SURFACE_CLASS}`}>
        <ReportDocument
          report={report}
          candidate={candidate}
          interviewEntries={interviewEntries}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/candidates/${id}`}
          className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Профиль
        </Link>
        <Link
          to={`/candidates/${id}/review`}
          className="inline-flex items-center rounded-md bg-[#F2CA52] px-3 py-1.5 text-sm font-medium text-[#1E2028] transition-colors duration-200 hover:bg-[#E5BA41] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isApproved ? "Повторная проверка и правка" : "Перейти к проверке"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        {isApproved && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="transition-colors duration-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Вернуть в черновик
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вернуть документ в черновик?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Документ снова станет черновиком. Если кандидат был на этапе
                  «Рассмотрен», он вернётся в «На рассмотрении». Действие можно
                  отменить, утвердив документ повторно.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnapprove}>
                  Вернуть в черновик
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
