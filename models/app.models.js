const db = require("../db/connection");

exports.selectCategories = () => {
  let categorySQLStr = `
      SELECT * FROM categories
    ;`;
  return db.query(categorySQLStr).then((categories) => categories.rows);
};

exports.selectReviews = () => {
  let reviewSQLStr = `
    SELECT
      reviews.*,
      CAST( 
        COUNT(comments.comment_id)
        AS int)
        AS comment_count
    FROM reviews
    LEFT JOIN comments
      ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC
  ;`;
  return db.query(reviewSQLStr).then((reviews) => reviews.rows);
};

exports.selectReviewById = (id) => {
  let reviewSQLStr = `
    SELECT * FROM reviews
    WHERE review_id = $1
  ;`;
  return db.query(reviewSQLStr, [id]).then((reviews) => {
    if (reviews.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return reviews.rows[0];
  });
};
