"use client";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import React from "react";
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
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const billboardSchema = z.object({
  address: z.string(),
  dailyImpressions: z.number(),
  schedule: z.enum(["weekly", "monthly"]),
  resolutionWidth: z.number(),
  resolutionHeight: z.number(),
  width: z.number(),
  height: z.number(),
  spotDuration: z.number(),
  latitude: z.number(),
  longitude: z.number(),
});

interface BillboardFormProps {
  defaultValues?: Partial<z.infer<typeof billboardSchema>>;
  onSubmit(data: z.infer<typeof billboardSchema>): void;
}

export function BillboardForm({ defaultValues, onSubmit }: BillboardFormProps) {
  const t = useTranslations("Admin.Billboards.Billboard-Form");
  const tCommon = useTranslations("Common");

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="create-billboard-form"
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("placeholder.address")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dailyImpressions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("daily-impressions")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.daily-impressions")}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("help.daily-impressions")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("schedule")}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholder.schedule")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="weekly">
                        {tCommon("schedule.weekly")}
                      </SelectItem>
                      <SelectItem value="monthly">
                        {tCommon("schedule.monthly")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resolutionWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("resolution-width")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.resolution-width")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resolutionHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("resolution-height")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.resolution-height")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("width")}</FormLabel>
              <FormControl>
                <NumberInput placeholder={t("placeholder.width")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("height")}</FormLabel>
              <FormControl>
                <NumberInput placeholder={t("placeholder.height")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spotDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("spot-duration")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.spot-duration")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("latitude")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.latitude")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("longitude")}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t("placeholder.longitude")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
