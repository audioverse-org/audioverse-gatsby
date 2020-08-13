import React from "react"
import Layout from "../components/layout"
import './sermons.scss'
import Pagination from "../components/molecules/pagination"

export default function Sermons({ pageContext }) {
    const sermons = pageContext.nodes,
        {total, current} = pageContext.pagination;

    return (
        <Layout className={'template-sermons'}>
            <ul>{sermons.map((n, i) => <li>{n.title}</li>)}</ul>

            <Pagination current={current} total={total} base={'/en/sermons'} />
        </Layout>
    )
}