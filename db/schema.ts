import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { cuid } from "./helpers/cuid";
import { geometry } from "./helpers/geo";

export const scheduleEnum = pgEnum("schedule", ["weekly", "monthly"]);

export const billboardStatusEnum = pgEnum("billboard_status", [
  "active",
  "inactive",
]);

export const providers = pgTable("providers", {
  id: cuid().primaryKey(),
  userId: text("user_id").notNull().unique(),
  name: text("name").notNull(),
  // businessName: text("business_name").notNull(),
  // taxId: text("tax_id").notNull(),
  // legalAddress: text("legal_address").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const billboards = pgTable("billboards", {
  id: cuid().primaryKey(),
  address: text("address").notNull(),
  location: geometry("location", { type: "Point" }).notNull(),
  status: billboardStatusEnum("status").notNull().default("active"),
  dailyImpressions: integer("daily_impressions").notNull(),
  schedule: scheduleEnum("schedule").notNull(),
  userId: text("user_id").notNull(),
  providerId: text("provider_id").notNull(),
  resolutionWidth: integer("resolution_width").notNull(), // in pixels
  resolutionHeight: integer("resolution_height").notNull(), // in pixels
  width: integer("width").notNull(), // in centimeters
  height: integer("height").notNull(), // in centimeters
  spotDuration: integer("spot_duration").notNull(), // in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const billboardsRelations = relations(billboards, ({ one }) => ({
  provider: one(providers, {
    fields: [billboards.providerId],
    references: [providers.id],
  }),
}));

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "approved",
  "rejected",
  "ended",
]);

export const bookings = pgTable("bookings", {
  id: cuid().primaryKey(),
  billboardId: text("billboard_id").notNull(),
  schedule: scheduleEnum("schedule").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  userId: text("user_id").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  billboard: one(billboards, {
    fields: [bookings.id],
    references: [billboards.id],
  }),
}));

export type Billboard = typeof billboards.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
