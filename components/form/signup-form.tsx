"use client";

import axios from "axios";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import FeatherIcon from "feather-icons-react";
import * as z from "zod";

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase character.",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase character.",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number.",
  });

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters.")
      .max(32, "Username must be at most 32 characters."),
    email: z.email({ message: "Invalid email." }),
    password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export default function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const router = useRouter();
  const submitHandler = (data: z.infer<typeof formSchema>) => {
    // @ts-expect-error
    mutation.mutate(data);
  };
  const mutation = useMutation({
    mutationFn: async (data) => {
      return axios.post("/api/auth/signup", data);
    },
    onSuccess: () => {
      router.push("/signin");
    },
  });

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Register your account and start chatting with other people~!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-user-signup" onSubmit={form.handleSubmit(submitHandler)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-user-signup-title">
                    Username
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-user-signup-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="your username"
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <FeatherIcon icon="user" />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-user-signup-email">
                    Email
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-user-signup-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="your@email.com"
                      autoComplete="on"
                    />
                    <InputGroupAddon>
                      <FeatherIcon icon="mail" />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-user-signup-password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-user-signup-password"
                      type={!showPassword ? "password" : "text"}
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoComplete="on"
                    />
                    <InputGroupAddon>
                      <FeatherIcon icon="lock" />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        type="button"
                        className="hover:bg-transparent hover:cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? (
                          <FeatherIcon icon="eye" />
                        ) : (
                          <FeatherIcon icon="eye-off" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-user-signup-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-user-signup-confirm-password"
                      type={!showConfirmPassword ? "password" : "text"}
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                      autoComplete="on"
                    />
                    <InputGroupAddon>
                      <FeatherIcon icon="lock" />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        type="button"
                        className="hover:bg-transparent hover:cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {!showConfirmPassword ? (
                          <FeatherIcon icon="eye" />
                        ) : (
                          <FeatherIcon icon="eye-off" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <Button
            type="submit"
            form="form-user-signup"
            className="flex items-center gap-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner /> : <FeatherIcon icon="send" />}
            Sign Up
          </Button>
          {mutation.isError && (
            <span className="text-sm text-rose-600">
              {axios.isAxiosError(mutation.error)
                ? mutation.error.response?.data?.message
                : mutation.error.message}
            </span>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}
