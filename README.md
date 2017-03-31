# good-json-schema-filter
A Good log object transform stream which filters via json-schema

[![standard][standard-image]][standard-url]
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]

[travis-image]: https://travis-ci.org/maxnachlinger/good-json-schema-filter.svg?branch=master
[travis-url]: https://travis-ci.org/maxnachlinger/good-json-schema-filter
[npm-image]: https://img.shields.io/npm/v/good-json-schema-filter.svg?style=flat
[npm-url]: https://npmjs.org/package/good-json-schema-filter
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

### Installation:
```
npm i good-json-schema-filter --save
```

### What problem does this solve?
This library allows you to omit keys or entire log objects matched via json-schema syntax.

### Example
```javascript
const Stream = require('stream')
const SafeJson = require('good-squeeze').SafeJson
const GoodJsonSchemaFilter = require('../')

const mockLogStream = new Stream.Readable({objectMode: true})
mockLogStream._read = () => {}

const transform = new GoodJsonSchemaFilter({
  rules: [
    {
      name: 'omit-log-object-keys-example-rule',
      test: {
        properties: {
          type: {
            enum: ['filtered-type-omitted-keys']
          }
        },
        required: [
          'type'
        ]
      },
      action: {
        omitKeys: ['foo', 'bar']
      }
    }, {
      name: 'omit-log-object-example-rule',
      test: {
        properties: {
          type: {
            enum: ['this-will-not-make-it-through']
          }
        },
        required: [
          'type'
        ]
      },
      action: {
        omit: true
      }
    }
  ]
})

mockLogStream
  .pipe(transform)
  .pipe(new SafeJson())
  .pipe(process.stdout)

mockLogStream.push({type: 'this-will-not-make-it-through', foo: 'bar', bar: 'bar'})
mockLogStream.push({type: 'filtered-type-omitted-keys', foo: 'bar', bar: 'bar'})
mockLogStream.push({type: 'this-will-be-passed-through', foo: 'bar', baz: 'bar'})
```
This prints:
```javascript
{"type":"filtered-type"}
{"type":"this-will-be-passed-through","foo":"bar","baz":"bar"}
```
