/* eslint-disable no-new, @typescript-eslint/naming-convention */
import { Buffer } from 'node:buffer';
import { expectType, expectAssignable, expectError } from 'tsd';
import Conf from '../source/index.js';
const conf = new Conf({ accessPropertiesByDotNotation: true });
new Conf({
    defaults: {
        foo: 'bar',
        unicorn: false,
    },
});
new Conf({ configName: '' });
new Conf({ projectName: 'foo' });
new Conf({ cwd: '' });
new Conf({ encryptionKey: '' });
new Conf({ encryptionKey: Buffer.from('') });
new Conf({ encryptionKey: new Uint8Array([1]) });
new Conf({ encryptionKey: new DataView(new ArrayBuffer(2)) });
new Conf({ fileExtension: '.foo' });
new Conf({ configFileMode: 0o600 });
new Conf({ clearInvalidConfig: false });
new Conf({ serialize: () => 'foo' });
new Conf({ deserialize: () => ({ foo: 'foo', unicorn: true }) });
new Conf({ projectSuffix: 'foo' });
new Conf({ watch: true });
new Conf({
    schema: {
        foo: {
            type: 'string',
            default: 'foobar',
        },
        unicorn: {
            type: 'boolean',
        },
        hello: {
            type: 'number',
        },
        nested: {
            type: 'object',
            properties: {
                prop: {
                    type: 'number',
                },
            },
        },
    },
});
conf.set('hello', 1);
conf.set('unicorn', false);
conf.set({ foo: 'nope' });
conf.set('nested.prop', 3);
conf.set({
    nested: {
        prop: 3,
    },
});
expectType(conf.get('foo'));
expectType(conf.get('foo', 'bar'));
conf.delete('foo');
expectType(conf.has('foo'));
conf.clear();
const off = conf.onDidChange('foo', (oldValue, newValue) => {
    expectAssignable(oldValue);
    expectAssignable(newValue);
});
expectType(off);
off();
conf.store = {
    foo: 'bar',
    unicorn: false,
};
expectType(conf.path);
expectType(conf.size);
expectType(conf[Symbol.iterator]());
for (const [key, value] of conf) {
    expectType(key);
    expectType(value);
}
const config = new Conf({
    defaults: {
        isRainbow: true,
    },
});
config.get('isRainbow');
//=> true
expectType(conf.get('foo', 'bar'));
config.set('unicorn', '🦄');
console.log(config.get('unicorn'));
//=> '🦄'
config.delete('unicorn');
console.log(config.get('unicorn'));
//=> undefined
// Should be stored type or default
expectType(config.get('isRainbow'));
expectType(config.get('isRainbow', false));
expectType(config.get('unicorn'));
expectType(config.get('unicorn', 'rainbow'));
// @ts-expect-error
expectError(config.get('unicorn', 1));
// --
// -- Migrations --
new Conf({
    beforeEachMigration(store, context) {
        console.log(`[main-config] migrate from ${context.fromVersion} → ${context.toVersion}`);
        console.log(`[main-config] final migration version ${context.finalVersion}, all migrations that were run or will be ran: ${context.versions.toString()}`);
        console.log(`[main-config] phase ${(store.get('phase') || 'none')}`);
    },
    migrations: {
        '0.0.1'(store) {
            store.set('debug phase', true);
        },
        '1.0.0'(store) {
            store.delete('debug phase');
            store.set('phase', '1.0');
        },
        '1.0.2'(store) {
            store.set('phase', '>1.0');
        },
    },
});
// --
