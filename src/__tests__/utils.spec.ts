import { whitespace, wordCharacter } from '../utils'

describe('utils', () => {
  it('wordCharacter', () => {
    expect(wordCharacter('d')).toBe(true)
    expect(wordCharacter('1')).toBe(true)
    expect(wordCharacter(' ')).toBe(false)
    expect(wordCharacter(1)).toBe(false)
  })

  it('whitespace', () => {
    expect(whitespace('d')).toBe(false)
    expect(whitespace('1')).toBe(false)
    expect(whitespace(' ')).toBe(true)
    expect(whitespace(1)).toBe(false)
  })
})
