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
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "이름을 입력해" })
      .max(10, { message: "10자 이내로 입력해" }),
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await fetch(`api/auth/register`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!data.error) {
      toast.success(data.success);
      router.push("/login");
    } else {
      toast.error(data.error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-semibold">회원가입</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NAME</FormLabel>
              <FormControl>
                <Input placeholder="abc" {...field} />
              </FormControl>
              <FormDescription>이름 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMAIL</FormLabel>
              <FormControl>
                <Input placeholder="email@gmail.com" {...field} />
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
        <div className="flex flex-col items-start justify-center space-y-4">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            회원가입
          </Button>
          <Link
            className="bg-violet-700 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded"
            href="/login"
          >
            기존 아이디가 있다면 로그인
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
