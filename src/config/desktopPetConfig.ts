import type { DesktopPetConfig } from "../types/config";

export const desktopPetConfig: DesktopPetConfig = {
  // 是否启用桌宠功能
  enable: true,

  // 桌宠图片宽度（像素），用于计算移动边界
  petWidth: 86,

  // 桌宠显示宽度（像素）
  width: 86,

  // 桌宠显示高度（像素），不设置则保持图片原始比例
  // height: 86,

  // 移动端桌宠显示宽度（像素）
  mobileWidth: 50,

  // 移动速度（像素/秒），值越大移动越快
  speed: 100,

  // 桌宠透明度（0-1）
  opacity: 0.9,

  // 距离页面底部的偏移量（像素）
  bottom: 0,
};
