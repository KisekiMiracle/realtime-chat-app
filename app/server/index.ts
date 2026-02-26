import { Elysia, t } from "elysia";
import { client } from "../api/[[...slugs]]/route";
import cors from "@elysiajs/cors";

interface Message {
  user_id: string;
  name: string;
  content?: string;
  messageID?: string;
  created_at: number;
  emoji?: string;
}

const app = new Elysia({ prefix: "chat" });
app.use(
  cors({
    origin: [process.env.BACKEND_URL!, process.env.NEXT_PUBLIC_WEBSOCKET_URL!],
  }),
);

// NOTE: CHAT ROUTES
app.ws("/:roomId", {
  params: t.Object({
    roomId: t.String(),
  }),
  body: t.Object({
    type: t.String(),
    user_id: t.String(),
    name: t.String(),
    content: t.Optional(t.String()),
    messageId: t.Optional(t.String()),
    emoji: t.Optional(t.String()),
  }),
  async open(ws) {
    const { roomId } = ws.data.params;

    // NOTE: Check if the room is public or private
    const isPrivate = (
      await client.query(
        /* sql */ `
        SELECT is_private FROM chatrooms
        WHERE id=$1
      `,
        [roomId],
      )
    ).rows[0];

    if (!isPrivate) {
      return { error: "We could not find that room id." };
    }

    if (!isPrivate.is_private) {
      // TODO: Manage users that are not part of this room
      ws.subscribe(roomId);
      console.log(`User joined room: ${roomId}`);
    }

    // NOTE: Fetching Chat History for this room
    const history = (
      await client.query(
        /* sql */ `
        SELECT * FROM messages
        INNER JOIN user_profile
        ON messages.user_id=user_profile.id
        WHERE messages.chatroom_id=$1;
      `,
        [roomId],
      )
    ).rows;

    ws.send({ type: "history", data: history });
  },
  async message(ws, body) {
    const { roomId } = ws.data.params;

    switch (body.type) {
      case "message": {
        const payload: Message = {
          ...body,
          created_at: Date.now(),
        };
        await client.query(
          /* sql */ `
            INSERT INTO messages (chatroom_id, user_id, content, created_at)
            VALUES ($1, $2, $3, $4)
          `,
          [roomId, body.user_id, body.content, new Date()],
        );
        ws.publish(roomId, { type: "message", data: payload });
        ws.send({ type: "message", data: payload });
        break;
      }
      case "typing": {
        ws.publish(roomId, {
          type: "typing",
          data: { userId: body.user_id, name: body.name },
        });
        break;
      }
      case "reaction": {
        ws.publish(roomId, {
          type: "reaction",
          data: {
            messageId: body.messageId,
            emoji: body.emoji,
            userId: body.user_id,
          },
        });
        break;
      }
      default: {
        ws.send({
          type: "error",
          data: { message: `Unknown event type: ${body.type}` },
        });
      }
    }
  },
  close(ws) {
    const { roomId } = ws.data.params;
    ws.unsubscribe(roomId);
    console.log(`User left room: ${roomId}`);
  },
});

// NOTE: NOTIFICATION ROUTES
app.listen(3001);
console.log("Elysia WS server running on port 3001");
export type App = typeof app;
