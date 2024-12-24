"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();
  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="h-screen flex justify-center items-center bg-macSky">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-8 rounded-md shadow-2xl flex flex-col gap-2 w-[300px] md:w-[400px]"
        >
          <h1 className="text-xl font-bold flex items-center gap-2 justify-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            MacSchool
          </h1>
          <h2 className="text-gray-400 text-center">Sign in to your account</h2>

          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-sm text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError />
          </Clerk.Field>
          <SignIn.Action submit className="p-2 rounded-md bg-black text-white">
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
