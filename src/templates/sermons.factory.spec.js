import React from "react";
import path from "path"
import _ from "lodash"
import constants from "../constants"

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

const runWithMockedConstants = async (modifications, closure) => {
    const backup = {...constants}

    _.assign(constants, modifications)

    await closure()

    _.assign(constants, backup)
}

const expectAnyCallToMatch = (mock, callable) => {
    const matches = mock.mock.calls.filter(callable)

    expect(matches.length).toBeGreaterThan(0)
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

        expect(graphql.mock.calls[1][1])
            .toStrictEqual({
                language: 'SPANISH',
                cursor: null
            })
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

        expectAnyCallToMatch(createPage, call => {
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

        expectAnyCallToMatch(graphql, call => {
            return call[1].cursor === "the_cursor"
        })
    })

    it("provides number of pages", async () => {
        const {createPage} = await testCreatePages({
            returnValues: [
                {data:{avorg:{sermons:{aggregate:{count:50}}}}}
            ]
        })

        expectAnyCallToMatch(createPage, call => {
            return call[0].context.pagination.total === 5
        })
    })

    it("rounds number of pages up", async () => {
        const {createPage} = await testCreatePages({
            returnValues: [
                {data:{avorg:{sermons:{aggregate:{count:55}}}}}
            ]
        })

        expectAnyCallToMatch(createPage, call => {
            return call[0].context.pagination.total === 6
        })
    })

    it("includes current page number", async () => {
        const {createPage} = await testCreatePages()

        expectAnyCallToMatch(createPage, call => {
            return call[0].context.pagination.current === 1
        })
    })

    it("respects dev query limits", async () => {
        await runWithMockedConstants({
            languages: {'ENGLISH': { base_url: 'en' },},
            query_page_limit: 10
        }, async () => {
            const returnValue = {}

            _.set(returnValue, 'data.avorg.sermons.pageInfo.hasNextPage', true)
            _.set(returnValue, 'data.avorg.sermons.pageInfo.endCursor', 'the_cursor')

            const returnValues = new Array(11).fill(returnValue);

            const {graphql} = await testCreatePages({returnValues})

            expect(graphql).toBeCalledTimes(10)
        })
    })
})
