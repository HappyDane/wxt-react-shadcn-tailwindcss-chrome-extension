export enum MessageType {
  clickExtIcon = "clickExtIcon",
  changeTheme = "changeTheme",
  changeLocale = "changeLocale",
}

export enum MessageFrom {
  contentScript = "contentScript",
  background = "background",
  sidePanel = "sidePanel",
}

export interface ExtMessage {
  messageType: MessageType;
  from?: MessageFrom;
  content?: string;
}
