const fromCode = String.fromCharCode
const re = /\w/

// Check if the given character code, or the character code at the first
// character, is a word character.
export function wordCharacter(character: string | number) {
  return re.test(
    typeof character === 'number' ? fromCode(character) : character.charAt(0)
  )
}
const reWhiteSpace = /\s/

// Check if the given character code, or the character code at the first
// character, is a whitespace character.
export function whitespace(character: string | number) {
  return reWhiteSpace.test(
    typeof character === 'number' ? fromCode(character) : character.charAt(0)
  )
}

export function trim(str: string) {
  return str.replace(/^\s*|\s*$/g, '')
}
