import express from 'express';

export class Success {

    static OK(res: express.Response, body?: object | string) {
        res.status(200).send({
            message: "INFO: OK",
            body: body !== undefined ? body : null
        })
    }

    static created(res: express.Response, body?: object | string) {
        res.status(201).send({
            message: "INFO: Created",
            body: body !== undefined ? body : null
        })
    }

    static accepted(res: express.Response, body?: object | string) {
        res.status(202).send({
            message: "INFO: Accepted",
            body: body !== undefined ? body : null
        })
    }

    static nonAuthoritativeInformation(res: express.Response, body?: object | string) {
        res.status(203).send({
            message: "INFO: Non-authoritative Information",
            body: body !== undefined ? body : null
        })
    }

    static noContent(res: express.Response, body?: object | string) {
        res.status(204).send({
            message: "INFO: No Content",
            body: body !== undefined ? body : null
        })
    }

    static resetContent(res: express.Response, body?: object | string) {
        res.status(205).send({
            message: "INFO: Reset Content",
            body: body !== undefined ? body : null
        })
    }

    static partialContent(res: express.Response, body?: object | string) {
        res.status(206).send({
            message: "INFO: Partial Content",
            body: body !== undefined ? body : null
        })
    }

    static multiStatus(res: express.Response, body?: object | string) {
        res.status(207).send({
            message: "INFO: Multi-Status",
            body: body !== undefined ? body : null
        })
    }

    static alreadyReported(res: express.Response, body?: object | string) {
        res.status(208).send({
            message: "INFO: Already Reported",
            body: body !== undefined ? body : null
        })
    }

    static ImUsed(res: express.Response, body?: object | string) {
        res.status(226).send({
            message: "INFO: IM Used",
            body: body !== undefined ? body : null
        })
    }
    
}