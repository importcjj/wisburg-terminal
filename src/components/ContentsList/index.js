import React from 'react';
import moment from 'moment'
import "./index.css";
import { WebviewWindow } from '@tauri-apps/api/window'
import { List, Image, Typography } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { downloadFile } from '../../utils/fs';

const { Paragraph } = Typography;

const Content = ({ data, index }) => {
    const onclick = () => {
        if (!data?.detail?.source_url) {
            return
        }

        const webview = new WebviewWindow('theUniqueLabel', {
            url: 'https://wisburg.com',
        })
    }

    const category = React.useMemo(() => {
        if (data.detail?.extension === '.pdf') {
            return <FilePdfOutlined />
        }
    }, [data])

    const images = React.useMemo(() => {
        return data.detail?.attachments?.filter(item => item.file_extension.endsWith("png") || item.file_extension.endsWith("jpeg") || item.file_extension.endsWith("jpg"))
    }, [data])

    const actions = React.useMemo(() => {
        const actions = [];
        if (data.detail?.source_url) {
            actions.push(<a target="_blank" href={data.detail?.source_url}>查看原文</a>)
        }

        if (data.detail?.url) {
            const onSave = () => {
                const name = data.detail?.title || 'default';
                const ext = data.detail?.extension;
                downloadFile(data.detail?.url, name + ext);
            };

            actions.push(<a onClick={onSave}>下载</a>)
        }

        return actions
    }, [data])

    const Images = ({ data }) => {
        return <Image.PreviewGroup>
            {data.map((image, index) => <Image key={index} width={200} height={150} src={image.file_url} />)}
        </Image.PreviewGroup>
    }

    return (
        <List.Item
            actions={actions}
            extra={<>{category}</>}
        >
            <List.Item.Meta
                title={data.title}
                description={<Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>{data.description}</Paragraph>}
            />
            {images && <Images data={images} />}
        </List.Item>
    )
}

const ContentsList = ({ items = [] }) => {
    return (


        <List
            size='small'
            itemLayout="vertical"
            dataSource={items}
            renderItem={(item) => {
                return <Content key={item.row_id} data={item} />
            }}
        />
    )
}

export default ContentsList