import React, { useState, useRef } from 'react';
import { InputGroup, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import './App.css';

type OrderableTogglerItem = {
    title: string
    value: string | number
}

type OrderableTogglerGroups = {
    title: string
    value: string | number
}

type OrderableTogglerProps = {
    groups: OrderableTogglerGroups[]
    items: OrderableTogglerItem[]
    defaultValue?: Array<string | number>[]
}

function highlightText(text: string, search: string) {
    let res: React.ReactNode[] = []
    let str = text.toLowerCase()
    search = search.toLowerCase()
    let k = 0
    do {
        const startPos = str.indexOf(search)
        const endPos = startPos + search.length

        res.push(<span key={k++}>{str.substring(0, startPos)}</span>)
        res.push(<b key={k++}>{str.substring(startPos, endPos)}</b>)
        str = str.substring(endPos)
    } while (str.includes(search))
    
    if (str.length > 0)
        res.push(<span key={k}>{str}</span>)
    
    return res
}

function OrderableToggler(props: OrderableTogglerProps) {
    const [value, setValue] = useState(props.defaultValue ?? [])
    const [search, setSearch] = useState("")
    const [dragging, setDragging] = useState<string | number | null>(null)
    const groupRefs = useRef<Array<HTMLUListElement | null>>([])
    const draggableRefs = useRef<Array<Array<HTMLLIElement>>>([])
    const draggableRef = useRef<{ dG: number, dV: number } | null>(null)
    const isSearching = search.length > 0

    const onMoveGroup = (value: string | number, curr: number, adj: number) => setValue(state => {
        // remove from current group
        state[curr].splice(state.findIndex(grp => grp.indexOf(value)), 1)
        // add to new group
        state[adj].push(value)

        return state
    })

    const onDragStart = (g: number, v: number) => {
        setDragging(value[g][v] ?? null)
        draggableRef.current = { dG: g, dV: v }
    }
    const onDragEnd = (g: number, v: number) => {
        setDragging(null)
        draggableRef.current = null
    }
    const getDragAfterElement = (g: number, dV: number, y: number) => {
        const draggableElements = draggableRefs.current[g].filter((itm, v) => v !== dV)
        return draggableElements.reduce((closest: { offset: number, element: HTMLLIElement | null, v: number }, child: HTMLLIElement, v: number) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child, v: v }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null, v: -1 }).v
    }

    const onDragOver = (g: number, e: React.DragEvent<HTMLUListElement>) => {
        e.preventDefault()
        if (dragging === null || draggableRef.current === null) return;

        const { dG, dV } = draggableRef.current

        const afterElement = getDragAfterElement(g, dV, e.clientY) 

        if (dG === g && afterElement === dV) return;

        const res = [...value]

        // remove from group
        res[dG].splice(dV, 1)

        if (afterElement === -1) {
            // add to new group
            res[g].push(dragging)

            draggableRef.current = { dG: g, dV: res[g].length - 1 }
        } else {
            // adjust position in group
            res[g].splice(afterElement, 0, dragging)

            draggableRef.current = { dG: g, dV: afterElement }
        }

        setValue(res)
    }

    return <div className="orderable-toggler">
        <div className="orderable-toggler-search">
            <Form.Control type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="orderable-toggler-groups">
            {props.groups.map((group, g) => {
                const values = value[g] ?? []

                return <div key={g} className="orderable-toggler-group">
                    <h6 className="d-flex justify-content-center mb-0 text-muted">{group.title}</h6>
                    <ul ref={el => groupRefs.current[g] = el} onDragOver={(e) => onDragOver(g, e)}>
                        {values.map((value, v) => {
                            const itm = props.items.find(itm => itm.value === value)

                            if (!itm) {
                                return null;
                            }

                            const inSearch = isSearching && itm.title.toLowerCase().includes(search.toLowerCase())
                            const isDragging = dragging === itm.value

                            return <li key={v} className={"orderable-togger-item" +
                                (inSearch ? " orderable-togger-item-found" : "") +
                                (isDragging ? " orderable-toggler-item-dragging" : "")}
                                ref={el => {
                                    if (el === null) return;

                                    if (!draggableRefs.current[g])
                                        draggableRefs.current[g] = []
                                    
                                    draggableRefs.current[g][v] = el
                                }}
                                draggable={true}
                                onDragStart={() => onDragStart(g, v)}
                                onDragEnd={() => onDragEnd(g, v)}
                            >
                                <InputGroup>
                                    {g > 0 && <Button variant="orderable-toggler-toggler" onClick={() => onMoveGroup(itm.value, g, 1)}>
                                        <FontAwesomeIcon icon={faCaretLeft} />
                                    </Button>}
                                    <div className="orderable-toggler-item-content-2">
                                        {(() => {
                                            if (isSearching) {
                                                if (inSearch) {
                                                    return highlightText(itm.title, search)
                                                }
                                                return itm.title
                                            }
                                            return <b>{itm.title}</b>
                                        })()}
                                    </div>
                                    {g < props.groups.length - 1 && <Button variant="orderable-toggler-toggler" onClick={() => onMoveGroup(itm.value, g, 1)}>
                                        <FontAwesomeIcon icon={faCaretRight} />
                                    </Button>}
                                </InputGroup>
                            </li>
                        })}
                    </ul>
                </div>
            })}
        </div>
    </div>
}

export default OrderableToggler;
