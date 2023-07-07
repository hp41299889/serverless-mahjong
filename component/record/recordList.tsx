import React from "react";
import { List, Tag, Divider } from "antd/lib";

import { EndType } from "@/pages/api/record/interface";
import { windLabelMap } from "../round/recordList";
import { AddRecord } from "@/lib/redis/interface";

interface IProps {
  recordsListDatas?: JSX.Element[];
  records: AddRecord[];
}

const RecordList: React.FC<IProps> = (props: IProps) => {
  const { records } = props;

  const recordsListDatas = records.map((record, index) => {
    const { circle, dealer, dealerCount, winner, losers, endType, point } =
      record;
    const winnerNode = <Tag color="cyan">{winner}</Tag>;
    const loserNode = <Tag color="red">{losers}</Tag>;
    const pointNode = <Tag color="magenta">{point}台</Tag>;
    let event: React.ReactNode;
    switch (endType) {
      case EndType.WINNING: {
        event = (
          <>
            {winnerNode}
            <Tag color="orange">胡</Tag>
            {loserNode}
            {pointNode}
          </>
        );
        break;
      }
      case EndType.SELF_DRAWN: {
        event = (
          <>
            {winnerNode}
            <Tag color="purple">自摸</Tag>
            {pointNode}
          </>
        );
        break;
      }
      case EndType.DRAW: {
        event = <Tag color="yellow">流局</Tag>;
        break;
      }
      case EndType.FAKE: {
        break;
      }
    }
    return (
      <List.Item
        key={`list_${index}`}
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        {index + 1}
        <Divider type="vertical" />
        <Tag color="blue">
          {/* {windLabelMap[circle]}風{windLabelMap[dealer]}局 */}
        </Tag>
        <Tag color="purple">連{dealerCount}</Tag>
        {event}
      </List.Item>
    );
  });

  return (
    <>
      <List
        size="small"
        dataSource={recordsListDatas}
        bordered
        renderItem={(item, index) => item}
      />
    </>
  );
};

export default RecordList;
