export type Lang = "en" | "zh-Hans" | "zh-Hant";

type Trilingual = Record<Lang, string>;

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  "zh-Hans": "简体",
  "zh-Hant": "繁體",
};

export const NAV_LABELS = {
  yesterday: {
    en: "View Yesterday",
    "zh-Hans": "查看昨天的成语",
    "zh-Hant": "查看昨天的成語",
  },
  today: {
    en: "View Today",
    "zh-Hans": "查看今天的成语",
    "zh-Hant": "查看今天的成語",
  },
  random: { en: "Random", "zh-Hans": "随机", "zh-Hant": "隨機" },
  browse: { en: "Browse", "zh-Hans": "浏览", "zh-Hant": "瀏覽" },
  bookmarks: { en: "Bookmarks", "zh-Hans": "书签", "zh-Hant": "書籤" },
} satisfies Record<string, Trilingual>;

export const SECTION_LABELS = {
  today: { en: "Today's Chengyu", "zh-Hans": "今天的成语", "zh-Hant": "今天的成語" },
  yesterday: { en: "Yesterday's Chengyu", "zh-Hans": "昨天的成语", "zh-Hant": "昨天的成語" },
  random: { en: "Random Chengyu", "zh-Hans": "随机成语", "zh-Hant": "隨機成語" },
  bookmark: { en: "Bookmarked Chengyu", "zh-Hans": "收藏的成语", "zh-Hant": "收藏的成語" },
  definition: { en: "Definition", "zh-Hans": "释义", "zh-Hant": "釋義" },
  origin: { en: "Origin", "zh-Hans": "出处", "zh-Hant": "出處" },
  example: { en: "Example", "zh-Hans": "例句", "zh-Hant": "例句" },
} satisfies Record<string, Trilingual>;

export const ACTION_LABELS = {
  playPronunciation: { en: "Play pronunciation", "zh-Hans": "播放发音", "zh-Hant": "播放發音" },
  audio: { en: "Audio", "zh-Hans": "语音", "zh-Hant": "語音" },
  copyIdiom: { en: "Copy Idiom", "zh-Hans": "复制成语", "zh-Hant": "複製成語" },
  copy: { en: "Copy", "zh-Hans": "复制", "zh-Hant": "複製" },
  copied: { en: "Copied!", "zh-Hans": "已复制!", "zh-Hant": "已複製!" },
  saveIdiom: { en: "Bookmark Idiom", "zh-Hans": "收藏成语", "zh-Hant": "收藏成語" },
  save: { en: "Save", "zh-Hans": "保存", "zh-Hant": "儲存" },
  saved: { en: "Saved", "zh-Hans": "已保存", "zh-Hant": "已儲存" },
  removeBookmark: { en: "Remove Bookmark", "zh-Hans": "删除书签", "zh-Hant": "刪除書籤" },
} satisfies Record<string, Trilingual>;

export const PANEL_LABELS = {
  bookmarksEmpty: {
    en: "No bookmarks yet — save an idiom to see it here.",
    "zh-Hans": "还没有书签——保存成语后会显示在这里。",
    "zh-Hant": "還沒有書籤——儲存成語後會顯示在這裡。",
  },
} satisfies Record<string, Trilingual>;

export const SETTINGS_LABELS = {
  settings: { en: "Settings", "zh-Hans": "设置", "zh-Hant": "設定" },
  language: { en: "Language", "zh-Hans": "语言", "zh-Hant": "語言" },
  theme: { en: "Theme", "zh-Hans": "主题", "zh-Hant": "主題" },
  light: { en: "Light", "zh-Hans": "浅色", "zh-Hant": "淺色" },
  dark: { en: "Dark", "zh-Hans": "深色", "zh-Hant": "深色" },
  system: { en: "System", "zh-Hans": "跟随系统", "zh-Hant": "跟隨系統" },
  close: { en: "Close", "zh-Hans": "关闭", "zh-Hant": "關閉" },
} satisfies Record<string, Trilingual>;

export const COUNTDOWN_LABELS: Trilingual = {
  en: "Next Chengyu in",
  "zh-Hans": "下个成语",
  "zh-Hant": "下個成語",
};

export const DAYS_I18N: Record<Lang, string[]> = {
  en: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  "zh-Hans": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  "zh-Hant": ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
};

export const MONTHS_I18N: Record<Lang, string[]> = {
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  "zh-Hans": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "zh-Hant": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
};
