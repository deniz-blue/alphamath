import { BoxedExpression, ComputeEngine } from "@cortex-js/compute-engine";
const ce = new ComputeEngine();
export type RelationOperator = "==" | "!=" | "<" | ">" | "<=" | ">="; // TODO: add custom operator functionality
export type LogicOperator = "&&" | "||" | "=>" | "<=>";
export type TextNode = { type: "text", data: { content: string  } };
export type RelationNode = { type: "relation", data: { operator: RelationOperator, LHS: BoxedExpression, RHS: BoxedExpression } };
export type VariableDefinitionNode = { type: "variable", data: { symbol: string, value: BoxedExpression } };
export type FunctionDefinitionNode = { type: "function", data: never }; // to implement once sets are implemented
export type NegatedNode = { type: "negated", data: { node: Node } };
export type CompoundNode = { type: "compound", data: { operator: LogicOperator, Left: Node, Right: Node } }; //=> and <=> are for allowing things like "A=>B"=>"!B=>!A"
export type Node = TextNode | RelationNode | VariableDefinitionNode | FunctionDefinitionNode | CompoundNode | NegatedNode;
