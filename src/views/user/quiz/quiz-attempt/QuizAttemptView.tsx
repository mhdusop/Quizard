"use client";

import { useRouter } from "next/navigation";
import { QuizLoader } from "./components/QuizLoader";
import { QuizError } from "./components/QuizError";
import { QuizResults } from "./components/QuizResult";
import { QuizQuestion } from "./components/QuizQuestion";
import { QuizHeader } from "./components/QuizHeader";
import { QuizFallback } from "./components/QuizFallback";
import { useQuizAttempt } from "./hooks/useQuizAttempt";

export default function QuizAttemptView({ id }: { id: string }) {
   const router = useRouter();

   const {
      quiz,
      attempt,
      currentQuestionIndex,
      loading,
      submitting,
      isComplete,
      timeRemaining,
      results,
      error,
      selectedOption,
      handleSelectOption,
      handleSubmitAnswer,
      formatTime,
   } = useQuizAttempt(id);

   if (loading) {
      return <QuizLoader />;
   }

   if (error) {
      return <QuizError error={error} onBack={() => router.push("/user/quiz")} />;
   }

   if (isComplete && results) {
      return (
         <QuizResults
            quiz={quiz}
            results={results}
            attempt={attempt}
            onBackToList={() => router.push("/user/quiz")}
            onViewDetails={() => router.push(`/user/attempt/${attempt?.id}`)}
         />
      );
   }

   if (quiz && quiz.questions && quiz.questions.length > 0 && currentQuestionIndex < quiz.questions.length) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

      return (
         <div className="container mx-auto p-4 max-w-3xl">
            <QuizHeader
               title={quiz.title}
               currentQuestionIndex={currentQuestionIndex}
               totalQuestions={quiz.questions.length}
               timeRemaining={timeRemaining}
               formatTime={formatTime}
            />

            <QuizQuestion
               question={currentQuestion}
               selectedOption={selectedOption}
               onSelectOption={handleSelectOption}
               onSubmit={handleSubmitAnswer}
               isSubmitting={submitting}
               isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
               progress={progress}
            />
         </div>
      );
   }

   return <QuizFallback onBack={() => router.push("/user/quiz")} quiz={quiz} />;
}