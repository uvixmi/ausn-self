import {
  Button,
  ConfigProvider,
  Layout,
  List,
  Menu,
  Select,
  Table,
  Typography,
} from "antd"
import { Link, useLocation } from "react-router-dom"
import { CONTENT } from "./constants"
import styles from "./styles.module.scss"
import { Outlet, useNavigate } from "react-router-dom"
import { LogoIcon } from "../main-page/logo-icon"
import { AccountPageProps } from "./types"
import { useEffect, useState } from "react"
import { SourcesInfo, TaskResponse, User, api } from "../../api/myApi"
import { clearData, fetchCurrentUser } from "../authorization-page/slice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../main-page/store"
import { useAuth } from "../../AuthContext"
import Cookies from "js-cookie"
import { v4 as uuid } from "uuid"
import cn from "classnames"
import { fetchSourcesInfo } from "./client/sources/thunks"
import { useMediaQuery } from "@react-hook/media-query"
import { Footer } from "antd/es/layout/layout"
import { MenuTaxesIcon } from "./taxes-page/type-operation/icons/menu-taxes"
import { MenuActionsIcon } from "./taxes-page/type-operation/icons/menu-actions"
import { MenuReportsIcon } from "./taxes-page/type-operation/icons/menu-reports"
import { MenuSettingsIcon } from "./taxes-page/type-operation/icons/menu-settings"

export const AccountPage = ({
  token_type,
  accessToken,
  logOut,
}: AccountPageProps) => {
  const { Sider } = Layout

  const { data: loaded } = useSelector((state: RootState) => state.user)

  const location = useLocation()

  const data = [
    { title: CONTENT.SIDER_HEADING_EVENTS, to: "/main" },
    { title: CONTENT.SIDER_HEADING_TAXES, to: "/taxes" },
    { title: CONTENT.SIDER_HEADING_REPORTS, to: "/reports" },
  ]

  const settings = [
    { title: CONTENT.SIDER_SETTINGS, to: "/settings" },
    { title: CONTENT.SIDER_SUPPORT, to: "/support" },
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
          <MenuActionsIcon
            className={cn({
              [styles["footer-item-active"]]: location.pathname === "/main",
            })}
          />
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
          <MenuTaxesIcon
            className={cn({
              [styles["footer-item-active"]]: location.pathname === "/taxes",
            })}
          />
          {CONTENT.SIDER_HEADING_TAXES}
        </Link>
      ),
      key: 2,
    },
    {
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
    },
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
    if (!loaded) {
      dispatch(fetchCurrentUser())
      dispatch(fetchSourcesInfo())
    }
  }, [dispatch, loaded])

  const navigate = useNavigate()

  const isMobile = useMediaQuery("(max-width: 767px)")

  useEffect(() => {
    console.log(location.pathname)
  }, [location])

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
              borderColorDisabled: "#8C8C8C",
            },
          },
        }}
      >
        <Layout>
          {!isMobile && (
            <Sider
              className={styles["left-sider-wrapper"]}
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
                    className={styles["left-sider-menu"]}
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item style={{ border: "none" }}>
                        <Link
                          //underline={item.title == CONTENT.HEADING_TAXES}
                          //strong={item.title == CONTENT.HEADING_TAXES}
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
                  />
                  <List
                    className={styles["left-sider-menu"]}
                    dataSource={settings}
                    renderItem={(item) => (
                      <List.Item style={{ border: "none" }}>
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
                  />
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
