import { WebhookInfo } from "@grammyjs/types";
import { Api } from "@roziscoding/grammy-web";
import { useMachine } from "@xstate/vue";
import { assign, createMachine, DoneInvokeEvent } from "xstate";

type Context = {
  webhookInfo?: WebhookInfo;
  error?: Error;
};

type Event =
  | { type: "FETCH" }
  | { type: "SET"; url: string; secretToken?: string; dropPendingUpdates: boolean }
  | { type: "DELETE"; dropPendingUpdates: boolean };

type StateTypes =
  | { value: "empty"; context: Context & { webhookInfo: undefined; error: undefined } }
  | { value: "idle"; context: Context & { webhookInfo: Required<WebhookInfo>; error: undefined } }
  | { value: "error"; context: Context & { error: Required<any> } }
  | { value: "success"; context: Context & { error: undefined } }
  | { value: "fetchingWebhook"; context: Context & { webhookInfo: Required<WebhookInfo>; error: undefined } }
  | { value: "settingWebhook"; context: Context & { webhookInfo: Required<WebhookInfo>; error: undefined } }
  | { value: "deletingWebhook"; context: Context & { webhookInfo: Required<WebhookInfo>; error: undefined } };

type ServiceMap = {
  fetchWebhook: { data: WebhookInfo };
  setWebhook: { data: undefined };
  deleteWebhook: { data: undefined };
};

export function useWebhook(token: string) {
  const api = new Api(token);

  const webhookStateMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QHcwCMAWB7LBrAsgIYDGGAlgHZgB0YAtgA4AuAngMQDaADALqKgMssMkzJYK-EAA9EAVgCcXagEZZXLouUAOWQGYuegDQgWcgEzLqurbutazANgtadAX1fHUmHARLkq1GQQADZgbABiAKIAKgDCABLcfEgggsKi4pIyCGYALLrUuU6ysg7qelqKssamCA751A62upq6jg6q7p7o2HhEpJQ0QaFsAMoxSZJpImISKdl5BUVmJWUG1lU1iPla1Hq2Coq59soOXSBevb4DAcNhACKRADIxkZMp0xlzoAsNy6vlDYGLY5FyNGy6ADssgsXFy6zOHguPR8-X8NAAZmAmDcoAB1FF4NgQcRDCgANzwNEuqL8g2oWJx-nxhNwCEolOIhC+SXeAiEM0y80Qyi4DlkVjUykh8mcslyKxBZQc1C0uTU1jMkKBuXONL6dICjNxBO8RLAACcLVgLdQGMFuRibXRqPrruiGdiTaz2RSsFyebw+akBV8siKxRLdFKZXKFdUTHIuLt5PI1AZTmoYfJdHrWWj6bBsaIKCyzbhiaTAn7cNT84aaEWmCWy1dfZzubNebwpqHZuGEAolKp1JodPojImEOqzFZ1Fw2vDIZCVrldUi3QWAk2W6armxLdbbfbHc7XfWbo3i5RWz52-7O+Ju8l+el+8LB4oVOmx3p1iDo1yQp0xhOE9DyeQ83LLcaAgMBQl3VlK1uGs62ghtqDghCbz3O8OQfQMeGDT53x+OQvxHDQuG0P9J1qfRZ3VdRcmXZRbA0MwoKuGDMPg7EcKQw8bTtB0mCdC0XU3DCsP40tcLwe8Ay7IMew+PshTIz9hx-ajx3-KczDhRp52UIo4RYzMuNpS9qFgABXYhiDgWA2CkWAmG5GhCAxJhLQAClFdQAEo2Ckmz7Mc5ziPU75pBFVQVSY-QmjaNQzC0EFISaRpmllFx5G1HMrINGyhItVz3M86hvN8i0AvnEKwo9MrorfDS4oQZQEuAhcxVsFYuHSkEbBUEzFjVJpoXcJEKCwOD4BSJrBl7NrYuyABaBwQU26h53UBwHC0aEVkhGxivdel6GYWpX0FNbtkhJQ03UZdevqYEpxhSwIShSoXBYjRzp4u4VrugcFRBXJTOobVbHVSE1xOyCNwvD1jWZeTcFBsMPzVCUzBWUydEGhwZS2z7ZWoQzbHFVMXFsLQgYwncBPLbHSI6qECnkI6SnSmctHqSHodh3R4cR2QZSZmyZMQtm1NWgddGysUVkUMUaNkZQQUcID6eV0Vch5qHIWlj0Iqc2AFtunHNLYrrVTSuEDC1+VdEykoYbh+N5A6SX126dDSqtG12fa7J7e+p34RKVR8hBLX5FVeEFzTNVKnqabXCAA */
    createMachine<Context, Event, StateTypes, ServiceMap>(
      {
        context: { webhookInfo: undefined, error: undefined },
        id: "webhookMachine",
        initial: "empty",
        states: {
          empty: {
            always: {
              target: "fetchingWebhook",
            },
          },
          idle: {
            entry: "clearError",
            on: {
              FETCH: {
                target: "fetchingWebhook",
              },
              SET: {
                target: "settingWebhook",
              },
              DELETE: {
                target: "deletingWebhook",
              },
            },
          },
          fetchingWebhook: {
            invoke: {
              src: "fetchWebhook",
              onDone: [
                {
                  target: "success",
                  actions: "assignWebhookInfo",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: "assignError",
                },
              ],
            },
          },
          settingWebhook: {
            invoke: {
              src: "setWebhook",
              onDone: [
                {
                  target: "fetchingWebhook",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: "assignError",
                },
              ],
            },
          },
          deletingWebhook: {
            invoke: {
              src: "deleteWebhook",
              onDone: [
                {
                  target: "fetchingWebhook",
                },
              ],
              onError: [
                {
                  target: "error",
                  actions: "assignError",
                },
              ],
            },
          },
          success: {
            after: {
              "1000": {
                target: "#webhookMachine.idle",
                actions: [],
                internal: false,
              },
            },
          },
          error: {
            after: {
              "1000": {
                target: "#webhookMachine.idle",
                actions: [],
                internal: false,
              },
            },
          },
        },
      },
      {
        actions: {
          assignWebhookInfo: () =>
            assign<Context, DoneInvokeEvent<WebhookInfo>>({ webhookInfo: (_, event) => event.data }),
          assignError: () => assign<Context, DoneInvokeEvent<any>>({ error: (_, event) => event.data }),
          clearError: assign({ error: (_) => undefined }),
        },
        services: {
          fetchWebhook: async () => api.getWebhookInfo(),
          setWebhook: async (_, event) =>
            event.type === "SET"
              ? api.setWebhook(event.url, {
                  drop_pending_updates: event.dropPendingUpdates,
                  secret_token: event.secretToken,
                })
              : undefined,
          deleteWebhook: async (_, event) =>
            event.type === "DELETE" ? api.deleteWebhook({ drop_pending_updates: event.dropPendingUpdates }) : undefined,
        },
      }
    );

  const { state, send } = useMachine(webhookStateMachine);

  const getWebhookInfo = () => send("FETCH");
  const setWebhook = (
    url: string,
    { dropPendingUpdates = false, secretToken }: { dropPendingUpdates?: boolean; secretToken?: string } = {}
  ) => send({ type: "SET", url, dropPendingUpdates, secretToken });
  const deleteWebhook = (dropPendingUpdates = false) => send({ type: "DELETE", dropPendingUpdates });

  return {
    state,
    getWebhookInfo,
    setWebhook,
    deleteWebhook,
  };
}
