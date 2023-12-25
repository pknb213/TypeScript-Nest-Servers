import {
    ServerAndEventStreamsHost,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    ConnectedSocket,
    MessageBody,
} from "@nestjs/websockets";
// import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import * as WebSocket from "ws";


// @WebSocketGateway(3001)
@WebSocketGateway(3001, {
    cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: WebSocket.Server

    // @WebSocketServer()
    // server: Server  # Only Socket.io

    @SubscribeMessage('events')
    onEvent(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ) {
        // console.log(client, data)
        console.log("Data:", data)
        return { event: 'events', data: 'Websocket!! Hello World!'}
    }

    @SubscribeMessage("hello")
    world(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ) {
        console.log("Wow~ Data:", data)
        this.server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("events")
            }
        })
        // this.server.emit("events", "Emit Test~") # Only Socket.io
        return "World"
    }

    afterInit (server: any) {
        console.log("Init Websocket", server.clients)
    }
    handleConnection(client: Socket) {
        console.log("Connection")
        // console.log(client)
        client.emit('hello', "wow~")
    }

    handleDisconnect(client: Socket) {
        console.log("Disconnection")
        // console.log(client)
    }

    eventSubscription() {
        return new Promise((resolve, reject) => {
            console.log("삥구 삥구")
        })
    }
}