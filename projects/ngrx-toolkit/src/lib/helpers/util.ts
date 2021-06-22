import { Action, ActionCreator } from '@ngrx/store';
import { TypedApiAction } from '../types';
import { UNIQUE } from './constants';
import { uniformActionType } from './status.helpers';

export const hashCode = (str: string) => {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );
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

export const UNIQUE_ID = generateEntityId(UNIQUE);

const UNIQUE_LIST: string[] = [];

export const createActionId = (
  action: TypedApiAction<any, any>,
  isUnique?: boolean
) => {
  if (isUnique) {
    if (!UNIQUE_LIST.some((u) => u === uniformActionType(action.type))) {
      UNIQUE_LIST.push(uniformActionType(action.type));
    }

    return UNIQUE_ID;
  }

  if (UNIQUE_LIST.some((u) => u === action.type)) {
    return UNIQUE_ID;
  }

  const args = action.args;

  if (args) {
    const copiedArgs = JSON.parse(JSON.stringify(args));
    if (copiedArgs?.body?.password) {
      copiedArgs.body.password = '[HIDDEN]';
    }

    if (copiedArgs?.body?.plainPassword) {
      copiedArgs.body.plainPassword = '[HIDDEN]';
    }

    return generateEntityId(copiedArgs);
  }

  return generateEntityId(null);
};
