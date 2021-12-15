import { useLocalStorage } from "beautiful-react-hooks";
import { Locale } from "consts/locales";
import { LOCALE } from "consts/storage-keys";
import { Nullable } from "domains";
import { createContext, useCallback, useEffect, useState } from "react";
import { IntlConfig, IntlProvider } from "react-intl";

export interface EnhancedIntlContext {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const enhancedIntlContext = createContext<Nullable<EnhancedIntlContext>>(null);

type Messages = IntlConfig["messages"];

interface EnhancedIntlProviderProps {
  children: JSX.Element;
}

async function getMessagesByLocale(locale: Locale): Promise<Messages> {
  let messages: Messages;

  try {
    messages = (await import(`compiled-lang/${locale}.json`)).default;
  } catch {
    console.warn(`Lack of ${locale}.json translation file`);
  }

  return messages;
}

export function EnhancedIntlProvider({
  children,
}: EnhancedIntlProviderProps): JSX.Element {
  const [locale, setLocale] = useLocalStorage<Locale>(LOCALE, Locale.EN);
  const [messages, setMessages] = useState<Messages>();

  const onLocaleChange = useCallback(
    (locale: Locale) => {
      setLocale(() => locale);
    },
    [setLocale]
  );

  // swallow translation errors
  const handleIntlError = (): void => void 0;

  useEffect(() => {
    async function applyMessages(): Promise<void> {
      const messages = await getMessagesByLocale(locale);
      setMessages(messages);
    }

    applyMessages();
  }, [locale]);

  return (
    <enhancedIntlContext.Provider value={{ locale, onLocaleChange }}>
      <IntlProvider
        key={locale}
        messages={messages}
        locale={locale}
        onError={handleIntlError}
      >
        {children}
      </IntlProvider>
    </enhancedIntlContext.Provider>
  );
}

export default enhancedIntlContext;
