import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "@/redux/store";
import { AuthProvider } from "@/contexts/auth";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default wrapper.withRedux(App);
