/**
 * @file 聊天业务服务
 * @description 处理聊天相关的业务逻辑，如权限校验、消息构造等
 * @module ChatService
 */

const RoomService = require('./RoomService');

class ChatService {
    /**
     * 加入聊天频道前的业务校验
     * @param {string} roomId 房间ID
     * @param {string} participantId 参与者ID
     * @returns {object} 校验通过后的相关信息
     */
    async joinRoomChat(roomId, participantId) {
        // 1. 获取房间实例 (使用单例模式获取)
        const roomService = RoomService.getInstance();
        const room = roomService.findById(roomId);

        // 校验房间是否存在
        if (!room) {
            throw new Error('ROOM_NOT_FOUND');
        }

        // 2. 校验参与者是否属于该房间 (强绑定规则)
        const participant = room.getParticipant(participantId);
        if (!participant) {
            throw new Error('NOT_IN_ROOM'); // 对应文档错误码
        }

        // 返回信息用于日志
        return {
            roomName: room.name,
            nickname: participant.nickname
        };
    }

    /**
     * 发送消息的业务处理
     * @param {string} roomId 房间ID
     * @param {string} participantId 发送者ID
     * @param {string} content 消息内容
     * @returns {object} 构造好的标准消息对象
     */
    async sendMessage(roomId, participantId, content) {
        // 1. 基础参数校验
        if (!content || typeof content !== 'string') {
            throw new Error('VALIDATION_ERROR: 消息内容无效');
        }

        const trimmedContent = content.trim();
        if (trimmedContent.length === 0) {
            throw new Error('VALIDATION_ERROR: 消息不能为空');
        }

        if (trimmedContent.length > 200) {
            throw new Error('VALIDATION_ERROR: 消息过长 (限200字)');
        }

        // 2. 房间与权限校验
        const roomService = RoomService.getInstance();
        const room = roomService.findById(roomId);

        if (!room) throw new Error('ROOM_NOT_FOUND');

        // 检查房间是否已关闭
        if (room.status === 'closed') {
            throw new Error('ROOM_CLOSED');
        }

        // 检查发送者是否在房间内
        const participant = room.getParticipant(participantId);
        if (!participant) {
            throw new Error('NOT_IN_ROOM');
        }

        // 3. 构造消息 DTO (Data Transfer Object)
        // 服务端生成 ID 和 时间戳，保证数据可信度
        const messageDto = {
            messageId: Date.now().toString() + Math.random().toString(36).substr(2, 5), // 简易唯一ID
            roomId: roomId,
            from: {
                participantId: participant.id,
                nickname: participant.nickname,
                role: participant.role
            },
            content: trimmedContent,
            sentAt: new Date().toISOString()
        };

        return messageDto;
    }
}

// 导出单例实例
module.exports = new ChatService();