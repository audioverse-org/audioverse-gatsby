import {describe, expect, it, jest} from "@jest/globals";
import {createPages} from './gatsby-node'
import path from "path";
import filesystem from './src/helpers/filesystem'

jest.mock(`path`)
jest.mock(`./src/helpers/filesystem`)

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

    it("gets dev config", async () => {
        const graphql = jest.fn(() => Promise.resolve()),
            createPage = jest.fn(() => Promise.resolve()),
            args = {graphql, actions: {createPage}};

        await createPages(args)

        expect(filesystem.getFile).toBeCalledWith('dev.yaml')
    })
})