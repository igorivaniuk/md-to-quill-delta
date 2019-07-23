import Op from 'quill-delta/dist/Op'
// tslint:disable-next-line: match-default-export-name
import markdown from 'remark-parse'
import unified from 'unified'
import emphasisCustom from './parsers/emphasis'
import strongCustom from './parsers/strong'

export function markdownToQuillDelta(md: string): Op[] {
  markdown.Parser.prototype.blockMethods = [
    'newline',
    'indentedCode',
    'fencedCode',
    'paragraph',
  ]
  markdown.Parser.prototype.inlineMethods = [
    'escape',
    'link',
    'emphasis',
    'strong',
    'code',
    'text',
  ]

  markdown.Parser.prototype.inlineTokenizers.emphasis = emphasisCustom as any
  markdown.Parser.prototype.inlineTokenizers.strong = strongCustom as any

  // console.log(markdown)
  const processor = unified().use(markdown, {
    gfm: true,
    pedantic: false,
    commonmark: true,
  })
  const tree: any = processor.parse(md)

  const ops: Op[] = []
  const addNewline = () => ops.push({ insert: '\n' })

  const flatten = (arr: any[]): any[] =>
    arr.reduce((flat, next) => flat.concat(next), [])

  const paragraphVisitor = (initialOp: Op = {}) => (nodeInput: any) => {
    const { children } = nodeInput

    const visitNode = (node: any, op: Op): Op[] | Op => {
      if (node.type === 'text') {
        // tslint:disable: no-parameter-reassignment
        op = { ...op, insert: node.value }
      } else if (node.type === 'strong') {
        op = {
          insert: node.value,
          attributes: { ...op.attributes, bold: true },
        }
      } else if (node.type === 'emphasis') {
        op = {
          insert: node.value,
          attributes: { ...op.attributes, italic: true },
        }
      } else if (node.type === 'link') {
        op = {
          insert: node.children
            .filter((t: any) => t.type === 'text')
            .map((s: any) => s.value)
            .join(''),
          attributes: { ...op.attributes, link: node.url },
        }
      } else if (node.type === 'inlineCode') {
        op = {
          insert: node.value,
          attributes: { ...op.attributes, code: true },
        }
      } else {
        // tslint:disable: no-console
        console.log(`Unsupported note type in paragraph: ${node.type}`)
      }

      return op
    }

    for (const child of children) {
      const localOps = visitNode(child, initialOp)

      if (localOps instanceof Array) {
        flatten(localOps).forEach((op) => ops.push(op))
      } else {
        ops.push(localOps)
      }
    }
  }

  for (let idx = 0; idx < tree.children.length; idx++) {
    const child = tree.children[idx]
    const nextType: string =
      idx + 1 < tree.children.length ? tree.children[idx + 1].type : 'lastOne'

    // console.log(JSON.stringify(child, null, 2))

    if (child.type === 'paragraph') {
      paragraphVisitor()(child)

      if (nextType === 'paragraph' || nextType === 'code') {
        addNewline()
        addNewline()
      } else if (nextType === 'lastOne') {
        addNewline()
      }
    } else if (child.type === 'code') {
      ops.push({ insert: child.value })
      ops.push({ insert: '\n', attributes: { pre: true } })

      if (nextType === 'paragraph' || nextType === 'lastOne') {
        addNewline()
      }
    } else {
      console.log(`Unsupported child type: ${child.type}`)
    }
  }

  return ops
}
