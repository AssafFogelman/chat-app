import { io } from "../..";
import {
  MessageType,
  SendMessageResponseType,
  TilkEventType,
} from "../../../../types/types";
import { and, eq } from "drizzle-orm";
import { chatMessages, users } from "../../drizzle/schema";
import { db } from "../../drizzle/db";
import { sendMessage } from "./send-message";

export async function sendEvent({
  message,
  otherUserId,
  eventType,
}: {
  message: MessageType;
  otherUserId: string;
  eventType: keyof typeof TilkEventType;
}) {
  try {
    switch (eventType) {
      case TilkEventType.MESSAGE:
        sendMessage(message, otherUserId);
        break;
    }
  } catch (error) {
    console.log("error sending event:", error);
  }
}
