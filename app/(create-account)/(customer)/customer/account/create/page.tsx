"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/lib/axios.config";
import { useRouter } from "next/navigation";
import useStore, { AuthState } from "@/context/store";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const router = useRouter();

  const { setAccountType, setAuthState, setCredentials } = useStore();

  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    if (data.password !== data.confirm_password) {
      setError("password", {
        message: "Паролі не співпадають",
      });
      setError("confirm_password", {
        message: "Паролі не співпадають",
      });
    }

    setSubmitting(true);

    api
      .post(
        "/api/v1/customers/account/create",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.data.token) {
          api
            .get("/api/v1/sentry", {
              withCredentials: true,
            })
            .then((credentials) => {
              setCredentials(credentials.data.account);
              setAuthState(AuthState.AUTHENTICATED);
              setAccountType(credentials.data.account.type);
            });

          router.push("/");
        }
      })
      .catch((e) => {
        setError(e.response.data.field, {
          message: e.response.data.message,
        });
        setSubmitting(false);
      });
  };

  return (
    <div className="w-full flex lg:grow">
      <div className="flex items-center justify-center flex-1 px-3 h-[calc(100vh-45px)]">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Створення аккаунту</h1>
            <p className="text-balance text-muted-foreground">
              Ми збираємо мінімум даних для функціонування
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Введіть Ваше ім&apos;я</Label>
              <Input
                id="customer-name"
                required
                {...register("name", {
                  required: true,
                })}
              />
              {errors.name?.message && (
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              )}
            </div>
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
                required
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
                {...register("password", {
                  min: {
                    value: 8,
                    message: "Пароль повинен містити хоча би 8 символів",
                  },
                  required: true,
                })}
                id="password"
                type="password"
                required
              />
              {errors.password?.message && (
                <p className="text-sm text-red-500">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Підтвердіть пароль</Label>
              </div>
              <Input
                {...register("confirm_password", {
                  min: {
                    value: 8,
                    message: "Пароль повинен містити хоча би 8 символів",
                  },
                  required: true,
                })}
                id="confirm-password"
                type="password"
                required
              />
              {errors.confirm_password?.message && (
                <p className="text-sm text-red-500">
                  {errors.confirm_password?.message}
                </p>
              )}
            </div>
            {errors.root?.message && (
              <p className="text-sm text-red-500">{errors.root?.message}</p>
            )}
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="w-full"
            >
              {!isSubmitting && "Створити"}
              {isSubmitting && <Loader2 className="animate-spin" />}
            </Button>
          </div>
          <div className="text-center text-sm">
            Вже є аккаунт?{" "}
            <Link href="/customer/account/login" className="underline">
              Увійти
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-muted flex-1 max-sm:hidden h-screen"></div>
    </div>
  );
}
