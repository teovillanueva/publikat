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
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Link, useRouter } from "./navigation";
import { toast } from "sonner";
import { createProvider } from "@/actions/providers";

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

const onboardingSchema = z.object({
  name: z.string(),
  businessName: z.string(),
  taxId: z.string(),
  legalAddress: z.string(),
});

interface OnboardingFormProps {}

export function OnboardingForm({}: OnboardingFormProps) {
  const t = useTranslations("Onboarding");
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof onboardingSchema>) => {
      setLoading(true);
      await createProvider(data);

      router.push("/admin");
      try {
      } catch (err: any) {
        setLoading(false);
        toast(t("form.error.title"), {
          description: t("form.error.description"),
        });
      }
    },
    [router, t]
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
            id="on-boarding-form"
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholder.name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.business-name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholder.business-name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.tax-id")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholder.tax-id")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.legal-address")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholder.legal-address")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" form="on-boarding-form" className="w-full">
            {t("form.submit")}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
