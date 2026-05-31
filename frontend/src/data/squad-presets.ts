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
    icon: '🚀',
    description: '适合从零开始开发功能，包含完整的产品、架构和前后端角色。',
    agents: [
      { name: 'PM Alice', roleId: 'pm' },
      { name: 'Architect Bob', roleId: 'architect' },
      { name: 'Frontend Charlie', roleId: 'frontend' },
      { name: 'Backend Dave', roleId: 'backend' }
    ]
  },
  {
    id: 'review',
    name: '代码审查小队',
    icon: '🔍',
    description: '专注于代码质量、安全性和性能优化的专家组合。',
    agents: [
      { name: 'QA Tester', roleId: 'qa' },
      { name: 'Security Expert', roleId: 'architect' }, // Reuse architect logic
      { name: 'Senior Dev', roleId: 'backend' }
    ]
  },
  {
    id: 'rapid',
    name: '快速原型',
    icon: '⚡',
    description: '精简配置，快速验证想法。',
    agents: [
      { name: 'Lead Dev', roleId: 'frontend' },
      { name: 'Backend Dev', roleId: 'backend' }
    ]
  }
]
