import { Loader2 } from "lucide-react";

type LoadingStateProps = {
   message?: string;
};

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-500">{message}</p>
         </div>
      </div>
   );
}