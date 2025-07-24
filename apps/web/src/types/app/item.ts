import React from "react";
import { Node } from "../model/node";
import { EnumVariantComponent } from "../utils";
import { id } from "../../utils/id";
import { DefaultSize, Size, WithId } from "../scalar";
import { createFactory, Enum } from "@alan404/enum";
import { ComputeEngine, BoxedExpression } from "@cortex-js/compute-engine";
import { Vec2, vec2 } from "@alan404/vec2";

var ce = new ComputeEngine();
export const Item = createFactory<Item>(({ type }) => ({
    id: id(),
    position: vec2(),
}));

export type Item = Node & {
    position: Vec2;
} & WithId;

export type ItemComponent<Ty extends Item["type"]> = EnumVariantComponent<Item, Ty, {
    onFocus?: () => void;
    onClose?: () => void;
}>;

export const createNew: Partial<Record<Item["type"], () => Item>> = {
    text: () => Item.text({
        content: "Enter some text",
    }),

    relation: () => Item.relation({
        operator: "==",
        LHS: ce.box("y"),
        RHS: ce.box("mx+b")
    }),
    compound: () => Item.compound({
        operator: "&&",
        Left: { type: "text", data: { content: "afdsdfjsd" } },
        Right: { type: "relation", data: { operator: "==", LHS: ce.box("Pi"), RHS: ce.box("3") } }
    }),
    negated: () => Item.negated({
        node: { type: "text", data: { content: "Foo is Bar" } }
    }),
    variable: () => Item.variable({
        symbol: "x",
        value: ce.box("4")
    })
};
