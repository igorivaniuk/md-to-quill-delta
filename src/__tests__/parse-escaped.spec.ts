import { markdownToQuillDelta } from '../parser'

jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

describe(`markdownToQuillDelta-escaped`, () => {
  it('should parse: bold', () => {
    const md = 'test *bo\\*ld*'
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
      Array [
        Object {
          "insert": "test ",
        },
        Object {
          "attributes": Object {
            "bold": true,
          },
          "insert": "bo*ld",
        },
        Object {
          "insert": "
      ",
        },
      ]
    `)
  })

  it('should parse: italic', () => {
    const md = `test _ita\\_lic_`
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                              Array [
                                Object {
                                  "insert": "test ",
                                },
                                Object {
                                  "attributes": Object {
                                    "italic": true,
                                  },
                                  "insert": "ita_lic",
                                },
                                Object {
                                  "insert": "
                              ",
                                },
                              ]
                    `)
  })

  it('should parse: link', () => {
    const md = 'test [inline \\[ URL](http://www.example.com/)'
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                              Array [
                                Object {
                                  "insert": "test ",
                                },
                                Object {
                                  "attributes": Object {
                                    "link": "http://www.example.com/",
                                  },
                                  "insert": "inline [ URL",
                                },
                                Object {
                                  "insert": "
                              ",
                                },
                              ]
                    `)
  })
})
