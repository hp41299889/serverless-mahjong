import React from "react";
import { Form, Radio, Button, Input } from "antd/lib";

import { Players } from "@/job/mahjong/interface";

interface IProps {
  players: Players;
  submitDisabled: boolean;
}

const SelfDrawnForm: React.FC<IProps> = (props) => {
  const { players, submitDisabled } = props;

  const winnerOptions = [
    { label: players.east.name, value: players.east.name },
    { label: players.south.name, value: players.south.name },
    { label: players.west.name, value: players.west.name },
    { label: players.north.name, value: players.north.name },
  ];

  return (
    <>
      <Form.Item label={"自摸"} name="winner">
        <Radio.Group options={winnerOptions} />
      </Form.Item>
      <Form.Item label={"台"} name={"point"}>
        <Input inputMode="numeric" type="number" />
      </Form.Item>
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
    </>
  );
};

export default SelfDrawnForm;
