/**
 * All color cards available in the application.
 */
export enum ColorCards {
  Blue = 'blue',
  Indigo = 'indigo',
  Purple = 'purple',
  Pink = 'pink',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Green = 'green',
  Teal = 'teal',
  Cyan = 'cyan',
}

export type ColorCardsType =
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'cyan';

/**
 * All values of the ColorCards enum.
 */
export const colorCards = Object.values(ColorCards);

/**
 * Get a random color card.
 * @returns A random color card.
 */
export const randomColorCard = (): ColorCardsType => {
  const randomIndex = Math.floor(Math.random() * colorCards.length);
  return colorCards[randomIndex];
};
