export const Actions = {
  init: 'init',
  set: 'set',
  error: 'error',
} as const;

type Action = 'init' | 'set' | 'error' | 'hidden';
export type ActionType = { type: Action; subjects?: Record<string, string>; hidden?: boolean };
type Option = { value: string; label: string };

interface InitState {
  status: 'init';
}

interface ReadyState {
  status: 'ready';
  hidden: boolean;
  map: Record<string, string>;
  options: Option[];
}

interface ErrorState {
  status: 'error';
}

type ReducerState = InitState | ReadyState | ErrorState;

const archiveSubjectsReducer = (state: ReducerState, action: ActionType): ReducerState => {
  switch (action.type) {
    case 'init':
      return { status: 'init' };
    case 'set':
      return {
        status: 'ready',
        map: action.subjects!,
        hidden: !!action.hidden,
        options: Object.entries(action.subjects!)
          .map(([key, value]): Option => ({ value: key, label: value }))
          .sort((a: Option, b: Option) => (a.label > b.label ? 1 : -1)),
      };
    case 'error':
      return { status: 'error' };
    default:
      return state;
  }
};

export default archiveSubjectsReducer;
