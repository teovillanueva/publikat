import { useMessages } from "next-intl";

export function useClientMessages() {
  const messages = useMessages() as Record<
    string,
    never | Record<string, never>
  >;

  return {
    Common: messages.Common,
    "Sign-In": messages["Sign-In"],
    "Sign-Up": messages["Sign-Up"],
    Onboarding: messages["Onboarding"],
    "Delete-Billboard": messages["Delete-Billboard"],
    Admin: {
      Billboards: {
        "Billboard-Form": messages["Admin"]["Billboards"]["Billboard-Form"],
        "Update-Billboard": messages["Admin"]["Billboards"]["Update-Billboard"],
        "Create-Billboard": messages["Admin"]["Billboards"]["Create-Billboard"],
      },
    },
  } as never;
}
