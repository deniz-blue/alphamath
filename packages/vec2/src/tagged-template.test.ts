import { expect, test } from "vitest";
import { vec2 } from "./vec2.js";
import { vec2math } from "./tagged-template.js";

test("adds 2 vecs", () => {
    let a = vec2(1, 2);
    let b = vec2(5, -3);
    expect(vec2math`${a} + ${b}`).deep.eq(vec2(6, -1));
})

test("vec multiplication with parenthesis", () => {
    let a = vec2(1, 2);
    let b = vec2(5, -3);
    expect(vec2math`(${a} + ${b}) * ${3}`).deep.eq(vec2(18, -3));
})
