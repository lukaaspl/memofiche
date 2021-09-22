import Document, { Html, Head, Main, NextScript } from "next/document";
import { SheetsRegistry, JssProvider, createGenerateId } from "react-jss";

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          {/* TODO */}
          {/* <link rel="icon" href="link to favicon" /> */}
          {/* <link href="link to font" rel="stylesheet" /> */}
        </Head>
        <body>
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
