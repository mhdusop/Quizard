import { HelpCircle } from "lucide-react";

type EmptyStateProps = {
   title: string;
   description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
   return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
         <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
         <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
         <p className="text-gray-600">{description}</p>
      </div>
   );
}