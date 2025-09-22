<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail">
    <img src="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/issues">
    <img src="https://img.shields.io/github/issues/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/LICENSE">
    <img src="https://img.shields.io/github/license/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/v/tdesign-miniprogram.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/dw/tdesign-miniprogram" alt="Downloads">
  </a>
</p>

# TDesign 社交圈子小程序

TDesign 社交圈子小程序采用 [TDesign 企业级设计体系小程序解决方案](https://tdesign.tencent.com/miniprogram/overview) 进行搭建，依赖 [TDesign 微信小程序组件库](https://github.com/Tencent/tdesign-miniprogram)，提供完整的社交圈子功能体验。

## :high_brightness: 预览

<p>请使用微信扫描以下二维码：</p>

 <img src="https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-mp/common/qrcode.jpeg" width = "200" height = "200" alt="模版小程序二维码" align=center />

## :pushpin: 项目介绍

### 1. 业务介绍

社交圈子小程序是一个基于TDesign的社交应用，主要功能包括用户圈子、公告通知、优惠券管理等。小程序采用分包加载策略，包含首页、圈子、个人中心等核心页面，以及用户管理、优惠券、公告等子包页面。采用 mock 数据进行展示，提供了完整的社交互动体验。

<img src="https://tdesign.gtimg.com/miniprogram/template/retail/tdesign-starter-readmeV1.png" width = "650" height = "900" alt="模版小程序页面详情" align=center />

主要页面截图如下：

<p align="center">
    <img alt="example-home" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/home.png" />
    <img alt="example-sort" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v2/sort.png" />
    <img alt="example-cart" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/cart.png" />
    <img alt="example-user-center" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/user-center.png" />
    <img alt="example-goods-detail" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/goods-detail.png" />
    <img alt="example-pay" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/pay.png" />
    <img alt="example-order" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v1/order.png" />
    <img alt="example-order-detail" width="200" src="https://tdesign.gtimg.com/miniprogram/template/retail/example/v2/order.png" />
</p>

### 2. 项目构成

社交圈子小程序采用基础的 JavaScript + WXSS + ESLint 进行构建，降低了使用门槛。

项目目录结构如下：

```
|-- xiaoYoung
    |-- README.md
    |-- app.js
    |-- app.json
    |-- app.wxss
    |-- components	//	公共组件库
    |-- config	//	基础配置
    |-- custom-tab-bar	//	自定义 tabbar
    |-- model	//	mock 数据
    |-- pages
    |   |-- home	//	首页
    |   |-- usergroup	//	用户圈子相关页面
    |   |-- usercenter	//	个人中心页面
    |   |-- user	//	用户管理子包（个人信息、地址等）
    |   |-- coupon	//	优惠券子包
    |   |-- announcement	//	公告通知子包
    |-- services	//	请求接口
    |-- style	//	公共样式与iconfont
    |-- utils	//	工具库
```

### 3. 数据模拟

社交圈子小程序采用 mock 数据模拟后端返回逻辑，在小程序中展示完整的社交互动场景与用户体验逻辑。数据模拟策略详见 [mock.md](./mock.md)。

### 4. 添加新页面

1. 在 `pages` 目录下创建对应的页面文件夹
2. 在 `app.json` 文件中的 `pages` 数组中加上页面路径（主包页面）
3. 如果是子包页面，在 `app.json` 的 `subpackages` 中配置
4. [可选] 在 `project.config.json` 文件的 `"miniprogram-list"` 下添加页面配置

## :hammer: 构建运行

1. `npm install`
2. 小程序开发工具中引入工程
3. 构建 npm

## :art: 代码风格控制

`eslint` `prettier`

## :iphone: 基础库版本

最低基础库版本`^3.10.0`

## :dart: 反馈

企业微信群
TDesign 团队会及时在企业微信大群中同步发布版本、问题修复信息，也会有一些关于组件库建设的讨论，欢迎微信或企业微信扫码入群交流：

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/TDesign%20IM.png" width = "200" height = "200" alt="模版小程序页面详情" align=center />

邮件联系：tdesign@tencent.com

## :link: TDesign 其他技术栈实现

- 移动端 小程序 实现：[mobile-miniprogram](https://github.com/Tencent/tdesign-miniprogram)
- 桌面端 Vue 2 实现：[web-vue](https://github.com/Tencent/tdesign-vue)
- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 React 实现：[web-react](https://github.com/Tencent/tdesign-react)

## :page_with_curl: 开源协议

TDesign 遵循 [MIT 协议](./LICENSE)。
