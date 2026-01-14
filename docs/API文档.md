# 在线观影室后端API接口文档

## 概述

本文档描述了在线观影室（Social Cinema）房间管理模块的RESTful API接口规范。

### 基本信息

- **Base URL**: `http://localhost:3000/api`
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 请求头说明

所有请求需要设置以下请求头：

| Header | Value | 必填 | 说明 |
|--------|-------|------|------|
| Content-Type | application/json | 是 | 请求体格式 |

### 响应格式

所有API响应遵循统一的JSON格式：

#### 成功响应

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

#### 错误响应

```json
{
  "success": false,
  "code": 400,
  "message": "错误描述",
  "errorCode": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

### 错误码说明

| HTTP状态码 | 错误码 | 说明 |
|------------|--------|------|
| 400 | BAD_REQUEST | 请求参数错误 |
| 400 | VALIDATION_ERROR | 参数验证失败 |
| 401 | UNAUTHORIZED | 未授权访问 |
| 401 | INVALID_PASSWORD | 房间密码错误 |
| 403 | PERMISSION_DENIED | 权限不足 |
| 404 | NOT_FOUND | 资源不存在 |
| 404 | ROOM_NOT_FOUND | 房间不存在 |
| 409 | CONFLICT | 资源冲突 |
| 409 | ROOM_FULL | 房间已满 |
| 410 | ROOM_CLOSED | 房间已关闭 |
| 500 | INTERNAL_SERVER_ERROR | 服务器内部错误 |

---

## API接口列表

### 1. 创建房间

创建一个新的线上观影室。

**请求**

```
POST /api/rooms
```

**请求头**

| Header | Value |
|--------|-------|
| Content-Type | application/json |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 房间名称，1-50字符 |
| capacity | number | 否 | 人数上限，2-100，默认10 |
| password | string | 否 | 房间密码，最长20字符 |
| announcement | string | 否 | 房间公告，最长500字符 |
| creatorNickname | string | 是 | 创建者昵称 |

**请求示例**

```json
{
  "name": "周末观影派对",
  "capacity": 20,
  "password": "123456",
  "announcement": "欢迎来到我的观影室！",
  "creatorNickname": "房主小明"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 201,
  "message": "房间创建成功",
  "data": {
    "room": {
      "id": "123456",
      "name": "周末观影派对",
      "capacity": 20,
      "currentCount": 1,
      "hasPassword": true,
      "announcement": "欢迎来到我的观影室！",
      "status": "waiting",
      "videoState": {
        "source": null,
        "status": "paused",
        "progress": 0,
        "playbackRate": 1,
        "subtitle": null,
        "lastUpdateTime": 1736762400000,
        "currentProgress": 0
      },
      "participants": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "nickname": "房主小明",
          "role": "creator",
          "status": "online",
          "joinTime": "2026-01-13T10:00:00.000Z"
        }
      ],
      "creatorId": "550e8400-e29b-41d4-a716-446655440000",
      "createTime": "2026-01-13T10:00:00.000Z",
      "updateTime": "2026-01-13T10:00:00.000Z"
    },
    "creator": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nickname": "房主小明",
      "role": "creator"
    }
  },
  "timestamp": "2026-01-13T10:00:00.000Z"
}
```

**前端调用示例 (JavaScript/Axios)**

```javascript
import axios from 'axios';

const createRoom = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/rooms', {
      name: '周末观影派对',
      capacity: 20,
      password: '123456',
      announcement: '欢迎来到我的观影室！',
      creatorNickname: '房主小明'
    });
    
    if (response.data.success) {
      const { room, creator } = response.data.data;
      // 保存creator信息到本地存储，后续操作需要用到
      localStorage.setItem('userId', creator.id);
      localStorage.setItem('currentRoomId', room.id);
      console.log('房间创建成功，房间号:', room.id);
    }
  } catch (error) {
    console.error('创建房间失败:', error.response?.data?.message);
  }
};
```

---

### 2. 获取房间列表

获取所有可用房间的列表，支持分页和搜索。

**请求**

```
GET /api/rooms
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 否 | 搜索关键词，匹配房间名称或房间号 |
| status | string | 否 | 房间状态过滤：waiting, playing |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**请求示例**

```
GET /api/rooms?keyword=观影&status=waiting&page=1&pageSize=10
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "获取房间列表成功",
  "data": {
    "list": [
      {
        "id": "123456",
        "name": "周末观影派对",
        "capacity": 20,
        "currentCount": 5,
        "hasPassword": true,
        "status": "waiting",
        "creatorNickname": "房主小明",
        "createTime": "2026-01-13T10:00:00.000Z"
      },
      {
        "id": "789012",
        "name": "午夜电影院",
        "capacity": 10,
        "currentCount": 3,
        "hasPassword": false,
        "status": "waiting",
        "creatorNickname": "影迷小李",
        "createTime": "2026-01-13T09:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 2,
      "totalPages": 1
    }
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**前端调用示例**

```javascript
import axios from 'axios';

const getRoomList = async (keyword = '', page = 1) => {
  try {
    const response = await axios.get('http://localhost:3000/api/rooms', {
      params: {
        keyword,
        page,
        pageSize: 10
      }
    });
    
    if (response.data.success) {
      const { list, pagination } = response.data.data;
      console.log('房间列表:', list);
      console.log('分页信息:', pagination);
      return response.data.data;
    }
  } catch (error) {
    console.error('获取房间列表失败:', error.response?.data?.message);
  }
};
```

---

### 3. 获取房间详情

获取指定房间的详细信息。

**请求**

```
GET /api/rooms/:roomId
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID（6位数字） |

**请求示例**

```
GET /api/rooms/123456
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "获取房间详情成功",
  "data": {
    "id": "123456",
    "name": "周末观影派对",
    "capacity": 20,
    "currentCount": 5,
    "hasPassword": true,
    "announcement": "欢迎来到我的观影室！",
    "status": "waiting",
    "videoState": {
      "source": null,
      "status": "paused",
      "progress": 0,
      "playbackRate": 1,
      "subtitle": null,
      "lastUpdateTime": 1736762400000,
      "currentProgress": 0
    },
    "participants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nickname": "房主小明",
        "role": "creator",
        "status": "online",
        "joinTime": "2026-01-13T10:00:00.000Z"
      }
    ],
    "creatorId": "550e8400-e29b-41d4-a716-446655440000",
    "createTime": "2026-01-13T10:00:00.000Z",
    "updateTime": "2026-01-13T10:00:00.000Z"
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**前端调用示例**

```javascript
const getRoomDetail = async (roomId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/rooms/${roomId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    if (error.response?.data?.errorCode === 'ROOM_NOT_FOUND') {
      console.error('房间不存在');
    } else {
      console.error('获取房间详情失败:', error.response?.data?.message);
    }
  }
};
```

---

### 4. 验证房间密码

验证房间密码是否正确（用于加入有密码的房间前的预检查）。

**请求**

```
POST /api/rooms/:roomId/verify-password
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 待验证的密码 |

**请求示例**

```json
{
  "password": "123456"
}
```

**响应示例（成功）**

```json
{
  "success": true,
  "code": 200,
  "message": "密码验证成功",
  "data": {
    "valid": true
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**响应示例（失败）**

```json
{
  "success": false,
  "code": 401,
  "message": "房间密码错误",
  "errorCode": "INVALID_PASSWORD",
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**前端调用示例**

```javascript
const verifyPassword = async (roomId, password) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/rooms/${roomId}/verify-password`,
      { password }
    );
    
    return response.data.success;
  } catch (error) {
    if (error.response?.data?.errorCode === 'INVALID_PASSWORD') {
      alert('密码错误，请重新输入');
    }
    return false;
  }
};
```

---

### 5. 加入房间

加入指定的房间。

**请求**

```
POST /api/rooms/:roomId/join
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 是 | 用户昵称 |
| password | string | 否 | 房间密码（如果房间设置了密码） |

**请求示例**

```json
{
  "nickname": "观影小王",
  "password": "123456"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "加入房间成功",
  "data": {
    "room": {
      "id": "123456",
      "name": "周末观影派对",
      "capacity": 20,
      "currentCount": 6,
      "hasPassword": true,
      "announcement": "欢迎来到我的观影室！",
      "status": "waiting",
      "videoState": { ... },
      "participants": [ ... ],
      "creatorId": "550e8400-e29b-41d4-a716-446655440000",
      "createTime": "2026-01-13T10:00:00.000Z",
      "updateTime": "2026-01-13T10:30:00.000Z"
    },
    "participant": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "nickname": "观影小王",
      "role": "viewer",
      "status": "online",
      "joinTime": "2026-01-13T10:30:00.000Z"
    }
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**前端调用示例**

```javascript
const joinRoom = async (roomId, nickname, password = '') => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/rooms/${roomId}/join`,
      { nickname, password }
    );
    
    if (response.data.success) {
      const { room, participant } = response.data.data;
      // 保存用户信息
      localStorage.setItem('userId', participant.id);
      localStorage.setItem('currentRoomId', room.id);
      console.log('加入房间成功');
      return response.data.data;
    }
  } catch (error) {
    const errorCode = error.response?.data?.errorCode;
    switch (errorCode) {
      case 'ROOM_NOT_FOUND':
        alert('房间不存在');
        break;
      case 'ROOM_FULL':
        alert('房间已满');
        break;
      case 'INVALID_PASSWORD':
        alert('密码错误');
        break;
      case 'ROOM_CLOSED':
        alert('房间已关闭');
        break;
      default:
        alert('加入房间失败');
    }
  }
};
```

---

### 6. 退出房间

退出当前所在的房间。

**请求**

```
POST /api/rooms/:roomId/leave
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| participantId | string | 是 | 参与者ID（加入房间时返回的ID） |

**请求示例**

```json
{
  "participantId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "退出房间成功",
  "data": null,
  "timestamp": "2026-01-13T11:00:00.000Z"
}
```

**前端调用示例**

```javascript
const leaveRoom = async () => {
  const roomId = localStorage.getItem('currentRoomId');
  const participantId = localStorage.getItem('userId');
  
  try {
    const response = await axios.post(
      `http://localhost:3000/api/rooms/${roomId}/leave`,
      { participantId }
    );
    
    if (response.data.success) {
      localStorage.removeItem('currentRoomId');
      console.log('已退出房间');
    }
  } catch (error) {
    console.error('退出房间失败:', error.response?.data?.message);
  }
};
```

---

### 7. 解散房间

解散房间（仅房间创建者可操作）。

**请求**

```
DELETE /api/rooms/:roomId
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| operatorId | string | 是 | 操作者ID（必须是房间创建者） |

**请求示例**

```json
{
  "operatorId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "房间已解散",
  "data": null,
  "timestamp": "2026-01-13T12:00:00.000Z"
}
```

**前端调用示例**

```javascript
const dissolveRoom = async () => {
  const roomId = localStorage.getItem('currentRoomId');
  const operatorId = localStorage.getItem('userId');
  
  // 先确认
  if (!confirm('确定要解散房间吗？此操作不可恢复！')) {
    return;
  }
  
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/rooms/${roomId}`,
      { data: { operatorId } }
    );
    
    if (response.data.success) {
      localStorage.removeItem('currentRoomId');
      alert('房间已解散');
      // 跳转到房间列表页
      window.location.href = '/rooms';
    }
  } catch (error) {
    if (error.response?.data?.errorCode === 'PERMISSION_DENIED') {
      alert('只有房间创建者才能解散房间');
    } else {
      alert('解散房间失败');
    }
  }
};
```

---

### 8. 更新房间配置

更新房间配置（仅房间创建者可操作）。

**请求**

```
PATCH /api/rooms/:roomId
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID |

**请求体参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| operatorId | string | 是 | 操作者ID（必须是房间创建者） |
| name | string | 否 | 新的房间名称 |
| capacity | number | 否 | 新的人数上限 |
| password | string | 否 | 新的密码（空字符串表示取消密码） |
| announcement | string | 否 | 新的公告 |

**请求示例**

```json
{
  "operatorId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "周末观影派对 - 新名称",
  "announcement": "今天我们看《星际穿越》！"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "房间配置更新成功",
  "data": {
    "id": "123456",
    "name": "周末观影派对 - 新名称",
    "capacity": 20,
    "currentCount": 5,
    "hasPassword": true,
    "announcement": "今天我们看《星际穿越》！",
    "status": "waiting",
    ...
  },
  "timestamp": "2026-01-13T11:00:00.000Z"
}
```

**前端调用示例**

```javascript
const updateRoom = async (updateData) => {
  const roomId = localStorage.getItem('currentRoomId');
  const operatorId = localStorage.getItem('userId');
  
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/rooms/${roomId}`,
      { operatorId, ...updateData }
    );
    
    if (response.data.success) {
      console.log('房间配置更新成功');
      return response.data.data;
    }
  } catch (error) {
    if (error.response?.data?.errorCode === 'PERMISSION_DENIED') {
      alert('只有房间创建者才能修改配置');
    } else {
      alert('更新配置失败');
    }
  }
};

// 使用示例
updateRoom({
  name: '新的房间名称',
  announcement: '新的公告内容'
});
```

---

### 9. 获取房间统计信息

获取当前系统的房间统计数据。

**请求**

```
GET /api/rooms/stats
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "获取统计信息成功",
  "data": {
    "totalRooms": 10,
    "totalParticipants": 45,
    "waitingRooms": 6,
    "playingRooms": 4
  },
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

**前端调用示例**

```javascript
const getRoomStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/rooms/stats');
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('获取统计信息失败');
  }
};
```

---

## 前端集成指南

### 1. 安装依赖

```bash
npm install axios
```

### 2. 创建API服务封装

建议创建一个统一的API服务文件：

```javascript
// src/api/roomApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorData = error.response?.data;
    console.error('API Error:', errorData?.message || error.message);
    return Promise.reject(error);
  }
);

// 房间相关API
export const roomApi = {
  // 获取房间列表
  getList: (params) => apiClient.get('/rooms', { params }),
  
  // 获取房间详情
  getDetail: (roomId) => apiClient.get(`/rooms/${roomId}`),
  
  // 创建房间
  create: (data) => apiClient.post('/rooms', data),
  
  // 加入房间
  join: (roomId, data) => apiClient.post(`/rooms/${roomId}/join`, data),
  
  // 退出房间
  leave: (roomId, participantId) => 
    apiClient.post(`/rooms/${roomId}/leave`, { participantId }),
  
  // 解散房间
  dissolve: (roomId, operatorId) => 
    apiClient.delete(`/rooms/${roomId}`, { data: { operatorId } }),
  
  // 更新房间
  update: (roomId, data) => apiClient.patch(`/rooms/${roomId}`, data),
  
  // 验证密码
  verifyPassword: (roomId, password) => 
    apiClient.post(`/rooms/${roomId}/verify-password`, { password }),
  
  // 获取统计信息
  getStats: () => apiClient.get('/rooms/stats')
};

export default roomApi;
```

### 3. 在Vue组件中使用

```vue
<template>
  <div class="room-list">
    <div v-for="room in rooms" :key="room.id" class="room-item">
      <h3>{{ room.name }}</h3>
      <p>房间号: {{ room.id }}</p>
      <p>人数: {{ room.currentCount }}/{{ room.capacity }}</p>
      <p v-if="room.hasPassword">🔒 需要密码</p>
      <button @click="handleJoin(room)">加入房间</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import roomApi from '@/api/roomApi';

export default {
  setup() {
    const rooms = ref([]);
    
    const loadRooms = async () => {
      try {
        const response = await roomApi.getList({ page: 1, pageSize: 20 });
        rooms.value = response.data.data.list;
      } catch (error) {
        console.error('加载房间列表失败');
      }
    };
    
    const handleJoin = async (room) => {
      const nickname = prompt('请输入您的昵称:');
      if (!nickname) return;
      
      let password = '';
      if (room.hasPassword) {
        password = prompt('请输入房间密码:');
        if (!password) return;
      }
      
      try {
        const response = await roomApi.join(room.id, { nickname, password });
        const { participant } = response.data.data;
        localStorage.setItem('userId', participant.id);
        localStorage.setItem('currentRoomId', room.id);
        // 跳转到房间页面
        window.location.href = `/room/${room.id}`;
      } catch (error) {
        alert(error.response?.data?.message || '加入房间失败');
      }
    };
    
    onMounted(loadRooms);
    
    return { rooms, handleJoin };
  }
};
</script>
```

---

## 附录

### A. 数据模型

#### Room（房间）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 房间ID（6位数字） |
| name | string | 房间名称 |
| capacity | number | 人数上限 |
| currentCount | number | 当前人数 |
| hasPassword | boolean | 是否有密码 |
| announcement | string | 房间公告 |
| status | string | 房间状态（waiting/playing/closed） |
| videoState | VideoState | 视频状态 |
| participants | Participant[] | 参与者列表 |
| creatorId | string | 创建者ID |
| createTime | string | 创建时间（ISO8601） |
| updateTime | string | 更新时间（ISO8601） |

#### VideoState（视频状态）

| 字段 | 类型 | 说明 |
|------|------|------|
| source | string | 视频源URL |
| status | string | 播放状态（playing/paused/stopped） |
| progress | number | 播放进度（秒） |
| playbackRate | number | 播放倍速 |
| subtitle | string | 字幕设置 |
| lastUpdateTime | number | 最后更新时间戳 |
| currentProgress | number | 当前计算进度 |

#### Participant（参与者）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 参与者ID |
| nickname | string | 昵称 |
| role | string | 角色（creator/viewer） |
| status | string | 状态（online/offline） |
| joinTime | string | 加入时间（ISO8601） |

### B. 常见问题

**Q: 如何处理房间密码？**
A: 加入有密码的房间时，需要在请求体中传递password字段。可以先调用验证密码接口进行预检查。

**Q: 如何判断当前用户是否是房间创建者？**
A: 比较localStorage中保存的userId与房间详情中的creatorId是否一致。

**Q: 服务重启后数据会丢失吗？**
A: 是的，当前版本使用内存存储，服务重启后数据会丢失。后续版本会添加持久化存储。
