import React, { useState } from "react";
import { Breadcrumb, Button, Form, Input, message } from "antd/lib";
import { ItemType } from "antd/lib/breadcrumb/Breadcrumb";

import { postPlayer } from "@/util/api";

interface FormValue {
  name: string;
}

const breadcrumbItems: ItemType[] = [
  {
    title: "玩家",
  },
  {
    title: "新增玩家",
  },
];

const PlayerCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [formSubmitDisabled, setFormSubmitDisabled] = useState<boolean>(true);

  const onFormSubmitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFormSubmitDisabled(false);
    } else {
      setFormSubmitDisabled(true);
    }
  };

  const onFormSubmit = async (value: FormValue) => {
    await postPlayer(value)
      .then((res) => {
        if (res.data.status === "success") {
          message.success(`新增Player：${value.name}成功！`);
          form.resetFields();
        } else {
          message.error(`新增Player：${value.name}失敗！`);
          message.error(res.data.data);
        }
      })
      .catch((err) => {
        message.error(`新增Player：${value.name}失敗！`);
        console.error(err);
      });
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Form form={form} onFinish={onFormSubmit}>
        <Form.Item label="名稱" name="name">
          <Input onChange={onFormSubmitChange} placeholder="點擊輸入玩家名稱" />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            disabled={formSubmitDisabled}
          >
            送出
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlayerCreate;
