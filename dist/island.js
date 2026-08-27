export class ComponentRegistry {
    constructor() {
        this.components = new Map();
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
        return [...this.components.values()].sort((left, right) => left.component.localeCompare(right.component));
    }
    toJSON() {
        return this.list();
    }
}
export function createReactIslandDescriptor(input) {
    return {
        kind: 'react-island',
        version: 1,
        component: validateComponentName(input.component),
        mountId: validateMountId(input.mountId),
        props: input.props ?? {}
    };
}
export function parsePropsJson(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0)
        return {};
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new TypeError('React island props must be a JSON object.');
    }
    return parsed;
}
export function serializeReactIslandDescriptor(descriptor) {
    return JSON.stringify(descriptor);
}
export function renderReactIslandHtml(descriptor) {
    const propsJson = JSON.stringify(descriptor.props).replace(/</g, '\\u003c');
    return [
        `<div id="${escapeHtmlAttribute(descriptor.mountId)}" data-tw-react-island="${escapeHtmlAttribute(descriptor.component)}">`,
        `<script type="application/json" data-tw-react-props>${propsJson}</script>`,
        '</div>'
    ].join('');
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
        throw new TypeError('React component module must be non-empty.');
    }
    return module;
}
function escapeHtmlAttribute(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
//# sourceMappingURL=island.js.map