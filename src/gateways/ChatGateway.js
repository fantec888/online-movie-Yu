/**
 * @file 聊天网关
 * @description 处理 Socket.IO 实时通信事件
 * 负责连接管理、房间加入、消息广播
 * @module ChatGateway
 */

const ChatService = require('../services/ChatService');

class ChatGateway {
    /**
     * 初始化聊天网关
     * @param {Server} io - Socket.IO 服务端实例
     */
    constructor(io) {
        // 1. 定义 Namespace 为 /chat
        this.io = io.of('/chat');
        this.initialize();
    }

    /**
     * 初始化事件监听
     */
    initialize() {
        this.io.on('connection', (socket) => {
            console.log(`[Socket] 新连接接入: ${socket.id}`);

            // ==================== 事件: 加入聊天频道 ====================
            socket.on('room:join', async (data, ack) => {
                try {
                    const { roomId, participantId } = data;

                    // 1. 调用业务层进行校验
                    const result = await ChatService.joinRoomChat(roomId, participantId);

                    // 2. Socket 加入房间频道
                    const channelName = `room:${roomId}`;
                    socket.join(channelName);

                    // 记录上下文
                    socket.data.roomId = roomId;
                    socket.data.participantId = participantId;

                    console.log(`[Socket] 用户 ${participantId} 加入频道 ${channelName}`);

                    // 3. 成功回调
                    if (ack) ack({ ok: true, data: { channel: channelName } });

                } catch (error) {
                    console.error('[Socket] 加入失败:', error.message);
                    if (ack) ack({
                        ok: false,
                        error: { message: error.message || '加入房间失败' }
                    });
                }
            });

            // ==================== 事件: 发送消息 ====================
            socket.on('message:send', async (data, ack) => {
                try {
                    const { roomId, participantId, content } = data;

                    // 1. 调用业务层构造标准消息对象
                    const messageDto = await ChatService.sendMessage(roomId, participantId, content);

                    // 2. 广播给房间内所有人
                    this.io.to(`room:${roomId}`).emit('message:new', messageDto);

                    console.log(`[Socket] 消息广播至 room:${roomId}: ${content}`);

                    // 3. 成功回调
                    if (ack) ack({
                        ok: true,
                        data: { messageId: messageDto.messageId, sentAt: messageDto.sentAt }
                    });

                } catch (error) {
                    console.error('[Socket] 发送消息失败:', error.message);
                    if (ack) ack({
                        ok: false,
                        error: { message: error.message || '发送消息失败' }
                    });
                }
            });

            // ==================== 事件: 断开连接 ====================
            socket.on('disconnect', () => {
                if (socket.data.roomId) {
                    console.log(`[Socket] 断开连接: ${socket.id} (Room: ${socket.data.roomId})`);
                }
            });
        });
    }
}

module.exports = ChatGateway;