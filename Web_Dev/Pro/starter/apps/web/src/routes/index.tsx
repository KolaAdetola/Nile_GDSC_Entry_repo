import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { email, string, z } from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const feedbackSchema = z.object({
  name: string({
    error: "We have absolutely no idea who you're, please give us a name",
  }).max(50, { error: "Are you trying to list your family tree?" }),
  email: email({ error: "What you typed in is not a valid email" }),
  message: string()
    .min(2, { error: "You can't leave this empty bro" })
    .max(200, {
      error: "Only a max of 200 characters are allowed",
    }),
});

function HomeComponent() {
  const { data } = authClient.useSession();
  const form = useForm({
    defaultValues: {
      name: data?.user.name || "",
      email: data?.user.email || "",
      message: "",
    },
    validators: {
      onSubmit: feedbackSchema,
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate({ ...value });
    },
  });
  const createMutation = useMutation(
    trpc.feedback.create.mutationOptions({
      onSuccess: () => {
        toast.success("Feedback successfully received", {
          description: "If you don't hear from us, it means we didn't like it",
        });
      },
      onError: (error) => {
        console.log(error.message);
      },
    })
  );
  const deleteMutation = useMutation(
    trpc.feedback.delete.mutationOptions({
      onSuccess: () => {
        // todos.refetch();
      },
    })
  );

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Feedback Booth</CardTitle>
          <CardDescription>
            Welcome to the feedback booth 😊 where all your complaints get
            tossed and your good comments get framed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="feedback-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Your name, we won't remember"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="How do we get to touch you? (email)"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="message"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Talk to daddy. I'm all ears 👂"
                          rows={6}
                          className="min-h-24 resize-none"
                          aria-invalid={isInvalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.state.value.length}/200 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="feedback-form">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
