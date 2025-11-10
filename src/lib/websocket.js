import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class WebSocketService {
    constructor() {
        this.client = null;
        this.sub = null;
        this.listeners = new Map();
        this.connectionAttempts = 0;
    }

    connect(roomId) {
        if (this.client?.active) {
            return;
        }

        this.connectionAttempts++;
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`),

            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectionTimeout: 15000,


            onConnect: (frame) => {
                this.connectionAttempts = 0;

                try {
                    this.sub = this.client.subscribe(`/topic/room/${roomId}`, (frame) => {
                        const msg = JSON.parse(frame.body);
                        this.handleMessage(msg);
                    });
                } catch (e) {
                    this.notifyError('Failed to join room. Please refresh.');
                }
            },

            onStompError: (frame) => {
                this.notifyError('Connection error. Please refresh and try again.');
            },

            onWebSocketError: (error) => {
                this.notifyError('Network connection failed. Check your internet.');
            },

            onWebSocketClose: (event) => {
                if (event.code === 1006) {
                    console.warn('⚠️ Abnormal closure - network issue or firewall');
                    this.notifyError('Connection lost. This might be due to your network or firewall.');
                } else if (event.code === 1008) {
                    console.error('❌ Policy violation');
                    this.notifyError('Connection blocked by security policy.');
                } else if (event.code === 1011) {
                    console.error('❌ Server error');
                    this.notifyError('Server error. Please try again.');
                }
            },

            onDisconnect: () => {
                if (isDev) console.log('🔌 Disconnected');
            },
        });

        try {
            this.client.activate();
        } catch (error) {
            this.notifyError('Failed to start connection. Please refresh.');
        }
    }

    handleMessage(message)
    {
        const {type, payload} = message || {};
        const handlers = this.listeners.get(type) || [];
        handlers.forEach((h) => h(payload));
    }

    subscribe(type, handler)
    {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(handler);
        return () => {
            const arr = this.listeners.get(type) || [];
            this.listeners.set(type, arr.filter((h) => h !== handler));
        };
    }

    send(destination, data)
    {
        if (this.client?.connected) {
            this.client.publish({
                destination,
                body: JSON.stringify(data),
            });
        } else {
        }
    }

    disconnect()
    {
        if (this.sub) this.sub.unsubscribe();

        if (this.client) this.client.deactivate();

        this.client = null;
        this.sub = null;
        this.listeners.clear();
        this.connectionAttempts = 0;
    }

    notifyError(message)
    {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('websocket-error', {
                detail: {message}
            }));
        }
    }
}
