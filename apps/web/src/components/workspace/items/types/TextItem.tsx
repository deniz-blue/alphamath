import { useContext, useEffect } from "react";
import { ToolContext } from "../../ToolContext";
import { PanelWindow } from "../../util/PanelWindow";
import { EnumVariantComponent } from "../../../../types/utils";
import { Item, ItemComponent } from "../../../../types/app/item";
import { Text, Textarea, TextInput } from "@mantine/core";
import { usePrevious, useResizeObserver } from "@mantine/hooks";

const sizeOf = (s: string) => {
    let e = document.createElement("div");
    e.innerText = s.split("\n").map(x => x + " ").join("\n");
    e.style.position = "fixed";
    e.style.overflow = "visible";
    e.style.whiteSpace = "pre";
    e.style.visibility = "hidden";
    e.style.fontFamily = "monospace";
    e.style.textWrap = "nowrap";
    e.style.lineHeight = "var(--mantine-line-height)";
    e.style.fontSize = "var(--mantine-font-size-md)";
    document.body.appendChild(e);
    let bb = e.getBoundingClientRect();
    let w = bb.width;
    let h = bb.height;
    e.remove();
    return { w, h };
}

export const TextItem: ItemComponent<"text"> = ({
    data,
    onChange,
    onFocus,
    onClose,
}) => {
    const { tool } = useContext(ToolContext);

    return (
        <PanelWindow
            title="text"
            size={{
                w: 200,
                h: 132,
            }}
            onFocus={onFocus}
            onClose={onClose}
        >
            {tool.type == "Edit" ? (
                <Textarea
                    ff="monospace"
                    value={data.content}
                    p={0}
                    fz="md"
                    onChange={(e) => onChange({
                        ...data,
                        content: e.currentTarget.value,
                    })}
                    styles={{
                        wrapper: { height: "100%" },
                        input: {
                            height: "100%",
                            fontFamily: "monospace",
                            fontSize: "var(--mantine-font-size-md)",
                            overflow: "hidden",
                            textWrap: "nowrap",
                            padding: "0px !important",
                        },
                    }}
                    w="100%"
                    h="100%"
                />
            ) : (
                <Text
                    ff="monospace"
                    p="sm"
                    style={{
                        whiteSpace: "pre",
                        inlineSize: "min-content",
                        padding: "0px !important",
                        textWrap: "nowrap",
                    }}
                    w="fit-content"
                >
                    {data.content}
                </Text>
            )}
        </PanelWindow>
    )
};
