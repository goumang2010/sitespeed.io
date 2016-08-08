'use strict';
const h = require('../helpers');

function row(stat, name, metricName, formatter) {
  if (typeof stat === 'undefined') {
    return undefined;
  }

  return {
    name,
    metricName,
    node: stat,
    h: formatter ? formatter : h.noop
  }
}

module.exports = function(data) {
  if (!data) {
    return [];
  }

  const rows = [];

  const coach = data.coach;
  const pagexray = data.pagexray;
  const browsertime = data.browsertime;
  const webpagetest = data.webpagetest;

  if (coach) {
    const summary = coach.summary;

    rows.push(
      row(summary.score, 'Coach分数', 'overallScore'),
      row(summary.performance.score, 'Coach性能分数', 'performanceScore'),
      row(summary.accessibility.score, '可用性分数', 'accessibilityScore'),
      row(summary.bestpractice.score, '最佳实践分数', 'bestPracticeScore')
    );
  }

  if (pagexray) {
    const summary = pagexray.summary;
    const contentTypes = summary.contentTypes;

    rows.push(
      row(contentTypes.image.requests, 'Image请求'),
      row(contentTypes.css.requests, 'CSS请求'),
      row(contentTypes.javascript.requests, 'Javascript请求'),
      row(contentTypes.font.requests, 'Font请求'),
      row(summary.requests, '总请求')
    );

    rows.push(
      row(contentTypes.image.transferSize, 'Image大小', undefined, h.size.format),
      row(contentTypes.html.transferSize, 'HTML大小', undefined, h.size.format),
      row(contentTypes.css.transferSize, 'CSS大小',undefined, h.size.format),
      row(contentTypes.javascript.transferSize, 'Javascript大小', undefined,  h.size.format),
      row(contentTypes.font.transferSize, 'Font大小', undefined, h.size.format),
      row(summary.transferSize, '总和', undefined, h.size.format));

    const responseCodes = Object.keys(summary.responseCodes);
    for (let code of responseCodes) {
      rows.push(row(summary.responseCodes[code], code + ' responses'))
    }
  }

  if (browsertime) {
    const summary = browsertime.summary;

    rows.push(
      row(summary.rumSpeedIndex, 'RUM速度指数', 'rumSpeedIndex'),
      row(summary.firstPaint, '首次绘制', 'firstPaint'),
      row(summary.fullyLoaded, '完整加载', 'fullyLoaded'));

    const timings = Object.keys(summary.timings);
    for (let timing of timings) {
      rows.push(row(summary.timings[timing], timing, timing))
    }
  }

  if (webpagetest) {
    const summary = webpagetest.summary;
    rows.push(
      row(summary.firstView.render, 'WPT 渲染 (firstView)', 'render'),
      row(summary.firstView.SpeedIndex, 'WPT 速度指数 (firstView)', 'SpeedIndex'),
      row(summary.firstView.fullyLoaded, 'WPT 完整加载 (firstView)', 'fullyLoaded'));
  }

  return rows.filter(Boolean);
};
