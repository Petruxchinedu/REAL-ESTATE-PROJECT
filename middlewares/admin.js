// middlewares/admin.js
const verifyAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
};

module.exports = verifyAdmin; // ✅ just a single default function
