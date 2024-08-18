import { Collapse } from 'tdesign-react';

export const { Panel } = Collapse;

export function WrapperTest() {
  return (
    <>
      <Collapse defaultValue={['default']}>
        <Panel header="这是一个折叠标题">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
        <Panel header="设置默认展开项" value="default">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
        <Panel destroyOnCollapse header="当前折叠面板折叠时，销毁面板内容">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
        <Panel header="嵌套使用折叠面板">
          <Collapse defaultExpandAll>
            <Panel header="这是一个折叠标题">
              这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
            </Panel>
            <Panel header="这是一个折叠标题">
              这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
            </Panel>
          </Collapse>
        </Panel>
      </Collapse>
    </>
  );
}
