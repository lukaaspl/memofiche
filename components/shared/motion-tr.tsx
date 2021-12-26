import { TableRowProps, Tr } from "@chakra-ui/react";
import { OmitMotionCollidedProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionTr = motion<OmitMotionCollidedProps<TableRowProps>>(Tr);

export default MotionTr;
