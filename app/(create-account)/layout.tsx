import type { Metadata } from "next";
import "@/app/globals.css";
import { app_title } from "@/constants/constants";

export const metadata: Metadata = {
  title: `Створити аккаунт | ${app_title}`,
  description: "Create an account to access the online store features.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
