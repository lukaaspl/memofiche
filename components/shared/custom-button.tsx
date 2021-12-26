import { Button, ButtonProps } from "@chakra-ui/button";
import { forwardRef } from "react";

const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} fontFamily="Poppins" {...props} />
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
