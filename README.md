src/
├── app.js            # 入口文件 (集成 Socket.IO)
├── gateways/         # [新增] 网关层，处理 WebSocket 事件
│   └── ChatGateway.js
├── services/         # 业务逻辑层
│   ├── ChatService.js
│   └── RoomService.js
└── ...
