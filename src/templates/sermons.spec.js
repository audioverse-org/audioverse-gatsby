import React from "react";
import {describe, expect, it, jest} from "@jest/globals";
import path from "path"

jest.mock(`path`)

const factory = require('./sermons.factory.js')

const testCreatePages = async ({returnValue, returnValues} = {}) => {
    const graphql = jest.fn(() => {
        const val = returnValues ? returnValues.pop() : returnValue
        return Promise.resolve(val)
    })

    const createPage = jest.fn(() => Promise.resolve());

    await factory.createPages(graphql, createPage)

    return {graphql, createPage}
}

const expectOneCallToMatch = (mock, callable) => {
    const matches = mock.mock.calls.filter(callable)

    expect(matches).toHaveLength(1)
}

describe("sermons factory", () => {
    it("has factory method", () => {
        expect(factory.createPages).toBeDefined()
    })

    it("queries sermons type", async () => {
        const {graphql} = await testCreatePages()

        expect(graphql.mock.calls[0][0])
            .toContain('sermons')
    })

    it("creates English page", async () => {
        const {createPage} = await testCreatePages()

        expect(createPage.mock.calls[0][0].path)
            .toContain('en/sermons')
    })

    it("creates Spanish page", async () => {
        const {createPage} = await testCreatePages()

        expect(createPage.mock.calls[1][0].path)
            .toContain('es/sermons')
    })

    it("gets Spanish sermons", async () => {
        const {graphql} = await testCreatePages()

        expect(graphql.mock.calls[1][0])
            .toContain('SPANISH')
    })

    it("passes sermons to createPage", async () => {
        const sermons = ["sermons"],
            returnValue = {data:{avorg:{sermons:{nodes:sermons}}}}

        const {createPage} = await testCreatePages({returnValue})

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

    it("creates first English page", async () => {
        const {createPage} = await testCreatePages({})

        expect(createPage.mock.calls[0][0].path)
            .toContain('en/sermons/page/1')
    })

    it("creates second English page", async () => {
        const {createPage} = await testCreatePages({
            returnValues: [
                {data:{avorg:{sermons:{pageInfo:{hasNextPage:true}}}}}
            ]
        })

        expectOneCallToMatch(createPage, call => {
            return call[0].path.includes('en/sermons/page/2')
        })
    })

    it("uses cursors", async () => {
        const {graphql} = await testCreatePages({
            returnValues: [
                {data:{avorg:{sermons:{pageInfo:{
                    hasNextPage:true, endCursor:'the_cursor'
                }}}}}
            ]
        })

        expectOneCallToMatch(graphql, call => {
            return call[0].includes('after:"the_cursor"')
        })
    })
})