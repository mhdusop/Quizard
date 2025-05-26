import { Award, CheckCircle, HelpCircle, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatsOverviewProps = {
   stats: {
      totalQuizzesCompleted: number;
      averageScore: number;
      bestScore: number;
      totalQuestions: number;
   } | null;
};

export function StatsOverview({ stats }: StatsOverviewProps) {
   if (!stats) {
      return (
         <Card>
            <CardContent className="p-6">
               <p>No statistics available</p>
            </CardContent>
         </Card>
      );
   }

   const statItems = [
      {
         title: "Quiz Terselesaikan",
         value: stats.totalQuizzesCompleted,
         icon: <CheckCircle className="h-5 w-5 text-green-500" />,
         color: "bg-green-50",
      },
      {
         title: "Rata-rata Skor",
         value: `${stats.averageScore}%`,
         icon: <Percent className="h-5 w-5 text-blue-500" />,
         color: "bg-blue-50",
      },
      {
         title: "Skor Tertinggi",
         value: `${stats.bestScore}%`,
         icon: <Award className="h-5 w-5 text-yellow-500" />,
         color: "bg-yellow-50",
      },
      {
         title: "Total Pertanyaan Dijawab",
         value: stats.totalQuestions,
         icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
         color: "bg-purple-50",
      },
   ];

   return (
      <Card>
         <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Statistik Anda</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {statItems.map((item, index) => (
                  <div key={index} className={`${item.color} p-4 rounded-lg`}>
                     <div className="flex items-center mb-2">
                        {item.icon}
                        <span className="text-sm ml-2">{item.title}</span>
                     </div>
                     <div className="text-2xl font-bold">{item.value}</div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}