import express from 'express';

export class ClientError {

    static badRequest(res: express.Response, body?: object | string) {
        res.status(400).send({
            message: "ERROR: Bad Request",
            body: body !== undefined ? body : null
        })
    }

    static unauthorized(res: express.Response, body?: object | string) {
        res.status(401).send({
            message: "ERROR: Unauthorized",
            body: body !== undefined ? body : null
        })
    }

    static paymentRequired(res: express.Response, body?: object | string) {
        res.status(402).send({
            message: "ERROR: Payment Required",
            body: body !== undefined ? body : null
        })
    }

    static forbidden(res: express.Response, body?: object | string) {
        res.status(403).send({
            message: "ERROR: Forbidden",
            body: body !== undefined ? body : null
        })
    }

    static notFound(res: express.Response, body?: object | string) {
        res.status(404).send({
            message: "ERROR: Not Found",
            body: body !== undefined ? body : null
        })
    }

    static methodNotAllowed(res: express.Response, body?: object | string) {
        res.status(405).send({
            message: "ERROR: Method Not Allowed",
            body: body !== undefined ? body : null
        })
    }
    
    static notAcceptable(res: express.Response, body?: object | string) {
        res.status(406).send({
            message: "ERROR: Not Acceptable",
            body: body !== undefined ? body : null
        })
    }

    static proxyAuthenticationRequired(res: express.Response, body?: object | string) {
        res.status(407).send({
            message: "ERROR: Proxy Authentication Required",
            body: body !== undefined ? body : null
        })
    }

    static requestTimeout(res: express.Response, body?: object | string) {
        res.status(408).send({
            message: "ERROR: Request Timeout",
            body: body !== undefined ? body : null
        })
    }

    static conflict(res: express.Response, body?: object | string) {
        res.status(409).send({
            message: "ERROR: Conflict",
            body: body !== undefined ? body : null
        })
    }

    static gone(res: express.Response, body?: object | string) {
        res.status(410).send({
            message: "ERROR: Gone",
            body: body !== undefined ? body : null
        })
    }
    
    static lengthRequired(res: express.Response, body?: object | string) {
        res.status(411).send({
            message: "ERROR: Length Required",
            body: body !== undefined ? body : null
        })
    }

    static preconditionFailed(res: express.Response, body?: object | string) {
        res.status(412).send({
            message: "ERROR: Precondition Failed",
            body: body !== undefined ? body : null
        })
    }

    static payloadTooLarge(res: express.Response, body?: object | string) {
        res.status(413).send({
            message: "ERROR: Precondition Failed",
            body: body !== undefined ? body : null
        })
    }

    static requestURITooLong(res: express.Response, body?: object | string) {
        res.status(414).send({
            message: "ERROR: Request-URI Too Long",
            body: body !== undefined ? body : null
        })
    }

    static unsupportedMediaType(res: express.Response, body?: object | string) {
        res.status(415).send({
            message: "ERROR: Unsupported Media Type",
            body: body !== undefined ? body : null
        })
    }

    static requestedRangeNotSatisfiable(res: express.Response, body?: object | string) {
        res.status(416).send({
            message: "ERROR: Requested Range Not Satisfiable",
            body: body !== undefined ? body : null
        })
    }

    static expectationFailed(res: express.Response, body?: object | string) {
        res.status(417).send({
            message: "ERROR: Expectation Failed",
            body: body !== undefined ? body : null
        })
    }
    
    static ImTeapot(res: express.Response, body?: object | string) {
        res.status(418).send({
            message: "ERROR: I'm a teapot",
            body: body !== undefined ? body : null
        })
    }

    static misdirectedRequest(res: express.Response, body?: object | string) {
        res.status(421).send({
            message: "ERROR: Misdirected Request",
            body: body !== undefined ? body : null
        })
    }

    static unprocessableEntity(res: express.Response, body?: object | string) {
        res.status(422).send({
            message: "ERROR: Unprocessable Entity",
            body: body !== undefined ? body : null
        })
    }

    static locked(res: express.Response, body?: object | string) {
        res.status(423).send({
            message: "ERROR: Locked",
            body: body !== undefined ? body : null
        })
    }

    static failedDependency(res: express.Response, body?: object | string) {
        res.status(424).send({
            message: "ERROR: Failed Dependency",
            body: body !== undefined ? body : null
        })
    }

    static upgradeRequired(res: express.Response, body?: object | string) {
        res.status(426).send({
            message: "ERROR: Upgrade Required",
            body: body !== undefined ? body : null
        })
    }

    static preconditionRequired(res: express.Response, body?: object | string) {
        res.status(428).send({
            message: "ERROR: Precondition Required",
            body: body !== undefined ? body : null
        })
    }

    static tooManyRequests(res: express.Response, body?: object | string) {
        res.status(429).send({
            message: "ERROR: Too Many Requests",
            body: body !== undefined ? body : null
        })
    }

    static requestHeaderFieldsTooLarge(res: express.Response, body?: object | string) {
        res.status(431).send({
            message: "ERROR: Request Header Fields Too Large",
            body: body !== undefined ? body : null
        })
    }

    static connectionClosedWithoutResponse(res: express.Response, body?: object | string) {
        res.status(444).send({
            message: "ERROR: Connection Closed Without Response",
            body: body !== undefined ? body : null
        })
    }

    static unavailableForLegalReasons(res: express.Response, body?: object | string) {
        res.status(451).send({
            message: "ERROR: Unavailable For Legal Reasons",
            body: body !== undefined ? body : null
        })
    }

    static clientClosedRequest(res: express.Response, body?: object | string) {
        res.status(499).send({
            message: "ERROR: Client Closed Request",
            body: body !== undefined ? body : null
        })
    }
    
}