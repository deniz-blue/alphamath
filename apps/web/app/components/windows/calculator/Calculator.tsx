import { ActionIcon, Button, Group, Paper, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { evaluate } from "mathjs";
import { useRef } from "react";

export const Calculator = () => {
    const [input, setInput] = useInputState("");
    const [result, setResult] = useInputState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const compute = () => {
        try {
            const res = evaluate(input);
            setResult("" + res);
        } catch (e) {
            setResult("" + e);
        }
        setInput("");
    };

    const clear = () => {
        setInput("");
        setResult("");
    }

    return (
        <Paper p="xs"
            onKeyDown={(e) => {
                if (e.key.length == 1) setInput(input + e.key);
                if (e.key == "Enter") compute();
            }}
        >
            <Stack gap={0}>
                <TextInput
                    value={input}
                    onChange={setInput}
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") compute();
                    }}
                    onFocus={(e) => {
                        const len = e.currentTarget.value.length;
                        e.currentTarget.setSelectionRange(len, len);
                    }}
                    variant="filled"
                    styles={{
                        input: { textAlign: "right" },
                    }}
                />

                <Textarea
                    readOnly
                    autosize
                    minRows={1}
                    value={result}
                    variant="unstyled"
                    styles={{
                        input: { textAlign: "right" },
                    }}
                />

                <Stack align="center" gap="xs">
                    <Button
                        onClick={clear}
                        variant="light"
                        color="gray"
                        fullWidth
                    >
                        Clear
                    </Button>

                    <SimpleGrid cols={4} spacing="xs" verticalSpacing="xs">
                        {"789/456*123-0.=+".split("").map(char => (
                            <ActionIcon
                                key={char}
                                variant="light"
                                size="input-md"
                                onClick={(e) => {
                                    inputRef.current?.focus();
                                    if (char == "=")
                                        compute()
                                    else
                                        setInput(input + char)
                                }}
                            >
                                {char}
                            </ActionIcon>
                        ))}
                    </SimpleGrid>
                </Stack>
            </Stack>
        </Paper>
    )
};
