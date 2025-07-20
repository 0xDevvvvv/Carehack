import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key from the .env file
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

/**
 * Gets a helpful response from Gemini based on the game state.
 * @param {object} levelData - The data for the current level.
 * @param {Array} placedObjects - The objects the player has already placed.
 * @param {object} lastMove - The most recent object the player placed.
 * @returns {Promise<string>} - A helpful, encouraging message from the AI.
 */
export async function getGeminiResponse(levelData, placedObjects, lastMove) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // This prompt tells the AI its role and gives it the game context.
  const prompt = `
    You are Lumi, a friendly and encouraging game assistant for "Journey of Light."
    Your goal is to help the player solve the puzzle by giving short, gentle hints.
    NEVER give the exact answer. Keep your response to one or two sentences.

    Game Context:
    The player needs to place blocks to fill the gaps in a path.
    - The level's solution (the correct positions for the blocks): ${JSON.stringify(
      levelData.solution
    )}
    - The blocks the player has placed so far: ${JSON.stringify(
      placedObjects.map((p) => p.position)
    )}
    - The player's last move (the block they just placed): ${JSON.stringify(
      lastMove.position
    )}

    Analyze the player's last move.
    - If it's a correct placement, celebrate it! (e.g., "Great job! That's a perfect spot!")
    - If it's close to a correct spot, gently guide them. (e.g., "That's close! Maybe try one spot to the left?")
    - If it's not close, give a general, encouraging hint about the goal. (e.g., "A good start! Remember, we're trying to bridge the gap between the paths.")
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm having a little trouble thinking right now. Please try again!";
  }
}
