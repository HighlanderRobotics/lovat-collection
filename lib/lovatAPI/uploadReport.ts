import { ScoutReport } from "../collection/ScoutReport";
import { post } from "./lovatAPI";


export const uploadReport = async (report: ScoutReport) => {
  console.log("Uploading report", report);

  const response = await post("/manager/scoutreports", report);

  console.log("Response", response);

  if (!response.ok) {
    console.log(JSON.stringify(report), await response.text(), response.status);
    throw new Error("Error uploading report");
  }
};
