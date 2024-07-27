import { Avatar, Chat } from '@douyinfe/semi-ui';
import type { ReactElement, ReactNode } from 'react';
import { merge } from 'moderndash';

const AvatarColors = ['amber', 'blue', 'cyan', 'green', 'grey', 'indigo', 'light-blue', 'light-green', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'violet', 'yellow'] as const;

interface RoleInfo {
  name: string;
  myAvatar: ReactNode;
  isUser?: boolean;
}

function parseDialog(dialog: ReactElement[]) {
  const roles = new Set<string>();
  const rawMessages = [];

  for (const line of dialog) {
    const children = line.props.children as string;
    if (!children.trim()) {
      continue;
    }
    const [role, message] = children.split(/[:：]/, 2);
    roles.add(role.trim());
    rawMessages.push([role.trim(), message.trim()]);
  }

  const defaultRoleInfos = Object.fromEntries(
    Array.from(roles).map((role, index) => {
      const name = role.slice(0, 2);
      const color = AvatarColors[index % AvatarColors.length];
      const avatar = (<Avatar flex="shrink-0" color={color} size="small">{name}</Avatar>);
      return [role, { name: role, myAvatar: avatar }];
    }),
  );

  const messages = rawMessages.map(([role, message], index) => {
    return {
      role,
      id: index.toString(),
      content: message,
    };
  });

  return { messages, defaultRoleInfos };
}

// noinspection JSUnusedGlobalSymbols
export function Galileo({ children, roleInfos }: { children: ReactElement[]; roleInfos?: Record<string, Partial<RoleInfo>> }) {
  const { messages, defaultRoleInfos } = parseDialog(children);
  roleInfos = merge(defaultRoleInfos, roleInfos);

  const [user, userInfo] = Object.entries(roleInfos).find(([,role]) => role.isUser);
  if (user) {
    delete roleInfos[user];
    roleInfos.user = userInfo;
    messages.forEach((message) => {
      if (message.role === user) {
        message.role = 'user';
      }
    });
  }

  return (
    // 取消拖拽事件（文件上传）的向下传递
    <div onDragOverCapture={e => e.stopPropagation()}>
      <Chat
        className="mx-auto"
        align="leftRight"
        chats={messages}
        roleConfig={roleInfos}
        renderInputArea={() => null} // 隐藏输入框
        chatBoxRenderConfig={{
          renderChatBoxAvatar: ({ role }) => role.myAvatar,
          renderChatBoxAction: () => null, // 隐藏操作区
        }}
      />
    </div>
  );
}
