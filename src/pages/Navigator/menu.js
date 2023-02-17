import classnames from "classnames";
import React from "react";
import "./menu.scss";

export default ({ categories, onSeatchTag }) => {
  const [activeTitle, setActiveTtitle] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const getList = (index, item) => {
    if (item.title !== activeTitle) {
      searchTag(item.title);
    }
    setTag(index, item);
  };
  const setTag = (index, item) => {
    setActiveTtitle(item.title);
    setActiveIndex(index);
  };
  const searchTag = (title) => {
    setActiveTtitle(title);
    onSeatchTag(title);
  };

  return (
    <div className="website_category_container" id="website_category_container">
      <div className="website_category_title">网址导航</div>
      {categories && (
        <div className="website_category_content">
          {categories.map((item, index) => {
            return (
              <div className="website_category_content_item" key={index}>
                <span
                  className={classnames({
                    item_title: true,
                    active: item.title == activeTitle,
                  })}
                  onClick={() => getList(index, item)}
                >
                  <span>
                    <i className={`iconfont ${item.icon}`}></i>
                    {item.title}
                  </span>
                  {item.subCategories && item.subCategories.length > 0 && (
                    <i
                      className={index == activeIndex && "active"}
                      onClick={() => setTag(index, item)}
                    ></i>
                  )}
                </span>
                <ul className={index == activeIndex && "active"}>
                  {item.subCategories.map((entry, index) => {
                    return (
                      <li
                        className={activeTitle == entry.title && "active"}
                        key={index}
                        onClick={() => searchTag(entry.title)}
                      >
                        {entry.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
