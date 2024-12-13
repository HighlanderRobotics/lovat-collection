import { ScoutReport } from "../collection/ScoutReport";
import { post } from "./lovatAPI";

export const uploadReport = async (report: ScoutReport) => {
  console.log("Uploading report", report);

  const response = await post("/v1/manager/scoutreports", report);

  console.log("Response", response);

  if (!response.ok) {
    let error;

    try {
      const json = await response.json();
      error = new Error(json.displayError ?? "Error uploading report");
    } catch (e) {
      error = new Error("Error uploading report");
    }

    throw error;
  }
};
