'use strict'

const test = require('tape')
const createRules = require('../lib/create-rules')

test('Creates a rule given valid input', (t) => {
  const rules = [{
    name: 'test-0',
    test: {
      properties: {
        type: {
          enum: ['test-type-0', 'test-type-1']
        }
      },
      required: [
        'type'
      ]
    },
    action: {
      omitKeys: ['foo', 'bar']
    }
  }]

  const createdRules = createRules(rules)
  t.equal(createdRules.length, 1, '1 rule was created')
  t.end()
})
