export interface SquadPreset {
  id: string
  name: string
  icon: string
  description: string
  agents: Array<{
    name: string
    roleId: string // maps to agent-roles
  }>
}

export const SQUAD_PRESETS: SquadPreset[] = [
  {
    id: 'fullstack',
    name: '全栈开发小队',
    icon: 'rocket',
    description: '适合从零开始开发功能，包含完整的产品、架构和前后端角色。',
    agents: [
      { name: '项目经理', roleId: 'pm' },
      { name: '架构师', roleId: 'architect' },
      { name: '前端开发', roleId: 'frontend' },
      { name: '后端开发', roleId: 'backend' }
    ]
  },
  {
    id: 'review',
    name: '代码审查小队',
    icon: 'shield',
    description: '专注于代码质量、安全性和性能优化的专家组合。',
    agents: [
      { name: '测试工程师', roleId: 'qa' },
      { name: '安全专家', roleId: 'architect' },
      { name: '资深开发', roleId: 'backend' }
    ]
  },
  {
    id: 'rapid',
    name: '快速原型',
    icon: 'zap',
    description: '精简配置，快速验证想法。',
    agents: [
      { name: '全栈开发', roleId: 'frontend' },
      { name: '后端开发', roleId: 'backend' }
    ]
  }
]
