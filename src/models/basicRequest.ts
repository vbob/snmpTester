interface BasicRequest {
    address: string,
    port?: string,
    community: string
}

interface SNMPGetRequest extends BasicRequest {
    oid: string
}

interface SNMPBulkWalkRequest extends BasicRequest {
    oid?: string
}

export { BasicRequest, SNMPBulkWalkRequest, SNMPGetRequest }
