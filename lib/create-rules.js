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
      omit: joi.alternatives(
        joi.boolean().valid(true).example(true),
        joi.array().items(joi.string()).example(['prop0', 'prop1'])
      ).required()
    }).required()
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

      if (Array.isArray(rule.action.omit)) {
        return _.omit(rule.action.omit, data)
      }
      return null
    }
  })
}
