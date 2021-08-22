import type { Root } from "hast";
import type { Plugin, Transformer } from "unified";
import { getEmbedHTML } from "../embed";
import { getLinkTransformer } from "./helper";

const transformer: Transformer<Root> = getLinkTransformer(getEmbedHTML);

const plugin: Plugin<any, Root> = () => transformer;
export default plugin;
