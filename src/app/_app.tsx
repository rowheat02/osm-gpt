import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AnimatePresence mode="wait" initial={true}>
      <Component {...pageProps} key={router.asPath} />;
    </AnimatePresence>
  );
}
