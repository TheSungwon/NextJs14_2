"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn, SignInResponse } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "2글자 이상 입력해",
    })
    .max(50, {
      message: "50글자이하 입력해",
    })
    .email("이메일 형식으로 입력해"),
  password: z
    .string()
    .min(2, {
      message: "2글자 이상 입력해",
    })
    .max(50, {
      message: "50글자이하 입력해",
    }),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response: SignInResponse | undefined = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!response?.error) {
      router.push("/dashboard");
    }
    toast.success("You are now signed in!");
    form.setError("email", { message: "이메일 다시 입력해" });
    form.setError("password", { message: "비밀번호 다시 입력해" });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-semibold">로그인</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMAIL</FormLabel>
              <FormControl>
                <Input placeholder="shadcn@.mail.com" {...field} />
              </FormControl>
              <FormDescription>이메일 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>비밀번호 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">로그인</Button>
      </form>
      <Link
        className="w-20 block border border-black rounded-lg bg-lime-700 py-2  text-center"
        href="/register"
      >
        회원가입
      </Link>
    </Form>
  );
};

export default LoginForm;
