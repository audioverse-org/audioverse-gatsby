import React from "react"
import Layout from "../components/layout"
import './sermons.css'

export default function Sermons({ pageContext }) {
    const sermons = pageContext.nodes;

    return (
        <Layout>
            <ul>
                {sermons.map((n, i) => <li>{n.title}</li>)}
            </ul>
        </Layout>
    )
}