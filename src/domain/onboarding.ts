export type Onboarding = { slide: number; completed: boolean };
export type OnboardingAction = { type: 'next' | 'tick'; now: number };
export const initialOnboarding: Onboarding = { slide: 0, completed: false };
/** No clock, timer or implicit transition. Only an explicit next advances. */
export function onboardingReducer(state: Onboarding, action: OnboardingAction): Onboarding {
  if (action.type !== 'next' || state.completed) return state;
  return state.slide < 2 ? { slide: state.slide + 1, completed: false } : { ...state, completed: true };
}
