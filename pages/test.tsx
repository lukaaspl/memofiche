import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import { NextPage } from "next";
import React from "react";

const TestPage: NextPage = () => {
  return (
    <Layout>
      <PrimaryHeading>Test</PrimaryHeading>
    </Layout>
  );
};

export default TestPage;
