// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Head, Html, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { createGenerateId, JssProvider, SheetsRegistry } from "react-jss";
import theme from "theme";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const registry = new SheetsRegistry();
  const generateId = createGenerateId();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => {
        return function EnhancedApp(props) {
          return (
            <JssProvider registry={registry} generateId={generateId}>
              <App {...props} />
            </JssProvider>
          );
        };
      },
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style id="server-side-styles">{registry.toString()}</style>
      </>
    ),
  };
};

export default CustomDocument;
