import React, { useState } from "react";
import { Form, Radio, RadioChangeEvent, Button, Input } from "antd/lib";

import { Players } from "@/lib/redis/interface";

interface IProps {
  players: Players;
  submitDisabled: boolean;
}

const WinningForm: React.FC<IProps> = (props) => {
  const { players, submitDisabled } = props;
  const [winner, setWinner] = useState<string>("");

  const onWinnerChange = (e: RadioChangeEvent) => {
    setWinner(e.target.value);
  };

  const winnerOptions = [
    { label: players.east.name, value: players.east.name },
    { label: players.south.name, value: players.south.name },
    { label: players.west.name, value: players.west.name },
    { label: players.north.name, value: players.north.name },
  ];

  const loserOptions = winner
    ? winnerOptions.filter((option) => option.value !== winner)
    : [];

  return (
    <>
      <Form.Item label={"胡牌"} name={"winner"}>
        <Radio.Group onChange={onWinnerChange} options={winnerOptions} />
      </Form.Item>
      <Form.Item label={"放槍"} name={"losers"}>
        <Radio.Group options={loserOptions} />
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

export default WinningForm;
