// components/ui/confirmDialog.tsx
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type ConfirmDialogProps = {
   open: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   description: string;
   loading?: boolean;
};

export function ConfirmDialog({
   open,
   onClose,
   onConfirm,
   title,
   description,
   loading = false,
}: ConfirmDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
               <p className="text-gray-600">{description}</p>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={onClose} disabled={loading}>
                  Batal
               </Button>
               <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                  {loading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghapus...
                     </>
                  ) : (
                     "Hapus"
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}