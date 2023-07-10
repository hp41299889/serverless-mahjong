import React, { useState } from "react";
import { Typography, Table, Button, Modal } from "antd/lib";
import { ColumnsType } from "antd/lib/table";

import { CurrentRound } from "@/job/mahjong/interface";
import { Wind } from "@/pages/api/record/interface";
import { deleteCurrentRound } from "@/util/api";
import { useAppDispatch } from "@/redux/hook";
import { fetchCurrentRound } from "@/redux/mahjong";

const { Text } = Typography;

interface IProps {
  currentRound: CurrentRound;
}

interface IColumn {
  key: string | React.ReactNode;
  uKey: number;
  win: number;
  selfDrawn: number;
  lose: number;
  fake: number;
  amount: number;
}

const PlayerList: React.FC<IProps> = (props) => {
  const { currentRound } = props;
  const { east, south, west, north } = currentRound.players;
  const [isDeleteCurrentRoundModal, setIsDeleteCurrentRoundModal] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const showDeleteCurrentRoundModal = () => {
    setIsDeleteCurrentRoundModal(true);
  };

  const onDeleteLastRecordModalCancel = () => {
    setIsDeleteCurrentRoundModal(false);
  };

  const onDeleteLastRecordModalOk = async () => {
    setIsDeleteCurrentRoundModal(false);
    await deleteCurrentRound();
    await dispatch(fetchCurrentRound());
  };

  const columns: ColumnsType<IColumn> = [
    {
      title: (
        <>
          <Button type="primary" danger onClick={showDeleteCurrentRoundModal}>
            刪除這將
          </Button>
          <Modal
            title="刪除這將"
            open={isDeleteCurrentRoundModal}
            onOk={onDeleteLastRecordModalOk}
            onCancel={onDeleteLastRecordModalCancel}
          />
        </>
      ),
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
      key: (
        <Text
          key="playerList_data_east"
          style={currentRound.dealer === Wind.EAST ? { color: "red" } : {}}
        >
          {`${east.name}`}
        </Text>
      ),
      uKey: 0,
      win: east.win,
      selfDrawn: east.selfDrawn,
      lose: east.lose,
      fake: east.fake,
      amount: east.amount,
    },
    {
      key: (
        <Text
          key="playerList_data_south"
          style={currentRound.dealer === Wind.SOUTH ? { color: "red" } : {}}
        >
          {`${south.name}`}
        </Text>
      ),
      uKey: 1,
      win: south.win,
      selfDrawn: south.selfDrawn,
      lose: south.lose,
      fake: south.fake,
      amount: south.amount,
    },
    {
      key: (
        <Text
          key="playerList_data_west"
          style={currentRound.dealer === Wind.WEST ? { color: "red" } : {}}
        >
          {`${west.name}`}
        </Text>
      ),
      uKey: 2,
      win: west.win,
      selfDrawn: west.selfDrawn,
      lose: west.lose,
      fake: west.fake,
      amount: west.amount,
    },
    {
      key: (
        <Text
          key="playerList_data_north"
          style={currentRound.dealer === Wind.NORTH ? { color: "red" } : {}}
        >
          {`${north.name}`}
        </Text>
      ),
      uKey: 3,
      win: north.win,
      selfDrawn: north.selfDrawn,
      lose: north.lose,
      fake: north.fake,
      amount: north.amount,
    },
  ];

  return (
    <Table
      size="small"
      dataSource={data}
      columns={columns}
      rowKey={(row) => `playerList_row_${row.uKey}`}
      pagination={false}
      style={{
        width: "100%",
      }}
    />
  );
};

export default PlayerList;
