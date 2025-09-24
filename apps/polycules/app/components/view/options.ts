export interface ViewOptions {
    personRadius: number;
    personDefaultColor: string;
    personNameFontSize: number;
    personNamePadding: number;
    personNameColor: string;

    systemNamePaddingTop: number;
    systemNameFontSize: number;
    systemNameColor: string;

    linkDefaultColor: string;
    linkDefaultWidth: number;
};

export const OPTIONS: ViewOptions = {
    personRadius: 12,
    personDefaultColor: "red",
    personNameFontSize: 12,
    personNamePadding: 10,
    personNameColor: "white",

    systemNamePaddingTop: 0,
    systemNameFontSize: 8,
    systemNameColor: "lightgray",

    linkDefaultColor: "black",
    linkDefaultWidth: 2,
};
