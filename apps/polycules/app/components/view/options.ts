export interface ViewOptions {
    personRadius: number;
    personDefaultColor: string;
    personNameFontSize: number;
    personNamePadding: number;
    personNameColor: string;

    systemNamePaddingTop: number;
    systemNameFontSize: number;
    systemNameColor: string;
    systemDefaultColor: string;

    linkDefaultColor: string;
    linkDefaultWidth: number;
};

export const OPTIONS: ViewOptions = {
    personRadius: 12,
    personDefaultColor: "gray",
    personNameFontSize: 12,
    personNamePadding: 10,
    personNameColor: "#c9c9c9",

    systemNamePaddingTop: 0,
    systemNameFontSize: 8,
    systemNameColor: "#828282",
    systemDefaultColor: "#2e2e2e",

    linkDefaultColor: "black",
    linkDefaultWidth: 2,
};
