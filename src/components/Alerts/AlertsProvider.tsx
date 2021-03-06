import React from "react"
import { v4 as uuid } from "uuid"
import AlertContext from "./AlertContext"
import TransitionWrapper from "./TransitionWrapper"
import {
  TopLeftBox,
  TopRightBox,
  BottomLeftBox,
  BottomRightBox,
} from "./StyledAlerts"
import { AlertProps, placementType, AlertContextInterface } from "./types"

const PlacementWrapperDiv = {
  topLeft: TopLeftBox,
  topRight: TopRightBox,
  bottomLeft: BottomLeftBox,
  bottomRight: BottomRightBox,
}

export interface AlertsProviderState {
  alerts: AlertProps[]
  contextAPI: AlertContextInterface
}

class AlertsProvider extends React.Component<{}, AlertsProviderState> {
  queue: AlertProps[] = []
  interval: number | undefined
  constructor(props) {
    super(props)

    this.state = {
      alerts: [],
      contextAPI: {
        addAlert: this.handleAdd,
        removeAlert: this.handleRemove,
      },
    }
  }

  handleAdd = (alertProps: AlertProps): string => {
    const key: string = uuid()

    alertProps.placement =
      alertProps.placement || ("bottomLeft" as placementType)
    alertProps.key = key

    // Closing Alert will call remove method of this class to update state
    const curOnClose = alertProps.onClose
    alertProps.onClose = event => {
      curOnClose && curOnClose(event)
      this.handleRemove(key)
    }
    this.queue.push(alertProps)
    this.displayAlert()
    return key
  }

  handleRemove = (key: string): boolean => {
    const index = this.state.alerts.findIndex(i => i.key === key)
    if (index > -1) {
      this.setState({
        alerts: [
          ...this.state.alerts.slice(0, index),
          ...this.state.alerts.slice(index + 1),
        ],
      })
      return true
    }
    return false
  }

  displayAlert() {
    this.interval = this.interval
      ? this.interval
      : setInterval(() => {
          if (this.queue.length > 0) {
            this.setState(prevState => ({
              alerts: [...prevState.alerts, this.queue.shift()!],
            }))
          } else {
            clearInterval(this.interval)
            this.interval = undefined
          }
        }, 350)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    // alertsByPlace placement keys needs to be predefined, can not use each
    // alerts placement prop directly, because for transition of last element,
    // Wrapper Component is needed.
    const alertsByPlace = {
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
    }

    this.state.alerts.forEach((alert: AlertProps) => {
      const placement = alert.placement as string
      alertsByPlace[placement] = [alert, ...alertsByPlace[placement]]
    })

    return (
      <AlertContext.Provider value={this.state.contextAPI}>
        {this.props.children}
        <div key="knit-ui-alerts" className="knit-ui-alerts">
          {Object.entries(alertsByPlace).map(([placement, alertArr]) => {
            const Wrapper = PlacementWrapperDiv[placement]
            return (
              <Wrapper key={placement} data-testid="alerts-wrapper">
                <TransitionWrapper alerts={alertArr!} />
              </Wrapper>
            )
          })}
        </div>
      </AlertContext.Provider>
    )
  }
}

export default AlertsProvider
