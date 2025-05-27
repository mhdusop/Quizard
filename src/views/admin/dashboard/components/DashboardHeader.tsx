interface DashboardHeaderProps {
   title: string;
   description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
   return (
      <div className="mb-6">
         <h1 className="text-3xl font-bold mb-1">{title}</h1>
         <p className="text-gray-500">{description}</p>
      </div>
   );
}