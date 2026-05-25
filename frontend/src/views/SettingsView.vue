<template>
  <div class="settings-view" @contextmenu="onSettingsContextMenu">
    <div class="settings-layout">
      <!-- Left navigation -->
      <aside class="settings-nav">
        <div class="settings-nav-title">设置</div>
        <div class="settings-search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索设置项..."
            class="settings-search-input"
          />
        </div>
        <a
          v-for="item in filteredNavItems" :key="item.key"
          :class="['settings-nav-item', { active: activeSection === item.key }]"
          @click="activeSection = item.key; searchQuery = ''"
        >
          <span class="nav-icon-dot" :style="{ background: activeSection === item.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }"></span>
          <span v-html="highlightMatch(item.label)"></span>
        </a>
      </aside>

      <!-- Right content area -->
      <div class="settings-content">
        <!-- Account section -->
        <div v-if="activeSection === 'account'" class="content-section">
          <h2 class="section-title">gfw.net 账户</h2>

          <div v-if="!isLoggedIn">
            <HxCard>
              <div class="form-row">
                <label class="form-label">邮箱</label>
                <HxInput v-model="email" type="email" placeholder="请输入邮箱" />
              </div>
              <div class="form-row">
                <label class="form-label">密码</label>
                <HxInput v-model="password" type="password" placeholder="请输入密码" />
              </div>
              <div class="form-actions">
                <HxButton variant="primary" :loading="loading" @click="handleLogin">
                  {{ loading ? '登录中...' : '登录' }}
                </HxButton>
              </div>
            </HxCard>
          </div>

          <div v-else>
            <HxCard>
              <div class="user-profile-row">
                <div class="user-avatar">
                  <IconUser :size="24" />
                </div>
                <div class="user-info">
                  <div class="user-name">{{ user?.nickname || user?.email }}</div>
                  <div class="user-group">{{ userInfo?.group_name || 'Standard' }}</div>
                </div>
                <HxButton variant="danger" size="sm" @click="logout">登出</HxButton>
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">余额</span>
                  <span class="stat-value primary">{{ balance?.toFixed(2) }} G币</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">用户组</span>
                  <span class="stat-value">{{ userInfo?.group_name || '-' }}</span>
                </div>
              </div>
            </HxCard>
          </div>
        </div>

        <!-- Model settings section -->
        <div v-if="activeSection === 'model'" class="content-section">
          <h2 class="section-title">模型设置</h2>

          <!-- Provider 选择 -->
          <HxCard style="margin-bottom: 20px;">
            <div class="provider-tabs">
              <button
                :class="['provider-tab', { active: providerMode === 'gfw' }]"
                @click="providerMode = 'gfw'; chatStore.setProviderMode('gfw')"
              >
                <img class="provider-logo" src="../assets/gfw-logo.svg" alt="GFW.NET" />
                <span>GFW.NET 内置</span>
              </button>
              <button
                :class="['provider-tab', { active: providerMode === 'custom' }]"
                @click="providerMode = 'custom'; chatStore.setProviderMode('custom')"
              >
                <svg class="provider-logo" viewBox="0 0 1024 1024"><path d="M0 0m256 0l512 0q256 0 256 256l0 512q0 256-256 256l-512 0q-256 0-256-256l0-512q0-256 256-256Z" fill="#176AF0"></path><path d="M837.76 639.808a112.512 112.512 0 0 1-14.592 55.36 109.696 109.696 0 0 1-39.744 40.512l-217.152 128a106.816 106.816 0 0 1-108.8 0l-217.088-128a109.632 109.632 0 0 1-39.744-40.512 112.512 112.512 0 0 1-14.592-55.36v-256a112.512 112.512 0 0 1 14.528-55.36 109.696 109.696 0 0 1 39.744-40.512l217.152-128a106.816 106.816 0 0 1 108.8 0l217.216 128a109.696 109.696 0 0 1 39.744 40.576 112.448 112.448 0 0 1 14.528 55.36v256z m-157.44-198.912a36.224 36.224 0 0 0-22.592-15.936 35.584 35.584 0 0 0-27.264 4.992l-125.76 82.56-124.992-82.432-3.712-2.112a35.52 35.52 0 0 0-26.624-2.24 36.352 36.352 0 0 0-20.864 17.088 37.568 37.568 0 0 0-3.648 27.008 36.928 36.928 0 0 0 15.552 22.208l144.512 95.296 4.096 2.304a35.584 35.584 0 0 0 35.136-2.304l145.344-95.424 3.456-2.496a37.504 37.504 0 0 0 7.424-48.512z" fill="#FFFFFF"></path></svg>
                <span>自定义提供商</span>
              </button>
            </div>
          </HxCard>

          <!-- GFW.NET 模式 -->
          <HxCard v-if="providerMode === 'gfw'">
            <template #header>
              <span>内置模型服务</span>
            </template>

            <!-- 认证方式选择 -->
            <div class="form-row">
              <label class="form-label">认证方式</label>
              <div class="gfw-auth-modes">
                <button
                  :class="['gfw-auth-mode', { active: gfwAuthMode === 'account' }]"
                  @click="switchGfwAuthMode('account')"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>账户登录</span>
                </button>
                <button
                  :class="['gfw-auth-mode', { active: gfwAuthMode === 'manual' }]"
                  @click="switchGfwAuthMode('manual')"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>手动输入 Key</span>
                </button>
              </div>
            </div>

            <!-- 账户登录模式 -->
            <template v-if="gfwAuthMode === 'account'">
              <div v-if="!isLoggedIn">
                <div class="form-row">
                  <label class="form-label">邮箱</label>
                  <HxInput v-model="gfwAccountEmail" type="email" placeholder="请输入邮箱" />
                </div>
                <div class="form-row">
                  <label class="form-label">密码</label>
                  <HxInput v-model="gfwAccountPassword" type="password" placeholder="请输入密码" @keydown.enter="handleGfwAccountLogin" />
                </div>
                <div class="form-actions">
                  <HxButton variant="primary" :loading="gfwAccountLoggingIn" @click="handleGfwAccountLogin">
                    {{ gfwAccountLoggingIn ? '登录中...' : '登录' }}
                  </HxButton>
                </div>
              </div>

              <div v-else>
                <!-- 用户信息行 -->
                <div class="form-row">
                  <div class="gfw-user-info">
                    <div class="gfw-user-avatar">
                      <IconUser :size="20" />
                    </div>
                    <div class="gfw-user-detail">
                      <div class="gfw-user-name">{{ user?.nickname || user?.email }}</div>
                      <div class="gfw-user-balance">{{ balance?.toFixed(2) }} G币</div>
                    </div>
                    <HxButton variant="ghost" size="sm" @click="gfwStore.logout(); gfwAccountEmail=''; gfwAccountPassword=''; gfwSelectedKeyId=''">登出</HxButton>
                  </div>
                </div>

                <!-- API Key 选择 -->
                <div class="form-row">
                  <div class="gfw-api-key-header">
                    <label class="form-label">API Key</label>
                    <div class="gfw-api-key-actions" v-if="isLoggedIn">
                      <button class="gfw-create-key-btn" @click="showGfwCreateKey = !showGfwCreateKey">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        创建新 Key
                      </button>
                      <HxButton variant="ghost" size="sm" :loading="gfwKeysLoading" @click="gfwStore.fetchApiKeys()">
                        {{ gfwKeysLoading ? '刷新中...' : '刷新' }}
                      </HxButton>
                    </div>
                  </div>
                  <div v-if="apiKeys.length > 0" class="gfw-key-list">
                    <button
                      v-for="key in apiKeys.slice(0, 5)"
                      :key="key.id"
                      :class="['gfw-key-item', { active: gfwSelectedKeyId === key.id }]"
                      @click="gfwSelectedKeyId = key.id; gfwApiKey = key.full_key || key.key_prefix + '***'"
                    >
                      <div class="gfw-key-info">
                        <span class="gfw-key-name">{{ key.name }}</span>
                        <span class="gfw-key-prefix">{{ key.key_prefix }}****</span>
                      </div>
                      <span class="gfw-key-quota">{{ key.gcoin_limit ? key.gcoin_limit + 'G' : '无限额' }}</span>
                    </button>
                  </div>
                  <p v-else class="form-hint">暂无 API Key，点击创建</p>
                  <div v-if="showGfwCreateKey" class="gfw-create-key-form">
                    <HxInput v-model="newKeyName" placeholder="Key 名称" style="max-width:200px;" />
                    <HxInput v-model.number="newKeyLimit" type="number" placeholder="限额(G币)" style="max-width:120px;margin-left:8px;" :min="1" :max="1000" :step="1" />
                    <HxButton variant="primary" size="sm" :loading="gfwCreatingKey" @click="createGfwKey" style="margin-left:8px;">创建</HxButton>
                  </div>
                </div>
              </div>
            </template>

            <!-- 手动输入 Key 模式 -->
            <template v-else>
              <div class="form-row">
                <label class="form-label">GFW API Key</label>
                <HxInput v-model="gfwApiKey" type="password" placeholder="gfw-..." />
                <p class="form-hint">在 gfw.net 控制台获取 API Key</p>
              </div>
            </template>

            <!-- 模型设置 — 仅在手动模式或已登录时显示 -->
            <template v-if="gfwAuthMode === 'manual' || isLoggedIn">
              <div class="form-row">
                <label class="form-label">
                  提供商
                  <HxButton variant="ghost" size="sm" :loading="gfwSyncing" @click="syncGfwModels" style="margin-left:8px;">
                    {{ gfwSyncing ? '同步中...' : '同步' }}
                  </HxButton>
                </label>
                <div v-if="gfwProviders.length > 0" class="provider-chips">
                  <button
                    :class="['chip', { active: !selectedProvider }]"
                    @click="selectedProvider = ''"
                  >全部</button>
                  <button
                    v-for="p in gfwProviders"
                    :key="p"
                    :class="['chip', { active: selectedProvider === p }]"
                    @click="selectedProvider = p"
                  >{{ p }} <span class="chip-count">{{ providerModelCount(p) }}</span></button>
                </div>
                <p v-else class="form-hint">点击「同步」获取提供商列表</p>
              </div>

              <div class="form-row">
                <label class="form-label">模型</label>
                <HxSelect
                  v-model="selectedModel"
                  v-if="filteredGfwModels.length > 0"
                  :options="gfwModelOptions"
                />
                <HxInput v-else v-model="selectedModel" placeholder="输入模型名称" />
              </div>

              <!-- 当前选中模型的详情 -->
              <div v-if="selectedGfwModel" class="model-detail">
                <div class="detail-row">
                  <span class="detail-label">provider</span>
                  <span class="detail-value">{{ selectedGfwModel.provider }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">model</span>
                  <span class="detail-value">{{ selectedGfwModel.model_code }}</span>
                </div>
                <div class="detail-row" v-if="selectedGfwModel.input_price">
                  <span class="detail-label">price</span>
                  <span class="detail-value">¥{{ selectedGfwModel.input_price }}/M in · ¥{{ selectedGfwModel.output_price }}/M out</span>
                </div>
                <div class="detail-row" v-if="selectedGfwModel.context_length">
                  <span class="detail-label">context</span>
                  <span class="detail-value">{{ formatContext(selectedGfwModel.context_length) }}</span>
                </div>
              </div>
            </template>
            <p v-else class="form-hint" style="text-align:center;padding:12px 0;">请先登录后再选择模型</p>
          </HxCard>

          <!-- 自定义提供商模式 -->
          <HxCard v-if="providerMode === 'custom'">
            <template #header>
              <span>自定义 API 提供商</span>
            </template>
            <!-- 上游选择 -->
            <div class="form-row">
              <label class="form-label">上游提供商</label>
              <div class="provider-chips">
                <button
                  v-for="preset in providerPresets"
                  :key="preset.name"
                  :class="['chip', { active: customUpstream === preset.name }]"
                  @click="selectUpstream(preset)"
                  :title="preset.name"
                >
                  <img class="chip-icon-img" :src="providerIconMap[preset.iconKey]" :alt="preset.name" />
                  <span class="chip-name">{{ preset.name }}</span>
                </button>
                <button
                  :class="['chip', { active: customUpstream === '__manual__' }]"
                  @click="customUpstream = '__manual__'"
                  title="手动输入自定义提供商"
                >
                  <span class="chip-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </span>
                  <span class="chip-name">手动</span>
                </button>
              </div>
            </div>

            <div class="form-row" v-if="customUpstream === '__manual__'">
              <label class="form-label">提供商名称</label>
              <HxInput v-model="customName" placeholder="my-provider" />
            </div>
            <div class="form-row">
              <label class="form-label">API Base URL</label>
              <HxInput v-model="customBaseUrl" placeholder="https://api.openai.com/v1" :disabled="customUpstream !== '__manual__' && !hasPlaceholder(customBaseUrl)" />
              <p v-if="hasPlaceholder(customBaseUrl)" class="form-hint" style="color: var(--color-warning); margin-top: 4px;">
                ⚠️ 请将 <code>{resource-name}</code> 替换为您的 Azure OpenAI 资源名称，例如：<code>https://my-resource.openai.azure.com/openai</code>
              </p>
            </div>
            <div class="form-row">
              <label class="form-label">API Key</label>
              <div style="display: flex; gap: 8px;">
                <HxInput v-model="customApiKey" type="password" placeholder="sk-..." style="flex: 1;" />
                <HxButton variant="secondary" :loading="testing" @click="testConnection" style="white-space: nowrap;">
                  {{ testing ? '测试中...' : '测试连接' }}
                </HxButton>
              </div>
            </div>

            <!-- 测试结果显示在下方 -->
            <div v-if="testResult" style="margin-top: 8px;">
              <span :class="['test-result', testResult.ok ? 'success' : 'error']" style="display: block; text-align: center;">
                {{ testResult.message }}
              </span>
            </div>

            <!-- 测试通过后才显示模型和上下文设置 -->
            <template v-if="apiVerified">
              <div class="form-row" style="margin-top: 16px; border-top: 1px solid var(--color-border); padding-top: 16px;">
                <label class="form-label">
                  模型
                  <HxButton variant="ghost" size="sm" :loading="upstreamModelsSyncing" @click="fetchUpstreamModels" style="margin-left:8px;">
                    {{ upstreamModelsSyncing ? '获取中...' : '刷新' }}
                  </HxButton>
                </label>
                <HxSelect 
                  v-if="upstreamModels.length > 0" 
                  v-model="customModel" 
                  :options="upstreamModelOptions"
                  @change="onModelChange" 
                />
                <HxInput v-else v-model="customModel" placeholder="输入模型名称" />
                <p v-if="upstreamModelsError" class="form-hint" style="color: var(--color-error);">{{ upstreamModelsError }}</p>
                <p v-else-if="upstreamModels.length > 0" class="form-hint" style="color: var(--color-success); margin-top: 4px;">✓ 已获取 {{ upstreamModels.length }} 个模型，请选择</p>
                <p v-else-if="apiVerified" class="form-hint" style="color: var(--color-primary); margin-top: 4px;">✓ API 验证成功，已加载预设模型</p>
              </div>
              <div class="form-row">
                <label class="form-label">上下文长度</label>
                <HxInput v-model.number="contextLength" type="number" style="max-width: 200px;" :min="512" :max="128000" :step="512" />
                <p class="form-hint">根据所选模型自动设置，可手动调整</p>
              </div>
            </template>
          </HxCard>

          <div class="form-actions" style="margin-top: 20px;">
            <HxButton variant="primary" @click="saveModelSettings">保存设置</HxButton>
            <span v-if="saveSuccess" class="save-feedback">设置已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>

        <!-- Usage section -->
        <div v-if="activeSection === 'usage'" class="content-section">
          <h2 class="section-title">用量统计</h2>

          <!-- Summary cards -->
          <div class="usage-summary">
            <div class="usage-card">
              <div class="usage-card-label">总请求</div>
              <div class="usage-card-value">{{ usageTotal.requests.toLocaleString() }}</div>
            </div>
            <div class="usage-card">
              <div class="usage-card-label">输入 Tokens</div>
              <div class="usage-card-value">{{ formatNum(usageTotal.inputTokens) }}</div>
            </div>
            <div class="usage-card">
              <div class="usage-card-label">输出 Tokens</div>
              <div class="usage-card-value">{{ formatNum(usageTotal.outputTokens) }}</div>
            </div>
          </div>

          <!-- Daily chart: bar chart -->
          <HxCard style="margin-top: 16px;">
            <template #header>
              <span>Tokens 用量趋势（近 {{ dailyUsage.length }} 天）</span>
            </template>
            <div class="bar-chart">
              <div class="bar-chart__y-labels">
                <span v-for="n in 5" :key="n" class="bar-chart__y-label">{{ yTick(maxTokens, n, 5) }}</span>
              </div>
              <div class="bar-chart__grid">
                <div v-for="n in 5" :key="n" class="bar-chart__grid-line"></div>
              </div>
              <div class="bar-chart__bars">
                <div v-for="day in dailyUsage" :key="day.date" class="bar-group">
                  <div class="bar-col">
                    <div class="bar bar--input" :style="{ height: barH(day.input_tokens, maxTokens) + '%' }">
                      <span class="bar-label">{{ shortNum(day.input_tokens) }}</span>
                    </div>
                  </div>
                  <div class="bar-col">
                    <div class="bar bar--output" :style="{ height: barH(day.output_tokens, maxTokens) + '%' }">
                      <span class="bar-label">{{ shortNum(day.output_tokens) }}</span>
                    </div>
                  </div>
                  <div class="bar-date">{{ formatDate(day.date) }}</div>
                </div>
              </div>
            </div>
            <div class="bar-legend">
              <span class="bar-legend__item"><span class="bar-legend__dot bar-legend__dot--input"></span> 输入</span>
              <span class="bar-legend__item"><span class="bar-legend__dot bar-legend__dot--output"></span> 输出</span>
            </div>
          </HxCard>

          <!-- Per-model breakdown from chat history -->
          <HxCard style="margin-top: 16px;">
            <template #header>
              <span>各模型用量</span>
            </template>
            <table class="data-table">
              <thead>
                <tr>
                  <th>模型</th>
                  <th>请求数</th>
                  <th>输入 Tokens</th>
                  <th>输出 Tokens</th>
                  <th>合计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in modelStats" :key="m.model">
                  <td class="cell-mono">{{ m.model }}</td>
                  <td>{{ m.requests }}</td>
                  <td>{{ formatNum(m.inputTokens) }}</td>
                  <td>{{ formatNum(m.outputTokens) }}</td>
                  <td class="cell-cost">{{ formatNum(m.total) }}</td>
                </tr>
                <tr v-if="modelStats.length === 0">
                  <td colspan="5" class="empty-cell">暂无对话记录</td>
                </tr>
              </tbody>
            </table>
          </HxCard>

          <!-- Recent requests log -->
          <HxCard style="margin-top: 16px;">
            <template #header>
              <div class="card-header-row">
                <span>近期请求记录</span>
                <span class="page-info">共 {{ requestLog.length }} 条，第 {{ reqLogPage }}/{{ reqLogTotalPages }} 页</span>
              </div>
            </template>
            <table class="data-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>模型</th>
                  <th>角色</th>
                  <th>内容摘要</th>
                  <th>Tokens</th>
                  <th>耗时</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in paginatedRequestLog" :key="r.id">
                  <td>{{ r.time }}</td>
                  <td class="cell-mono">{{ r.model || '-' }}</td>
                  <td>
                    <span :class="['role-tag', r.role]">{{ r.role === 'user' ? '提问' : '回复' }}</span>
                  </td>
                  <td class="cell-preview">{{ r.preview }}</td>
                  <td>{{ r.tokens.toLocaleString() }}</td>
                  <td>{{ r.duration }}</td>
                </tr>
                <tr v-if="paginatedRequestLog.length === 0">
                  <td colspan="6" class="empty-cell">暂无请求记录</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination" v-if="reqLogTotalPages > 1">
              <button class="page-btn" :disabled="reqLogPage === 1" @click="reqLogPage--">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <template v-for="p in pageNumbers" :key="p">
                <button v-if="typeof p === 'number'" class="page-btn" :class="{ active: reqLogPage === p }" @click="reqLogPage = p">{{ p }}</button>
                <span v-else class="page-ellipsis">{{ p }}</span>
              </template>
              <button class="page-btn" :disabled="reqLogPage === reqLogTotalPages" @click="reqLogPage++">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </HxCard>
        </div>

        <!-- Recharge section -->
        <div v-if="activeSection === 'recharge'" class="content-section">
          <h2 class="section-title">充值</h2>

          <div class="packages-grid">
            <div
              v-for="pkg in rechargePackages"
              :key="pkg.id"
              :class="['package-card', { recommended: pkg.badge }]"
            >
              <span v-if="pkg.badge" class="package-badge">{{ pkg.badge }}</span>
              <h3 class="package-name">{{ pkg.name }}</h3>
              <p class="package-desc">{{ pkg.description }}</p>
              <div class="package-price">{{ pkg.price }}</div>
              <div class="package-amount">{{ pkg.gcoin_amount }} G币</div>
              <div v-if="pkg.bonus_gcoin > 0" class="package-bonus">+{{ pkg.bonus_gcoin }} 赠送</div>
              <HxButton variant="primary" class="package-btn">立即充值</HxButton>
            </div>
          </div>
        </div>

        <!-- ===== Agent 设置 ===== -->
        <div v-if="activeSection === 'agent'" class="content-section">
          <h2 class="section-title">Agent 设置</h2>

          <!-- Hermes Agent 状态卡片 -->
          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>Hermes Agent 状态</span>
            </template>
            <div v-if="appStore.connectionState === 'disconnected'" class="hermes-status-card disconnected">
              <div class="hermes-status-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="hermes-status-info">
                <div class="hermes-status-title">后端未连接</div>
                <div class="hermes-status-desc">Hermes Agent 服务不可用，请检查后端是否启动</div>
              </div>
            </div>
            <div v-else-if="appStore.hermesStatus" class="hermes-status-card">
              <div class="hermes-status-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="hermes-status-info">
                <div class="hermes-status-title">
                  <span class="status-dot connected"></span>
                  {{ appStore.hermesStatus.available ? '已集成' : '未集成' }}
                </div>
                <div class="hermes-status-grid">
                  <div class="hermes-status-row">
                    <span class="hermes-label">版本</span>
                    <span class="hermes-value mono">{{ appStore.hermesStatus.version || '未知' }}</span>
                  </div>
                  <div class="hermes-status-row">
                    <span class="hermes-label">模式</span>
                    <span class="hermes-value">{{ sourceLabel(appStore.hermesStatus.source) }}</span>
                  </div>
                  <div class="hermes-status-row">
                    <span class="hermes-label">路径</span>
                    <span class="hermes-value mono">{{ appStore.hermesStatus.path || 'N/A' }}</span>
                  </div>
                  <div class="hermes-status-row">
                    <span class="hermes-label">运行时间</span>
                    <span class="hermes-value">{{ appStore.uptimeText }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="hermes-status-card loading">
              <div class="hermes-status-icon">
                <div class="mini-spinner"></div>
              </div>
              <div class="hermes-status-info">
                <div class="hermes-status-title">检测中...</div>
              </div>
            </div>
          </HxCard>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>对话行为</span>
            </template>
            <div class="form-row">
              <label class="form-label">最大轮次</label>
              <HxInput v-model.number="agentSettings.maxTurns" type="number" style="max-width: 120px;" />
              <p class="form-hint">Agent 单次对话的最大工具调用轮次 (默认 90)</p>
            </div>
            <div class="form-row">
              <label class="form-label">系统提示词</label>
              <HxTextarea v-model="agentSettings.systemPrompt" :rows="4" placeholder="自定义系统提示词（留空使用默认）"></HxTextarea>
              <p class="form-hint">追加到 Agent 默认系统提示词之后</p>
            </div>
          </HxCard>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>上下文压缩</span>
            </template>
            <div class="toolset-grid">
              <label class="toolset-item">
                <span class="toolset-label">最大回合数</span>
                <HxInput v-model.number="agentSettings.maxTurns" type="number" :min="1" :max="50" :step="1" />
              </label>
              <label class="toolset-item">
                <span class="toolset-label">压缩阈值</span>
                <HxInput v-model.number="agentSettings.compressionThreshold" type="number" step="0.05" min="0.1" max="0.95" :showNumberControls="true" />
              </label>
              <label class="toolset-item">
                <span class="toolset-label">压缩目标</span>
                <HxInput v-model.number="agentSettings.compressionTarget" type="number" step="0.05" min="0.05" max="0.5" :showNumberControls="true" />
              </label>
            </div>
          </HxCard>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>持久记忆</span>
            </template>
            <div class="toolset-grid">
              <label class="toolset-item">
                <span class="toolset-label">记忆系统</span>
                <HxToggle v-model="agentSettings.memoryEnabled" :label="agentSettings.memoryEnabled ? '已启用' : '已禁用'" />
              </label>
              <label class="toolset-item">
                <span class="toolset-label">用户画像</span>
                <HxToggle v-model="agentSettings.userProfileEnabled" :label="agentSettings.userProfileEnabled ? '已启用' : '已禁用'" />
              </label>
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveAgentSettings">保存设置</HxButton>
            <span v-if="agentSaveOk" class="save-feedback">已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>

        <!-- ===== 终端设置 ===== -->
        <div v-if="activeSection === 'terminal'" class="content-section">
          <h2 class="section-title">终端设置</h2>

          <HxCard style="margin-bottom: 16px;">
            <div class="form-row">
              <label class="form-label">终端后端</label>
              <HxSelect v-model="terminalSettings.backend" :options="backendOptions" style="max-width: 200px;" />
              <p class="form-hint">命令执行环境</p>
            </div>
            <div class="form-row">
              <label class="form-label">工作目录</label>
              <HxInput v-model="terminalSettings.cwd" placeholder="留空使用当前目录" />
              <p class="form-hint">Agent 的默认工作目录</p>
            </div>
            <div class="form-row">
              <label class="form-label">命令超时 (秒)</label>
              <HxInput v-model.number="terminalSettings.timeout" type="number" style="max-width: 120px;" />
              <p class="form-hint">前台命令最大执行时间 (默认 180)</p>
            </div>
            <div class="form-row">
              <label class="form-label">命令审批</label>
              <HxSelect v-model="terminalSettings.approvalMode" :options="approvalModeOptions" style="max-width: 200px;" />
              <p class="form-hint">危险命令的审批方式</p>
            </div>
          </HxCard>

          <HxCard v-if="terminalSettings.backend === 'ssh'" style="margin-bottom: 16px;">
            <template #header>
              <span>远程连接配置</span>
            </template>
            <div class="form-row">
              <label class="form-label">主机</label>
              <HxInput v-model="terminalSettings.sshHost" placeholder="user@host" />
            </div>
            <div class="form-row">
              <label class="form-label">端口</label>
              <HxInput v-model.number="terminalSettings.sshPort" type="number" style="max-width: 120px;" />
            </div>
            <div class="form-row">
              <label class="form-label">密钥路径</label>
              <HxInput v-model="terminalSettings.sshKey" placeholder="~/.ssh/id_rsa" />
            </div>
          </HxCard>

          <HxCard v-if="terminalSettings.backend === 'docker'" style="margin-bottom: 16px;">
            <template #header>
              <span>容器配置</span>
            </template>
            <div class="form-row">
              <label class="form-label">镜像</label>
              <HxInput v-model="terminalSettings.dockerImage" placeholder="ubuntu:22.04" />
            </div>
            <div class="form-row">
              <label class="form-label">挂载目录</label>
              <HxInput v-model="terminalSettings.dockerMount" placeholder="/home/user/project" />
            </div>
          </HxCard>

          <div class="form-actions">
            <HxButton variant="primary" @click="saveTerminalSettings">保存设置</HxButton>
            <span v-if="terminalSaveOk" class="save-feedback">已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>

        <!-- ===== 显示设置 ===== -->
        <div v-if="activeSection === 'display'" class="content-section">
          <h2 class="section-title">显示设置</h2>

          <HxCard>
            <div class="form-row">
              <label class="form-label">工具调用详情</label>
              <HxToggle v-model="displaySettings.showToolProgress" :label="displaySettings.showToolProgress ? '显示' : '隐藏'" />
              <p class="form-hint">是否显示工具调用的输入参数和输出结果</p>
            </div>
            <div class="form-row">
              <label class="form-label">推理过程</label>
              <HxSelect v-model="displaySettings.showReasoning" :options="showReasoningOptions" style="max-width: 200px;" />
              <p class="form-hint">模型的 thinking/reasoning 内容</p>
            </div>
            <div class="form-row">
              <label class="form-label">显示费用</label>
              <HxToggle v-model="displaySettings.showCost" :label="displaySettings.showCost ? '显示' : '隐藏'" />
              <p class="form-hint">在消息底部显示 token 用量和费用</p>
            </div>
            <div class="form-row">
              <label class="form-label">Markdown 渲染</label>
              <HxToggle v-model="displaySettings.renderMarkdown" :label="displaySettings.renderMarkdown ? '已启用' : '纯文本'" />
            </div>
            <div class="form-row">
              <label class="form-label">代码高亮</label>
              <HxToggle v-model="displaySettings.syntaxHighlight" :label="displaySettings.syntaxHighlight ? '已启用' : '已禁用'" />
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveDisplaySettings">保存设置</HxButton>
            <span v-if="displaySaveOk" class="save-feedback">已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>

        <!-- ===== 语音设置 ===== -->
        <div v-if="activeSection === 'voice'" class="content-section">
          <h2 class="section-title">语音设置</h2>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>STT · 语音转文字</span>
            </template>
            <div class="form-row">
              <label class="form-label">启用 STT</label>
              <HxToggle v-model="voiceSettings.sttEnabled" :label="voiceSettings.sttEnabled ? '已启用' : '已禁用'" />
            </div>
            <div class="form-row">
              <label class="form-label">STT 提供商</label>
              <HxSelect v-model="voiceSettings.sttProvider" :options="sttProviderOptions" style="max-width: 200px;" />
            </div>
            <div v-if="voiceSettings.sttProvider === 'local'" class="form-row">
              <label class="form-label">Whisper 模型</label>
              <HxSelect v-model="voiceSettings.whisperModel" :options="whisperModelOptions" style="max-width: 200px;" />
            </div>
          </HxCard>

          <HxCard>
            <template #header>
              <span>TTS · 文字转语音</span>
            </template>
            <div class="form-row">
              <label class="form-label">TTS 提供商</label>
              <HxSelect v-model="voiceSettings.ttsProvider" :options="ttsProviderOptions" style="max-width: 200px;" />
            </div>
            <div v-if="voiceSettings.ttsProvider !== 'edge'" class="form-row">
              <label class="form-label">TTS API Key</label>
              <HxInput v-model="voiceSettings.ttsApiKey" type="password" placeholder="API Key" />
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveVoiceSettings">保存设置</HxButton>
            <span v-if="voiceSaveOk" class="save-feedback">已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>

        <!-- ===== 安全设置 ===== -->
        <div v-if="activeSection === 'security'" class="content-section">
          <h2 class="section-title">安全设置</h2>

          <HxCard style="margin-bottom: 16px;">
            <div class="form-row">
              <label class="form-label">密钥脱敏</label>
              <HxToggle v-model="securitySettings.redactSecrets" :label="securitySettings.redactSecrets ? '已启用' : '已禁用'" />
              <p class="form-hint">自动遮盖工具输出中的 API Key、Token 等敏感信息</p>
            </div>
            <div class="form-row">
              <label class="form-label">PII 脱敏</label>
              <HxToggle v-model="securitySettings.redactPii" :label="securitySettings.redactPii ? '已启用' : '已禁用'" />
              <p class="form-hint">对用户 ID、手机号等个人信息进行哈希处理</p>
            </div>
          </HxCard>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <span>网站 · 访问限制</span>
            </template>
            <div class="form-row">
              <label class="form-label">网站黑名单</label>
              <HxTextarea v-model="securitySettings.blocklist" :rows="3" placeholder="每行一个域名，如：&#10;example.com&#10;malware.test"></HxTextarea>
              <p class="form-hint">Agent 禁止访问的域名列表</p>
            </div>
          </HxCard>

          <HxCard>
            <template #header>
              <span>工具 · 工具权限</span>
            </template>
            <div class="toolset-grid">
              <label v-for="ts in toolsetList" :key="ts.id" class="toolset-item">
                <span class="toolset-label">{{ ts.label }}</span>
                <HxToggle v-model="ts.enabled" :label="ts.enabled ? '启用' : '禁用'" />
              </label>
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveSecuritySettings">保存设置</HxButton>
            <span v-if="securitySaveOk" class="save-feedback">已保存</span>
            <span v-if="saveState === 'dirty'" class="save-feedback save-dirty">
              <span class="save-dot blue"></span> 已编辑未保存
            </span>
            <span v-else-if="saveState === 'saving'" class="save-feedback save-saving">
              <span class="save-dot green"></span> 正在自动保存
            </span>
            <span v-else-if="saveState === 'saved'" class="save-feedback save-saved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              已保存
            </span>
          </div>
        </div>
      </div>
      <!-- Context menu (inside root to avoid fragment breaking transition) -->
      <div v-if="settingsCtx.show" class="ctx-menu" :style="{ top: settingsCtx.y + 'px', left: settingsCtx.x + 'px' }" @click.stop @contextmenu.prevent>
        <button v-if="settingsCtx.hasSelection" @click="settingsCtxCopy" class="ctx-item">复制</button>
        <button v-if="settingsCtx.hasSelection" @click="settingsCtxCut" class="ctx-item">剪切</button>
        <button v-if="settingsCtx.hasContent && !settingsCtx.hasSelection" @click="settingsCtxSelectAll" class="ctx-item">全选</button>
        <button @click="settingsCtxPaste" class="ctx-item">粘贴</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useGfwStore } from '../stores/gfw'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'
import { hermesConfigSet, hermesToolsList, hermesToolsEnable, hermesToolsDisable, hermesMemoryGet, hermesMemoryEdit } from '../api'
import IconUser from '../components/icons/IconUser.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import { HxButton, HxInput, HxTextarea, HxSelect, HxToggle, HxCard, HxBadge, HxModal } from '../components/ui'
import { useToast } from '../composables/useToast'

const toast = useToast()

// Context menu
const settingsCtx = reactive({ show: false, x: 0, y: 0, hasContent: false, hasSelection: false, target: null as HTMLInputElement | HTMLTextAreaElement | null })
function onSettingsContextMenu(e: MouseEvent) {
  let target = e.target as HTMLElement
  // 尝试从目标元素或其父容器中找到底层 input/textarea
  let inp = target.closest('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null
  if (!inp) {
    const wrapper = target.closest('.hixns-input, .hixns-textarea-inner') as HTMLElement | null
    if (wrapper) inp = wrapper.querySelector('input, textarea')
  }
  if (!inp) { e.preventDefault(); return }
  e.preventDefault()
  settingsCtx.target = inp
  settingsCtx.hasContent = !!inp.value.length
  settingsCtx.hasSelection = typeof inp.selectionStart === 'number' && inp.selectionStart !== inp.selectionEnd
  settingsCtx.x = e.clientX
  settingsCtx.y = e.clientY
  settingsCtx.show = true
  nextTick(() => { document.addEventListener('click', () => { settingsCtx.show = false }, { once: true }) })
}
function settingsCtxCopy() { try { document.execCommand('copy') } catch {}; settingsCtx.show = false }
function settingsCtxCut() { try { document.execCommand('cut') } catch {}; settingsCtx.show = false }
function settingsCtxPaste() {
  const inp = settingsCtx.target
  if (!inp) return
  settingsCtx.show = false
  if (navigator.clipboard?.readText) {
    navigator.clipboard.readText().then(text => {
      if (text) {
        inp.focus()
        const s = inp.selectionStart || 0, e = inp.selectionEnd || 0
        const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inp), 'value')?.set
        if (setter) { setter.call(inp, inp.value.substring(0, s) + text + inp.value.substring(e)) }
        inp.selectionStart = inp.selectionEnd = s + text.length
        inp.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }).catch(() => {})
  }
}
function settingsCtxSelectAll() { settingsCtx.target?.select(); settingsCtx.show = false }

const gfwStore = useGfwStore()
const chatStore = useChatStore()
const appStore = useAppStore()

function sourceLabel(source: string): string {
  const map: Record<string, string> = { bundled: '内嵌独立', system: '系统安装', user: '用户安装', '': '未检测到' }
  return map[source] || source
}

const { isLoggedIn, user, balance, models, apiKeys, dailyUsage, rechargePackages, loading } = storeToRefs(gfwStore)
const { selectedModel, providerMode: storeProviderMode, customProvider } = storeToRefs(chatStore)

const email = ref('')
const password = ref('')
const contextLength = ref(128000)
const streaming = ref(true)
const showCreateKey = ref(false)
const newKeyName = ref('')
const newKeyLimit = ref(50)
const userInfo = ref<{ group_name: string } | null>(null)
const activeSection = ref('model')

// HxSelect 选项定义
const backendOptions = [
  { value: 'local', label: '本地 (local)' },
  { value: 'docker', label: 'Docker' },
  { value: 'ssh', label: 'SSH 远程' },
]

const approvalModeOptions = [
  { value: 'manual', label: '手动审批 (manual)' },
  { value: 'smart', label: '智能审批 (smart)' },
  { value: 'off', label: '关闭审批 (YOLO)' },
]

const showReasoningOptions = [
  { value: 'none', label: '不显示' },
  { value: 'show', label: '展开显示' },
  { value: 'hide', label: '折叠显示' },
]

const sttProviderOptions = [
  { value: 'local', label: '本地 Whisper (免费)' },
  { value: 'groq', label: 'Groq Whisper' },
  { value: 'openai', label: 'OpenAI Whisper' },
  { value: 'mistral', label: 'Mistral Voxtral' },
]

const whisperModelOptions = [
  { value: 'tiny', label: 'tiny (最快)' },
  { value: 'base', label: 'base (推荐)' },
  { value: 'small', label: 'small' },
  { value: 'medium', label: 'medium' },
  { value: 'large-v3', label: 'large-v3 (最准)' },
]

const ttsProviderOptions = [
  { value: 'edge', label: 'Edge TTS (免费)' },
  { value: 'elevenlabs', label: 'ElevenLabs' },
  { value: 'openai', label: 'OpenAI TTS' },
  { value: 'minimax', label: 'MiniMax' },
  { value: 'mistral', label: 'Mistral' },
]

// 设置导航搜索
const searchQuery = ref('')
const navItems = [
  { key: 'model', label: '模型设置', keywords: 'API 提供商 模型 provider 同步 连接测试 自定义 GFW', icon: 'IconSettings' },
  { key: 'agent', label: 'Agent', keywords: '轮次 系统提示 上下文压缩 记忆 用户档案 max turns', icon: '' },
  { key: 'terminal', label: '终端', keywords: '后端 超时 审批模式 SSH Docker 工作目录 timeout', icon: '' },
  { key: 'display', label: '显示', keywords: '工具进度 推理过程 费用 markdown 代码高亮 语法', icon: '' },
  { key: 'voice', label: '语音', keywords: 'STT TTS 语音识别 语音合成 Whisper Edge ElevenLabs', icon: '' },
  { key: 'security', label: '安全', keywords: '密钥 PII 脱敏 屏蔽 站点黑名单 工具开关 redaction', icon: '' },
  { key: 'usage', label: '用量统计', keywords: '统计 日报 消耗 调用次数 token 图表 模型', icon: '' },
]
const filteredNavItems = computed(() => {
  if (!searchQuery.value.trim()) return navItems
  const q = searchQuery.value.toLowerCase()
  return navItems.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.keywords.toLowerCase().includes(q) ||
    item.key.toLowerCase().includes(q)
  )
})
function highlightMatch(label: string): string {
  if (!searchQuery.value.trim()) return label
  const q = searchQuery.value.trim()
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return label.replace(re, '<mark style="background:var(--color-primary);color:#fff;border-radius:2px;padding:0 2px;">$1</mark>')
}

// 自定义 provider
const providerMode = ref(storeProviderMode.value)
const customName = ref(customProvider.value.name)
const customBaseUrl = ref(customProvider.value.baseUrl)
const customApiKey = ref(customProvider.value.apiKey)
const customModel = ref(customProvider.value.model)
const testing = ref(false)
const testResult = ref<{ ok: boolean; message: string } | null>(null)
const saveSuccess = ref(false)
const apiVerified = ref(false)  // API Key 验证通过标志

// 模型上下文长度映射（根据模型名称自动设置）
const modelContextMap: Record<string, number> = {
  // OpenAI
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4': 128000,
  'gpt-3.5-turbo': 16385,
  'o1-preview': 128000,
  'o1-mini': 128000,
  // Anthropic
  'claude-sonnet-4': 200000,
  'claude-3-5-sonnet': 200000,
  'claude-3-opus': 200000,
  'claude-3-haiku': 200000,
  // Moonshot / Kimi
  'moonshot-v1-8k': 8192,
  'moonshot-v1-32k': 32768,
  'moonshot-v1-128k': 128000,
  'moonshot-v1-auto': 128000,
  // DeepSeek
  'deepseek-chat': 128000,
  'deepseek-coder': 128000,
  // Google Gemini
  'gemini-2.5-pro': 1048576,
  'gemini-2.0-flash': 1048576,
  'gemini-1.5-pro': 2097152,
  'gemini-1.5-flash': 1048576,
  // Qwen
  'qwen-plus': 131072,
  'qwen-max': 32768,
  'qwen-turbo': 131072,
  'qwen-long': 1000000,
  // Groq
  'llama-3.3-70b-versatile': 128000,
  'llama-3.1-8b-instant': 128000,
  'mixtral-8x7b-32768': 32768,
  'gemma2-9b-it': 8192,
  // xAI / Grok
  'grok-3': 128000,
  'grok-2': 128000,
  // GLM / Z.AI
  'glm-4-plus': 128000,
  'glm-4-air': 128000,
  'glm-4-flash': 128000,
  'glm-4': 128000,
  // Mistral
  'mistral-large': 128000,
  'mistral-medium': 128000,
  'mistral-small': 128000,
  'open-mistral-7b': 32768,
  // Cohere
  'command-r-plus': 128000,
  'command-r': 128000,
  'command': 4096,
  // MiniMax
  'minimax-m1': 256000,
  'abab6.5s-chat': 256000,
  'abab6.5g-chat': 256000,
  // NVIDIA
  'llama-3.1-8b-instruct': 128000,
  'llama-3.1-70b-instruct': 128000,
  // IBM Watsonx
  'llama-3-8b-instruct': 128000,
  'llama-3-70b-instruct': 128000,
  // Together AI
  'Llama-3.3-70B-Instruct-Turbo': 128000,
  // Cerebras
  'llama3.1-8b': 128000,
  'llama3.1-70b': 128000,
  // FriendliAI
  'llama-3-8b': 128000,
  'llama-3-70b': 128000,
  // SambaNova
  'Meta-Llama-3.1-8B-Instruct': 128000,
  'Meta-Llama-3.1-70B-Instruct': 128000,
  'Meta-Llama-3.1-405B-Instruct': 128000,
}
// 根据模型名称自动设置上下文长度
function onModelChange() {
  const model = customModel.value
  for (const [key, context] of Object.entries(modelContextMap)) {
    if (model.includes(key)) {
      contextLength.value = context
      return
    }
  }
  // 默认值
  contextLength.value = 128000
}

// 当用户填写 API Key 后，不自动获取，等待用户点击测试按钮

// GFW 模型列表
const gfwApiKey = ref(localStorage.getItem('gfw_api_key') || '')
const gfwModels = ref<any[]>([])
const gfwSyncing = ref(false)
const selectedProvider = ref('')

// GFW 认证方式
const gfwAuthMode = ref<'account' | 'manual'>((localStorage.getItem('gfw_auth_mode') as 'account' | 'manual') || 'account')
const gfwAccountEmail = ref(localStorage.getItem('gfw_saved_email') || '')
const gfwAccountPassword = ref('')
const gfwAccountLoggingIn = ref(false)
const gfwKeysLoading = ref(false)
const gfwSelectedKeyId = ref('')
const showGfwCreateKey = ref(false)
const gfwCreatingKey = ref(false)

function switchGfwAuthMode(mode: 'account' | 'manual') {
  gfwAuthMode.value = mode
  localStorage.setItem('gfw_auth_mode', mode)
}

const selectedGfwModel = computed(() => {
  return gfwModels.value.find(m => m.model_code === selectedModel.value) || null
})

// 从模型列表提取去重的提供商列表
const gfwProviders = computed(() => {
  const set = new Set<string>()
  gfwModels.value.forEach(m => { if (m.provider) set.add(m.provider) })
  return Array.from(set).sort()
})

// 按选中的提供商筛选模型
const filteredGfwModels = computed(() => {
  if (!selectedProvider.value) return gfwModels.value
  return gfwModels.value.filter(m => m.provider === selectedProvider.value)
})

// GFW 模型选项（用于 HxSelect）
const gfwModelOptions = computed(() => {
  return filteredGfwModels.value.map(m => ({
    value: m.model_code,
    label: `${m.model_name}${!selectedProvider.value ? ' (' + m.provider + ')' : ''} ${m.input_price ? '¥' + m.input_price + '/M' : ''}`,
  }))
})

// 统计每个提供商的模型数量
function providerModelCount(provider: string): number {
  return gfwModels.value.filter(m => m.provider === provider).length
}

async function syncGfwModels() {
  gfwSyncing.value = true
  try {
    const isDev = import.meta.env?.DEV ?? false
    const base = isDev ? '/proxy/gfw/api/v1' : 'https://api.gfw.net/api/v1'
    const r = await fetch(`${base}/models`)
    const body = await r.json()
    gfwModels.value = (body.data?.models || []).sort((a: any, b: any) => {
      // featured 优先，然后按 provider 分组
      if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1
      return (a.provider || '').localeCompare(b.provider || '')
    })
    localStorage.setItem('gfw_models_cache', JSON.stringify(gfwModels.value))
  } catch (e) {
    console.error('同步模型失败:', e)
  } finally {
    gfwSyncing.value = false
  }
}

// 从缓存加载 GFW 模型列表
try {
  const cached = localStorage.getItem('gfw_models_cache')
  if (cached) gfwModels.value = JSON.parse(cached)
} catch { /* ignore */ }

// 提供商图标映射 (本地图片)
const providerIconMap: Record<string, string> = {
  'OpenAI': '/src/assets/provider-icons/openai.png',
  'Anthropic': '/src/assets/provider-icons/anthropic.png',
  'DeepSeek': '/src/assets/provider-icons/deepseek.png',
  'Google Gemini': '/src/assets/provider-icons/google.png',
  'xAI / Grok': '/src/assets/provider-icons/xai.png',
  'OpenRouter': '/src/assets/provider-icons/openrouter.png',
  'Qwen (DashScope)': '/src/assets/provider-icons/alibabacloud.png',
  'Groq': '/src/assets/provider-icons/groq.png',
  'Hugging Face': '/src/assets/provider-icons/huggingface.png',
  'MiniMax': '/src/assets/provider-icons/minimax.png',
  'Kimi / Moonshot': '/src/assets/provider-icons/moonshot.png',
  'Z.AI / GLM': '/src/assets/provider-icons/zhipu.png',
  'Ollama (本地)': '/src/assets/provider-icons/ollama.png',
  'vLLM': '/src/assets/provider-icons/vllm.png',
  'LM Studio': '/src/assets/provider-icons/lmstudio.png',
  'Together AI': '/src/assets/provider-icons/together.png',
  'Anyscale': '/src/assets/provider-icons/anyscale.png',
  'Perplexity': '/src/assets/provider-icons/perplexity.png',
  'Mistral AI': '/src/assets/provider-icons/mistral.png',
  'Cohere': '/src/assets/provider-icons/cohere.png',
  'Fireworks AI': '/src/assets/provider-icons/fireworks.png',
  'Replicate': '/src/assets/provider-icons/replicate.png',
  'NVIDIA NIM': '/src/assets/provider-icons/nvidia.png',
  'IBM Watsonx': '/src/assets/provider-icons/ibm.png',
  'Azure OpenAI': '/src/assets/provider-icons/azure.png',
  'Amazon Bedrock': '/src/assets/provider-icons/bedrock.png',
  'Cloudflare AI': '/src/assets/provider-icons/cloudflare.png',
  'Cerebras': '/src/assets/provider-icons/cerebras.png',
  'FriendliAI': '/src/assets/provider-icons/friendli.png',
  'Novita AI': '/src/assets/provider-icons/novita.png',
  'SambaNova': '/src/assets/provider-icons/sambanova.png',
}

// 预设提供商（对齐 Hermes Agent 支持的上游列表）
const providerPresets = [
  {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    iconKey: 'OpenAI',
    defaultModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'o1-preview', 'o1-mini']
  },
  {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
    iconKey: 'Anthropic',
    defaultModels: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307']
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    iconKey: 'DeepSeek',
    defaultModels: ['deepseek-chat', 'deepseek-coder', 'deepseek-v2-chat', 'deepseek-v2-instruct', 'deepseek-v3', 'deepseek-v4-flash']
  },
  {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.5-pro',
    iconKey: 'Google Gemini',
    defaultModels: ['gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash']
  },
  {
    name: 'xAI / Grok',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-3',
    iconKey: 'xAI / Grok',
    defaultModels: ['grok-3', 'grok-2', 'grok-2-latest']
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o',
    iconKey: 'OpenRouter',
    defaultModels: []  // OpenRouter 模型太多，不预设
  },
  {
    name: 'Qwen (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    iconKey: 'Qwen (DashScope)',
    defaultModels: ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen-long', 'qwen-vl-max']
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    iconKey: 'Groq',
    defaultModels: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it']
  },
  {
    name: 'Hugging Face',
    baseUrl: 'https://api-inference.huggingface.co/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    iconKey: 'Hugging Face',
    defaultModels: []  // 模型太多，不预设
  },
  {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'MiniMax-M1',
    iconKey: 'MiniMax',
    defaultModels: ['MiniMax-M1', 'abab6.5s-chat', 'abab6.5g-chat']
  },
  {
    name: 'Kimi / Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-auto',
    iconKey: 'Kimi / Moonshot',
    defaultModels: ['moonshot-v1-auto', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
  },
  {
    name: 'Z.AI / GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-plus',
    iconKey: 'Z.AI / GLM',
    defaultModels: ['glm-4-plus', 'glm-4-air', 'glm-4-flash', 'glm-4']
  },
  {
    name: 'Ollama (本地)',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3',
    iconKey: 'Ollama (本地)',
    defaultModels: []  // 本地模型不确定
  },
  {
    name: 'vLLM',
    baseUrl: 'http://localhost:8000/v1',
    model: 'meta-llama/Llama-3.2-1B-Instruct',
    iconKey: 'vLLM',
    defaultModels: []
  },
  {
    name: 'LM Studio',
    baseUrl: 'http://localhost:1234/v1',
    model: 'local-model',
    iconKey: 'LM Studio',
    defaultModels: []
  },
  {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    iconKey: 'Together AI',
    defaultModels: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo']
  },
  {
    name: 'Anyscale',
    baseUrl: 'https://api.endpoints.anyscale.com/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    iconKey: 'Anyscale',
    defaultModels: ['meta-llama/Llama-3.3-70B-Instruct', 'meta-llama/Meta-Llama-3-8B-Instruct']
  },
  {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    model: 'sonar-pro',
    iconKey: 'Perplexity',
    defaultModels: ['sonar-pro', 'sonar-plus', 'sonar']
  },
  {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    model: 'mistral-large-latest',
    iconKey: 'Mistral AI',
    defaultModels: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'open-mistral-7b']
  },
  {
    name: 'Cohere',
    baseUrl: 'https://api.cohere.com/v1',
    model: 'command-r-plus',
    iconKey: 'Cohere',
    defaultModels: ['command-r-plus', 'command-r', 'command']
  },
  {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    model: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
    iconKey: 'Fireworks AI',
    defaultModels: []
  },
  {
    name: 'Replicate',
    baseUrl: 'https://openai-proxy.replicate.com/v1',
    model: 'meta/meta-llama-3-8b-instruct',
    iconKey: 'Replicate',
    defaultModels: []
  },
  {
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-8b-instruct',
    iconKey: 'NVIDIA NIM',
    defaultModels: ['meta/llama-3.1-8b-instruct', 'meta/llama-3.1-70b-instruct', 'meta/llama3-8b-instruct']
  },
  {
    name: 'IBM Watsonx',
    baseUrl: 'https://eu-de.ml.cloud.ibm.com/ml/v1-beta/watsonx/ai',
    model: 'meta-llama/llama-3-8b-instruct',
    iconKey: 'IBM Watsonx',
    defaultModels: ['meta-llama/llama-3-8b-instruct', 'meta-llama/llama-3-70b-instruct']
  },
  {
    name: 'Azure OpenAI',
    baseUrl: 'https://{resource-name}.openai.azure.com/openai',
    model: 'gpt-4o',
    iconKey: 'Azure OpenAI',
    defaultModels: ['gpt-4o', 'gpt-4', 'gpt-35-turbo']
  },
  {
    name: 'Amazon Bedrock',
    baseUrl: 'https://bedrock-runtime.{region}.amazonaws.com',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    iconKey: 'Amazon Bedrock',
    defaultModels: []
  },
  {
    name: 'Cloudflare AI',
    baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1',
    model: '@cf/meta/llama-3-8b-instruct',
    iconKey: 'Cloudflare AI',
    defaultModels: []
  },
  {
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    model: 'llama3.1-8b',
    iconKey: 'Cerebras',
    defaultModels: ['llama3.1-8b', 'llama3.1-70b']
  },
  {
    name: 'FriendliAI',
    baseUrl: 'https://api.friendli.ai/v1',
    model: 'llama-3-8b',
    iconKey: 'FriendliAI',
    defaultModels: ['llama-3-8b', 'llama-3-70b']
  },
  {
    name: 'Novita AI',
    baseUrl: 'https://api.novita.ai/v1',
    model: 'meta-llama/llama-3-8b-instruct',
    iconKey: 'Novita AI',
    defaultModels: []
  },
  {
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    model: 'Meta-Llama-3.1-8B-Instruct',
    iconKey: 'SambaNova',
    defaultModels: ['Meta-Llama-3.1-8B-Instruct', 'Meta-Llama-3.1-70B-Instruct', 'Meta-Llama-3.1-405B-Instruct']
  }
]

const customUpstream = ref<string>(
  providerPresets.find(p => p.name === customProvider.value.name)?.name || '__manual__'
)

// 实时从上游 /models 接口获取的模型列表
const upstreamModels = ref<string[]>([])
const upstreamModelsSyncing = ref(false)
const upstreamModelsError = ref('')

// 上游模型选项（用于 HxSelect）
const upstreamModelOptions = computed(() => {
  return upstreamModels.value.map(m => ({ value: m, label: m }))
})

async function fetchUpstreamModels() {
  const baseUrl = customBaseUrl.value
  const apiKey = customApiKey.value
  if (!baseUrl) { upstreamModelsError.value = '请先填写 API Base URL'; return }
  if (!apiKey) { 
    upstreamModelsError.value = ''
    console.log('[fetchUpstreamModels] API Key 为空，等待用户填写')
    return 
  }

  console.log('[fetchUpstreamModels] 开始获取模型列表，baseUrl:', baseUrl)
  upstreamModelsSyncing.value = true
  upstreamModelsError.value = ''

  try {
    const isDev = import.meta.env?.DEV ?? false
    let fetchUrl = `${baseUrl}/models`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
    }
    // Wails 模式或开发模式下通过 Go 后端代理避免跨域
    if (baseUrl.startsWith('http')) {
      try {
        const targetOrigin = new URL(baseUrl).origin
        if (targetOrigin !== window.location.origin) {
          headers['x-proxy-target'] = baseUrl
          fetchUrl = '/proxy/custom/models'
        }
      } catch (_) {}
    }

    console.log('[fetchUpstreamModels] 请求 URL:', fetchUrl)
    const r = await fetch(fetchUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    })
    console.log('[fetchUpstreamModels] 响应状态:', r.status)
    
    if (!r.ok) {
      // 如果 /models 接口失败，使用预设模型列表
      const preset = providerPresets.find(p => p.name === customUpstream.value)
      if (preset?.defaultModels && preset.defaultModels.length > 0) {
        console.log('[fetchUpstreamModels] API 返回失败，使用预设模型列表')
        upstreamModels.value = preset.defaultModels
        upstreamModelsError.value = ''
        return
      }
      upstreamModelsError.value = `HTTP ${r.status}: 获取模型列表失败 (API Key 可能无效)`
      return
    }
    
    const body = await r.json()
    console.log('[fetchUpstreamModels] 响应数据:', body)
    
    // 处理不同 API 格式的模型列表
    let modelList: string[] = []
    if (body.data && Array.isArray(body.data)) {
      modelList = body.data.map((m: any) => m.id || m.model || '').filter((id: string) => id)
    } else if (body.models && Array.isArray(body.models)) {
      modelList = body.models.map((m: any) => m.id || m.model || '').filter((id: string) => id)
    } else if (Array.isArray(body)) {
      modelList = body.map((m: any) => m.id || m.model || '').filter((id: string) => id)
    }
    
    modelList = modelList.sort()
    console.log('[fetchUpstreamModels] 解析到的模型数量:', modelList.length)
    
    if (modelList.length === 0) {
      // 如果 API 返回空列表，使用预设模型列表
      const preset = providerPresets.find(p => p.name === customUpstream.value)
      if (preset?.defaultModels && preset.defaultModels.length > 0) {
        console.log('[fetchUpstreamModels] API 返回空列表，使用预设模型列表')
        upstreamModels.value = preset.defaultModels
        upstreamModelsError.value = ''
        return
      }
      upstreamModelsError.value = '未获取到模型列表 (API 返回数据为空)'
      return
    }
    
    upstreamModels.value = modelList
    // 如果当前选的模型不在列表中，自动选第一个
    if (!modelList.includes(customModel.value)) {
      customModel.value = modelList[0]
    }
    console.log('[fetchUpstreamModels] 获取成功，模型列表:', upstreamModels.value)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[fetchUpstreamModels] 错误:', e)
    // 如果请求失败，使用预设模型列表
    const preset = providerPresets.find(p => p.name === customUpstream.value)
    if (preset?.defaultModels && preset.defaultModels.length > 0) {
      console.log('[fetchUpstreamModels] 请求失败，使用预设模型列表')
      upstreamModels.value = preset.defaultModels
      upstreamModelsError.value = ''
      return
    }
    upstreamModelsError.value = `获取失败：${msg}`
  } finally {
    upstreamModelsSyncing.value = false
  }
}

function selectUpstream(preset: { name: string; baseUrl: string; model: string; defaultModels?: string[] }) {
  customUpstream.value = preset.name
  customName.value = preset.name
  customBaseUrl.value = preset.baseUrl
  customModel.value = preset.model
  // 切换上游时清空之前获取的模型列表和验证状态
  upstreamModels.value = []
  upstreamModelsError.value = ''
  apiVerified.value = false
  // 如果有预设模型列表，先显示预设列表（但不自动获取，等待用户测试）
  // 不再自动调用 fetchUpstreamModels，等待用户点击测试按钮
}

// 检查 URL 是否包含占位符（如 {resource-name}, {region}, {account_id} 等）
function hasPlaceholder(url: string): boolean {
  return /\{[^}]+\}/.test(url)
}

async function testConnection() {
  testing.value = true
  testResult.value = null
  apiVerified.value = false  // 重置验证状态

  const config = providerMode.value === 'custom'
    ? { baseUrl: customBaseUrl.value, apiKey: customApiKey.value, model: customModel.value }
    : chatStore.getActiveConfig()

  if (!config.apiKey) {
    testResult.value = { ok: false, message: '请先填写 API Key' }
    testing.value = false
    return
  }

  if (!config.baseUrl) {
    testResult.value = { ok: false, message: '请先填写 API Base URL' }
    testing.value = false
    return
  }

  try {
    // 开发模式下通过 Vite 代理避免 CORS
    const isDev = import.meta.env?.DEV ?? false
    let fetchUrl = `${config.baseUrl}/chat/completions`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    }
    if (isDev && config.baseUrl.startsWith('http')) {
      headers['x-proxy-target'] = config.baseUrl
      fetchUrl = '/proxy/custom/chat/completions'
    }

    const r = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (r.ok) {
      const data = await r.json()
      const model = data?.model || config.model || '未知'
      testResult.value = { ok: true, message: `连接成功! 模型：${model}` }
      toast.success('连接成功', `当前使用：${model}`)
      // 测试成功后，获取模型列表并显示模型设置
      apiVerified.value = true
      await fetchUpstreamModels()
      // 根据当前模型设置上下文长度
      onModelChange()
      // 如果有模型列表，提示用户选择
      if (upstreamModels.value.length > 0) {
        toast.info('模型列表已加载', `请选择您要使用的模型`)
      }
    } else if (r.status === 401) {
      testResult.value = { ok: false, message: 'API Key 无效 (401 Unauthorized)' }
      toast.error('API Key 无效')
    } else if (r.status === 404) {
      testResult.value = { ok: false, message: 'API 地址错误，端点不存在 (404)' }
      toast.error('API 地址错误')
    } else {
      let errText = ''
      try { errText = await r.text() } catch {}
      testResult.value = { ok: false, message: `HTTP ${r.status}: ${errText.slice(0, 120)}` }
      toast.error('连接失败', `HTTP ${r.status}`)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
      testResult.value = { ok: false, message: '网络错误（可能是跨域限制）。请检查 API 地址是否正确，或在桌面版中测试。' }
    } else if (msg.includes('timeout') || msg.includes('abort')) {
      testResult.value = { ok: false, message: '连接超时，请检查 API 地址是否可访问。' }
    } else {
      testResult.value = { ok: false, message: `连接失败：${msg}` }
    }
    toast.error('连接失败', msg.slice(0, 80))
  }
  testing.value = false
}

function saveModelSettings() {
  if (providerMode.value === 'gfw') {
    localStorage.setItem('gfw_api_key', gfwApiKey.value)
  } else if (providerMode.value === 'custom') {
    chatStore.setCustomProvider({
      name: customName.value,
      baseUrl: customBaseUrl.value,
      apiKey: customApiKey.value,
      model: customModel.value,
    })
    chatStore.selectedModel = customModel.value
  }
  chatStore.setProviderMode(providerMode.value)
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 2000)
  toast.success('模型设置已保存')
}

const featuredModels = computed(() => {
  return models.value.filter(m => m.is_featured && m.is_available)
})

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(0)}M`
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`
  return tokens.toString()
}

async function handleLogin() {
  try {
    await gfwStore.login(email.value, password.value)
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchModels()
    await gfwStore.fetchApiKeys()
    await gfwStore.fetchDailyUsage()
    await gfwStore.fetchRechargePackages()
    toast.success('登录成功', '欢迎回来！')
  } catch (e: any) {
    toast.error('登录失败', e?.message || '请检查邮箱和密码')
  }
}

function logout() {
  gfwStore.logout()
  toast.info('已登出')
}

async function createKey() {
  try {
    await gfwStore.createApiKey(newKeyName.value || 'Desktop Key', newKeyLimit.value)
    showCreateKey.value = false
    newKeyName.value = ''
    toast.success('Key 创建成功')
  } catch (e: any) {
    toast.error('创建失败', e?.message)
  }
}

// GFW 账户登录
async function handleGfwAccountLogin() {
  if (!gfwAccountEmail.value || !gfwAccountPassword.value) {
    toast.error('请输入邮箱和密码')
    return
  }
  gfwAccountLoggingIn.value = true
  try {
    await gfwStore.login(gfwAccountEmail.value, gfwAccountPassword.value)
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchApiKeys()
    // 记住账户
    localStorage.setItem('gfw_saved_email', gfwAccountEmail.value)
    gfwAccountPassword.value = ''
    toast.success('登录成功')
  } catch (e: any) {
    toast.error('登录失败', e?.message || '请检查邮箱和密码')
  } finally {
    gfwAccountLoggingIn.value = false
  }
}

// GFW 创建 Key
async function createGfwKey() {
  if (!newKeyName.value) {
    toast.error('请输入 Key 名称')
    return
  }
  gfwCreatingKey.value = true
  try {
    const result = await gfwStore.createApiKey(newKeyName.value, newKeyLimit.value)
    await gfwStore.fetchApiKeys()
    // 自动选中新创建的 key
    if (gfwStore.apiKeys.length > 0) {
      const latest = gfwStore.apiKeys[gfwStore.apiKeys.length - 1]
      gfwSelectedKeyId.value = latest.id
      gfwApiKey.value = latest.full_key || latest.key_prefix + '***'
    }
    showGfwCreateKey.value = false
    newKeyName.value = ''
    toast.success('Key 创建成功')
  } catch (e: any) {
    toast.error('创建失败', e?.message)
  } finally {
    gfwCreatingKey.value = false
  }
}

function saveSettings() {
  saveModelSettings()
}

// ===== Hermes Agent Settings =====
const agentSaveOk = ref(false)
const agentSettings = ref({
  maxTurns: 90,
  systemPrompt: '',
  compressionEnabled: true,
  compressionThreshold: 0.50,
  compressionTarget: 0.20,
  memoryEnabled: true,
  userProfileEnabled: true,
})

async function saveAgentSettings(silent = false) {
  const s = agentSettings.value
  try {
    await Promise.all([
      hermesConfigSet('agent.max_turns', String(s.maxTurns)),
      hermesConfigSet('compression.enabled', String(s.compressionEnabled)),
      hermesConfigSet('compression.threshold', String(s.compressionThreshold)),
      hermesConfigSet('compression.target_ratio', String(s.compressionTarget)),
      hermesConfigSet('memory.memory_enabled', String(s.memoryEnabled)),
      hermesConfigSet('memory.user_profile_enabled', String(s.userProfileEnabled)),
    ])
    if (s.systemPrompt) {
      await hermesConfigSet('agent.system_prompt', s.systemPrompt)
    }
    agentSaveOk.value = true
    setTimeout(() => { agentSaveOk.value = false }, 2000)
    if (!silent) toast.success('Agent 设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// ===== Terminal Settings =====
const terminalSaveOk = ref(false)
const terminalSettings = ref({
  backend: 'local',
  cwd: '',
  timeout: 180,
  approvalMode: 'manual',
  sshHost: '',
  sshPort: 22,
  sshKey: '',
  dockerImage: '',
  dockerMount: '',
})

async function saveTerminalSettings(silent = false) {
  const s = terminalSettings.value
  try {
    await Promise.all([
      hermesConfigSet('terminal.backend', s.backend),
      hermesConfigSet('terminal.timeout', String(s.timeout)),
      hermesConfigSet('approvals.mode', s.approvalMode),
    ])
    if (s.cwd) await hermesConfigSet('terminal.cwd', s.cwd)
    terminalSaveOk.value = true
    setTimeout(() => { terminalSaveOk.value = false }, 2000)
    if (!silent) toast.success('终端设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// ===== Display Settings =====
const displaySaveOk = ref(false)
const displaySettings = ref({
  showToolProgress: true,
  showReasoning: 'hide',
  showCost: false,
  renderMarkdown: true,
  syntaxHighlight: true,
})

async function saveDisplaySettings(silent = false) {
  const s = displaySettings.value
  try {
    await Promise.all([
      hermesConfigSet('display.tool_progress', String(s.showToolProgress)),
      hermesConfigSet('display.show_reasoning', s.showReasoning),
      hermesConfigSet('display.show_cost', String(s.showCost)),
    ])
    displaySaveOk.value = true
    setTimeout(() => { displaySaveOk.value = false }, 2000)
    if (!silent) toast.success('显示设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// ===== Voice Settings =====
const voiceSaveOk = ref(false)
const voiceSettings = ref({
  sttEnabled: false,
  sttProvider: 'local',
  whisperModel: 'base',
  ttsProvider: 'edge',
  ttsApiKey: '',
})

async function saveVoiceSettings(silent = false) {
  const s = voiceSettings.value
  try {
    await Promise.all([
      hermesConfigSet('stt.enabled', String(s.sttEnabled)),
      hermesConfigSet('stt.provider', s.sttProvider),
      hermesConfigSet('tts.provider', s.ttsProvider),
    ])
    if (s.sttProvider === 'local') await hermesConfigSet('stt.local.model', s.whisperModel)
    voiceSaveOk.value = true
    setTimeout(() => { voiceSaveOk.value = false }, 2000)
    if (!silent) toast.success('语音设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// ===== Security Settings =====
const securitySaveOk = ref(false)
const securitySettings = ref({
  redactSecrets: false,
  redactPii: false,
  blocklist: '',
})

const toolsetList = ref([
  { id: 'web', label: 'Web 搜索/提取', enabled: true },
  { id: 'browser', label: '浏览器自动化', enabled: true },
  { id: 'terminal', label: '终端命令', enabled: true },
  { id: 'file', label: '文件读写', enabled: true },
  { id: 'code_execution', label: '代码执行沙箱', enabled: true },
  { id: 'vision', label: '图片分析', enabled: true },
  { id: 'image_gen', label: '图片生成', enabled: false },
  { id: 'tts', label: '文字转语音', enabled: false },
  { id: 'delegation', label: '子 Agent 委派', enabled: true },
  { id: 'memory', label: '持久记忆', enabled: true },
  { id: 'skills', label: '技能管理', enabled: true },
  { id: 'cronjob', label: '定时任务', enabled: true },
])

// toolset 开关状态从真实 Hermes API 加载 (见 loadToolsets)

async function saveSecuritySettings(silent = false) {
  const s = securitySettings.value
  try {
    await Promise.all([
      hermesConfigSet('security.redact_secrets', String(s.redactSecrets)),
      hermesConfigSet('privacy.redact_pii', String(s.redactPii)),
    ])
    // 保存 toolset 开关 — 调用真实 Hermes API
    for (const t of toolsetList.value) {
      if (t.enabled) {
        await hermesToolsEnable(t.id)
      } else {
        await hermesToolsDisable(t.id)
      }
    }
    securitySaveOk.value = true
    setTimeout(() => { securitySaveOk.value = false }, 2000)
    if (!silent) toast.success('安全设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// 从真实 Hermes API 加载 toolset 开关状态
async function loadToolsets(): Promise<void> {
  try {
    const data = await hermesToolsList()
    if (data.tools && Array.isArray(data.tools)) {
      toolsetList.value = data.tools.map((t: any) => ({
        id: t.name,
        label: t.description || t.name,
        enabled: t.enabled,
      }))
    }
  } catch { /* agent not running */ }
}

// 从 Hermes config.yaml 加载设置初始值
async function loadConfigValues() {
  try {
    const yaml = await hermesConfigGet()
    const get = (key: string, fallback: string) => {
      const re = new RegExp(`^\\s*${key.replace('.', '\\s*.*?')}:\\s*(.+)`, 'm')
      const m = yaml.match(re)
      return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : fallback
    }
    // Agent
    const mt = get('max_turns', '90')
    if (mt) agentSettings.value.maxTurns = Number(mt) || 90
    // Terminal
    const backend = get('backend', '')
    if (backend && ['local','docker','ssh'].includes(backend)) terminalSettings.value.backend = backend
    const timeout = get('timeout', '180')
    if (timeout) terminalSettings.value.timeout = Number(timeout) || 180
    // Approvals
    const mode = get('mode', '')
    if (mode && ['manual','smart','off'].includes(mode)) terminalSettings.value.approvalMode = mode
  } catch { /* agent not running */ }
}

onMounted(async () => {
  if (isLoggedIn.value) {
    await gfwStore.fetchUserInfo()
    await gfwStore.fetchModels()
    await gfwStore.fetchApiKeys()
    await gfwStore.fetchDailyUsage()
    await gfwStore.fetchRechargePackages()
  }
  await loadToolsets()
  await loadConfigValues()
  _initialLoadDone = true
})

// ===== Auto-save (8s: 5s wait + 3s save) =====
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null
let dirtyTimer: ReturnType<typeof setTimeout> | null = null
type SaveState = 'idle' | 'dirty' | 'saving' | 'saved'
const saveState = ref<SaveState>('idle')
const _pendingSave = new Set<string>()
let _initialLoadDone = false

function scheduleAutoSave(category: string) {
  if (!_initialLoadDone) return
  _pendingSave.add(category)
  if (saveState.value === 'idle') saveState.value = 'dirty'
  if (dirtyTimer) clearTimeout(dirtyTimer)
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  // 5秒后从 dirty -> saving
  dirtyTimer = setTimeout(() => {
    dirtyTimer = null
    saveState.value = 'saving'
  }, 5000)
  // 8秒后执行保存
  autoSaveTimer = setTimeout(async () => {
    autoSaveTimer = null
    const cats = [..._pendingSave]
    _pendingSave.clear()
    try {
      const saves: Promise<void>[] = []
      if (cats.includes('agent')) saves.push(saveAgentSettings(true))
      if (cats.includes('terminal')) saves.push(saveTerminalSettings(true))
      if (cats.includes('display')) saves.push(saveDisplaySettings(true))
      if (cats.includes('voice')) saves.push(saveVoiceSettings(true))
      if (cats.includes('security')) saves.push(saveSecuritySettings(true))
      if (saves.length) await Promise.all(saves)
    } finally {
      saveState.value = 'saved'
      setTimeout(() => { if (saveState.value === 'saved') saveState.value = 'idle' }, 3000)
    }
  }, 8000)
}

// 手动保存时重置状态
function resetSaveState() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  if (dirtyTimer) clearTimeout(dirtyTimer)
  autoSaveTimer = null
  dirtyTimer = null
  _pendingSave.clear()
  saveState.value = 'saved'
  setTimeout(() => { if (saveState.value === 'saved') saveState.value = 'idle' }, 2000)
}

function watchSettings(obj: ReturnType<typeof ref>, cat: string) {
  watch(obj, () => { scheduleAutoSave(cat) }, { deep: true })
}

watchSettings(agentSettings, 'agent')
watchSettings(terminalSettings, 'terminal')
watchSettings(displaySettings, 'display')
watchSettings(voiceSettings, 'voice')
watchSettings(securitySettings, 'security')
// ===== Usage Stats =====
const usageTotal = computed(() => ({
  requests: dailyUsage.value.reduce((s, u) => s + u.request_count, 0),
  inputTokens: dailyUsage.value.reduce((s, u) => s + u.input_tokens, 0),
  outputTokens: dailyUsage.value.reduce((s, u) => s + u.output_tokens, 0),
  cost: dailyUsage.value.reduce((s, u) => s + u.total_cost, 0),
}))

const maxTokens = computed(() => {
  let m = 0
  for (const d of dailyUsage.value) {
    m = Math.max(m, d.input_tokens, d.output_tokens)
  }
  return m || 1
})

function barH(val: number, max: number): number {
  return max > 0 ? (val / max) * 100 : 0
}
function yTick(max: number, n: number, total: number): string {
  return shortNum(Math.round((max / total) * n))
}
function formatDate(date: string): string {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}
function shortNum(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}
function formatNum(n: number): string {
  return n.toLocaleString()
}

interface ModelStat { model: string; requests: number; inputTokens: number; outputTokens: number; total: number }

const modelStats = computed<ModelStat[]>(() => {
  const map = new Map<string, ModelStat>()
  const allMsgs = chatStore.sessions.flatMap(s => s.messages)
  for (const m of allMsgs) {
    if (!m.model) continue
    const key = m.model
    if (!map.has(key)) map.set(key, { model: key, requests: 0, inputTokens: 0, outputTokens: 0, total: 0 })
    const st = map.get(key)!
    st.requests++
    const tu = m.token_usage
    if (tu) {
      const inp = tu.prompt_tokens || tu.input_tokens || 0
      const out = tu.completion_tokens || tu.output_tokens || 0
      st.inputTokens += inp
      st.outputTokens += out
      st.total += inp + out
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
})

interface RequestEntry { id: string; time: string; model: string; role: string; preview: string; tokens: number; duration: string }

const REQ_LOG_PAGE_SIZE = 20
const reqLogPage = ref(1)

const requestLog = computed<RequestEntry[]>(() => {
  const entries: RequestEntry[] = []
  const allMsgs = chatStore.sessions.flatMap(s => s.messages)
  for (const m of allMsgs.slice(-500).reverse()) {
    const tu = m.token_usage
    const total = tu ? ((tu.prompt_tokens || tu.input_tokens || 0) + (tu.completion_tokens || tu.output_tokens || 0)) : 0
    const dur = m.duration_ms ? `${(m.duration_ms / 1000).toFixed(1)}s` : '-'
    const preview = m.content ? m.content.slice(0, 80).replace(/\n/g, ' ') : ''
    entries.push({
      id: m.id,
      time: new Date(m.timestamp).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      model: m.model || '',
      role: m.role,
      preview,
      tokens: total,
      duration: dur,
    })
  }
  return entries
})

const reqLogTotalPages = computed(() => Math.max(1, Math.ceil(requestLog.value.length / REQ_LOG_PAGE_SIZE)))
const paginatedRequestLog = computed(() => {
  const start = (reqLogPage.value - 1) * REQ_LOG_PAGE_SIZE
  return requestLog.value.slice(start, start + REQ_LOG_PAGE_SIZE)
})

// Watch: reset page when requestLog changes
import { watch } from 'vue'
watch(requestLog, () => { reqLogPage.value = 1 })

// Smart page numbers for pagination (e.g. 1 2 3 ... 10 11)
const pageNumbers = computed<(number | string)[]>(() => {
  const total = reqLogTotalPages.value
  const current = reqLogPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  pages.push(1)
  if (current > 3) pages.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('…')
  if (total > 1) pages.push(total)
  return pages
})
</script>

<style scoped>
.settings-view {
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.settings-layout {
  display: flex;
  height: 100%;
  position: relative;
}

/* ===== Left Nav — VueBits Glass ===== */
.settings-nav {
  width: 200px;
  min-width: 200px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border-right: 1px solid var(--border-base);
  padding: var(--space-4) 0;
  overflow-y: auto;
}

.settings-nav-title {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 var(--space-4) var(--space-3);
}

.settings-search-box {
  padding: 0 var(--space-3) var(--space-3);
}

.settings-search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  outline: none;
  transition: all var(--fast);
}

.settings-search-input:focus {
  border-color: var(--border-focus);
  box-shadow: var(--glow-sm);
}

.settings-search-input::placeholder {
  color: var(--text-tertiary);
}

.nav-icon-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background var(--fast);
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--fast);
  text-decoration: none;
  border-left: 2px solid transparent;
  margin: 0 var(--space-2);
  border-radius: var(--radius-md);
}

.settings-nav-item:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.settings-nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(90, 200, 250, 0.25) 0%,
    rgba(90, 200, 250, 0.15) 100%
  );
  color: rgba(90, 200, 250, 1);
  border-left: 3px solid rgba(90, 200, 250, 0.8);
  box-shadow: 
    inset 0 0 0 1px rgba(90, 200, 250, 0.15),
    0 0 16px rgba(90, 200, 250, 0.2);
  font-weight: var(--font-semibold);
}

.settings-nav-item.active .nav-icon-dot {
  background: rgba(90, 200, 250, 1) !important;
  box-shadow: 0 0 8px rgba(90, 200, 250, 0.6);
}

/* ===== Right Content ===== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-8) var(--space-10);
}

.content-section {
  max-width: 720px;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-5);
  letter-spacing: -0.3px;
}

/* ===== Card — VueBits Glass ===== */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--border-base);
  border-radius: var(--radius-2xl);
  box-shadow: var(--glass-inset), var(--shadow-md);
  overflow: hidden;
  transition: all var(--normal);
}

.card:hover {
  border-color: var(--border-light);
  box-shadow: var(--glass-inset), var(--shadow-lg);
}

.card-body {
  padding: var(--space-5);
}

.card-body.no-padding {
  padding: 0;
}

/* ===== Form ===== */
.form-row {
  margin-bottom: var(--space-4);
}

.form-row:last-child {
  margin-bottom: 0;
}

/* 横向行：label + input + help 对齐 */
.form-row-horizontal {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.form-row-horizontal .form-label {
  margin-bottom: 0;
  min-width: 80px;
}
.form-row-horizontal .form-help {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  white-space: nowrap;
}

/* 工具权限网格 */
.toolset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.toolset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--glass-bg, rgba(255,255,255,0.04));
  border: 1px solid var(--border-base, rgba(255,255,255,0.08));
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--fast);
  min-width: 0;
}
.toolset-item:hover {
  border-color: var(--border-focus, rgba(255,255,255,0.18));
}
.toolset-label {
  font-size: var(--text-sm);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 卡片内的输入框样式 (scoped穿透) */
.toolset-item :deep(.hixns-input) {
  flex: none;
  width: 140px;
}
.toolset-item :deep(.hixns-input__field) {
  background: var(--glass-base, rgba(0,0,0,0.25));
  color: var(--text-primary);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  text-align: center;
  font-size: var(--text-sm);
}
.toolset-item :deep(.hixns-input__field:focus) {
  border-color: var(--border-focus);
}

.form-label {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
}

.form-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-primary);
  background: var(--glass-base);
  transition: all var(--fast);
  outline: none;
}

.form-input:focus {
  border-color: var(--border-focus);
  box-shadow: var(--glow-sm);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-select {
  width: 100%;
  padding: var(--space-2) var(--space-7) var(--space-2) var(--space-3);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--text-primary);
  background: var(--glass-base);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-2) center;
  cursor: pointer;
  outline: none;
  transition: all var(--fast);
}

.form-select:focus {
  border-color: var(--border-focus);
  box-shadow: var(--glow-sm);
}

.form-hint {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin: var(--space-1) 0 0;
}

.form-actions {
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

/* ===== Buttons ===== */
.btn-primary {
  padding: 6px 16px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 2px 8px rgba(10,132,255,0.25);
}

.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.12s;
}

.btn-secondary:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.btn-danger-outline {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
  font-size: 11px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.12s;
}

.btn-danger-outline:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

/* ===== User Profile ===== */
.user-profile-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-base);
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-base);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.user-info { flex: 1; }

.user-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.user-group {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.stat-value.primary {
  color: var(--primary);
}

/* ===== Data table ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 8px 14px;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-bg-input);
  border-bottom: 1px solid var(--color-border);
}

.data-table td {
  padding: 8px 14px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-subtle, var(--color-border));
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: var(--color-bg-input); }

.cell-name { font-weight: 600; }
.cell-mono { color: var(--color-text-tertiary); }
.cell-cost { color: var(--color-primary); font-weight: 600; }
.empty-cell { text-align: center !important; color: var(--color-text-tertiary); padding: 24px 14px !important; }

/* Status tag */
.status-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
}

.status-tag.active { background: var(--color-bg-input); color: var(--color-success); }
.status-tag.inactive { background: var(--color-bg-input); color: var(--color-error); }

/* ===== Usage Stats ===== */
.usage-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.usage-card {
  background: var(--glass-bg);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  text-align: center;
}
.usage-card-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  margin-bottom: 4px;
}
.usage-card-value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-family: var(--font-mono);
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: var(--space-3) 0;
  height: 200px;
  position: relative;
}
.bar-chart__y-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 24px;
}
.bar-chart__y-label {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  min-height: 12px;
}
.bar-chart__grid {
  position: absolute;
  left: 36px;
  right: 0;
  top: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.bar-chart__grid-line {
  border-bottom: 1px dashed rgba(255,255,255,0.06);
}
.bar-chart__bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 4px;
  height: 100%;
  padding-bottom: 24px;
  overflow-x: auto;
}
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 40px;
  flex: 1;
  max-width: 60px;
}
.bar-col {
  display: flex;
  align-items: flex-end;
  height: calc(100% - 24px);
}
.bar {
  width: 16px;
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  position: relative;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.bar--input { background: var(--accent); opacity: 0.85; }
.bar--output { background: #a78bfa; opacity: 0.85; }
.bar-label {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}
.bar:hover .bar-label { opacity: 1; }
.bar-date {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  margin-top: 4px;
}
.bar-legend {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-base);
}
.bar-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
.bar-legend__dot {
  width: 10px;
  height: 3px;
  border-radius: 2px;
}
.bar-legend__dot--input { background: var(--accent); }
.bar-legend__dot--output { background: #a78bfa; }

/* Role tag */
.role-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-family: var(--font-mono);
}
.role-tag.user {
  background: rgba(90, 200, 250, 0.12);
  color: var(--accent);
}
.role-tag.assistant {
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
}

.cell-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-info {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  margin-left: auto;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 0 4px;
  border-top: 1px solid var(--border-base);
  margin-top: 8px;
}
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border-base);
  border-radius: 6px;
  background: var(--glass-bg);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s ease;
}
.page-btn:hover:not(:disabled):not(.active) {
  background: var(--glass-bg-hover, rgba(255,255,255,0.08));
  border-color: var(--accent);
}
.page-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.page-ellipsis {
  padding: 0 4px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* ===== Packages ===== */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.package-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px 14px;
  text-align: center;
  position: relative;
  transition: border-color 0.12s;
}

.package-card:hover { border-color: var(--color-text-tertiary); }
.package-card.recommended { border-color: var(--color-text-primary); border-width: 2px; }

.package-badge {
  position: absolute;
  top: -1px;
  right: 12px;
  background: var(--color-text-primary);
  color: var(--color-bg-page);
  padding: 2px 8px;
  border-radius: 0 0 4px 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
}

.package-name { font-size: 14px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; }
.package-desc { font-size: 11px; color: var(--color-text-tertiary); margin-bottom: 12px; line-height: 1.4; }
.package-price { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px; }
.package-amount { font-family: var(--font-mono); font-size: 12px; color: var(--color-text-secondary); margin-bottom: 2px; }
.package-bonus { font-family: var(--font-mono); font-size: 11px; color: var(--color-warning); margin-bottom: 12px; }
.package-btn { width: 100%; margin-top: 8px; }

/* ===== Provider Tabs ===== */
.provider-tabs {
  display: flex;
  gap: var(--space-2);
}

.provider-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  background: var(--glass-base);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--fast);
}

.provider-tab:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  color: var(--text-primary);
}

.provider-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.provider-tab.active {
  background: var(--primary-light);
  border-color: var(--border-focus);
  color: var(--text-primary);
  box-shadow: var(--glow-sm);
}

/* GFW Auth Mode */
.gfw-auth-modes {
  display: flex;
  gap: var(--space-2);
}
.gfw-auth-mode {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
  background: var(--glass-base);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--fast);
}
.gfw-auth-mode:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  color: var(--text-primary);
}
.gfw-auth-mode.active {
  background: var(--primary-light);
  border-color: var(--border-focus);
  color: var(--text-primary);
  box-shadow: var(--glow-sm);
}

/* GFW User Info */
.gfw-user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--glass-base);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-lg);
}
.gfw-user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
}
.gfw-user-detail {
  flex: 1;
}
.gfw-user-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}
.gfw-user-balance {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

/* GFW API Key Header */
.gfw-api-key-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}
.gfw-api-key-header .form-label {
  margin-bottom: 0;
}
.gfw-api-key-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* GFW Key List */
.gfw-key-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
}
.gfw-key-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 14px;
  border: 1.5px solid var(--border-base);
  border-radius: var(--radius-lg);
  background: var(--glass-base);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--fast);
  position: relative;
  overflow: hidden;
}
.gfw-key-item:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  transform: translateY(-1px);
}
.gfw-key-item.active {
  border-color: var(--accent);
  background: rgba(90, 200, 250, 0.06);
  color: var(--text-primary);
  box-shadow: 0 0 12px rgba(90, 200, 250, 0.08);
}
/* Active indicator */
.gfw-key-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 2px 2px 0;
  background: var(--accent);
}
.gfw-key-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  text-align: left;
}
.gfw-key-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gfw-key-item.active .gfw-key-name {
  color: var(--accent);
}
.gfw-key-prefix {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}
.gfw-key-quota {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-base);
  white-space: nowrap;
  flex-shrink: 0;
}
.gfw-key-item.active .gfw-key-quota {
  background: rgba(90, 200, 250, 0.1);
  border-color: rgba(90, 200, 250, 0.2);
  color: var(--accent);
}

/* GFW Create Key */
.gfw-create-key-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px dashed var(--border-base);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--fast);
  white-space: nowrap;
}
.gfw-create-key-btn:hover {
  border-color: var(--border-light);
  color: var(--text-primary);
  background: var(--glass-base);
}
.gfw-create-key-form {
  display: flex;
  align-items: center;
  margin-top: var(--space-2);
}

/* Provider Chips */
.provider-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.provider-chips .chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  background: var(--glass-base);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--fast);
}

.provider-chips .chip:hover {
  background: var(--glass-bg-hover);
  border-color: var(--border-light);
  color: var(--text-primary);
}

.provider-chips .chip.active {
  background: var(--primary-light);
  border-color: var(--border-focus);
  color: var(--text-primary);
  box-shadow: var(--glow-sm);
}

.provider-chips .chip .chip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.provider-chips .chip .chip-icon svg {
  width: 100%;
  height: 100%;
}

.provider-chips .chip .chip-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 暗色模式下将黑色图标反转为白色 */
[data-theme="dark"] .provider-chips .chip .chip-icon-img {
  filter: brightness(0) invert(1);
}

.provider-chips .chip .chip-name {
  white-space: nowrap;
}

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-header-tag {
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

.card-header-tag.default { background: var(--color-bg-input); color: var(--color-primary); }
.card-header-tag.custom { background: var(--color-bg-input); color: var(--color-accent); }

.hint-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 14px;
  line-height: 1.5;
}

/* Presets */
.presets-section {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.presets-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-right: 4px;
}

.preset-btn {
  padding: 3px 10px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s;
}

.preset-btn:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

/* Model detail */
.model-detail {
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--color-bg-input);
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

.detail-label { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-tertiary); }
.detail-value { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-primary); }

.sync-btn {
  margin-left: 8px;
  padding: 2px 8px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.12s;
}

.sync-btn:hover:not(:disabled) { border-color: var(--color-text-secondary); color: var(--color-text-primary); }
.sync-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Test connection */
.test-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.test-result { font-family: var(--font-mono); font-size: 12px; font-weight: 500; }
.test-result.success { color: var(--color-success); }
.test-result.error { color: var(--color-error); }

.save-feedback {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-success);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.2s ease;
}

/* 自动保存状态 */
.save-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.save-dot.blue {
  background: #4da3ff;
  box-shadow: 0 0 8px #4da3ff88;
  animation: breathe-blue 1.5s ease-in-out infinite;
}
.save-dot.green {
  background: #4caf50;
  box-shadow: 0 0 8px #4caf5088;
  animation: breathe-green 1.2s ease-in-out infinite;
}

@keyframes breathe-blue {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.4); opacity: 1; }
}
@keyframes breathe-green {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
}

.save-dirty { color: #4da3ff; }
.save-saving { color: #4caf50; }
.save-saved svg {
  stroke: var(--color-success);
  animation: popIn 0.3s ease;
}
@keyframes popIn {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Toggle */
.toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.toggle input { display: none; }
.toggle-slider { position: relative; width: 32px; height: 18px; background: var(--color-border); border-radius: 9px; transition: background 0.15s; }
.toggle-slider::after { content: ''; position: absolute; width: 14px; height: 14px; background: var(--color-bg-page); border-radius: 50%; top: 2px; left: 2px; transition: transform 0.15s; }
.toggle input:checked + .toggle-slider { background: var(--color-text-primary); }
.toggle input:checked + .toggle-slider::after { transform: translateX(14px); }
.toggle-text { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-tertiary); }

/* Scrollbar */
.settings-content::-webkit-scrollbar { width: 4px; }
.settings-content::-webkit-scrollbar-track { background: transparent; }
.settings-content::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

/* Provider chips */
.provider-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: var(--color-bg-input);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.1s;
}

.chip:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text-primary);
}

.chip.active {
  border-color: var(--color-text-primary);
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  font-weight: 600;
}

.chip-count {
  font-size: 9px;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.model-select-group {
  width: 100%;
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  background: var(--color-bg-input);
  outline: none;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.12s, box-shadow 0.12s;
}

.form-textarea:focus {
  border-color: var(--color-border);
  box-shadow: none;
}

.form-textarea::placeholder {
  color: var(--color-text-tertiary);
}

/* ════════════════════════════════════════════════════════════
   Hermes Status Card
   ════════════════════════════════════════════════════════════ */
.hermes-status-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 0;
}

.hermes-status-card.disconnected {
  color: var(--error);
}

.hermes-status-card.loading {
  color: var(--color-text-secondary);
}

.hermes-status-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 132, 255, 0.08);
  color: var(--color-primary);
}

.hermes-status-card.disconnected .hermes-status-icon {
  background: rgba(255, 69, 58, 0.08);
  color: var(--error);
}

.hermes-status-card.loading .hermes-status-icon {
  background: rgba(255, 159, 10, 0.08);
  color: var(--warning);
}

.hermes-status-info {
  flex: 1;
  min-width: 0;
}

.hermes-status-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.hermes-status-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.hermes-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
  margin-top: 10px;
}

.hermes-status-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.hermes-label {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  min-width: 48px;
}

.hermes-value {
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hermes-value.mono {
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.status-dot.connected {
  background: var(--success);
  box-shadow: 0 0 6px rgba(48, 209, 88, 0.5);
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 159, 10, 0.3);
  border-top-color: var(--warning);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

:deep(.ctx-menu) {
  position: fixed;
  z-index: 2000;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  min-width: 100px;
  backdrop-filter: blur(16px);
}

:deep(.ctx-item) {
  display: block;
  width: 100%;
  padding: 7px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background var(--fast);
}

:deep(.ctx-item:hover) {
  background: var(--bg-elevated);
}
</style>
