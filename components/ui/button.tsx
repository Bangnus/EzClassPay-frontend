import { Button as AntButton, ButtonProps, ConfigProvider } from "antd";

const Button = ({
  type = "primary",
  children = "Button",
  icon,
  iconPosition = "left",
  borderRadius = 12,
  fontSize = 14,
  padding,
  color,
  hoverColor,
  ...props
}: Omit<ButtonProps, "color" | "icon" | "iconPosition"> & {
  borderRadius?: number;
  fontSize?: number;
  padding?: number | string;
  color?: string;
  hoverColor?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: borderRadius,
          fontSize: fontSize,
          ...(color ? { colorPrimary: color } : {}),
        },
        components: {
          Button: {
            ...(hoverColor ? { colorPrimaryHover: hoverColor, colorPrimaryActive: hoverColor } : {}),
          }
        }
      }}
    >
      <AntButton
        type={type}
        {...props}
        block={true}
        style={{
          padding: padding,
          height: padding ? "auto" : undefined,
          ...props.style,
        }}
      >
        <div
          className={`flex items-center justify-center gap-2 ${iconPosition === "right" ? "flex-row-reverse" : ""}`}
        >
          {icon}
          <span className="font-semibold leading-none">{children}</span>
        </div>
      </AntButton>
    </ConfigProvider>
  );
};
export default Button;
