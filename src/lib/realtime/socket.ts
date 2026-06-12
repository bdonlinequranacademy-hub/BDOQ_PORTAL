import type { Socket } from "socket.io-client";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";

let socket: Socket | null = null;
let connectPromise: Promise<Socket | null> | null = null;

export async function getRealtimeSocket(): Promise<Socket | null> {
  const token = useAuthStore.getState().token;
  if (!token) return null;

  if (socket?.connected) return socket;

  if (!connectPromise) {
    connectPromise = (async () => {
      const { io } = await import("socket.io-client");
      const instance = io(env.socketUrl, {
        path: "/socket.io",
        auth: { token },
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 8,
      });

      await new Promise<void>((resolve, reject) => {
        const onConnect = () => {
          cleanup();
          resolve();
        };
        const onError = (err: Error) => {
          cleanup();
          reject(err);
        };
        const cleanup = () => {
          instance.off("connect", onConnect);
          instance.off("connect_error", onError);
        };
        instance.on("connect", onConnect);
        instance.on("connect_error", onError);
      });

      socket = instance;
      connectPromise = null;
      return instance;
    })().catch((err) => {
      connectPromise = null;
      console.warn("[realtime] Socket connect failed:", err);
      return null;
    });
  }

  return connectPromise;
}

export function disconnectRealtimeSocket(): void {
  socket?.disconnect();
  socket = null;
  connectPromise = null;
}
