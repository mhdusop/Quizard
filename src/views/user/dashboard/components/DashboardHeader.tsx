// views/user/dashboard/components/DashboardHeader.tsx
import { CalendarCheck } from 'lucide-react';

type DashboardHeaderProps = {
   userName: string;
   greeting: string;
};

export function DashboardHeader({ userName, greeting }: DashboardHeaderProps) {
   const getCurrentDate = () => {
      return new Date().toLocaleDateString('id-ID', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      });
   };

   return (
      <div className="flex flex-col md:flex-row md:justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold mb-1">{greeting}, {userName}!</h1>
            <div className="flex items-center text-gray-500">
               <CalendarCheck className="h-4 w-4 mr-1" />
               <span>{getCurrentDate()}</span>
            </div>
         </div>
         <div className="mt-4 md:mt-0">
            <div className="flex items-center">
               <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-white font-medium">
                  {userName.charAt(0).toUpperCase()}
               </div>
               <div className="ml-3">
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">Student</p>
               </div>
            </div>
         </div>
      </div>
   );
}