import React from "react"
import Layout from "../components/layout"
import './sermons.detail.scss'

export default function SermonsDetail({ pageContext }) {
    const sermon = pageContext.node,
        imageSrc = sermon.imageWithFallback.url,
        imageAlt = sermon.title;

    return (
        <Layout>
            <div className={'template-sermon'}>
                <div className="template-sermon__meta">
                    {imageSrc ? <img src={imageSrc} alt={imageAlt}/> : null}
                    <div className="template-sermon__meta-text">
                        <h1>{sermon.title}</h1>
                        <ul className={'template-sermon__speakers'}>
                            {sermon.persons.map(speaker => {
                                return <li>{speaker.name}</li>
                            })}
                        </ul>
                    </div>
                </div>

                {sermon.recordingDate ? <p>{(new Date(sermon.recordingDate)).toLocaleDateString()}</p> : null}

                {sermon.audioFiles.map(file => {
                    return <div><audio controls src={file.url} preload={'metadata'}>Your browser doesn't support this player.</audio></div>
                })}

                {sermon.description ? <div dangerouslySetInnerHTML={{__html: sermon.description}} /> : null}
            </div>
        </Layout>
    )
}
