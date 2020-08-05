import React from "react";
import {describe, expect, it, jest} from "@jest/globals";

const factory = require('./sermons.factory.js')

const testCreatePages = async (returnValue) => {
    const graphql = jest.fn(() => Promise.resolve(returnValue)),
        createPage = jest.fn(() => Promise.resolve());

    await factory.createPages(graphql, createPage)

    return {graphql, createPage}
}

describe("sermons factory", () => {
    it("has factory method", () => {
        expect(factory.createPages).toBeDefined()
    })

    it("queries sermons type", async () => {
        const {graphql} = await testCreatePages({})

        expect(graphql.mock.calls[0][0]).toContain('sermons')
    })

    it("creates English page", async () => {
        const {createPage} = await testCreatePages({})

        expect(createPage.mock.calls[0][0].path).toContain('en/sermons')
    })

    it("creates Spanish page", async () => {
        const {createPage} = await testCreatePages({})

        expect(createPage.mock.calls[1][0].path).toContain('es/sermons')
    })
})