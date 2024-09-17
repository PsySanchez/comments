const fs = require("fs").promises;

(async function main() {
  let comments = await fetchComments();

  comments = sortCommentsByCreatedAt(comments);
  // Построить дерево комментариев
  let commentTree = buildCommentTree(comments);

  console.log(commentTree);
})();

async function fetchComments() {
  const data = await fs.readFile("comments.json", "utf-8");
  return JSON.parse(data);
}

function buildCommentTree(comments) {
  const commentMap = new Map();
  const rootComments = [];

  // Создаем карту для быстрого доступа к комментариям по ID
  comments.forEach((comment) => commentMap.set(comment.id, comment));

  // Проходим по всем комментариям и добавляем их в дерево
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

function sortCommentsByCreatedAt(comments) {
  comments.sort((a, b) => a.created_at - b.created_at);
  if (comments.children) {
    comments.children.forEach((child) => sortCommentsByCreatedAt(child));
  }

  return comments;
}
