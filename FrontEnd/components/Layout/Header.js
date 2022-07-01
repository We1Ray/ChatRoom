import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";
import ToggleFullscreen from "../Common/ToggleFullscreen";
import HeaderSearch from "./HeaderSearch";
import Select from "react-select";
import {
  CallApi,
  SystemContext,
  CENTER_FACTORY,
  CENTER_IP,
} from "../../resource/index";

function Header(props) {
  const { System, SystemDispatch } = useContext(SystemContext);
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [factory_Options, setFactory_Options] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState(undefined);
  const lang_Options = [
    { label: "繁體中文", value: "TW" },
    { label: "English", value: "EN" },
  ];

  useEffect(() => {
    initLocalization();
  }, []);

  useEffect(() => {
    initial_Factory_Option();
  }, [System.system_uid]);

  async function initLocalization() {
    let lang_in_cookie = false;
    if (localStorage.getItem("Language")) {
      for (let c in lang_Options) {
        if (lang_Options[c].value === localStorage.getItem("Language")) {
          lang_in_cookie = true;
          setSelectedLanguage(lang_Options[c]);
        }
      }
      if (!lang_in_cookie) {
        setSelectedLanguage(lang_Options[0]);
      }
    } else {
      setSelectedLanguage(lang_Options[0]);
    }
  }

  function initial_Factory_Option() {
    if (System.system_uid) {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        CENTER_IP + "/system_factory/get_system_factory",
        { system_uid: System.system_uid }
      )
        .then(async (res) => {
          let option = [];
          for (let index = 0; index < res.data.length; index++) {
            option.push({
              value: res.data[index]["ws_datasource"],
              label: res.data[index]["factory_name"],
              item: {
                uid: res.data[index]["factory_uid"],
                ip: res.data[index]["ws_url"],
                name: res.data[index]["ws_datasource"],
              },
            });
          }
          setFactory_Options(option);

          let factory_in_cookie = false;
          if (localStorage.getItem("factory")) {
            for (let c in option) {
              if (option[c].item.uid === localStorage.getItem("factory")) {
                factory_in_cookie = true;
                setSelectedFactory(option[c]);
              }
            }
            if (!factory_in_cookie) {
              setSelectedFactory(option[0]);
            }
          } else {
            setSelectedFactory(option[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  useEffect(() => {
    if (selectedFactory) {
      localStorage.setItem("factory", selectedFactory.item.uid);
      SystemDispatch({ type: "factory", value: selectedFactory.item });
    }
  }, [selectedFactory]);

  useEffect(() => {
    if (selectedLanguage) {
      localStorage.setItem("Language", selectedLanguage.value);
      SystemDispatch({ type: "lang", value: selectedLanguage.value });
    }
  }, [selectedLanguage]);

  function onChangeFactory(e, option) {
    try {
      setSelectedFactory(e);
    } catch (error) {
      console.log("EROOR: Header.onChangeFactory");
      console.log(error);
    }
  }

  function onChangeLanguage(e, option) {
    try {
      setSelectedLanguage(e);
    } catch (error) {
      console.log("EROOR: Header.onChangeFactory");
      console.log(error);
    }
  }

  const toggleNavSearch = (e) => {
    e.preventDefault();
    setNavSearchOpen(!navSearchOpen);
  };

  const closeNavSearch = (e) => {
    e.preventDefault();
    setNavSearchOpen(false);
  };

  const toggleUserblock = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("showUserBlock");
  };

  const toggleUserSignOut = (e) => {
    SystemDispatch({
      type: "token",
      value: "",
    });
    SystemDispatch({ type: "userstate", value: "logout" });
  };

  const toggleOffsidebar = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("offsidebarOpen");
  };

  const toggleCollapsed = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("isCollapsed");
    resize();
  };

  const toggleAside = (e) => {
    e.preventDefault();
    props.actions.toggleSetting("asideToggled");
  };

  function resize() {
    // all IE friendly dispatchEvent
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
    // modern dispatchEvent way
    // window.dispatchEvent(new Event('resize'));
  }

  return (
    <header className="topnavbar-wrapper">
      {/* START Top Navbar */}
      <nav className="navbar topnavbar">
        {/* START navbar header */}
        <div className="navbar-header">
          <a className="navbar-brand" href="#/">
            <div className="brand-logo">
              <img
                // className="img-fluid"
                src="/static/img/icon.png"
                alt="App Logo"
                height="40"
              />
            </div>
            <div className="brand-logo-collapsed">
              <img
                className="img-fluid"
                src="/static/img/icon.png"
                alt="App Logo"
                // height="40"
              />
            </div>
          </a>
        </div>
        {/* END navbar header */}

        {/* START Left navbar */}
        <ul className="navbar-nav mr-auto flex-row">
          <li className="nav-item">
            {/* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
            <a
              href=""
              className="nav-link d-none d-md-block d-lg-block d-xl-block"
              onClick={toggleCollapsed}
            >
              <em className="fas fa-bars" />
            </a>
            {/* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
            <a
              href=""
              className="nav-link sidebar-toggle d-md-none"
              onClick={toggleAside}
            >
              <em className="fas fa-bars" />
            </a>
          </li>
          {/* START User avatar toggle */}
          <li className="nav-item d-none d-md-block">
            <a className="nav-link" onClick={toggleUserblock}>
              <em className="icon-user" />
            </a>
          </li>
          {/* END User avatar toggle */}
          {/* START lock screen */}
          <li className="nav-item d-none d-md-block">
            <Link href="/pages/lock" as="/lock">
              <a title="Lock screen" className="nav-link">
                <em className="icon-lock" />
              </a>
            </Link>
          </li>
          {/* END lock screen */}
        </ul>
        {/* END Left navbar */}
        {/* START Right Navbar */}
        <ul className="navbar-nav flex-row">
          {/* Search icon */}
          <li className="nav-item">
            <a className="nav-link" href="" onClick={toggleNavSearch}>
              <em className="icon-magnifier" />
            </a>
          </li>
          {/* Fullscreen (only desktops) */}
          <li className="nav-item d-none d-md-block">
            <ToggleFullscreen className="nav-link" />
          </li>
          <li className="nav-item d-none d-md-block">
            <div
              style={{
                width: "150px",
                height: "20px",
                // position: 'absolute',
                top: "30%",
                left: "50%",
                margin: "10px 0 0 0",
              }}
            >
              <Select
                options={lang_Options}
                value={selectedLanguage}
                onChange={onChangeLanguage}
                styles={{ width: "150px" }}
              />
            </div>
          </li>
          {factory_Options ? (
            <li className="nav-item d-none d-md-block">
              <div
                style={{
                  width: "150px",
                  height: "20px",
                  // position: 'absolute',
                  top: "30%",
                  left: "50%",
                  margin: "10px 0 0 0",
                }}
              >
                <Select
                  options={factory_Options}
                  value={selectedFactory}
                  onChange={onChangeFactory}
                  styles={{ width: "150px" }}
                />
              </div>
            </li>
          ) : (
            <></>
          )}
          {/* START Alert menu */}
          <UncontrolledDropdown nav inNavbar className="dropdown-list">
            <DropdownToggle nav className="dropdown-toggle-nocaret">
              <em className="icon-bell" />
              <span className="badge badge-danger">11</span>
            </DropdownToggle>
            {/* START Dropdown menu */}
            <DropdownMenu
              right
              className="dropdown-menu-right animated flipInX"
            >
              <DropdownItem>
                {/* START list group */}
                <ListGroup>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fab fa-twitter fa-2x text-info" />
                      </div>
                      <div className="media-body">
                        <p className="m-0">New followers</p>
                        <p className="m-0 text-muted text-sm">1 new follower</p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fa fa-envelope fa-2x text-warning" />
                      </div>
                      <div className="media-body">
                        <p className="m-0">New e-mails</p>
                        <p className="m-0 text-muted text-sm">
                          You have 10 new emails
                        </p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="media">
                      <div className="align-self-start mr-2">
                        <em className="fa fa-tasks fa-2x text-success" />
                      </div>
                      <div className="media-body">
                        <p className="m-0">Pending Tasks</p>
                        <p className="m-0 text-muted text-sm">
                          11 pending task
                        </p>
                      </div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem
                    action
                    tag="a"
                    href=""
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="d-flex align-items-center">
                      <span className="text-sm">More notifications</span>
                      <span className="badge badge-danger ml-auto">14</span>
                    </span>
                  </ListGroupItem>
                </ListGroup>
                {/* END list group */}
              </DropdownItem>
            </DropdownMenu>
            {/* END Dropdown menu */}
          </UncontrolledDropdown>
          {/* END Alert menu */}
          {/* START Offsidebar button */}
          <li className="nav-item">
            <a className="nav-link" href="" onClick={toggleOffsidebar}>
              <em className="icon-notebook" />
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a href="" className="nav-link" onClick={toggleUserSignOut}>
              <em className="fas fa-sign-out-alt" />
            </a>
          </li>
          {/* END Offsidebar menu */}
        </ul>
        {/* END Right Navbar */}

        {/* START Search form */}
        <HeaderSearch isOpen={navSearchOpen} onClose={closeNavSearch} />
        {/* END Search form */}
      </nav>
      {/* END Top Navbar */}
    </header>
  );
}

Header.propTypes = {
  actions: PropTypes.object,
  settings: PropTypes.object,
};

const mapStateToProps = (state) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
