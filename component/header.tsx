import React from "react";
import { Button, Dropdown, Layout, Typography } from "antd/lib";
import {
  FolderAddOutlined,
  HomeOutlined,
  MenuOutlined,
  SaveOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons/lib";
import type { MenuProps } from "antd/lib";
import Link from "next/link";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Link href="/">
        <HomeOutlined /> 首頁
      </Link>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "2",
    type: "group",
    label: "玩家",
    children: [
      {
        key: "2-1",
        label: (
          <Link href="/player/create">
            <UserAddOutlined /> 新增玩家
          </Link>
        ),
      },
      {
        key: "2-2",
        label: (
          <Link href="/player/search">
            <UserOutlined /> 搜尋玩家
          </Link>
        ),
      },
      {
        key: "2-3",
        label: <Link href="/players/search">搜尋玩家(未完成)</Link>,
      },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "將",
    children: [
      {
        key: "3-1",
        label: (
          <Link href="/round/create">
            <FolderAddOutlined /> 新增將
          </Link>
        ),
      },
      {
        key: "3-2",
        label: (
          <Link href="/round/search">
            <SearchOutlined /> 搜尋將
          </Link>
        ),
      },
    ],
  },
  {
    key: "4",
    type: "group",
    label: "局",
    children: [
      {
        key: "4-1",
        label: (
          <Link href="/record">
            <SaveOutlined /> 新增局
          </Link>
        ),
      },
    ],
  },
];

const Header: React.FC = () => {
  return (
    <Layout.Header style={{ background: "#ffffff", padding: "0" }}>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button style={{ height: "auhref" }}>
          <MenuOutlined style={{ fontSize: "22px" }} />
          <Typography.Text style={{ fontSize: "22px" }}>菜單</Typography.Text>
        </Button>
      </Dropdown>
    </Layout.Header>
  );
};

export default Header;
