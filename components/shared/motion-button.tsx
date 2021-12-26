import { Button, ButtonProps } from "@chakra-ui/react";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionButton = motion<OmitMotionCollidedProps<ButtonProps>>(Button);

export default MotionButton;
