import { Col, Row, Select, Table, Typography, Tag } from "antd/lib";
import { ColumnsType } from "antd/lib/table";
import { getExistDate, getHistoryByDate } from "@/util/api";
import dayjs from "dayjs";
import { DeskType } from "@/api/round/interface";
import { HistoryRound } from "@/lib/redis/interface";
import RecordList from "@/component/round/recordList";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface IColumn {
  key: string | React.ReactNode;
  uKey: number;
  win: number;
  selfDrawn: number;
  lose: number;
  fake: number;
  amount: number;
}

const RoundSearch: React.FC = () => {
  const [existDate, setExistDate] = useState<string[]>([]);
  const [historyRound, setHistoryRound] = useState<HistoryRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<HistoryRound>({
    uid: "",
    createdAt: new Date(),
    deskType: DeskType.AUTO,
    base: 0,
    point: 0,
    east: {
      id: 0,
      name: "",
      win: 0,
      lose: 0,
      selfDrawn: 0,
      draw: 0,
      beSelfDrawn: 0,
      fake: 0,
      amount: 0,
    },
    south: {
      id: 0,
      name: "",
      win: 0,
      lose: 0,
      selfDrawn: 0,
      draw: 0,
      beSelfDrawn: 0,
      fake: 0,
      amount: 0,
    },
    west: {
      id: 0,
      name: "",
      win: 0,
      lose: 0,
      selfDrawn: 0,
      draw: 0,
      beSelfDrawn: 0,
      fake: 0,
      amount: 0,
    },
    north: {
      id: 0,
      name: "",
      win: 0,
      lose: 0,
      selfDrawn: 0,
      draw: 0,
      beSelfDrawn: 0,
      fake: 0,
      amount: 0,
    },
    records: [],
    venue: [],
  });
  const { east, south, west, north, records, venue } = selectedRound;

  const columns: ColumnsType<IColumn> = [
    {
      title: "",
      dataIndex: "key",
      rowScope: "row",
      width: 80,
    },
    {
      key: "playerList_column_win",
      title: "胡",
      dataIndex: "win",
      align: "right",
    },
    {
      key: "playerList_column_selfDrawn",
      title: "自摸",
      dataIndex: "selfDrawn",
      align: "right",
    },
    {
      key: "playerList_column_lose",
      title: "放槍",
      dataIndex: "lose",
      align: "right",
    },
    {
      key: "playerList_column_fake",
      title: "詐胡",
      dataIndex: "fake",
      align: "right",
    },
    {
      key: "playerList_column_amount",
      title: "小計",
      dataIndex: "amount",
      align: "right",
    },
  ];

  const data: IColumn[] = [
    {
      key: <Text key="roundSearch_data_east">{`${east.name}`}</Text>,
      uKey: 0,
      win: east.win,
      selfDrawn: east.selfDrawn,
      lose: east.lose,
      fake: east.fake,
      amount: east.amount,
    },
    {
      key: <Text key="roundSearch_data_south">{`${south.name}`}</Text>,
      uKey: 1,
      win: south.win,
      selfDrawn: south.selfDrawn,
      lose: south.lose,
      fake: south.fake,
      amount: south.amount,
    },
    {
      key: <Text key="roundSearch_data_west">{`${west.name}`}</Text>,
      uKey: 2,
      win: west.win,
      selfDrawn: west.selfDrawn,
      lose: west.lose,
      fake: west.fake,
      amount: west.amount,
    },
    {
      key: <Text key="roundSearch_data_north">{`${north.name}`}</Text>,
      uKey: 3,
      win: north.win,
      selfDrawn: north.selfDrawn,
      lose: north.lose,
      fake: north.fake,
      amount: north.amount,
    },
  ];

  const dateOptions = existDate
    .map((date) => {
      return {
        key: date,
        value: date,
        label: date,
      };
    })
    .reverse();

  const historyRoundOptions = historyRound.map((round, index) => {
    const { uid, createdAt, base, point, east, south, west, north } = round;
    const time = dayjs(createdAt).format("HH:mm");
    return {
      key: uid,
      value: index,
      label: `${time}，${base}/${point}，東：${east.name}南：${south.name}西：${west.name}北：${north.name}`,
    };
  });

  const renderVenue = venue.map((record, index) => {
    const { winner } = record;
    return (
      <Tag key={`venueTag_${index}`} color="blue">
        {index + 1}. {winner}
      </Tag>
    );
  });

  const onDateChange = (date: string) => {
    getHistoryByDate(date).then((res) => {
      const { data } = res.data;
      setHistoryRound(data);
    });
  };

  const onRoundChange = (index: number) => {
    setSelectedRound(historyRound[index]);
  };

  useEffect(() => {
    getExistDate().then((res) => {
      const { data } = res.data;
      setExistDate(data);
    });
  }, []);

  return (
    <Row>
      <Col span={24}>
        <Select
          options={dateOptions}
          placeholder="選擇日期"
          onChange={onDateChange}
          style={{
            width: "100%",
          }}
        />
      </Col>

      <Col span={24}>
        <Select
          options={historyRoundOptions}
          placeholder="選擇將"
          onChange={onRoundChange}
          style={{
            width: "100%",
          }}
        />
      </Col>

      {selectedRound.uid && (
        <>
          <Col span={24}>繳東:{renderVenue}</Col>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey={(row) => `roundSearch_row_${row.uKey}`}
            />
          </Col>
          <Col span={24}>
            <RecordList records={records} />
          </Col>
        </>
      )}
    </Row>
  );
};

export default RoundSearch;
