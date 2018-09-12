import {regex, string, lazy, seq} from 'parsimmon'

function lexeme(p) { return p.skip(regex(/[ \n]*/)) }

const lparen = lexeme(string('{'))
const rparen = lexeme(string('}'))

const elem = lazy('', () => { return block.or(line) })

const id   = lexeme(regex(/@[\w-]*/i))
const atom = regex(/[^\{\}\n ]+/).skip(regex(/ */))

const line  = regex(/[\n ]*/).then(atom.many()).skip(regex(/\n+/))
const block = regex(/[\n ]*/).then(seq(id, lparen.then(elem.many()).skip(rparen)))

const root = block.many()

export default {
  preserve(string) {
    let value = ''
    let level = 0
    string.split(/\r\n|\r|\n/).forEach((line) => {
      const indent = Math.floor(line.match(/^ */)[0].length / 2)
      if (level < indent) {
        value += "{".repeat(indent - level) + "\n" + line + "\n"
      } else if (level > indent) {
        value += "}".repeat(level - indent) + "\n" + line + "\n"
      } else {
        value += line + "\n"
      }
      level = indent
    })
    value += "}".repeat(level)
    return value
  },
  parse(string) {
    return root.parse(this.preserve(string)).value
  }
}