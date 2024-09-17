const fs = require("fs").promises;

(async function main() {
  let comments = await fetchComments();

  comments = sortCommentsByCreatedAt(comments);

  let commentTree = buildCommentTree(comments);

  console.log(commentTree);
})();

// fetch comments from local json file
async function fetchComments() {
  const data = await fs.readFile("comments.json", "utf-8");
  return JSON.parse(data);
}

// build comment tree from flat comments array
function buildCommentTree(comments) {
  const commentMap = new Map(comments.map((comment) => [comment.id, comment]));

  const rootComments = [];

  comments.forEach((comment) => {
    if (!comment.parentId) {
      rootComments.push(comment);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(comment);
    }
  });

  return rootComments;
}

// sort comments by createdAt
function sortCommentsByCreatedAt(comments) {
  comments.sort((a, b) => a.createdAt - b.createdAt);
  if (comments.children) {
    comments.children.forEach((child) => sortCommentsByCreatedAt(child));
  }

  return comments;
}
