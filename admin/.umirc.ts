import { defineConfig } from '@umijs/max';
import proxy from './config/proxy';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
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
      name: '用户列表',
      path: '/user-list',
      component: './UserList',
    },
    {
      name: '校友会管理',
      path: '/community',
      component: './Community',
    },
  ],
  npmClient: 'pnpm',
});
