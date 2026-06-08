import { Table, Tag } from "@digdir/designsystemet-react";
import type { Application } from "../types";
import { formatDate } from "../utils/date";
import { getFlytIntegrationUrl, getFlytInstanceUrl } from "../utils/flyt";

type ApplicationsTableProps = {
    applications: Application[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
    return (
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
                {applications.map((value) => (
                    <Table.Row key={value.archiveReference}>
                        <Table.Cell>
                            {getFlytIntegrationUrl(value.requestorName) ? (
                                <a
                                    href={getFlytIntegrationUrl(value.requestorName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`Åpne ${value.requestorName} i FINT Flyt`}
                                >
                                    {value.requestorName}
                                </a>
                            ) : (
                                value.requestorName
                            )}
                        </Table.Cell>
                        <Table.Cell>{value.appId || "legacy/drosjeloyve"}</Table.Cell>
                        <Table.Cell>
                            {getFlytInstanceUrl(value.requestorName, value.archiveReference) ? (
                                <a
                                    href={getFlytInstanceUrl(value.requestorName, value.archiveReference)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Åpne instans i FINT Flyt"
                                >
                                    {value.archiveReference}
                                </a>
                            ) : (
                                value.archiveReference
                            )}
                        </Table.Cell>
                        <Table.Cell>{value.subjectName}</Table.Cell>
                        <Table.Cell>
                            <Tag variant="outline" data-color="success">{value.status}</Tag>
                        </Table.Cell>
                        <Table.Cell>{value.caseId}</Table.Cell>
                        <Table.Cell>{formatDate(value.archivedDate)}</Table.Cell>
                        <Table.Cell>{formatDate(value.updatedDate)}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
