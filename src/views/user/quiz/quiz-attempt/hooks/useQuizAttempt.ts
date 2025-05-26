import { useState, useEffect, useRef, useCallback } from "react";

type Option = {
   id: string;
   content: string;
   isCorrect: boolean;
};

type Question = {
   id: string;
   content: string;
   options: Option[];
};

type Quiz = {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questions: Question[];
};

type QuizAttempt = {
   id: string;
   startedAt: string;
   answers: Answer[];
};

type Answer = {
   questionId: string;
   selectedOptionId: string | null;
   isCorrect: boolean | null;
};

type ResultsData = {
   correctCount: number;
   incorrectCount: number;
   unansweredCount: number;
   totalQuestions: number;
   score: number;
};

export function useQuizAttempt(id: string) {
   const [quiz, setQuiz] = useState<Quiz | null>(null);
   const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);
   const [submitting, setSubmitting] = useState<boolean>(false);
   const [isComplete, setIsComplete] = useState<boolean>(false);
   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
   const [results, setResults] = useState<ResultsData | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [selectedOption, setSelectedOption] = useState<string | null>(null);

   const timerRef = useRef<NodeJS.Timeout | null>(null);

   // Check localStorage for saved attempt
   const checkLocalStorage = useCallback(() => {
      if (typeof window !== "undefined") {
         const savedAttempt = localStorage.getItem(`quiz_attempt_${id}`);
         const savedTime = localStorage.getItem(`quiz_time_${id}`);
         const savedIndex = localStorage.getItem(`quiz_question_index_${id}`);

         if (savedAttempt) {
            return {
               attempt: JSON.parse(savedAttempt),
               timeRemaining: savedTime ? parseInt(savedTime) : null,
               questionIndex: savedIndex ? parseInt(savedIndex) : 0,
            };
         }
      }
      return null;
   }, [id]);

   const startNewAttempt = useCallback(
      async (quizData: Quiz) => {
         try {
            setSubmitting(true);
            const response = await fetch(`/api/user/quiz/${id}/attempt`, {
               method: "POST",
               cache: "no-store",
            });

            if (!response.ok) {
               throw new Error("Gagal memulai quiz");
            }

            const data = await response.json();
            const newAttempt = {
               id: data.attempt.id,
               startedAt: data.attempt.startedAt,
               answers: [],
            };

            setAttempt(newAttempt);
            setTimeRemaining(quizData.timeLimit);
            setCurrentQuestionIndex(0);

            if (typeof window !== "undefined") {
               localStorage.setItem(
                  `quiz_attempt_${id}`,
                  JSON.stringify(newAttempt)
               );
               localStorage.setItem(
                  `quiz_time_${id}`,
                  quizData.timeLimit.toString()
               );
               localStorage.setItem(`quiz_question_index_${id}`, "0");
            }
         } catch (error) {
            console.error("Error starting quiz attempt:", error);
            setError("Gagal memulai quiz. Silakan coba lagi.");
         } finally {
            setSubmitting(false);
         }
      },
      [
         id,
         setAttempt,
         setTimeRemaining,
         setCurrentQuestionIndex,
         setError,
         setSubmitting,
      ]
   );

   const checkSavedAttemptOrStart = useCallback(
      (quizData: Quiz) => {
         if (!quizData) {
            setError("Data quiz tidak valid");
            return;
         }

         if (!Array.isArray(quizData.questions)) {
            quizData.questions = [];
         }

         if (quizData.questions.length === 0) {
            setError("Quiz ini tidak memiliki pertanyaan");
            return;
         }

         const savedData = checkLocalStorage();

         if (savedData && !savedData.attempt.completed) {
            try {
               setAttempt(savedData.attempt);
               setTimeRemaining(savedData.timeRemaining || quizData.timeLimit);

               const maxIndex = Math.max(0, quizData.questions.length - 1);
               const safeIndex = Math.min(
                  savedData.questionIndex || 0,
                  maxIndex
               );
               setCurrentQuestionIndex(safeIndex);

               const currentQuestionId = quizData.questions[safeIndex]?.id;
               if (currentQuestionId) {
                  const savedAnswer = savedData.attempt.answers.find(
                     (a: Answer) => a.questionId === currentQuestionId
                  );
                  if (savedAnswer) {
                     setSelectedOption(savedAnswer.selectedOptionId);
                  }
               }

               console.log("Melanjutkan quiz dari localStorage");
            } catch (error) {
               console.error("Error resuming quiz:", error);
               startNewAttempt(quizData);
            }
         } else {
            startNewAttempt(quizData);
         }
      },
      [
         checkLocalStorage,
         startNewAttempt,
         setAttempt,
         setTimeRemaining,
         setCurrentQuestionIndex,
         setSelectedOption,
         setError,
      ]
   );

   useEffect(() => {
      const fetchQuiz = async () => {
         try {
            setLoading(true);
            const response = await fetch(`/api/user/quiz/${id}`, {
               cache: "no-store",
            });

            if (!response.ok) {
               throw new Error("Gagal mengambil data quiz");
            }

            const data = await response.json();
            console.log("Quiz data:", data);

            if (!data.quiz) {
               throw new Error("Data quiz tidak ditemukan");
            }

            const quizData = {
               ...data.quiz,
               questions: [],
            };

            if (!data.quiz.questionCount || data.quiz.questionCount === 0) {
               setError("Quiz ini tidak memiliki pertanyaan");
               setQuiz(quizData);
               setLoading(false);
               return;
            }

            try {
               const questionsResponse = await fetch(
                  `/api/user/quiz/${id}/question`,
                  {
                     cache: "no-store",
                  }
               );
               if (questionsResponse.ok) {
                  const questionsData = await questionsResponse.json();
                  console.log("Questions data:", questionsData);

                  if (
                     questionsData.questions &&
                     Array.isArray(questionsData.questions)
                  ) {
                     quizData.questions = questionsData.questions;
                  }
               } else {
                  throw new Error("Gagal mengambil pertanyaan quiz");
               }
            } catch (questionsError) {
               console.error("Error fetching questions:", questionsError);
               setError(
                  "Gagal memuat pertanyaan quiz. Silakan coba lagi nanti."
               );
               setLoading(false);
               return;
            }

            setQuiz(quizData);

            if (!quizData.questions || quizData.questions.length === 0) {
               setError("Quiz ini tidak memiliki pertanyaan");
            } else {
               checkSavedAttemptOrStart(quizData);
            }
         } catch (error) {
            console.error("Error fetching quiz:", error);
            setError(
               error instanceof Error
                  ? error.message
                  : "Gagal memuat quiz. Silakan coba lagi nanti."
            );
         } finally {
            setLoading(false);
         }
      };

      fetchQuiz();
   }, [id, checkSavedAttemptOrStart]);

   const completeQuiz = useCallback(
      async (answers: Answer[]) => {
         if (!quiz || isComplete) return;

         try {
            setSubmitting(true);

            const totalQuestions = quiz.questions.length;
            const correctCount = answers.filter(
               (a) => a.isCorrect === true
            ).length;
            const incorrectCount = answers.filter(
               (a) => a.isCorrect === false
            ).length;
            const unansweredCount = totalQuestions - answers.length;
            const score = Math.round((correctCount / totalQuestions) * 100);

            setResults({
               correctCount,
               incorrectCount,
               unansweredCount,
               totalQuestions,
               score,
            });

            setIsComplete(true);

            if (attempt) {
               await fetch(
                  `/api/user/quiz/${id}/attempt/${attempt.id}/complete`,
                  {
                     method: "POST",
                     cache: "no-store",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        score,
                        endedAt: new Date().toISOString(),
                        completed: true,
                     }),
                  }
               );

               if (typeof window !== "undefined") {
                  localStorage.removeItem(`quiz_attempt_${id}`);
                  localStorage.removeItem(`quiz_time_${id}`);
                  localStorage.removeItem(`quiz_question_index_${id}`);
               }
            }
         } catch (error) {
            console.error("Error completing quiz:", error);
            setError("Gagal menyelesaikan quiz. Silakan coba lagi.");
         } finally {
            setSubmitting(false);
         }
      },
      [
         quiz,
         isComplete,
         attempt,
         id,
         setSubmitting,
         setResults,
         setIsComplete,
         setError,
      ]
   );

   useEffect(() => {
      if (timeRemaining === null || isComplete) return;

      if (timeRemaining <= 0) {
         if (attempt && quiz && quiz.questions.length > 0) {
            completeQuiz(attempt.answers);
         }
         return;
      }

      timerRef.current = setInterval(() => {
         setTimeRemaining((prev) => {
            if (prev === null || prev <= 1) {
               if (timerRef.current) clearInterval(timerRef.current);
               return 0;
            }

            const newValue = prev - 1;
            if (typeof window !== "undefined") {
               localStorage.setItem(`quiz_time_${id}`, newValue.toString());
            }
            return newValue;
         });
      }, 1000);

      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, [timeRemaining, isComplete, attempt, quiz, id, completeQuiz]);

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, []);

   const handleSelectOption = (optionId: string) => {
      if (submitting || isComplete) return;
      setSelectedOption(optionId);
   };

   const handleSubmitAnswer = async () => {
      if (!quiz || !attempt || !selectedOption || submitting || isComplete)
         return;

      setSubmitting(true);

      try {
         const currentQuestion = quiz.questions[currentQuestionIndex];
         if (!currentQuestion) return;

         const selectedOptionObj = currentQuestion.options.find(
            (opt) => opt.id === selectedOption
         );
         if (!selectedOptionObj) return;

         const newAnswer: Answer = {
            questionId: currentQuestion.id,
            selectedOptionId: selectedOption,
            isCorrect: selectedOptionObj.isCorrect,
         };

         const updatedAttempt = { ...attempt };
         const existingAnswerIndex = updatedAttempt.answers.findIndex(
            (a) => a.questionId === currentQuestion.id
         );

         if (existingAnswerIndex >= 0) {
            updatedAttempt.answers[existingAnswerIndex] = newAnswer;
         } else {
            updatedAttempt.answers.push(newAnswer);
         }

         setAttempt(updatedAttempt);

         if (typeof window !== "undefined") {
            localStorage.setItem(
               `quiz_attempt_${id}`,
               JSON.stringify(updatedAttempt)
            );
         }

         await fetch(`/api/user/quiz/${id}/attempt/${attempt.id}/answer`, {
            method: "POST",
            cache: "no-store",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               questionId: currentQuestion.id,
               selectedOptionId: selectedOption,
               isCorrect: selectedOptionObj.isCorrect,
            }),
         });

         if (currentQuestionIndex < quiz.questions.length - 1) {
            goToNextQuestion();
         } else {
            completeQuiz(updatedAttempt.answers);
         }
      } catch (error) {
         console.error("Error saving answer:", error);
         setError("Gagal menyimpan jawaban. Silakan coba lagi.");
      } finally {
         setSubmitting(false);
      }
   };

   const goToNextQuestion = () => {
      setCurrentQuestionIndex((prev) => {
         const newIndex = prev + 1;
         setSelectedOption(null);

         if (quiz && attempt) {
            const nextQuestionId = quiz.questions[newIndex]?.id;
            const existingAnswer = attempt.answers.find(
               (a) => a.questionId === nextQuestionId
            );
            if (existingAnswer) {
               setSelectedOption(existingAnswer.selectedOptionId);
            }
         }

         if (typeof window !== "undefined") {
            localStorage.setItem(
               `quiz_question_index_${id}`,
               newIndex.toString()
            );
         }

         return newIndex;
      });
   };

   const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
         .toString()
         .padStart(2, "0")}`;
   };

   return {
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
   };
}
