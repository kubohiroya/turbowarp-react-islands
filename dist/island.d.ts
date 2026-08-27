export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    [key: string]: JsonValue;
};
export type JsonObject = {
    [key: string]: JsonValue;
};
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
export declare class ComponentRegistry {
    private readonly components;
    register(component: string, module: string): ReactComponentRegistration;
    list(): ReactComponentRegistration[];
    toJSON(): ReactComponentRegistration[];
}
export declare function createReactIslandDescriptor(input: ReactIslandInput): ReactIslandDescriptor;
export declare function parsePropsJson(value: string): JsonObject;
export declare function serializeReactIslandDescriptor(descriptor: ReactIslandDescriptor): string;
export declare function renderReactIslandHtml(descriptor: ReactIslandDescriptor): string;
