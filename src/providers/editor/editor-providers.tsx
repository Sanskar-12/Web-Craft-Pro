"use client"

import { EditorBtns } from "@/lib/constants"

export type DevicesType="Desktop" | "Mobile" | "Tablet"

export type EditorElement={
    id:string,
    styles:React.CSSProperties,
    name:string,
    type:EditorBtns,
    content:EditorElement[] | {
        href?:string,
        innerText?:string,
        src?:string
    }
}

export type Editor={
    liveMode:boolean,
    element:EditorElement[],
    selectedElement:EditorElement,
    device:DevicesType,
    previewMode:boolean,
    funnelPageId:string
}

export type HistoryState={
    history:Editor[],
    currentIndex:number
}

export type EditorState={
    editor:Editor,
    history:HistoryState
}

