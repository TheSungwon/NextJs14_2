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
    if (values?.email === session?.user?.email) {
      toast.error("이메일 변경 실패", {
        description: "현재 이메일과 동일합니다.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }
    console.log(values);
    const response = await fetch(`/api/updateEmail`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (data.error) {
      toast.error("이메일 변경 실패", {
        description: "다시 시도하세요.",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
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
      toast.success("이메일 변경 완료", {
        description: "",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  }
  return (
    <>
      <h1 className="text-2xl font-semibold">
        welcome back {session?.user?.email}
      </h1>
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
                  <Input placeholder="hello@mail.com" {...field} />
                </FormControl>
                <FormDescription>변경할 이메일 입력해</FormDescription>
                <FormMessage className="shake" />
              </FormItem>
            )}
          />

          <Button className="block w-40" type="submit">
            이메일 변경
          </Button>
        </form>
        <Button
          className="border border-black rounded-lg bg-red-400 py-1 w-40"
          onClick={() => signOut()}
        >
          로그아웃
        </Button>
      </Form>
    </>
  );
};

export default DashboardForm;
