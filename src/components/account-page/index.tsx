import {
  Button,
  ConfigProvider,
  Layout,
  List,
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
        </Layout>
      </ConfigProvider>
    </>
  )
}
