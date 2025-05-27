import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart } from "lucide-react";

interface Quiz {
   id: string;
   title: string;
   description?: string;
   questionCount: number;
   createdAt: string;
   attempts: number;
}

interface QuizListProps {
   quizzes: Quiz[];
   onQuizSelect: (quizId: string) => void;
   onQuizEdit: (quizId: string) => void;
   title: string;
   showViewAll: boolean;
   onViewAll?: () => void;
}

export function QuizList({
   quizzes,
   title,
   showViewAll,
   onViewAll
}: QuizListProps) {
   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: 'numeric',
         month: 'short',
         year: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
   };

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {showViewAll && onViewAll && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewAll}
               >
                  Lihat Semua
               </Button>
            )}
         </CardHeader>
         <CardContent>
            {quizzes.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <p>Belum ada quiz tersedia</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Judul</TableHead>
                           <TableHead>Dibuat</TableHead>
                           <TableHead className="text-center">Dikerjakan</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {quizzes.map((quiz) => (
                           <TableRow key={quiz.id}>
                              <TableCell className="font-medium">{quiz.title}</TableCell>
                              <TableCell className="text-muted-foreground">
                                 <div className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(quiz.createdAt)}
                                 </div>
                              </TableCell>
                              <TableCell className="text-center">
                                 <div className="flex items-center justify-center">
                                    <BarChart className="mr-1 h-4 w-4" />
                                    {quiz.attempts}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            )}
         </CardContent>
      </Card>
   );
}