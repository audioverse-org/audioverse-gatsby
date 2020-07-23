import React from "react"
import Layout from "../components/layout"
import './sermon.css'

export default function Sermon({ pageContext }) {
    const sermon = pageContext.node,
        firstPresenter = sermon.presenters[0],
        imageSrc = firstPresenter && firstPresenter.photoWithFallback.url,
        imageAlt = firstPresenter && firstPresenter.name;

    return (
        <Layout>
            <div className={'template-sermon'}>
                <div className="template-sermon__meta">
                    {imageSrc ? <img src={imageSrc} alt={imageAlt}/> : null}
                    <div className="template-sermon__meta-text">
                        <h1>{sermon.title}</h1>
                        <ul className={'template-sermon__speakers'}>
                            {sermon.presenters.map(speaker => {
                                return <li>{speaker.name}</li>
                            })}
                        </ul>
                    </div>
                </div>

                {sermon.recordingDate ? <p>{(new Date(sermon.recordingDate)).toLocaleDateString()}</p> : null}

                {sermon.mediaFiles.map(file => {
                    return <div><audio controls src={file.url} preload={'metadata'}>Your browser doesn't support this player.</audio></div>
                })}

                {sermon.description ? <div dangerouslySetInnerHTML={{__html: sermon.description}} /> : null}
            </div>
        </Layout>
    )
}