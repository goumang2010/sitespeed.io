# gome-sitespeed.io


ԭ��Ŀ�μ���

[Website](https://www.sitespeed.io) | [Documentation](https://www.sitespeed.io/documentation/) | [Twitter](https://twitter.com/SiteSpeedio)

�ð汾����sitespeed.io�Ŀ����汾(v4.x)��sitespeed.io�Ŀ����汾������yslow������coach������Ҫjava�����������ǰ�ô����ٶȸ��졣

### Դ�����
#### ����ļ�./bin/sitespeed.js
ͨ��../lib/support/cli.js���������д��ݵĲ�����cli.jsʹ��yargs�Բ�������������options��options����../lib/support/pluginLoader.js��parsePluginNames�����������õ�����ʹ�õĲ�����ƣ����ʹ��../lib/sitespeed.js�ķ��������������ƺ�cli��options���������
#### ./lib/sitespeed.js
����run(pluginNames, options){},�÷������Ƚ�����ش洢Ŀ¼��Ȼ�����./support/pluginLoader.js�е�loadPlugins�������÷�����������������require����������ģ����󣬵���runOptionalFunction������ִ�и���ģ�鶨���open��postOpen(�������)���ٴ���./support/queueHandler.js������ģ����ж��й�������ģ���processMessage���������ִ�������close������
#### ./support/queueHandler.js
����QueueHandler�࣬���๹��������pluginsģ��������û�����Ĳ���options��������createQueues����ִ�ж��С�run��������url-source.js�����Ķ��󣬲�ִ��findUrls�������÷�����ִ��queueHandler.js�е�postMessage���������������{type='url',...},��ص��¶���ÿ������Ĳ�����Ϊ'url'����֮���startProcessingQueuesʱ�����˴�����plugin.processMessage(message, this)�󣬻�ִ�������processMessage({type:'url,...}',this)�������в����ִ����Ϻ���һ�ε���processMessage����ᴫ��{type:'summarize',...}���н�������
#### ���
./lib/support/pluginLoader.js�����Ĭ�ϲ��Ϊ'browsertime', 'coach', 'domains', 'assets', 'html', 'analysisStorer','screenshot'����Щ�����queueHandler.js�еĶ��п��ƣ���˳����ص��á�
##### browsertime
�ڵ���processMessage({type:'url,...}',this)ʱ������ͨ��analyzer.js��analyzeUrl������url���з������÷�����ִ�����壬����ͬʱ����browsertime��coachģ�飬�õ������ͨ�����е�postMessage�������ò��processMessage��type��������жϺ���'browsertime.run'��'browsertime.pageSummary'��'browsertime.har'��'browsertime.screenshot'�Ĳ������Ӧ��������Щ�������html������У����ѽ�������html��ע��browsertime.har���ᴥ��domains��coach��Ӧ��processMessage������
##### coach
browsertimeĬ�ϻ�ͨ�����е�processCoachOutput����typeΪcoach.run��processMessage�������÷�������html�����coach.pageSummary��