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
import CustomButton from "components/shared/custom-button";
import RedirectAlert from "components/shared/redirect-alert";
import Span from "components/shared/span";
import Logo from "components/ui/logo";
import { Nullable } from "domains";
import useAuth from "hooks/use-auth";
import useCommonPalette from "hooks/use-common-palette";
import useTranslation from "hooks/use-translation";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsFillPersonFill } from "react-icons/bs";
import { hasErrorStatus } from "utils/errors";

interface SignPageProps {
  initialOnRegisterView: boolean;
}

type SignFormValues = {
  email: string;
  password: string;
  name: string;
};

const DEMO_EMAIL = "demo@memofiche.com";
const DEMO_PASSWORD = "demo";

const SignPage: NextPage<SignPageProps> = ({ initialOnRegisterView }) => {
  const [onRegisterView, setOnRegisterView] = useState(initialOnRegisterView);
  const [requestError, setRequestError] = useState<Nullable<string>>(null);
  const [isProcessing, setProcessing] = useState(false);
  const { isLogged, signIn, signUp } = useAuth();
  const router = useRouter();
  const { $t } = useTranslation();

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
      } catch (error) {
        setRequestError(
          hasErrorStatus(error, "conflict")
            ? $t({
                defaultMessage: "The e-mail address is already taken",
              })
            : $t({
                defaultMessage: "An error occurred while signing up",
              })
        );
      }
    } else {
      try {
        await signIn(values);
      } catch (error) {
        setRequestError(
          hasErrorStatus(error, "unauthorized")
            ? $t({
                defaultMessage: "The login details are incorrect",
              })
            : $t({
                defaultMessage: "An error occurred while signing in",
              })
        );
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
    <Center h="100vh" flexDirection="column">
      <Box
        px={{ base: 5, sm: 7, md: 10 }}
        py="8"
        shadow={palette.containerShadow}
        minW={{ base: "sm", sm: "md", md: "lg" }}
        rounded="xl"
        textAlign="center"
        position="relative"
      >
        <Logo
          textAlign="left"
          variant="full"
          size="4xl"
          top="0"
          left="50%"
          transform="translate(-50%, -180%)"
          position="absolute"
          color={palette.primary as string}
        />
        <Heading size="lg" mb="5">
          {onRegisterView
            ? $t({ defaultMessage: "Sign up" })
            : $t({ defaultMessage: "Sign in" })}
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
              placeholder={$t({ defaultMessage: "E-mail address" })}
              defaultValue={DEMO_EMAIL}
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
              placeholder={$t({ defaultMessage: "Password" })}
              defaultValue={DEMO_PASSWORD}
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
                placeholder={$t({ defaultMessage: "Your name" })}
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
            loadingText={$t({ defaultMessage: "Processing..." })}
          >
            {onRegisterView
              ? $t({ defaultMessage: "Create account" })
              : $t({ defaultMessage: "Go to app" })}
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
            ? $t({ defaultMessage: "Already have an account?" })
            : $t({ defaultMessage: "You don't have an account yet?" })}
        </Span>
        <Button
          variant="link"
          size="md"
          colorScheme="purple"
          onClick={() => setOnRegisterView((s) => !s)}
        >
          {onRegisterView
            ? $t({ defaultMessage: "Sign in" })
            : $t({ defaultMessage: "Sign up" })}
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
