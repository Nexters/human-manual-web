export const questionAsset = (questionId: string, name: string): string => {
  return `/assets/question/${questionId}/${name}.png`;
};

export const characterAsset = (value: string): string => {
  return `/assets/character/${value}.png`;
};
