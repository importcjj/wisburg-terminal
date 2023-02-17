import React, { useState } from "react";
import "./index.scss";
import Menu from "./menu";
import memuIcon from "./children-menu.svg";

import {
  getNavigatorCategories,
  getNavigatorSites,
} from "../../data/restful/config";

const Website = ({ url, cover, title, description }) => {
  const handleToSite = (url) => {
    // 手动添加http, 容错
    if (url.indexOf("http") !== -1) {
      window.open(url);
    } else {
      window.open("http://" + url);
    }
  };

  return (
    <div class="website-item" onClick={() => handleToSite(url)}>
      <div class="left">
        <img src={cover} />
      </div>
      <div class="right">
        <div class="website-title">{title}</div>
        <div class="website-desc">{description}</div>
      </div>
      <div class="popover_container">
        <div class="website-desc">{description}</div>
        <div class="web-url" onClick={() => handleToSite(url)}>
          {url}
        </div>
      </div>
    </div>
  );
};

const CategoryGroup = ({ title, sites, icon, subCategories }) => {
  return (
    <div>
      <div className="website-category" id={title}>
        <i className={`iconfont ${icon}`}></i>
        {title}
      </div>
      {sites && sites.length > 0 && (
        <div className="website-container">
          {sites.map((entry, index) => {
            return <Website {...entry} />;
          })}
        </div>
      )}

      {subCategories.map((entry, index) => {
        return (
          <div key={index}>
            <div class="website-sub-category" id={entry.title}>
              <img src={memuIcon} />
              {entry.title}
            </div>
            <div class="website-container">
              {entry.sites.map((entry, index) => {
                return <Website {...entry} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default () => {
  const [categories, setCategories] = useState([]);
  const [websites, setWebSites] = useState([]);

  React.useEffect(() => {
    Promise.all([getNavigatorCategories(), getNavigatorSites()]).then(
      (data) => {
        setCategories(data[0]);
        setWebSites(data[1]);
      }
    );
  }, []);

  const onSeatchTag = (title) => {
    document.querySelector("#" + title).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  return (
    <>
      <div className="container">
        <div className="container-content">
          <Menu categories={categories} onSeatchTag={onSeatchTag} />
          <div class="right-container">
            <div class="website">
              {websites.map((group, index) => (
                <CategoryGroup {...group} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
