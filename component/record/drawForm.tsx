import React from "react";
import { Form, Button, Typography } from "antd/lib";

const DrawForm: React.FC = () => {
  return (
    <>
      <Typography.Title>流局</Typography.Title>
      <Form.Item
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button htmlType="submit" type="primary">
          送出
        </Button>
      </Form.Item>
    </>
  );
};

export default DrawForm;
