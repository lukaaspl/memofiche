import { TableRowProps, Tr } from "@chakra-ui/react";
import { MotionCustomComponentProps } from "domains/framer-motion";
import { motion } from "framer-motion";

const MotionTr = motion<MotionCustomComponentProps<TableRowProps>>(Tr);

export default MotionTr;
