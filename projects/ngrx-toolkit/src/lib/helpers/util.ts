import { Action, ActionCreator } from '@ngrx/store';
import { TypedApiAction } from '../types';
import { UNIQUE } from './constants';
import { uniformActionType } from './status.helpers';
import iMurMurHash from 'imurmurhash';

export const hashCode = (str: string) => {
  return iMurMurHash(str, 42069).result();
};

export const isAction = <T extends ActionCreator>(
  actionToBe: T,
  action: Action
  // @ts-ignore
): action is ReturnType<T> => action.type === actionToBe.type;

export const generateEntityId = (opts: any) => {
  if (opts) {
    return hashCode(JSON.stringify(opts));
  }

  return hashCode('NO_ARG');
};

export const sortObject = (sourceObj: Record<any, any>) => {
  return Object.keys(sourceObj)
    .sort()
    .reduce((obj, key) => {
      let val = sourceObj[key];

      if (typeof val === 'object' && val !== null && val !== undefined) {
        val = sortObject(val);
      }

      obj[key] = val;
      return obj;
    }, {} as Record<string, any>);
};

export const UNIQUE_ID = generateEntityId(UNIQUE);

const UNIQUE_LIST = new Set();

export const createActionId = (
  action: TypedApiAction<any, any>,
  isUnique?: boolean
) => {
  const uniformedActionType = uniformActionType(action.type);

  if (isUnique) {
    if (!UNIQUE_LIST.has(uniformedActionType)) {
      UNIQUE_LIST.add(uniformedActionType);
    }

    return UNIQUE_ID;
  }

  if (UNIQUE_LIST.has(uniformedActionType)) {
    return UNIQUE_ID;
  }

  const args = action.args;

  if (args) {
    const orderedArgs = sortObject(args);
    return generateEntityId(orderedArgs);
  }

  return generateEntityId(null);
};
