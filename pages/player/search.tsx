import React, { useEffect, useState } from "react";
import { Col, Form, Row, Select, Switch, Table } from "antd/lib";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchStatistics, selectStatistics } from "@/redux/mahjong";
import { ColumnsType } from "antd/lib/table";
import { PlayerStatistics, WindStatistics } from "@/job/mahjong/interface";
import { percent } from "@/util/math";
import Layout from "@/component/layout";

interface IColumn {
  key: string;
  total: number | string;
  east: number | string;
  south: number | string;
  west: number | string;
  north: number | string;
}

const keyTypePairs = [
  { key: "round", type: "將數", percentage: false },
  { key: "record", type: "局數", percentage: false },
  { key: "win", type: "胡牌", percentage: true },
  { key: "selfDrawn", type: "自摸", percentage: true },
  { key: "lose", type: "放槍", percentage: true },
  { key: "beSelfDrawn", type: "被自摸", percentage: true },
  { key: "draw", type: "流局", percentage: true },
  { key: "fake", type: "詐胡", percentage: true },
  { key: "amount", type: "小計", percentage: false },
];

const PlayerSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const statistics = useAppSelector(selectStatistics);
  const [isPercent, setIsPercent] = useState<boolean>(false);
  const [playerStatistics, setPlayerStatistics] = useState<PlayerStatistics>({
    id: 0,
    name: "",
    createdAt: new Date(),
    winds: {
      east: {
        round: 0,
        record: 0,
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      south: {
        round: 0,
        record: 0,
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      west: {
        round: 0,
        record: 0,
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
      north: {
        round: 0,
        record: 0,
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0,
      },
    },
  });
  const { east, south, west, north } = playerStatistics.winds;

  const datas: IColumn[] = keyTypePairs.map((item) => {
    const { key, type, percentage } = item;
    const values = [east[key], south[key], west[key], north[key]];
    const total = values.reduce((acc, value) => acc + value, 0);
    const totalRecords = [
      east.record,
      south.record,
      west.record,
      north.record,
    ].reduce((acc, value) => acc + value, 0);

    return isPercent
      ? {
          key: type,
          total: percentage ? percent(total / totalRecords) : total,
          east: percentage
            ? values[0] === 0
              ? "0%"
              : percent(values[0] / east.record)
            : values[0],
          south: percentage
            ? values[1] === 0
              ? "0%"
              : percent(values[1] / south.record)
            : values[1],
          west: percentage
            ? values[2] === 0
              ? "0%"
              : percent(values[2] / west.record)
            : values[2],
          north: percentage
            ? values[3] === 0
              ? "0%"
              : percent(values[3] / north.record)
            : values[3],
        }
      : {
          key: type,
          total: total,
          east: values[0],
          south: values[1],
          west: values[2],
          north: values[3],
        };
  });

  const onToggleChange = () => {
    setIsPercent(!isPercent);
  };

  const onChange = async (value: string) => {
    setPlayerStatistics(statistics[value]);
  };

  const selectOptions = statistics
    ? Object.keys(statistics).map((player) => ({
        value: player,
        label: player,
      }))
    : [];

  const columns: ColumnsType<IColumn> = [
    {
      title: (
        <>
          <Switch
            checkedChildren="N"
            unCheckedChildren="%"
            defaultChecked
            onChange={onToggleChange}
          />
        </>
      ),
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "總計",
      dataIndex: "total",
      align: "right",
    },
    {
      title: "東",
      dataIndex: "east",
      align: "right",
    },
    {
      title: "南",
      dataIndex: "south",
      align: "right",
    },
    {
      title: "西",
      dataIndex: "west",
      align: "right",
    },
    {
      title: "北",
      dataIndex: "north",
      align: "right",
    },
  ];

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  return (
    <Layout>
      <Row>
        <Col span={24}>
          <Form>
            <Form.Item label="搜尋玩家" name="name">
              <Select showSearch onChange={onChange} options={selectOptions} />
            </Form.Item>
          </Form>
        </Col>
        {playerStatistics.name && (
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={datas}
              size="small"
              pagination={false}
            />
          </Col>
        )}
      </Row>
    </Layout>
  );
};

export default PlayerSearch;
