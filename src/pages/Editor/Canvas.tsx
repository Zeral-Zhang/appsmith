import React, { Component } from "react"
import { connect } from "react-redux"
import { AppState } from "../../reducers"
import WidgetFactory from "../../utils/WidgetFactory"
import { CanvasReduxState } from "../../reducers/uiReducers/canvasReducer"

class Canvas extends Component<{ canvas: CanvasReduxState }> {
  render() {
    const canvasWidgetData = this.props.canvas.canvasWidgetProps
    if (canvasWidgetData) {
      const canvasWidget = WidgetFactory.createWidget(canvasWidgetData)
      return canvasWidget.getWidgetView()
    } else return undefined
  }
}

const mapStateToProps = (state: AppState, props: any) => {
  return {
    canvas: state.ui.canvas
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas)
