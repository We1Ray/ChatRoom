import React, { useContext, useState, useEffect } from "react";
import { withTranslation, Trans } from "@/components/Common/Translate";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import { Collapse, Badge } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/actions";
import SidebarUserBlock from "./SidebarUserBlock";
import {
  SystemContext,
  CallApi,
  CENTER_FACTORY,
  CENTER_IP,
  PublicMethod,
} from "../../resource/index";

const parents = (element, selector) => {
  if (typeof selector !== "string") {
    return null;
  }

  const parents = [];
  let ancestor = element.parentNode;

  while (
    ancestor &&
    ancestor.nodeType === Node.ELEMENT_NODE &&
    ancestor.nodeType !== 3 /*NODE_TEXT*/
  ) {
    if (ancestor.matches(selector)) {
      parents.push(ancestor);
    }

    ancestor = ancestor.parentNode;
  }
  return parents;
};
// Helper to get outerHeight of a dom element
const outerHeight = (elem, includeMargin) => {
  const style = getComputedStyle(elem);
  const margins = includeMargin
    ? parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10)
    : 0;
  return elem.offsetHeight + margins;
};

/**
    Component to display headings on sidebar
*/
const SidebarItemHeader = ({ item }) => (
  <li className="nav-heading">
    <span>
      <Trans i18nKey={item.translate}>{item.heading}</Trans>
    </span>
  </li>
);

/**
    Normal items for the sidebar
*/
const SidebarItem = ({ item, isActive, className, onMouseEnter }) => (
  <li className={isActive ? "active" : ""} onMouseEnter={onMouseEnter}>
    <Link href={item.path ? item.path : "/"} as={item.as}>
      <a title={item.name}>
        {item.label && (
          <Badge tag="div" className="float-right" color={item.label.color}>
            {item.label.value}
          </Badge>
        )}
        {item.icon && <em className={item.icon} />}
        <span>
          <Trans i18nKey={item.translate}>{item.name}</Trans>
        </span>
      </a>
    </Link>
  </li>
);

/**
    Build a sub menu with items inside and attach collapse behavior
*/
function SidebarSubItem({
  item,
  isActive,
  handler,
  children,
  isOpen,
  onMouseEnter,
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [JSON.stringify(isOpen)]);

  function handle() {
    setOpen(!open);
    handler;
  }

  return (
    <li className={isActive ? "active" : ""}>
      {PublicMethod.checkValue(item.path) ? (
        <>
          <Link href={item.path}>
            <div
              className="nav-item"
              onClick={handle}
              onMouseEnter={onMouseEnter}
            >
              {item.label && (
                <Badge
                  tag="div"
                  className="float-right"
                  color={item.label.color}
                >
                  {item.label.value}
                </Badge>
              )}
              {item.icon && <em className={item.icon} />}
              <span>
                <Trans i18nKey={item.translate}>{item.name}</Trans>
              </span>
            </div>
          </Link>
          <Collapse isOpen={open}>
            <ul id={item.path} className="sidebar-nav sidebar-subnav">
              {children}
            </ul>
          </Collapse>
        </>
      ) : (
        <>
          <div
            className="nav-item"
            onClick={handle}
            onMouseEnter={onMouseEnter}
          >
            {item.label && (
              <Badge tag="div" className="float-right" color={item.label.color}>
                {item.label.value}
              </Badge>
            )}
            {item.icon && <em className={item.icon} />}
            <span>
              <Trans i18nKey={item.translate}>{item.name}</Trans>
            </span>
          </div>
          <Collapse isOpen={open}>
            <ul id={item.path} className="sidebar-nav sidebar-subnav">
              {children}
            </ul>
          </Collapse>
        </>
      )}
    </li>
  );
}

/**
    Component used to display a header on menu when using collapsed/hover mode
*/
const SidebarSubHeader = ({ item }) => (
  <li className="sidebar-subnav-header">{item.name}</li>
);

const SidebarBackdrop = ({ closeFloatingNav }) => (
  <div className="sidebar-backdrop" onClick={closeFloatingNav} />
);

const FloatingNav = ({
  item,
  target,
  routeActive,
  isFixed,
  closeFloatingNav,
}) => {
  let asideContainer = document.querySelector(".aside-container");
  let asideInner = asideContainer.firstElementChild; /*('.aside-inner')*/
  let sidebar = asideInner.firstElementChild; /*('.sidebar')*/

  let mar =
    parseInt(getComputedStyle(asideInner)["padding-top"], 0) +
    parseInt(getComputedStyle(asideContainer)["padding-top"], 0);
  let itemTop = target.parentElement.offsetTop + mar - sidebar.scrollTop;
  let vwHeight = document.body.clientHeight;

  const setPositionStyle = (el) => {
    if (!el) return;
    el.style.position = isFixed ? "fixed" : "absolute";
    el.style.top = itemTop + "px";
    el.style.bottom = outerHeight(el, true) + itemTop > vwHeight ? 0 : "auto";
  };

  return (
    <ul
      id={item.path}
      ref={setPositionStyle}
      className="sidebar-nav sidebar-subnav nav-floating"
      onMouseLeave={closeFloatingNav}
    >
      <SidebarSubHeader item={item} />
      {item.submenu.map((subitem, i) => (
        <SidebarItem
          key={i}
          item={subitem}
          isActive={routeActive(subitem.path)}
        />
      ))}
    </ul>
  );
};

function Sidebar(props) {
  const { System } = useContext(SystemContext);
  const [menu, setMenu] = useState([]);
  const [collapse, setCollapse] = useState({});
  const [showSidebarBackdrop, setShowSidebarBackdrop] = useState(false);
  const [currentFloatingItem, setCurrentFloatingItem] = useState(null);
  const [currentFloatingItemTarget, setCurrentFloatingItemTarget] =
    useState(null);
  const [pathname, setPathname] = useState(props.router.pathname);

  useEffect(() => {
    document.addEventListener("click", closeSidebarOnExternalClicks);
    Router.events.on("routeChangeStart", handleRouteChange);
    Router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
      Router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  useEffect(() => {
    settingMenu();
  }, [System.token, System.lang, JSON.stringify(System.factory)]);

  const handleRouteComplete = (pathname) => {
    setPathname(pathname);
  };

  const handleRouteChange = () => {
    closeFloatingNav();
    closeSidebar();
  };

  const settingMenu = () => {
    if (PublicMethod.checkValue(System.token)) {
      CallApi.ExecuteApi(
        CENTER_FACTORY,
        CENTER_IP + "/sidebar/get_account_available_menu",
        {
          access_token: System.token,
          system_uid: System.system_uid,
          language: System.lang,
          factory_uid: System.factory.uid,
        }
      )
        .then((res) => {
          if (PublicMethod.checkValue(res.data)) {
            setMenu(
              getTreeJsonFromData(
                res.data.filter(({ is_open }) => is_open === "Y")
              )
            );
            buildCollapseList(
              getTreeJsonFromData(
                res.data.filter(({ is_open }) => is_open === "Y")
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getTreeJsonFromData = (treeitem) => {
    let result = [];
    let level = { result };
    treeitem.forEach((treeitem) => {
      treeitem["program_code"].split(".").reduce((r, name, i, a) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({
            name: treeitem["program_name"],
            path: treeitem["path"],
            icon: treeitem["icon"],
            submenu: r[name].result,
          });
        }
        return r[name];
      }, level);
    });
    return result;
  };

  const closeSidebar = () => {
    props.actions.toggleSetting("asideToggled");
  };

  const closeSidebarOnExternalClicks = (e) => {
    // don't check if sidebar not visible
    if (!props.settings.asideToggled) return;

    if (
      !parents(e.target, ".aside-container").length && // if not child of sidebar
      !parents(e.target, ".topnavbar-wrapper").length && // if not child of header
      !e.target.matches("#user-block-toggle") && // user block toggle anchor
      !e.target.parentElement.matches("#user-block-toggle") // user block toggle icon
    ) {
      closeSidebar();
    }
  };

  /** prepare initial state of collapse menus.*/
  const buildCollapseList = (Menu) => {
    let collapse = {};
    const getCollapse = (item, collapse) => {
      item
        .filter(({ heading }) => !heading)
        .forEach(({ name, path, submenu }) => {
          collapse[name] = routeActive(
            submenu ? submenu.map(({ path }) => path) : path
          );
          for (let index = 0; index < submenu.length; index++) {
            if (PublicMethod.checkValue(submenu[index].submenu)) {
              getCollapse([submenu[index]], collapse);
            }
          }
        });
    };
    getCollapse(Menu, collapse);
    setCollapse(collapse);
  };

  const routeActive = (paths) => {
    const currpath = pathname;
    paths = Array.isArray(paths) ? paths : [paths];
    return paths.some((p) =>
      p === "/" ? currpath === p : currpath.indexOf(p) > -1
    );
  };

  const toggleItemCollapse = (stateName) => () => {
    let col = collapse;
    for (let c in collapse) {
      if (c === stateName) {
        col[c] = !collapse[stateName];
      }
    }
    setCollapse(col);
  };

  const getSubRoutes = (item) => item.submenu.map(({ path }) => path);

  /** map menu config to string to determine which element to render */
  const itemType = (item) => {
    if (item.heading) return "heading";
    if (!item.submenu || !PublicMethod.checkValue(item.submenu)) return "menu";
    if (item.submenu) return "submenu";
  };

  const shouldUseFloatingNav = () => {
    return (
      props.settings.isCollapsed ||
      props.settings.isCollapsedText ||
      props.settings.asideHover
    );
  };

  const showFloatingNav = (item) => (e) => {
    if (shouldUseFloatingNav()) {
      setCurrentFloatingItem(item);
      setCurrentFloatingItemTarget(e.currentTarget);
      setShowSidebarBackdrop(true);
    }
  };

  const closeFloatingNav = () => {
    setCurrentFloatingItem(null);
    setCurrentFloatingItemTarget(null);
    setShowSidebarBackdrop(false);
  };

  let Menu = (item) => {
    return item.map((item, i) => {
      // heading
      if (itemType(item) === "heading")
        return <SidebarItemHeader item={item} key={i} />;
      else if (itemType(item) === "menu") {
        return (
          <SidebarItem
            isActive={routeActive(item.path)}
            item={item}
            key={i}
            onMouseEnter={closeFloatingNav}
          />
        );
      } else if (itemType(item) === "submenu") {
        return [
          <>
            <SidebarSubItem
              item={item}
              isOpen={collapse[item.name]}
              handler={toggleItemCollapse(item.name)}
              isActive={routeActive(getSubRoutes(item))}
              key={i}
              onMouseEnter={showFloatingNav(item)}
            >
              <SidebarSubHeader item={item} key={i} />
              {item.submenu.map((subitem, i) => (
                <>
                  {PublicMethod.checkValue(subitem.submenu) ? (
                    Menu([subitem])
                  ) : (
                    <SidebarItem
                      key={i}
                      item={subitem}
                      isActive={routeActive(subitem.path)}
                    />
                  )}
                </>
              ))}
            </SidebarSubItem>
          </>,
        ];
      }
      return null; // unrecognized item
    });
  };

  return (
    <>
      <aside className="aside-container">
        {/* START Sidebar (left) */}
        <div className="aside-inner">
          <nav
            className={
              "sidebar " +
              (props.settings.asideScrollbar ? "show-scrollbar" : "")
            }
          >
            {/* START sidebar nav */}
            <ul className="sidebar-nav">
              {/* START user info */}
              <li className="has-user-block">
                <SidebarUserBlock />
              </li>
              {/* END user info */}

              {/* Iterates over all sidebar items */}
              {Menu(menu)}
            </ul>
            {/* END sidebar nav */}
          </nav>
        </div>
        {/* END Sidebar (left) */}
        {currentFloatingItem && currentFloatingItem.submenu && (
          <FloatingNav
            item={currentFloatingItem}
            target={currentFloatingItemTarget}
            routeActive={routeActive}
            isFixed={props.settings.isFixed}
            closeFloatingNav={closeFloatingNav}
          />
        )}
      </aside>
      {showSidebarBackdrop && (
        <SidebarBackdrop closeFloatingNav={closeFloatingNav} />
      )}
    </>
  );
}

const mapStateToProps = (state) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation(Sidebar)));
