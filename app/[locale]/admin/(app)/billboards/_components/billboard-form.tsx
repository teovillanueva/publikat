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
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBillboard, updateBillboard } from "@/actions/billboard";
import { Point } from "geojson";
import { useTransitionWithPendingState } from "@/hooks/use-transition-with-pending-state";

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

const billboardSchema = z.object({
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
  billboardId?: string;
  type: "create" | "update";
  onComplete?: () => void;
}

export function BillboardForm({
  defaultValues,
  type,
  billboardId,
  onComplete,
}: BillboardFormProps) {
  const t = useTranslations("Admin.Billboards.Billboard-Form");
  const tCommon = useTranslations("Common");

  const { loading, setLoading, startTransition } =
    useTransitionWithPendingState();

  const form = useForm<z.infer<typeof billboardSchema>>({
    resolver: zodResolver(billboardSchema),
    defaultValues,
  });

  const onSubmit = React.useCallback(
    async ({
      latitude,
      longitude,
      ...data
    }: z.infer<typeof billboardSchema>) => {
      setLoading(true);

      const location: Point = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      if (type === "update" && billboardId) {
        await updateBillboard(billboardId, {
          ...data,
          location,
        });
      } else {
        await createBillboard({
          ...data,
          location,
        });
      }

      startTransition(() => {
        onComplete?.();

        toast(t("success.title"), {
          description: t("success.description"),
        });
      });
      try {
      } catch (err: any) {
        setLoading(false);
        toast(t("error.title"), {
          description: t("error.description"),
        });
      } finally {
        setLoading(false);
      }
    },
    [billboardId, onComplete, setLoading, startTransition, t, type]
  );

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
