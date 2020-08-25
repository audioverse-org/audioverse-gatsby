import React from "react"
import Layout from "../components/layout"
import './sermons.scss'
import Pagination from "../components/molecules/pagination"
import moment from "moment";
import {getSermonPath} from "../helpers/paths";

export default function Sermons({pageContext}) {
    const {nodes, lang} = pageContext,
        {total, current} = pageContext.pagination;

    return (
        <Layout className={'template-sermons'}>
            <table>
                {nodes.map((n, i) => <tr>
                    <td><img src={n.imageWithFallback.url} alt={n.title} /></td>
                    <td><a href={getSermonPath(n, lang)}>{n.title}</a></td>
                    <td>{n.persons.map(p => p.name).join(', ')}</td>
                    <td>{moment(n.recordingDate).fromNow()}</td>
                    <td>{new Date(1000 * n.duration).toISOString().substr(11, 8)}</td>
                </tr>)}
            </table>

            <Pagination current={current} total={total} base={'/en/sermons'}/>
        </Layout>
    )
}
