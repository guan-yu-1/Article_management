import React from "react";
import AppStoreProvider from "@src/AppStoreProvider";
import AppRouter from "@src/AppRouter";
import { ToastContainer } from "react-toastify";

export default class App extends React.Component {
  render() {
    return (
      <AppStoreProvider>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      </AppStoreProvider>
    );
  }
}
