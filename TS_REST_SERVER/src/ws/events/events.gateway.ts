import {
    ServerAndEventStreamsHost,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
} from "@nestjs/websockets";

@WebSocketGateway(3001)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: ServerAndEventStreamsHost

    @SubscribeMessage('events')
    onEvent(client: any, data: any) {
        console.log(client, data)
        console.log(this.server)
        console.log(this.server.connection)
        console.log(this.server.disconnect)
        console.log(this.server.init)
        console.log(this.server.server)
        return { event: 'events', data: 'Websocket!! Hello World!'}
    }

    @SubscribeMessage("hello")
    world(client: any, data: any) {
        console.log("Wow~")
        this.server.server.emit("World")

        return "World"
    }

    afterInit (server: any) {
        console.log("Init", server)
    }
    handleConnection(client: any) {
        console.log("Connection")
        // console.log(client)
        client.emit('connection', "wow~")
    }

    handleDisconnect(client: any) {
        console.log("Disconnection")
        // console.log(client)
    }

    eventSubscription() {
        return new Promise((resolve, reject) => {
        })
    }
}