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
import { signOut, useSession } from "next-auth/react";

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
});

const DashboardForm = ({ email }: { email: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });

  const { data: session, update } = useSession();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await fetch(`/api/updateEmail`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (data.error) {
      toast.error("이메일 변경에 실패했습니다. 다시 시도하세요.");
      return;
    } else {
      update({
        ...session,
        user: {
          ...session?.user,
          email: values.email,
        },
      });

      // reloadSession();
      // const event = new Event("visibilitychange");
      // document.dispatchEvent(event);
      toast.success("You are now signed in!");

      alert("이메일 변경 완료! 다시 로그인 해");
      signOut();
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-semibold">대시보드 이메일 변경</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMAIL</FormLabel>
              <FormControl>
                <Input placeholder="shadcn@.mail.com" {...field} />
              </FormControl>
              <FormDescription>변경할 이메일 입력해</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="block" type="submit">
          이메일 변경
        </Button>
      </form>
      <Button
        className="border border-black rounded-lg bg-red-400 py-1 px-5"
        onClick={() => signOut()}
      >
        sign out
      </Button>
    </Form>
  );
};

export default DashboardForm;
