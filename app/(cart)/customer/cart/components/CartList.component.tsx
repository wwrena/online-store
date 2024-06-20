"use client";

import useCartStore from "@/context/customer_cart.store";
import { CameraOff, Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Product = ({ product, title }: { product: any; title: string }) => {
  return (
    <div className="flex items-center">
      <div className="bg-zinc-100 w-[70px] h-[70px] flex items-center justify-center rounded-sm shrink-0">
        {product.product_image && (
          <Image
            src={product.product_image}
            alt=""
            width={70 - 24}
            height={70 - 24}
            className="mix-blend-multiply w-auto h-auto"
          />
        )}
        {!product.product_image && <CameraOff color="gray" />}
      </div>
      <div className="ml-2">
        <p className="text-zinc-400 text-xs font-semibold">{title}</p>
        <Link
          href={`/products/view/${product.id}`}
          className="select-none text-sm font-medium cursor-pointer hover:underline text-ellipsis overflow-hidden"
        >
          {product.product_title}
        </Link>
      </div>
      <p className="ml-auto text-black font-medium text-nowrap text-sm">
        {product.product_price} UAH
      </p>
    </div>
  );
};

export const localizedTitle = {
  gpu: {
    title: "Відеокарта",
  },
  cpu: {
    title: "Процесор",
  },
  motherboard: {
    title: "Материнська плата",
  },
  storage: {
    title: "Накопичувач",
  },
  ram: {
    title: "Оперативна пам'ять",
  },
  psu: {
    title: "Блок живлення",
  },
  case: {
    title: "Корпус",
  },
};

export const CartList = () => {
  const { throttle, setThrottle, cartData, setCartData } = useCartStore();

  useEffect(() => {
    const storage = localStorage.getItem("cart");

    setCartData(storage && JSON.parse(storage));
    setTimeout(() => {
      setThrottle(false);
    }, 500);
  }, [setCartData, setThrottle]);

  if (throttle) {
    return (
      <div className="w-full flex items-center justify-center mt-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="flex-1 h-60 items-center justify-center flex flex-col">
        <div className="bg-zinc-100 rounded-full p-4">
          <ShoppingCart className="text-zinc-500" strokeWidth={2} />
        </div>
        <p className="text-sm text-zinc-400 mt-3 mx-4 text-center">
          Ваш кошик порожній. Сюди додається товар коли ви натискаєте на кнопку{" "}
          <span className="text-blue-500 font-medium">Додати в кошик</span> або
          обираєте товар в{" "}
          <Link
            href="/build"
            className="text-blue-500 hover:underline font-medium"
          >
            конфігураторі
          </Link>
          .
        </p>
      </div>
    );
  }

  return Object.keys(cartData).map((key: string) => (
    <div key={key} className="my-2">
      {/* @ts-ignore */}
      <Product title={localizedTitle[key].title} product={cartData[key]} />
    </div>
  ));
};
