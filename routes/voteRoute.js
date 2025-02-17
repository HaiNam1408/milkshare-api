const router = require("express").Router();
const voteController = require("../controllers/votequestion");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, voteController.getAllUpVote);
router.post("/voting", verifyToken, voteController.voting);
router.get("/:id", verifyToken, voteController.getVoteById);
router.put("/:id", verifyToken, voteController.updateVote);
router.delete("/:id", verifyToken, voteController.deleteVote);
module.exports = router;
