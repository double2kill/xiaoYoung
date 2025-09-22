export default {
  '/api/': {
    target: 'http://localhost:8809',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
  },
  '/admin/': {
    target: 'http://localhost:8809',
    changeOrigin: true,
    pathRewrite: {
      '^/admin': '/admin',
    },
  },
};
