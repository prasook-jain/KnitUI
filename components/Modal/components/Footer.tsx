import React from 'react'
import styled from "styled-components"

const Footer = ({ children, padding }) => {
  const { vertical, horizontal } = padding
  const StyledDiv = styled.div`
    padding: ${`${vertical} ${horizontal}`};
  `
  return (
    <StyledDiv>
      {children}
    </StyledDiv>
  )
}

export default Footer
