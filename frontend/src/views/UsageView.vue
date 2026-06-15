<template>
  <div class="usage-view">
    <!-- Period selector -->
    <div class="usage-header">
      <h2 class="usage-title">{{ t('usage.title') }}</h2>
      <div class="period-tabs">
        <button
          v-for="p in periods"
          :key="p.value"
          :class="['period-tab', { active: usageStore.period === p.value }]"
          @click="usageStore.fetchSummary(p.value)"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="usageStore.loading && !usageStore.usageSummary" class="usage-skeleton">
      <div v-for="i in 4" :key="i" class="skeleton-card" />
    </div>

    <!-- Error -->
    <div v-else-if="usageStore.error" class="usage-error">
      <span>{{ usageStore.error }}</span>
      <button class="retry-btn" @click="usageStore.fetchSummary()">{{ t('common.retry') }}</button>
    </div>

    <!-- Content -->
    <template v-else-if="usageStore.usageSummary">
      <!-- Summary cards -->
      <div class="summary-grid">
        <div class="summary-card glass">
          <div class="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div class="card-content">
            <span class="card-label">{{ t('usage.totalTokens') }}</span>
            <span class="card-value">{{ formatNumber(summary.total_tokens) }}</span>
          </div>
        </div>
        <div class="summary-card glass">
          <div class="card-icon accent-input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="card-content">
            <span class="card-label">{{ t('usage.inputOutput') }}</span>
            <span class="card-value"><span class="token-in">{{ formatNumber(summary.total_input_tokens) }}</span> / <span class="token-out">{{ formatNumber(summary.total_output_tokens) }}</span></span>
          </div>
        </div>
        <div class="summary-card glass">
          <div class="card-icon accent-cost">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="card-content">
            <span class="card-label">{{ t('usage.estimatedCost') }}</span>
            <span class="card-value cost-value">${{ summary.total_cost.toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-card glass">
          <div class="card-icon accent-cache">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="card-content">
            <span class="card-label">{{ t('usage.cacheHitRate') }}</span>
            <span class="card-value">{{ (summary.cache_hit_rate * 100).toFixed(1) }}%</span>
          </div>
        </div>
        <div class="summary-card glass">
          <div class="card-icon accent-session">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div class="card-content">
            <span class="card-label">{{ t('usage.sessions') }}</span>
            <span class="card-value">{{ formatNumber(summary.session_count) }} <span class="card-sub">({{ summary.daily_avg_sessions }} {{ t('usage.perDay') }})</span></span>
          </div>
        </div>
      </div>

      <!-- Daily trend chart -->
      <div class="section glass">
        <h3 class="section-title">{{ t('usage.dailyTrend') }}</h3>
        <div v-if="summary.daily.length === 0" class="empty-state">{{ t('common.noData') }}</div>
        <div v-else class="daily-chart">
          <div class="chart-bars">
            <div
              v-for="day in summary.daily"
              :key="day.date"
              class="chart-bar-group"
              :title="`${day.date}: ${formatNumber(day.tokens)} tokens`"
            >
              <div class="bar-wrapper">
                <div
                  class="bar bar-input"
                  :style="{ height: barHeight(day.input_tokens) + '%' }"
                />
                <div
                  class="bar bar-output"
                  :style="{ height: barHeight(day.output_tokens) + '%' }"
                />
              </div>
              <span class="bar-label">{{ formatDate(day.date) }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot input" /> {{ t('usage.inputTokens') }}</span>
            <span class="legend-item"><span class="legend-dot output" /> {{ t('usage.outputTokens') }}</span>
          </div>
        </div>
      </div>

      <!-- Model distribution -->
      <div class="section glass">
        <h3 class="section-title">{{ t('usage.modelDistribution') }}</h3>
        <div v-if="modelEntries.length === 0" class="empty-state">{{ t('common.noData') }}</div>
        <div v-else class="model-bars">
          <div v-for="[model, count] in modelEntries" :key="model" class="model-row">
            <span class="model-name" :title="model">{{ model }}</span>
            <div class="model-bar-track">
              <div class="model-bar-fill" :style="{ width: modelPercent(count) + '%' }" />
            </div>
            <span class="model-count">{{ count }} <span class="model-pct">({{ modelPercent(count).toFixed(1) }}%)</span></span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsageStore } from '@/stores/usage'

const { t } = useI18n()
const usageStore = useUsageStore()

const periods = [
  { value: '7d' as const, label: '7D' },
  { value: '30d' as const, label: '30D' },
  { value: '90d' as const, label: '90D' },
  { value: '365d' as const, label: '1Y' },
]

const summary = computed(() => usageStore.usageSummary!)

const modelEntries = computed(() => {
  if (!usageStore.usageSummary?.model_distribution) return []
  return Object.entries(usageStore.usageSummary.model_distribution)
    .sort((a, b) => b[1] - a[1])
})

const maxDailyTokens = computed(() => {
  if (!summary.value?.daily?.length) return 1
  return Math.max(...summary.value.daily.map(d => d.input_tokens + d.output_tokens), 1)
})

function barHeight(tokens: number): number {
  return Math.max((tokens / maxDailyTokens.value) * 100, 0.5)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length === 3) return `${parts[1]}/${parts[2]}`
  return dateStr
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function modelPercent(count: number): number {
  const total = modelEntries.value.reduce((s, [, c]) => s + c, 0)
  return total > 0 ? (count / total) * 100 : 0
}

onMounted(() => {
  usageStore.fetchSummary()
  usageStore.fetchModels()
})
</script>

<style scoped>
.usage-view {
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
  min-height: 100vh;
  color: var(--text-primary, #e0e0e0);
  font-family: 'Noto Sans SC', sans-serif;
}

.usage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.usage-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #e0e0e0);
}

.period-tabs {
  display: flex;
  gap: 4px;
  background: var(--glass-bg, rgba(30, 40, 55, 0.6));
  border-radius: 8px;
  padding: 3px;
  border: 1px solid var(--border-base, rgba(90, 200, 250, 0.12));
}

.period-tab {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #999);
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.period-tab:hover {
  color: var(--text-primary, #e0e0e0);
  background: rgba(90, 200, 250, 0.08);
}

.period-tab.active {
  background: rgba(90, 200, 250, 0.18);
  color: rgba(90, 200, 250, 1);
  font-weight: 600;
}

/* Summary cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.summary-card {
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(90, 200, 250, 0.12);
  color: rgba(90, 200, 250, 1);
  flex-shrink: 0;
}

.card-icon.accent-input { background: rgba(100, 180, 255, 0.12); color: #64b4ff; }
.card-icon.accent-cost { background: rgba(255, 180, 60, 0.12); color: #ffb43c; }
.card-icon.accent-cache { background: rgba(100, 220, 160, 0.12); color: #64dca0; }
.card-icon.accent-session { background: rgba(200, 140, 255, 0.12); color: #c88cff; }

.card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-label {
  font-size: 12px;
  color: var(--text-tertiary, #777);
  white-space: nowrap;
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #e0e0e0);
  white-space: nowrap;
}

.card-sub {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-tertiary, #777);
}

.token-in { color: #64b4ff; }
.token-out { color: #f97583; }
.cost-value { color: #ffb43c; }

/* Sections */
.section {
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid var(--border-base, rgba(90, 200, 250, 0.12));
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-primary, #e0e0e0);
}

.empty-state {
  text-align: center;
  color: var(--text-tertiary, #777);
  padding: 32px 0;
  font-size: 14px;
}

/* Daily chart */
.daily-chart {
  overflow-x: auto;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 180px;
  padding: 0 4px 0 4px;
  min-width: fit-content;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 24px;
  flex: 1;
  max-width: 48px;
  height: 100%;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 1px;
  width: 100%;
}

.bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
  min-height: 1px;
  transition: transform var(--slow);
}

.bar-input {
  background: rgba(100, 180, 255, 0.6);
}

.bar-output {
  background: rgba(249, 117, 131, 0.6);
}

.bar-label {
  font-size: 10px;
  color: var(--text-tertiary, #777);
  margin-top: 6px;
  white-space: nowrap;
}

.chart-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary, #999);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-dot.input { background: rgba(100, 180, 255, 0.8); }
.legend-dot.output { background: rgba(249, 117, 131, 0.8); }

/* Model distribution */
.model-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.model-name {
  font-size: 13px;
  color: var(--text-secondary, #bbb);
  min-width: 130px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-bar-track {
  flex: 1;
  height: 8px;
  background: rgba(90, 200, 250, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.model-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(90, 200, 250, 0.4), rgba(90, 200, 250, 0.8));
  border-radius: 4px;
  transition: transform var(--slow);
}

.model-count {
  font-size: 12px;
  color: var(--text-secondary, #999);
  min-width: 60px;
  text-align: right;
}

.model-pct {
  color: var(--text-tertiary, #666);
  font-size: 11px;
}

/* Loading skeleton */
.usage-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.skeleton-card {
  height: 72px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(90, 200, 250, 0.04), rgba(90, 200, 250, 0.08), rgba(90, 200, 250, 0.04));
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Error */
.usage-error {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary, #999);
}

.retry-btn {
  margin-top: 12px;
  padding: 6px 16px;
  border: 1px solid var(--border-base, rgba(90, 200, 250, 0.22));
  background: rgba(90, 200, 250, 0.12);
  color: rgba(90, 200, 250, 1);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.retry-btn:hover {
  background: rgba(90, 200, 250, 0.22);
}

/* Glass styling */
.glass {
  background: var(--glass-bg, rgba(30, 40, 55, 0.6));
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid var(--border-base, rgba(90, 200, 250, 0.12));
}
</style>
