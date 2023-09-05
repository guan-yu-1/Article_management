import React, { ReactNode } from "react";
import Header from "@shared/header";
import styles from "./index.module.css";
import Sidebar from "@shared/sidebar";

interface Props {
  children: ReactNode;
}

export default class Layout extends React.Component<Props> {
  render() {
    return (
      <>
        <Header />
        <div className={styles.main}>
          <div className={styles.left}>
            <Sidebar />
          </div>
          <div className={styles.right}>{this.props.children}</div>
        </div>
      </>
    );
  }
}
