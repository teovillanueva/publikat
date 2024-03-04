"use client";

import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { getDateFormat } from "@/lib/format";
import { es } from "date-fns/locale";

export const bookBillboardSchema = z.object({
  startDate: z.date(),
});

interface BookBillboardFormProps {
  billboardId: string;
}

const locales = {
  es: es,
};

export function BookBillboardForm({}: BookBillboardFormProps) {
  const t = useTranslations("Admin.Billboards.Billboard-Form");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  const form = useForm<z.infer<typeof bookBillboardSchema>>({
    resolver: zodResolver(bookBillboardSchema),
  });

  const onSubmit = (data: z.infer<typeof bookBillboardSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="book-billboard-form"
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal [&>.btn-flex]:flex-1",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        getDateFormat(locale).format(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <div className="flex-1">
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={locales[locale as keyof typeof locales] as any}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
