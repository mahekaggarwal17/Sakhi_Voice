import { processUserVoiceInput } from "../lib/agent/agentEngine";
import { INITIAL_BUSINESS_MEMORY, BusinessMemoryState } from "../lib/agent/conversationState";

function runTestFlow() {
  console.log("==================================================");
  console.log("TESTING SAKHI CONTINUOUS CONVERSATIONAL AGENT");
  console.log("==================================================");

  let state: BusinessMemoryState = JSON.parse(JSON.stringify(INITIAL_BUSINESS_MEMORY));

  const turns = [
    { input: "Mere paas handmade baskets hain.", expectedProduct: "Handmade Basket" },
    { input: "100.", expectedQuantity: 100 },
    { input: "Haan.", expectedIntent: "bulk" },
    { input: "Greater Noida.", expectedLocation: "Greater Noida" },
    { input: "Iska market rate kya hai?", expectTool: "getMarketPrice" },
    { input: "Actually quantity 150 hai.", expectedQuantity: 150 },
    { input: "Buyer dhoondo.", expectTool: "findBuyers" },
    { input: "Buyer se baat karwa do.", expectTrigger: "START_BUYER_CALL" },
    { input: "Mujhe business expand karne ke liye support bhi chahiye.", expectTool: "findSupportOptions" },
    { input: "Person se baat karwa do.", expectTool: "createSupportCase" },
  ];

  for (let i = 0; i < turns.length; i++) {
    const { input, expectedProduct, expectedQuantity, expectedIntent, expectedLocation, expectTool, expectTrigger } = turns[i];
    console.log(`\n👉 TURN ${i + 1} | USER: "${input}"`);

    const result = processUserVoiceInput(input, state);
    state = result.updatedMemory;

    console.log(`🌸 SAKHI (Hinglish): "${result.spokenTextHindi}"`);
    console.log(`🌸 SAKHI (Devanagari): "${result.spokenTextDevanagari}"`);
    console.log(`📊 Phase: ${result.conversationPhase} | Last Question: ${state.lastQuestionAsked}`);
    console.log(`🧠 State -> Product: ${state.product} | Qty: ${state.quantity} | Intent: ${state.sellingIntent} | Loc: ${state.location}`);
    if (result.executedTool) {
      console.log(`🛠️ Tool Executed: ${result.executedTool.toolName}`);
    }
    if (result.actionTrigger) {
      console.log(`⚡ Action Trigger: ${result.actionTrigger}`);
    }

    if (expectedProduct && state.product !== expectedProduct) {
      console.error(`❌ FAILED: Product mismatch. Expected ${expectedProduct}, got ${state.product}`);
    }
    if (expectedQuantity && state.quantity !== expectedQuantity) {
      console.error(`❌ FAILED: Quantity mismatch. Expected ${expectedQuantity}, got ${state.quantity}`);
    }
    if (expectedIntent && state.sellingIntent !== expectedIntent) {
      console.error(`❌ FAILED: Intent mismatch. Expected ${expectedIntent}, got ${state.sellingIntent}`);
    }
    if (expectedLocation && state.location !== expectedLocation) {
      console.error(`❌ FAILED: Location mismatch. Expected ${expectedLocation}, got ${state.location}`);
    }
  }

  console.log("\n==================================================");
  console.log("FINAL CONVERSATION SUMMARY:");
  console.log(state.conversationSummary);
  console.log("==================================================");
}

runTestFlow();
