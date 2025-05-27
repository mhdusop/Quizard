// views/admin/dashboard/components/StatsOverview.tsx
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, HelpCircle, BarChart, Award, Percent } from "lucide-react";

interface StatsOverviewProps {
   stats: {
      totalQuizzes: number;
      totalUsers: number;
      totalQuestions: number;
      totalAttempts: number;
      averageScore: number;
      completionRate: number;
   };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
   const statItems = [
      {
         title: "Total Quiz",
         value: stats.totalQuizzes,
         icon: <FileText className="h-5 w-5 text-blue-500" />,
         color: "bg-blue-50",
      },
      {
         title: "Total Pengguna",
         value: stats.totalUsers,
         icon: <Users className="h-5 w-5 text-green-500" />,
         color: "bg-green-50",
      },
      {
         title: "Total Pertanyaan",
         value: stats.totalQuestions,
         icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
         color: "bg-purple-50",
      },
      {
         title: "Quiz Dikerjakan",
         value: stats.totalAttempts,
         icon: <BarChart className="h-5 w-5 text-orange-500" />,
         color: "bg-orange-50",
      },
      {
         title: "Rata-rata Skor",
         value: `${stats.averageScore}%`,
         icon: <Award className="h-5 w-5 text-yellow-500" />,
         color: "bg-yellow-50",
      },
      {
         title: "Tingkat Penyelesaian",
         value: `${stats.completionRate}%`,
         icon: <Percent className="h-5 w-5 text-indigo-500" />,
         color: "bg-indigo-50",
      },
   ];

   return (
      <Card className="py-0">
         <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Statistik Keseluruhan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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