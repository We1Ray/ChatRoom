import React, { useContext, useState, useEffect } from "react";
import Head from "./Head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Offsidebar from "./Offsidebar";
import Footer from "./Footer";
import SettingsProvider from "./SettingsProvider";
import ThemesProvider from "./ThemesProvider";
import "sweetalert2/src/sweetalert2.scss";
import { SystemContext, System } from "../../resource/index";

export default function Base({ ...props }) {
  return (
    <System system_uid="SYS-1620285176">
      <ThemesProvider>
        <SettingsProvider>
          <BaseContent>{props.children}</BaseContent>
        </SettingsProvider>
      </ThemesProvider>
    </System>
  );
}

function BaseContent({ ...props }) {
  // const { System } = useContext(SystemContext);

  return (
    <div className="wrapper">
      <Head />
      <Header />
      <Sidebar />
      <Offsidebar />
      {/* <section className="section-container">
        {System.userstate === "NoAccount" ? (
          <div className="content-wrapper">
            <div className="content-heading">
              <b style={{ margin: "0 auto" }}>
                {System.getLocalization("Public","ContactRelevantPersonnel")}
              </b>
            </div>
          </div>
        ) : (
          props.props.children
        )}
      </section> */}
      <section className="section-container">{props.children}</section>
      <Footer />
    </div>
  );
}
