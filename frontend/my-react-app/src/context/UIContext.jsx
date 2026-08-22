import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [statusGroup, setStatusGroup] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(null);
  const [active, setActive] = useState("feed");

  const openPost = (post) => setSelectedPostId(post._id);
  const closePost = () => setSelectedPostId(null);

  const openStatusGroup = (group) => setStatusGroup(group);
  const closeStatusGroup = () => setStatusGroup(null);

  const openProfile = (userId) => {
    setViewedUserId(userId);
    setActive("profile");
  };

  const goTo = (key) => {
    if (key === "profile") setViewedUserId(null);
    setActive(key);
  };

  return (
    <UIContext.Provider
      value={{
        selectedPostId,
        statusGroup,
        viewedUserId,
        active,
        openPost,
        closePost,
        openStatusGroup,
        closeStatusGroup,
        openProfile,
        goTo,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);