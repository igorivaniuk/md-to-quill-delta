import { markdownToQuillDelta } from '../parser'

jest.mock('../environment.ts', () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

describe(`markdownToQuillDelta`, () => {
  it('should parse: bold', () => {
    const md = `test *bold*`
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "insert": "test ",
                          },
                          Object {
                            "attributes": Object {
                              "bold": true,
                            },
                            "insert": "bold",
                          },
                          Object {
                            "insert": "
                        ",
                          },
                        ]
                `)
    const md1 = `test * bold*`
    expect(markdownToQuillDelta(md1)).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "insert": "test ",
                          },
                          Object {
                            "attributes": Object {
                              "bold": true,
                            },
                            "insert": " bold",
                          },
                          Object {
                            "insert": "
                        ",
                          },
                        ]
                `)
  })

  it('should parse: italic', () => {
    const md = `test _italic_`
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "insert": "test ",
                          },
                          Object {
                            "attributes": Object {
                              "italic": true,
                            },
                            "insert": "italic",
                          },
                          Object {
                            "insert": "
                        ",
                          },
                        ]
                `)
  })

  it('should parse: code', () => {
    const md = 'test `code`'
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "insert": "test ",
                          },
                          Object {
                            "attributes": Object {
                              "code": true,
                            },
                            "insert": "code",
                          },
                          Object {
                            "insert": "
                        ",
                          },
                        ]
                `)
  })

  it('should parse: link', () => {
    const md = 'test [inline URL](http://www.example.com/)'
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "insert": "test ",
                          },
                          Object {
                            "attributes": Object {
                              "link": "http://www.example.com/",
                            },
                            "insert": "inline URL",
                          },
                          Object {
                            "insert": "
                        ",
                          },
                        ]
                `)
  })

  it('should parse: pre', () => {
    // tslint:disable-next-line: prefer-template
    const md = 'test \n```\n' + 'pre-formatted fixed-width code block\n' + '```'
    expect(markdownToQuillDelta(md)).toMatchInlineSnapshot(`
            Array [
              Object {
                "insert": "test ",
              },
              Object {
                "insert": "
            ",
              },
              Object {
                "insert": "
            ",
              },
              Object {
                "insert": "pre-formatted fixed-width code block",
              },
              Object {
                "attributes": Object {
                  "pre": true,
                },
                "insert": "
            ",
              },
              Object {
                "insert": "
            ",
              },
            ]
        `)
  })
})
