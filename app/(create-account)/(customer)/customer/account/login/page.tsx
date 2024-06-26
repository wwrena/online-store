"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/lib/axios.config";
import { useRouter } from "next/navigation";
import useStore, { AuthState } from "@/context/store";

type LoginFormData = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const router = useRouter();

  const { setAccountType, setAuthState, setCredentials } = useStore();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    api
      .post(
        "/customers/account/login",
        {
          ...data,
        },
        { withCredentials: true },
      )
      .then((response) => {
        if (response.data.token) {
          api
            .get("/sentry", {
              withCredentials: true,
            })
            .then((credentials) => {
              setCredentials(credentials.data.account);
              setAuthState(AuthState.AUTHENTICATED);
              setAccountType(credentials.data.account.type);
            });
          router.push("/");
        }
      });
  };

  return (
    <div className="w-full flex lg:flex-row">
      <div className="flex items-center justify-center flex-1 px-3">
        <div className="mx-auto grid w-[350px] gap-6">
          <header className="flex items-center gap-1">
            <ChevronLeft />
            <Link className="font-medium" href="/">
              На головну
            </Link>
          </header>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Вхід в аккаунт</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Пошта</Label>
              <Input
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Неправильний формат адреси",
                  },
                  required: true,
                })}
                id="email"
                type="email"
                placeholder="customer@gmail.com"
              />
              {errors.email?.message && (
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Пароль</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Пароль повинен містити хоча би 8 символів",
                  },
                })}
              />
              {errors.password?.message && (
                <p className="text-sm text-red-500">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="w-full"
            >
              Увійти
            </Button>
          </div>
          <div className="text-center text-sm">
            Немає аккаунту?{" "}
            <Link href="/customer/account/create" className="underline">
              Створити
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-muted flex-1 mobile:hidden h-screen"></div>
    </div>
  );
}
