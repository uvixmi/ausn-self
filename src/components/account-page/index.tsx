import { ConfigProvider, Layout, List, Typography } from "antd"
import { Link, useLocation } from "react-router-dom"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import { Outlet, useNavigate } from "react-router-dom"
import { LogoIcon } from "../main-page/logo-icon"
import { AccountPageProps } from "./types"
import { useEffect } from "react"
import { clearData, fetchCurrentUser } from "../authorization-page/slice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../main-page/store"
import "./styles.scss"
import cn from "classnames"
import { fetchSourcesInfo } from "./client/sources/thunks"
import { useMediaQuery } from "@react-hook/media-query"
import { Footer } from "antd/es/layout/layout"
import { MenuTaxesIcon } from "./taxes-page/type-operation/icons/menu-taxes"
import { MenuActionsIcon } from "./taxes-page/type-operation/icons/menu-actions"
import { MenuSettingsIcon } from "./taxes-page/type-operation/icons/menu-settings"

export const AccountPage = ({
  token_type,
  accessToken,
  logOut,
}: AccountPageProps) => {
  const { Sider } = Layout

  const { loaded, loading } = useSelector((state: RootState) => state.user)
  const location = useLocation()

  const data = [
    {
      title: CONTENT.SIDER_HEADING_EVENTS,
      to: "/main",
      icon: <MenuActionsIcon />,
    },
    {
      title: CONTENT.SIDER_HEADING_TAXES,
      to: "/taxes",
      icon: <MenuTaxesIcon />,
    },
    {
      title: CONTENT.SIDER_SETTINGS,
      to: "/settings",
      icon: <MenuSettingsIcon />,
    },
  ]

  const settings = [
    {
      title: CONTENT.SIDER_SETTINGS,
      to: "/settings",
      icon: <MenuSettingsIcon />,
    },
    // { title: CONTENT.SIDER_SUPPORT, to: "/support" },
  ]

  const menuItems = [
    {
      label: (
        <Link
          to={"/main"}
          className={cn(styles["menu-footer-item"], {
            [styles["footer-item-active"]]: location.pathname === "/main",
          })}
        >
          <MenuActionsIcon />
          {CONTENT.SIDER_HEADING_EVENTS}
        </Link>
      ),
      key: 1,
    },
    {
      label: (
        <Link
          to={"/taxes"}
          className={cn(styles["menu-footer-item"], {
            [styles["footer-item-active"]]: location.pathname === "/taxes",
          })}
        >
          <MenuTaxesIcon />
          {CONTENT.SIDER_HEADING_TAXES}
        </Link>
      ),
      key: 2,
    },
    /* {
      label: (
        <Link
          to={"/reports"}
          className={cn(styles["menu-footer-item"], {
            [styles["footer-item-active"]]: location.pathname === "/reports",
          })}
        >
          <MenuReportsIcon />
          {CONTENT.SIDER_HEADING_REPORTS}
        </Link>
      ),
      key: 3,
    },*/
    {
      label: (
        <Link
          to={"/settings"}
          className={cn(styles["menu-footer-item"], {
            [styles["footer-item-active"]]: location.pathname === "/settings",
          })}
        >
          <MenuSettingsIcon />
          {CONTENT.SIDER_SETTINGS}
        </Link>
      ),
      key: 4,
    },
  ]

  const { Title, Text } = Typography

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!loaded && loading !== "") {
      dispatch(fetchCurrentUser())

      dispatch(fetchSourcesInfo())
    }
  }, [dispatch, loaded, loading])

  const navigate = useNavigate()

  const isMobile = useMediaQuery("(max-width: 1279px)")

  const { data: currentUser } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    window.carrotquest &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      window.carrotquest.onReady(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.carrotquest.messenger.toStateCollapsed()

        if (currentUser.email) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          window.carrotquest.auth(currentUser.id, currentUser.hashed_id)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          window.carrotquest.identify({
            $name: currentUser.full_name,
            $email: currentUser.email,
            $phone: currentUser.phone_number,
            inn: currentUser.inn,
          })
        }
      })
  }, [])

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorLink: "#505050",
            colorPrimary: "#6159ff",
            colorBgLayout: "#fff",
            colorBgContainerDisabled: "#fff",
            colorTextDisabled: "#141414",
            lineHeight: 1.14285714285,
            fontSize: 12,
          },
          components: {
            Layout: {
              siderBg: "#fff",
            },
            Button: {
              colorBgContainerDisabled: "#F0F0F0",
              borderColorDisabled: "#F0F0F0",
              colorTextDisabled: "#D1D1D1",
            },
          },
        }}
      >
        <Layout>
          {!isMobile && (
            <Sider
              className={styles["left-sider-wrapper"]}
              width={250}
              style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <div className={styles["left-sider-inner"]}>
                <div className={styles["logo-inner"]}>
                  <LogoIcon
                    onClick={() => {
                      navigate("/main"), logOut(), dispatch(clearData())
                    }}
                    type="icon-custom"
                    className={styles["logo-item"]}
                  />
                </div>
                <div className={styles["left-sider-menu-inner"]}>
                  <List
                    className={cn(
                      "left-sider-menu-custom",
                      styles["left-sider-menu"]
                    )}
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "8px",
                          padding: 0,
                        }}
                      >
                        <Link
                          //underline={item.title == CONTENT.HEADING_TAXES}
                          //strong={item.title == CONTENT.HEADING_TAXES}
                          to={item.to}
                          className={cn(styles["item-link-item"], {
                            [styles["item-active"]]:
                              location.pathname === item.to,
                            [styles["item-hover"]]:
                              location.pathname !== item.to,
                          })}
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      </List.Item>
                    )}
                  />
                  {/*<List
                    className={styles["left-sider-menu"]}
                    dataSource={settings}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          border: "none",
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "8px",
                        }}
                        className={cn(styles["item-link-item"], {
                          [styles["item-active"]]:
                            location.pathname === item.to,
                        })}
                      >
                        {item.icon}
                        <Link //underline={item == CONTENT.HEADING_TAXES}
                          to={item.to}
                          className={cn(styles["item-link-item"], {
                            [styles["item-active"]]:
                              location.pathname === item.to,
                          })}
                        >
                          {item.title}
                        </Link>
                      </List.Item>
                    )}
                        />*/}
                </div>
              </div>
            </Sider>
          )}

          <Outlet />
          {isMobile && (
            <Footer
              style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                zIndex: 999,
              }}
              className={styles["menu-footer"]}
            >
              <div className={styles["menu-footer-inner"]}>
                {menuItems.map((item) => item.label)}
              </div>
            </Footer>
          )}
        </Layout>
      </ConfigProvider>
    </>
  )
}
