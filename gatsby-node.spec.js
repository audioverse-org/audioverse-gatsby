import {describe, expect, it, jest} from "@jest/globals";
import {createPages} from './gatsby-node'
import path from "path";

jest.mock(`path`)

describe("gatsby node", () => {
    it("builds sermon pages", async () => {
        const returnValue = {
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
        }

        const graphql = jest.fn(() => Promise.resolve(returnValue)),
            createPage = jest.fn(() => Promise.resolve()),
            args = {graphql, actions: {createPage}};

        await createPages(args)

        expect(path.resolve).toBeCalledWith(`./src/templates/sermons.js`)
    })
})