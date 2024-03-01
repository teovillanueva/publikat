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
import { useSignUp } from "@clerk/nextjs";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { OAuthStrategy } from "@clerk/nextjs/server";
import { Link, useRouter } from "./navigation";
import { OTPInput } from "input-otp";
import { FakeDash, Slot } from "./ui/otp-input";
import { Spinner } from "./ui/spinner";

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

const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

interface SignUpFormProps {
  redirectUrl?: string;
}

export function SignUpForm({ redirectUrl = "/" }: SignUpFormProps) {
  const t = useTranslations("Sign-Up");
  const router = useRouter();

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const { signUp, setActive, isLoaded } = useSignUp();
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  console.log(signUp);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const signUpWith = React.useCallback(
    (strategy: OAuthStrategy) => {
      return (e: React.SyntheticEvent) => {
        e.preventDefault();
        return signUp?.authenticateWithRedirect({
          strategy,
          redirectUrl: "/sso-callback",
          redirectUrlComplete: redirectUrl,
        });
      };
    },
    [redirectUrl, signUp]
  );

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof signUpSchema>) => {
      try {
        await signUp?.create({
          emailAddress: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });

        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setPendingVerification(true);
      } catch (err: any) {
        toast(t("form.error.title"), {
          description: t("form.error.description"),
        });
      }
    },
    [signUp, t]
  );

  const verifyAccount = React.useCallback(async () => {
    setLoading(true);
    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: otp,
      });
      if (completeSignUp?.status !== "complete") {
        throw new Error("Verification failed");
      }

      if (completeSignUp.status === "complete") {
        await setActive?.({ session: completeSignUp.createdSessionId });
        router.push(redirectUrl);
      }
    } catch (err: any) {
      toast(t("verification.error.title"), {
        description: t("verification.error.description"),
      });
    } finally {
      setLoading(false);
    }
  }, [otp, redirectUrl, router, setActive, signUp, t]);

  const reset = React.useCallback(() => {
    setPendingVerification(false);
    setOtp("");
    signUp?.create({});
    form.reset();
  }, [form, signUp]);

  React.useEffect(() => {
    if (isLoaded) {
      if (signUp?.unverifiedFields.includes("email_address")) {
        setPendingVerification(true);
      }

      setReady(true);
    }
  }, [signUp, isLoaded]);

  if (!ready)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
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
          <CardTitle className="text-2xl">
            {t(pendingVerification ? "verification.title" : "title")}
          </CardTitle>
          <CardDescription>
            {t(
              pendingVerification ? "verification.description" : "description"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingVerification ? (
            <div className="space-y-2">
              <div className="flex gap-4 items-center">
                <OTPInput
                  maxLength={6}
                  onComplete={verifyAccount}
                  onChange={setOtp}
                  containerClassName="group flex items-center has-[:disabled]:opacity-30"
                  render={({ slots }) => (
                    <>
                      <div className="flex">
                        {slots.slice(0, 3).map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>

                      <FakeDash />

                      <div className="flex">
                        {slots.slice(3).map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>
                    </>
                  )}
                />
                {loading && <Spinner />}
              </div>
              <Button className="px-0" variant="link" onClick={reset}>
                {t("verification.reset")}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="sign-up-form"
              className="grid gap-4"
            >
              <div className="flex">
                <Button
                  onClick={signUpWith("oauth_google")}
                  className="flex-1"
                  variant="outline"
                  type="button"
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
              <div className="flex gap-4 [&>div]:flex-1">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.first-name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.last-name")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            </form>
          )}
        </CardContent>
        {!pendingVerification && (
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" form="sign-up-form" className="w-full">
              {t("form.submit")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("form.has-account")}{" "}
              <Link
                href={
                  redirectUrl
                    ? `/sign-in?redirectUrl=${redirectUrl}`
                    : "/sign-in"
                }
              >
                <Button variant="link" className="p-0">
                  {t("form.sign-in")}
                </Button>
              </Link>
            </span>
          </CardFooter>
        )}
      </Card>
    </Form>
  );
}
