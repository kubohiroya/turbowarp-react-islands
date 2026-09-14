// Name: TurboWarp React Islands
// ID: kubohiroyareactislands
// Description: Describe React islands from TurboWarp blocks for turbowarp-http-server HTML responses.
// By: Hiroya Kubo
// License: MPL-2.0

(function (Scratch) {
  'use strict';

  const extensionConfig = {
    id: "kubohiroyareactislands",
    docsURI: "https://kubohiroya.github.io/turbowarp-react-islands/",
    blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHJlY3QgeD0iNCIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE0IiByeD0iMyIgZmlsbD0iIzRDOTdGRiIvPjxyZWN0IHg9IjI2IiB5PSI4IiB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHJ4PSIzIiBmaWxsPSIjNTlDMDU5Ii8+PHJlY3QgeD0iMTUiIHk9IjI2IiB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHJ4PSIzIiBmaWxsPSIjRkZBQjE5Ii8+PC9zdmc+"
  };
  const extensionName = "TurboWarp React Islands";
  const blocks = [{ "opcode": "registerComponent", "blockType": "COMMAND", "text": "register React component [COMPONENT] from [MODULE]", "description": "Registers a React component name and the browser module that will hydrate it later.", "arguments": { "COMPONENT": { "type": "STRING", "defaultValue": "Counter" }, "MODULE": { "type": "STRING", "defaultValue": "/assets/react-islands.js" } } }, { "opcode": "reactIsland", "blockType": "REPORTER", "text": "React island [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]", "description": "Returns a JSON mount descriptor for a React island.", "arguments": { "COMPONENT": { "type": "STRING", "defaultValue": "Counter" }, "MOUNT_ID": { "type": "STRING", "defaultValue": "counter-root" }, "PROPS_JSON": { "type": "STRING", "defaultValue": '{"initialCount":0}' } } }, { "opcode": "reactIslandHtml", "blockType": "REPORTER", "text": "React island HTML [COMPONENT] at [MOUNT_ID] props [PROPS_JSON]", "description": "Returns a safe HTML fragment that marks where a React island should be mounted.", "arguments": { "COMPONENT": { "type": "STRING", "defaultValue": "Counter" }, "MOUNT_ID": { "type": "STRING", "defaultValue": "counter-root" }, "PROPS_JSON": { "type": "STRING", "defaultValue": '{"initialCount":0}' } } }, { "opcode": "componentRegistryJson", "blockType": "REPORTER", "text": "React component registry JSON", "description": "Returns the registered React component registry as JSON.", "arguments": {} }];
  const definitions = {
    extensionName,
    blocks
  };
  class ComponentRegistry {
    constructor() {
      this.components = /* @__PURE__ */ new Map();
    }
    register(component, module) {
      const registration = {
        component: validateComponentName(component),
        module: validateModuleSpecifier(module)
      };
      this.components.set(registration.component, registration);
      return registration;
    }
    list() {
      return [...this.components.values()].sort(
        (left, right) => left.component.localeCompare(right.component)
      );
    }
    toJSON() {
      return this.list();
    }
  }
  function createReactIslandDescriptor(input) {
    return {
      kind: "react-island",
      version: 1,
      component: validateComponentName(input.component),
      mountId: validateMountId(input.mountId),
      props: input.props ?? {}
    };
  }
  function parsePropsJson(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0) return {};
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new TypeError("React island props must be a JSON object.");
    }
    return parsed;
  }
  function serializeReactIslandDescriptor(descriptor) {
    return JSON.stringify(descriptor);
  }
  function renderReactIslandHtml(descriptor) {
    const propsJson = JSON.stringify(descriptor.props).replace(/</g, "\\u003c");
    return [
      `<div id="${escapeHtmlAttribute(descriptor.mountId)}" data-tw-react-island="${escapeHtmlAttribute(
        descriptor.component
      )}">`,
      `<script type="application/json" data-tw-react-props>${propsJson}<\/script>`,
      "</div>"
    ].join("");
  }
  function validateComponentName(value) {
    const component = value.trim();
    if (!/^[A-Z][A-Za-z0-9]*(?:[.:/-][A-Z]?[A-Za-z0-9]+)*$/.test(component)) {
      throw new TypeError(`Invalid React component name: ${value}`);
    }
    return component;
  }
  function validateMountId(value) {
    const mountId = value.trim();
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(mountId)) {
      throw new TypeError(`Invalid React island mount ID: ${value}`);
    }
    return mountId;
  }
  function validateModuleSpecifier(value) {
    const module = value.trim();
    if (module.length === 0) {
      throw new TypeError("React component module must be non-empty.");
    }
    return module;
  }
  function escapeHtmlAttribute(value) {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  const blockDefinitions = definitions.blocks;
  class TurboWarpHttpServerReactExtension {
    constructor() {
      this.registry = new ComponentRegistry();
    }
    getInfo() {
      return {
        id: extensionConfig.id,
        name: Scratch.translate(definitions.extensionName),
        docsURI: extensionConfig.docsURI,
        blockIconURI: extensionConfig.blockIconURI,
        blocks: blockDefinitions.map((block) => this.toScratchBlock(block))
      };
    }
    registerComponent(args) {
      this.registry.register(
        Scratch.Cast.toString(args.COMPONENT),
        Scratch.Cast.toString(args.MODULE)
      );
    }
    reactIsland(args) {
      return serializeReactIslandDescriptor(this.createDescriptor(args));
    }
    reactIslandHtml(args) {
      return renderReactIslandHtml(this.createDescriptor(args));
    }
    componentRegistryJson() {
      return JSON.stringify(this.registry.toJSON());
    }
    toScratchBlock(block) {
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
    createDescriptor(args) {
      return createReactIslandDescriptor({
        component: Scratch.Cast.toString(args.COMPONENT),
        mountId: Scratch.Cast.toString(args.MOUNT_ID),
        props: parsePropsJson(Scratch.Cast.toString(args.PROPS_JSON))
      });
    }
  }
  Scratch.extensions.register(new TurboWarpHttpServerReactExtension());

})(Scratch);
