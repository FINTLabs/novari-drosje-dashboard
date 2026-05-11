import novariLogo from '/novari.svg'
import './App.css'
import axios from "axios"
import {useState, useEffect} from "react";
import {
    Alert,
    Divider,
    Heading,
    Pagination,
    Paragraph,
    Search,
    Table,
    Tag,
    ToggleGroup,
    usePagination
} from "@digdir/designsystemet-react";

const formatDate = (date: Date | string | undefined): string =>
    date ? new Date(date).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" }) : "";

type Application = {
    archiveReference: string
    appId: string
    requestorName: string
    subjectName: string
    status: string
    caseId: string
    archivedDate: Date
    updatedDate: Date
}

type Organisation = {
    [key: string] : string
}

function App() {

    const [status, setStatus] = useState<string[]>([]);
    const [organisation, setOrganisation] = useState<Organisation>({});
    const [application, setApplication] = useState<Application[]>([]);
    const [error, setError] = useState<string>('');

    const [filter, setFilter] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [filterOrganisation, setFilterOrganisation] = useState<string>("ALL");
    const [filterAppId, setFilterAppId] = useState<string>("ALL");

    const uniqueAppIds = Array.from(new Set(application.map(app => app.appId || "legacy/drosjeloyve")));

    const matchesSearch = (a: Application) =>
        a.subjectName?.toLowerCase().includes(filter.toLowerCase()) ||
        a.archiveReference.toLowerCase().startsWith(filter.toLowerCase()) ||
        a.caseId?.toLowerCase().startsWith(filter.toLowerCase());
    const matchesStatus = (a: Application, v: string) => v === "ALL" || a.status === v;
    const matchesOrg = (a: Application, v: string) => v === "ALL" || a.requestorName === v;
    const matchesApp = (a: Application, v: string) => {
        if (v === "ALL") return true;
        if (v === "legacy/drosjeloyve") return !a.appId;
        return a.appId === v;
    };

    const filteredApplications = application.filter(a =>
        matchesSearch(a) &&
        matchesStatus(a, filterStatus) &&
        matchesOrg(a, filterOrganisation) &&
        matchesApp(a, filterAppId)
    );

    const appCount = (v: string) => application.filter(a =>
        matchesSearch(a) && matchesStatus(a, filterStatus) && matchesOrg(a, filterOrganisation) && matchesApp(a, v)
    ).length;
    const statusCount = (v: string) => application.filter(a =>
        matchesSearch(a) && matchesApp(a, filterAppId) && matchesOrg(a, filterOrganisation) && matchesStatus(a, v)
    ).length;
    const orgCount = (v: string) => application.filter(a =>
        matchesSearch(a) && matchesApp(a, filterAppId) && matchesStatus(a, filterStatus) && matchesOrg(a, v)
    ).length;

    useEffect(() => {
        axios
            .get("/api/status")
            .then(res => setStatus(res.data))
            .catch(err => {
                console.error("Error getting statuses: ", err)
                setError("Feil ved henting av statuser");
            });

        axios
            .get("/api/organisations")
            .then(res => setOrganisation(res.data))
            .catch(err => {
                console.error("Error getting organisations: ", err)
                setError("Feil ved henting av organisasjoner");
            });

        axios
            .get("/api/applications")
            .then(res => setApplication(res.data.reverse()))
            .catch(err => {
                console.error("Error getting applications: ", err)
                setError("Feil ved henting av søknader");
            });
    }, []);

    const numberApplicationsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const { pages, nextButtonProps, prevButtonProps } = usePagination({
        totalPages: Math.ceil(filteredApplications.length/numberApplicationsPerPage),
        currentPage,
        setCurrentPage: setCurrentPage,
        showPages: 11,
    });


    return (
        <>
            <h1>
                <img src={novariLogo} alt="Novarilogo" style={{width: "8em", verticalAlign: "middle", marginLeft: "-2.5em"}}/>Drosje Dashboard
            </h1>

            {error && <Alert data-color='warning'>
                <Heading
                    level={2}
                    data-size='xs'
                    style={{
                        marginBottom: 'var(--ds-size-2)',
                    }}
                >
                    Trafikkmelding
                </Heading>
                <Paragraph>
                    Det har oppstått en uventet feil med din drosjebil: {error}
                </Paragraph>
            </Alert>}

            <div className="filter-panel">
                <h2>App</h2>
                <ToggleGroup
                    data-toggle-group="app"
                    value={filterAppId}
                    style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                    onChange={(e) => {
                        setFilterAppId(e)
                        setCurrentPage(1)
                    }}
                >
                    <ToggleGroup.Item value="ALL">
                        <span className={`filter-item${appCount("ALL") === 0 ? " filter-item-empty" : ""}`}>Alle<span className="filter-count">{appCount("ALL")}</span></span>
                    </ToggleGroup.Item>
                    {uniqueAppIds.map(appId => (
                        <ToggleGroup.Item value={appId} key={appId}>
                            <span className={`filter-item${appCount(appId) === 0 ? " filter-item-empty" : ""}`}>{appId}<span className="filter-count">{appCount(appId)}</span></span>
                        </ToggleGroup.Item>
                    ))}
                </ToggleGroup>

                <h2>Statuser</h2>
                <ToggleGroup
                    data-toggle-group="status"
                    value={filterStatus}
                    style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                    onChange={(e) => {
                        setFilterStatus(e)
                        setCurrentPage(1)
                    }}
                >
                    <ToggleGroup.Item value="ALL">
                        <span className={`filter-item${statusCount("ALL") === 0 ? " filter-item-empty" : ""}`}>Alle<span className="filter-count">{statusCount("ALL")}</span></span>
                    </ToggleGroup.Item>
                    {status.map(value => (
                        <ToggleGroup.Item value={value} key={value}>
                            <span className={`filter-item${statusCount(value) === 0 ? " filter-item-empty" : ""}`}>{value}<span className="filter-count">{statusCount(value)}</span></span>
                        </ToggleGroup.Item>
                    ))}
                </ToggleGroup>

                <h2>Organisasjoner</h2>
                <ToggleGroup
                    data-toggle-group="org"
                    value={filterOrganisation}
                    style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                    onChange={(e) => {
                        setFilterOrganisation(e)
                        setCurrentPage(1)
                    }}
                >
                    <ToggleGroup.Item value="ALL">
                        <span className={`filter-item${orgCount("ALL") === 0 ? " filter-item-empty" : ""}`}>Alle<span className="filter-count">{orgCount("ALL")}</span></span>
                    </ToggleGroup.Item>
                    {Object.entries(organisation).map(([, value]) => (
                        <ToggleGroup.Item value={value.toString()} key={value}>
                            <span className={`filter-item${orgCount(value.toString()) === 0 ? " filter-item-empty" : ""}`}>{value}<span className="filter-count">{orgCount(value.toString())}</span></span>
                        </ToggleGroup.Item>
                    ))}
                </ToggleGroup>
            </div>

            <h2>Søk</h2>
            <Search style={{marginBottom: "var(--ds-size-4)"}}>
                <Search.Input
                    id="search"
                    aria-label="Søk"
                    placeholder="Søk på altinnreferanse, søker eller saksnummer"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                />
                <Search.Clear style={{backgroundColor: "#F76650"}} />
            </Search>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "var(--ds-size-6)"}}>
                <h2 style={{margin: 0}}>Søknader</h2>
                <Paragraph data-size="sm">{filteredApplications.length} treff</Paragraph>
            </div>
            <Table zebra>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Fylke</Table.HeaderCell>
                        <Table.HeaderCell>App</Table.HeaderCell>
                        <Table.HeaderCell>Altinnreferanse</Table.HeaderCell>
                        <Table.HeaderCell>Søker</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Saksnummer</Table.HeaderCell>
                        <Table.HeaderCell>Opprettet</Table.HeaderCell>
                        <Table.HeaderCell>Oppdatert</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {filteredApplications.slice((currentPage * numberApplicationsPerPage) - numberApplicationsPerPage,
                        currentPage * numberApplicationsPerPage).map(value => (
                        <Table.Row key={value.archiveReference}>
                            <Table.Cell>{value.requestorName}</Table.Cell>
                            <Table.Cell>{value.appId || "legacy/drosjeloyve"}</Table.Cell>
                            <Table.Cell>{value.archiveReference}</Table.Cell>
                            <Table.Cell>{value.subjectName}</Table.Cell>
                            <Table.Cell>
                                <Tag variant="outline" data-color="success">{value.status}</Tag>
                            </Table.Cell>
                            <Table.Cell>{value.caseId}</Table.Cell>
                            <Table.Cell>{formatDate(value.archivedDate)}</Table.Cell>
                            <Table.Cell>{formatDate(value.updatedDate)}</Table.Cell>
                        </Table.Row>
                    ))
                    }
                </Table.Body>
            </Table>

            {pages.length > 1 && (
            <div style={{display: "flex", justifyContent: "right", alignItems: "right", marginTop: "1rem", marginBottom: "1rem"}}>
                <Pagination aria-label='Sidenavigering'>
                    <Pagination.List>
                        <Pagination.Item>
                            <Pagination.Button aria-label='Forrige side' {...prevButtonProps} >
                                Forrige
                            </Pagination.Button>
                        </Pagination.Item>
                        {pages.map(({ page, itemKey, buttonProps }) => (
                            <Pagination.Item key={itemKey}>
                                {typeof page === 'number' && (
                                    <Pagination.Button aria-label={`Side ${page}`} {...buttonProps}>
                                        {page}
                                    </Pagination.Button>
                                )}
                            </Pagination.Item>
                        ))}
                        <Pagination.Item>
                            <Pagination.Button aria-label='Neste side' {...nextButtonProps}>
                                Neste
                            </Pagination.Button>
                        </Pagination.Item>
                    </Pagination.List>
                </Pagination>
            </div>
        )}
            <Divider />
            <Paragraph>
                Antall søknader: {filteredApplications.length}
            </Paragraph>
        </>
    )
}

export default App
