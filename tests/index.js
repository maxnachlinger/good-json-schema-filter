'use strict'

const test = require('tape')
const GoodJsonSchemaFilter = require('../lib')

const callLib = (rules, input, callback) => {
  const lib = new GoodJsonSchemaFilter({rules})
  return lib._transform(input, 'utf8', callback)
}

const simpleSchema = {
  properties: {
    type: {
      enum: ['test-type-0', 'test-type-1']
    }
  },
  required: [
    'type'
  ]
}

test('Omits keys from input on matched schemas', (t) => {
  const input = {
    type: 'test-type-1',
    foo: 'bar',
    bar: 'bar'
  }

  const rules = [{
    name: 'test-0',
    test: simpleSchema,
    action: {
      omitKeys: ['foo', 'bar']
    }
  }]

  callLib(rules, input, (err, result) => {
    t.notOk(err, 'no error should be returned')
    t.ok(result.type, 'type key should still be present')
    t.notOk(result.foo, 'foo key should be omitted')
    t.notOk(result.bar, 'bar key should be omitted')
    t.end()
  })
})

test('Omits input on matched schemas', (t) => {
  const input = {
    type: 'test-type-1',
    foo: 'bar',
    bar: 'bar'
  }

  const rules = [{
    name: 'test-0',
    test: simpleSchema,
    action: {
      omit: true
    }
  }]

  callLib(rules, input, (err, result) => {
    t.notOk(err, 'no error should be returned')
    t.notOk(result, 'input should be empty')
    t.end()
  })
})

test('Passes input through on unmatched schemas', (t) => {
  const input = {
    name: 'test',
    foo: 'bar',
    bar: 'bar'
  }

  const rules = [{
    name: 'test-0',
    test: simpleSchema,
    action: {
      omitKeys: ['foo', 'bar']
    }
  }]
  callLib(rules, input, (err, result) => {
    t.notOk(err, 'no error should be returned')
    t.deepEqual(result, input, 'input should be passed through')
    t.end()
  })
})
