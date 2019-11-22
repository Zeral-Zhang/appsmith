import {
  ReduxActionTypes,
  ReduxAction,
  InitializeEditorPayload,
} from "constants/ReduxActionConstants";

export const initEditor = (
  applicationId: string,
): ReduxAction<InitializeEditorPayload> => ({
  type: ReduxActionTypes.INITIALIZE_EDITOR,
  payload: {
    applicationId,
  },
});
