import express from 'express';

export class ServerError {

    static internalServerError(res: express.Response, body?: object | string) {
        res.status(500).send({
            message: "ERROR: Internal Server Error",
            body: body !== undefined ? body : null
        })
    }

    static notImplemented(res: express.Response, body?: object | string) {
        res.status(501).send({
            message: "ERROR: Not Implemented",
            body: body !== undefined ? body : null
        })
    }

    static badGateway(res: express.Response, body?: object | string) {
        res.status(502).send({
            message: "ERROR: Bad Gateway",
            body: body !== undefined ? body : null
        })
    }

    static serviceUnavailable(res: express.Response, body?: object | string) {
        res.status(503).send({
            message: "ERROR: Service Unavailable",
            body: body !== undefined ? body : null
        })
    }

    static gatewayTimeout(res: express.Response, body?: object | string) {
        res.status(504).send({
            message: "ERROR: Gateway Timeout",
            body: body !== undefined ? body : null
        })
    }

    static HTTPVersionNotSupported(res: express.Response, body?: object | string) {
        res.status(505).send({
            message: "ERROR: HTTP Version Not Supported",
            body: body !== undefined ? body : null
        })
    }

    static variantAlsoNegotiates(res: express.Response, body?: object | string) {
        res.status(506).send({
            message: "ERROR: Variant Also Negotiates",
            body: body !== undefined ? body : null
        })
    }

    static insufficientStorage(res: express.Response, body?: object | string) {
        res.status(507).send({
            message: "ERROR: Insufficient Storage",
            body: body !== undefined ? body : null
        })
    }
    
    static loopDetected(res: express.Response, body?: object | string) {
        res.status(508).send({
            message: "ERROR: Loop Detected",
            body: body !== undefined ? body : null
        })
    }

    static notExtended(res: express.Response, body?: object | string) {
        res.status(510).send({
            message: "ERROR: Not Extended",
            body: body !== undefined ? body : null
        })
    }

    static networkAuthenticationRequired(res: express.Response, body?: object | string) {
        res.status(511).send({
            message: "ERROR: Network Authentication Required",
            body: body !== undefined ? body : null
        })
    }

    static networkConnectTimeoutError(res: express.Response, body?: object | string) {
        res.status(599).send({
            message: "ERROR: Network Connect Timeout Error",
            body: body !== undefined ? body : null
        })
    }
    
}