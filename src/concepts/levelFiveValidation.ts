export type AssignmentItem = {
  id: string;
  correctCategoryId: string;
};

export type SystemSlot = {
  id: string;
  correctComponentId: string;
};

export type RequestSimulationState = {
  method: string;
  path: string;
  phaseIndex: number;
  sent: boolean;
};

export function validateAssignments(
  items: AssignmentItem[],
  assignments: Record<string, string>,
) {
  return items.every(
    (item) => assignments[item.id] === item.correctCategoryId,
  );
}

export function validateOrder(correctOrder: string[], currentOrder: string[]) {
  return (
    correctOrder.length === currentOrder.length &&
    correctOrder.every((id, index) => currentOrder[index] === id)
  );
}

export function canSendRequest(
  expectedMethod: string,
  expectedPath: string,
  state: RequestSimulationState,
) {
  return state.method === expectedMethod && state.path === expectedPath;
}

export function sendRequest(
  expectedMethod: string,
  expectedPath: string,
  state: RequestSimulationState,
): RequestSimulationState {
  if (!canSendRequest(expectedMethod, expectedPath, state)) {
    return { ...state, sent: false, phaseIndex: 0 };
  }

  return { ...state, sent: true, phaseIndex: 0 };
}

export function advanceRequest(
  state: RequestSimulationState,
  phaseCount: number,
): RequestSimulationState {
  if (!state.sent || phaseCount < 1) {
    return state;
  }

  return {
    ...state,
    phaseIndex: Math.min(state.phaseIndex + 1, phaseCount - 1),
  };
}

export function isRequestComplete(
  state: RequestSimulationState,
  phaseCount: number,
) {
  return state.sent && phaseCount > 0 && state.phaseIndex === phaseCount - 1;
}

export function parseJsonSafely(source: string):
  | { ok: true; value: unknown }
  | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(source) };
  } catch {
    return {
      ok: false,
      message: "This text is not valid JSON yet. Check quotes, commas, and brackets.",
    };
  }
}

export function validateJsonAnswers(
  questions: Array<{ id: string; correctOption: string }>,
  answers: Record<string, string>,
) {
  return questions.every(
    (question) => answers[question.id] === question.correctOption,
  );
}

export function validateChoice(
  selectedId: string,
  correctChoiceId: string,
) {
  return selectedId === correctChoiceId;
}

export function validateSystemBuilder(
  slots: SystemSlot[],
  assignments: Record<string, string>,
) {
  return slots.every(
    (slot) => assignments[slot.id] === slot.correctComponentId,
  );
}
