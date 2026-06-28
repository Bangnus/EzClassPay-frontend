declare module "*.png" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.svg" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.jpeg" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.gif" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.webp" {
  const value: import("next/image").StaticImageData;
  export default value;
}
