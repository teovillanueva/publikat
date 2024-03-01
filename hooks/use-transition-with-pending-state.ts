import React from "react";

export function useTransitionWithPendingState() {
  const [loading, setLoading] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  return { loading: loading || pending, setLoading, startTransition } as const;
}
