export const naiveUiFormsConfig = (state: { errors: unknown[] }) =>
  ({
    props: {
      validationStatus: state.errors[0] ? 'error' : undefined,
      feedback: state.errors[0],
    },
  }) as {
    props: {
      validationStatus: 'error' | 'warning' | 'success' | undefined;
      feedback: string | undefined;
    };
  };
