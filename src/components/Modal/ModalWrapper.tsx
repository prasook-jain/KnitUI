import React, { useState, useContext, ReactNode } from "react"
import styled from "styled-components"
import Dialog from "rc-dialog"
import "rc-dialog/assets/index.css"
import { ModalWrapperProps, IStyledDialog, TitleProps } from "./types"
import { ThemeContext } from "styled-components"
import { Header, Footer, Main } from "./components"
import {
  Modal,
  LeftPanelModal,
  RightPanelModal,
  BottomPanelModal,
} from "./variants/index"
import Icon from "../Icon"
import "rc-dialog/assets/index.css"

const sizeToWidth = {
  small: "49rem",
  medium: "63rem",
  large: "91rem",
  "x-large": "105rem",
}

// Animation related
const appearDuration = 250
const transitionName = `modal`
const maskTransitionName = `modalMask`
const maskDuration = 100
const modalEnterTransitionPath = `cubic-bezier(0, 0, 0, 1)`
const modalLeaveTransitionPath = `cubic-bezier(1, 0, 1, 1)`
const animationDelay = `50ms`

// Animations on leave are not working for rc-dialog, this happens only when
// styiling the Dialog using styled components. It is probably the case that
// the Dialog component is being re-created on close, causing the previous
// stored ref to be lost
const StyledDialog = styled(Dialog)<IStyledDialog>`
  .rc-dialog-body {
    padding: 0;
    height: auto;
    max-height: ${({ theme: { knitui } }) =>
      `calc(100vh - ${knitui.modalMaxContentHeightOffset}rem)`};
    min-height: ${({ theme: { knitui } }) => `${knitui.modalMinHeight}rem`};
  }
  .rc-dialog-content {
    border-radius: ${({ theme: { knitui } }) => knitui.modalBorderRadius};
  }
  width: ${({ customProps: { size } }) => sizeToWidth[size!]} !important;
  .rc-dialog-close {
    right: -1rem;
    top: -1rem;
    opacity: unset;
    padding: 0.15rem;
    line-height: 0;
    background-color: ${({ theme: { knitui } }) =>
      knitui.chromaPalette.Neutral50};
    border-radius: 999px;
    svg {
        fill: ${({ theme: { knitui } }) => knitui.chromaPalette.Neutral20};
      }
    }
  }
  &.${transitionName}-appear,
  &.${transitionName}-enter {
    opacity: 0;
    transform: scale(0.9);
  }

  &.${transitionName}-appear.${transitionName}-appear-active,
  &.${transitionName}-enter.${transitionName}-enter-active {
    opacity: 1;
    transform: scale(1.0);
    transition: opacity ${appearDuration}ms ${modalEnterTransitionPath} ${animationDelay}, transform ${appearDuration}ms ${modalEnterTransitionPath} ${animationDelay};
  }

  &.${transitionName}-leave {
    opacity: 1;
    transform: scale(1);
  }

  &.${transitionName}-leave.${transitionName}-leave-active {
    opacity: 0;
    transform: scale(0.9);
    transition: opacity ${appearDuration}ms ${modalLeaveTransitionPath}, transform ${appearDuration}ms ${modalLeaveTransitionPath};
  }

  &.${maskTransitionName}-appear,
  &.${maskTransitionName}-enter {
    opacity: 0;
  }

  &.${maskTransitionName}-appear.${maskTransitionName}-appear-active,
  &.${maskTransitionName}-enter.${maskTransitionName}-enter-active {
    opacity: 1;
    transition: opacity ${maskDuration}ms ease-out;
  }

  &.${maskTransitionName}-leave {
    opacity: 1;
  }

  &.${maskTransitionName}-leave.${maskTransitionName}-leave-active {
    opacity: 0;
    transition: opacity ${maskDuration}ms ease-out;
  }
`

/**
 * The external interface for the modal
 */
const ModalWrapper: React.FC<ModalWrapperProps> = ({
  size,
  header,
  body,
  footer,
  getContainer,
  visible,
  onClose,
  panel,
  destroyOnClose,
  className,
  style,
  padding,
}) => {
  /**
   * Renders the appopriate variant based on the availability of a
   * panel prop and its position.
   * @param modalProps
   */
  const ModalProxy = (modalProps: {
    maxContentHeight: string
    minContentHeight: string
    header: ReactNode
    footer: ReactNode
    body: ReactNode
  }) => {
    if (!panel) {
      return <Modal {...modalProps} />
    }
    switch (panel.position) {
      case "left":
        return <LeftPanelModal {...modalProps} panelContent={panel.content} />
      case "right":
        return <RightPanelModal {...modalProps} panelContent={panel.content} />
      case "bottom":
        return <BottomPanelModal {...modalProps} panelContent={panel.content} />
      default:
        return <Modal {...modalProps} />
    }
  }

  const [showFooterBorder, setShowFooterBorder] = useState(false)
  const setBodyRef = (el: HTMLElement | null) => {
    if (el && el.scrollHeight > el.clientHeight) {
      setShowFooterBorder(true)
    }
  }

  const themeContext = useContext(ThemeContext)
  const { knitui } = themeContext
  const typographySize =
    (header.leftSection as TitleProps).fontSize ||
    knitui.modalTitleTypographySize
  const lineHeight = knitui.typography[typographySize].lineHeight
  const verticalPadding = knitui.modalHeaderPadding.vertical
  const headerHeight = lineHeight + 2 * verticalPadding
  const totalOffset = knitui.modalMaxContentHeightOffset + headerHeight
  const maxContentHeight = `calc(100vh - ${totalOffset}rem)`
  const minContentHeight = `${knitui.modalMinHeight - headerHeight}rem`

  return (
    <StyledDialog
      customProps={{
        size,
      }}
      getContainer={getContainer}
      visible={visible}
      onClose={onClose}
      closeIcon={<Icon type="oClear" />}
      destroyOnClose={destroyOnClose}
      transitionName={transitionName}
      maskTransitionName={maskTransitionName}
      className={className}
      style={style}>
      <ModalProxy
        maxContentHeight={maxContentHeight}
        minContentHeight={minContentHeight}
        header={<Header {...header} />}
        body={
          <Main customProps={{ padding }} ref={setBodyRef}>
            {body}
          </Main>
        }
        footer={
          <Footer customProps={{ showBorder: showFooterBorder }}>
            {footer}
          </Footer>
        }
      />
    </StyledDialog>
  )
}

ModalWrapper.defaultProps = {
  size: "medium",
  padding: {
    vertical: "2.8rem",
    horizontal: "2.1rem",
  },
  visible: false,
  destroyOnClose: false,
}

export default ModalWrapper
