import React from "react";
import LoadingSpinner from "./loading-spinner";

export default function SyncSpinner(): JSX.Element {
  return <LoadingSpinner delay={0.5} ml={2} size="17px" />;
}
