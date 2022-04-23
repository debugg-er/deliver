import React, { useRef } from "react";

import { useConversations, useSetConversations } from "@contexts/ConversationsContext";
import extractConversationsByType from "@utils/extractConversationsByType";

import ChatTabSkeleton from "../ChatTab/ChatTabSkeleton";
import SidebarGroup from "../SidebarGroup";
import ChatTab from "../ChatTab";

import "./FriendChats.css";
import userApi from "@api/userApi";

function FriendChatsSkeleton() {
  return (
    <>
      <ChatTabSkeleton />
      <ChatTabSkeleton />
      <ChatTabSkeleton />
      <ChatTabSkeleton />
      <ChatTabSkeleton />
      <ChatTabSkeleton />
      <ChatTabSkeleton />
    </>
  );
}

const step = 5;

function FriendChats() {
  const conversations = useConversations();
  const setConversations = useSetConversations();

  const { friends, groups, strangers } = extractConversationsByType(conversations);

  const hasMoreFriends = useRef(friends.length === step);
  const hasMoreGroups = useRef(groups.length === step);
  const hasMoreStrangers = useRef(strangers.length === step);

  async function handleLoadFriends() {
    const _friends = await userApi.getMeConversations("friend", {
      offset: friends.length,
      limit: step,
    });
    hasMoreFriends.current = _friends.length === step;
    setConversations((cs) => [...cs, ..._friends]);
  }

  async function handleLoadGroups() {
    const _groups = await userApi.getMeConversations("group", {
      offset: groups.length,
      limit: step,
    });
    hasMoreGroups.current = _groups.length === step;
    setConversations((cs) => [...cs, ..._groups]);
  }

  async function handleLoadStrangers() {
    const _strangers = await userApi.getMeConversations("stranger", {
      offset: strangers.length,
      limit: step,
    });
    hasMoreStrangers.current = _strangers.length === step;
    setConversations((cs) => [...cs, ..._strangers]);
  }

  if (!conversations.length) return <FriendChatsSkeleton />;

  return (
    <div className="ChatTabs">
      <SidebarGroup
        title="Bạn bè"
        expandByDefault
        hasMore={hasMoreFriends.current}
        onExpand={handleLoadFriends}
      >
        {friends.map((c) => (
          <ChatTab key={c.id} conversation={c} />
        ))}
      </SidebarGroup>

      <SidebarGroup
        title="Nhóm"
        expandByDefault
        hasMore={hasMoreGroups.current}
        onExpand={handleLoadGroups}
      >
        {groups.map((c) => (
          <ChatTab key={c.id} conversation={c} />
        ))}
      </SidebarGroup>

      <SidebarGroup
        title="Người lạ"
        expandByDefault
        hasMore={hasMoreStrangers.current}
        onExpand={handleLoadStrangers}
      >
        {strangers.map((c) => (
          <ChatTab key={c.id} conversation={c} />
        ))}
      </SidebarGroup>
    </div>
  );
}

export default FriendChats;
