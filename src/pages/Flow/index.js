import { CalendarOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Input, Space, Table, DatePicker, Pagination, Affix } from "antd";
import React, { useEffect, useState } from "react";
import TimeAgo from "timeago-react";
import { CONTENTS_QUERY } from "../../data/query/content";
import dayjs from 'dayjs';
import "./index.css";

const { RangePicker } = DatePicker;

const rangePresets = [
    {
        label: 'Last 7 Days',
        value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
        label: 'Last 14 Days',
        value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
        label: 'Last 30 Days',
        value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
        label: 'Last 90 Days',
        value: [dayjs().add(-90, 'd'), dayjs()],
    },
];



export default () => {
    const [data, setData] = useState([])
    const [titleInput, setTitleInput] = useState(true)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
        pageSizeOptions: [25, 50, 100],
        total: 0,
    })

    const { loading, refetch } = useQuery(CONTENTS_QUERY, {
        variables: {
            first: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize,
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

            })
        },
        onError: (error) => { },
    });


    useEffect(() => {
        refetch();
    }, [JSON.stringify(pagination)]);

    const handlePaginationChange = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize,
        });
    };

    const columns = [
        {
            dataIndex: 'title',
            ellipsis: true,
            width: "60%",
            className: 'flow-cell-title',
            filterDropdown: () => {
                return <div style={{ padding: 8 }}>
                    <Input style={{ marginBottom: 8 }} />
                    <Space>
                        <Button size="small" type="primary">搜索</Button>
                        <Button size="small">重置</Button>
                    </Space>
                </div>
            },
            filterIcon: <Space><SearchOutlined /> 搜索</Space>
        },
        {
            dataIndex: '',
            className: 'flow-cell-category',
            filterIcon: <Space><FilterOutlined /> 类型</Space>,
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
        },
        {
            dataIndex: 'datetime',
            className: 'flow-cell-datetime',
            align: 'center',
            width: 180,
            filterIcon: <Space><CalendarOutlined /> 日期</Space>,
            filterDropdown: () => {
                const onRangeChange = (dates, dateStrings) => {
                    if (dates) {
                        console.log('From: ', dates[0], ', to: ', dates[1]);
                        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
                    } else {
                        console.log('Clear');
                    }
                };
                return <RangePicker presets={rangePresets} onChange={onRangeChange} />
            },
            render: (dt) => <TimeAgo
                className="datetime"
                datetime={dt}
                locale="zh_CN"
            />
        }
    ]

    return (
        <div >
            <Table
                style={{ padding: 20 }}
                columns={columns}
                dataSource={data}
                bordered
                rowKey={(record) => record.raw_id}
                loading={loading}
                size="small"
                sticky
                pagination={false}
                onChange={() => { }}
            />


            <div className="flow-tool-bar">
                <Pagination {...pagination} onChange={handlePaginationChange} />
            </div>

        </div>
    )
}