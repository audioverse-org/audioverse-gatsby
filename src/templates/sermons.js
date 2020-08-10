import React from "react"
import Layout from "../components/layout"
import './sermons.css'

export default function Sermons({ pageContext }) {
    const sermons = pageContext.nodes,
        {total, current} = pageContext.pagination,
        pageStart = Math.max(1, current - 10),
        pageEnd = Math.min(total, current + 10),
        pagePrevious = Math.max(1, current - 1),
        pageNext = Math.min(total, current + 1);

    let pageLinks = []
    for (let i = pageStart; i <= pageEnd; i++) {
        pageLinks.push(<li className={current === i ? "active" : null}>
            <a href={`/en/sermons/page/${i}`}>{i}</a>
        </li>)
    }

    return (
        <Layout className={'template-sermons'}>
            <ul>{sermons.map((n, i) => <li>{n.title}</li>)}</ul>

            <ul className={'template-sermons__pagination'}>
                <li><a href={`/en/sermons/page/${pagePrevious}`}>{'<'}</a></li>
                <li><a href={`/en/sermons/page/1`}>First</a></li>
                {pageLinks}
                <li><a href={`/en/sermons/page/${total}`}>Last</a></li>
                <li><a href={`/en/sermons/page/${pageNext}`}>{'>'}</a></li>
            </ul>
        </Layout>
    )
}