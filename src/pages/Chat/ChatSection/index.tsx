import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Phone from "@mui/icons-material/Phone";

import { MessagesProvider } from "@contexts/MessagesContext";
import { useConversation } from "@contexts/ConversationContext.tsx";
import { useSetLoading } from "@contexts/LoadingContext";
import { useEvent } from "@contexts/EventContext";
import { useSetConversations } from "@contexts/ConversationsContext";
import { useAuth } from "@contexts/AuthContext";
import { IMessage, IMessageWithAction } from "@interfaces/Message";
import { IParticipant } from "@interfaces/Participant";
import conversationApi from "@api/conversationApi";
import { FileUploadHandler } from "@api/fileApi";
import getConversationName from "@utils/getConversationTitle";

import Avatar from "@components/Avatar";
import Messages from "@components/Messages";
import ChatInput from "../ChatInput";

import "./ChatSection.css";

interface ChatSectionProps {
  showInfo: boolean;
  onShowInfoChange: (showInfo: boolean) => void;
}

const step = 30;

function ChatSection({ onShowInfoChange, showInfo }: ChatSectionProps) {
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const messagesRef = React.createRef<HTMLDivElement>();

  const { user } = useAuth();
  const conversation = useConversation();
  const socket = useEvent();
  const setConversations = useSetConversations();
  const setLoading = useSetLoading();

  useEffect(() => {
    setLoading(true);
    conversationApi
      .getConversationMessages(conversation.id, { offset: 0, limit: step })
      .then((_messages) => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
        setMessages(_messages);
      })
      .finally(() => setLoading(false));

    return () => {
      setMessages([]);
    };
    // eslint-disable-next-line
  }, [conversation.id, setLoading]);

  useEffect(() => {
    if (!conversation) return;

    setConversations((cs) => {
      const c = cs.find((c) => c.id === conversation.id);
      if (!c) return cs;
      c.seen = true;
      c.delivered = true;
      c.messageAhead = 0;
      return [...cs];
    });
  }, [conversation, setConversations]);

  useEffect(() => {
    function handleBroadcast(message: IMessage) {
      if (message.participant.user.username === user?.username) return;
      const isThisConv = message.participant.conversation.id === conversation.id;
      isThisConv && setMessages((ms) => [message, ...ms]);
    }

    socket.on("message", handleBroadcast);
    return () => {
      socket.off("message", handleBroadcast);
    };
  }, [socket, setConversations, conversation.id, user?.username]);

  async function handleSendMessage(text: string, attachments: Array<FileUploadHandler>) {
    if (!conversation) return;
    const sendingMessage: IMessageWithAction = {
      id: Math.random().toString(),
      createdAt: new Date(),
      content: text,
      revokedAt: null,
      parent: null,
      participantId: 0,
      participant: conversation.participants.find(
        (p) => p.user.username === user?.username
      ) as IParticipant,
      replies: [],
      seenParticipants: [],
      deliveredParticipants: [],
      reactions: [],
      reactionCount: 0,
      action: "create",
      attachments: [],
      type: null,
      payload: { text, attachments },
    };
    setMessages((ms) => [sendingMessage, ...ms]);
  }

  async function loadMessages() {
    const _messages = await conversationApi.getConversationMessages(conversation.id, {
      offset: messages.length,
      limit: step,
    });
    setMessages((ms) => [...ms, ..._messages]);
  }

  if (!user) return null;

  const participants = conversation.participants.filter(
    (p) => p.user.username !== user.username || conversation.type === "group"
  );

  return (
    <div className="ChatSection">
      <div className="ChatSection__Header">
        <div className="ChatSection__Header-Avatar">
          <Avatar user={participants.map((p) => p.user)} size={36} />
        </div>
        <div className="ChatSection__Header-Info" style={{ flexGrow: 1 }}>
          <div className="ChatSection__Header-Info-Title Global__LineLimit-1">
            {getConversationName(conversation, user?.username)}
          </div>
          <div className="ChatSection__Header-Info-More">
            {conversation.type === "personal" &&
              !user.friends.some((f) => f.username === participants[0].user.username) && (
                <div className="ChatSection__Header-Info-More-Stranger">Người lạ</div>
              )}
            {conversation.type === "personal"
              ? participants[0].user.isActive
                ? "Đang hoạt động"
                : "Ngoại tuyến"
              : participants.length + " Thành viên"}
          </div>
        </div>
        <div className="ChatSection--Header-Expand">
          <Phone style={{ marginRight: 12 }} />

          {showInfo && <ArrowForwardIos onClick={() => onShowInfoChange(false)} />}
          {!showInfo && <ArrowBackIos onClick={() => onShowInfoChange(true)} />}
        </div>
      </div>

      {/* <div className="ChatSection__Messages"> */}
      {/*   <Messages messages={messages} /> */}
      {/* </div> */}

      <div ref={messagesRef} id="ChatSection__Messages" className="ChatSection__Messages">
        <InfiniteScroll
          inverse={true}
          dataLength={messages.length}
          next={loadMessages}
          hasMore={true}
          scrollableTarget="ChatSection__Messages"
          loader={null}
          scrollThreshold="300px"
        >
          <MessagesProvider messages={messages} setMessages={setMessages}>
            <Messages messages={messages} />
          </MessagesProvider>
        </InfiniteScroll>
      </div>

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatSection;
