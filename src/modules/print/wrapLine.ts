const MAX_LINE_LENGTH = 100

export default function wrapLine(text: string, options?: {
  continuationIndent?: number
  wordSeparator?: string
}): string[] {
  if (options?.continuationIndent && options?.continuationIndent < 0) {
    throw new Error('Continuation indent must be positive number.')
  }

  if (text.length <= MAX_LINE_LENGTH) {
    return [text]
  }

  const lineIndent = options?.continuationIndent ? ' '.repeat(options?.continuationIndent) : ''
  const words = text.split(options?.wordSeparator ?? ' ')
  const lines = []

  let lineBuffer: string[] = []
  let charCount = 0

  for (const word of words) {
    if (charCount + word.length + lineBuffer.length - 1 > MAX_LINE_LENGTH) {
      lines.push(lineBuffer.join(' '))
      lineBuffer = []
      charCount = 0
    }

    lineBuffer.push(word)
    charCount += word.length
  }

  lines.push(lineBuffer.join(' '))

  return lines.map((line, index) => (index > 0 ? lineIndent + line : line))
}
