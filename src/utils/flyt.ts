const flytBaseUrl = "https://flyt.vigoiks.no";
const sourceApplicationIds = "5";
const sourceApplicationIntegrationIds = "DROSJELOYVE,DROSJESENTRAL";

const countyToOrgId: Record<string, string> = {
    Agder: "agderfk-no",
    Akershus: "afk-no",
    Buskerud: "bfk-no",
    Finnmark: "ffk-no",
    Innlandet: "innlandetfylke-no",
    "Møre og Romsdal": "mrfylke-no",
    Nordland: "nfk-no",
    Oslo: "bym-oslo-kommune-no",
    Rogaland: "rogfk-no",
    Telemark: "telemarkfylke-no",
    Troms: "tromsfylke-no",
    Trøndelag: "trondelagfylke-no",
    Vestfold: "vestfoldfylke-no",
    Vestland: "vlfk-no",
    Østfold: "ofk-no",
};

export const getFlytIntegrationUrl = (countyName: string): string | undefined => {
    const orgId = countyToOrgId[countyName];
    if (!orgId) return undefined;

    const searchParams = new URLSearchParams({
        sourceApplicationIds,
        sourceApplicationIntegrationIds,
    });

    return `${flytBaseUrl}/${orgId}/integration/instance/list?${searchParams.toString()}`;
};

const toSourceApplicationInstanceId = (archiveReference: string): string => {
    const separatorIndex = archiveReference.indexOf("-");
    if (separatorIndex === -1) return archiveReference;

    return `${archiveReference.slice(0, separatorIndex)}/${archiveReference.slice(separatorIndex + 1)}`;
};

export const getFlytInstanceUrl = (countyName: string, archiveReference: string): string | undefined => {
    const orgId = countyToOrgId[countyName];
    if (!orgId) return undefined;

    const searchParams = new URLSearchParams({
        sourceApplicationInstanceIds: toSourceApplicationInstanceId(archiveReference),
    });

    return `${flytBaseUrl}/${orgId}/integration/instance/list?${searchParams.toString()}`;
};
