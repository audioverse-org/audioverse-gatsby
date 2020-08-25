import React from "react";
import {describe, expect, it, jest} from "@jest/globals";

const factory = require('./sermon.factory.js')

const testCreatePages = async (nodes = []) => {
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
        },
        graphql = jest.fn(() => Promise.resolve(returnValue)),
        createPage = jest.fn();

    await factory.createPages(graphql, createPage)

    return {graphql, createPage}
}

describe("sermon factory", () => {
    it("gets English sermons", async () => {
        const {graphql} = await testCreatePages()

        expect(graphql.mock.calls[0][1]).toStrictEqual({
            language: 'ENGLISH',
            cursor: null
        })
    })

    it("creates English page", async () => {
        const {createPage} = await testCreatePages([{}])

        expect(createPage.mock.calls[0][0].path).toContain('en/sermons/')
    })

    it("uses sermon id in url", async () => {
        const {createPage} = await testCreatePages([{id: 3}])

        expect(createPage.mock.calls[0][0].path).toContain('en/sermons/3')
    })

    it("defines query variables", async () => {
        const {graphql} = await testCreatePages()

        expect(graphql.mock.calls[0][0])
            .toContain("loadPagesQuery($language: AVORG_Language!, $cursor: String)")
    })

    it("passes node to page", async () => {
        const {createPage} = await testCreatePages([{'the':'node'}])

        expect(createPage.mock.calls[0][0].context.node)
            .toStrictEqual({'the':'node'})
    })
})
