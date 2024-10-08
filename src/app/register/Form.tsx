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
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z
  .object({
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
    confirmPassword: z
      .string()
      .min(2, {
        message: "2글자 이상 입력해",
      })
      .max(50, {
        message: "50글자이하 입력해",
      }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호 다시 확인 해",
        path: ["confirmPassword"],
      });
    }
  });
const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await fetch(`api/auth/register`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
    }
    toast.success(data.success);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-semibold">회원가입</h1>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>비밀번호 확인 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <Link
        className="block border border-black rounded-lg bg-lime-700 py-2  text-center"
        href="/login"
      >
        기존 회원 로그인
      </Link>
    </Form>
  );
};

export default RegisterForm;
