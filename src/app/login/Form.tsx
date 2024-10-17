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
      toast.success("로그인 성공!");
      router.push("/dashboard");
    } else {
      toast.warning("로그인 실패! 이메일, 비밀번호를 확인하세요.");
      form.setError("email", { message: "이메일 다시 입력해" });
      form.setError("password", { message: "비밀번호 다시 입력해" });
    }
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
                <div className="transition duration-200 focus-within:scale-110 relative">
                  <Input placeholder="email@gmail.com" {...field} />
                </div>
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
                <div className="transition duration-200 focus-within:scale-110">
                  <Input type="password" {...field} />
                </div>
              </FormControl>
              <FormDescription>비밀번호 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          로그인
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p>
          아이디가 없나요?{" "}
          <Link
            href="/register"
            className="text-violet-700 hover:text-violet-600"
          >
            회원가입
          </Link>
          하세요.
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;
