import {describe, expect, it} from 'vitest';
import {
  ComponentRegistry,
  createReactIslandDescriptor,
  parsePropsJson,
  renderReactIslandHtml,
  serializeReactIslandDescriptor
} from '../src/island.js';

describe('React island helpers', () => {
  it('creates a deterministic mount descriptor', () => {
    const descriptor = createReactIslandDescriptor({
      component: 'Counter',
      mountId: 'counter-root',
      props: {initialCount: 1}
    });

    expect(serializeReactIslandDescriptor(descriptor)).toBe(
      '{"kind":"react-island","version":1,"component":"Counter","mountId":"counter-root","props":{"initialCount":1}}'
    );
  });

  it('renders a safe HTML fragment for turbowarp-html', () => {
    const html = renderReactIslandHtml(
      createReactIslandDescriptor({
        component: 'Counter',
        mountId: 'counter-root',
        props: {label: '</script><div>'}
      })
    );

    expect(html).toContain('id="counter-root"');
    expect(html).toContain('data-tw-react-island="Counter"');
    expect(html).toContain('type="application/json"');
    expect(html).toContain('\\u003c/script>');
    expect(html).not.toContain('</script><div>');
  });

  it('keeps component registry output sorted', () => {
    const registry = new ComponentRegistry();
    registry.register('Zeta', '/zeta.js');
    registry.register('Counter', '/counter.js');

    expect(registry.toJSON()).toEqual([
      {component: 'Counter', module: '/counter.js'},
      {component: 'Zeta', module: '/zeta.js'}
    ]);
  });

  it('parses empty props as an empty object', () => {
    expect(parsePropsJson('')).toEqual({});
    expect(() => parsePropsJson('[]')).toThrow('React island props must be a JSON object.');
  });
});
