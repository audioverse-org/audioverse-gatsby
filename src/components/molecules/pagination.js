import React from "react"
import "./pagination.css"

export function pagination(current, total) {
    const center = [current - 2, current - 1, current, current + 1, current + 2],
        filteredCenter = center.filter((p) => p > 1 && p < total),
        includeThreeLeft = current === 5,
        includeThreeRight = current === total - 4,
        includeLeftDots = current > 5,
        includeRightDots = current < total - 4;

    if (includeThreeLeft) filteredCenter.unshift(2)
    if (includeThreeRight) filteredCenter.push(total - 1)

    if (includeLeftDots) filteredCenter.unshift('...');
    if (includeRightDots) filteredCenter.push('...');

    return [1, ...filteredCenter, total]
}

const PaginationEntry = ({page, label, base, className}) => <li className={className}>
    {
        Number.isInteger(page) ?
            <a href={`${base}/page/${page}`}>{label || page}</a> :
            label || page
    }
</li>

export default function Pagination({current, total, base}) {
    const pagePrevious = current - 1,
        pageNext = current + 1;

    const pages = pagination(current, total)

    return <ul className={'molecule-pagination'}>
        {current > 1 ? <PaginationEntry page={pagePrevious} label={'<'} base={base} /> : null}
        {pages.map((p, i) => <PaginationEntry page={p} key={i} base={base} className={p === current ? 'active' : null} />)}
        {current < total ? <PaginationEntry page={pageNext} label={'>'} base={base} /> : null}
    </ul>
}