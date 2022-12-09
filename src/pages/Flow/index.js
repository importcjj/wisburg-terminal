import {
  CalendarOutlined,
  FilePdfOutlined,
  FilterOutlined,
  SearchOutlined,
  ShareAltOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Button,
  Input,
  Space,
  Table,
  DatePicker,
  Pagination,
  Affix,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import TimeAgo from "timeago-react";
import { CONTENTS_QUERY } from "../../data/query/content";
import dayjs from "dayjs";
import { downloadFile } from "../../utils/fs";

import "./index.css";

const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "近一周",
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: "近两周",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "近一月",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "近三个月",
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];

export default () => {
  const [data, setData] = useState([]);
  const [titleInput, setTitleInput] = useState();
  const [startTime, setStartTime] = useState("");
  const [kinds, setKinds] = useState([]);
  const [endTime, setEndTime] = useState("");
  const searchInput = useRef(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100],
    total: 0,
  });

  const { loading, refetch } = useQuery(CONTENTS_QUERY, {
    variables: {
      first: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      track: titleInput,
      startTime: startTime || null,
      endTime: endTime || null,
      kinds,
    },
    onCompleted: (data) => {
      const {
        items,
        total_count,
        page_info: { end_cursor, has_next_page },
      } = data.contents;
      setData([...items]);
      setPagination({
        ...pagination,
        total: total_count,
      });
    },
    onError: (error) => {},
  });

  const handlePaginationChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (dataIndex === 0) {
      setTitleInput(selectedKeys[0]);
    } else if (dataIndex === 2) {
      setStartTime(selectedKeys[0]);
      setEndTime(selectedKeys[1]);
    }
  };

  const handleReset = (clearFilters, confirm, setSelectedKeys, dataIndex) => {
    setSelectedKeys([]);
    confirm();
    clearFilters();
    if (dataIndex === 0) {
      setTitleInput("");
    } else if (dataIndex === 2) {
      setStartTime("");
      setEndTime("");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setKinds(filters?.kind[0]);
  };

  const columns = [
    {
      dataIndex: "title",
      ellipsis: true,
      width: "60%",
      className: "flow-cell-title",
      render: (title, record) => {
        if (record.detail?.source_url) {
          return (
            <a target="_blank" href={record.detail?.source_url}>
              {title}
            </a>
          );
        }
        if (record.kind === 9 && record.detail?.url) {
          const onSave = () => {
            const name = record.detail?.title || "default";
            const ext = record.detail?.extension;
            downloadFile(record.detail?.url, name + ext);
          };

          return <a onClick={onSave}>{title}</a>;
        }

        let kind = "articles";
        switch (record.kind) {
          case 3:
            kind = "videos";
            break;

          default:
            break;
        }

        return (
          <a
            target="_blank"
            href={`https://wisburg.com/${kind}/${record.raw_id}`}
          >
            {title}
          </a>
        );
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="标题关键词搜索"
              ref={searchInput}
              style={{ marginBottom: 8 }}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys, confirm, 0)}
            />
            <Space>
              <Button
                size="small"
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, 0)}
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
              <Button
                size="small"
                onClick={() =>
                  clearFilters &&
                  handleReset(clearFilters, confirm, setSelectedKeys, 0)
                }
              >
                重置
              </Button>
            </Space>
          </div>
        );
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      filterIcon: (
        <Space>
          <SearchOutlined /> 搜索
        </Space>
      ),
    },
    {
      dataIndex: "kind",
      className: "flow-cell-category",
      align: "center",
      filterIcon: (
        <Space>
          <FilterOutlined /> 类型
        </Space>
      ),
      width: 80,
      filters: [
        { text: "链接", value: [1, 2] },
        { text: "报告", value: [9] },
        { text: "视频", value: [3] },
      ],

      render: (_, item) => {
        console.log(item);
        switch (item.kind) {
          case 1:
          case 2:
            return <ShareAltOutlined />;
          case 3:
            return <VideoCameraOutlined />;
          case 9:
            return <FilePdfOutlined />;

          default:
            break;
        }
        return <a>{item.kind}</a>;
      },
    },
    {
      dataIndex: "datetime",
      className: "flow-cell-datetime",
      align: "center",
      width: 180,
      filterIcon: (
        <Space>
          <CalendarOutlined /> 日期
        </Space>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        return (
          <div style={{ padding: 8 }}>
            <div>
              <RangePicker
                style={{ marginBottom: 8 }}
                presets={rangePresets}
                value={selectedKeys}
                onChange={(dates) => setSelectedKeys(dates ? dates : [])}
              />
            </div>
            <Space>
              <Button
                size="small"
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, 2)}
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
              <Button
                size="small"
                onClick={() =>
                  clearFilters &&
                  handleReset(clearFilters, confirm, setSelectedKeys, 2)
                }
              >
                重置
              </Button>
            </Space>
          </div>
        );
      },
      render: (dt) => (
        <TimeAgo className="datetime" datetime={dt} locale="zh_CN" />
      ),
    },
  ];

  return (
    <div>
      <Table
        style={{ padding: 5 }}
        columns={columns}
        dataSource={data}
        bordered
        rowKey={(record) => record.raw_id}
        loading={loading}
        size="small"
        sticky
        pagination={false}
        onChange={handleTableChange}
      />

      <div className="flow-tool-bar">
        <Pagination {...pagination} onChange={handlePaginationChange} />
      </div>
    </div>
  );
};
