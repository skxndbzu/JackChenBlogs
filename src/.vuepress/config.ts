import { defineUserConfig } from "vuepress";


import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "",
  description: "麻花的博客",

  theme,
  // extendsMarkdown: (md) => {
  //   md.use(yourExtension, options);
  // },
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
