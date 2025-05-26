// views/user/dashboard/components/DashboardHeader.tsx
import { CalendarCheck } from 'lucide-react';

type DashboardHeaderProps = {
   name: string;
   greeting: string;
};

export function DashboardHeader({ name, greeting }: DashboardHeaderProps) {
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
            <h1 className="text-2xl font-bold mb-1">{greeting}, {name}!</h1>
            <div className="flex items-center text-gray-500">
               <CalendarCheck className="h-4 w-4 mr-1" />
               <span className='text-sm'>{getCurrentDate()}</span>
            </div>
         </div>
      </div>
   );
}