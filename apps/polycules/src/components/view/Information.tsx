import { Anchor, Box, Center, Group, Image, Stack, Text } from "@mantine/core";
import type { RefCallback } from "react";

export const Information = () => {
    const allowClick: RefCallback<HTMLAnchorElement> = (el) => {
        if (!el) return;
        const c = new AbortController();
        el.addEventListener("pointerdown", e => e.stopPropagation(), { signal: c.signal });
        el.addEventListener("touchstart", e => e.stopPropagation(), { signal: c.signal });
        return () => c.abort();
    };

    const size = 500;

    return (
        <g pointerEvents="unset">
            <foreignObject x={-size / 2} y={-size / 2} width={size} height={size}>
                <Center w="100%" h="100%">
                    <Stack c="dimmed" align="center" ta="center" gap="sm">
                        <Text inherit>
                            Welcome to <Text inline span inherit td="underline dotted">poly.deniz.blue</Text>
                        </Text>

                        <Text inherit>
                            A graph editor for <Anchor
                                href="https://en.wikipedia.org/wiki/Polyamory"
                                target="_blank"
                                ref={allowClick}
                            >
                                <Text inline inherit span ff="Times New Roman">&pi;</Text> non-monogamous
                            </Anchor> relationships that can include <Anchor
                                href="https://morethanone.info"
                                target="_blank"
                                ref={allowClick}
                            >
                                    <Image
                                        w={20}
                                        h={20}
                                        display="inline"
                                        style={{
                                            lineHeight: 1,
                                            verticalAlign: "middle",
                                            imageRendering: "auto",
                                        }}
                                        src="https://github.com/deniz-blue/md-emojis/raw/main/emojis/identity/plurality-colors.svg"
                                    />
                                    {" "}plurality
                            </Anchor>
                        </Text>
                        <Text inherit>
                            Start by adding new systems or people
                        </Text>
                        <Text inherit fz="xs">
                            You can share your graph with others by exporting as a link or a json.
                            {" "}
                            This project is <Anchor
                                href="https://github.com/deniz-blue/alphamath/tree/main/apps/polycules"
                                target="_blank"
                                ref={allowClick}
                                inherit
                            >
                                open source
                            </Anchor>!
                        </Text>
                    </Stack>
                </Center>
            </foreignObject>
        </g>
    );
};
