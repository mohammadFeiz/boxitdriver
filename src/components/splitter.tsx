import { FC } from "react";

export const Splitter: FC<{dashed?:boolean}> = ({dashed}) => <div className={`brd-c-13- brd-b-${dashed?' dashed-':''}`}></div>