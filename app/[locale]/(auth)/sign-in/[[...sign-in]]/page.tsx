import { SignInForm } from "@/components/sign-in-form";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export const runtime = "edge";

interface SignInProps {
  searchParams: {
    redirectUrl?: string;
  };
}

export default function SignIn({ searchParams }: SignInProps) {
  if (auth().userId) {
    return redirect("/");
  }

  const billboardImage = `/billboard-${Math.floor(Math.random() * 3) + 1}.jpg`;

  return (
    <div className="flex-1 flex flex-col justify-center sm:items-center lg:grid grid-cols-3 lg:items-stretch">
      <div className="col-span-1 flex flex-col md:justify-center items-stretch sm:min-w-[550px] lg:min-w-[unset]">
        <SignInForm redirectUrl={searchParams.redirectUrl} />
      </div>
      <div className="col-span-2 relative hidden lg:block">
        <div className="absolute inset-0 backdrop-blur-[2px] z-50"></div>
        <Image
          src={billboardImage}
          alt="Sign in"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
