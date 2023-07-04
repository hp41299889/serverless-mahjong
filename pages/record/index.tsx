import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Radio,
  RadioChangeEvent,
  Typography,
  Form,
  Space,
  message,
  Breadcrumb,
  Divider,
  Row,
  Col,
  Button,
  List,
  Modal,
  Tag,
} from "antd/lib";
import { ItemType } from "antd/lib/breadcrumb/Breadcrumb";

import "./record.css";
import WinningForm from "@/component/record/winningForm";
import SelfDrawnForm from "@/component/record/selfDrawnForm";
import DrawForm from "@/component/record/drawForm";
import FakeForm from "@/component/record/fakeForm";
import PlayerList from "@/component/record/playerList";
import RecordList from "@/component/round/recordList";
import { EndType } from "@/api/record/interface";
import { RoundStatus } from "@/api/round/interface";
import { windLabelMap } from "@/component/round/recordList";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchCurrentRound, selectCurrentRound } from "@/redux/mahjong";
import { PostRecord } from "@/util/api/interface";
import {
  deleteLastRecord,
  postResetCurrentRound,
  postRecord,
} from "@/util/api";
import { AddRecord } from "@/lib/redis/interface";

interface EndTypeOption {
  label: string;
  value: EndType;
}

const OEndType: EndTypeOption[] = [
  { label: "胡", value: EndType.WINNING },
  { label: "摸", value: EndType.SELF_DRAWN },
  { label: "流", value: EndType.DRAW },
  { label: "詐", value: EndType.FAKE },
];
const { Text } = Typography;

const breadcrumbItems: ItemType[] = [
  {
    title: "局",
  },
  {
    title: "新增局",
  },
];

interface IRecordForm {
  endType: EndType;
  winner: string;
  losers: string;
  point: string;
}

const Record: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [endType, setEndType] = useState<EndType>(EndType.WINNING);
  const [recordSubmitDisabled, setRecordSubmitDisabled] =
    useState<boolean>(true);
  const [isDeleteLastRecordModalOpen, setIsDeleteLastRecordModalOpen] =
    useState<boolean>(false);
  const [isResetCurrentRoundModalOpen, setIsResetCurrentRoundModalOpen] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();
  const currentRound = useAppSelector(selectCurrentRound);
  const { status, circle, dealer, dealerCount, players, records, venue } =
    currentRound;

  const isRoundEmpty = (status: RoundStatus) => {
    return status === RoundStatus.EMPTY;
  };

  const renderForm = () => {
    return (
      <>
        {
          <>
            {endType === EndType.WINNING && (
              <WinningForm
                players={players}
                submitDisabled={recordSubmitDisabled}
              />
            )}
            {endType === EndType.SELF_DRAWN && (
              <SelfDrawnForm
                players={players}
                submitDisabled={recordSubmitDisabled}
              />
            )}
            {endType === EndType.DRAW && <DrawForm />}
            {endType === EndType.FAKE && <FakeForm />}
          </>
        }
      </>
    );
  };

  const renderVenue = venue.map((record, index) => {
    const { winner } = record;
    return (
      <Tag key={`venueTag_${index}`} color="blue">
        {index + 1}. {winner}
      </Tag>
    );
  });

  const renderPlayerList = useMemo(() => {
    return <PlayerList currentRound={currentRound} />;
  }, [currentRound]);

  const recordsListData = (record: AddRecord) => {
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
      <List.Item style={{ display: "flex", justifyContent: "flex-start" }}>
        <Divider type="vertical" />
        <Tag color="blue">
          {windLabelMap[circle]}風{windLabelMap[dealer]}局
        </Tag>
        <Tag color="purple">連{dealerCount}</Tag>
        {event}
      </List.Item>
    );
  };

  const showDeleteLastRecordModal = () => {
    setIsDeleteLastRecordModalOpen(true);
  };

  const onDeleteLastRecordModalOk = async () => {
    setIsDeleteLastRecordModalOpen(false);
    await deleteLastRecord();
    dispatch(fetchCurrentRound());
    setRecordSubmitDisabled(true);
  };

  const onDeleteLastRecordModalCancel = () => {
    setIsDeleteLastRecordModalOpen(false);
  };

  const showResetCurrentRoundModal = () => {
    setIsResetCurrentRoundModalOpen(true);
  };

  const onResetCurrentRoundModalOk = async () => {
    setIsResetCurrentRoundModalOpen(false);
    await postResetCurrentRound();
    router.push("/round/create");
  };

  const onResetCurrentRoundModalCancel = () => {
    setIsResetCurrentRoundModalOpen(false);
  };

  const onEndTypeChange = (e: RadioChangeEvent) => {
    setEndType(e.target.value);
    form.resetFields();
  };

  const onCheckForm = () => {
    switch (endType) {
      case EndType.WINNING: {
        const values = form.getFieldsValue(["winner", "losers", "point"]);
        const allFieldsHaveValue = Object.values(values).every(
          (value) => !!value
        );
        setRecordSubmitDisabled(!allFieldsHaveValue);
        break;
      }
      case EndType.SELF_DRAWN: {
        const values = form.getFieldsValue(["winner", "point"]);
        const allFieldsHaveValue = Object.values(values).every(
          (value) => !!value
        );
        setRecordSubmitDisabled(!allFieldsHaveValue);
        break;
      }
      case EndType.DRAW: {
        break;
      }
      case EndType.FAKE: {
        break;
      }
    }
  };

  const onSubmit = async (value: IRecordForm) => {
    value.endType = endType;
    const transformedValue: PostRecord = {
      ...value,
      losers: [value.losers],
      point: parseInt(value.point),
    };
    if (endType === EndType.WINNING) {
      transformedValue.losers = [value.losers];
    }
    if (endType === EndType.SELF_DRAWN) {
      transformedValue.losers = Object.values(players)
        .filter((player) => player.name !== value.winner)
        .map((item) => item.name);
    }
    if (endType === EndType.DRAW) {
      transformedValue.winner = "";
      transformedValue.losers = [];
    }
    await postRecord(transformedValue)
      .then((res) => {
        message.success(`新增Record成功`);
        dispatch(fetchCurrentRound());
      })
      .catch((err) => {
        console.error(err);
      });
    setEndType(EndType.WINNING);
    form.resetFields();
  };

  useEffect(() => {
    dispatch(fetchCurrentRound()).then(async (res) => {
      const { status } = res.payload;
      if (status === RoundStatus.EMPTY) {
        router.push("/round/create");
      }
    });
  }, [dispatch, router]);

  return (
    <>
      <Row className="record">
        <Col span={6}>
          <Breadcrumb items={breadcrumbItems} />
        </Col>
        <Col className="info" span={18}>
          <Text className="title" style={{ fontSize: "24px" }}>
            {`${windLabelMap[circle]}風${windLabelMap[dealer]}局`}
          </Text>
          <Divider type="vertical" />
          <Space>
            <Text>連莊:{isRoundEmpty(status) ? 0 : dealerCount}</Text>
            <Text>局數:{isRoundEmpty(status) ? 0 : records.length}</Text>
            <Text>流局數:{isRoundEmpty(status) ? 0 : players.east.draw}</Text>
          </Space>
        </Col>

        <Col span={24}>繳東:{renderVenue}</Col>

        <Col span={24}>{!isRoundEmpty(status) && renderPlayerList}</Col>
      </Row>

      {status === RoundStatus.IN_PROGRESS && (
        <>
          <Space className="endType-list">
            <Radio.Group
              onChange={onEndTypeChange}
              value={endType}
              options={OEndType}
              defaultValue={EndType.WINNING}
            />
          </Space>
          <Form
            form={form}
            className="record-form"
            onFinish={onSubmit}
            onFieldsChange={onCheckForm}
          >
            <Space
              direction="vertical"
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {!isRoundEmpty(status) && renderForm()}
            </Space>
          </Form>
        </>
      )}

      <Space style={{ display: "flex", justifyContent: "space-between" }}>
        {status !== RoundStatus.EMPTY && records.length > 0 && (
          <>
            <Button type="primary" danger onClick={showDeleteLastRecordModal}>
              刪除上一筆
            </Button>
            <Modal
              title="刪除紀錄"
              open={isDeleteLastRecordModalOpen}
              onOk={onDeleteLastRecordModalOk}
              onCancel={onDeleteLastRecordModalCancel}
            >
              <div>確定要刪除以下紀錄嗎?</div>
              <div>{recordsListData(records[records.length - 1])}</div>
            </Modal>
          </>
        )}
        {status === RoundStatus.END && (
          <>
            <Button type="primary" onClick={showResetCurrentRoundModal}>
              儲存並重置
            </Button>
            <Modal
              title="儲存並重置"
              open={isResetCurrentRoundModalOpen}
              onOk={onResetCurrentRoundModalOk}
              onCancel={onResetCurrentRoundModalCancel}
            >
              確定要儲存並重置嗎?
            </Modal>
          </>
        )}
      </Space>
      <RecordList records={records} />
    </>
  );
};

export default Record;
