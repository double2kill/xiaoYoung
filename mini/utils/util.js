import dayjs from 'dayjs';

const formatTime = (date, template) => dayjs(date).format(template);

/**
 * 格式化时间为友好的中文格式
 * @param {string|Date} date 时间
 * @param {string} type 格式类型: 'date' | 'datetime' | 'relative'
 * @returns {string} 格式化后的时间字符串
 */
const formatTimeChinese = (date, type = 'date') => {
  if (!date) return '';
  
  const now = dayjs();
  const target = dayjs(date);
  
  if (type === 'relative') {
    // 相对时间：刚刚、几分钟前、几小时前等
    const diff = now.diff(target, 'minute');
    if (diff < 1) return '刚刚';
    if (diff < 60) return `${diff}分钟前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
    if (diff < 10080) return `${Math.floor(diff / 1440)}天前`;
    return target.format('YYYY-MM-DD');
  }
  
  if (type === 'datetime') {
    return target.format('YYYY年MM月DD日 HH:mm');
  }
  
  // 默认date格式
  return target.format('YYYY年MM月DD日');
};

/**
 * 格式化价格数额为字符串
 * 可对小数部分进行填充，默认不填充
 * @param price 价格数额，以分为单位!
 * @param fill 是否填充小数部分 0-不填充 1-填充第一位小数 2-填充两位小数
 */
function priceFormat(price, fill = 0) {
  if (isNaN(price) || price === null || price === Infinity) {
    return price;
  }

  let priceFormatValue = Math.round(parseFloat(`${price}`) * 10 ** 8) / 10 ** 8; // 恢复精度丢失
  priceFormatValue = `${Math.ceil(priceFormatValue) / 100}`; // 向上取整，单位转换为元，转换为字符串
  if (fill > 0) {
    // 补充小数位数
    if (priceFormatValue.indexOf('.') === -1) {
      priceFormatValue = `${priceFormatValue}.`;
    }
    const n = fill - priceFormatValue.split('.')[1]?.length;
    for (let i = 0; i < n; i++) {
      priceFormatValue = `${priceFormatValue}0`;
    }
  }
  return priceFormatValue;
}

/**
 * 获取cdn裁剪后链接
 *
 * @param {string} url 基础链接
 * @param {number} width 宽度，单位px
 * @param {number} [height] 可选，高度，不填时与width同值
 */
const cosThumb = (url, width, height = width) => {
  if (url.indexOf('?') > -1) {
    return url;
  }

  if (url.indexOf('http://') === 0) {
    url = url.replace('http://', 'https://');
  }

  return `${url}?imageMogr2/thumbnail/${~~width}x${~~height}`;
};

const get = (source, paths, defaultValue) => {
  if (typeof paths === 'string') {
    paths = paths
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .filter(Boolean);
  }
  const { length } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
};
let systemWidth = 0;
/** 获取系统宽度，为了减少启动消耗所以在函数里边做初始化 */
export const loadSystemWidth = () => {
  if (systemWidth) {
    return systemWidth;
  }

  try {
    ({ screenWidth: systemWidth, pixelRatio } = wx.getSystemInfoSync());
  } catch (e) {
    systemWidth = 0;
  }
  return systemWidth;
};

/**
 * 转换rpx为px
 *
 * @description
 * 什么时候用？
 * - 布局(width: 172rpx)已经写好, 某些组件只接受px作为style或者prop指定
 *
 */
const rpx2px = (rpx, round = false) => {
  loadSystemWidth();

  // px / systemWidth = rpx / 750
  const result = (rpx * systemWidth) / 750;

  if (round) {
    return Math.floor(result);
  }

  return result;
};

/**
 * 手机号码*加密函数
 * @param {string} phone 电话号
 * @returns
 */
const phoneEncryption = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 内置手机号正则字符串
const innerPhoneReg =
  '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';

/**
 * 手机号正则校验
 * @param phone 手机号
 * @param phoneReg 正则字符串
 * @returns true - 校验通过 false - 校验失败
 */
const phoneRegCheck = (phone) => {
  const phoneRegExp = new RegExp(innerPhoneReg);
  return phoneRegExp.test(phone);
};

module.exports = {
  formatTime,
  formatTimeChinese,
  priceFormat,
  cosThumb,
  get,
  rpx2px,
  phoneEncryption,
  phoneRegCheck,
};
