import React from "react";
import styles from "./index.module.css";
import classNames from "classnames";
import { articlesRequestParams } from "article";

interface Props {
  // 当前页
  page: number;
  // 总数据条数
  total_count: number;
  // 每页显示的数据条数
  per_page: number;
  // 页面中能够同时显示的页面数量
  maxPageNum: number;
  // 更新分页状态
  updateReqParams: (reqParams: articlesRequestParams) => void;
}

export default class Pagination extends React.Component<Props> {
  // 构造函数
  constructor(props: Props) {
    super(props);
    // 使以下方法中的 this 关键字指向当前类的实例对象
    this.buildPage = this.buildPage.bind(this);
  }
  // 构建分页
  buildPage() {
    // 获取分页信息
    const { page, per_page, total_count, maxPageNum, updateReqParams } =
      this.props;
    // 计算页码偏移量
    const pageOffset = Math.ceil(maxPageNum / 2);
    // 计算显示着的开始页面
    let start = page - pageOffset;
    // 计算显示着的结束页码
    let end = start + maxPageNum - 1;
    // 计算总页数
    const totalPage = Math.ceil(total_count / per_page);
    // 显示着的开始页面范围限制
    if (start < 1) {
      // 终止开始页码
      start = 1;
      // 根据重置的显示着的开始页码重置显示着的结束页码
      let tmp = start + maxPageNum - 1;
      // 限制显示着的结束页码并为 end 赋值
      end = tmp > totalPage ? totalPage : tmp;
    }
    // 显示着的结束页码范围限制
    if (end > totalPage) {
      // 重置显示着的结束页码
      end = totalPage;
      // 根据重置的显示着的结束页码重置显示着的开始页码
      let tmp = end - maxPageNum + 1;
      // 限制显示着的开始页码并为 start 赋值
      start = tmp < 1 ? 1 : tmp;
    }
    // 用于存储页码数组
    let pageArray = [];
    // 生成页码
    for (let i = start; i <= end; i++) {
      pageArray.push(i);
    }
    return (
      <nav className="pagination">
        <ul className="pagination-list">
          <li>
            <button
              onClick={() => updateReqParams({ page: page - 1 })}
              className="pagination-link"
            >
              上一页
            </button>
          </li>
          {pageArray.map((item) => (
            <li key={item}>
              <button
                onClick={() => updateReqParams({ page: item })}
                className={classNames("pagination-link", {
                  "is-current": item === page,
                })}
              >
                {item}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => updateReqParams({ page: page + 1 })}
              className="pagination-link"
            >
              下一页
            </button>
          </li>
          <li>
            <div className="select">
              <select
                value={per_page}
                onChange={(event) =>
                  updateReqParams({ per_page: Number(event.target.value) })
                }
              >
                <option value={10}>10条/页</option>
                <option value={15}>15条/页</option>
                <option value={20}>20条/页</option>
              </select>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
  // 渲染视图
  render() {
    return <div className={styles.pagination}>{this.buildPage()}</div>;
  }
}
