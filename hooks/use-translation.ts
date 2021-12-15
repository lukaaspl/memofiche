import { IntlShape, useIntl } from "react-intl";

interface UseTranslation {
  intl: IntlShape;
  $t: IntlShape["formatMessage"];
}

export default function useTranslation(): UseTranslation {
  const intl = useIntl();

  return {
    intl,
    $t: intl.formatMessage,
  };
}
