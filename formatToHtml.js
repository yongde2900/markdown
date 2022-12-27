const commonmark = require('commonmark')
module.exports = (string) => {
    const reader = new commonmark.Parser()
    const writer = new commonmark.HtmlRenderer()
    let parsed = reader.parse(string)
    let result = writer.render(parsed)
    return result
}