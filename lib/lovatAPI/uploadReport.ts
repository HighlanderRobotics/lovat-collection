import { ScoutReport } from "../collection/ScoutReport";
import { post } from "./lovatAPI";


export const uploadReport = async (report: ScoutReport) => {
  const response = await post("/manager/scoutreports", report);

  if (!response.ok) {
    console.log(JSON.stringify(report), await response.text(), response.status);
    throw new Error("Error uploading report");
  }
};
