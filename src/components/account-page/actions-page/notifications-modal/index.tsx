import { Button, Input, InputRef, Modal, Typography } from "antd"
import { ConfirmModalProps } from "./types"
import styles from "./styles.module.scss"
import { CONTENT } from "./constants"
import cn from "classnames"
import "./styles.scss"
import Cookies from "js-cookie"
import { useEffect, useRef, useState } from "react"
import { LeadReason, api } from "../../../../api/myApi"
import { MaskedInput } from "antd-mask-input"
import { ButtonOne } from "../../../../ui-kit/button"

import { CloseOutlined } from "@ant-design/icons"
import { convertDateFormat } from "../payment-modal/utils"
import { InfoBannerLinked } from ".."
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../main-page/store"
import { fetchBanners } from "../../client/banners/thunks"
import { clearData } from "../../../authorization-page/slice"
import { useNavigate } from "react-router-dom"
import { ApiError } from "../../taxes-page/utils"
import { useAuth } from "../../../../AuthContext"
import Link from "antd/es/typography/Link"
import { LINK_MAP } from "../constants"
import { BellBannerIcon } from "../../taxes-page/type-operation/icons/bell-banner"
import { clearTasks } from "../../client/tasks/slice"
import { clearSources } from "../../client/sources/slice"

export const NotificationsModal = ({ isOpen, setOpen }: ConfirmModalProps) => {
  const { Title, Text } = Typography
  const token = Cookies.get("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const closeModal = () => {
    setOpen(false)
  }

  const [banners, setBanners] = useState<InfoBannerLinked[] | null | undefined>(
    null
  )

  const dispatch = useDispatch<AppDispatch>()

  const fetchedBanners = useSelector(
    (state: RootState) => state.banners.banners?.banners
  )

  const navigate = useNavigate()
  const { logout } = useAuth()

  const clearAll = () => {
    dispatch(clearData())
    dispatch(clearTasks())
    dispatch(clearSources())
  }

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const linkedBanners = fetchedBanners?.map((item) => {
          const regex = /(\{link:[^\}]+\})/g
          const parts = item.description.split(regex)
          return { ...item, description: parts }
        })

        setBanners(linkedBanners)
      } catch (error) {
        console.log("Ошибка даты")
      }
    }
    fetchSources()
  }, [fetchedBanners])

  const deleteBanner = async (id: string) => {
    try {
      await api.banners.updateUserBannerStateBannersPut(
        { banner_id: id },
        { headers }
      )
      const bannersResponse = await api.banners.getUserBannersBannersGet(
        {
          current_date: convertDateFormat(new Date().toLocaleDateString()),
        },
        {
          headers,
        }
      )
      const linkedBanners = bannersResponse.data.banners.map((item) => {
        const regex = /(\{link:[^\}]+\})/g
        const parts = item.description.split(regex)
        return { ...item, description: parts }
      })

      setBanners(linkedBanners)
      dispatch(fetchBanners())
    } catch (error) {
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
    }
  }

  const deleteAllBanners = async () => {
    try {
      banners?.map(async (item) => {
        await api.banners.updateUserBannerStateBannersPut(
          { banner_id: item.id },
          { headers }
        )
      })

      const bannersResponse = await api.banners.getUserBannersBannersGet(
        {
          current_date: convertDateFormat(new Date().toLocaleDateString()),
        },
        {
          headers,
        }
      )
      const linkedBanners = bannersResponse.data.banners.map((item) => {
        const regex = /(\{link:[^\}]+\})/g
        const parts = item.description.split(regex)
        return { ...item, description: parts }
      })

      setBanners(linkedBanners)
      dispatch(fetchBanners())
    } catch (error) {
      if ((error as ApiError).status === 422) {
        logout(), clearAll(), navigate("/login")
      }
    }
  }

  return (
    <Modal
      open={isOpen}
      style={{
        borderRadius: "0",
      }}
      onOk={closeModal}
      onCancel={closeModal}
      footer={null}
      className={cn(styles["ant-modal"], "modal-analysis")}
    >
      <div className={styles["modal-style"]}>
        <div className={styles["modal-inner"]}>
          <div className={styles["payment-wrapper"]}>
            <div className={styles["heading-row"]}>
              <Text className={styles["modal-title"]}>
                {CONTENT.HEADING_MODAL}
              </Text>
            </div>

            <div className={styles["sider-inner-wrapper"]}>
              {banners?.map((item) => {
                return (
                  <div className={styles["update-wrapper"]}>
                    <div className={styles["update-inner"]}>
                      <div className={styles["update-text-inner"]}>
                        <BellBannerIcon />
                        <Text
                          style={{
                            maxWidth: "200px",
                          }}
                          className={styles["banner-title"]}
                        >
                          {item.title}
                        </Text>
                        {item.description.map((text) => {
                          if (text.startsWith("{") && text.endsWith("}")) {
                            const link = text.slice("{link:".length, -1)
                            return (
                              <Link
                                className={styles["update-text-link"]}
                                onClick={() => navigate(link)}
                              >
                                {LINK_MAP[link]}
                              </Link>
                            )
                          } else
                            return (
                              <Text className={styles["update-text"]}>
                                {text}
                              </Text>
                            )
                        })}
                      </div>
                      <Button
                        className={styles["delete-banner"]}
                        style={{ border: "none", boxShadow: "none" }}
                        onClick={() => deleteBanner(item.id)}
                      >
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles["footer-button"]}>
            <ButtonOne
              onClick={() => {
                closeModal()
                deleteAllBanners()
              }}
              type="secondary"
            >
              {CONTENT.BUTTON_SEND}
            </ButtonOne>
          </div>
        </div>
      </div>
    </Modal>
  )
}
