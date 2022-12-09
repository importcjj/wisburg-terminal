import React from "react";
import moment from "moment";
import "./index.css";
import { WebviewWindow } from "@tauri-apps/api/window";
import { List, Image, Typography } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { downloadFile } from "../../utils/fs";
import TimeAgo from "timeago-react";

const { Paragraph, Title } = Typography;

const Content = ({ data }) => {
  const category = React.useMemo(() => {
    if (data.detail?.extension === ".pdf") {
      return <FilePdfOutlined />;
    }
  }, [data]);

  const images = React.useMemo(() => {
    return data.detail?.attachments?.filter(
      (item) =>
        item.file_extension.endsWith("png") ||
        item.file_extension.endsWith("jpeg") ||
        item.file_extension.endsWith("jpg")
    );
  }, [data]);

  const actions = React.useMemo(() => {
    const actions = [
      <TimeAgo className="datetime" datetime={data.datetime} locale="zh_CN" />,
    ];
    if (data.detail?.source_url) {
      actions.push(
        <a target="_blank" href={data.detail?.source_url}>
          查看原文
        </a>
      );
    }

    if (data.detail?.url) {
      const onSave = () => {
        const name = data.detail?.title || "default";
        const ext = data.detail?.extension;
        downloadFile(data.detail?.url, name + ext);
      };

      actions.push(<a onClick={onSave}>下载</a>);
    }

    return actions;
  }, [data]);

  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        title={<>{data.title}</>}
        description={
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
            {data.description}
          </Paragraph>
        }
      />
      {images && (
        <Image.PreviewGroup>
          {images.map((image, index) => (
            <Image key={index} width={200} height={150} src={image.file_url} />
          ))}
        </Image.PreviewGroup>
      )}
    </List.Item>
  );
};

const ContentsList = ({ items = [], hide }) => {
  if (hide) return <></>;

  return (
    <List
      size="small"
      itemLayout="vertical"
      dataSource={items}
      rowKey="raw_id"
      renderItem={(item, i) => {
        return <Content key={i} data={item} />;
      }}
    />
  );
};

export default ContentsList;
