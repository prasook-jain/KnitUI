import styled from "styled-components"
import { IStyled } from "../../../common/types"

interface FooterProps {
  showBorder: boolean
}

const Footer = styled.div<IStyled<FooterProps>>`
  padding: ${({ theme: { knitui } }) =>
    `${knitui.modalPadding.vertical}rem ${knitui.modalPadding.horizontal}`}rem;
  justify-self: flex-end;
  border-top: ${({ customProps: { showBorder }, theme: { knitui } }) =>
    showBorder ? knitui.modalBorder : `none`};
`

export default Footer
