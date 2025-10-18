import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  conversations: [],
  allConversations: null,

  setConversations: (data) => {
    const sorted = [...data]
      .filter((convo) => convo.is_group || convo.last_message_date !== null)
      .sort((a, b) => {
        if (a.last_message_date && b.last_message_date) {
          return new Date(b.last_message_date) - new Date(a.last_message_date);
        } else if (a.last_message_date) {
          return -1;
        } else if (b.last_message_date) {
          return 1;
        } else {
          return 0;
        }
      });

      set({ conversations: sorted, allConversations: sorted });
  },

  updateConversation: (message, authUserId) => {
    set((state) => {
      const updatedConvos = state.conversations.map((convo) => {

        const isPrivateMatch = message.conversation_id && !convo.is_group && convo.id === +message.conversation_id;
        const isGroupMatch = message.group_id && convo.is_group && convo.id === +message.group_id;
        
        if (isPrivateMatch) {
          return {
            ...convo,
            last_message: message.message,
            last_message_date: message.created_at,
          };
        }

        if (isGroupMatch) {
          return {
            ...convo,
            last_message: message.message,
            last_message_date: message.created_at,
          };
        }

        if(isPrivateMatch || isGroupMatch){
          if (
              "Notification" in window &&
              Notification.permission === "granted" &&
              message.sender_id !== authUserId
            ) {
              new Notification("New Message", {
                body: message.message ?? "Sent an Attachment",
              });

              const audio = new Audio("/notify.wav");
              audio
                .play()
                .catch((err) =>
                  console.warn("Unable to play notification sound:", err)
                );
            }
        }

        return convo;

      });

      const sorted = updatedConvos.sort((a, b) => {
        const dateA = new Date(a.last_message_date || 0);
        const dateB = new Date(b.last_message_date || 0);
        return dateB - dateA;
      });

      return { conversations: sorted };
    });
  },

  updateConversationOnDelete: (prevMessage) => {
    set((state) => {
      const updated = state.conversations.map((convo) => {
        const isPrivateMatch =
          prevMessage.conversation_id &&
          !convo.is_group &&
          convo.id === +prevMessage.conversation_id;

        const isGroupMatch =
          prevMessage.group_id &&
          convo.is_group &&
          convo.id === +prevMessage.group_id;

        if (isPrivateMatch || isGroupMatch) {
          return {
            ...convo,
            last_message: prevMessage.message,
            last_message_date: prevMessage.created_at,
          };
        }

        return convo;
      });

      const sorted = updated.sort((a, b) => {
        const dateA = new Date(a.last_message_date || 0);
        const dateB = new Date(b.last_message_date || 0);
        return dateB - dateA;
      });

      return { conversations: sorted };
    });
  },

  searchConversations: (query) => {
    const { allConversations } = get();

    if (!query) {
      set({ conversations: allConversations });
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = allConversations.filter((convo) => {
      const convoName = convo.is_group
        ? convo.name
        : convo.name;
      return convoName?.toLowerCase().includes(lowerQuery);
    });

    set({ conversations: filtered });
  },


}));
