import React from "react";
import { Article } from "article";
import { Link } from "react-router-dom";

type Props = {
  article: Article;
  open: (id: string) => void;
};

export default class Item extends React.Component<Props> {
  render() {
    const { article } = this.props;
    return (
      <tr>
        <td>
          <img
            src={
              article.cover.type === 0
                ? require("@image/placeholder.png")
                : article.cover.images[0]
            }
            width="200"
            alt=""
          />
        </td>
        <td>{article.title}</td>
        <td>
          {article.status === 0 && <span className="tag is-info">草稿</span>}
          {article.status === 1 && <span className="tag is-link">待审核</span>}
          {article.status === 2 && (
            <span className="tag is-success">审核通过</span>
          )}
          {article.status === 3 && (
            <span className="tag is-danger">审核失败</span>
          )}
        </td>
        <td>{article.pubdate}</td>
        <td>{article.read_count}</td>
        <td>{article.comment_count}</td>
        <td>{article.like_count}</td>
        <td>
          <Link
            to={`/admin/publish/${article.id}`}
            className="button is-success is-rounded is-small mr-2"
          >
            <i className="fas fa-edit"></i>
          </Link>
          <button
            onClick={() => this.props.open(article.id)}
            className="button is-danger is-rounded is-small"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    );
  }
}
