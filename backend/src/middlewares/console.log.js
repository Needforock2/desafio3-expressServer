export default function consolelog(req, res, next) {
  console.log(req.user)
  return next();
}
