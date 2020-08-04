import React from "react";
import {describe, expect, it, jest} from "@jest/globals";

const factory = require('./sermons.factory.js')

describe("sermons", () => {
    it("has factory method", () => {
        expect(factory.createPages).toBeDefined()
    })

    it("queries sermons type", () => {
        const graphql = jest.fn()

        factory.createPages(graphql)

        expect(graphql.mock.calls[0][0]).toContain('sermons')
    })
})