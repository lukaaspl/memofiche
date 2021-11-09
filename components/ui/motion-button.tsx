import { Button, ButtonProps } from "@chakra-ui/react";
import { MotionCustomComponentProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionButton = motion<MotionCustomComponentProps<ButtonProps>>(Button);

export default MotionButton;
