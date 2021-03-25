import React, { Component, createRef } from "react";
import Gantt from "frappe-gantt";
import Task from "../lib/Task.js";

export default class FrappeGantt extends Component {
  constructor(props) {
    super(props);
    this._target = createRef();
    this._svg = createRef();
    this._gantt = null;

    this.state = {
      viewMode: null,
      tasks: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      viewMode: nextProps.viewMode,
      tasks: nextProps.tasks.map((t) => new Task(t)),
    };
  }

  componentDidUpdate() {
    if (this._gantt) {
      this._gantt.refresh(this.state.tasks);
      this._gantt.change_view_mode(this.state.viewMode);
    }
  }

  componentDidMount() {
    this._gantt = new Gantt(this._svg.current, this.state.tasks, {
      on_click: this.props.onClick,
      on_view_change: this.props.onViewChange,
      custom_popup_html: this.props.customPopUpHtml,
      on_progress_change: (task, progress) => {
        this.props.onProgressChange(task, progress);
        this.props.onTasksChange(this.props.tasks);
      },
      on_date_change: (task, start, end) => {
        this.props.onDateChange(task, start, end);
        this.props.onTasksChange(this.props.tasks);
      },
    });

    if (this._gantt) {
      this._gantt.change_view_mode(this.state.viewMode);
    }

    const midOfSvg = this._svg.current.clientWidth * 0.5;
    this._target.current.scrollLeft = midOfSvg;
  }

  render() {
    return (
      <div ref={this._target}>
        <svg
          ref={this._svg}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        />
      </div>
    );
  }
}
