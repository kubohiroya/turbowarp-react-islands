export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {[key: string]: JsonValue};
export type JsonObject = {[key: string]: JsonValue};

export interface ReactComponentRegistration {
  component: string;
  module: string;
}

export interface ReactIslandDescriptor {
  kind: 'react-island';
  version: 1;
  component: string;
  mountId: string;
  props: JsonObject;
}

export interface ReactIslandInput {
  component: string;
  mountId: string;
  props?: JsonObject;
}

export class ComponentRegistry {
  private readonly components = new Map<string, ReactComponentRegistration>();

  public register(component: string, module: string): ReactComponentRegistration {
    const registration = {
      component: validateComponentName(component),
      module: validateModuleSpecifier(module)
    };
    this.components.set(registration.component, registration);
    return registration;
  }

  public list(): ReactComponentRegistration[] {
    return [...this.components.values()].sort((left, right) =>
      left.component.localeCompare(right.component)
    );
  }

  public toJSON(): ReactComponentRegistration[] {
    return this.list();
  }
}

export function createReactIslandDescriptor(input: ReactIslandInput): ReactIslandDescriptor {
  return {
    kind: 'react-island',
    version: 1,
    component: validateComponentName(input.component),
    mountId: validateMountId(input.mountId),
    props: input.props ?? {}
  };
}

export function parsePropsJson(value: string): JsonObject {
  const trimmed = value.trim();
  if (trimmed.length === 0) return {};

  const parsed = JSON.parse(trimmed) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new TypeError('React island props must be a JSON object.');
  }
  return parsed as JsonObject;
}

export function serializeReactIslandDescriptor(descriptor: ReactIslandDescriptor): string {
  return JSON.stringify(descriptor);
}

export function renderReactIslandHtml(descriptor: ReactIslandDescriptor): string {
  const propsJson = JSON.stringify(descriptor.props).replace(/</g, '\\u003c');
  return [
    `<div id="${escapeHtmlAttribute(descriptor.mountId)}" data-tw-react-island="${escapeHtmlAttribute(
      descriptor.component
    )}">`,
    `<script type="application/json" data-tw-react-props>${propsJson}</script>`,
    '</div>'
  ].join('');
}

function validateComponentName(value: string): string {
  const component = value.trim();
  if (!/^[A-Z][A-Za-z0-9]*(?:[.:/-][A-Z]?[A-Za-z0-9]+)*$/.test(component)) {
    throw new TypeError(`Invalid React component name: ${value}`);
  }
  return component;
}

function validateMountId(value: string): string {
  const mountId = value.trim();
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(mountId)) {
    throw new TypeError(`Invalid React island mount ID: ${value}`);
  }
  return mountId;
}

function validateModuleSpecifier(value: string): string {
  const module = value.trim();
  if (module.length === 0) {
    throw new TypeError('React component module must be non-empty.');
  }
  return module;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
