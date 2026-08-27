import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TurboWarpHttpServerReactExtension} from '../src/extension.js';

beforeEach(() => {
  vi.stubGlobal('Scratch', {
    BlockType: {COMMAND: 'command', REPORTER: 'reporter'},
    ArgumentType: {STRING: 'string'},
    Cast: {
      toString: (value: unknown) => String(value)
    },
    translate: (
      message: string | {default: string},
      placeholders: Record<string, string | number> = {}
    ) => {
      const text = typeof message === 'string' ? message : message.default;
      return Object.entries(placeholders).reduce(
        (result, [name, value]) => result.replace(`{${name}}`, String(value)),
        text
      );
    }
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TurboWarpHttpServerReactExtension', () => {
  it('returns a React island descriptor from block arguments', () => {
    const extension = new TurboWarpHttpServerReactExtension();
    expect(
      JSON.parse(
        extension.reactIsland({
          COMPONENT: 'Counter',
          MOUNT_ID: 'counter-root',
          PROPS_JSON: '{"initialCount":2}'
        })
      )
    ).toEqual({
      kind: 'react-island',
      version: 1,
      component: 'Counter',
      mountId: 'counter-root',
      props: {initialCount: 2}
    });
  });

  it('registers components for later Vite hydration', () => {
    const extension = new TurboWarpHttpServerReactExtension();
    extension.registerComponent({COMPONENT: 'Counter', MODULE: '/assets/react-islands.js'});
    expect(JSON.parse(extension.componentRegistryJson())).toEqual([
      {component: 'Counter', module: '/assets/react-islands.js'}
    ]);
  });

  it('uses localizable extension and block text', () => {
    const info = new TurboWarpHttpServerReactExtension().getInfo() as {
      name: string;
      blocks: Array<{text: string; blockType: string}>;
    };
    expect(info.name).toBe('TurboWarp HTTP Server React');
    expect(info.blocks[0]?.text).toBe('register React component [COMPONENT] from [MODULE]');
    expect(info.blocks[0]?.blockType).toBe('command');
  });

  it('publishes documentation and a self-contained SVG block icon', () => {
    const info = new TurboWarpHttpServerReactExtension().getInfo() as {
      docsURI: string;
      blockIconURI: string;
    };
    expect(info.docsURI).toBe('https://kubohiroya.github.io/turbowarp-http-server-react/');
    expect(info.blockIconURI).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
