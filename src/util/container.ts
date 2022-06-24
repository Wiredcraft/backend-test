import { join } from 'path';
import { debuglog } from 'util';
import { assert } from 'console';
import { sync as scanFiles } from 'glob';
import * as Configs from '../config/config.default';

const debug = debuglog('WebLoading');

type ConfigKey = keyof typeof Configs;

interface ContainerConfig {
  propertyName: string;
  configKey: ConfigKey;
}

interface ContainerInjectItem {
  propertyName: string;
  injectKey: string;
}

interface ContianerClass {
  new (): any;
}

export enum ContainerClassScope {
  OnDemand,
  Singleton
}

const INIT_KEY = Symbol();
const CONFIG_KEY = Symbol();
const INJECT_KEY = Symbol();
const SCOPE_KEY = Symbol();

let inited = false;
const classStorage = new Map();
const singletonInstanceStorage = new Map();

function ensureContainerInited() {
  if (inited) {
    return;
  }
  const files = scanFiles(join(__dirname, '../**/*'));
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      require(file);
    }
  }
  inited = true;
}

/**
 * Get instance from container
 *
 * @param key
 * @returns
 */
export function getInstance<T = any>(key: string): T {
  // 1. Ensure container inited
  ensureContainerInited();

  const Cls: ContianerClass = classStorage.get(key);
  assert(Cls, `${key} not found in container`);

  /**
   * 2. Load instace scope
   */
  const scope: ContainerClassScope =
    Reflect.getMetadata(SCOPE_KEY, Cls) ?? ContainerClassScope.OnDemand;

  // singleton instance
  if (
    scope === ContainerClassScope.Singleton &&
    singletonInstanceStorage.has(Cls)
  ) {
    return singletonInstanceStorage.get(Cls);
  }

  // new on demand
  const instance = new Cls();

  /**
   * 3. Load config for current instance
   */
  const configList: ContainerConfig[] =
    Reflect.getMetadata(CONFIG_KEY, instance) ?? [];
  for (const { propertyName, configKey } of configList) {
    instance[propertyName] = Configs[configKey];
  }

  /**
   * 4. Init instance
   */
  const initProperName = Reflect.getMetadata(INIT_KEY, instance);
  if (initProperName && instance[initProperName]?.call) {
    instance[initProperName].call(instance);
  }

  /**
   * 5. Load injected instance to property
   */
  const injectInstances: ContainerInjectItem[] =
    Reflect.getMetadata(INJECT_KEY, instance) ?? [];
  for (const { propertyName, injectKey } of injectInstances) {
    instance[propertyName] = getInstance(injectKey);
  }

  // Save singleton instance
  if (scope === ContainerClassScope.Singleton) {
    singletonInstanceStorage.set(Cls, instance);
  }

  return instance;
}

/**
 * Initialize mark
 *
 * If there is duplicated mark, use last one
 * @returns
 */
export function Init() {
  return (object: any, propertyName: string) => {
    Reflect.defineMetadata(INIT_KEY, propertyName, object);
  };
}

export function Config(configKey: ConfigKey) {
  return (object: any, propertyName: string) => {
    const list: ContainerConfig[] =
      Reflect.getMetadata(CONFIG_KEY, object) ?? [];
    list.push({ propertyName, configKey });
    Reflect.defineMetadata(CONFIG_KEY, list, object);
  };
}

/**
 * Scope mark
 *
 * Mark the class' instance scope type
 * @param scope
 * @returns decorator for class
 */
export function Scope(scope: ContainerClassScope) {
  return (targetCls: any) => {
    Reflect.defineMetadata(SCOPE_KEY, scope, targetCls);
  };
}

/**
 * Register class in container
 *
 * @param key class registered key
 * @returns decorator for class
 */
export function Provide(key?: string) {
  return (targetCls: any) => {
    const classKey = key ?? lowerFistLetter(targetCls.name);
    debug('provide register', classKey);
    classStorage.set(classKey, targetCls);
  };
}

/**
 * Property Inject mark
 *
 * Property will be filled by the instance from container
 * @param key instance key
 * @returns decorator for property
 */
export function Inject(key?: string) {
  return (object: any, propertyName: string) => {
    const injectKey = key ?? lowerFistLetter(propertyName);
    const list: ContainerInjectItem[] =
      Reflect.getMetadata(INJECT_KEY, object) ?? [];
    list.push({ propertyName, injectKey });
    Reflect.defineMetadata(INJECT_KEY, list, object);
  };
}

function lowerFistLetter(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
