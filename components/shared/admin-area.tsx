import Feedback from "components/shared/feedback";
import useAuth from "hooks/use-auth";
import { FormattedMessage } from "react-intl";

interface AdminAreaProps {
  children: React.ReactNode;
  variant?: "hidden" | "error";
}

export default function AdminArea({
  children,
  variant = "hidden",
}: AdminAreaProps): JSX.Element {
  const { authState } = useAuth();

  if (!authState.user || (authState.user && variant === "hidden")) {
    return <></>;
  }

  if (authState.user.role !== "Admin") {
    return (
      <Feedback
        type="error"
        message={
          <FormattedMessage defaultMessage="You do not have sufficient permissions to view this section" />
        }
      />
    );
  }

  return <>{children}</>;
}
