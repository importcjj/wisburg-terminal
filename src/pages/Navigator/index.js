import React, { useState } from "react";
import "./index.scss";
import Menu from "./menu";
import memuIcon from "./children-menu.svg";
import { open } from "@tauri-apps/api/shell";

import {
  getNavigatorCategories,
  getNavigatorSites,
} from "../../data/restful/config";

const Website = ({ url, cover, title, description }) => {
  const handleToSite = (url) => {
    // 手动添加http, 容错
    if (url.indexOf("http") !== -1) {
      open(url);
    } else {
      open("http://" + url);
    }
  };

  return (
    <div className="website-item" onClick={() => handleToSite(url)}>
      <div className="left">
        <img src={cover} />
      </div>
      <div className="right">
        <div className="website-title">{title}</div>
        <div className="website-desc">{description}</div>
      </div>
      <div className="popover_container">
        <div className="website-desc">{description}</div>
        <div className="web-url" onClick={() => handleToSite(url)}>
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
            return <Website {...entry} key={index} />;
          })}
        </div>
      )}

      {subCategories.map((entry, index) => {
        return (
          <div key={index}>
            <div className="website-sub-category" id={entry.title}>
              <img src={memuIcon} />
              {entry.title}
            </div>
            <div className="website-container">
              {entry.sites.map((entry, index) => {
                return <Website {...entry} key={index} />;
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
          <div className="right-container">
            <div className="website">
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
