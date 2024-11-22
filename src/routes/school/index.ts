import express from "express";
import SchoolController from "../../controller/school";

const schoolRouter = express.Router();
schoolRouter.post("/addSchool", SchoolController.addSchool);
schoolRouter.get("/listSchool", SchoolController.listSchools);
schoolRouter.get("/getSchool", SchoolController.getSchools);
schoolRouter.put("/updateSchool/:id", SchoolController.updateSchool);
schoolRouter.delete("/deleteSchool/:id", SchoolController.deleteSchool);

export default schoolRouter;
