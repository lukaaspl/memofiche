import { Box, BoxProps } from "@chakra-ui/react";
import { MotionCustomComponentProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionBox = motion<MotionCustomComponentProps<BoxProps>>(Box);

export default MotionBox;
