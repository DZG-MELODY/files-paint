/**
 * 文件节点处理器
 */
class FileNodeProcessor {
  constructor (options) {
    this.offset = options.offset || 2;
    this.split = options.split || '|_';
    this.splitLen = this.split.length;
  }
  createFileInfoLine (name, level) {
    const head = this.split.padStart(level * 2 + this.splitLen, ' ');
    return `${head}${name}`;
  }

  /**
   * 创建处理器设置
   * @param {String}  target 目标文件类型
   */
  static createProcessorOptions (target = 'txt') {
    switch (target) {
      case 'txt':
        return {
          offset: 2,
          split: '|_'
        };
      case 'md':
        return {
          offset: '2',
          split: '- '
        };
      default:
        return {
          offset: 2,
          split: '|_'
        };
    }
  }
}

module.exports = FileNodeProcessor;
