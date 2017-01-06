/**
 * Created by Thomas on 03/01/2017.
 * Class to create Response with (code, message)
 */
"use strict";


class Response {

    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

module.exports = Response;