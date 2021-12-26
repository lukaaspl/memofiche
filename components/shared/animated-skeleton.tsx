import { Stack, Skeleton, chakra, SkeletonProps } from "@chakra-ui/react";
import React from "react";

const CustomSkeleton = chakra(Skeleton);

export default function AnimatedSkeleton(props: SkeletonProps): JSX.Element {
  return (
    <CustomSkeleton
      startColor="purple.300"
      endColor="purple.200"
      height="20px"
      {...props}
    />
  );
}

export function AnimatedSkeletonStack(): JSX.Element {
  return (
    <Stack my={5} height="100px">
      <AnimatedSkeleton />
      <AnimatedSkeleton />
      <AnimatedSkeleton />
    </Stack>
  );
}
