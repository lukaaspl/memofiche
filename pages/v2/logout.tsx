import RedirectAlert from "components/ui/redirect-alert";
import useAuth from "hooks/use-auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";

const DecksPage: NextPage = () => {
  const { logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logOut();
    router.push("/v2/sign");
  }, [logOut, router]);

  return <RedirectAlert />;
};

export default DecksPage;
