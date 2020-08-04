import React from "react";
import {describe, expect, it, jest} from "@jest/globals";

const factory = require('./sermon.factory.js')

const testCreatePages = async (returnValue) => {
    const graphql = jest.fn(() => Promise.resolve(returnValue)),
        createPage = jest.fn();

    await factory.createSermons(graphql, createPage)

    return {graphql, createPage}
}

describe("sermon factory", () => {
    it("gets English sermons", async () => {
        const {graphql} = await testCreatePages({
            data: {
                avorg: {
                    sermons: {
                        nodes: [],
                        pageInfo: {
                            hasNextPage: false
                        }
                    }
                }
            }
        })

        expect(graphql.mock.calls[0][0]).toContain('ENGLISH')
    })

    it("creates English page", async () => {
        const {createPage} = await testCreatePages({
            data: {
                avorg: {
                    sermons: {
                        nodes: [{}],
                        pageInfo: {
                            hasNextPage: false
                        }
                    }
                }
            }
        })

        expect(createPage.mock.calls[0][0].path).toContain('en/sermons/')
    })
})