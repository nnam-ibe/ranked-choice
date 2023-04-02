export const VotingSystem = {
  IRV: 'IRV',
  FPP: 'FPP',
} as const;

export const VotingSystems = [VotingSystem.IRV, VotingSystem.FPP] as const;

export const choiceMaxLength = 32;
export const choicesMinLength = 2;
export const choicesMaxLength = 20;

export const pollTitleMaxLength = 64;
export const pollDescriptionMaxLength = 128;
