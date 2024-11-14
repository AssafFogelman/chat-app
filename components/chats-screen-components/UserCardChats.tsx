import { Pressable, I18nManager, View } from "react-native";
import { Avatar, Badge, Card, Text } from "react-native-paper";
import { ChatType, MessageType } from "../../types/types";
import formatDate from "../../utils/dateUtils";

export const UserCard = ({
  chat,
  onAvatarPress,
}: {
  chat: ChatType;
  onAvatarPress: (user: ChatType) => void;
}) => {
  const LeftContent = () => (
    <Pressable onPress={() => onAvatarPress(chat)}>
      <Avatar.Image
        size={40}
        source={{
          uri:
            process.env.EXPO_PUBLIC_SERVER_ADDRESS + chat.otherUser.smallAvatar,
        }}
      />
    </Pressable>
  );

  const RightContent = () => (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-end",
        marginEnd: 10,
        paddingTop: 5,
        paddingBottom: 10,
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: chat.unread ? "#25D366" : "#545454" }}>
        {formatDate(chat.messages[0].date)}
      </Text>
      {/* this difference between an unread chat and unread messages makes it 
      possible to mark a chat as unread even though all messages are read */}
      {chat.unread && (
        <Badge
          size={25}
          style={[
            {
              backgroundColor: "#25D366",
              borderWidth: 1,
              borderColor: "whitesmoke",
            },
            I18nManager.isRTL ? { left: 2 } : { right: 2 },
          ]}
        >
          {unreadCount(chat.messages) || ""}
        </Badge>
      )}
    </View>
  );

  return (
    <Card
      style={{
        margin: 5,
      }}
    >
      <Card.Title
        titleStyle={chat.unread ? { fontWeight: "bold" } : undefined}
        subtitleStyle={{ color: "#545454" }}
        title={chat.otherUser.nickname}
        subtitle={
          !chat.messages[0]
            ? ""
            : chat.messages[0].messageType === "image"
              ? "📷"
              : chat.messages[0].text
        }
        left={LeftContent}
        right={RightContent}
      />
    </Card>
  );
};

function unreadCount(messages: MessageType[]) {
  const unreadMessageCount = messages.filter(
    (message) => message.unread === true
  ).length;
  if (unreadMessageCount > 0) {
    return unreadMessageCount;
  }
  return null;
}
