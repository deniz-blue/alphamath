export interface ViewOptions {
    personRadius: number;
    personDefaultColor: string;
    personNameFontSize: number;
    personNamePadding: number;
    personNameColor: string;

    systemNamePaddingTop: number;
    systemNameFontSize: number;
    systemNameBackgroundFontSize: number;
    systemNameColor: string;
    systemDefaultColor: string;

    systemBackgroundOpacity: number;
    systemBackgroundPadding: number;

    linkDefaultColor: string;
    linkDefaultWidth: number;
};

export const OPTIONS: ViewOptions = {
    personRadius: 12,
    personDefaultColor: "gray",
    personNameFontSize: 12,
    personNamePadding: 0,
    personNameColor: "#c9c9c9",

    systemNamePaddingTop: 0,
    systemNameFontSize: 6,
    systemNameColor: "#828282",
    systemDefaultColor: "#2e2e2e",
    systemNameBackgroundFontSize: 8,

    systemBackgroundOpacity: 0.5,
    systemBackgroundPadding: 8,

    linkDefaultColor: "black",
    linkDefaultWidth: 2,
};
