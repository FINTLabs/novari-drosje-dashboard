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
    Table,
    ToggleGroup,
    usePagination
} from "@digdir/designsystemet-react";
import {Tag} from "@digdir/designsystemet-react";
import {Search} from "@digdir/designsystemet-react";

type Application = {
    archiveReference: string
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

    const filteredApplications = application
        .filter(application =>
            application.subjectName.toLowerCase().includes(filter.toLowerCase()) ||
            application.archiveReference.toLowerCase().startsWith(filter.toLowerCase()) ||
            application.caseId?.toLowerCase().startsWith(filter.toLowerCase())
        )
        .filter(application =>
            filterStatus != "ALL" ? application.status === filterStatus : true
        )
        .filter(application =>
            filterOrganisation != "ALL" ? application.requestorName === filterOrganisation : true
        );

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

            <h2>Statuser</h2>
            <ToggleGroup data-toggle-group="status"  style={{display: "flex", flexWrap: "wrap", height: "auto"}} onChange={(e) => {
                setFilterStatus(e)
                setCurrentPage(1)
            }}>
                <ToggleGroup.Item
                    value={"ALL"} key={"all"}>
                    ALL
                </ToggleGroup.Item>
                {status.map(value => (
                    <ToggleGroup.Item key={value}
                        value={value}>
                        {value}
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>


            <h2>Organisasjoner</h2>
            <ToggleGroup data-toggle-group="org" style={{display: "flex", flexWrap: "wrap", height: "auto"}} onChange={(e) => {
                setFilterOrganisation(e)
                setCurrentPage(1)
            }}>
                <ToggleGroup.Item
                    value={"ALL"} key={"all"}>
                    Alle
                </ToggleGroup.Item>
                {Object.entries(organisation).map(([, value]) => (
                    <ToggleGroup.Item value={value.toString()} key={value}>{value}</ToggleGroup.Item>
                ))}
            </ToggleGroup>


            <h2>Søk</h2>
            <Search>
                <Search.Input id="search" aria-label='Søk' placeholder="Søk på altinnreferanse, søker eller saksnummer" onChange={(e) => {
                    setFilter(e.target.value)
                }} />
                <Search.Clear  style={{backgroundColor: "#F76650"}} />
            </Search>

            <h2>Søknader</h2>
            <Table zebra>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Fylke</Table.HeaderCell>
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
                            <Table.Cell>{value.archiveReference}</Table.Cell>
                            <Table.Cell>{value.subjectName}</Table.Cell>
                            <Table.Cell>
                                <Tag variant="outline" data-color="success">{value.status}</Tag>
                            </Table.Cell>
                            <Table.Cell>{value.caseId}</Table.Cell>
                            <Table.Cell>{value.archivedDate.toString()}</Table.Cell>
                            <Table.Cell>{value.updatedDate.toString()}</Table.Cell>
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
