import React, { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import Abc from "@mui/icons-material/Abc";
import LocationOn from "@mui/icons-material/LocationOn";
import GroupAdd from "@mui/icons-material/GroupAdd";

import participantApi from "@api/participantApi";
import conversationApi from "@api/conversationApi";
import { IUser } from "@interfaces/User";
import { useEvent } from "@contexts/EventContext";
import { useAuth } from "@contexts/AuthContext";
import { useConversation } from "@contexts/ConversationContext.tsx";
import { useSetConversations } from "@contexts/ConversationsContext";

import ConversationInfoGroup from "../ConversationInfoGroup";
import CreateGroupDialog from "./CreateGroupDialog";
import Avatar from "@components/Avatar";
import Prompt from "@components/Dialog/Prompt";
import Map from "@components/Map";

import "./GeneralInfo.css";
import { useHistory } from "react-router-dom";

interface GeneralInfoProps {}

function GeneralInfo(props: GeneralInfoProps) {
  const [isShareLocation, setIsShareLocation] = useState(false);
  const [openNicknamePrompt, setOpenNicknamePrompt] = useState(false);
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
  const [coordinate, setCoordinate] = useState<[number, number] | null>(null);

  const { user } = useAuth();
  const conversation = useConversation();
  const setConversations = useSetConversations();
  const socket = useEvent();
  const history = useHistory();

  useEffect(() => {
    setIsShareLocation(false);
    setOpenNicknamePrompt(false);
    setCoordinate(null);
    // eslint-disable-next-line
  }, [conversation.id]);

  useEffect(() => {
    if (!isShareLocation) {
      socket.emit("share_location", {
        action: "stop_sharing",
        conversationId: conversation.id,
      });
      return;
    }
    function handleShareLocation() {
      navigator.geolocation.getCurrentPosition((location) => {
        socket.emit("share_location", {
          action: "update_location",
          conversationId: conversation.id,
          coordinate: [location.coords.latitude, location.coords.longitude],
        });
      });
    }
    handleShareLocation();
    const interval = setInterval(handleShareLocation, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [conversation.id, isShareLocation, socket]);

  useEffect(() => {
    function handleShareLocation(dto: any) {
      if (dto.participant.user.username === user?.username) return;
      if (dto.action === "stop_sharing") {
        setCoordinate(null);
      } else {
        setCoordinate(dto.coordinate);
      }
    }
    socket.on("share_location", handleShareLocation);
    return () => {
      socket.off("share_location", handleShareLocation);
    };
  }, [socket, user?.username]);

  async function handleUpdateNickname(nickname: string) {
    try {
      const [participant] = conversation.participants.filter(
        (p) => p.user.username !== user?.username
      );
      await participantApi.updateParticipant(participant.id, { nickname });
      setOpenNicknamePrompt(false);
    } catch (e) {
      alert(e);
    }
  }

  async function handleCreateGroup(users: Array<IUser>) {
    const conversation = await conversationApi.createConversation(
      "group",
      users.map((u) => u.username)
    );
    conversation._type = "group";
    setConversations((cs) => [conversation, ...cs]);
    setOpenCreateGroupDialog(false);
    history.push("/messages/" + conversation.id);
  }

  if (!user) return null;
  if (conversation.type === "group") return null;
  const [participant] = conversation.participants.filter((p) => p.user.username !== user.username);
  if (!participant) return null;

  return (
    <ConversationInfoGroup className="GeneralInfo" name="General Info">
      <div className="GeneralInfo__User">
        <div className="GeneralInfo__User-Avatar">
          <Avatar user={participant.user} allowShowOptions />
        </div>

        <div className="GeneralInfo__User-Detail">
          <div className="GeneralInfo__User-Detail-Nickname">
            {participant.user.firstName} {participant.user.lastName}
          </div>
          <div className="GeneralInfo__User-Detail-Username">{participant.user.username}</div>
        </div>
      </div>

      <div className="GeneralInfo__Settings">
        <div className="GeneralInfo__Settings-Item" onClick={() => setOpenNicknamePrompt(true)}>
          <Abc style={{ transform: "scale(1.3)" }} />
          Change nickname
        </div>
        <div
          className="GeneralInfo__Settings-Item"
          onClick={() => setIsShareLocation(!isShareLocation)}
        >
          <LocationOn style={{ color: isShareLocation ? "var(--main-orange-1)" : undefined }} />
          {isShareLocation ? "Stop sharing" : "Share your location"}
        </div>
        <div className="GeneralInfo__Settings-Item" onClick={() => setOpenCreateGroupDialog(true)}>
          <GroupAdd />
          Create group with this user
        </div>
      </div>

      {coordinate && (
        <MapContainer
          center={coordinate}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "200px" }}
        >
          <Map coordinate={coordinate} />
        </MapContainer>
      )}

      <Prompt
        title="Đổi biệt danh"
        label={`Hãy đặt biệt danh cho ${participant.user.lastName}: `}
        placeholder="nickname"
        initialValue={participant.nickname}
        open={openNicknamePrompt}
        onClose={() => setOpenNicknamePrompt(false)}
        onSubmit={handleUpdateNickname}
      />

      <CreateGroupDialog
        open={openCreateGroupDialog}
        onClose={() => setOpenCreateGroupDialog(false)}
        onCreateGroup={handleCreateGroup}
      />
    </ConversationInfoGroup>
  );
}

export default GeneralInfo;
