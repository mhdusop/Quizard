import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface User {
   id: string;
   name: string | null;
   email: string;
   role: string;
   createdAt: string;
}

interface UsersListProps {
   users: User[];
}

export function UsersList({ users }: UsersListProps) {
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
            <CardTitle>Daftar Pengguna</CardTitle>
         </CardHeader>
         <CardContent>
            {users.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <p>Belum ada pengguna terdaftar</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Nama</TableHead>
                           <TableHead>Email</TableHead>
                           <TableHead>Role</TableHead>
                           <TableHead>Terdaftar</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {users.map((user) => (
                           <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                 <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                    {user.role === "ADMIN" ? "Admin" : "User"}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                 <div className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(user.createdAt)}
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