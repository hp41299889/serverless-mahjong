import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
