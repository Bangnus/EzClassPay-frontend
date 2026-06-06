import { Button as AntButton, ButtonProps, ConfigProvider } from "antd";

const Button = ({
  type = "primary",
  children = "Button",
  icon,
  borderRadius = 12,
  fontSize = 14,
  padding,
  color,
  ...props
}: Omit<ButtonProps, "color"> & {
  borderRadius?: number;
  fontSize?: number;
  padding?: number | string;
  color?: string;
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: borderRadius,
          fontSize: fontSize,
          ...(color ? { colorPrimary: color } : {}),
        },
      }}
    >
      <AntButton
        type={type}
        {...props}
        icon={icon}
        block={true}
        style={{
          padding: padding,
          height: padding ? "auto" : undefined,
          ...props.style,
        }}
      >
        <p className="font-semibold">{children}</p>
      </AntButton>
    </ConfigProvider>
  );
};
export default Button;
