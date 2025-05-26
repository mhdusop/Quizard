import { QuizCard } from "./QuizCard";

type Quiz = {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questionCount: number;
};

type QuizGridProps = {
   quizzes: Quiz[];
   onQuizSelect: (quizId: string) => void;
};

export function QuizGrid({ quizzes, onQuizSelect }: QuizGridProps) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {quizzes.map((quiz) => (
            <QuizCard
               key={quiz.id}
               quiz={quiz}
               onSelect={() => onQuizSelect(quiz.id)}
            />
         ))}
      </div>
   );
}