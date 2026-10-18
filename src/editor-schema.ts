import type {SourceEditorOptions} from '@kubohiroya/turbowarp-extension-data-editor/schema';
import {extensionConfig} from './config.js';
import {canonicalBundle, sourceBinding} from './source-editor.js';
import document from '../schemas/react-props.schema.json' with {type: 'json'};
import {parsePropsJson} from './island.js';
export const reactPropsSchemaBundle = canonicalBundle('turbowarp-http-server-react', 'react-props', document, {path: 'src/island.ts', symbol: 'parsePropsJson'});
const definitions = [{editorId: 'react-props-source', opcodes: ['reactIsland', 'reactIslandHtml'],
  bindings: [sourceBinding('PROPS_JSON', reactPropsSchemaBundle, parsePropsJson)]}];

export const sourceEditorDefinitions: readonly SourceEditorOptions[] = definitions.map(({editorId, opcodes, bindings}) => ({
  apiVersion: 1, extensionId: extensionConfig.id, editorId, opcodes: opcodes.map(opcode => `${extensionConfig.id}_${opcode}`), bindings,
  validationContext: () => ({consumerId: extensionConfig.id, nowMs: Date.now(), settings: null})
}));
