import { ConfigProvider, Layout } from "antd"
import { CONTENT } from "./constants"

export const AccountPage = () => {
  const { Header, Sider, Content, Footer } = Layout

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorLink: "#505050",
            colorPrimary: "#6159ff",
          },
        }}
      >
        <Layout>
          <Header>{"АК"}</Header>
          <Layout>
            <Content>{CONTENT.HEADING_TAXES}</Content>
            <Sider></Sider>
          </Layout>
          <Footer>{"АК"}</Footer>
        </Layout>
      </ConfigProvider>
    </>
  )
}
