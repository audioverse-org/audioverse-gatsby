import React from "react";
import {describe, expect, it, jest} from "@jest/globals";
import path from "path"
import constants from "../constants";
import _ from "lodash";

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

const testCreateSermons = async (nodes = []) => {
    const returnValue = {
        data: {
            avorg: {
                sermons: {
                    nodes,
                    pageInfo: {
                        hasNextPage: false
                    }
                }
            }
        }
    };

    return testCreatePages({returnValue})
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

describe("sermon detail pages creation", () => {
    it("gets English sermons", async () => {
        const {graphql} = await testCreateSermons()

        expect(graphql.mock.calls[0][1]).toStrictEqual({
            language: 'ENGLISH',
            first: 250
        })
    })

    it("creates English page", async () => {
        const {createPage} = await testCreateSermons([{}])

        expect(createPage.mock.calls[0][0].path).toContain('en/sermons/')
    })

    it("uses sermon id in url", async () => {
        const {createPage} = await testCreateSermons([{id: 3}])

        const allPaths = createPage.mock.calls.map(c => _.get(c[0], 'path'))

        expect(allPaths).toContain('en/sermons/3')
    })

    it("defines query variables", async () => {
        const {graphql} = await testCreateSermons()

        const allQueries = graphql.mock.calls.map(c => c[0])

        expect(allQueries).toEqual(
            expect.arrayContaining([
                expect.stringContaining(
                    "language: $language"
                )
            ])
        )
    })

    it("passes node to page", async () => {
        const {createPage} = await testCreateSermons([{'the': 'node'}])

        const candidates = createPage.mock.calls.map(c => _.get(c[0], 'context.node.the'))

        expect(candidates).toContain('node')
    })

    it("gets component", async () => {
        await testCreateSermons()

        expect(path.resolve).toBeCalledWith(`./src/templates/sermons.detail.js`)
    })
})

describe("sermon list pages creation", () => {
    it("has factory method", () => {
        expect(factory.createPages).toBeDefined()
    })

    it("queries sermons type", async () => {
        const {graphql} = await testCreatePages()

        const all_queries = graphql.mock.calls.map(call => call[0])

        expect(all_queries).toEqual(
            expect.arrayContaining([
                expect.stringContaining('sermons')
            ])
        )
    })

    it("creates English page", async () => {
        const {createPage} = await testCreateSermons([{}])

        expect(createPage.mock.calls[0][0].path)
            .toContain('en/sermons')
    })

    it("creates Spanish page", async () => {
        const {createPage} = await testCreateSermons([{}])

        const allPaths = createPage.mock.calls.map(c => _.get(c[0], 'path'))

        expect(allPaths).toEqual(
            expect.arrayContaining([
                expect.stringContaining('es/sermons')
            ])
        )
    })

    it("gets Spanish sermons", async () => {
        const {graphql} = await testCreatePages()

        expect(graphql.mock.calls[1][1])
            .toStrictEqual({
                language: 'SPANISH',
                first: 250
            })
    })

    it("awaits page create", async () => {
        let done = false;

        const returnValue = _.set({}, 'data.avorg.sermons.nodes', [{}])

        const graphql = jest.fn(() => Promise.resolve(returnValue)),
            createPage = jest.fn(async () => {
                await new Promise(r => setTimeout(r, 2));
                done = true;
            });

        await factory.createPages(graphql, createPage)

        expect(done).toBeTruthy()
    })

    it("gets component", async () => {
        await testCreateSermons([{},{}])

        expect(path.resolve).toBeCalledWith(`./src/templates/sermons.list.js`)
    })

    it("creates first English page", async () => {
        const {createPage} = await testCreateSermons([{}])

        const all_paths = createPage.mock.calls.map(c => c[0].path)

        expect(all_paths).toEqual(
            expect.arrayContaining([
                expect.stringContaining('en/sermons/page/1')
            ])
        )
    })

    it("creates second English page", async () => {
        const {createPage} = await testCreateSermons((new Array(20)).fill({}))

        const allPaths = createPage.mock.calls.map(c => _.get(c[0], 'path'))

        expect(allPaths).toEqual(
            expect.arrayContaining([
                expect.stringContaining(
                    'en/sermons/page/2'
                )
            ])
        )
    })

    it("uses cursors", async () => {
        const {graphql} = await testCreatePages({
            returnValues: [
                {
                    data: {
                        avorg: {
                            sermons: {
                                pageInfo: {
                                    hasNextPage: true, endCursor: 'the_cursor'
                                }
                            }
                        }
                    }
                }
            ]
        })

        const allCursors = graphql.mock.calls.map(c => _.get(c[1], 'cursor'))

        expect(typeof allCursors[0] === 'string' || allCursors[0] instanceof String)
    })

    it("provides number of pages", async () => {
        const {createPage} = await testCreateSermons((new Array(10 * 5)).fill({}))

        const all_totals = createPage.mock.calls.map(c => _.get(c[0], 'context.pagination.total'))

        expect(all_totals).toContain(5)
    })

    it("rounds number of pages up", async () => {
        const {createPage} = await testCreateSermons((new Array(10 * 5.5)).fill({}))

        const all_totals = createPage.mock.calls.map(c => _.get(c[0], 'context.pagination.total'))

        expect(all_totals).toContain(6)
    })

    it("includes current page number", async () => {
        const {createPage} = await testCreateSermons([{}])

        const all_current = createPage.mock.calls.map(c => _.get(c[0], 'context.pagination.current'))

        expect(all_current).toContain(1)
    })

    it("respects dev query limits", async () => {
        await runWithMockedConstants({
            languages: {'ENGLISH': {base_url: 'en'},},
            query_page_limit: 10
        }, async () => {
            const returnValue = {}

            _.set(returnValue, 'data.avorg.sermons.pageInfo.hasNextPage', true)
            _.set(returnValue, 'data.avorg.sermons.pageInfo.endCursor', 'the_cursor')
            _.set(returnValue, 'data.avorg.sermons.aggregate.count', 10000)

            const returnValues = new Array(11).fill(returnValue);

            const {graphql} = await testCreatePages({returnValues})

            expect(graphql).toBeCalledTimes(10)
        })
    })

    it("passes nodes to page", async () => {
        const {createPage} = await testCreatePages({
            returnValue: {data: {avorg: {sermons: {nodes: [{'the': 'node'}]}}}}
        })

        const all_nodes = createPage.mock.calls.map(call => _.get(call[0], 'context.nodes'))

        expect(all_nodes).toEqual(
            expect.arrayContaining([
                expect.arrayContaining([
                    expect.objectContaining({
                        the: 'node'
                    })
                ])
            ])
        )
    })

    it("passes lang to page", async () => {
        const {createPage} = await testCreateSermons([{}])

        const all_lang = createPage.mock.calls.map(c => _.get(c[0], 'context.lang'))

        expect(all_lang).toContain('en')
    })

    it("paginates by 10", async () => {
        const nodes = (new Array(250)).fill({})

        const {createPage} = await testCreateSermons(nodes)

        const allNodes = createPage.mock.calls.map(c => _.get(c[0], 'context.nodes'))

        expect(allNodes[0].length).toEqual(10)
    })
})
