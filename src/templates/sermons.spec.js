import {describe, expect, it, jest} from "@jest/globals";
import {render} from "@testing-library/react"
import React from "react";
import SermonsList from "./sermons.list";
import Layout from "../components/layout"

jest.mock("../components/layout")

Layout.mockImplementation(({children}) => <>{children}</>)

describe("sermons component", () => {
    it("hides next when unneeded", () => {
        const {getByText} = render(<SermonsList pageContext={{
            nodes: [],
            pagination: {
                current: 1,
                total: 1
            }
        }} />)

        expect(() => getByText('>')).toThrow()
    })

    it("uses pagination total", () => {
        const {getByText} = render(<SermonsList pageContext={{
            nodes: [],
            pagination: {
                current: 1,
                total: 42
            }
        }} data={{
            avorg: {
                sermons: {
                    nodes: []
                }
            }
        }} />)

        expect(getByText('42')).toBeDefined()
    })

    it("highlights active page", () => {
        const {getByText} = render(<SermonsList pageContext={{
            nodes: [],
            pagination: {
                current: 3,
                total: 5
            }
        }} data={{
            avorg: {
                sermons: {
                    nodes: []
                }
            }
        }} />)

        const listItem = getByText('3').closest('li')

        expect(listItem.className).toBe('active')
    })

    it("links to pages", () => {
        const {getByText} = render(<SermonsList pageContext={{
            nodes: [],
            pagination: {
                current: 3,
                total: 5
            }
        }} data={{
            avorg: {
                sermons: {
                    nodes: []
                }
            }
        }} />)

        expect(getByText('3').href).toContain('/en/sermons/page/3')
    })
})
