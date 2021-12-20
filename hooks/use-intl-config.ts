import enhancedIntlContext, {
  EnhancedIntlContext,
} from "contexts/enhanced-intl";
import { useContext } from "react";

export default function useIntlConfig(): EnhancedIntlContext {
  const context = useContext(enhancedIntlContext);

  if (!context) {
    throw new Error("Enhanced intl provider is required");
  }

  return context;
}
