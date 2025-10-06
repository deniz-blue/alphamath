import { asVec2, Vec2Like } from "./utils.js";
import { vec2 } from "./vec2.js";

export const vec2add = (...vecs: Vec2Like[]) => {
    return vecs.map(asVec2).reduce((acc, cur) => vec2(acc.x + cur.x, acc.y + cur.y), vec2());
};

export const vec2mul = (...vecs: Vec2Like[]) => {
    return vecs.map(asVec2).reduce((acc, cur) => vec2(acc.x * cur.x, acc.y * cur.y));
};

export const vec2sub = (a: Vec2Like, b: Vec2Like) => {
    const va = asVec2(a);
    const vb = asVec2(b);
    return vec2(va.x - vb.x, va.y - vb.y);
};

export const vec2div = (a: Vec2Like, b: Vec2Like) => {
    let _a = asVec2(a);
    let _b = asVec2(b);
    return vec2(_a.x / _b.x, _a.y / _b.y);
};

export const vec2average = (vecs: Vec2Like[]) =>
    vec2div(vec2add(...vecs), vecs.length);

export const vec2middle = (a: Vec2Like, b: Vec2Like) =>
    vec2average([a, b]);

export const vec2mag = (vec: Vec2Like) => {
    let _vec = asVec2(vec);
    return Math.sqrt(_vec.x ** 2 + _vec.y ** 2);
};

export const vec2distance = (a: Vec2Like, b: Vec2Like) => {
    let _a = asVec2(a);
    let _b = asVec2(b);
    return Math.sqrt((_a.x - _b.x) ** 2 + (_a.y - _b.y) ** 2);
};

export const vec2apply = (vec: Vec2Like, fn: (v: number) => number) => {
    let _vec = asVec2(vec);
    return vec2(fn(_vec.x), fn(_vec.y));
};

export const vec2round = (vec: Vec2Like) => vec2apply(vec, Math.round);
export const vec2floor = (vec: Vec2Like) => vec2apply(vec, Math.floor);
export const vec2ceil = (vec: Vec2Like) => vec2apply(vec, Math.ceil);

export const vec2normalize = (vec: Vec2Like) => vec2div(vec, vec2mag(vec));
export const vec2abs = (vec: Vec2Like) => vec2apply(vec, Math.abs);
export const vec2dot = (a: Vec2Like, b: Vec2Like) => {
    let _a = asVec2(a);
    let _b = asVec2(b);
    return vec2(_a.x * _b.x, _a.y * _b.y);
};
