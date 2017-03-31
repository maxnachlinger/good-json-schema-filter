'use strict'

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
            enum: ['filtered-type']
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

mockLogStream.push({
  type: 'this-will-not-make-it-through',
  foo: 'bar',
  bar: 'bar'
})
mockLogStream.push({
  type: 'filtered-type',
  foo: 'bar',
  bar: 'bar'
})
mockLogStream.push({
  type: 'this-will-be-passed-through',
  foo: 'bar',
  baz: 'bar'
})
