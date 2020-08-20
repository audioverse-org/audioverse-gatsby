import React from "react"
import Layout from "../components/layout"
import './sermons.scss'
import Pagination from "../components/molecules/pagination"
import {graphql} from "gatsby";
import moment from "moment";

export default function Sermons({pageContext, data}) {
    if (!data) {
        return <p>Page query failed</p>
    }

    const sermons = data.avorg.sermons.nodes,
        {total, current} = pageContext.pagination;

    return (
        <Layout className={'template-sermons'}>
            <table>
                {sermons.map((n, i) => <tr>
                    <td><img src={n.imageWithFallback.url} alt={n.title} /></td>
                    <td><a href={`/en/sermons/${n.id}`}>{n.title}</a></td>
                    <td>{n.persons.map(p => p.name).join(', ')}</td>
                    <td>{moment(n.recordingDate).fromNow()}</td>
                    <td>{new Date(1000 * n.duration).toISOString().substr(11, 8)}</td>
                </tr>)}
            </table>

            <Pagination current={current} total={total} base={'/en/sermons'}/>
        </Layout>
    )
}

export const query = graphql`
    query loadPage($language: AVORG_Language!, $cursor: String) {
        avorg {
            sermons(language: $language, after: $cursor, orderBy: {direction: DESC, field: CREATED_AT}) {
                nodes {
                    title
                    id
                    imageWithFallback {
                        url(size: 50)
                    }
                    persons {
                        name
                    }
                    duration
                    recordingDate
                }
            }
        }
    }
`
