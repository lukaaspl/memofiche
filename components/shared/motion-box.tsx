import { Box, BoxProps } from "@chakra-ui/react";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionBox = motion<OmitMotionCollidedProps<BoxProps>>(Box);

export default MotionBox;
