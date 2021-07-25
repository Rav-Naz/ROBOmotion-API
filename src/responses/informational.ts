import express from 'express';

export class Informational {

    static continue(res: express.Response, body?: object | string) {
        res.status(100).send({
            message: "INFO: Continue",
            body: body !== undefined ? body : null
        })
    }

    static switchingProtocols(res: express.Response, body?: object | string) {
        res.status(101).send({
            message: "INFO: Switching Protocols",
            body: body !== undefined ? body : null
        })
    }

    static processing(res: express.Response, body?: object | string) {
        res.status(102).send({
            message: "INFO: Processing",
            body: body !== undefined ? body : null
        })
    }
    
}