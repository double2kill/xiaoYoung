import { defineConfig } from '@umijs/max';
import proxy from './config/proxy';

export default defineConfig({
  outputPath: 'cms',
  base: process.env.NODE_ENV === 'production' ? '/cms/' : '/',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '管理后台',
  },
  proxy: proxy,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '圈子',
      path: '/groups',
      component: './Groups',
    },
    {
      name: '圈子详情',
      path: '/groups/:id',
      component: './Groups/Detail',
      hideInMenu: true,
    },
    {
      name: '活动',
      path: '/events',
      component: './Events',
    },
    {
      name: '活动详情',
      path: '/events/:id',
      component: './Events/Detail',
      hideInMenu: true,
    },
    {
      name: '动态',
      path: '/dynamics',
      component: './Dynamics',
    },
    {
      name: '消息',
      path: '/messages',
      component: './Messages',
    },
    {
      name: '用户列表',
      path: '/user-list',
      component: './UserList',
    },
    {
      name: '用户详情',
      path: '/users/:id',
      component: './UserList/Detail',
      hideInMenu: true,
    },
  ],
  npmClient: 'pnpm',
});
