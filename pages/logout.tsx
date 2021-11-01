import RedirectAlert from "components/ui/redirect-alert";
import useAuth from "hooks/use-auth";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { EffectCallback, useCallback } from "react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

const LogoutPage: NextPage = () => {
  const { logOut } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logOutEffect = useCallback<EffectCallback>(() => {
    // reset user state and access token
    logOut();

    // remove cached queries
    queryClient.removeQueries();

    // redirect to login page
    router.push("/sign");
  }, [logOut, queryClient, router]);

  useEffect(logOutEffect, [logOutEffect]);

  return <RedirectAlert />;
};

export default LogoutPage;
