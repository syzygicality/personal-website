// Turbopack loader: compiles a .yaml file into a JS module exporting its parsed contents.
// Importing yaml through the bundler (instead of reading it with fs) lets `next dev` hot reload on edits.
const yaml = require('js-yaml')

module.exports = function yamlLoader(source) {
  return `export default ${JSON.stringify(yaml.load(source) ?? {})}`
}
