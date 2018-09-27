/**
 * 遍历文件
 * @param {String} dir  遍历文件夹
 * @param {Function} predicate 递归预判函数
 * @param {Function} nodeHandle 节点处理函数
 */
function traverseFiles (dir, predicate, nodeHandle) {
  return new Promise((resolve, reject) => {
  // 映射表附带参数
    const fileList = [];

    // 判定方法必须为方法
    if (!(predicate && typeof predicate === 'function')) {
      reject(new Error('predicate is not a function'));
    }

    // 节点处理必须为方法
    if (!(nodeHandle && typeof nodeHandle === 'function')) {
      reject(new Error('nodeHandle is not a function'));
    }

    // 递归遍历所有节点
    function traverse (node, path = []) {
      if (!node) return;

      nodeHandle(node, path, fileList);

      // 当前节点如果有子节点，则先将该节点推入到path路径中，遍历完成后再吐出
      const { done, iterators } = predicate(node);
      if (!done) {
        path.push(node);
        // 子节点进行递归
        iterators.forEach((subNode) => {
          traverse(subNode, path);
        });
        path.pop(node);
      } else {
      // 如果没有子节点则传入false
        traverse(false);
      }
    }
    // 遍历传入的文件夹
    traverse(dir);
    resolve(fileList);
  });
}

module.exports = traverseFiles;
