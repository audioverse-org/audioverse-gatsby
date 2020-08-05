import React from "react";
import {describe, expect, it, jest} from "@jest/globals";
import path from "path"

jest.mock(`path`)

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

        expect(graphql.mock.calls[0][0])
            .toContain('sermons')
    })

    it("creates English page", async () => {
        const {createPage} = await testCreatePages({})

        expect(createPage.mock.calls[0][0].path)
            .toContain('en/sermons')
    })

    it("creates Spanish page", async () => {
        const {createPage} = await testCreatePages({})

        expect(createPage.mock.calls[1][0].path)
            .toContain('es/sermons')
    })

    it("gets Spanish sermons", async () => {
        const {graphql} = await testCreatePages({})

        expect(graphql.mock.calls[1][0])
            .toContain('SPANISH')
    })

    it("passes sermons to createPage", async () => {
        const sermons = ["sermons"]

        const {createPage} = await testCreatePages({
            data: {
                sermons: {
                    nodes: sermons
                }
            }
        })

        expect(createPage.mock.calls[0][0].context.nodes)
            .toEqual(sermons)
    })

    it("awaits page create", async () => {
        let done = false;

        const graphql = jest.fn(() => Promise.resolve()),
            createPage = jest.fn(async () => {
                await new Promise(r => setTimeout(r, 2));
                done = true;
            });

        await factory.createPages(graphql, createPage)

        expect(done).toBeTruthy()
    })

    it("gets component", async () => {
        await testCreatePages()

        expect(path.resolve).toBeCalledWith(`./src/templates/sermons.js`)
    })
})