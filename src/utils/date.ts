export const formatDate = (date: Date | string | undefined): string =>
    date ? new Date(date).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" }) : "";
