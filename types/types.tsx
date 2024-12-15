import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

//************************** navigation types **************************

//change this if you want to add "initialParams" to certain screens:
export type StackParamList = {
  Welcome: undefined; //there are no params that are sent to this screen
  PhoneVerification: { userCountry: string | null }; //we are sending data to this screen
  Login: undefined; //there are no params that are sent to this screen
  Register: undefined; //there are no params that are sent to this screen
  Tabs: NavigatorScreenParams<TabParamList>; //there are no params that are sent to this screen
  ChatRoom: { otherUserData: UserType; chatId: string }; //this screen will receive a param named "otherUserData" of type UserType
  SelectAvatar: undefined; //there are no params that are sent to this screen
  PersonalDetails: undefined; //there are no params that are sent to this screen
  LookingTo: undefined; //there are no params that are sent to this screen
};

export type TabParamList = {
  Home: undefined;
  Chats: undefined;
  Connections: undefined;
};

//this is the type for the useRoute() in "Welcome" Screen
export type WelcomeScreenRouteProp = RouteProp<StackParamList, "Welcome">;

//this is the type for the useRoute() in "ChatRoom" Screen
export type ChatRoomScreenRouteProp = RouteProp<StackParamList, "ChatRoom">;

//this is the type for the useNavigation() in "ChatRoom" Screen
export type ChatRoomScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "ChatRoom"
>;

//this is the type for the useNavigation() in "LookingTo" Screen
export type LookingToScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "LookingTo"
>;

//this is the type for the useNavigation() in "SelectAvatar" Screen
export type SelectAvatarScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "SelectAvatar"
>;

//this is the type for the useNavigation() in "PhoneVerificationScreen" Screen
export type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "PhoneVerification"
>;

//this is the type for the useNavigation() in "PersonalDetailsScreen" Screen
export type PersonalDetailsScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "PersonalDetails"
>;

//this is the type for the useNavigation() in "Home" Screen
export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Home">,
  NativeStackNavigationProp<StackParamList>
>;

//this is the type for the useNavigation() in "Connections" Screen
export type ConnectionsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Connections">,
  NativeStackNavigationProp<StackParamList>
>;

//this is the type for the useNavigation() in "ChatsScreen" Screen
export type ChatsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Chats">,
  NativeStackNavigationProp<StackParamList>
>;

//this is the type for the useNavigation() in "Welcome" Screen
export type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Welcome"
>;

//this is the type for the useRoute() in "PhoneVerification" Screen
export type PhoneVerificationScreenRouteProp = RouteProp<
  StackParamList,
  "PhoneVerification"
>;

// type for useRoute in Connections screen
export type ConnectionsScreenTabRouteProp = RouteProp<
  TabParamList,
  "Connections"
>;

//this is the type for the useNavigation() in "Register" Screen
export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Register"
>;

//************************** knn data types **************************

export type knnDataItemType = {
  user_id: string;
  nickname: string;
  original_avatars: string[];
  small_avatar: string;
  gender: "man" | "woman" | "other";
  currently_connected: boolean;
  date_of_birth: string;
  biography: string;
  distance: number;
  connected: boolean;
  request_recipient: boolean;
  request_sender: boolean;
  unread: null | true | false;
  tags: string[];
};

export type knnDataType = knnDataItemType[] | null;

//************************** auth Context Types **************************

export const ACTIONS = {
  RESTORE_TOKEN: "RESTORE_TOKEN",
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  SIGN_OUT: "SIGN_OUT",
  RESET: "RESET",
  AVATAR_WAS_CHOSEN: "AVATAR_WAS_CHOSEN",
  BIO_WAS_CHOSEN: "BIO_WAS_CHOSEN",
  TAGS_WERE_CHOSEN: "TAGS_WERE_CHOSEN",
} as const;

export interface AuthState {
  isLoading: boolean;
  isSignOut: boolean;
  userToken: string | null;
  chosenAvatar: boolean;
  chosenBio: boolean;
  chosenTags: boolean;
  isAdmin: boolean;
  userId: string;
}

export type AuthAction =
  | { type: typeof ACTIONS.RESTORE_TOKEN; data: SignUpType }
  | { type: typeof ACTIONS.SIGN_IN; token: string }
  | { type: typeof ACTIONS.SIGN_OUT }
  | { type: typeof ACTIONS.SIGN_UP; data: SignUpType }
  | { type: typeof ACTIONS.AVATAR_WAS_CHOSEN }
  | { type: typeof ACTIONS.BIO_WAS_CHOSEN }
  | { type: typeof ACTIONS.TAGS_WERE_CHOSEN }
  | { type: typeof ACTIONS.RESET };

export type SignUpType = {
  userId: string;
  chosenAvatar: boolean;
  chosenBio: boolean;
  chosenTags: boolean;
  isAdmin: boolean;
  userToken: string;
};

//************************** connections list types **************************

export type ReceivedRequestsQueryResult = {
  userId: string;
  originalAvatar: string[];
  smallAvatar: string; // removed null since we filter these out
  nickname: string; // removed null since we filter these out
  currentlyConnected: boolean;
  socketId: string | null;
  unread: boolean;
  gender: "man" | "woman" | "other"; // removed null since we filter these out
  dateOfBirth: string | null;
  biography: string; // removed null since we filter these out
}[];

export type ConnectedUsersQueryResult = {
  userId: string;
  originalAvatar: string[];
  smallAvatar: string; // removed null since we filter these out
  nickname: string; // removed null since we filter these out
  currentlyConnected: boolean;
  gender: "man" | "woman" | "other"; // removed null since we filter these out
  dateOfBirth: string | null;
  biography: string; // removed null since we filter these out
}[];

export type SentRequestsQueryResult = {
  userId: string;
  originalAvatar: string[];
  smallAvatar: string; // removed null since we filter these out
  nickname: string; // removed null since we filter these out
  currentlyConnected: boolean;
  socketId: string | null;
  gender: "man" | "woman" | "other"; // removed null since we filter these out
  dateOfBirth: string | null;
  biography: string; // removed null since we filter these out
}[];

export type ConnectionsScreenUserType =
  | "connectionRequest"
  | "connectedUser"
  | "sentRequest";

export type ConnectionsScreenUser = {
  userType: ConnectionsScreenUserType;
  userId: string;
  originalAvatar: string[];
  smallAvatar: string;
  nickname: string;
  currentlyConnected: boolean;
  tags: string[];
  lastMessage?: {
    lastMessageText: string | null;
    unread: boolean;
    lastMessageSenderId: string | null;
  } | null;
  unread?: boolean;
  socketId?: string | null;
  gender: "man" | "woman" | "other";
  dateOfBirth: string | null;
  biography: string;
};

export type SeparatorItem = {
  isSeparator: true;
  title: string;
};

export type ConnectionsListItem = ConnectionsScreenUser | SeparatorItem;

export type ConnectionsListType = ConnectionsListItem[];

//the buttons that each type of user has:
export const connectionsUserActionsStates: Record<
  ConnectionsScreenUserType,
  string[]
> = {
  connectionRequest: ["accept", "decline"],
  connectedUser: ["chat"],
  sentRequest: ["cancel request"],
};
//************************** chats types **************************

export type MessageType = {
  messageId: string;
  sentDate: string;
  receivedDate: string | null;
  text: string | null;
  unread: boolean;
  //if the message is sent by the user, and then becomes read, that means that the other user read it
  //if the message is sent by the other user, and then becomes read, that means that the user read it
  //and so, when sending a message, it initially is unread, but should still look in the UI as a read sent message.
  //senderId will tell us who sent the message - the user or the other user
  senderId: string;
  gotToServer: boolean;
};

export type ChatType = {
  chatId: string;
  otherUser: UserType;
  unread: boolean;
  lastMessageDate: string | null;
  lastMessageSender: string | null;
  lastMessageType: string | null;
  lastMessageImageURL: string | null;
  lastMessageText: string | null;
  unreadCount: number;
};

export type UserType = {
  userId: string;
  nickname: string;
  smallAvatar: string;
  originalAvatar: string;
  biography: string;
};

export type ChatsType = ChatType[];

//************************** tabs types **************************

type IconName =
  | "home"
  | "home-outline"
  | "chat"
  | "chat-outline"
  | "people"
  | "people-outline";

export type Route = {
  key: string;
  title: string;
  focusedIcon: IconName;
  unfocusedIcon: IconName;
};
