import {createNextRouteHandler} from "uploadthing/next"
import { ourFileRouter } from "./core"
ourFileRouter

export const {GET,POST}=createNextRouteHandler({router:ourFileRouter})

