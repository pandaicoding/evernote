import React from "react"
import styled from "@emotion/styled"

const LayoutStyle = styled.div`
  width: 100vw;
  height: 100vh;
`

export default function Layout({ children }: any) {
  return (
    <LayoutStyle>
      {children}
    </LayoutStyle>
  )
}

