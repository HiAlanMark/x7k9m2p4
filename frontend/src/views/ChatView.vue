<template>
  <div class="chat-view">
    <!-- Empty state -->
    <div v-if="messages.length === 0 && !isStreaming && !isConnecting" class="messages messages-empty">
      <div class="empty-bg" aria-hidden="true">
        <div class="empty-orb empty-orb-1"></div>
        <div class="empty-orb empty-orb-2"></div>
        <div class="empty-orb empty-orb-3"></div>
        <div class="empty-grid"></div>
      </div>
      <div class="empty-inner">
        <!-- Large Logo -->
        <div class="empty-logo hero-fade-in hero-fade-in-1">
          <img src="@/../public/logo.svg" alt="Hi!XNS" />
          <div class="logo-glow"></div>
        </div>
        <!-- Welcome text -->
        <p class="empty-welcome hero-fade-in hero-fade-in-1">你的全能 AI 助手，随时为你效劳</p>
        <!-- Category tabs -->
        <div class="quick-categories hero-fade-in hero-fade-in-2">
          <button
            v-for="cat in quickCategories"
            :key="cat.id"
            class="quick-cat-btn"
            :class="{ active: activeQuickCat === cat.id }"
            @click="activeQuickCat = cat.id"
          >
            <span class="quick-cat-icon" v-html="cat.icon"></span>
            <span class="quick-cat-name">{{ cat.name }}</span>
          </button>
        </div>
        <!-- Quick Actions Grid -->
        <div class="quick-bento hero-fade-in hero-fade-in-2">
          <div
            v-for="item in activeQuickItems"
            :key="item.label"
            class="quick-bento-card"
            @click="quickAsk(item.prompt)"
          >
            <div class="quick-bento-icon" v-html="item.icon"></div>
            <div class="quick-bento-text">
              <span class="quick-bento-label">{{ item.label }}</span>
              <span class="quick-bento-desc">{{ item.desc }}</span>
            </div>
          </div>
        </div>
        <!-- Status -->
        <div class="empty-status hero-fade-in hero-fade-in-3">
          <span class="empty-status-dot" :class="appStore.connectionState"></span>
          <span class="empty-status-text">{{ appStore.connectionState === 'connected' ? '已就绪' : appStore.connectionState === 'connecting' ? '连接中...' : '等待连接' }}</span>
        </div>
      </div>
    </div>

    <!-- Messages with virtual scrolling -->
    <DynamicScroller
      v-show="messages.length > 0 || isStreaming || isConnecting"
      ref="scrollerRef"
      :items="scrollerItems"
      :min-item-size="54"
      key-field="id"
      class="messages"
      @click="onMessagesClick"
      @contextmenu.prevent="showBodyContextMenu"
    >
      <template #default="{ item: msg, index: idx, active }">
        <DynamicScrollerItem
          :item="msg"
          :active="active"
          :size-dependencies="[
            msg.content,
            msg.tool_calls,
            msg.role === 'streaming' ? currentResponse : null,
            msg.role === 'streaming' ? currentToolCalls : null,
            msg.role === 'streaming' ? agentStatus : null,
            msg.role === 'streaming' ? pendingApproval : null
          ]"
          :data-index="idx"
        >
          <!-- System message -->
          <div v-if="msg.role === 'system'" class="sys-line">
            <span class="sys-badge">
              <svg class="sys-icon" width="12" height="12" viewBox="0 0 1024 1024" fill="currentColor"><path d="M511.914667 85.333333c-235.52 0-426.666667 191.146667-426.666667 426.666667s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666666-426.666667-191.146667-426.666667-426.666666-426.666667z m0 768c-188.586667 0-341.333333-152.746667-341.333334-341.333333s152.746667-341.333333 341.333334-341.333333 341.333333 152.746667 341.333333 341.333333-152.746667 341.333333-341.333333 341.333333z"/><path d="M512 640c-35.2 0-64 28.8-64 64S476.8 768 512 768s64-28.8 64-64S547.2 640 512 640z"/><path d="M512 256c-36.906667 0-66.176 29.269333-63.872 63.872l15.616 234.88c1.621333 23.936 22.741333 42.581333 48.256 42.581333s46.634667-18.645333 48.213333-42.581333l15.658667-234.88C578.176 285.269333 548.906667 256 512 256z"/></svg>
              <span class="sys-text">{{ msg.content }}</span>
            </span>
          </div>

          <!-- Streaming: AI Card Structure -->
          <div v-else-if="msg.role === 'streaming'" class="msg-wrapper assistant streaming">
            <div class="msg-card ai-card glass-glow">
              <div class="card-header">
                <span class="author-badge"><span class="ai-dot pulsing"></span> Hi!XNS</span>
                <span class="meta-info">
                  <span v-if="agentIteration > 0" class="meta-tag">第 {{ agentIteration }}/{{ agentMaxIter }} 轮</span>
                  <span class="meta-dot"></span>
                  <span>思考中...</span>
                </span>
              </div>

              <!-- Thinking State -->
              <div v-if="agentStatus && !currentResponse && !currentToolCalls.length" class="thinking-state">
                <div class="thinking-dots">
                  <span></span><span></span><span></span>
                </div>
                <span class="status-text">{{ agentStatus }}</span>
              </div>

              <div v-if="!currentResponse && !currentToolCalls.length && !agentStatus" class="thinking-state">
                <div class="thinking-dots">
                  <span></span><span></span><span></span>
                </div>
                <span class="status-text">{{ t('chatView.thinking') }}</span>
              </div>

              <!-- Approval -->
              <div v-if="pendingApproval" class="approval-card">
                <div class="approval-header">
                  <svg width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 42.666667C253.312 42.666667 42.666667 253.312 42.666667 512s210.645333 469.333333 469.333333 469.333333 469.333333-210.645333 469.333333-469.333333S770.688 42.666667 512 42.666667z m0 85.333333c212.565333 0 384 171.434667 384 384s-171.434667 384-384 384-384-171.434667-384-384 171.434667-384 384-384z"/><path d="M512 298.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v170.666667a42.666667 42.666667 0 0 0 42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667-42.666667V341.333333a42.666667 42.666667 0 0 0-42.666667-42.666666zM512 640a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666666h0.426667a42.666667 42.666667 0 0 0 42.666666-42.666666 42.666667 42.666667 0 0 0-42.666666-42.666667z"/></svg>
                  <span>{{ t('chatView.authorizationRequired') }}</span>
                </div>
                <div class="approval-body">
                  <div class="approval-cmd">
                    <span class="approval-label">{{ t('chatView.command') }}</span>
                    <code>{{ pendingApproval.command }}</code>
                  </div>
                  <div class="approval-reason">{{ pendingApproval.reason }}</div>
                </div>
                <HxTextarea v-model="approvalReply" :placeholder="t('chatView.replyFeedbackPlaceholder')" :rows="2" variant="default" />
                <div class="approval-actions">
                  <button class="approve-btn" @click="approveCommand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{{ t('chatView.allowExecution') }}</span>
                  </button>
                  <button class="reply-btn" @click="replyApproval">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>{{ t('chatView.replyBtn') }}</span>
                  </button>
                  <button class="deny-btn" @click="denyCommand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span>{{ t('chatView.deny') }}</span>
                  </button>
                </div>
              </div>

              <!-- Response Content -->
              <template v-if="currentResponse">
                <div class="card-content markdown-body" :class="{ streaming: isStreaming }" v-html="renderMarkdown(currentResponse)"></div>
              </template>

              <!-- Streaming Tools -->
              <div v-if="currentToolCalls.length" class="tool-streaming">
                <div v-for="(tc, i) in currentToolCalls" :key="i" class="tool-item active">
                  <div class="tool-header">
                    <span v-if="tc.status === 'running'" class="tool-spinner-sm"></span>
                    <span v-else :class="['tool-status', tc.status]"></span>
                    <span class="tool-name">{{ tc.tool }}</span>
                    <span class="tool-label">{{ toolStatusLabel(tc.status) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connecting -->
          <div v-else-if="msg.role === 'connecting'" class="connecting">
            <div class="connecting-dots">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
            <span>正在连接 Agent...</span>
          </div>

          <!-- User/Assistant message -->
          <div v-else-if="msg.role === 'user' || msg.role === 'assistant' || (msg.content && msg.content.trim())" class="msg-wrapper" :class="msg.role">
            
            <!-- User Message: Right-aligned Glass Bubble -->
            <div v-if="msg.role === 'user'" class="msg-bubble user-bubble">
              <div class="msg-content user-content">{{ msg.content }}</div>
              <div class="msg-time user-time">{{ formatTime(msg.timestamp) }}</div>
            </div>

            <!-- AI Message: Left-aligned Glass Card -->
            <div v-else class="msg-card ai-card">
              <div class="card-header">
                <span class="author-badge"><span class="ai-dot"></span> Hi!XNS</span>
                <span class="meta-info">
                  <span v-if="msg.model" class="meta-tag">{{ msg.model }}</span>
                  <template v-if="msg.duration_ms">
                    <span class="meta-dot"></span>
                    <span class="timing-badge" :title="timingTooltip(msg)">
                      <span v-if="msg.ttft_ms" class="timing-ttft">TTFT {{ msg.ttft_ms }}ms</span>
                      <span v-if="msg.ttft_ms" class="timing-sep">→</span>
                      <span v-if="msg.tool_time_ms" class="timing-tool">🔧{{ (msg.tool_time_ms / 1000).toFixed(1) }}s</span>
                      <span v-if="msg.tool_time_ms" class="timing-sep">→</span>
                      <span>{{ (msg.duration_ms / 1000).toFixed(1) }}s</span>
                    </span>
                  </template>
                </span>
              </div>

              <div class="card-content markdown-body" v-html="renderMarkdown(msg.content)"></div>

              <!-- Tool calls: Accordion -->
              <div v-if="msg.tool_calls && msg.tool_calls.length" class="tool-accordion">
                <div v-for="(tc, i) in msg.tool_calls" :key="i" class="tool-item">
                  <div class="tool-header" @click="(tc as any)._open = !(tc as any)._open">
                    <span class="tool-tri">{{ ((tc as any)._open != null ? (tc as any)._open : toolTraceVisible) ? '▾' : '▸' }}</span>
                    <span :class="['tool-status', tc.status]"></span>
                    <span class="tool-name">{{ tc.tool }}</span>
                    <span class="tool-label">{{ tc.status === 'completed' ? t('chatView.completed') : tc.status === 'failed' ? t('chatView.failed') : t('chatView.running') }}</span>
                  </div>
                  <div v-if="((tc as any)._open != null ? (tc as any)._open : toolTraceVisible)" class="tool-body">
                    <div v-if="tc.input" class="tool-section">
                      <div class="tool-label-sm">{{ t('chatView.inputLabel') }}</div>
                      <pre class="tool-json">{{ formatJson(tc.input) }}</pre>
                    </div>
                    <div v-if="tc.output" class="tool-section">
                      <div class="tool-label-sm">{{ t('chatView.outputLabel') }}</div>
                      <pre class="tool-json">{{ tc.output }}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <span v-if="msg.token_usage" class="footer-tokens">
                  <span class="token-item">{{ t('chatView.inputLabel') }} {{ (msg.token_usage.prompt_tokens || 0).toLocaleString() }}</span>
                  <span class="token-item">{{ t('chatView.outputLabel') }} {{ (msg.token_usage.completion_tokens || 0).toLocaleString() }}</span>
                </span>
                <div class="action-group">
                  <button class="action-icon" @click="copyMessage(msg.content)" :title="t('chatView.copy')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button class="action-icon" @click="regenerateMessage(idx)" :disabled="isStreaming" :title="t('chatView.regenerate')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <div class="input-area">
      <!-- Upload bar floating above input -->
      <div class="upload-bar">
        <button @click="triggerFileUpload" class="upload-btn" :title="t('chatView.uploadFile')">
          <svg width="18" height="14" viewBox="0 0 1329 1024" fill="currentColor"><path d="M1036.572 951.784h-780.721c-62.416 0-113.411-47.899-115.072-107.38l-78.125-495.818v-2.735c0-60.873 51.662-110.396 115.164-110.396h14.961v-63.036c0-60.873 51.651-110.396 115.13-110.396h234.199c42.067 0 105.428 34.714 140.178 74.338h302.237c48.717 0 161.228 35.661 166.943 104.891 45.468 14.762 78.311 56.069 78.311 104.599v2.747l-78.137 495.807c-1.659 59.493-52.643 107.38-115.072 107.38zM136.887 343.559l78.008 495.07v2.747c0 21.109 18.374 38.279 40.957 38.279h780.721c22.582 0 40.957-17.17 40.957-38.279v-2.747l78.008-495.07c-1.274-20.046-19.146-35.989-40.932-35.989h-37.075v-59.903c-1.823-3.846-12.027-14.026-34.48-24.113-23.096-10.357-46.52-15.078-58.536-15.078h-341.532l-10.87-17.147c-17.953-28.368-70.714-57.191-90-57.191h-234.199c-22.593 0-40.968 17.182-40.968 38.279v135.152h-89.135c-21.775 0-39.647 15.942-40.921 36z"/><path d="M100.875 306.542h1086.428v69.779h-1086.428z"/></svg>
        </button>
        <button class="toolbar-btn" @click="toggleBlueprintPicker" :title="t('chatView.attachBlueprint')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </button>
        <button class="toolbar-btn tool-trace-btn" :class="{ active: toolTraceVisible }" @click="toggleToolTrace" :title="t('chat.toolTraceHint')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </button>
        <input 
          type="file" 
          ref="fileInputRef" 
          @change="handleFileSelect" 
          multiple 
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.json,.yaml,.yml,.csv,.xml,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp4,.webm,.avi,.mov,.mkv"
          class="file-input-hidden"
        />
        
        <!-- File Previews to the right of upload button -->
        <template v-if="attachedFiles.length > 0">
          <span v-for="(file, index) in attachedFiles.slice(0, 6)" :key="file.id" class="file-chip" :class="{ 'has-text': file.extractedText }">
            <span class="file-chip-name">{{ file.file.name }}</span>
            <span v-if="file.extractedText" class="file-chip-badge" :title="t('chatView.fileExtracted')">✎</span>
            <button @click="removeFile(index)" class="file-chip-remove" :title="t('chatView.removeFile')">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </span>
          <span v-if="attachedFiles.length > 6" class="file-overflow">+{{ attachedFiles.length - 6 }}</span>
        </template>
      </div>

      <!-- Blueprint context indicator -->
<!-- REMOVED BLUEPRINT BLOCK -->
      <div v-if="blueprintRunId" class="blueprint-context-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span>{{ t('chatView.blueprintContext') }}: {{ blueprintRunId.slice(0, 8) }}...</span>
        <button class="clear-context-btn" @click="chatStore.blueprintRunId = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
<!-- END REMOVED BLUEPRINT BLOCK -->

      <div class="fab-anchor">
        <transition name="fab-fade">
          <button v-if="showScrollBtn" class="scroll-fab" @click="scrollToBottom(true)" :title="t('chatView.scrollDown')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </transition>

        <!-- Blueprint run picker dropdown -->
<!-- REMOVED BLUEPRINT BLOCK -->
        <div v-if="showBlueprintPicker" class="blueprint-picker-dropdown">
          <div v-if="blueprintRuns.length === 0" class="bp-picker-empty">
            {{ t('chatView.noBlueprintRuns') }}
          </div>
          <div v-for="run in blueprintRuns" :key="run.id" class="bp-picker-item" @click="selectBlueprintRun(run)">
            <span class="bp-picker-name">{{ run.blueprint_name || run.blueprint_id?.slice(0, 8) }}</span>
            <span class="bp-picker-status" :class="'status-' + run.status">{{ run.status }}</span>
          </div>
        </div>
<!-- END REMOVED BLUEPRINT BLOCK -->

        <div class="input-capsule" :class="{ focused: inputFocused }">
        
        <HxTextarea
          ref="chatInputRef"
          v-model="inputText"
          variant="chat"
          inline
          autoResize
          :maxHeight="120"
          placeholder="输入任何问题，或试试上面的快捷操作..."
          :rows="1"
          @keydown="onChatKeydown"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @contextmenu.prevent="showContextMenu"
        />
        
        <button @click="onSendClick" :disabled="!inputText.trim() && attachedFiles.length === 0" class="send-btn">
          <svg class="send-arrow" width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M853.333333 128a42.666667 42.666667 0 0 0-42.666666 42.666667v298.666666c0 71.210667-56.789333 128-128 128H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666667h512c117.632 0 213.333333-95.701333 213.333333-213.333334V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z"/><path d="M384 384a42.666667 42.666667 0 0 0-30.165333 12.501333l-213.333334 213.333334a42.666667 42.666667 0 0 0 0 60.330666l213.333334 213.333334a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330667L231.168 640l182.997333-182.997333a42.666667 42.666667 0 0 0 0-60.330667A42.666667 42.666667 0 0 0 384 384z"/></svg>
        </button>
        <button @click="onCancelClick" class="cancel-btn" v-if="isStreaming">
          <span>{{ t('chatView.stop') }}</span>
          <svg class="cancel-icon" width="10" height="10" viewBox="0 0 1024 1024" fill="currentColor"><path d="M213.333333 85.333333C143.146667 85.333333 85.333333 143.146667 85.333333 213.333333v597.333334c0 70.186667 57.813333 128 128 128h597.333334c70.186667 0 128-57.813333 128-128V213.333333c0-70.186667-57.813333-128-128-128z"/></svg>
        </button>
      </div>
      </div>
      <div class="input-status">
        <span class="status-pill" :class="{ streaming: isStreaming }">{{ isStreaming ? `生成中 ${streamElapsed}s` : '就绪' }}</span>
        <button v-if="messages.length > 0" class="status-detail-toggle" @click="showStatusDetail = !showStatusDetail">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
        <template v-if="showStatusDetail">
          <span class="status-dot-sep">·</span>
          <span class="status-pill">{{ chatStore.getActiveConfig().model || '未选择模型' }}</span>
          <span class="status-dot-sep">·</span>
          <span class="status-pill" :class="chatStore.providerMode === 'custom' ? 'warning' : 'success'">{{ chatStore.providerMode === 'custom' ? '自定义' : 'gfw.net' }}</span>
          <span v-if="tokenEstimate > 0" class="status-dot-sep">·</span>
          <span v-if="tokenEstimate > 0" class="status-pill" :class="{ warning: tokenEstimate > compressionThreshold }" :title="t('compression.thresholdHint')">{{ formatTokenCount(tokenEstimate) }} / {{ formatTokenCount(compressionThreshold) }}</span>
        </template>
        <span class="status-spacer"></span>
        <button v-if="messages.length > 0" class="export-btn" @click="exportChat" :title="t('chatView.exportMarkdown')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>导出</span>
        </button>
      </div>
    </div>
    <!-- Context menu -->
    <div v-if="ctxMenu.show" class="ctx-menu" :style="{ top: ctxMenu.y + 'px', left: ctxMenu.x + 'px' }" @click.stop @contextmenu.prevent>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'body'" @click="ctxBodyCopy" class="ctx-item">{{ t('chatView.copy') }}</button>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxCopy" class="ctx-item">{{ t('chatView.copy') }}</button>
      <button v-if="ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxCut" class="ctx-item">{{ t('chatView.cut') }}</button>
      <button v-if="ctxMenu.hasContent && !ctxMenu.hasSelection && ctxMenu.source === 'input'" @click="ctxSelectAll" class="ctx-item">{{ t('chatView.selectAll') }}</button>
      <button v-if="ctxMenu.source === 'input'" @click="ctxPaste" class="ctx-item">{{ t('chatView.paste') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount, reactive, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAppStore } from '../stores/app'
import { useGfwStore } from '../stores/gfw'
/* REMOVED: import { useBlueprintStore } from '@/stores/blueprint' */
import { storeToRefs } from 'pinia'
import { marked, type Tokens } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import sql from 'highlight.js/lib/languages/sql'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import markdown from 'highlight.js/lib/languages/markdown'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import shell from 'highlight.js/lib/languages/shell'

// Register only commonly-used languages to reduce bundle size
const hljsLanguages: Record<string, typeof javascript> = {
  javascript, typescript, python, bash, json, yaml, xml, css,
  sql, go, rust, java, cpp, markdown, dockerfile, shell,
  js: javascript, ts: typescript, py: python, sh: bash, yml: yaml,
  html: xml, svg: xml, c: cpp, cc: cpp, cxx: cpp, hpp: cpp,
  md: markdown, Dockerfile: dockerfile,
}
Object.entries(hljsLanguages).forEach(([name, lang]) => hljs.registerLanguage(name, lang))
// api imports moved to useChatStream composable
import IconSend from '../components/icons/IconSend.vue'
import IconStar from '../components/icons/IconStar.vue'
import IconChat from '../components/icons/IconChat.vue'
import IconSearch from '../components/icons/IconSearch.vue'
import IconStore from '../components/icons/IconStore.vue'
import IconUser from '../components/icons/IconUser.vue'
import { HxTextarea } from '../components/ui'
import IconSettings from '../components/icons/IconSettings.vue'
import IconChevronDown from '../components/icons/IconChevronDown.vue'
import { SpotlightCard, FadeIn, ShinyText } from '../components/fx'
import { HxBadge } from '../components/ui'
import { useToast } from '../composables/useToast'
import { useI18n } from 'vue-i18n'
import { useChatStream } from '../composables/useChatStream'
import { useToolTrace } from '../composables/useToolTrace'
import { useContextCompression } from '../composables/useContextCompression'

const toast = useToast()
const { t } = useI18n()
const chatStream = useChatStream()
const {
  isConnecting, agentStatus, agentIteration, agentMaxIter,
  pendingApproval, approvalReply, streamElapsed,
  startStreaming, stopStreaming, approveCommand, denyCommand,
  replyApproval, cancelExecution, autoGenerateTitle,
} = chatStream
const { toolTraceVisible, toggleToolTrace } = useToolTrace()
const { compressionThreshold, autoCompress, estimateTokens, compressSession } = useContextCompression()

const tokenEstimate = computed(() => {
  const allText = messages.value.map(m => m.content || '').join('')
  return estimateTokens(allText)
})

function formatTokenCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

const chatStore = useChatStore()
const appStore = useAppStore()
const gfwStore = useGfwStore()
/* REMOVED: const blueprintStore = useBlueprintStore() */
const appVersion = __APP_VERSION__
const { messages, isStreaming, currentResponse, currentToolCalls, selectedModel } = storeToRefs(chatStore)

// Virtual scroller items: regular messages + synthetic streaming/connecting items
const scrollerItems = computed(() => {
  const items: any[] = messages.value.map(msg => ({ ...msg }))
  if (isStreaming.value) {
    items.push({ id: '__streaming__', role: 'streaming', content: '', timestamp: new Date().toISOString() })
  }
  if (isConnecting.value) {
    items.push({ id: '__connecting__', role: 'connecting', content: '', timestamp: new Date().toISOString() })
  }
  return items
})

// Blueprint context association — stubs (backend removed)
const showBlueprintPicker = ref(false)
const blueprintRunId = computed(() => chatStore.blueprintRunId || '')
const blueprintRuns = ref<any[]>([])

function toggleBlueprintPicker() {
  showBlueprintPicker.value = !showBlueprintPicker.value
  // blueprint store no longer exists, picker stays empty
}

function selectBlueprintRun(_run: any) {
  showBlueprintPicker.value = false
}

const inputText = ref('')
const showStatusDetail = ref(false)
const scrollerRef = ref<any>(null)
const chatInputRef = ref<InstanceType<typeof HxTextarea> | null>(null)

// Access the underlying <textarea> DOM element from HxTextarea
const nativeTextarea = computed(() => chatInputRef.value?.textarea?.value ?? null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// streamElapsed is now provided by useChatStream composable
// The streaming timer is managed inside the composable

function timingTooltip(msg: any): string {
  const parts: string[] = []
  if (msg.ttft_ms) parts.push(`${t('chatView.timingTtft')}: ${msg.ttft_ms}ms`)
  if (msg.tool_time_ms) parts.push(`${t('chatView.timingTool')}: ${(msg.tool_time_ms / 1000).toFixed(1)}s`)
  if (msg.duration_ms) parts.push(`${t('chatView.timingTotal')}: ${(msg.duration_ms / 1000).toFixed(1)}s`)
  return parts.join('\n')
}

// Context menu state
const ctxMenu = reactive({ show: false, x: 0, y: 0, hasContent: false, hasSelection: false, source: '' as 'input' | 'body' | '' })

function onSendClick() {
  void sendMessage()
}

function onCancelClick() {
  void cancelExecution()
}

function onChatKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    sendMessage()
  }
}

function toolStatusLabel(status: string) {
  const s = status as string
  if (s === 'completed') return t('chatView.completed')
  if (s === 'failed') return t('chatView.failed')
  if (s === 'denied') return t('chatView.denied')
  if (s === 'timeout') return t('chatView.approvalTimeout')
  return t('chatView.executing')
}

function showContextMenu(e: MouseEvent) {
  const ta = nativeTextarea.value as HTMLTextAreaElement | null
  ctxMenu.hasContent = !!ta?.value.length
  ctxMenu.hasSelection = ta ? ta.selectionStart !== ta.selectionEnd : false
  ctxMenu.source = 'input'
  ctxMenu.x = e.clientX
  ctxMenu.y = e.clientY
  ctxMenu.show = true
  nextTick(() => {
    document.addEventListener('click', hideContextMenu, { once: true })
  })
}

function showBodyContextMenu(e: MouseEvent) {
  const sel = window.getSelection()
  const hasText = !!(sel && sel.toString().trim())
  if (!hasText) return  // 没有选中文字时不显示菜单
  ctxMenu.hasSelection = true
  ctxMenu.hasContent = false
  ctxMenu.source = 'body'
  ctxMenu.x = e.clientX
  ctxMenu.y = e.clientY
  ctxMenu.show = true
  nextTick(() => {
    document.addEventListener('click', hideContextMenu, { once: true })
  })
}

function hideContextMenu() {
  ctxMenu.show = false
}

function ctxCopy() {
  const ta = nativeTextarea.value as HTMLTextAreaElement | null
  if (!ta) return
  ta.focus()
  try { document.execCommand('copy') } catch {}
  hideContextMenu()
}

function ctxBodyCopy() {
  try { document.execCommand('copy') } catch {}
  hideContextMenu()
}

function ctxCut() {
  const ta = nativeTextarea.value as HTMLTextAreaElement | null
  if (!ta) return
  ta.focus()
  try { document.execCommand('cut') } catch {}
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  hideContextMenu()
}

function ctxPaste() {
  const ta = nativeTextarea.value as HTMLTextAreaElement | null
  if (!ta) return
  hideContextMenu()
  if (navigator.clipboard?.readText) {
    navigator.clipboard.readText().then(text => {
      if (text) {
        ta.focus()
        const start = ta.selectionStart
        const end = ta.selectionEnd
        ta.setRangeText(text, start, end, 'end')
        ta.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }).catch(() => { /* 非 HTTPS 环境不可用，请用 Ctrl+V */ })
  }
}

function ctxSelectAll() {
  const ta = nativeTextarea.value as HTMLTextAreaElement | null
  ta?.select()
  hideContextMenu()
}
const attachedFiles = ref<Array<{ id: string; file: File; type: string; name: string; size: number; extractedText?: string }>>([])
// agentStatus, agentIteration, agentMaxIter, pendingApproval, approvalReply, isConnecting
// are now provided by useChatStream composable
const inputFocused = ref(false)
const showScrollBtn = ref(false)

// Configure marked with highlight.js
const renderer = new marked.Renderer()
renderer.code = function({ text, lang }: Tokens.Code) {
  const language = lang && hljs.getLanguage(lang) ? lang : ''
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value
  const displayLang = lang || 'text'
  
  // Generate line numbers
  const lines = text.split('\n').length
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n')
  
  // Escape line numbers for HTML
  const escapedLineNumbers = lineNumbers.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<div class="code-window"><div class="code-tab"><span class="code-lang-icon">${getLangIcon(displayLang)} ${displayLang}</span><button class="code-copy-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span></button></div><div class="code-body"><div class="code-gutter">${escapedLineNumbers}</div><pre><code class="hljs language-${displayLang}">${highlighted}</code></pre></div></div>`
}

function getLangIcon(lang: string): string {
  const map: Record<string, string> = {
    python: '🐍', js: '🟨', typescript: '🔷', ts: '🔷', html: '🌐', css: '🎨',
    bash: '💻', sh: '💻', shell: '💻', json: '📦', yaml: '📝', yml: '📝',
    sql: '🗄️', go: '🐹', rust: '🦀', java: '☕', cpp: '⚙️', c: '⚙️', vue: '🟩', svelte: '🔴'
  }
  return map[lang.toLowerCase()] || '📄'
}

marked.setOptions({ renderer, gfm: true, breaks: true })

// File upload functions
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return
  
  const maxFileSize = 50 * 1024 * 1024 // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
    'application/xml',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-matroska'
  ]
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // Check file size
    if (file.size > maxFileSize) {
      toast.error(t('chatView.fileTooLarge', { name: file.name }))
      continue
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|md|json|yaml|yml|csv|xml|png|jpg|jpeg|gif|webp|svg|mp4|webm|avi|mov|mkv)$/i)) {
      toast.warning(t('chatView.fileTypeNotSupported', { name: file.name }))
      continue
    }
    
    // Extract text from text-based files
    const extractedText = await extractFileText(file)
    
    attachedFiles.value.push({
      id: `${Date.now()}-${i}`,
      file,
      type: file.type || 'unknown',
      name: file.name,
      size: file.size,
      extractedText
    })
  }
  
  // Reset input to allow re-selecting same file
  target.value = ''
  toast.success(t('chatView.filesAdded', { n: files.length }))
}

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1)
}

const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('powerpoint') || type.includes('presentation')) return '📊'
  if (type.includes('excel') || type.includes('spreadsheet')) return '📈'
  if (type.includes('image')) return '🖼️'
  if (type.includes('video')) return '🎬'
  if (type.includes('text') || type.includes('json') || type.includes('csv')) return '📄'
  return '📎'
}

const getFileIconClass = (type: string): string => {
  if (type.includes('pdf')) return 'icon-pdf'
  if (type.includes('word') || type.includes('document')) return 'icon-doc'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'icon-ppt'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'icon-xls'
  if (type.includes('image')) return 'icon-img'
  if (type.includes('video')) return 'icon-video'
  return 'icon-file'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/** Extract text from text-based files for inclusion in prompt */
const TEXT_EXTENSIONS = new Set(['txt','md','json','csv','xml','yaml','yml','toml','ini','conf','log','ts','js','py','go','rs','java','c','cpp','h','sh','bash','sql','html','css','scss','vue','jsx','tsx'])

async function extractFileText(file: File): Promise<string | undefined> {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!TEXT_EXTENSIONS.has(ext)) return undefined
  const maxChars = 50000
  try {
    const text = await file.text()
    return text.length > maxChars ? text.slice(0, maxChars) + '\n...[truncated]' : text
  } catch {
    return undefined
  }
}

const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

// Auto-resize handled by HxTextarea autoResize prop

function renderMarkdown(content: string) {
  let html = marked(content) as string
  // Add copy buttons to code blocks
  html = html.replace(/<pre><code class="([^"]*)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    const language = lang.replace('language-', '') || 'text'
    const copyId = `copy_${Math.random().toString(36).slice(2, 8)}`
    return `<div class="code-block-wrap"><div class="code-block-header"><span class="code-lang">${language}</span><button class="code-copy-btn" onclick="copyCodeBlock(this, '${copyId}')" title="复制"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div><pre class="code-block-body" id="${copyId}"><code class="${lang}">${code}</code></pre></div>`
  })
  return DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'onclick', 'type', 'disabled', 'checked', 'id'] })
}

// Global copy function for code blocks (called from onclick in v-html)
;(window as any).copyCodeBlock = function(btn: HTMLElement, id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const text = el.textContent || ''
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
    btn.classList.add('copied')
    setTimeout(() => {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
      btn.classList.remove('copied')
    }, 1500)
  })
}

function formatJson(obj: Record<string, unknown>) {
  try { return JSON.stringify(obj, null, 2) } catch (e) { console.warn('[ChatView] formatJson failed:', e); return String(obj) }
}

function formatTime(ts: string) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } catch (e) { console.warn('[ChatView] formatTime failed:', e); return '' }
}

// ===== Quick Actions: Category-based beginner-friendly prompts =====
const activeQuickCat = ref('daily')

const QUICK_ICONS = {
  pen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  translate: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2v3"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>',
  summary: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  idea: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
  code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  debug: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a6 6 0 0 0 12 0v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>',
  explain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  docker: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  schedule: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  travel: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  recipe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.4"/><path d="M17 15l3 3-3 3"/><path d="M22 12a10 10 0 0 0-10-10"/></svg>',
  study: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  math: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  language: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  brain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 0-7 7c0 3.5 2.5 6 4 7.5V19h6v-2.5c1.5-1.5 4-4 4-7.5a7 7 0 0 0-7-7z"/><path d="M9 22h6"/></svg>',
}

const quickCategories = [
  { id: 'daily', name: '日常', icon: QUICK_ICONS.idea },
  { id: 'writing', name: '写作', icon: QUICK_ICONS.pen },
  { id: 'coding', name: '编程', icon: QUICK_ICONS.code },
  { id: 'learning', name: '学习', icon: QUICK_ICONS.study },
]

const quickItemsMap: Record<string, Array<{ icon: string; label: string; desc: string; prompt: string }>> = {
  daily: [
    { icon: QUICK_ICONS.email, label: '写一封邮件', desc: '告诉我收件人和主题即可', prompt: '帮我写一封邮件，主题是请假一天，原因是身体不适，语气正式但不生硬' },
    { icon: QUICK_ICONS.translate, label: '翻译内容', desc: '支持中英日韩等语言', prompt: '请将以下内容翻译为英文，保持专业语气：' },
    { icon: QUICK_ICONS.schedule, label: '规划日程', desc: '高效安排你的一天', prompt: '我明天有以下事项要做：开周会、写报告、健身、买菜。请帮我合理规划明天的日程安排' },
    { icon: QUICK_ICONS.travel, label: '旅行攻略', desc: '目的地推荐和行程规划', prompt: '帮我规划一个 3 天的杭州旅行攻略，预算中等，喜欢自然风景和美食' },
  ],
  writing: [
    { icon: QUICK_ICONS.pen, label: '润色文章', desc: '让文字更流畅专业', prompt: '请帮我润色以下文字，使其更加通顺自然、表达更专业：' },
    { icon: QUICK_ICONS.summary, label: '总结要点', desc: '长文秒变精华摘要', prompt: '请帮我总结以下内容的核心要点，用 3-5 条列出：' },
    { icon: QUICK_ICONS.idea, label: '头脑风暴', desc: '激发创意灵感', prompt: '我想做一个短视频账号，主题是科技产品评测，请帮我想 10 个吸引人的账号名' },
    { icon: QUICK_ICONS.language, label: '小红书文案', desc: '爆款标题和正文', prompt: '帮我写一篇小红书文案，主题是分享一家好吃的日料店，风格轻松种草，带适当的表情符号' },
  ],
  coding: [
    { icon: QUICK_ICONS.code, label: '写代码', desc: '描述需求，我来实现', prompt: '用 Python 写一个带类型提示的快速排序算法，附带使用示例' },
    { icon: QUICK_ICONS.debug, label: '修 Bug', desc: '粘贴错误信息即可', prompt: '帮我分析这个报错信息并给出解决方案：' },
    { icon: QUICK_ICONS.explain, label: '解释代码', desc: '逐行分析代码逻辑', prompt: '请逐行解释以下代码的作用，用通俗易懂的方式：' },
    { icon: QUICK_ICONS.docker, label: '生成配置', desc: 'Docker/CI/部署一键搞定', prompt: '生成一个 Node.js 应用的多阶段构建 Dockerfile，包含生产环境优化' },
  ],
  learning: [
    { icon: QUICK_ICONS.study, label: '知识讲解', desc: '复杂概念简单说', prompt: '用通俗易懂的方式解释什么是量子计算，举一个生活中的类比' },
    { icon: QUICK_ICONS.math, label: '解题辅导', desc: '数理化步骤详解', prompt: '请详细解答这道题，写出完整的解题步骤和思路：' },
    { icon: QUICK_ICONS.brain, label: '学习计划', desc: '定制个性化学习路线', prompt: '我想从零开始学习 Web 前端开发，每天能投入 2 小时，请帮我制定一个 3 个月的学习计划' },
    { icon: QUICK_ICONS.language, label: '英语练习', desc: '口语对话/写作批改', prompt: '请和我进行一段英语对话练习，场景是在咖啡店点单，如果我有语法错误请纠正我' },
  ],
}

const activeQuickItems = computed(() => quickItemsMap[activeQuickCat.value] || quickItemsMap.daily)

function quickAsk(text: string) {
  inputText.value = text
  sendMessage()
}

async function sendMessage() {
  const text = inputText.value.trim()
  const hasAttachments = attachedFiles.value.length > 0
  
  if (!text && !hasAttachments) return

  // 构建消息内容（包含文件信息和提取的文本）
  let messageContent = text
  if (hasAttachments) {
    const fileParts = attachedFiles.value.map(f => {
      let part = `[${t('chatView.attachment')}：${f.name} (${formatFileSize(f.size)})]`
      if (f.extractedText) {
        part += `\n\`\`\`\n${f.extractedText}\n\`\`\``
      }
      return part
    }).join('\n\n')
    messageContent = text ? `${text}\n\n${fileParts}` : fileParts
  }
  
  // 如果正在生成，先取消当前任务再发送新消息（支持中途打断/补充）
  if (isStreaming.value) {
    await stopStreaming()
  }
  
  inputText.value = ''
  chatStore.addUserMessage(messageContent)
  
  // TODO: 实际发送文件到后端（当前先清空附件列表）
  // 后续需要实现文件上传 API 并将文件 ID 传递给模型
  const filesToSend = [...attachedFiles.value]
  attachedFiles.value = []

  // 构造对话历史（不含当前消息，当前消息通过 content 参数传递）
  const history = messages.value
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(0, -1)  // 排除刚添加的当前用户消息
    .map(m => ({ role: m.role, content: m.content }))

  await startStreaming(text, selectedModel.value, {
    history,
    onAutoTitle: autoGenerateTitle,
  })
}

watch(() => messages.value.length, async () => { await nextTick(); scrollToBottom() })
watch(() => currentResponse.value, async () => { await nextTick(); scrollToBottom() })
watch(() => isStreaming.value, async () => { await nextTick(); scrollToBottom() })
watch(() => isConnecting.value, async () => { await nextTick(); scrollToBottom() })

function scrollToBottom(smooth = false) {
  if (scrollerRef.value) {
    const el = scrollerRef.value.$el as HTMLElement | undefined
    if (el) {
      if (smooth) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      } else {
        el.scrollTop = el.scrollHeight
      }
    }
  }
}

function onScrollerScroll() {
  if (!scrollerRef.value) return
  const el = scrollerRef.value.$el as HTMLElement | undefined
  if (!el) return
  const { scrollTop, scrollHeight, clientHeight } = el
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 200
}

// Click delegation for code copy buttons (handles v-html inline onclick fallback)
function onMessagesClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest('.code-copy-btn') as HTMLElement | null
  if (!btn) return
  e.preventDefault()
  const codeEl = btn.closest('.code-window')?.querySelector('code')
  if (!codeEl) return
  const text = codeEl.textContent || ''
  copyToClipboard(text, btn)
}

function copyToClipboard(text: string, btn?: HTMLElement) {
  // Try modern API first
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) updateCopyBtn(btn)
    }).catch(() => {
      fallbackCopy(text, btn)
    })
  } else {
    fallbackCopy(text, btn)
  }
}

function fallbackCopy(text: string, btn?: HTMLElement) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try { document.execCommand('copy'); if (btn) updateCopyBtn(btn) } catch (_) {}
  document.body.removeChild(ta)
}

function updateCopyBtn(btn: HTMLElement) {
  const span = btn.querySelector('span')
  if (!span) return
  const original = span.textContent || 'Copy'
  span.textContent = t('chatView.copied')
  setTimeout(() => { span.textContent = original }, 1500)
}

function copyMessage(content: string) {
  copyToClipboard(content)
  toast.success(t('chatView.copiedToast'), undefined, 1500)
}

async function regenerateMessage(idx: number) {
  if (isStreaming.value) return
  // Find the user message right before this assistant message
  const msgs = messages.value
  let userMsgIdx = -1
  for (let i = idx - 1; i >= 0; i--) {
    if (msgs[i].role === 'user') { userMsgIdx = i; break }
  }
  if (userMsgIdx < 0) return
  const userText = msgs[userMsgIdx].content
  // Remove messages from the assistant reply onwards
  chatStore.truncateMessages(idx)
  // Re-send
  inputText.value = userText
  await nextTick()
  sendMessage()
}

// approveCommand, denyCommand, replyApproval, cancelExecution, autoGenerateTitle
// are now provided by useChatStream composable

onMounted(async () => {
  if (gfwStore.models.length === 0) await gfwStore.fetchModels()
  // Attach scroll listener to DynamicScroller's internal scroll container
  await nextTick()
  const scrollerEl = scrollerRef.value?.$el as HTMLElement | undefined
  if (scrollerEl) {
    scrollerEl.addEventListener('scroll', onScrollerScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hideContextMenu)
  const scrollerEl = scrollerRef.value?.$el as HTMLElement | undefined
  if (scrollerEl) {
    scrollerEl.removeEventListener('scroll', onScrollerScroll)
  }
})

async function exportChat() {
  const session = chatStore.currentSession
  if (!session || session.messages.length === 0) return
  const title = session.title || t('chatView.chatTitle')
  const date = new Date().toLocaleDateString('zh-CN')
  let md = `# ${title}\n\n> ${t('chatView.exportTime')}: ${date}\n\n---\n\n`
  for (const msg of session.messages) {
    if (msg.role === 'system') {
      md += `> **[${t('chatView.systemLabel')}]** ${msg.content}\n\n`
    } else if (msg.role === 'user') {
      md += `## ${t('chatView.meLabel')}\n\n${msg.content}\n\n`
    } else if (msg.role === 'assistant') {
      md += `## Hi!XNS\n\n${msg.content}\n\n`
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        md += `<details><summary>${t('chatView.toolCalls')} (${msg.tool_calls.length})</summary>\n\n`
        for (const tc of msg.tool_calls) {
          md += `- **${tc.tool}** [${tc.status}]\n`
          if (tc.input) md += `  - ${t('chatView.params')}: \`${JSON.stringify(tc.input).substring(0, 200)}\`\n`
          if (tc.output) md += `  - ${t('chatView.result')}: \`${tc.output.substring(0, 200)}\`\n`
        }
        md += `\n</details>\n\n`
      }
      if (msg.token_usage) {
        md += `*${msg.model || ''} · ⬆${msg.token_usage.prompt_tokens || 0} ⬇${msg.token_usage.completion_tokens || 0} tok*\n\n`
      }
    }
    md += `---\n\n`
  }
  // 触发浏览器下载
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  // Convert to data URL to avoid WebView2/Chrome blob:HTTPS security block
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), '')
  const base64 = btoa(binary)
  const url = `data:text/markdown;base64,${base64}`
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[/\\:*?"<>|]/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  toast.success(t('chatView.exportSuccess'), t('chatView.exportSaved'), 3000)
}
</script>

<style scoped>
/* ===== Glass IDE Layout ===== */
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 45px 45px;
  padding-bottom: 140px;
  scroll-behavior: smooth;
  /* Top & bottom inward Gaussian blur fade */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
}

/* Scrollbar styling */
.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { 
  background: var(--glass-border); 
  border-radius: 10px; 
}
.messages::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px;
}

.empty-inner {
  max-width: 680px;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Large Logo */
.empty-logo {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}
.empty-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 40px rgba(var(--accent-rgb),.25));
  animation: logoFloat 6s ease-in-out infinite;
}

/* Welcome text */
.empty-welcome {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 28px;
  font-weight: 400;
  letter-spacing: .02em;
}

/* Category Tabs */
.quick-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.quick-cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--glass-border);
  background: var(--glass-base);
  backdrop-filter: blur(8px);
  color: var(--text-secondary);
  font-size: .8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all .25s var(--ease-expo);
  white-space: nowrap;
}
.quick-cat-btn:hover {
  border-color: var(--border-light);
  color: var(--text-primary);
  background: var(--glass-bg-hover);
}
.quick-cat-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(var(--accent-rgb),.08);
  box-shadow: 0 0 12px rgba(var(--accent-rgb),.1);
}
.quick-cat-icon {
  display: flex;
  align-items: center;
}
.quick-cat-icon :deep(svg) {
  width: 14px;
  height: 14px;
}
.quick-cat-name {
  line-height: 1;
}
.logo-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--accent-rgb),.15), transparent 60%);
  filter: blur(30px);
  animation: glowPulse 3s ease-in-out infinite;
}
@keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes glowPulse{0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(1)}50%{opacity:.7;transform:translate(-50%,-50%) scale(1.15)}}

/* Background: orbs + grid */
.empty-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.empty-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}
.empty-orb-1 {
  width: 600px; height: 600px; top: -200px; left: -200px;
  background: radial-gradient(circle, rgba(var(--accent-rgb),.12), transparent 60%);
  animation: orbDrift1 25s ease-in-out infinite;
}
.empty-orb-2 {
  width: 500px; height: 500px; bottom: -150px; right: -150px;
  background: radial-gradient(circle, rgba(191,90,242,.08), transparent 60%);
  animation: orbDrift2 30s ease-in-out infinite;
}
.empty-orb-3 {
  width: 400px; height: 400px; top: 30%; left: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle, rgba(255,171,0,.06), transparent 60%);
  animation: orbDrift3 20s ease-in-out infinite;
}
@keyframes orbDrift1{0%,100%{transform:translate(0,0)}50%{transform:translate(80px,50px)}}
@keyframes orbDrift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-50px,-70px)}}
@keyframes orbDrift3{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-40%,-55%) scale(1.15)}}
.empty-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%);
  mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%);
}

/* Quick Bento Cards */
.quick-bento {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  margin-bottom: 32px;
}
.quick-bento-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.2);
  cursor: pointer;
  transition: all .3s var(--ease-expo);
  position: relative;
  overflow: hidden;
}
.quick-bento-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb),.06), transparent 50%);
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}
.quick-bento-card:hover::before { opacity: 1 }
.quick-bento-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
}
.quick-bento-icon {
  width: 40px; height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(var(--accent-rgb),.08);
  border: 1px solid rgba(var(--accent-rgb),.1);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
  flex-shrink: 0;
  transition: all .3s var(--ease-expo);
}
.quick-bento-icon :deep(svg) {
  width: 20px;
  height: 20px;
}
.quick-bento-card:hover .quick-bento-icon {
  background: rgba(var(--accent-rgb),.14);
  box-shadow: 0 0 16px rgba(var(--accent-rgb),.15);
}
.quick-bento-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}
.quick-bento-label {
  font-size: .875rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}
.quick-bento-desc {
  font-size: .75rem;
  color: var(--text-muted);
  line-height: 1.3;
}

/* Status */
.empty-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(8px);
}
.empty-status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
.empty-status-dot.connected {
  background: var(--success);
  box-shadow: 0 0 8px rgba(48,209,88,.4);
}
.empty-status-dot.connecting {
  background: var(--warning);
  box-shadow: 0 0 8px rgba(250,204,21,.4);
}
.empty-status-dot.disconnected { background: var(--error); }
.empty-status-text {
  font-size: .75rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Hero fade-in animations */
.hero-fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: heroFadeIn .8s var(--ease-expo) forwards;
}
.hero-fade-in-1 { animation-delay: .1s }
.hero-fade-in-2 { animation-delay: .25s }
.hero-fade-in-3 { animation-delay: .4s }
@keyframes heroFadeIn {
  to { opacity: 1; transform: translateY(0) }
}

/* Welcome text shimmer */
.empty-welcome {
  background: linear-gradient(
    90deg,
    var(--text-secondary) 0%,
    var(--accent) 50%,
    var(--text-secondary) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: heroFadeIn .8s var(--ease-expo) forwards, shimmer 4s ease-in-out infinite 1.2s;
  opacity: 0;
  animation-delay: .15s, 1.2s;
}
@keyframes shimmer {
  0%, 100% { background-position: 100% 0 }
  50% { background-position: 0 0 }
}

/* Quick category hover micro-interaction */
.quick-cat-btn:active {
  transform: scale(.95);
}

/* Bento card stagger entrance */
.quick-bento-card {
  opacity: 0;
  animation: heroFadeIn .6s var(--ease-expo) forwards;
}
.quick-bento-card:nth-child(1) { animation-delay: .3s }
.quick-bento-card:nth-child(2) { animation-delay: .4s }
.quick-bento-card:nth-child(3) { animation-delay: .5s }
.quick-bento-card:nth-child(4) { animation-delay: .6s }

/* ===== Message Wrappers ===== */
.msg-wrapper {
  display: flex;
  margin-bottom: 24px;
  transition: opacity 0.3s var(--ease-expo), transform 0.3s var(--ease-expo);
}

.msg-wrapper.user {
  justify-content: flex-end;
}

.msg-wrapper.assistant {
  justify-content: flex-start;
}

/* ===== User Bubble ===== */
.msg-bubble.user-bubble {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  animation: bubblePop 0.3s var(--ease-expo) both;
}

@keyframes bubblePop {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.user-content {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid var(--primary-border);
  border-right-color: var(--primary);
  box-shadow: inset 0 0 0 1px var(--primary-light), 0 0 12px var(--primary-glow-sm);
  border-radius: 18px 18px 4px 18px;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.user-time {
  font-size: 10px;
  color: var(--text-tertiary);
  padding-right: 4px;
  opacity: 0.6;
}

/* ===== AI Glass Card ===== */
.msg-card.ai-card {
  width: 100%;
  max-width: 900px;
  background: var(--glass-base);
  backdrop-filter: blur(48px) saturate(2);
  -webkit-backdrop-filter: blur(48px) saturate(2);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-inset), var(--shadow-sm);
  animation: cardSlideIn 0.4s var(--ease-expo) both;
  overflow: hidden;
}

.msg-card.ai-card.glass-glow {
  border-color: var(--border-glow);
  box-shadow: 0 0 12px var(--primary-glow-sm);
}

@keyframes cardSlideIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--glass-border);
  background: var(--glass-weak);
}

.author-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-text);
}

.ai-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px var(--success-glow);
}

.ai-dot.pulsing {
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: auto;
}

.meta-tag {
  font-family: var(--font-mono);
  background: var(--primary-light);
  color: var(--primary-text);
  padding: 2px 6px;
  border-radius: 6px;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-tertiary);
}

.timing-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  cursor: help;
}
.timing-ttft {
  color: var(--accent, #5ac8fa);
}
.timing-tool {
  color: var(--warning, #f0ad4e);
}
.timing-sep {
  color: var(--text-tertiary);
  opacity: 0.5;
}

.meta-tokens {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.meta-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.meta-icon.token-down {
  transform: scaleY(-1);
}

.card-content {
  padding: 20px 24px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 8px 12px;
  border-top: 1px solid var(--glass-border);
}

.footer-tokens {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
}

.token-item {
  white-space: nowrap;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, opacity 0.15s;
}

.action-icon:hover:not(:disabled) {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.action-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ===== Tools: Accordion ===== */
.tool-accordion {
  border-top: 1px solid var(--glass-border);
  margin: 0 16px;
}

.tool-item {
  border-bottom: 1px solid var(--border-base);
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
  transition: background 0.15s;
}

.tool-header:hover {
  color: var(--text-primary);
  background: var(--glass-weak);
  border-radius: 6px;
  padding-left: 8px;
}

.tool-tri {
  font-size: 8px;
  color: var(--text-tertiary);
  width: 12px;
  transition: transform 0.2s;
}

.tool-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.tool-status.completed { background: var(--success); }
.tool-status.failed { background: var(--error); }
.tool-status.running {
  background: var(--warning);
  animation: pulseDot 1s ease infinite;
}

.tool-name {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}

.tool-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: auto;
}

.tool-body {
  padding: 4px 0 8px 20px;
}

.tool-section {
  margin-top: 6px;
}

.tool-label-sm {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.tool-json {
  background: var(--bg-overlay);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}

/* ===== Markdown Styles ===== */
.markdown-body { word-break: break-word; color: var(--text-primary); }
.markdown-body :deep(p) { margin: 8px 0; }
.markdown-body :deep(p:first-child) { margin-top: 0; }
.markdown-body :deep(p:last-child) { margin-bottom: 0; }

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 20px 0 8px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 20px; }
.markdown-body :deep(h2) { font-size: 17px; }
.markdown-body :deep(h3) { font-size: 15px; font-weight: 600; }

.markdown-body :deep(strong) { font-weight: 600; color: var(--text-primary); }

/* Code Window (IDE Style) */
.markdown-body :deep(.code-window) {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-md);
}

.markdown-body :deep(.code-tab) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--glass-weak);
  border-bottom: 1px solid var(--glass-border);
}

.markdown-body :deep(.code-lang-icon) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: lowercase;
}

.markdown-body :deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-tertiary);
  background: var(--glass-bg-hover);
  border: 1px solid var(--border-base);
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.markdown-body :deep(.code-copy-btn:hover) {
  color: var(--text-primary);
  border-color: var(--primary-border);
  background: var(--primary-light);
}

.markdown-body :deep(.code-body) {
  display: flex;
  overflow: auto;
}

.markdown-body :deep(.code-gutter) {
  flex-shrink: 0;
  padding: 16px 8px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  color: var(--text-disabled);
  background: var(--glass-weak);
  border-right: 1px solid var(--border-base);
  user-select: none;
  white-space: pre;
}

.markdown-body :deep(.code-body pre) {
  margin: 0;
  padding: 16px;
  overflow: auto;
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 0;
}

.markdown-body :deep(code.hljs) {
  background: none;
  padding: 0;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
}

/* highlight.js token colors (GitHub Dark) */
.markdown-body :deep(.hljs-keyword),
.markdown-body :deep(.hljs-selector-tag),
.markdown-body :deep(.hljs-built_in),
.markdown-body :deep(.hljs-type) { color: #FF7B72; }

.markdown-body :deep(.hljs-string),
.markdown-body :deep(.hljs-addition) { color: #A5D6FF; }

.markdown-body :deep(.hljs-number),
.markdown-body :deep(.hljs-literal) { color: #79C0FF; }

.markdown-body :deep(.hljs-comment),
.markdown-body :deep(.hljs-deletion) { color: #8B949E; }

.markdown-body :deep(.hljs-function),
.markdown-body :deep(.hljs-title) { color: #D2A8FF; }

.markdown-body :deep(.hljs-variable),
.markdown-body :deep(.hljs-attr) { color: #FFA657; }

.markdown-body :deep(.hljs-symbol),
.markdown-body :deep(.hljs-bullet) { color: #7EE787; }

.markdown-body :deep(.hljs-regexp) { color: #7EE787; }

.markdown-body :deep(.hljs-tag) { color: #7EE787; }
.markdown-body :deep(.hljs-name) { color: #7EE787; }
.markdown-body :deep(.hljs-attribute) { color: #79C0FF; }

/* highlight.js light theme overrides (GitHub Light) */
[data-theme="light"] .markdown-body :deep(.hljs-keyword),
[data-theme="light"] .markdown-body :deep(.hljs-selector-tag),
[data-theme="light"] .markdown-body :deep(.hljs-built_in),
[data-theme="light"] .markdown-body :deep(.hljs-type) { color: #CF222E; }

[data-theme="light"] .markdown-body :deep(.hljs-string),
[data-theme="light"] .markdown-body :deep(.hljs-addition) { color: #79C0FF; }

[data-theme="light"] .markdown-body :deep(.hljs-number),
[data-theme="light"] .markdown-body :deep(.hljs-literal) { color: #0550AE; }

[data-theme="light"] .markdown-body :deep(.hljs-comment),
[data-theme="light"] .markdown-body :deep(.hljs-deletion) { color: #6E7781; }

[data-theme="light"] .markdown-body :deep(.hljs-function),
[data-theme="light"] .markdown-body :deep(.hljs-title) { color: #8250DF; }

[data-theme="light"] .markdown-body :deep(.hljs-variable),
[data-theme="light"] .markdown-body :deep(.hljs-attr) { color: #953800; }

[data-theme="light"] .markdown-body :deep(.hljs-symbol),
[data-theme="light"] .markdown-body :deep(.hljs-bullet) { color: #116327; }

[data-theme="light"] .markdown-body :deep(.hljs-regexp) { color: #116327; }

[data-theme="light"] .markdown-body :deep(.hljs-tag) { color: #116327; }
[data-theme="light"] .markdown-body :deep(.hljs-name) { color: #116327; }
[data-theme="light"] .markdown-body :deep(.hljs-attribute) { color: #0550AE; }

/* Code block wrapper with copy button */
.markdown-body :deep(.code-block-wrap) {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-sm);
  transition: border-color .2s var(--ease-out);
}
.markdown-body :deep(.code-block-wrap:hover) {
  border-color: var(--accent);
}
.markdown-body :deep(.code-block-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--glass-bg-hover);
  border-bottom: 1px solid var(--glass-border);
}
.markdown-body :deep(.code-lang) {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: lowercase;
  font-family: var(--font-mono);
}
.markdown-body :deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 10px;
  color: var(--text-tertiary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all .2s var(--ease-out);
  font-family: var(--font-sans);
}
.markdown-body :deep(.code-copy-btn:hover) {
  color: var(--text-primary);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border);
}
.markdown-body :deep(.code-copy-btn.copied) {
  color: var(--success);
}
.markdown-body :deep(.code-block-body) {
  margin: 0;
  padding: 16px;
  overflow: auto;
  background: transparent;
  max-height: 400px;
}
.markdown-body :deep(.code-block-body code) {
  background: none;
  padding: 0;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  display: block;
  overflow-x: auto;
}

/* Inline code */
.markdown-body :deep(code:not(.hljs):not(.code-block-body code)) {
  background: var(--glass-bg-hover);
  border: 1px solid var(--glass-border);
  padding: 2px 6px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) { padding-left: 22px; margin: 10px 0; }
.markdown-body :deep(li) { margin: 4px 0; line-height: 1.65; }

/* GFM Task Lists */
.markdown-body :deep(.contains-task-list) {
  list-style: none;
  padding-left: 0;
}

.markdown-body :deep(.contains-task-list li) {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 2px 0;
}

.markdown-body :deep(.contains-task-list input[type="checkbox"]) {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--border-strong);
  border-radius: 3px;
  margin-top: 2px;
  flex-shrink: 0;
  position: relative;
  cursor: default;
}

.markdown-body :deep(.contains-task-list input[type="checkbox"]:checked) {
  background: var(--accent);
  border-color: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 13l4 4L19 7' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: 10px 10px;
  background-position: center;
  background-repeat: no-repeat;
}

.markdown-body :deep(.contains-task-list input[type="checkbox"]:checked::after) {
  content: none;
}

.markdown-body :deep(.contains-task-list .task-list-item-block) {
  flex: 1;
}

/* GFM Strikethrough */
.markdown-body :deep(del) {
  text-decoration: line-through;
  opacity: 0.6;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding: 4px 12px;
  margin: 8px 0;
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--glass-bg) 40%, transparent);
  border-radius: 0 6px 6px 0;
}

.markdown-body :deep(a) {
  color: var(--primary-text);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
.markdown-body :deep(a:hover) { border-bottom-color: var(--primary-text); }

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--glass-border);
  margin: 18px 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 13px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border-base);
  padding: 6px 10px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  font-weight: 600;
  font-size: 12px;
}
.markdown-body :deep(tr:nth-child(even)) {
  background: color-mix(in srgb, var(--glass-bg) 60%, transparent);
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0;
  border: 1px solid var(--glass-border);
}

/* ===== Streaming & Thinking ===== */
.thinking-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
}

.thinking-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thinking-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-text);
  animation: dotPulse 1.2s ease infinite;
}

.thinking-dots span:nth-child(1) { animation-delay: 0s; }
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1.2); }
}

.thinking-state .status-text {
  font-size: 13px;
  color: var(--primary-text);
  animation: thinkingPulse 2.4s ease infinite;
}

@keyframes thinkingPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Cursor: inline at end of last line via ::after */
.card-content.streaming::after {
  content: '\258C';
  display: inline;
  font-family: var(--font-mono);
  color: var(--primary-text);
  animation: cursorBlink 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin-left: 1px;
  text-shadow: 0 0 8px var(--primary-glow);
}

@keyframes cursorBlink {
  0%, 100% { opacity: 0.1; }
  45%, 55% { opacity: 1; }
}

.tool-streaming .tool-item.active {
  opacity: 1;
}

.tool-spinner-sm {
  width: 10px;
  height: 10px;
  border: 1.5px solid var(--glass-border);
  border-top-color: var(--primary-text);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

/* Approval Card */
.approval-card {
  margin: 12px 0;
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.5);
  border: 1px solid var(--warning);
  border-radius: 12px;
  overflow: hidden;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--warning-glow);
  border-bottom: 1px solid var(--glass-border);
  color: var(--warning);
  font-size: 12px;
  font-weight: 600;
}

.approval-body { padding: 12px 14px; }

.approval-cmd { margin-bottom: 8px; }

.approval-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.approval-cmd code {
  display: block;
  background: var(--bg-overlay);
  color: var(--error);
  padding: 8px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
}

.approval-reason {
  font-size: 12px;
  color: var(--text-secondary);
}

.approval-actions {
  display: flex;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--glass-border);
}

.approve-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--success);
  border: none;
  border-radius: 8px;
  color: var(--text-inverse);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.approve-btn:hover { opacity: 0.85; }

.deny-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--error);
  border-radius: 8px;
  color: var(--error);
  cursor: pointer;
  transition: opacity 0.15s;
}
.deny-btn:hover { opacity: 0.75; }

.approval-reply-input {
  margin: 8px 0;
}
.reply-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-base);
  background: color-mix(in srgb, var(--warning) 12%, transparent);
  color: var(--warning);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.reply-btn:hover {
  background: color-mix(in srgb, var(--warning) 20%, transparent);
}

/* ===== System Messages ===== */
.sys-line {
  display: flex;
  justify-content: center;
  padding: 14px 48px;
}

.sys-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--glass-base);
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 4px 14px 4px 10px;
  animation: pillIn 0.3s var(--ease-expo) both;
}

@keyframes pillIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.sys-icon {
  flex-shrink: 0;
  color: var(--warning);
}

.sys-text {
  word-break: break-word;
}

/* ===== Scroll FAB (dynamic, anchored to input-capsule) ===== */
.fab-anchor {
  position: relative;
}

.scroll-fab {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 15;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--glass-base);
  backdrop-filter: blur(16px) saturate(1.5);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--glass-inset), var(--shadow-md);
  transition: opacity 0.3s var(--ease-expo), transform 0.3s var(--ease-expo);
}

.scroll-fab:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
  border-color: var(--border-light);
  transform: translateY(-3px) scale(1.08);
  box-shadow: var(--glass-inset), var(--shadow-lg);
}

.scroll-fab:active { transform: scale(0.92); }

.fab-fade-enter-active, .fab-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fab-fade-enter-from, .fab-fade-leave-to { opacity: 0; transform: translateY(8px); }

/* ===== Input: Floating Glass Capsule ===== */
.input-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 45px 20px;
  padding-top: 24px;
  z-index: 10;
  background: linear-gradient(to top, var(--bg-base) 0%, transparent 100%);
}

.input-capsule {
  display: flex;
  align-items: center;
  background: var(--glass-base);
  backdrop-filter: blur(32px) saturate(1.5);
  -webkit-backdrop-filter: blur(32px) saturate(1.5);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 10px 12px 10px 16px;
  gap: 10px;
  box-shadow: var(--glass-inset), var(--shadow-lg);
  transition: border-color 0.3s var(--ease-expo), box-shadow 0.3s var(--ease-expo);
  min-height: 52px;
}

.input-capsule.focused {
  border-color: var(--border-focus);
  box-shadow: var(--glass-inset), var(--shadow-lg), 0 0 12px var(--primary-glow-sm);
}

/* HxTextarea inside input-capsule: no wrapper decoration */
.input-capsule .hixns-textarea-wrap {
  flex: 1;
  min-width: 0;
}
.input-capsule .hixns-textarea-wrap .hixns-textarea-inner.inline-inner {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
.input-capsule .hixns-textarea-wrap .hixns-textarea {
  resize: none;
}

/* ===== Upload bar (floating above input) ===== */
.upload-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: var(--glass-base);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.2s var(--ease-expo), color 0.2s var(--ease-expo);
  flex-shrink: 0;
}

.upload-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary-border);
  color: var(--info);
  box-shadow: 0 0 8px var(--primary-glow-sm);
}

.file-input-hidden { display: none; }

/* Chat textarea styling handled by HxTextarea variant="chat" inline */


.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--primary);
  border: 1px solid var(--primary-border);
  border-radius: 50%;
  color: var(--primary-text);
  cursor: pointer;
  transition: background 0.2s var(--ease-expo), transform 0.2s var(--ease-expo), opacity 0.2s var(--ease-expo);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  box-shadow: 0 0 10px var(--primary-glow-sm);
  transform: scale(1.05);
}

.send-btn:active:not(:disabled) { transform: scale(0.95); }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.cancel-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--error-glow);
  border: 1px solid var(--error);
  border-radius: 10px;
  color: var(--error);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}

/* File previews */
/* File Chips */
.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--glass-base);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  transition: background 0.2s var(--ease-expo);
}

.file-chip:hover {
  border-color: var(--primary-border);
}

.file-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.file-chip-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  padding: 0;
}

.file-chip-remove:hover {
  color: var(--error);
  background: var(--error-glow);
}

.file-chip.has-text {
  border-color: var(--accent, #5ac8fa);
  background: color-mix(in srgb, var(--accent, #5ac8fa) 8%, var(--glass-base));
}

.file-chip-badge {
  font-size: 10px;
  color: var(--accent, #5ac8fa);
  flex-shrink: 0;
}

.file-overflow {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

/* Remove old preview styles */

/* Input Status */
.input-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-tertiary);
}

.status-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
}

.status-pill.warning { color: var(--warning); border-color: var(--warning-glow); background: var(--warning-glow); }
.status-pill.success { color: var(--success); border-color: var(--success-glow); background: var(--success-glow); }
.status-pill.streaming { color: var(--primary-text); border-color: var(--primary-glow-sm); background: var(--primary-light); }

.status-dot-sep { font-size: 12px; opacity: 0.4; }

.status-detail-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid var(--glass-border);
  background: var(--glass-base);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all .2s var(--ease-expo);
}
.status-detail-toggle:hover {
  color: var(--text-primary);
  border-color: var(--border-light);
  background: var(--glass-bg-hover);
}

.status-spacer { flex: 1; }

.export-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.2s var(--ease-expo), color 0.2s var(--ease-expo);
  font-family: 'Noto Sans SC', var(--font-sans), sans-serif;
}

.export-btn:hover {
  color: var(--primary-text);
  border-color: var(--border-light);
  background: var(--primary-light);
}

/* Context menu */
.ctx-menu {
  position: fixed;
  z-index: 2000;
  background: var(--bg-surface);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  min-width: 120px;
  backdrop-filter: blur(16px);
}

.ctx-item {
  display: block;
  width: 100%;
  padding: 7px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-family);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background var(--fast);
}

.ctx-item:hover {
  background: var(--bg-elevated);
}

/* ===== Blueprint Context Bar ===== */
.blueprint-context-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  margin: 0 16px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 8px;
  font-size: 11px;
  color: var(--accent);
}

.clear-context-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s;
}

.clear-context-btn:hover {
  color: var(--error);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.toolbar-btn:hover {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

/* Tool trace toggle active state */
.toolbar-btn.tool-trace-btn.active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

/* ===== Blueprint Picker Dropdown ===== */
.blueprint-picker-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  margin-bottom: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: var(--shadow-lg);
}

.bp-picker-empty {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.bp-picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-base);
}

.bp-picker-item:last-child {
  border-bottom: none;
}

.bp-picker-item:hover {
  background: color-mix(in srgb, var(--accent) 6%, transparent);
}

.bp-picker-name {
  font-size: 12px;
  color: var(--text-primary);
}

.bp-picker-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.bp-picker-status.status-succeeded {
  background: color-mix(in srgb, var(--success) 12%, transparent);
  color: var(--success);
}

.bp-picker-status.status-failed {
  background: color-mix(in srgb, var(--error) 12%, transparent);
  color: var(--error);
}

.bp-picker-status.status-running {
  background: color-mix(in srgb, var(--info) 12%, transparent);
  color: var(--info);
}

/* ===== Vue Virtual Scroller Overrides ===== */
.vue-recycle-scroller {
  background: transparent !important;
}
.vue-recycle-scroller__item-wrapper {
  background: transparent !important;
}
.vue-recycle-scroller__item-view {
  background: transparent !important;
}

/* DynamicScroller inherits from RecycleScroller */
.messages.vue-recycle-scroller {
  flex: 1;
  overflow-y: auto;
  padding: 45px 45px;
  padding-bottom: 140px;
  scroll-behavior: smooth;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
}

.messages.vue-recycle-scroller::-webkit-scrollbar { width: 6px; }
.messages.vue-recycle-scroller::-webkit-scrollbar-track { background: transparent; }
.messages.vue-recycle-scroller::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 10px;
}
.messages.vue-recycle-scroller::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

/* Empty state overrides when no messages */
.messages-empty {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  padding-bottom: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  scroll-behavior: smooth;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0px,
    black 60px,
    black calc(100% - 150px),
    transparent 100%
  );
}
.empty-inner {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
