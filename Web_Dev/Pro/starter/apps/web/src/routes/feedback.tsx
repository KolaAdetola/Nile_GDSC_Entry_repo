import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/feedback")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = authClient.useSession();
  const feedbacks = useQuery(trpc.feedback.getAll.queryOptions());

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-full w-2/3">
        {feedbacks.isPending && <Loader className="animate-spin" />}
        <Table>
          <TableCaption>All feeedbacks submitted</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks?.data?.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell className="font-medium">
                  {feedback.email == data?.user.email ? "You" : feedback.name}
                </TableCell>
                <TableCell>
                  {feedback.email == data?.user.email
                    ? "Your email"
                    : feedback.email}
                </TableCell>
                <TableCell className="">{feedback.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
