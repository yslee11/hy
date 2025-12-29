import { Demographics, SurveyResponse } from '../types';
import { GOOGLE_SCRIPT_URL } from '../constants';

interface AllocationResponse {
  groupId: number;
}

/**
 * Request a group assignment from the server based on demographics (Stratified Sampling).
 */
export const fetchGroupAssignment = async (demographics: Demographics): Promise<number> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL is not set. Using random group assignment.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return Math.floor(Math.random() * 50) + 1;
  }

  try {
    // We use a GET request for allocation to avoid CORS complexity with simple text responses,
    // or POST if the GAS is set up to handle it. 
    // Usually, JSONP or POST with 'no-cors' is used, but 'no-cors' makes reading response impossible.
    // Recommended: GAS Web App deployed as "Me", Access: "Anyone".
    // We will send a POST request expecting a JSON response.
    
    const params = new URLSearchParams({
      action: 'assignGroup',
      gender: demographics.gender,
      age: demographics.age,
      job: demographics.job
    });

    const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: "GET", // GET is easier for GAS to return data without CORS preflight issues sometimes
    });

    if (!response.ok) throw new Error("Network response was not ok");
    
    const data: AllocationResponse = await response.json();
    return data.groupId;

  } catch (error) {
    console.error("Failed to fetch group assignment:", error);
    // Fallback to random if server fails
    return Math.floor(Math.random() * 50) + 1;
  }
};

/**
 * Submit final survey results to Google Sheets.
 */
export const submitSurveyResults = async (
  demographics: Demographics, 
  responses: SurveyResponse[],
  groupId: number
): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.log("Mock Submit:", { demographics, groupId, responses });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  try {
    // Structure data for the backend
    // The backend expects a JSON payload
    const payload = JSON.stringify({
      action: 'submit',
      demographics,
      groupId,
      responses,
      timestamp: new Date().toISOString()
    });

    // Using POST with text/plain to avoid CORS options preflight triggers in some GAS setups
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) throw new Error("Submission failed");
    
    return true;
  } catch (error) {
    console.error("Error submitting survey:", error);
    alert("데이터 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    return false;
  }
};