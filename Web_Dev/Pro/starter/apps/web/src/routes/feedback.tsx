import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/feedback")({
  component: RouteComponent,
});

function RouteComponent() {
  const feedbacks = useQuery(trpc.feedback.getAll.queryOptions());

  return (
    <div>
      {feedbacks.data?.map((feedback) => (
        <div key={feedback.id}>
          {feedback.message} - by {feedback.name ?? "Anonymous"}
        </div>
      ))}
    </div>
  );
}
