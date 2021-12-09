import { AtSignIcon, Icon, LockIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import CustomButton from "components/ui/custom-button";
import RedirectAlert from "components/ui/redirect-alert";
import Span from "components/ui/span";
import { Nullable } from "domains";
import useAuth from "hooks/use-auth";
import useCommonPalette from "hooks/use-common-palette";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsFillPersonFill } from "react-icons/bs";

interface SignPageProps {
  initialOnRegisterView: boolean;
}

type SignFormValues = {
  email: string;
  password: string;
  name: string;
};

const SignPage: NextPage<SignPageProps> = ({ initialOnRegisterView }) => {
  const [onRegisterView, setOnRegisterView] = useState(initialOnRegisterView);
  const [requestError, setRequestError] = useState<Nullable<string>>(null);
  const [isProcessing, setProcessing] = useState(false);
  const { isLogged, signIn, signUp } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<SignFormValues>();

  const palette = useCommonPalette();

  const onSubmit: SubmitHandler<SignFormValues> = async (values) => {
    setRequestError(null);
    setProcessing(true);

    if (onRegisterView) {
      try {
        await signUp(values);
      } catch {
        setRequestError("An error occurred while signing up");
      }
    } else {
      try {
        await signIn(values);
      } catch {
        setRequestError("An error occurred while signing in");
      }
    }

    setProcessing(false);
  };

  useEffect(() => {
    if (isLogged) {
      router.push("/");
    }
  }, [isLogged, router]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors, onRegisterView]);

  if (isLogged) {
    return <RedirectAlert />;
  }

  return (
    <Center h="100vh">
      <Box
        px="10"
        py="8"
        shadow={palette.containerShadow}
        minW="lg"
        rounded="xl"
        textAlign="center"
      >
        <Heading size="xl" mb="8">
          {onRegisterView ? "Sign up" : "Sign in"}
        </Heading>
        <VStack
          as="form"
          spacing="5"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="100%">
              <AtSignIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="email"
              isInvalid={!!errors.email}
              placeholder="E-mail address"
              // TODO: Remove
              defaultValue="admin@memofiche.pl"
              size="lg"
              focusBorderColor={palette.primary as string}
              {...register("email", { required: true })}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftElement pointerEvents="none" h="100%">
              <LockIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="password"
              isInvalid={!!errors.password}
              placeholder="Password"
              // TODO: Remove
              defaultValue="admin"
              size="lg"
              focusBorderColor={palette.primary as string}
              {...register("password", { required: true })}
            />
          </InputGroup>
          {onRegisterView && (
            <InputGroup>
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={BsFillPersonFill} color="gray.300" fontSize="20" />
              </InputLeftElement>
              <Input
                type="text"
                isInvalid={!!errors.name}
                placeholder="Your name"
                size="lg"
                focusBorderColor={palette.primary as string}
                {...register("name", { required: true })}
              />
            </InputGroup>
          )}
          <CustomButton
            isFullWidth
            type="submit"
            colorScheme="purple"
            size="lg"
            isLoading={isProcessing}
            loadingText="Processing..."
          >
            {onRegisterView ? "Create account" : "Go to app"}
          </CustomButton>
          {requestError && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{requestError}</AlertDescription>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setRequestError(null)}
              />
            </Alert>
          )}
        </VStack>
        <Divider my="8" colorScheme="purple" w="20%" mx="auto" />
        <Span mr="1">
          {onRegisterView
            ? "Already have an account?"
            : "You don't have an account yet?"}
        </Span>
        <Button
          variant="link"
          size="md"
          colorScheme="purple"
          onClick={() => setOnRegisterView((s) => !s)}
        >
          {onRegisterView ? "Sign in" : "Sign up"}
        </Button>
      </Box>
    </Center>
  );
};

export const getServerSideProps: GetServerSideProps<SignPageProps> = async (
  ctx
) => {
  return {
    props: {
      initialOnRegisterView: ctx.query.initial === "register",
    },
  };
};

export default SignPage;
