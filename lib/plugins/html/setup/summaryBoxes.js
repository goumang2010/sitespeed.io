'use strict';

const h = require('../helpers');
const chunk = require('lodash.chunk');

function infoBox(stat, name, formatter, url) {
  if (typeof stat === 'undefined') {
    return undefined;
  }

  return _box(stat, name, 'info', formatter, url)
}

function scoreBox(stat, name, url) {
  if (typeof stat === 'undefined') {
    return undefined;
  }

  return _box(stat, name, h.scoreLabel(stat.median), h.noop, url)
}

function metricBox(stat, name, score, formatter, url) {
  if (typeof stat === 'undefined') {
    return undefined;
  }

  return _box(stat, name, h.scoreLabel(score.median), formatter, url)
}

function _box(stat, name, label, formatter, url) {
  const median = formatter ? formatter(stat.median) : stat.median;
  const p90 = formatter ? formatter(stat.p90) : stat.p90;

  return {
    name,
    label,
    median,
    p90,
    url
  }
}

module.exports = function(data) {
  if (!data) {
    return [];
  }

  const boxes = [];
  const coach = data.coach;
  const pagexray = data.pagexray;
  const browsertime = data.browsertime;
  const webpagetest = data.webpagetest;

  // coach
  if (coach) {
    const summary = coach.summary;

    boxes.push(
      scoreBox(summary.score, '总体分数', 'overallScore'),
      scoreBox(summary.performance.score, '性能分数', 'performanceScore'),
      scoreBox(summary.accessibility.score, '可用性分数', 'accessibilityScore'),
      scoreBox(summary.bestpractice.score, '最佳实践分数', 'bestPracticeScore'),
      scoreBox(summary.performance.fastRender, '快速渲染建议', 'fastRender'),
      scoreBox(summary.performance.avoidScalingImages, '避免缩放图片建议', 'avoidScalingImages'),
      scoreBox(summary.performance.compressAssets, '压缩静态资源建议', 'compressAssets'),
      scoreBox(summary.performance.optimalCssSize, '优化CSS大小建议', 'optimalCssSize'));
  }

  if (pagexray && coach) {
    const cSum = coach.summary;
    const pxSum = pagexray.summary;

    boxes.push(
      metricBox(pxSum.transferSize, '总计大小 (传输)',
        cSum.performance.pageSize, h.size.format, 'pageSize'),
      metricBox(pxSum.contentTypes.image.transferSize, '图像大小 (传输)',
        cSum.performance.imageSize, h.size.format, 'imageSize'),
      metricBox(pxSum.contentTypes.javascript.transferSize, 'Javascript大小 (传输)',
        cSum.performance.javascriptSize, h.size.format, 'javascriptSize'),
      metricBox(pxSum.contentTypes.css.transferSize, 'CSS大小(传输)', cSum.performance.cssSize, h.size.format, 'cssSize'));

  }

  // no matching rules
  if (pagexray) {
    const summary = pagexray.summary;

    boxes.push(
      infoBox(summary.requests, '总请求数'),
      infoBox(summary.contentTypes.image.requests, 'Image请求数'),
      infoBox(summary.contentTypes.css.requests, 'CSS请求数'),
      infoBox(summary.contentTypes.javascript.requests, 'Javascript请求数'),
      infoBox(summary.contentTypes.font.requests, 'Font请求数'),
      infoBox(summary.responseCodes['200'], '200 responses'),
      infoBox(summary.responseCodes['301'], '301 responses'),
      // TODO if we have more than ZERO it should be red
      infoBox(summary.responseCodes['404'], '404 responses'),
      infoBox(summary.domains, '每个页面域名数'),
      infoBox(summary.expireStats, '缓存时间(Cache time)', h.time.duration),
      infoBox(summary.lastModifiedStats, '最后修改距今', h.time.duration));

    if (summary.firstParty) {
      boxes.push(
        infoBox(summary.firstParty.requests, '1st party requests'),
        infoBox(summary.thirdParty.requests, '3rd party requests'),
        infoBox(summary.firstParty.transferSize, '1st party size', h.size.format),
        infoBox(summary.thirdParty.transferSize, '3rd party sizes', h.size.format));
    }
  }

  if (browsertime) {
    const summary = browsertime.summary;

    boxes.push(
      infoBox(summary.rumSpeedIndex, 'RUM速度指数', h.noop, 'rumSpeedIndex'),
      infoBox(summary.firstPaint, '首次绘制', h.time.ms, 'firstPaint'),
      infoBox(summary.timings.backEndTime, '后端用时', h.time.ms, 'backEndTime'),
      infoBox(summary.timings.frontEndTime, '前端用时', h.time.ms, 'frontEndTime'),
      infoBox(summary.timings.fullyLoaded, '完整加载时间', h.time.ms, 'fullyLoaded'));

    if (summary.visualMetrics) {
      boxes.push(
        infoBox(summary.visualMetrics.FirstVisualChange, '首次可见变化', h.time.duration),
        infoBox(summary.visualMetrics.SpeedIndex, '速度指数'),
        infoBox(summary.visualMetrics.LastVisualChange, '最后一次可见变化', h.time.duration));
    }
  }

  if (webpagetest) {
    const summary = webpagetest.summary;

    boxes.push(
      infoBox(summary.firstView.render, 'WPT渲染 (首个视图)'),
      infoBox(summary.firstView.SpeedIndex, 'WPT速度指数 (首个视图)', h.noop, 'speedIndex'),
      infoBox(summary.firstView.fullyLoaded, 'WPT完整加载 (首个视图)'));
  }

  return chunk(boxes.filter(Boolean), 3);
};
