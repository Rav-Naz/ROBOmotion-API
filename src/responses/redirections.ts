import express from 'express';

export class Redirection {

    static multipleChoices(res: express.Response, body?: object | string) {
        res.status(300).send({
            message: "INFO: Multiple Choices",
            body: body !== undefined ? body : null
        })
    }

    static movedPermanently(res: express.Response, body?: object | string) {
        res.status(301).send({
            message: "INFO: Moved Permanently",
            body: body !== undefined ? body : null
        })
    }

    static found(res: express.Response, body?: object | string) {
        res.status(302).send({
            message: "INFO: Found",
            body: body !== undefined ? body : null
        })
    }

    static seeOther(res: express.Response, body?: object | string) {
        res.status(303).send({
            message: "INFO: See Other",
            body: body !== undefined ? body : null
        })
    }

    static notModified(res: express.Response, body?: object | string) {
        res.status(304).send({
            message: "INFO: Not Modified",
            body: body !== undefined ? body : null
        })
    }

    static useProxy(res: express.Response, body?: object | string) {
        res.status(305).send({
            message: "INFO: Use Proxy",
            body: body !== undefined ? body : null
        })
    }

    static temporaryRedirect(res: express.Response, body?: object | string) {
        res.status(307).send({
            message: "INFO: Temporary Redirect",
            body: body !== undefined ? body : null
        })
    }

    static permanentRedirect(res: express.Response, body?: object | string) {
        res.status(308).send({
            message: "INFO: Temporary Redirect",
            body: body !== undefined ? body : null
        })
    }
    
}