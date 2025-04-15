import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import { QuestionTabs } from "./components/dashboard/QuestionTabs";
import { QuestionCard } from "./components/QuestionCard/QuestionCard";
import { StatusQuestionCard } from "./components/StatusQuestionCard/StatusQuestionCard";
import { useQuestions } from "./hooks/useQuestions";
import { QuestionRequest, TabValue } from "./types";
import { getTabIcon, getTabTitle } from "./utils/tab-helpers";
import { EmptyQuestion } from "./components/dashboard/EmptyQuestion";
const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("active");

  const {
    questions,
    pendingQuestions,
    activeQuestions,
    rejectedQuestions,
    completedQuestions,
    handleApprove,
    handleReject,
    handleComplete,
  } = useQuestions();

  const getQuestionsForTab = (tab: TabValue) => {
    switch (tab) {
      case "pending":
        return pendingQuestions;
      case "active":
        return activeQuestions;
      case "rejected":
        return rejectedQuestions;
      case "completed":
        return completedQuestions;
      case "all":
        return questions;
      default:
        return pendingQuestions;
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Панель модерации вопросов
        </h1>

        <DashboardStats
          activeCount={activeQuestions.length}
          pendingCount={pendingQuestions.length}
          completedCount={completedQuestions.length}
          rejectedCount={rejectedQuestions.length}
        />
      </header>

      <main>
        <QuestionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeQuestions.length}
          pendingCount={pendingQuestions.length}
          completedCount={completedQuestions.length}
          rejectedCount={rejectedQuestions.length}
          totalCount={questions.length}
        >
          {(["active", "pending", "completed", "rejected", "all"] as const).map(
            (tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="space-y-4 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    {getTabIcon(tabValue)}
                    {getTabTitle(tabValue)}
                  </h2>
                </div>

                {getQuestionsForTab(tabValue).length > 0 ? (
                  <div className="space-y-4">
                    {getQuestionsForTab(tabValue).map((question: any) =>
                      question.status === "pending" ? (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ) : (
                        <StatusQuestionCard
                          key={question.id}
                          question={question}
                          onComplete={
                            question.status === "active"
                              ? handleComplete
                              : undefined
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <EmptyQuestion tabValue={tabValue} />
                )}
              </TabsContent>
            )
          )}
        </QuestionTabs>
      </main>
    </div>
  );
};

export default MentorDashboard;
