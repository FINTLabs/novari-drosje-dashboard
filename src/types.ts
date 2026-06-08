export type Application = {
    archiveReference: string
    appId: string
    requestorName: string
    subjectName: string
    status: string
    caseId: string
    archivedDate: Date
    updatedDate: Date
}

export type Organisation = Record<string, string>
