import { vec2add, vec2div, vec2mul, vec2sub } from "./math.js";
import { asVec2, Vec2Like } from "./utils.js";
import { Vec2 } from "./vec2.js";

export const vec2math = (strings: TemplateStringsArray, ...values: Vec2Like[]): Vec2 => {
    type Op = "(" | ")" | "+" | "-" | "*" | "/";
    type Token =
        | { type: "op"; op: Op }
        | { type: "value"; value: Vec2Like }

    let tokens: Token[] = [];
    strings.forEach((str, i) => {
        for (let op of str.replace(/\s/g, "").split(""))
            tokens.push({ type: "op", op: op as Op });
        if (i < values.length)
            tokens.push({ type: "value", value: values[i] })
    })

    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    const isNextOp = (op: Op) => {
        let p = peek();
        return p && p.type == "op" && p.op == op;
    };

    const parseExpr = (): Vec2Like => {
        let acc: Vec2Like = null;
        let lastOp: Op | null = null;
        loop: while (peek() && !isNextOp(")")) {
            let tkn = next()!;
            if (tkn.type == "op") {
                switch (tkn.op) {
                    case "(":
                        let inner = parseExpr();
                        if(lastOp) doOp(lastOp, inner);
                        else { acc = inner };
                        continue loop;
                    default:
                        lastOp = tkn.op;
                }
            } else {
                doOp(lastOp, tkn.value);
            }
        }

        function doOp(op: Op | null, v: Vec2Like) {
            switch (lastOp) {
                case "+":
                    acc = vec2add(acc ?? 0, v);
                    break;
                case "*":
                    acc = vec2mul(acc ?? 1, v);
                    break;
                case "/":
                    acc = vec2div(acc ?? 0, v);
                    break;
                case "-":
                    acc = vec2sub(acc ?? 0, v);
                    break;
            }
        }

        return acc;
    };


    return asVec2(parseExpr());
};
