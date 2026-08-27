import {extensionConfig} from './config';
import definitions from './block-definitions.json';
import {
  ComponentRegistry,
  createReactIslandDescriptor,
  parsePropsJson,
  renderReactIslandHtml,
  serializeReactIslandDescriptor
} from './island.js';

type BlockTypeName = 'COMMAND' | 'REPORTER';
type ArgumentTypeName = 'STRING';

interface DefinitionArgument {
  type: ArgumentTypeName;
  defaultValue: string;
}

interface BlockDefinition {
  opcode: string;
  blockType: BlockTypeName;
  text: string;
  description: string;
  arguments: Record<string, DefinitionArgument>;
}

const blockDefinitions = definitions.blocks as readonly BlockDefinition[];

export class TurboWarpHttpServerReactExtension implements TurboWarpExtension {
  private readonly registry = new ComponentRegistry();

  public getInfo(): Record<string, unknown> {
    return {
      id: extensionConfig.id,
      name: Scratch.translate(definitions.extensionName),
      docsURI: extensionConfig.docsURI,
      blockIconURI: extensionConfig.blockIconURI,
      blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
    };
  }

  public registerComponent(args: {COMPONENT: unknown; MODULE: unknown}): void {
    this.registry.register(
      Scratch.Cast.toString(args.COMPONENT),
      Scratch.Cast.toString(args.MODULE)
    );
  }

  public reactIsland(args: {COMPONENT: unknown; MOUNT_ID: unknown; PROPS_JSON: unknown}): string {
    return serializeReactIslandDescriptor(this.createDescriptor(args));
  }

  public reactIslandHtml(args: {
    COMPONENT: unknown;
    MOUNT_ID: unknown;
    PROPS_JSON: unknown;
  }): string {
    return renderReactIslandHtml(this.createDescriptor(args));
  }

  public componentRegistryJson(): string {
    return JSON.stringify(this.registry.toJSON());
  }

  private toScratchBlock(block: BlockDefinition): Record<string, unknown> {
    return {
      opcode: block.opcode,
      blockType: Scratch.BlockType[block.blockType],
      text: Scratch.translate(block.text),
      arguments: Object.fromEntries(
        Object.entries(block.arguments).map(([name, argument]) => [
          name,
          {
            type: Scratch.ArgumentType[argument.type],
            defaultValue: argument.defaultValue
          }
        ])
      )
    };
  }

  private createDescriptor(args: {
    COMPONENT: unknown;
    MOUNT_ID: unknown;
    PROPS_JSON: unknown;
  }) {
    return createReactIslandDescriptor({
      component: Scratch.Cast.toString(args.COMPONENT),
      mountId: Scratch.Cast.toString(args.MOUNT_ID),
      props: parsePropsJson(Scratch.Cast.toString(args.PROPS_JSON))
    });
  }
}
