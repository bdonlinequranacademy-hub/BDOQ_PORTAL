/** BDOQ Academy brand copy — aligned with public-site lib/constants.ts */
export const BDOQ_BRAND = {
  name: "BDOQ Academy",
  shortName: "BDOQ Academy",
  logoSrc: "/brand/bdoq-logo.png?v=5",
  tagline:
    "A reliable virtual classroom for online Quran teachers and students",
  portalTagline: "Your Quran learning portal — classes, Tajweed, Hifz & progress",
  website: "https://bdonlinequranacademy.com",
  email: "bdonlinequranacademy@gmail.com",
  contactBD: "+8801923947460",
  contactEG: "+20122681709",
  address: "Gopalganj, Dhaka, Bangladesh",
} as const;

export const BDOQ_ROLE_PORTAL_LABEL: Record<string, string> = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  admin: "Admin Portal",
  super_admin: "Super Admin Portal",
};
