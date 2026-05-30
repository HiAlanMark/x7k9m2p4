<template>
  <div class="chat-view">
    <!-- Empty state -->
    <div v-if="messages.length === 0 && !isStreaming && !isConnecting" class="messages messages-empty">
      <div class="empty-inner animate-spring-in">
        <!-- Status Panel (replaces old terminal) -->
        <div class="status-panel">
          <div class="status-panel-header">
            <span class="status-panel-dot" :class="appStore.connectionState"></span>
            <span class="status-panel-title">Hi!XNS Agent</span>
            <span class="status-panel-version">v{{ appVersion }}</span>
          </div>
          <div class="status-panel-body">
            <div v-if="appStore.connectionState === 'connected'" class="status-panel-ready">
              <span class="status-panel-ready-text">{{ t('chatView.ready') }} · {{ appStore.hermesStatus?.version?.split(' ')[0] || t('chatView.hermesIntegrated') }}</span>
            </div>
            <div v-else-if="appStore.connectionState === 'connecting'" class="status-panel-ready">
              <div class="status-panel-spinner"></div>
              <span class="status-panel-ready-text">{{ t('chatView.connecting') }}</span>
            </div>
            <div v-else class="status-panel-ready">
              <span class="status-panel-ready-text error">{{ t('chatView.backendDisconnected') }}</span>
            </div>
          </div>
        </div>
        <div class="quick-actions stagger-children">
          <div class="quick-item hover-lift" @click="quickAsk('用 Python 写一个带类型提示的快速排序算法')">
            <span class="qa-icon">></span>
            <span class="qa-text">{{ t('chatView.quickSort') }}</span>
          </div>
          <div class="quick-item hover-lift" @click="quickAsk('解释 TCP 三次握手的工作原理')">
            <span class="qa-icon">></span>
            <span class="qa-text">{{ t('chatView.tcpHandshake') }}</span>
          </div>
          <div class="quick-item hover-lift" @click="quickAsk('审查这段代码的性能问题: def fib(n): return fib(n-1) + fib(n-2) if n > 1 else n')">
            <span class="qa-icon">></span>
            <span class="qa-text">{{ t('chatView.codeReview') }}</span>
          </div>
          <div class="quick-item hover-lift" @click="quickAsk('生成一个 Node.js 应用的多阶段构建 Dockerfile')">
            <span class="qa-icon">></span>
            <span class="qa-text">{{ t('chatView.dockerfile') }}</span>
          </div>
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
                  <span v-if="agentIteration > 0" class="meta-tag">Iter {{ agentIteration }}/{{ agentMaxIter }}</span>
                  <span class="meta-dot"></span>
                  <span>Thinking...</span>
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
                    <span class="tool-label">{{ tc.status === 'completed' ? t('chatView.completed') : tc.status === 'failed' ? t('chatView.failed') : tc.status === 'denied' ? t('chatView.denied') : tc.status === 'timeout' ? t('chatView.approvalTimeout') : t('chatView.executing') }}</span>
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
            <span>{{ t('chatView.connectingLabel') }}</span>
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

      <div class="fab-anchor">
        <transition name="fab-fade">
          <button v-if="showScrollBtn" class="scroll-fab" @click="scrollToBottom(true)" :title="t('chatView.scrollDown')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </transition>

        <!-- Blueprint run picker dropdown -->
        <div v-if="showBlueprintPicker" class="blueprint-picker-dropdown">
          <div v-if="blueprintRuns.length === 0" class="bp-picker-empty">
            {{ t('chatView.noBlueprintRuns') }}
          </div>
          <div v-for="run in blueprintRuns" :key="run.id" class="bp-picker-item" @click="selectBlueprintRun(run)">
            <span class="bp-picker-name">{{ run.blueprint_name || run.blueprint_id?.slice(0, 8) }}</span>
            <span class="bp-picker-status" :class="'status-' + run.status">{{ run.status }}</span>
          </div>
        </div>

        <div class="input-capsule" :class="{ focused: inputFocused }">
        <span class="prompt-symbol">❯</span>
        
        <HxTextarea
          ref="chatInputRef"
          v-model="inputText"
          variant="chat"
          inline
          autoResize
          :maxHeight="120"
          :placeholder="t('chatView.inputPlaceholder')"
          :rows="1"
          @keydown="onChatKeydown"
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @contextmenu.prevent="showContextMenu"
        />
        
        <button @click="sendMessage" :disabled="!inputText.trim() && attachedFiles.length === 0" class="send-btn">
          <svg class="send-arrow" width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="M853.333333 128a42.666667 42.666667 0 0 0-42.666666 42.666667v298.666666c0 71.210667-56.789333 128-128 128H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667 42.666667 42.666667 0 0 0 42.666667 42.666667h512c117.632 0 213.333333-95.701333 213.333333-213.333334V170.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z"/><path d="M384 384a42.666667 42.666667 0 0 0-30.165333 12.501333l-213.333334 213.333334a42.666667 42.666667 0 0 0 0 60.330666l213.333334 213.333334a42.666667 42.666667 0 0 0 60.330666 0 42.666667 42.666667 0 0 0 0-60.330667L231.168 640l182.997333-182.997333a42.666667 42.666667 0 0 0 0-60.330667A42.666667 42.666667 0 0 0 384 384z"/></svg>
        </button>
        <button @click="cancelExecution" class="cancel-btn" v-if="isStreaming">
          <span>{{ t('chatView.stop') }}</span>
          <svg class="cancel-icon" width="10" height="10" viewBox="0 0 1024 1024" fill="currentColor"><path d="M213.333333 85.333333C143.146667 85.333333 85.333333 143.146667 85.333333 213.333333v597.333334c0 70.186667 57.813333 128 128 128h597.333334c70.186667 0 128-57.813333 128-128V213.333333c0-70.186667-57.813333-128-128-128z"/></svg>
        </button>
      </div>
      </div>
      <div class="input-status">
        <span class="status-pill">{{ chatStore.getActiveConfig().model || t('chatView.noModelSelected') }}</span>
        <span class="status-dot-sep">·</span>
        <span class="status-pill" :class="chatStore.providerMode === 'custom' ? 'warning' : 'success'">{{ chatStore.providerMode === 'custom' ? 'Custom API' : 'gfw.net' }}</span>
        <span class="status-dot-sep">·</span>
        <span class="status-pill" :class="{ streaming: isStreaming }">{{ isStreaming ? `${t('chatView.generating')} ${streamElapsed}s` : t('chatView.ready') }}</span>
        <span v-if="tokenEstimate > 0" class="status-dot-sep">·</span>
        <span v-if="tokenEstimate > 0" class="status-pill" :class="{ warning: tokenEstimate > compressionThreshold }" :title="t('compression.thresholdHint')">{{ formatTokenCount(tokenEstimate) }} / {{ formatTokenCount(compressionThreshold) }}</span>
        <span v-if="messages.length > 0" class="status-dot-sep">·</span>
        <button v-if="messages.length > 0" class="export-btn" @click="exportChat" :title="t('chatView.exportMarkdown')">{{ t('chatView.exportMarkdown') }}</button>
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
import { useBlueprintStore } from '@/stores/blueprint'
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
const blueprintStore = useBlueprintStore()
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

// Blueprint context association
const showBlueprintPicker = ref(false)
const blueprintRunId = computed(() => chatStore.blueprintRunId)
const blueprintRuns = computed(() => blueprintStore.runs)

function toggleBlueprintPicker() {
  showBlueprintPicker.value = !showBlueprintPicker.value
  if (showBlueprintPicker.value) {
    blueprintStore.fetchAllRuns()
  }
}

function selectBlueprintRun(run: any) {
  chatStore.blueprintRunId = run.id
  showBlueprintPicker.value = false
}

const inputText = ref('')
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

function onChatKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    sendMessage()
  }
}

function showContextMenu(e: MouseEvent) {
  const ta = nativeTextarea.value
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
  const ta = nativeTextarea.value
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
  const ta = nativeTextarea.value
  if (!ta) return
  ta.focus()
  try { document.execCommand('cut') } catch {}
  ta.dispatchEvent(new Event('input', { bubbles: true }))
  hideContextMenu()
}

function ctxPaste() {
  const ta = nativeTextarea.value
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
  nativeTextarea.value?.select()
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
  const html = marked(content) as string
  return DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'onclick', 'type', 'disabled', 'checked'] })
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
  const btn = (e.target as HTMLElement).closest('.code-copy-btn')
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

function exportChat() {
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
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[/\\:*?"<>|]/g, '_')}_${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
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
  max-width: 520px;
  width: 100%;
}

.status-panel {
  display: flex;
  flex-direction: column;
  background: var(--glass-base);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.status-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
}

.status-panel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-panel-dot.connected { background: var(--success); box-shadow: 0 0 8px var(--success-glow); }
.status-panel-dot.connecting { background: var(--warning); box-shadow: 0 0 8px var(--warning-glow); }
.status-panel-dot.disconnected { background: var(--error); }

.status-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.status-panel-version {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

.status-panel-body {
  padding: 12px 16px;
}

.status-panel-ready {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-panel-ready-text {
  font-size: 13px;
  color: var(--primary-text);
  font-weight: 500;
}

.status-panel-ready-text.error {
  color: var(--error);
}

.status-panel-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--warning-glow);
  border-top-color: var(--warning);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Quick actions */
.quick-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: background 0.2s var(--ease-expo), color 0.2s var(--ease-expo);
}

.quick-item:hover {
  background: var(--glass-base);
  border-color: var(--glass-border);
  backdrop-filter: blur(16px);
}

.qa-icon {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-tertiary);
  user-select: none;
  flex-shrink: 0;
}

.qa-text {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-secondary);
}

.quick-item:hover .qa-text { color: var(--text-primary); }
.quick-item:hover .qa-icon { color: var(--primary-text); }

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

/* Inline code */
.markdown-body :deep(code:not(.hljs)) {
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
}

.markdown-body :deep(.contains-task-list input[type="checkbox"]:checked::after) {
  content: '✓';
  position: absolute;
  top: -1px;
  left: 2px;
  font-size: 10px;
  color: white;
  font-weight: 700;
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

.prompt-symbol {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-text);
  user-select: none;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
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
  justify-content: center;
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

.export-btn {
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
</style>
