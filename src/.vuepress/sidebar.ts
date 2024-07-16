import {sidebar} from "vuepress-theme-hope";
import {interviewExperience} from "./siderbar/interviewExperience.js";
import {demo} from "./siderbar/demo.js";
import {aboutMe} from "./siderbar/aboutMe.js";

export default sidebar({
    // 应该把更精确的路径放置在前边
    "/interviewExperience/": interviewExperience,

    "/aboutMe/": aboutMe,
    // 配置演示,正式环境需注销
    // "/demo/": demo,
    "/": [
        "",
        {
            text: "必看",
            icon: "meiribikan",
            collapsible: true,
            prefix: "posts/必看/",
            // 点击"必看"汉字将要跳转的网址
            // link: "abc/",
            children: "structure",
        },
        {
            text: "面试专栏",
            icon: "zhenrenmianshi",
            collapsible: true,
            prefix: "posts/面试准备/",
            // link: "demo/",
            children: "structure",
        },
        {
            text: "Java",
            icon: "java",
            prefix: "posts/Java/",
            collapsible: true,
            children: "structure",
        },
        {
            text: "计算机基础",
            icon: "application--web",
            prefix: "posts/计算机基础/",
            collapsible: true,
            children: "structure",
        },
        {
            text: "系统设计",
            icon: "xitongsheji",
            prefix: "posts/系统设计/",
            collapsible: true,
            children: "structure",
        },
        {
            text: "数据库",
            icon: "jurassic_data",
            collapsible: true,
            prefix: "posts/数据库/",
            link: "demo/",
            children: "structure",
        },
        {
            text: "开发工具",
            icon: "kaifagongju",
            collapsible: true,
            prefix: "posts/开发工具/",
            link: "developmentTool/",
            children: "structure",
        },
        {
            text: "常用框架",
            icon: "yemiankuangjia_o",
            collapsible: true,
            prefix: "posts/常用框架/",
            link: "demo/",
            children: "structure",
        },
        {
            text: "前端",
            icon: "qianduan",
            collapsible: true,
            prefix: "posts/前端/",
            link: "demo/",
            children: "structure",
        },
        // {
        //     text: "系统设计",
        //     prefix: "posts/系统设计/",
        //     collapsible: true,
        //     children: [
        //         "baz" /* /baz.html */,
        //         {
        //             text: "Sub Group 1",
        //             collapsible: true,
        //             children: ["quz" /* /quz.html */, "xyzzy" /* /xyzzy.html */],
        //         },
        //         {
        //             text: "Sub Group 2",
        //             prefix: "corge/",
        //             collapsible: true,
        //             children: [
        //                 "fred" /* /corge/fred.html */,
        //                 "grault" /* /corge/grault.html */,
        //             ],
        //         },
        //         "foo" /* /foo.html */,
        //     ],
        // },
        "intro",
        {
            text: "幻灯片",
            icon: "huandengpian-04",
            link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
        },
    ],
});
