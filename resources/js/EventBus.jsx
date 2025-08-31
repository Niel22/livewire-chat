import React from "react";

export const EventBusContext = React.createContext();

export const EventBusProvider = ({ children }) => {
  const eventsRef = React.useRef({});

  const emit = React.useCallback((name, data) => {
    const callbacks = eventsRef.current[name];
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }, []);

  const on = React.useCallback((name, cb) => {
    if (!eventsRef.current[name]) {
      eventsRef.current[name] = [];
    }
    eventsRef.current[name].push(cb);

    return () => {
      eventsRef.current[name] = eventsRef.current[name].filter(
        (callback) => callback !== cb
      );
    };
  }, []);

  return (
    <EventBusContext.Provider value={{ emit, on }}>
      {children}
    </EventBusContext.Provider>
  );
};

export const useEventBus = () => {
  return React.useContext(EventBusContext);
};
