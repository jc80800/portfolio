const WORDS_PER_MINUTE = 200
const TEXT_NODE_TYPES = ['text', 'code', 'inlineCode']

export default function remarkReadingTime() {
  return (tree) => {
    let yamlNode = null
    let words = 0
    const walk = (node) => {
      if (!node) return
      if (node.type === 'yaml') {
        yamlNode = node
        return
      }
      if (typeof node.value === 'string' && TEXT_NODE_TYPES.includes(node.type)) {
        words += node.value.trim().split(/\s+/).filter(Boolean).length
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child)
      }
    }
    walk(tree)
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
    if (yamlNode) {
      yamlNode.value = `${yamlNode.value}\nreadingTime: ${minutes}`
    }
  }
}
