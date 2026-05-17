<template>
  <div class="settings-view">
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
                <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/><path d="M482.56 54.4a42.666667 42.666667 0 0 0 0 1.536 42.666667 42.666667 0 0 0-1.493333 0c-242.944 255.061333-242.944 657.066667 0 912.128a42.666667 42.666667 0 0 0 61.866666 0c242.944-255.061333 242.944-657.066667 0-912.128a42.666667 42.666667 0 0 0-1.536 0 42.666667 42.666667 0 0 0 0-1.536 42.666667 42.666667 0 0 0-29.397333 0.768 42.666667 42.666667 0 0 0-29.44-0.768z m29.44 99.84a571.690667 571.690667 0 0 1 0 715.52 571.690667 571.690667 0 0 1 0-715.52z"/><path d="M85.333333 469.333333a42.666667 42.666667 0 0 0-42.666666 42.666667 42.666667 42.666667 0 0 0 42.666666 42.666667h853.333334a42.666667 42.666667 0 0 0 42.666666-42.666667 42.666667 42.666667 0 0 0-42.666666-42.666667z"/></svg>
                <span>GFW.NET 内置</span>
              </button>
              <button
                :class="['provider-tab', { active: providerMode === 'custom' }]"
                @click="providerMode = 'custom'; chatStore.setProviderMode('custom')"
              >
                <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor"><path d="M673.152 42.496c-190.72 6.144-334.165333 201.130667-271.317333 391.424l-320.170667 320.170667c-28.842667 28.842667-42.410667 66.176-40.405333 100.565333 2.005333 34.432 17.706667 64.981333 40.405333 87.68 22.698667 22.698667 53.162667 38.4 87.594667 40.405333 34.389333 2.048 71.765333-11.477333 100.693333-40.32l320.128-320.170666c218.88 72.277333 444.117333-129.536 380.757333-359.936a68.096 68.096 0 0 0-50.176-47.232 69.418667 69.418667 0 0 0-63.146666 19.2L725.333333 366.293333 657.664 298.666667l132.266667-132.181334a42.666667 42.666667 0 0 0 0.085333-0.085333 69.546667 69.546667 0 0 0 18.986667-63.061333 68.266667 68.266667 0 0 0-47.36-50.176 297.258667 297.258667 0 0 0-88.490667-10.666667z m26.496 93.568l-102.656 102.528a42.666667 42.666667 0 0 0-0.256 0.341333 86.016 86.016 0 0 0 0 119.466667 42.666667 42.666667 0 0 0 0.256 0.256l68.352 68.352a42.666667 42.666667 0 0 0 0.256 0.256c32.853333 32.170667 86.613333 32.170667 119.466667 0a42.666667 42.666667 0 0 0 0.256-0.256l102.613333-102.570667c13.525333 157.866667-139.008 281.173333-293.12 211.413334a42.666667 42.666667 0 0 0-47.744 8.746666l-337.493333 337.408c-13.781333 13.781333-24.32 16.213333-35.242667 15.573334a52.053333 52.053333 0 0 1-32.341333-15.573334 52.053333 52.053333 0 0 1-15.573334-32.341333c-0.64-10.922667 1.792-21.461333 15.573334-35.242667l337.493333-337.493333a42.666667 42.666667 0 0 0 8.661333-47.786667c-69.717333-154.112 53.546667-306.645333 211.498667-293.077333z"/></svg>
                <span>自定义提供商</span>
              </button>
            </div>
          </HxCard>

          <!-- GFW.NET 模式 -->
          <HxCard v-if="providerMode === 'gfw'">
            <template #header>
              <HxBadge variant="blue">GFW.NET</HxBadge>
              <span>内置模型服务</span>
            </template>
            <div class="form-row">
              <label class="form-label">GFW API Key</label>
              <HxInput v-model="gfwApiKey" type="password" placeholder="gfw-..." />
              <p class="form-hint">在 gfw.net 控制台获取 API Key</p>
            </div>

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
              <HxSelect v-model="selectedModel" v-if="filteredGfwModels.length > 0">
                <option v-for="m in filteredGfwModels" :key="m.model_code" :value="m.model_code">
                  {{ m.model_name }}{{ !selectedProvider ? ' (' + m.provider + ')' : '' }} {{ m.input_price ? '¥' + m.input_price + '/M' : '' }}
                </option>
              </HxSelect>
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
          </HxCard>

          <!-- 自定义提供商模式 -->
          <HxCard v-if="providerMode === 'custom'">
            <template #header>
              <HxBadge variant="purple">自定义</HxBadge>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
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
              <HxInput v-model="customBaseUrl" placeholder="https://api.openai.com/v1" :disabled="customUpstream !== '__manual__'" />
            </div>
            <div class="form-row">
              <label class="form-label">API Key</label>
              <HxInput v-model="customApiKey" type="password" placeholder="sk-..." />
            </div>
            <div class="form-row">
              <label class="form-label">
                模型
                <HxButton v-if="customUpstream !== '__manual__'" variant="ghost" size="sm" :loading="upstreamModelsSyncing" @click="fetchUpstreamModels" style="margin-left:8px;">
                  {{ upstreamModelsSyncing ? '获取中...' : '获取模型列表' }}
                </HxButton>
              </label>
              <HxSelect v-if="upstreamModels.length > 0" v-model="customModel">
                <option v-for="m in upstreamModels" :key="m" :value="m">{{ m }}</option>
              </HxSelect>
              <HxInput v-else v-model="customModel" placeholder="gpt-4o / deepseek-chat / qwen-plus" />
              <p v-if="upstreamModelsError" class="form-hint" style="color: var(--color-error);">{{ upstreamModelsError }}</p>
            </div>
            <div class="form-row">
              <label class="form-label">上下文长度</label>
              <HxInput v-model.number="contextLength" type="number" style="max-width: 200px;" :min="512" :max="128000" :step="512" />
            </div>
          </HxCard>

          <!-- 连接测试 + 保存 -->
          <HxCard style="margin-top: 16px;">
            <div class="test-row">
              <HxButton variant="secondary" :loading="testing" @click="testConnection">
                {{ testing ? '测试中...' : '测试连接' }}
              </HxButton>
              <span v-if="testResult" :class="['test-result', testResult.ok ? 'success' : 'error']">
                {{ testResult.message }}
              </span>
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 20px;">
            <HxButton variant="primary" @click="saveModelSettings">保存设置</HxButton>
            <span v-if="saveSuccess" class="save-feedback">设置已保存</span>
          </div>
        </div>

        <!-- API Keys section -->
        <div v-if="activeSection === 'apikeys'" class="content-section">
          <h2 class="section-title">API Key 管理</h2>

          <HxCard>
            <div class="no-padding">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>名称</th>
                    <th>Key 前缀</th>
                    <th>限额</th>
                    <th>已用</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="key in apiKeys.slice(0, 10)" :key="key.id">
                    <td class="cell-name">{{ key.name }}</td>
                    <td class="cell-mono">{{ key.key_prefix }}</td>
                    <td>{{ key.gcoin_limit || '无限制' }} G币</td>
                    <td>{{ key.used_quota.toFixed(4) }}</td>
                    <td>
                      <span :class="['status-tag', key.is_active ? 'active' : 'inactive']">
                        {{ key.is_active ? '启用' : '停用' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </HxCard>

          <div style="margin-top: 16px;">
            <HxButton variant="secondary" @click="showCreateKey = !showCreateKey">
              + 创建新 Key
            </HxButton>
          </div>

          <HxCard v-if="showCreateKey" style="margin-top: 12px;">
            <div class="form-row">
              <label class="form-label">Key 名称</label>
              <HxInput v-model="newKeyName" placeholder="例如: Desktop Key" style="max-width: 300px;" />
            </div>
            <div class="form-row">
              <label class="form-label">G 币限额</label>
              <HxInput v-model.number="newKeyLimit" type="number" style="max-width: 200px;" :min="1" :max="1000" :step="1" />
            </div>
            <div class="form-actions">
              <HxButton variant="primary" @click="createKey">创建</HxButton>
            </div>
          </HxCard>
        </div>

        <!-- Usage section -->
        <div v-if="activeSection === 'usage'" class="content-section">
          <h2 class="section-title">用量统计 (近 7 天)</h2>

          <HxCard>
            <div class="no-padding">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>请求数</th>
                    <th>输入 Token</th>
                    <th>输出 Token</th>
                    <th>费用 (G币)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in dailyUsage" :key="u.date">
                    <td>{{ u.date }}</td>
                    <td>{{ u.request_count }}</td>
                    <td>{{ u.input_tokens.toLocaleString() }}</td>
                    <td>{{ u.output_tokens.toLocaleString() }}</td>
                    <td class="cell-cost">{{ u.total_cost.toFixed(4) }}</td>
                  </tr>
                  <tr v-if="!dailyUsage || dailyUsage.length === 0">
                    <td colspan="5" class="empty-cell">暂无数据</td>
                  </tr>
                </tbody>
              </table>
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

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <HxBadge variant="blue">对话</HxBadge>
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
              <HxBadge variant="green">上下文</HxBadge>
              <span>上下文压缩</span>
            </template>
            <div class="form-row">
              <label class="form-label">最大回合数</label>
              <HxInput v-model.number="agentSettings.maxTurns" type="number" style="max-width: 120px;" :min="1" :max="50" :step="1" />
              <span class="form-help">单次对话最大往返次数</span>
            </div>
            <div class="form-row">
              <label class="form-label">压缩阈值</label>
              <HxInput v-model.number="agentSettings.compressionThreshold" type="number" step="0.05" min="0.1" max="0.95" style="max-width: 120px;" :showNumberControls="true" />
              <span class="form-help">触发压缩的记忆阈值</span>
            </div>
            <div class="form-row">
              <label class="form-label">压缩目标</label>
              <HxInput v-model.number="agentSettings.compressionTarget" type="number" step="0.05" min="0.05" max="0.5" style="max-width: 120px;" :showNumberControls="true" />
              <span class="form-help">压缩后目标大小比例</span>
            </div>
            <div class="form-actions">
              <HxButton variant="primary" @click="saveAgentSettings">保存</HxButton>
            </div>
          </HxCard>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <HxBadge variant="purple">记忆</HxBadge>
              <span>持久记忆</span>
            </template>
            <div class="form-row">
              <label class="form-label">记忆系统</label>
              <HxToggle v-model="agentSettings.memoryEnabled" :label="agentSettings.memoryEnabled ? '已启用' : '已禁用'" />
            </div>
            <div class="form-row">
              <label class="form-label">用户画像</label>
              <HxToggle v-model="agentSettings.userProfileEnabled" :label="agentSettings.userProfileEnabled ? '已启用' : '已禁用'" />
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveAgentSettings">保存设置</HxButton>
            <span v-if="agentSaveOk" class="save-feedback">已保存</span>
          </div>
        </div>

        <!-- ===== 终端设置 ===== -->
        <div v-if="activeSection === 'terminal'" class="content-section">
          <h2 class="section-title">终端设置</h2>

          <HxCard style="margin-bottom: 16px;">
            <div class="form-row">
              <label class="form-label">终端后端</label>
              <HxSelect v-model="terminalSettings.backend" style="max-width: 200px;">
                <option value="local">本地 (local)</option>
                <option value="docker">Docker</option>
                <option value="ssh">SSH 远程</option>
              </HxSelect>
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
              <HxSelect v-model="terminalSettings.approvalMode" style="max-width: 200px;">
                <option value="manual">手动审批 (manual)</option>
                <option value="smart">智能审批 (smart)</option>
                <option value="off">关闭审批 (YOLO)</option>
              </HxSelect>
              <p class="form-hint">危险命令的审批方式</p>
            </div>
          </HxCard>

          <HxCard v-if="terminalSettings.backend === 'ssh'" style="margin-bottom: 16px;">
            <template #header>
              <HxBadge variant="orange">SSH</HxBadge>
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
              <HxBadge variant="cyan">Docker</HxBadge>
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
              <HxSelect v-model="displaySettings.showReasoning" style="max-width: 200px;">
                <option value="none">不显示</option>
                <option value="show">展开显示</option>
                <option value="hide">折叠显示</option>
              </HxSelect>
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
          </div>
        </div>

        <!-- ===== 语音设置 ===== -->
        <div v-if="activeSection === 'voice'" class="content-section">
          <h2 class="section-title">语音设置</h2>

          <HxCard style="margin-bottom: 16px;">
            <template #header>
              <HxBadge variant="green">STT</HxBadge>
              <span style="margin-left:8px;">语音转文字</span>
            </template>
            <div class="form-row">
              <label class="form-label">启用 STT</label>
              <HxToggle v-model="voiceSettings.sttEnabled" :label="voiceSettings.sttEnabled ? '已启用' : '已禁用'" />
            </div>
            <div class="form-row">
              <label class="form-label">STT 提供商</label>
              <HxSelect v-model="voiceSettings.sttProvider" style="max-width: 200px;">
                <option value="local">本地 Whisper (免费)</option>
                <option value="groq">Groq Whisper</option>
                <option value="openai">OpenAI Whisper</option>
                <option value="mistral">Mistral Voxtral</option>
              </HxSelect>
            </div>
            <div v-if="voiceSettings.sttProvider === 'local'" class="form-row">
              <label class="form-label">Whisper 模型</label>
              <HxSelect v-model="voiceSettings.whisperModel" style="max-width: 200px;">
                <option value="tiny">tiny (最快)</option>
                <option value="base">base (推荐)</option>
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large-v3">large-v3 (最准)</option>
              </HxSelect>
            </div>
          </HxCard>

          <HxCard>
            <template #header>
              <HxBadge variant="purple">TTS</HxBadge>
              <span style="margin-left:8px;">文字转语音</span>
            </template>
            <div class="form-row">
              <label class="form-label">TTS 提供商</label>
              <HxSelect v-model="voiceSettings.ttsProvider" style="max-width: 200px;">
                <option value="edge">Edge TTS (免费)</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="openai">OpenAI TTS</option>
                <option value="minimax">MiniMax</option>
                <option value="mistral">Mistral</option>
              </HxSelect>
            </div>
            <div v-if="voiceSettings.ttsProvider !== 'edge'" class="form-row">
              <label class="form-label">TTS API Key</label>
              <HxInput v-model="voiceSettings.ttsApiKey" type="password" placeholder="API Key" />
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveVoiceSettings">保存设置</HxButton>
            <span v-if="voiceSaveOk" class="save-feedback">已保存</span>
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
              <HxBadge variant="red">网站</HxBadge>
              <span style="margin-left:8px;">访问限制</span>
            </template>
            <div class="form-row">
              <label class="form-label">网站黑名单</label>
              <HxTextarea v-model="securitySettings.blocklist" :rows="3" placeholder="每行一个域名，如：&#10;example.com&#10;malware.test"></HxTextarea>
              <p class="form-hint">Agent 禁止访问的域名列表</p>
            </div>
          </HxCard>

          <HxCard>
            <template #header>
              <HxBadge variant="orange">工具</HxBadge>
              <span style="margin-left:8px;">工具权限</span>
            </template>
            <div class="form-row" v-for="ts in toolsetList" :key="ts.id">
              <label class="form-label">{{ ts.label }}</label>
              <HxToggle v-model="ts.enabled" :label="ts.enabled ? '启用' : '禁用'" />
            </div>
          </HxCard>

          <div class="form-actions" style="margin-top: 16px;">
            <HxButton variant="primary" @click="saveSecuritySettings">保存设置</HxButton>
            <span v-if="securitySaveOk" class="save-feedback">已保存</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGfwStore } from '../stores/gfw'
import { useChatStore } from '../stores/chat'
import { storeToRefs } from 'pinia'
import { hermesConfigSet, hermesToolsList, hermesToolsEnable, hermesToolsDisable, hermesMemoryGet, hermesMemoryEdit } from '../api'
import IconUser from '../components/icons/IconUser.vue'
import IconSettings from '../components/icons/IconSettings.vue'
import { HxButton, HxInput, HxTextarea, HxSelect, HxToggle, HxCard, HxBadge, HxModal } from '../components/ui'
import { useToast } from '../composables/useToast'

const toast = useToast()

const gfwStore = useGfwStore()
const chatStore = useChatStore()

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
const activeSection = ref('account')

// 设置导航搜索
const searchQuery = ref('')
const navItems = [
  { key: 'account', label: '账户', keywords: '登录 注册 余额 密码 邮箱 账号', icon: 'IconUser' },
  { key: 'model', label: '模型设置', keywords: 'API 提供商 模型 provider 同步 连接测试 自定义 GFW', icon: 'IconSettings' },
  { key: 'agent', label: 'Agent', keywords: '轮次 系统提示 上下文压缩 记忆 用户档案 max turns', icon: '' },
  { key: 'terminal', label: '终端', keywords: '后端 超时 审批模式 SSH Docker 工作目录 timeout', icon: '' },
  { key: 'display', label: '显示', keywords: '工具进度 推理过程 费用 markdown 代码高亮 语法', icon: '' },
  { key: 'voice', label: '语音', keywords: 'STT TTS 语音识别 语音合成 Whisper Edge ElevenLabs', icon: '' },
  { key: 'security', label: '安全', keywords: '密钥 PII 脱敏 屏蔽 站点黑名单 工具开关 redaction', icon: '' },
  { key: 'apikeys', label: 'API Key', keywords: '密钥管理 创建 删除 限额', icon: '' },
  { key: 'usage', label: '用量统计', keywords: '统计 日报 消耗 调用次数 token', icon: '' },
  { key: 'recharge', label: '充值', keywords: '套餐 支付 价格 余额 购买', icon: '' },
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

// GFW 模型列表
const gfwApiKey = ref(localStorage.getItem('gfw_api_key') || '')
const gfwModels = ref<any[]>([])
const gfwSyncing = ref(false)
const selectedProvider = ref('')

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
    iconKey: 'OpenAI'
  },
  {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-20250514',
    iconKey: 'Anthropic'
  },
  {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    iconKey: 'DeepSeek'
  },
  {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.5-pro',
    iconKey: 'Google Gemini'
  },
  {
    name: 'xAI / Grok',
    baseUrl: 'https://api.x.ai/v1',
    model: 'grok-3',
    iconKey: 'xAI / Grok'
  },
  {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o',
    iconKey: 'OpenRouter'
  },
  {
    name: 'Qwen (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-plus',
    iconKey: 'Qwen (DashScope)'
  },
  {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    iconKey: 'Groq'
  },
  {
    name: 'Hugging Face',
    baseUrl: 'https://api-inference.huggingface.co/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    iconKey: 'Hugging Face'
  },
  {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    model: 'MiniMax-M1',
    iconKey: 'MiniMax'
  },
  {
    name: 'Kimi / Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-auto',
    iconKey: 'Kimi / Moonshot'
  },
  {
    name: 'Z.AI / GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-plus',
    iconKey: 'Z.AI / GLM'
  },
  {
    name: 'Ollama (本地)',
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3',
    iconKey: 'Ollama (本地)'
  },
  {
    name: 'vLLM',
    baseUrl: 'http://localhost:8000/v1',
    model: 'meta-llama/Llama-3.2-1B-Instruct',
    iconKey: 'vLLM'
  },
  {
    name: 'LM Studio',
    baseUrl: 'http://localhost:1234/v1',
    model: 'local-model',
    iconKey: 'LM Studio'
  },
  {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    iconKey: 'Together AI'
  },
  {
    name: 'Anyscale',
    baseUrl: 'https://api.endpoints.anyscale.com/v1',
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    iconKey: 'Anyscale'
  },
  {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    model: 'sonar-pro',
    iconKey: 'Perplexity'
  },
  {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    model: 'mistral-large-latest',
    iconKey: 'Mistral AI'
  },
  {
    name: 'Cohere',
    baseUrl: 'https://api.cohere.com/v1',
    model: 'command-r-plus',
    iconKey: 'Cohere'
  },
  {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    model: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
    iconKey: 'Fireworks AI'
  },
  {
    name: 'Replicate',
    baseUrl: 'https://openai-proxy.replicate.com/v1',
    model: 'meta/meta-llama-3-8b-instruct',
    iconKey: 'Replicate'
  },
  {
    name: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-8b-instruct',
    iconKey: 'NVIDIA NIM'
  },
  {
    name: 'IBM Watsonx',
    baseUrl: 'https://eu-de.ml.cloud.ibm.com/ml/v1-beta/watsonx/ai',
    model: 'meta-llama/llama-3-8b-instruct',
    iconKey: 'IBM Watsonx'
  },
  {
    name: 'Azure OpenAI',
    baseUrl: 'https://{resource-name}.openai.azure.com/openai',
    model: 'gpt-4o',
    iconKey: 'Azure OpenAI'
  },
  {
    name: 'Amazon Bedrock',
    baseUrl: 'https://bedrock-runtime.{region}.amazonaws.com',
    model: 'anthropic.claude-3-sonnet-20240229-v1:0',
    iconKey: 'Amazon Bedrock'
  },
  {
    name: 'Cloudflare AI',
    baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1',
    model: '@cf/meta/llama-3-8b-instruct',
    iconKey: 'Cloudflare AI'
  },
  {
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    model: 'llama3.1-8b',
    iconKey: 'Cerebras'
  },
  {
    name: 'FriendliAI',
    baseUrl: 'https://api.friendli.ai/v1',
    model: 'llama-3-8b',
    iconKey: 'FriendliAI'
  },
  {
    name: 'Novita AI',
    baseUrl: 'https://api.novita.ai/v1',
    model: 'meta-llama/llama-3-8b-instruct',
    iconKey: 'Novita AI'
  },
  {
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    model: 'Meta-Llama-3.1-8B-Instruct',
    iconKey: 'SambaNova'
  }
]

const customUpstream = ref<string>(
  providerPresets.find(p => p.name === customProvider.value.name)?.name || '__manual__'
)

// 实时从上游 /models 接口获取的模型列表
const upstreamModels = ref<string[]>([])
const upstreamModelsSyncing = ref(false)
const upstreamModelsError = ref('')

async function fetchUpstreamModels() {
  const baseUrl = customBaseUrl.value
  const apiKey = customApiKey.value
  if (!baseUrl) { upstreamModelsError.value = '请先填写 API Base URL'; return }
  if (!apiKey) { upstreamModelsError.value = '请先填写 API Key'; return }

  upstreamModelsSyncing.value = true
  upstreamModelsError.value = ''

  try {
    const isDev = import.meta.env?.DEV ?? false
    let fetchUrl = `${baseUrl}/models`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
    }
    // Wails 模式或开发模式下通过 Go 后端代理避免跨域
    // 判断：如果是外部 URL 且当前 origin 不是该 URL 的 origin，则走代理
    if (baseUrl.startsWith('http')) {
      try {
        const targetOrigin = new URL(baseUrl).origin
        if (targetOrigin !== window.location.origin) {
          headers['x-proxy-target'] = baseUrl
          fetchUrl = '/proxy/custom/models'
        }
      } catch (_) {}
    }

    const r = await fetch(fetchUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    })
    if (!r.ok) {
      upstreamModelsError.value = `HTTP ${r.status}: 获取模型列表失败`
      return
    }
    const body = await r.json()
    const modelList: string[] = (body.data || [])
      .map((m: any) => m.id || m.model || '')
      .filter((id: string) => id)
      .sort()
    if (modelList.length === 0) {
      upstreamModelsError.value = '未获取到模型列表'
      return
    }
    upstreamModels.value = modelList
    // 如果当前选的模型不在列表中，自动选第一个
    if (!modelList.includes(customModel.value)) {
      customModel.value = modelList[0]
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    upstreamModelsError.value = `获取失败: ${msg}`
  } finally {
    upstreamModelsSyncing.value = false
  }
}

function selectUpstream(preset: { name: string; baseUrl: string; model: string }) {
  customUpstream.value = preset.name
  customName.value = preset.name
  customBaseUrl.value = preset.baseUrl
  customModel.value = preset.model
  // 切换上游时清空之前获取的模型列表
  upstreamModels.value = []
  upstreamModelsError.value = ''
}

async function testConnection() {
  testing.value = true
  testResult.value = null

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
      testResult.value = { ok: true, message: `连接成功! 模型: ${model}` }
      toast.success('连接成功', `模型: ${model}`)
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
      testResult.value = { ok: false, message: `连接失败: ${msg}` }
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

async function saveAgentSettings() {
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
    toast.success('Agent 设置已保存')
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

async function saveTerminalSettings() {
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
    toast.success('终端设置已保存')
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

async function saveDisplaySettings() {
  const s = displaySettings.value
  try {
    await Promise.all([
      hermesConfigSet('display.tool_progress', String(s.showToolProgress)),
      hermesConfigSet('display.show_reasoning', s.showReasoning),
      hermesConfigSet('display.show_cost', String(s.showCost)),
    ])
    displaySaveOk.value = true
    setTimeout(() => { displaySaveOk.value = false }, 2000)
    toast.success('显示设置已保存')
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

async function saveVoiceSettings() {
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
    toast.success('语音设置已保存')
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

async function saveSecuritySettings() {
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
    toast.success('安全设置已保存')
  } catch (e: any) {
    toast.error('保存失败', e?.message)
  }
}

// 从真实 Hermes API 加载 toolset 开关状态
async function loadToolsets() {
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
  loadToolsets()
  loadConfigValues()
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

.provider-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  box-shadow: var(--glow-md);
}

.provider-tab.active {
  border-color: rgba(10,132,255,0.6);
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  box-shadow: 
    0 0 12px rgba(10,132,255,0.25),
    inset 0 0 8px rgba(10,132,255,0.05);
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: var(--primary);
  border-color: var(--primary);
  color: white;
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
  animation: fadeIn 0.2s ease;
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
</style>
