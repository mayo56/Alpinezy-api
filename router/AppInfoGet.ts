import express from "express";
const AIG = express();

import { AIGController } from "../controller/AIGController";
AIG.get('/badge/:id',AIGController.getBadges);

export default AIG;