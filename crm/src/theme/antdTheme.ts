import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#641D2B",
    colorPrimaryHover: "#762538",
    colorPrimaryActive: "#4C1520",

    colorSuccess: "#4F7A5A",
    colorWarning: "#B8791F",
    colorError: "#B3362F",
    colorInfo: "#4A6A8A",

    colorTextBase: "#302528",
    colorTextSecondary: "#6B5D60",
    colorBorder: "#EADFD6",
    colorBgBase: "#FFFCF8",
    colorBgContainer: "#FFFFFF",

    borderRadius: 10,
    borderRadiusSM: 6,
    borderRadiusLG: 16,

    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 14,
    controlHeight: 44,
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: 10,
      fontWeight: 500,
      primaryColor: "#FFFFFF",
    },
    Table: {
      headerBg: "#F8F1E8",
      headerColor: "#302528",
      rowHoverBg: "#F8F1E8",
      borderColor: "#EADFD6",
    },
    Menu: {
      darkItemBg: "#302528",
      darkItemSelectedBg: "#641D2B",
      darkItemSelectedColor: "#FFFFFF",
      darkItemColor: "#DCC8BD",
      darkItemHoverColor: "#FFFFFF",
      darkSubMenuItemBg: "#251C1F",
    },
    Card: {
      borderRadiusLG: 16,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Input: {
      controlHeight: 44,
      borderRadius: 10,
      activeBorderColor: "#641D2B",
      hoverBorderColor: "#762538",
    },
    Select: {
      controlHeight: 44,
      borderRadius: 10,
    },
    DatePicker: {
      controlHeight: 44,
      borderRadius: 10,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};
