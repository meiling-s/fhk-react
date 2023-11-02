import { v4 as uuidv4 } from 'uuid';

export const generateNumericId = (): number => {
  const randomId: string = uuidv4();
  const numericId: string = randomId.replace(/\D/g, ''); // Remove non-numeric characters
  const parsedId: number = parseInt(numericId, 10); // Parse the numeric ID as a number
  const roundedId: number = Math.round(parsedId % 1e6); // Round to 8 digits
  return roundedId;
};