'use strict';

const TSLint = require('tslint');
const ts = require('typescript');
const isCallExpression = require('../helpers/isCallExpression');
const isPropertyAccessExpression = require('../helpers/isPropertyAccessExpression');

/**
 * @fileoverview Enforce expect having a corresponding matcher.
 */

const walk = function walk(ctx) {
  const checkNode = function checkNode(node) {
    if (
      node.kind === ts.SyntaxKind.CallExpression &&
      node.expression &&
      node.expression.text === 'expect' &&
      node.parent &&
      node.parent.parent &&
      !isCallExpression(node.parent.parent) &&
      !isPropertyAccessExpression(node.parent.parent)
    ) {
      return ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }

    return ts.forEachChild(node, checkNode);
  };

  return ts.forEachChild(ctx.sourceFile, checkNode);
};

class Rule extends TSLint.Rules.AbstractRule {
  apply(sourceFile) {
    return this.applyWithFunction(sourceFile, walk);
  }
}

Rule.FAILURE_STRING = 'Expect must have a corresponding matcher call.';

exports.Rule = Rule;