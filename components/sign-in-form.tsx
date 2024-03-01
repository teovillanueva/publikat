"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { OAuthStrategy } from "@clerk/nextjs/server";
import { Link, useRouter } from "./navigation";

const Icons = {
  google: (props: any) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
};

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface SignInFormProps {
  redirectUrl?: string;
}

export function SignInForm({ redirectUrl = "/" }: SignInFormProps) {
  const t = useTranslations("Sign-In");
  const router = useRouter();

  const { signIn, setActive } = useSignIn();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const signInWith = React.useCallback(
    (strategy: OAuthStrategy) => {
      return (e: React.SyntheticEvent) => {
        e.preventDefault();
        return signIn?.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: redirectUrl,
        });
      };
    },
    [redirectUrl, signIn]
  );

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof signInSchema>) => {
      try {
        const result = await signIn?.create({
          identifier: data.email,
          password: data.password,
        });

        if (result?.status === "complete") {
          await setActive?.({ session: result.createdSessionId });
          router.push(redirectUrl);
        } else {
          throw new Error();
        }
      } catch (err: any) {
        toast(t("form.error.title"), {
          description: t("form.error.description"),
        });
      }
    },
    [redirectUrl, router, setActive, signIn, t]
  );

  return (
    <Form {...form}>
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-1">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={140}
            height={40}
            className="mb-2"
          />
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="sign-in-form"
            className="grid gap-4"
          >
            <div className="flex">
              <Button
                onClick={signInWith("oauth_google")}
                className="flex-1"
                type="button"
                variant="outline"
              >
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("continue-with")}
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.password")}</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link href="/forgot-password">
              <Button variant="link" className="p-0 h-[unset]">
                {t("form.forgot-password")}
              </Button>
            </Link>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" form="sign-in-form" className="w-full">
            {t("form.submit")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("form.no-account")}{" "}
            <Link
              href={
                redirectUrl ? `/sign-up?redirectUrl=${redirectUrl}` : "/sign-up"
              }
            >
              <Button variant="link" className="p-0">
                {t("form.sign-up")}
              </Button>
            </Link>
          </span>
        </CardFooter>
      </Card>
    </Form>
  );
}
