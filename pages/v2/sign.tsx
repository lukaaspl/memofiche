import { AtSignIcon, Icon, LockIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import RedirectAlert from "components/ui/redirect-alert";
import { Nullable } from "domains";
import useAuth from "hooks/use-auth";
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

  const onSubmit: SubmitHandler<SignFormValues> = async (values) => {
    setRequestError(null);
    setProcessing(true);

    if (onRegisterView) {
      try {
        await signUp(values);
      } catch {
        setRequestError("An error occurred while signing up the new user");
      }
    } else {
      try {
        await signIn(values);
      } catch {
        setRequestError("An error occurred while signing in the new user");
      }
    }

    setProcessing(false);
  };

  useEffect(() => {
    if (isLogged) {
      router.push("/v2/");
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
      <Box px="10" py="8" shadow="xl" minW="lg" rounded="xl" textAlign="center">
        <Heading color="gray.900" size="xl" mb="8">
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
              size="lg"
              focusBorderColor="purple.500"
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
              size="lg"
              focusBorderColor="purple.500"
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
                focusBorderColor="purple.500"
                {...register("name", { required: true })}
              />
            </InputGroup>
          )}
          <Button
            isFullWidth
            type="submit"
            colorScheme="purple"
            size="lg"
            isLoading={isProcessing}
            loadingText="Processing..."
          >
            {onRegisterView ? "Create account" : "Go to app"}
          </Button>
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
        <Text as="span" mr="1">
          {onRegisterView
            ? "Already have an account?"
            : "You don't have an account yet?"}
        </Text>
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
