import { disasterKnowledge } from "../data/disasterKnowledge";

export function detectIntent(userInput) {
  const input = userInput.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const item of disasterKnowledge) {
    let score = 0;

    for (const keyword of item.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    return bestMatch.answer;
  }

  return "I could not find an exact answer offline. Stay calm, move to a safe location, prepare emergency supplies, and contact local responders if possible.";
}