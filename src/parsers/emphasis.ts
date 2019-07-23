import { trim, whitespace, wordCharacter } from '../utils'

function locate(value: string, fromIndex: number) {
  return value.indexOf('_', fromIndex)
}

emphasisCustom.locator = locate

const underscore = '_'
const backslash = '\\'

export default function emphasisCustom(
  this: any,
  eat: any,
  value: string,
  silent: boolean
) {
  // tslint:disable-next-line: no-invalid-this
  const self = this
  let index = 0
  let character = value.charAt(index)
  let pedantic
  let marker
  let queue
  let subvalue
  let length
  let prev

  if (character !== underscore) {
    return
  }

  pedantic = self.options.pedantic
  subvalue = character
  marker = character
  length = value.length
  index++
  queue = ''
  character = ''

  if (pedantic && whitespace(value.charAt(index))) {
    return
  }

  while (index < length) {
    prev = character
    character = value.charAt(index)

    if (character === marker && (!pedantic || !whitespace(prev))) {
      character = value.charAt(++index)

      if (character !== marker) {
        if (!trim(queue) || prev === marker) {
          return
        }

        if (!pedantic && marker === underscore && wordCharacter(character)) {
          queue += marker
          continue
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        return eat(subvalue + queue + marker)({
          type: 'emphasis',
          value: queue.replace('\\', ''),
        })
      }

      queue += marker
    }

    if (!pedantic && character === backslash) {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
}
