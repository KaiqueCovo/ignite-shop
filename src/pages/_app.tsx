import type { AppProps } from "next/app";
import { Header } from "@/components";
import { globalStyles } from "@/styles/global";
import { Container } from "@/styles/pages/app";

globalStyles();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header />
      <Component {...pageProps} />;
    </Container>
  );
}

export default MyApp;
