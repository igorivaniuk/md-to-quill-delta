import { trim, whitespace } from '../utils'

function locate(value: string, fromIndex: number) {
  return value.indexOf('*', fromIndex)
}

strongCustom.locator = locate

const backslash = '\\'
const asterisk = '*'

export default function strongCustom(
  this: any,
  eat: any,
  value: string,
  silent: boolean
) {
  const self = this
  let index = 0
  let character = value.charAt(index)
  let pedantic
  let marker
  let queue
  let subvalue
  let length
  let prev

  if (character !== asterisk) {
    return
  }

  pedantic = self.options.pedantic
  marker = character
  subvalue = marker
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
      character = value.charAt(index + 1)

      if (character !== marker) {
        if (!trim(queue)) {
          return
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        return eat(subvalue + queue + subvalue)({
          type: 'strong',
          value: queue.replace('\\', ''),
        })
      }
    }

    if (!pedantic && character === backslash) {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
}
