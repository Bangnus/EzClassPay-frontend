"use client";
import { Avatar } from "antd";

export default function AvatarGroup() {
  return (
    <Avatar.Group
      size="large"
      max={{
        count: 3,
        style: {
          color: "#f56a00",
          backgroundColor: "#fde3cf",
          cursor: "default",
        },
        popover: { trigger: [] },
      }}
    >
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
      <a href="https://ant.design">
        <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
      </a>
      <Avatar style={{ backgroundColor: "#87d068" }}>PL</Avatar>
      <Avatar style={{ backgroundColor: "#1677ff" }}>A</Avatar>
    </Avatar.Group>
  );
}
