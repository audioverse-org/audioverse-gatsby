import React from "react"
import Layout from "../components/layout"

export default function Sermon({ pageContext }) {
    const sermon = pageContext.node
    console.log(sermon.recordingDate)
    return (
        <Layout>
            <h1>{sermon.title}</h1>

            {sermon.recordingDate ? <p>{sermon.recordingDate}</p> : null}

            <ul>
                {sermon.presenters.map(speaker => {
                    return <li>{speaker.name}</li>
                })}
            </ul>

            {sermon.description ? <p>{sermon.description}</p> : null}

            {sermon.mediaFiles.map(file => {
                return <div><audio controls src={file.url}>Your browser doesn't support this player.</audio></div>
            })}
        </Layout>
    )
}