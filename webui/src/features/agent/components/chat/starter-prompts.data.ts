import {
  CodeStarterIcon,
  LearnStarterIcon,
  VisualizeStarterIcon,
  WriteNoteStarterIcon,
} from "@/components/icons"
import type { AppIconComponent } from "@/components/icons"


export type StarterPromptDefinition = {
  id: string
  label: string
  description: string
  prompt: string
  icon: AppIconComponent
}


export const STARTER_PROMPTS: StarterPromptDefinition[] = [
  {
    id: "learn",
    label: "学习",
    description: "先问几个问题理清思路，再从零搞懂一个主题。",
    icon: LearnStarterIcon,
    prompt: `Hi! Could you help me understand a complex topic from scratch? If you need more information from me, ask me 1-2 key questions right away, like what topic I want to learn and what level I’m at now. If you think I should give you more context to help you do a better job, let me know. Use any tools you have access to, like web search or documents already available in the workspace, if they’ll help. If it makes sense, create something we can look at together, like a visual, a checklist, a comparison table, or something interactive. Thanks for your help!`,
  },
  {
    id: "visualize",
    label: "可视化",
    description: "把一个主题或流程画成图、概念图或可视化讲解。",
    icon: VisualizeStarterIcon,
    prompt: `Hi! Could you help me create a visual explainer for a topic, idea, or process? If you need more information from me, ask me 1-2 key questions right away, like what I want to explain, who it’s for, and what kind of visual would be most useful. If you think I should give you more context to help you do a better job, let me know. Use any tools you have access to if they’ll help. If it makes sense, create something we can look at together, like a diagram, a flow, a concept map, a checklist, or something interactive. Thanks for your help!`,
  },
  {
    id: "write-note",
    label: "写便签",
    description: "研究一个主题，把结果整理成一张详细的便签。",
    icon: WriteNoteStarterIcon,
    prompt: `Hi! Could you help me research a topic and turn what you find into a detailed sticky note? If you need more information from me, ask me 1-2 key questions right away, like what topic I want covered and what depth or angle I care about most. If you think I should give you more context to help you do a better job, let me know. Use any tools you have access to, like web search or documents already available in the workspace, if they’ll help. If it makes sense, organize the result into a clear, useful note with the most important points, supporting details, and a structure that’s easy to skim. Thanks for your help!`,
  },
  {
    id: "code",
    label: "代码",
    description: "写一个简单的 Python 算法，附示例和简短说明。",
    icon: CodeStarterIcon,
    prompt: `Hi! Could you help me write a simple implementation of an algorithm in Python? If you need more information from me, ask me 1-2 key questions right away, like what the algorithm should do, what inputs and outputs I want, and any constraints or edge cases I care about. If you think I should give you more context to help you do a better job, let me know. Use any tools you have access to if they’ll help. If it makes sense, include a clean Python implementation, a short explanation of how it works, and a few example inputs and outputs. Thanks for your help!`,
  },
]
