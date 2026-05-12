# ============================================================
# 阶段 1: 安装依赖（dependencies）
# ============================================================
FROM node:20-alpine AS deps

# 设置工作目录
WORKDIR /app

# 仅复制依赖声明文件，充分利用 Docker 缓存层
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# 根据锁文件类型选择对应的包管理器安装依赖
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then \
    yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    echo "未找到锁文件，使用 npm install" && npm install; \
  fi

# ============================================================
# 阶段 2: 构建应用（builder）
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制全部源代码
COPY . .

# 设置构建时环境变量
ENV NODE_ENV=production

# 执行构建（如 TypeScript 编译、Webpack/Vite 打包等）
# 如果项目没有 build 脚本，此步骤会被跳过
RUN \
  if grep -q '"build"' package.json; then \
    npm run build; \
  else \
    echo "跳过构建：未找到 build 脚本"; \
  fi

# 删除开发依赖，仅保留生产依赖
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm prune --prod; \
  elif [ -f yarn.lock ]; then \
    yarn install --production --ignore-scripts; \
  else \
    npm prune --production; \
  fi

# ============================================================
# 阶段 3: 生产运行（production）
# ============================================================
FROM node:20-alpine AS production

# 安装必要的运行时依赖 & 安全补丁
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
  && rm -rf /var/cache/apk/*

# 创建非 root 用户运行应用（安全最佳实践）
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup

WORKDIR /app

# 设置生产环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 从 builder 阶段仅复制必要文件
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json  ./package.json

# 复制构建产物（根据项目结构按需调整）
# 如果是纯 JS 项目，复制源码
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
# COPY --from=builder --chown=appuser:appgroup /app/src  ./src

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE ${PORT}

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "const http = require('http'); \
    http.get('http://localhost:${PORT}/health', (r) => { \
      process.exit(r.statusCode === 200 ? 0 : 1); \
    }).on('error', () => process.exit(1));"

# 使用 dumb-init 作为 PID 1 进程，正确处理信号
ENTRYPOINT ["dumb-init", "--"]

# 启动应用
CMD ["node", "dist/index.js"]
