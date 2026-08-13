import type {
  OptionalPaymentCategory,
  OptionalPaymentMethod,
} from "@/types/models";

export const OPTIONAL_PAYMENT_CATEGORIES: OptionalPaymentCategory[] = [
  "teacher_bakhshish",
  "eid_gift",
  "sponsor_student",
  "sadaqah",
  "custom",
];

export const OPTIONAL_PAYMENT_METHODS: OptionalPaymentMethod[] = [
  "bkash",
  "nagad",
  "rocket",
  "bank",
];
