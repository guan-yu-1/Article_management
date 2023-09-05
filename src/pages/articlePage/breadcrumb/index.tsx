import React from "react";
import { Link } from "react-router-dom";

export default class Breadcrumb extends React.Component {
  render() {
    return (
      <nav className="breadcrumb p-4 mb-0">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/admin/article">内容管理</Link>
          </li>
        </ul>
      </nav>
    );
  }
}
