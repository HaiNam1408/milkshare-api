const { notFound, errorHandler } = require("../middlewares/errorHandler");
const userRouter = require("../routes/userRoute");
const questionRoute = require("../routes/questionRoute");
const voteRoute = require("../routes/voteRoute");
const postRoute = require("../routes/postRoute");
const mediaRoute = require("./postmediaRoute");
const favoriteRoute = require("./favoritePostRoute");
const commentRoute = require("./commentRoute");
const messageRoute = require("./messageRoute");
const conversationRoute = require("./convesationRoute");
const attachmentRoute = require("./attachmentRoute");
const notificationRoute = require("./notificationRoute");
const eventRoute = require("./eventRoute");
const ratingRoute = require("./ratingRoute");
const statusRoute = require("./statusRoute");
const addressRoute = require("./addressRoute");
const favoriteStatusRoute = require("./favoriteStatusRoute");
const acceptStatusRoute = require("./acceptStatusRoute");

const initRoute = (app) => {
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/questions", questionRoute);
  app.use("/api/v1/votes", voteRoute);
  app.use("/api/v1/posts", postRoute);
  app.use("/api/v1/mediaes", mediaRoute);
  app.use("/api/v1/favoriteposts", favoriteRoute);
  app.use("/api/v1/comments", commentRoute);
  app.use("/api/v1/conversations", conversationRoute);
  app.use("/api/v1/messages", messageRoute);
  app.use("/api/v1/attachments", attachmentRoute);
  app.use("/api/v1/notifications", notificationRoute);
  app.use("/api/v1/events", eventRoute);
  app.use("/api/v1/ratings", ratingRoute);
  app.use("/api/v1/statuses", statusRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/favoritestatus", favoriteStatusRoute);
  app.use("/api/v1/acceptstatus", acceptStatusRoute);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoute;
