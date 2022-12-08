import { useMachine } from "@xstate/vue";
import { assign, createMachine } from "xstate";

/** Context */
type AC<R, E> = {
  result?: R;
  error?: E;
};

/** Events */
type AE = { type: "RUN" } | { type: "RESET" };

/** StateTypes */
type AES<R, E> =
  | { value: "idle"; context: { result: undefined; error: undefined } }
  | { value: "loading"; context: { result: undefined; error: undefined } }
  | { value: "success"; context: { result: Awaited<Required<R>>; error: undefined } }
  | { value: "error"; context: { result: undefined; error: Required<E> } };

/** Service map */
type ASM<R> = {
  runFunction: { data: R };
};

export function useLoading<R = unknown, E = Error>(fn: () => R, { clearSucces = 0, onSuccessClear = () => {} } = {}) {
  const loadingMachine = createMachine<AC<Awaited<R>, E>, AE, AES<R, E>, ASM<R>>(
    {
      context: { result: undefined, error: undefined },
      id: "loadingMachine",
      predictableActionArguments: true,
      initial: "idle",
      states: {
        idle: {
          entry: assign({ error: undefined, result: undefined }),
          on: { RUN: "loading" },
        },
        success: {
          after: clearSucces
            ? {
                [clearSucces]: {
                  target: "idle",
                  actions: () => {
                    onSuccessClear();
                  },
                },
              }
            : undefined,
          on: { RUN: "loading", RESET: "idle" },
        },
        error: { on: { RUN: "loading", RESET: "idle" } },
        loading: {
          entry: assign({ error: undefined, result: undefined }),
          invoke: {
            src: "runFunction",
            id: "runFunction",
            onDone: [
              {
                target: "success",
                actions: assign({ result: (_, event) => event.data }),
              },
            ],
            onError: [
              {
                target: "error",
                actions: assign({ error: (_, event) => event.data }),
              },
            ],
          },
        },
      },
    },
    {
      services: {
        runFunction: async () => fn(),
      },
    }
  );

  const { state, send } = useMachine(loadingMachine);

  const refresh = () => send({ type: "RUN" });
  const reset = () => send({ type: "RESET" });

  return {
    state,
    refresh,
    reset,
  };
}
