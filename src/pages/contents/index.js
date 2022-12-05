import React, { useReducer } from "react";
import { CONTENTS_QUERY } from "../../data/query/content";
import ContentsList from "../../components/ContentsList";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Skeleton, Typography } from "antd";

import "./index.css";
import InfiniteScroll from "react-infinite-scroll-component";

const { Title, Paragraph } = Typography;


const LatestContents = () => {
  const [contents, setContents] = React.useState([]);
  const [latests, setLatests] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [after, setAfter] = React.useState("");
  const [tail, setTail] = React.useState("");
  const [hasMore, setHasMore] = React.useState(true);

  const [fetchLatest] = useLazyQuery(CONTENTS_QUERY, {
    variables: {
      first: 1,
    },
    onCompleted: (data) => {
      const { page_info: { end_cursor } } = data.contents;

      setTail(end_cursor);
    }
  });

  React.useEffect(() => {
    let i = setInterval(() => {
      if (!tail) {
        console.count("skip fetch latest")
        return
      }
      console.count(tail)
      fetchLatest({
        variables: {
          first: 10,
          after: tail,
          sortBy: "datetime:asc",
        },
        onCompleted: (data) => {
          const {
            items,
            total_count,
            page_info: { end_cursor, has_next_page },
          } = data.contents;
          if (items.length == 0 ) {return}
          setLatests([...items.reverse(), ...latests])
          setTail(setTail);

        }
      })
    }, 5000);
    return () => clearInterval(i)
  }, [tail])


  const [fetch, { loading }] = useLazyQuery(CONTENTS_QUERY, {
    variables: {
      first: 20,
    },
    onCompleted: (data) => {
      const {
        items,
        total_count,
        page_info: { end_cursor, has_next_page },
      } = data.contents;
      setContents([...contents, ...items]);
      setTotal(total_count);
      setAfter(end_cursor);
      setHasMore(has_next_page);
    },
    onError: (error) => { },
  });

  React.useEffect(() => {
    fetch();
    fetchLatest();
  }, [])


  const loadMoreData = () => {
    if (loading) {
      return;
    }
    fetch({ variables: { after } });
  };

  return (
    <div className="news">
      {/* <div className="header">
        <Title level={1}>Timeline</Title>
        <Paragraph>时间线</Paragraph>
      </div> */}

      <ContentsList items={latests} hide={latests.length == 0} />
      <InfiniteScroll
        dataLength={contents.length}
        hasMore={hasMore}
        next={loadMoreData}
        loader={
          <Skeleton
            paragraph={{
              rows: 3,
            }}
            active
          />
        }
      >
        <ContentsList items={contents} />
      </InfiniteScroll>
    </div>
  );
};

export default LatestContents;
