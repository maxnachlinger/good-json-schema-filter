'use strict'

const _ = require('lodash/fp')
const joi = require('joi')
const Djv = require('djv')

const rulesSchema = joi.array().items(
  joi.object().keys({
    name: joi.string().required().example('test-rule'),
    test: joi.object().required().example({
      properties: {
        type: {
          enum: ['test-type-0', 'test-type-1']
        }
      },
      required: [
        'type'
      ]
    }),
    action: joi.object().keys({
      omitKeys: joi.array().items(joi.string()).example(['prop0', 'prop1']),
      omit: joi.boolean().example(true)
    }).xor('omitKeys', 'omit').required()
  })
).min(1).required()

module.exports = (rules) => {
  joi.assert(rules, rulesSchema)

  const validator = new Djv()

  // load json-schemas into the validator
  rules.forEach((rule) => validator.addSchema(rule.name, rule.test))

  return rules.map((rule) => {
    return (data) => {
      if (validator.validate(rule.name, data)) {
        return data
      }
      return rule.action.omitKeys ? _.omit(rule.action.omitKeys, data) : null
    }
  })
}
