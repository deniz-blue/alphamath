export const mergeProps = <T>(...args: (T | null | undefined)[]) => {
    let output: Record<string, any> = {};

    for (let props of args) {
        if (!props) continue;
        for (let [k, v] of Object.entries(props)) {
            if (typeof v == "function" || typeof output[k] == "function") {
                output[k] = mergeEvents([
                    output[k],
                    v,
                ]);
            } else {
                output[k] = v;
            }
        }
    }

    return output;
};

export const mergeEvents = <E>(
    handlers: (((e: E) => void) | undefined | null)[] = [],
) => {
    return (e: E) => {
        for (let handler of handlers)
            handler?.(e);
    };
};
