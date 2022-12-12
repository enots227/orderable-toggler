import React, { useState, useRef } from 'react';
import { InputGroup, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight, faCaretLeft, faCaretUp } from '@fortawesome/free-solid-svg-icons'
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
    defaultValue?: string[][]
}

function highlightText(text: string, search: string) {
    let res: React.ReactNode[] = []
    let str = text.toLowerCase()
    search = search.toLowerCase()
    do {
        const startPos = str.indexOf(search)
        const endPos = startPos + search.length

        res.push(str.substring(0, startPos))
        res.push(<b>{str.substring(startPos, endPos)}</b>)
        str = str.substring(endPos)
    } while (str.includes(search))
    res.push(str)
    return res
}

function OrderableToggler(props: OrderableTogglerProps) {
    const [value, setValue] = useState(props.defaultValue ?? [])
    const [search, setSearch] = useState("")
    const [dragging, setDragging] = useState<string | null>(null)
    const groupRefs = useRef<Array<HTMLUListElement | null>>([])
    const draggableRefs = useRef<Array<HTMLLIElement | null>>([])
    const draggableRef = useRef<HTMLLIElement | null>(null)

    const isSearching = search.length > 0

    // const onActivate = (value: string) => setValue(state => [...state, value])
    // const onInactivate = (value: string) => setValue(state => state.filter(itm => itm !== value))

    // const onDragStart = (value: string) => { setDragging(value); }
    // const onDragEnd = () => { console.log("END"); setDragging(null) }
    // const onDragOver = (key: number, e: React.DragEvent<HTMLUListElement>) => {
    //     console.log(e);
    //     const containerRef = containerRefs.current[key]
    //     if (dragging === null || containerRef === null || draggableRef.current === null) {
    //         return
    //     }console.log(e.target)

    //     const afterElement = getDragAfterElement(containerRef, e.clientY)
    //     if (afterElement == null) {
    //         containerRef.appendChild(draggableRef.current)
    //       } else {
    //         containerRef.insertBefore(draggableRef.current, afterElement.element)
    //       }
    //     // if (afterElement.element === null) {
    //     //     setValue(state => [...state.filter(v => v !== dragging), dragging])
    //     // } else {
    //     //     setValue(state => {
    //     //         const index = state.indexOf(dragging)
    //     //         const newOrder = [...state]
    //     //         if (index !== -1)
    //     //             newOrder.splice(index, 1)
    //     //         newOrder.splice(afterElement.key, 0, dragging)
    //     //         return newOrder
    //     //     })
    //     // }
    // }
    // const onDragOverInactive = (e: React.DragEvent<HTMLUListElement>) => {
    //     setValue(state => state.filter(itm => itm !== dragging))
    // }

    // const getDragAfterElement = (container: HTMLElement, y: number) => {
    //     const res = draggableRefs.current.reduce((closest: { offset: number, element: HTMLLIElement | null, key: number }, child, key) => {
    //         if (child === null) {
    //             return closest;
    //         }

    //         const box = child.getBoundingClientRect()
    //         const offset = y - box.top - box.height / 2
    //         if (offset < 0 && offset > closest.offset) {
    //             return { offset, element: child, key }
    //         } else {
    //             return closest
    //         }
    //     }, { offset: Number.NEGATIVE_INFINITY, element: null, key: -1 })

    //     return { element: res.element, key: res.key }
    // }

    return <div className="orderable-toggler">
        <div className="orderable-toggler-search">
            <Form.Control type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="orderable-toggler-groups">
            {props.groups.map((group, g) => {
                const values = value[g] ?? []

                return <div key={g} className="orderable-toggler-group">
                    <h6 className="d-flex justify-content-center mb-0 text-muted">{group.title}</h6>
                    <ul ref={el => groupRefs.current[0] = el} /*onDragOver={(e) => onDragOver(0, e)}*/>
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
                                ref={el => { draggableRefs.current[v] = el; draggableRef.current = el; }}
                                draggable={true}
                                // onDragStart={() => onDragStart(itm.value)}
                                // onDragEnd={onDragEnd}
                                 >
                                <InputGroup>
                                    {/* <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    </Button>
                                    <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </Button> */}
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
                                    {/* <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                        <FontAwesomeIcon icon={faCaretRight} />
                                    </Button> */}
                                </InputGroup>
                            </li>
                        })}
                    </ul>
                </div>
            })}
            {/* <div className="orderable-toggler__active">
                <h6 className="d-flex justify-content-center mb-0 text-muted">Active</h6>
                <ul onDragOver={(e) => onDragOver(0, e)} ref={el => containerRefs.current[0] = el}>
                    {active.map((activeValue, i) => {
                        const itm = props.items.find(itm => itm.value === activeValue)

                        if (!itm) {
                            return null;
                        }

                        const inSearch = isSearching && itm.title.toLowerCase().includes(search.toLowerCase())
                        const isDragging = dragging === itm.value

                        return <li key={i} className={"orderable-togger-item" +
                            (inSearch ? " orderable-togger-item-found" : "") +
                            (isDragging ? " orderable-toggler-item-dragging" : "")}
                            draggable={true}
                            onDragStart={() => onDragStart(itm.value)}
                            onDragEnd={onDragEnd}
                            ref={el => { draggableRefs.current[i] = el; draggableRef.current = el; }} >
                            <InputGroup>
                                <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                    <FontAwesomeIcon icon={faCaretUp} />
                                </Button>
                                <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </Button>
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
                                <Button variant="orderable-toggler-toggler" onClick={() => onInactivate(itm.value)}>
                                    <FontAwesomeIcon icon={faCaretRight} />
                                </Button>
                            </InputGroup>
                        </li>
                    })}
                </ul>
            </div>
            <div className="orderable-toggler__inactive">
                <h6 className="d-flex justify-content-center mb-0 text-muted">Inactive</h6>
                <ul onDragOver={(e) => onDragOver(1, e)} ref={el => containerRefs.current[1] = el}>
                    {props.items
                        .filter(itm => !active?.includes(itm.value))
                        .map((itm, i) => {
                            const inSearch = isSearching && itm.title.toLowerCase().includes(search.toLowerCase())
                            const isDragging = dragging === itm.value
                            return <li key={i}
                                className={"orderable-togger-item" +
                                    (inSearch ? " orderable-togger-item-found" : "") +
                                    (isDragging ? " orderable-toggler-item-dragging" : "")}
                                draggable={true}
                                onDragStart={() => onDragStart(itm.value)}
                                onDragEnd={onDragEnd}
                                ref={el => { draggableRefs.current[value.length + i] = el; draggableRef.current = el; }}>
                                <InputGroup>
                                    <Button variant="orderable-toggler-toggler" onClick={() => onActivate(itm.value)}>
                                        <FontAwesomeIcon icon={faCaretLeft} />
                                    </Button>
                                    <div className="orderable-toggler-item-content-2">
                                        {itm.title}
                                    </div>
                                </InputGroup>
                            </li>
                        })}
                </ul>
            </div> */}
        </div>
    </div>
}

export default OrderableToggler;
