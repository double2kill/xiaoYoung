# PM2 部署指南

## 安装 PM2

```bash
npm install -g pm2
```

## 基本使用

### 构建项目

```bash
npm run build
```

### 启动应用

```bash
# 开发环境
npm run pm2:start

# 生产环境
npm run pm2:start:prod

# 预发布环境
npm run pm2:start:staging
```

### 管理应用

```bash
# 查看状态
npm run pm2:status

# 查看日志
npm run pm2:logs

# 重启应用
npm run pm2:restart

# 重载应用（零停机时间）
npm run pm2:reload

# 停止应用
npm run pm2:stop

# 删除应用
npm run pm2:delete

# 监控面板
npm run pm2:monit
```

## 配置说明

- **应用名称**: xiaoYoung-api
- **端口**: 3000
- **内存限制**: 1GB
- **日志文件**:
  - 错误日志: `./logs/err.log`
  - 输出日志: `./logs/out.log`
  - 合并日志: `./logs/combined.log`

## 环境变量

- `NODE_ENV`: 环境模式 (development/production/staging)
- `PORT`: 服务端口 (默认 3000)

## 部署配置

支持 production 和 staging 环境的自动部署，需要配置相应的服务器信息。
