import {
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  List,
  Menu,
  Skeleton,
  Tooltip,
  Typography,
} from "antd"
import { Link, useLocation } from "react-router-dom"
import { CONTENT, TAX_SYSTEM } from "./constants"
import styles from "./styles.module.scss"
import { Outlet, useNavigate } from "react-router-dom"
import { LogoIcon } from "../main-page/logo-icon"
import { AccountPageProps } from "./types"
import { useCallback, useEffect, useState } from "react"
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
import { DownOutlined } from "@ant-design/icons"
import { ButtonOne } from "../../ui-kit/button"
import { CopyIcon } from "./taxes-page/type-operation/icons/copy"
import { QuitModal } from "./settings-page/quit-modal"
import { debug } from "console"
import { clearTasks } from "./client/tasks/slice"
import { clearSources } from "./client/sources/slice"
import { abbreviateFullName } from "./utils"
import { NewPasswordModal } from "./new-password-modal"
import { JwtPayload, jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
export const AccountPage = ({
  token_type,
  accessToken,
  logOut,
}: AccountPageProps) => {
  const { Sider } = Layout

  const { loaded, loading } = useSelector((state: RootState) => state.user)
  const location = useLocation()

  const tasks = useSelector((state: RootState) => state.tasks.tasks?.tasks)

  const getTaskSum = useCallback(() => {
    const currentDate = new Date()
    const tenDaysLater = new Date()
    tenDaysLater.setDate(currentDate.getDate() + 10)

    const overdueTasks = tasks?.filter(
      (task) => new Date(task.due_date) < currentDate
    )
    const soonDueTasks = tasks?.filter((task) => {
      const dueDate = new Date(task.due_date)
      return dueDate >= currentDate && dueDate <= tenDaysLater
    })

    const sum =
      soonDueTasks && overdueTasks && overdueTasks.length + soonDueTasks.length

    return sum
  }, [tasks])

  const data = [
    {
      title: CONTENT.SIDER_HEADING_EVENTS,
      to: "/main",
      icon: <MenuActionsIcon className={styles["actions-icon"]} />,
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
  const [tasksCount, setTasksCount] = useState<number | undefined>(0)

  const dispatch = useDispatch<AppDispatch>()

  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  const navigate = useNavigate()

  const isMobile = useMediaQuery("(max-width: 1279px)")
  const isTablet = useMediaQuery("(max-width: 1023px)")

  const { data: currentUser } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!loaded && loading !== "" && loading !== "loading") {
      dispatch(fetchCurrentUser())
    }
    setTasksCount(getTaskSum())
  }, [dispatch, getTaskSum, loaded, loading])

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
          {tasksCount && tasksCount > 0 ? (
            <div className={styles["tasks-inner"]}>
              <div
                className={cn({
                  [styles["tasks-count"]]: location.pathname === "/main",
                  [styles["tasks-count-not"]]: location.pathname !== "/main",
                })}
              >
                {getTaskSum()}
              </div>
            </div>
          ) : null}
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

  useEffect(() => {
    if (!loaded && loading !== "") {
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
    }
  }, [loaded, loading])

  const [isQuitOpen, setIsQuitOpen] = useState(false)
  const token = Cookies.get("token")
  interface CustomJwtPayload extends JwtPayload {
    need_to_change_password?: boolean
  }
  const jwtDecoded = token && jwtDecode<CustomJwtPayload>(token)

  const initialOpen =
    jwtDecoded && jwtDecoded.need_to_change_password === true ? true : false

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
        <Layout className={styles["style-overflow"]}>
          {!isMobile && (
            <Sider
              className={styles["left-sider-wrapper"]}
              width={250}
              style={{
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
                      navigate("/main")
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
                          {item.to === "/main" &&
                          tasksCount &&
                          tasksCount > 0 ? (
                            <div className={styles["tasks-inner"]}>
                              <div
                                className={cn({
                                  [styles["tasks-count"]]:
                                    location.pathname === item.to,
                                  [styles["tasks-count-not"]]:
                                    location.pathname !== item.to,
                                })}
                              >
                                {getTaskSum()}
                              </div>
                            </div>
                          ) : null}
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
          {!isTablet && location.pathname !== "/settings" ? (
            currentUser.inn ? (
              <div className={styles["info-drop"]}>
                <Dropdown
                  trigger={["click"]}
                  overlayStyle={{ width: "408px" }}
                  dropdownRender={() => (
                    <div className={styles["dropdown-main"]}>
                      <Text className={styles["menu-title"]}>Профиль</Text>
                      <div className={styles["menu-info-wrapper"]}>
                        <div className={styles["menu-row"]}>
                          <Text className={styles["menu-fio"]}>
                            {currentUser.inn?.length === 12
                              ? "ИП " +
                                currentUser.lastname +
                                " " +
                                currentUser.firstname?.charAt(0) +
                                ". " +
                                currentUser.patronymic?.charAt(0) +
                                "."
                              : currentUser.full_name}
                          </Text>
                          <Text className={styles["menu-name"]}>
                            {currentUser.tax_system &&
                              TAX_SYSTEM[currentUser.tax_system]}

                            {" " + currentUser.tax_rate + "%"}
                          </Text>
                        </div>
                        <div className={styles["menu-row"]}>
                          <Text className={styles["menu-name"]}>
                            ИНН
                            <Text className={styles["menu-inn"]}>
                              {" "}
                              {currentUser.inn}{" "}
                            </Text>
                            <Button
                              className={styles["button-icon"]}
                              onClick={() =>
                                currentUser.inn &&
                                navigator.clipboard.writeText(currentUser.inn)
                              }
                            >
                              {" "}
                              <CopyIcon />
                            </Button>
                          </Text>
                        </div>
                      </div>
                      <ButtonOne
                        type="secondary"
                        className={styles["button-menu"]}
                        onClick={() => {
                          setIsQuitOpen(true)
                        }}
                      >
                        {"Выйти"}
                      </ButtonOne>
                    </div>
                  )}
                >
                  <Button
                    type="link"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      paddingLeft: 0,
                      paddingRight: 0,
                      maxWidth: "280px",
                      height: "auto",
                    }}
                  >
                    <div className={styles["menu-inner-wrapper"]}>
                      <div className={styles["menu-inner"]}>
                        <Text className={styles["text-menu"]}>
                          {currentUser.inn?.length === 12 ? (
                            <>
                              ИП {currentUser.lastname}{" "}
                              <Text className={styles["text-menu-no-break"]}>
                                {currentUser.firstname?.charAt(0)}.{" "}
                                {currentUser.patronymic?.charAt(0)}.
                              </Text>
                            </>
                          ) : (
                            <Tooltip title={currentUser.full_name}>
                              {abbreviateFullName(currentUser.full_name)}
                            </Tooltip>
                          )}
                        </Text>
                        {!isMobile && (
                          <div className={styles["divider-menu"]}></div>
                        )}
                        <Text className={styles["text-menu-percent"]}>
                          {"УСН " + currentUser.tax_rate + "%"}
                        </Text>
                      </div>
                      <DownOutlined />
                    </div>
                  </Button>
                </Dropdown>
              </div>
            ) : (
              <Skeleton.Input active />
            )
          ) : null}
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
      <QuitModal isOpen={isQuitOpen} setOpen={setIsQuitOpen} />
      {initialOpen && <NewPasswordModal />}
    </>
  )
}
