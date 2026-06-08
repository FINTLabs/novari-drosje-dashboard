import novariLogo from '/novari.svg'
import './App.css'
import axios from "axios"
import {useState, useEffect} from "react";
import type { Application, Organisation } from "./types";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { FiltersPanel } from "./components/FiltersPanel";
import {
    Alert,
    Divider,
    Heading,
    Pagination,
    Paragraph,
    Search,
    usePagination
} from "@digdir/designsystemet-react";

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

    const paginatedApplications = filteredApplications.slice(
        (currentPage * numberApplicationsPerPage) - numberApplicationsPerPage,
        currentPage * numberApplicationsPerPage
    );


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

            <FiltersPanel
                filterAppId={filterAppId}
                filterStatus={filterStatus}
                filterOrganisation={filterOrganisation}
                uniqueAppIds={uniqueAppIds}
                statuses={status}
                organisation={organisation}
                appCount={appCount}
                statusCount={statusCount}
                orgCount={orgCount}
                onAppChange={(e) => {
                    setFilterAppId(e)
                    setCurrentPage(1)
                }}
                onStatusChange={(e) => {
                    setFilterStatus(e)
                    setCurrentPage(1)
                }}
                onOrganisationChange={(e) => {
                    setFilterOrganisation(e)
                    setCurrentPage(1)
                }}
            />

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
            <ApplicationsTable applications={paginatedApplications} />

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
