import React from 'react';
import { CONTENTS_QUERY } from '../../data/query/content';
import ContentsList from '../../components/ContentsList';
import { useQuery } from '@apollo/client';
import { Typography } from 'antd';

import "./index.css";

const {Title, Paragraph} = Typography;

const LatestContents = () => {
    const [ contents, setContents ] = React.useState([]);
    const [ total, setTotal ] = React.useState(0);

    const { loading, refetch } = useQuery(CONTENTS_QUERY,{
        onCompleted: (data) => {
            const {items, total_count} = data.contents;
            setContents(items);
            setTotal(total_count);
        },
        onError: (error) => {}
    });

    return (
        <div className="news">
            <div className="header">
                <Title level={1}>Timeline</Title>
                <Paragraph>时间线</Paragraph>
            </div>
            <ContentsList items={contents} />
        </div>
    )
}

export default LatestContents;