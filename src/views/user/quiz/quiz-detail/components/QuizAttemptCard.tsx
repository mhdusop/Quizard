import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

type PastAttempt = {
   id: string;
   score: number | null;
   completedAt: string;
};

type QuizAttemptsCardProps = {
   attempts: PastAttempt[];
};

export function QuizAttemptsCard({ attempts }: QuizAttemptsCardProps) {
   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: "numeric",
         month: "long",
         year: "numeric"
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-md">Riwayat Pengerjaan</CardTitle>
         </CardHeader>
         <CardContent>
            {attempts.length === 0 ? (
               <div className="text-center p-4 text-gray-500">
                  <p>Anda belum pernah mengerjakan quiz ini</p>
               </div>
            ) : (
               <div className="space-y-3">
                  {attempts.map(attempt => (
                     <AttemptItem
                        key={attempt.id}
                        attempt={attempt}
                        formatDate={formatDate}
                     />
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
}

type AttemptItemProps = {
   attempt: PastAttempt;
   formatDate: (date: string) => string;
};

function AttemptItem({ attempt, formatDate }: AttemptItemProps) {
   return (
      <div className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
         <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
               {formatDate(attempt.completedAt)}
            </div>
            <div className="flex items-center">
               <Award className="h-4 w-4 mr-1 text-primary" />
               <span className="font-medium">{attempt.score}%</span>
            </div>
         </div>
      </div>
   );
}