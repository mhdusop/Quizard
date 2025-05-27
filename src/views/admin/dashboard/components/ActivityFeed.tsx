// views/admin/dashboard/components/ActivityFeed.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Activity {
   id: number;
   user: string;
   action: string;
   target: string;
   time: string;
   score?: number;
}

export function ActivityFeed() {
   // Mock data - in a real app, this would come from an API
   const activities: Activity[] = [
      {
         id: 1,
         user: "John Doe",
         action: "completed",
         target: "Basic Mathematics Quiz",
         time: "5 menit yang lalu",
         score: 85
      },
      {
         id: 2,
         user: "Admin User",
         action: "created",
         target: "New Geography Quiz",
         time: "1 jam yang lalu"
      },
      {
         id: 3,
         user: "Jane Smith",
         action: "completed",
         target: "World History Challenge",
         time: "2 jam yang lalu",
         score: 70
      },
      {
         id: 4,
         user: "Admin User",
         action: "updated",
         target: "Science Quiz Questions",
         time: "3 jam yang lalu"
      },
      {
         id: 5,
         user: "Alice Johnson",
         action: "completed",
         target: "Literature Classics",
         time: "5 jam yang lalu",
         score: 90
      }
   ];

   function getActionBadgeVariant(action: string) {
      switch (action) {
         case 'completed': return 'success';
         case 'created': return 'default';
         case 'updated': return 'outline';
         default: return 'secondary';
      }
   }

   function getScoreColor(score: number) {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="space-y-5">
               {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0 border-gray-100">
                     <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center capitalize text-gray-700 font-medium">
                        {activity.user.charAt(0)}
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm">
                           <span className="font-medium">{activity.user}</span>
                           {" "}
                           {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                           <Badge variant={getActionBadgeVariant(activity.action) as any}>
                              {activity.action}
                           </Badge>
                           {" "}
                           <span className="font-medium">{activity.target}</span>
                           {activity.score !== undefined && (
                              <span className={`ml-2 font-semibold ${getScoreColor(activity.score)}`}>
                                 {activity.score}%
                              </span>
                           )}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                           <Clock className="h-3 w-3 mr-1" />
                           <span>{activity.time}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}