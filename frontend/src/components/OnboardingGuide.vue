<template>
  <Teleport to="body">
    <Transition name="onboarding-fade">
      <div v-if="visible" class="onboarding-overlay" @click.self="dismiss">
        <div class="onboarding-modal">
          <!-- Progress dots -->
          <div class="onboarding-progress">
            <span
              v-for="i in totalSteps"
              :key="i"
              class="progress-dot"
              :class="{ active: i === step, done: i < step }"
            ></span>
          </div>

          <!-- Step content -->
          <Transition name="step-slide" mode="out-in">
            <div :key="step" class="onboarding-step">
              <!-- Step 1: Welcome -->
              <template v-if="step === 1">
                <div class="step-icon-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                </div>
                <h2 class="step-title">欢迎使用 Hi!XNS</h2>
                <p class="step-desc">你的全能 AI 助手，无论是写作、编程、学习还是日常事务，都能帮你搞定。</p>
                <div class="step-features">
                  <div class="feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>自然对话，像朋友一样交流</span>
                  </div>
                  <div class="feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <span>编程辅助，代码写作一步到位</span>
                  </div>
                  <div class="feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>文件处理，总结翻译样样行</span>
                  </div>
                  <div class="feature-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span>知识学习，随时解答疑惑</span>
                  </div>
                </div>
              </template>

              <!-- Step 2: How to use -->
              <template v-if="step === 2">
                <div class="step-icon-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h2 class="step-title">如何开始</h2>
                <p class="step-desc">使用非常简单，只需三步：</p>
                <div class="step-how">
                  <div class="how-item">
                    <span class="how-num">1</span>
                    <div class="how-text">
                      <strong>输入你的问题</strong>
                      <span>在底部输入框中用自然语言描述需求</span>
                    </div>
                  </div>
                  <div class="how-item">
                    <span class="how-num">2</span>
                    <div class="how-text">
                      <strong>等待 AI 思考</strong>
                      <span>AI 会自动分析并给出最佳回答</span>
                    </div>
                  </div>
                  <div class="how-item">
                    <span class="how-num">3</span>
                    <div class="how-text">
                      <strong>继续追问或新建</strong>
                      <span>可以追问细节，也可以点 + 新建对话</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Step 3: Tips -->
              <template v-if="step === 3">
                <div class="step-icon-large">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h2 class="step-title">小技巧</h2>
                <p class="step-desc">掌握这些技巧，让 AI 更好地帮助你：</p>
                <div class="step-tips">
                  <div class="tip-item">
                    <span class="tip-badge">Shift + Enter</span>
                    <span>换行而不发送</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-badge">拖拽文件</span>
                    <span>直接分析文件内容</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-badge">Ctrl + K</span>
                    <span>搜索历史会话</span>
                  </div>
                  <div class="tip-item">
                    <span class="tip-badge">越具体越好</span>
                    <span>详细描述需求能获得更好回答</span>
                  </div>
                </div>
              </template>
            </div>
          </Transition>

          <!-- Actions -->
          <div class="onboarding-actions">
            <button v-if="step > 1" class="ob-btn ob-btn-ghost" @click="step--">上一步</button>
            <span v-else class="ob-spacer"></span>
            <button v-if="step < totalSteps" class="ob-btn ob-btn-primary" @click="step++">
              下一步
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button v-else class="ob-btn ob-btn-primary" @click="dismiss">
              开始使用
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <!-- Skip -->
          <button class="ob-skip" @click="dismiss">跳过引导</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const STORAGE_KEY = 'hixns_onboarding_done'
const totalSteps = 3
const step = ref(1)

// Show only if user hasn't seen it
const visible = ref(!localStorage.getItem(STORAGE_KEY))

function dismiss() {
  visible.value = false
  localStorage.setItem(STORAGE_KEY, '1')
}
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.onboarding-modal {
  width: 460px;
  max-width: 90vw;
  max-height: 85vh;
  background: var(--bg-surface);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 36px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 32px 80px rgba(0,0,0,.3), var(--glass-inset);
  overflow-y: auto;
}

.onboarding-progress {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
}
.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--glass-border);
  transition: all .3s var(--ease-expo);
}
.progress-dot.active {
  background: var(--accent);
  box-shadow: 0 0 8px rgba(var(--accent-rgb),.4);
  transform: scale(1.3);
}
.progress-dot.done {
  background: var(--accent);
  opacity: .5;
}

.onboarding-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.step-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--accent-rgb),.08);
  border: 1px solid rgba(var(--accent-rgb),.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  margin-bottom: 20px;
}

.step-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 10px;
}

.step-desc {
  font-size: .9rem;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.5;
}

/* Step 1: Features */
.step-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
  text-align: left;
}
.feature-item svg {
  color: var(--accent);
  flex-shrink: 0;
}
.feature-item span {
  font-size: .85rem;
  color: var(--text-primary);
}

/* Step 2: How to */
.step-how {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 340px;
}
.how-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
}
.how-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .8rem;
  font-weight: 700;
  flex-shrink: 0;
}
.how-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.how-text strong {
  font-size: .9rem;
  color: var(--text-primary);
}
.how-text span {
  font-size: .8rem;
  color: var(--text-muted);
}

/* Step 3: Tips */
.step-tips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}
.tip-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--glass-base);
  border: 1px solid var(--glass-border);
  align-items: center;
  text-align: center;
}
.tip-badge {
  font-size: .75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(var(--accent-rgb),.1);
  color: var(--accent);
  font-family: var(--font-mono);
}
.tip-item > span:last-child {
  font-size: .78rem;
  color: var(--text-muted);
}

/* Actions */
.onboarding-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 28px;
  gap: 12px;
}
.ob-spacer { flex: 1; }

.ob-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: .875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s var(--ease-expo);
}
.ob-btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(var(--accent-rgb),.3);
}
.ob-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(var(--accent-rgb),.4);
}
.ob-btn-ghost {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
}
.ob-btn-ghost:hover {
  border-color: var(--border-light);
  color: var(--text-primary);
}

.ob-skip {
  margin-top: 16px;
  font-size: .75rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color .2s;
}
.ob-skip:hover { color: var(--text-secondary); }

/* Transitions */
.onboarding-fade-enter-active { transition: opacity .4s var(--ease-expo); }
.onboarding-fade-leave-active { transition: opacity .3s var(--ease-expo); }
.onboarding-fade-enter-from, .onboarding-fade-leave-to { opacity: 0; }

.step-slide-enter-active { transition: all .3s var(--ease-expo); }
.step-slide-leave-active { transition: all .2s var(--ease-expo); }
.step-slide-enter-from { opacity: 0; transform: translateX(20px); }
.step-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
