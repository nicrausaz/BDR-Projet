import {IO, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import jwt from "jsonwebtoken";
import DB from "../db/DB";
import Administrator from "../models/Administrator";

@SocketService()
export class MySocketService {

  constructor(@IO public io: SocketIO.Server) {
    io.use(async (socket, next) => {
      const token = socket?.handshake?.query?.token;
      if (!token) {
        socket.disconnect(true);
        return next(new Error());
      }
      const jwtPayload: any = jwt.verify(token, "secret");
      if (!jwtPayload?.uid) {
        socket.disconnect(true);
        return next(new Error());
      }
      const user = (await DB.query(
        `SELECT *
         FROM administrator
         WHERE uid = $1
         LIMIT 1`, [jwtPayload.uid]))
        .rows.map(r => Administrator.hydrate<Administrator>(r))[0];
      if (!user) {
        socket.disconnect(true);
        return next(new Error());
      }
      return next();
    });
  }

  /**
   * Triggered the namespace is created
   */
  $onNamespaceInit(nsp: SocketIO.Namespace) {

  }

  /**
   * Triggered when a new client connects to the Namespace.
   */
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {

  }

  /**
   * Triggered when a client disconnects from the Namespace.
   */




  $onDisconnect(@Socket socket: SocketIO.Socket) {

  }

}
