import { ToggleGroup } from "@digdir/designsystemet-react";
import type { Organisation } from "../types";

type FiltersPanelProps = {
    filterAppId: string
    filterStatus: string
    filterOrganisation: string
    uniqueAppIds: string[]
    statuses: string[]
    organisation: Organisation
    appCount: (value: string) => number
    statusCount: (value: string) => number
    orgCount: (value: string) => number
    onAppChange: (value: string) => void
    onStatusChange: (value: string) => void
    onOrganisationChange: (value: string) => void
}

const renderFilterLabel = (label: string, count: number) => (
    <span className={`filter-item${count === 0 ? " filter-item-empty" : ""}`}>
        {label}
        <span className="filter-count">{count}</span>
    </span>
);

export function FiltersPanel({
    filterAppId,
    filterStatus,
    filterOrganisation,
    uniqueAppIds,
    statuses,
    organisation,
    appCount,
    statusCount,
    orgCount,
    onAppChange,
    onStatusChange,
    onOrganisationChange,
}: FiltersPanelProps) {
    return (
        <div className="filter-panel">
            <h2>App</h2>
            <ToggleGroup
                data-toggle-group="app"
                value={filterAppId}
                style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                onChange={onAppChange}
            >
                <ToggleGroup.Item value="ALL">
                    {renderFilterLabel("Alle", appCount("ALL"))}
                </ToggleGroup.Item>
                {uniqueAppIds.map((appId) => (
                    <ToggleGroup.Item value={appId} key={appId}>
                        {renderFilterLabel(appId, appCount(appId))}
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>

            <h2>Statuser</h2>
            <ToggleGroup
                data-toggle-group="status"
                value={filterStatus}
                style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                onChange={onStatusChange}
            >
                <ToggleGroup.Item value="ALL">
                    {renderFilterLabel("Alle", statusCount("ALL"))}
                </ToggleGroup.Item>
                {statuses.map((value) => (
                    <ToggleGroup.Item value={value} key={value}>
                        {renderFilterLabel(value, statusCount(value))}
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>

            <h2>Organisasjoner</h2>
            <ToggleGroup
                data-toggle-group="org"
                value={filterOrganisation}
                style={{display: "flex", flexWrap: "wrap", height: "auto"}}
                onChange={onOrganisationChange}
            >
                <ToggleGroup.Item value="ALL">
                    {renderFilterLabel("Alle", orgCount("ALL"))}
                </ToggleGroup.Item>
                {Object.entries(organisation).map(([, value]) => (
                    <ToggleGroup.Item value={value.toString()} key={value}>
                        {renderFilterLabel(value, orgCount(value.toString()))}
                    </ToggleGroup.Item>
                ))}
            </ToggleGroup>
        </div>
    )
}
