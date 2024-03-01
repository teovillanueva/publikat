import { OnboardingForm } from "@/components/onboarding-form";
import { findProviderByUserId } from "@/lib/server/data/providers";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Onboarding() {
  const { userId } = auth();

  const provider = userId ? await findProviderByUserId(userId) : null;

  if (provider) {
    return redirect("/admin");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-[550px]">
        <OnboardingForm />
      </div>
    </div>
  );
}
