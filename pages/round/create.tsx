import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  Input,
  Layout,
  Row,
  Col,
  Select,
  Breadcrumb,
} from "antd/lib";
import { ItemType } from "antd/lib/breadcrumb/Breadcrumb";

import { DeskType, RoundStatus } from "@/app/api/round/interface";
import { useAppDispatch } from "@/redux/hook";
import { fetchCurrentRound } from "@/redux/mahjong";
import { getAllPlayers, postRound } from "@/util/api";
import { Player } from "@/app/api/player/interface";

const breadcrumbItems: ItemType[] = [
  {
    title: "將",
  },
  {
    title: "新增將",
  },
];

const deskTypeOption = [
  {
    label: "電動",
    value: DeskType.AUTO,
  },
  {
    label: "手動",
    value: DeskType.MANUAL,
  },
];

interface FormValue {
  deskType: DeskType;
  base: number;
  point: number;
  east: string;
  south: string;
  west: string;
  north: string;
}

const Round: React.FC = () => {
  const [form] = Form.useForm();
  const [players, setPlayers] = useState<Player[]>([]);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const playerSelectOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const onEastChange = (value: string) => {
    if (form.getFieldValue("south") === value)
      form.setFieldValue("south", null);
    if (form.getFieldValue("west") === value) form.setFieldValue("west", null);
    if (form.getFieldValue("north") === value)
      form.setFieldValue("north", null);
  };

  const onSouthChange = (value: string) => {
    if (form.getFieldValue("east") === value) form.setFieldValue("east", null);
    if (form.getFieldValue("west") === value) form.setFieldValue("west", null);
    if (form.getFieldValue("north") === value)
      form.setFieldValue("north", null);
  };

  const onWestChange = (value: string) => {
    if (form.getFieldValue("east") === value) form.setFieldValue("east", null);
    if (form.getFieldValue("south") === value)
      form.setFieldValue("south", null);
    if (form.getFieldValue("north") === value)
      form.setFieldValue("north", null);
  };

  const onNorthChange = (value: string) => {
    if (form.getFieldValue("east") === value) form.setFieldValue("east", null);
    if (form.getFieldValue("south") === value)
      form.setFieldValue("south", null);
    if (form.getFieldValue("west") === value) form.setFieldValue("west", null);
  };

  const onCheckForm = () => {
    const values = form.getFieldsValue(["east", "south", "west", "north"]);
    const uniqueValues = new Set(Object.values(values));
    const hasDuplicates = uniqueValues.size !== Object.keys(values).length;
    const allFieldsHaveValue = Object.values(values).every((value) => !!value);
    setSubmitDisabled(!allFieldsHaveValue || hasDuplicates);
  };

  const onSubmit = async (value: FormValue) => {
    await postRound(value)
      .then((res) => {
        router.push("/record");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    dispatch(fetchCurrentRound()).then((res) => {
      if (
        res.payload.status === RoundStatus.IN_PROGRESS ||
        res.payload.status === RoundStatus.END
      ) {
        router.push("/record");
      } else {
        getAllPlayers().then((res) => {
          const { data } = res.data;
          setPlayers(data);
        });
      }
    });
  }, [dispatch, router]);

  return (
    <Layout>
      <Breadcrumb items={breadcrumbItems} />
      <Form
        form={form}
        onFinish={onSubmit}
        onFieldsChange={onCheckForm}
        initialValues={{
          base: 100,
          point: 20,
          deskType: DeskType.AUTO,
        }}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item label="底" name="base">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="台" name="point">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="桌子" name="deskType">
              <Select options={deskTypeOption} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="東" name="east">
              <Select options={playerSelectOptions} onChange={onEastChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="南" name="south">
              <Select options={playerSelectOptions} onChange={onSouthChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="西" name="west">
              <Select options={playerSelectOptions} onChange={onWestChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="北" name="north">
              <Select options={playerSelectOptions} onChange={onNorthChange} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button htmlType="submit" type="primary" disabled={submitDisabled}>
            送出
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};
export default Round;
