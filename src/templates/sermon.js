import React from "react"
import Layout from "../components/layout"
import './sermon.css'

export default function Sermon({ pageContext }) {
    const sermon = pageContext.node
    return (
        <Layout>
            <div className={'template-sermon'}>
                <h1>{sermon.title}</h1>

                <ul className={'template-sermon__speakers'}>
                    {sermon.presenters.map(speaker => {
                        return <li>{speaker.name}</li>
                    })}
                </ul>

                {sermon.recordingDate ? <p>{(new Date(sermon.recordingDate)).toLocaleDateString()}</p> : null}

                {sermon.description ? <div dangerouslySetInnerHTML={{__html: sermon.description}} /> : null}

                {sermon.mediaFiles.map(file => {
                    return <div><audio controls src={file.url}>Your browser doesn't support this player.</audio></div>
                })}
            </div>
        </Layout>
    )
}